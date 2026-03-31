import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';

env.allowLocalModels = false;
env.allowRemoteModels = true;

let plateSession = null;

let batchImages = [];
let currentIndex = 0;
let batchState = {};
let amgOverlayImage = null;
let redactionMode = 'blur';

function saveSessionState() {
  const state = {
    shapes,
    selectedId,
    imageName
  };
  localStorage.setItem('plateBlurSession', JSON.stringify(state));
}

function restoreSessionState() {
  const raw = localStorage.getItem('plateBlurSession');

  // Default: clear shapes first
  shapes = [];
  selectedId = null;

  if (!raw) return;

  try {
    const state = JSON.parse(raw);

    // Only restore if same image
    if (state.imageName !== imageName) return;

    shapes = Array.isArray(state.shapes) ? state.shapes : [];
    selectedId = state.selectedId || null;

  } catch (err) {
    console.error('Could not restore session state', err);
  }
}

function ensureAmgOverlayImage() {
  if (amgOverlayImage) return amgOverlayImage;

  amgOverlayImage = new Image();
  amgOverlayImage.src = 'assets/amg-overlay.png';

  return amgOverlayImage;
}


const els = {
  input: document.getElementById('photoInput'),
  autoDetect: document.getElementById('autoDetectBtn'),
  autoDetectAll: document.getElementById('autoDetectAllBtn'),
  addBox: document.getElementById('addBoxBtn'),
  clearBoxes: document.getElementById('clearBoxesBtn'),
  deleteBox: document.getElementById('deleteBoxBtn'),
  save: document.getElementById('saveBtn'),
  saveAll: document.getElementById('saveAllBtn'),  
  prev: document.getElementById('prevBtn'),
  next: document.getElementById('nextBtn'),
  removePhoto: document.getElementById('removePhotoBtn'),
  status: document.getElementById('status'),
  blurSlider: document.getElementById('blurSlider'),
  mode: document.getElementById('redactionMode'),
  zoomSlider: document.getElementById('zoomSlider'),
  canvas: document.getElementById('editorCanvas'),
  canvasWrap: document.getElementById('canvasWrap'),
  boxList: document.getElementById('boxList'),
};

const ctx = els.canvas.getContext('2d');
const offscreen = document.createElement('canvas');
const offctx = offscreen.getContext('2d', { willReadFrequently: true });
const blurCanvas = document.createElement('canvas');
const blurCtx = blurCanvas.getContext('2d');

let detector = null;
let detectorPromise = null;
let originalImage = null;
let imageName = 'blurred-photo.jpg';
let fitScale = 1;
let zoomExtra = 0;
let viewScale = 1;
let shapes = [];
let selectedId = null;
let dragState = null;
let hoverHandle = null;
let hoveredShape = null;
let isDragging = false;

function setStatus(msg) { els.status.textContent = msg; }
function enabled(v) {
  els.autoDetect.disabled = !v;
  els.autoDetectAll.disabled = !v || batchImages.length <= 1;
  els.addBox.disabled = !v;
  els.clearBoxes.disabled = !v;
  els.deleteBox.disabled = !v || !selectedId;
  els.save.disabled = !v;

  els.prev.disabled = !v || currentIndex === 0;
  els.next.disabled = !v || currentIndex >= batchImages.length - 1;
  els.saveAll.disabled = !v || batchImages.length <= 1;
  els.removePhoto.disabled = !v;
}
function point(x, y) { return { x, y }; }
function clonePoints(points) { return points.map(p => ({ x: p.x, y: p.y })); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }

function makeRectShape(x, y, w, h, label = 'manual', confidence = null) {
  return {
    id: crypto.randomUUID(),
    label,
    confidence,
    points: [point(x, y), point(x + w, y), point(x + w, y + h), point(x, y + h)]
  };
}

function updateBoxList() {
  els.boxList.innerHTML = '';
  if (!shapes.length) {
    const div = document.createElement('div');
    div.className = 'muted';
    div.textContent = 'No blur shapes yet.';
    els.boxList.appendChild(div);
    return;
  }
  shapes.forEach((shape, idx) => {
    const div = document.createElement('div');
    div.className = 'box-item' + (shape.id === selectedId ? ' selected' : '');
    const conf = shape.confidence == null ? '' : ` • ${(shape.confidence * 100).toFixed(0)}%`;
    div.textContent = `Shape ${idx + 1}: ${shape.label}${conf}`;
    div.onclick = () => {
      selectedId = shape.id;
      render();
      updateBoxList();
      enabled(!!originalImage);
    };
    els.boxList.appendChild(div);
  });
}

function fitToViewport() {
  if (!originalImage) return;
  const padding = 20;
  const maxW = els.canvasWrap.clientWidth - padding;
  const maxH = Math.max(320, window.innerHeight * 0.70);
  fitScale = Math.min(maxW / originalImage.width, maxH / originalImage.height, 1);
  zoomExtra = Number(els.zoomSlider.value) / 100;
  viewScale = fitScale * (1 + zoomExtra);
  els.canvas.width = Math.round(originalImage.width * viewScale);
  els.canvas.height = Math.round(originalImage.height * viewScale);
  render();
}

function imageToCanvasPoint(clientX, clientY) {
  const rect = els.canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) / viewScale,
    y: (clientY - rect.top) / viewScale,
  };
}

function polygonPath(context, points, scale = 1) {
  context.beginPath();
  context.moveTo(points[0].x * scale, points[0].y * scale);
  for (let i = 1; i < points.length; i++) context.lineTo(points[i].x * scale, points[i].y * scale);
  context.closePath();
}

function drawBaseImage() {
  ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
  if (!originalImage) return;
  ctx.drawImage(originalImage, 0, 0, els.canvas.width, els.canvas.height);
}

function blurAmount() { return Number(els.blurSlider.value); }

function buildBlurLayer() {
  if (!originalImage) return;
  const strength = blurAmount();
  blurCanvas.width = originalImage.width;
  blurCanvas.height = originalImage.height;

  const factor = Math.max(0.02, 1 / (1 + strength / 1.4));
  const smallW = Math.max(6, Math.round(originalImage.width * factor));
  const smallH = Math.max(6, Math.round(originalImage.height * factor));

  offscreen.width = smallW;
  offscreen.height = smallH;
  offctx.imageSmoothingEnabled = true;
  offctx.clearRect(0, 0, smallW, smallH);
  offctx.drawImage(originalImage, 0, 0, smallW, smallH);

  blurCtx.clearRect(0, 0, blurCanvas.width, blurCanvas.height);
  blurCtx.imageSmoothingEnabled = true;
  for (let i = 0; i < 4; i++) {
    blurCtx.drawImage(offscreen, 0, 0, smallW, smallH, 0, 0, blurCanvas.width, blurCanvas.height);
    if (i < 3) {
      offctx.clearRect(0, 0, smallW, smallH);
      offctx.drawImage(blurCanvas, 0, 0, blurCanvas.width, blurCanvas.height, 0, 0, smallW, smallH);
    }
  }
}

function pointInPolygon(pt, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x, yi = points[i].y;
    const xj = points[j].x, yj = points[j].y;
    const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
      (pt.x < (xj - xi) * (pt.y - yi) / ((yj - yi) || 1e-9) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

function findHandle(pt) {
  const radius = 12 / viewScale;
  for (const shape of [...shapes].reverse()) {
    for (let i = 0; i < shape.points.length; i++) {
      if (dist(pt, shape.points[i]) <= radius) return { shape, index: i };
    }
  }
  return null;
}

function findShape(pt) {
  for (const shape of [...shapes].reverse()) {
    if (pointInPolygon(pt, shape.points)) return shape;
  }
  return null;
}

function renderShapes() {
  ctx.save();
  ctx.drawImage(originalImage, 0, 0, els.canvas.width, els.canvas.height);

  if (!isDragging) {
  buildBlurLayer();
}

  shapes.forEach(shape => {
    ctx.save();
    polygonPath(ctx, shape.points, viewScale);
    ctx.clip();
if (redactionMode === 'blur') {
  ctx.drawImage(blurCanvas, 0, 0, blurCanvas.width * viewScale, blurCanvas.height * viewScale);
} else {
  const overlay = ensureAmgOverlayImage();

  const minX = Math.min(...shape.points.map(p => p.x)) * viewScale;
  const minY = Math.min(...shape.points.map(p => p.y)) * viewScale;
  const maxX = Math.max(...shape.points.map(p => p.x)) * viewScale;
  const maxY = Math.max(...shape.points.map(p => p.y)) * viewScale;

  const width = maxX - minX;
  const height = maxY - minY;

  ctx.drawImage(overlay, minX, minY, width, height);
}
    ctx.restore();
  });

  shapes.forEach(shape => {
    const selected = shape.id === selectedId;
    ctx.save();
    polygonPath(ctx, shape.points, viewScale);
    ctx.lineWidth = selected ? 4 : 3;
    ctx.strokeStyle = selected ? '#2563eb' : '#ef4444';
    ctx.stroke();
    shape.points.forEach((p, idx) => {
      ctx.beginPath();
      ctx.arc(p.x * viewScale, p.y * viewScale, selected ? 7 : 6, 0, Math.PI * 2);
      ctx.fillStyle = (hoverHandle && hoverHandle.shape.id === shape.id && hoverHandle.index === idx) ? '#111827' : '#ffffff';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = selected ? '#2563eb' : '#ef4444';
      ctx.stroke();
    });
    ctx.restore();
  });
}

function render() {
  if (isDragging) {
    renderShapes();
    return;
  }
  drawBaseImage();
  if (!originalImage) return;
  renderShapes();

  saveSessionState();
}

function saveJpeg() {
  if (!originalImage) return;

  const exportCanvas = document.createElement('canvas');
  const exportCtx = exportCanvas.getContext('2d');
  exportCanvas.width = originalImage.width;
  exportCanvas.height = originalImage.height;

  exportCtx.drawImage(originalImage, 0, 0);

  if (redactionMode === 'blur') {
    buildBlurLayer();
  }

  shapes.forEach(shape => {
    exportCtx.save();
    polygonPath(exportCtx, shape.points, 1);
    exportCtx.clip();

    if (redactionMode === 'blur') {
      exportCtx.drawImage(blurCanvas, 0, 0);
    } else {
      const overlay = ensureAmgOverlayImage();

      const minX = Math.min(...shape.points.map(p => p.x));
      const minY = Math.min(...shape.points.map(p => p.y));
      const maxX = Math.max(...shape.points.map(p => p.x));
      const maxY = Math.max(...shape.points.map(p => p.y));

      const width = maxX - minX;
      const height = maxY - minY;

      exportCtx.drawImage(overlay, minX, minY, width, height);
    }

    exportCtx.restore();
  });

  exportCanvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const suffix = imageName.replace(/\.[^.]+$/, '');
    const modeSuffix = redactionMode === 'blur' ? 'blurred' : 'amg';
    a.href = url;
    a.download = `${currentIndex + 1}-${suffix}-${modeSuffix}.jpg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/jpeg', 0.95);
}

async function loadFile(file) {
  imageName = file.name || 'photo.jpg';
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
img.onload = () => {
  const maxDim = 1200;

  let w = img.width;
  let h = img.height;

  if (Math.max(w, h) > maxDim) {
    const scale = maxDim / Math.max(w, h);
    w = Math.round(w * scale);
    h = Math.round(h * scale);
  }

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = w;
  tempCanvas.height = h;

  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(img, 0, 0, w, h);

  const resized = new Image();
  resized.onload = () => {
    originalImage = resized;
    if (batchState[file.name]) {
  shapes = JSON.parse(JSON.stringify(batchState[file.name].shapes || []));
  selectedId = batchState[file.name].selectedId || null;
} else {
  restoreSessionState();
}
    enabled(true);
    updateBoxList();
    els.zoomSlider.value = 0;
    fitToViewport();
    setStatus(`Loaded ${currentIndex + 1} / ${batchImages.length || 1}: ${file.name}`);
  };
  resized.onerror = () => setStatus('Could not load resized image.');
  resized.src = tempCanvas.toDataURL('image/jpeg', 0.9);
};

img.onerror = () => setStatus('Could not load image.');
img.src = objectUrl;
  } finally {
    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
  }
}

function addDefaultBox() {
  if (!originalImage) return;
  const w = originalImage.width * 0.20;
  const h = originalImage.height * 0.08;
  const x = (originalImage.width - w) / 2;
  const y = (originalImage.height - h) / 2;
  const shape = makeRectShape(x, y, w, h, 'manual');
  shapes.push(shape);
  selectedId = shape.id;
  updateBoxList();
  enabled(true);
  render();
}

async function ensureDetector() {
  if (detector) return detector;
  if (!detectorPromise) {
    setStatus('Loading local browser model. First run can take a while…');
    detectorPromise = pipeline('object-detection', 'Xenova/detr-resnet-50', {
      progress_callback: data => {
        if (data.status === 'progress' && data.progress != null) {
          setStatus(`Loading model… ${Math.round(data.progress)}%`);
        }
      }
    }).then(d => {
      detector = d;
      setStatus('Model ready.');
      return d;
    }).catch(err => {
      console.error(err);
      setStatus('Model failed to load. Check your internet connection and refresh.');
      throw err;
    });
  }
  return detectorPromise;
}

async function ensurePlateModel() {
  if (plateSession) return plateSession;

  setStatus('Loading plate model…');

  try {
    plateSession = await ort.InferenceSession.create('models/license-plate-finetune-v1s.onnx');
    setStatus('Plate model ready.');
    return plateSession;
  } catch (err) {
    console.error(err);
    setStatus('Plate model failed to load.');
    throw err;
  }
}

function computeIntegral(mask, width, height) {
  const integral = new Float32Array((width + 1) * (height + 1));
  for (let y = 1; y <= height; y++) {
    let row = 0;
    for (let x = 1; x <= width; x++) {
      row += mask[(y - 1) * width + (x - 1)];
      integral[y * (width + 1) + x] = integral[(y - 1) * (width + 1) + x] + row;
    }
  }
  return integral;
}

function rectSum(integral, width, x, y, w, h) {
  const stride = width + 1;
  const x2 = x + w;
  const y2 = y + h;
  return integral[y2 * stride + x2] - integral[y * stride + x2] - integral[y2 * stride + x] + integral[y * stride + x];
}

function findPlateCandidateInVehicle(vehicleBox) {
  const vx = Math.max(0, Math.floor(vehicleBox.xmin));
  const vy = Math.max(0, Math.floor(vehicleBox.ymin));
  const vw = Math.min(originalImage.width - vx, Math.floor(vehicleBox.xmax - vehicleBox.xmin));
  const vh = Math.min(originalImage.height - vy, Math.floor(vehicleBox.ymax - vehicleBox.ymin));
  if (vw < 80 || vh < 50) return null;

  const sampleW = Math.min(320, vw);
  const sampleH = Math.max(70, Math.round(vh * (sampleW / vw)));
  offscreen.width = sampleW;
  offscreen.height = sampleH;
  offctx.clearRect(0, 0, sampleW, sampleH);
  offctx.drawImage(originalImage, vx, vy, vw, vh, 0, 0, sampleW, sampleH);
  const { data } = offctx.getImageData(0, 0, sampleW, sampleH);

  const whiteMask = new Float32Array(sampleW * sampleH);
  const edgeMask = new Float32Array(sampleW * sampleH);

  for (let y = 0; y < sampleH; y++) {
    for (let x = 0; x < sampleW; x++) {
      const i = (y * sampleW + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const maxc = Math.max(r, g, b);
      const minc = Math.min(r, g, b);
      const sat = maxc === 0 ? 0 : (maxc - minc) / maxc;
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      whiteMask[y * sampleW + x] = (luma > 145 && sat < 0.25) ? 1 : 0;
      if (x < sampleW - 1 && y < sampleH - 1) {
        const ir = ((y * sampleW + (x + 1)) * 4);
        const id = ((((y + 1) * sampleW) + x) * 4);
        const lRight = 0.299 * data[ir] + 0.587 * data[ir + 1] + 0.114 * data[ir + 2];
        const lDown = 0.299 * data[id] + 0.587 * data[id + 1] + 0.114 * data[id + 2];
        const edge = Math.abs(luma - lRight) + Math.abs(luma - lDown);
        edgeMask[y * sampleW + x] = edge > 35 ? 1 : 0;
      }
    }
  }

  const whiteIntegral = computeIntegral(whiteMask, sampleW, sampleH);
  const edgeIntegral = computeIntegral(edgeMask, sampleW, sampleH);
  let best = null;

  const minW = Math.round(sampleW * 0.18);
  const maxW = Math.round(sampleW * 0.40);
  const searchY0 = Math.round(sampleH * 0.50);
  const searchY1 = Math.round(sampleH * 0.88);
  const searchX0 = Math.round(sampleW * 0.20);
  const searchX1 = Math.round(sampleW * 0.80);

  for (const ratio of [2.4, 2.8, 3.2, 3.6, 4.0, 4.4]) {
    for (let w = minW; w <= maxW; w += Math.max(5, Math.round(sampleW * 0.03))) {
      const h = Math.max(9, Math.round(w / ratio));
      if (h >= sampleH * 0.20 || h <= sampleH * 0.04) continue;
      for (let y = searchY0; y <= searchY1 - h; y += Math.max(3, Math.round(sampleH * 0.025))) {
        for (let x = searchX0; x <= searchX1 - w; x += Math.max(3, Math.round(sampleW * 0.025))) {
          const area = w * h;
          const white = rectSum(whiteIntegral, sampleW, x, y, w, h) / area;
          const edge = rectSum(edgeIntegral, sampleW, x, y, w, h) / area;
          if (white < 0.32 || white > 0.90) continue;
          if (edge < 0.05 || edge > 0.55) continue;

          const cx = x + w / 2;
          const cy = y + h / 2;
          const centerBias = 1 - Math.min(1, Math.abs(cx - sampleW / 2) / (sampleW / 2));
          const lowerBias = 1 - Math.min(1, Math.abs(cy - sampleH * 0.73) / (sampleH * 0.25));
          const ratioBias = 1 - Math.min(1, Math.abs((w / h) - 3.2) / 1.6);
          const sizeBias = 1 - Math.min(1, Math.abs((w / sampleW) - 0.28) / 0.18);

          const score = white * 0.30 + edge * 0.18 + centerBias * 0.20 + lowerBias * 0.20 + ratioBias * 0.07 + sizeBias * 0.05;

          if (!best || score > best.score) {
            best = { x, y, w, h, score };
          }
        }
      }
    }
  }

  if (!best || best.score < 0.45) return null;

  const px = vx + (best.x / sampleW) * vw;
  const py = vy + (best.y / sampleH) * vh;
  const pw = (best.w / sampleW) * vw;
  const ph = (best.h / sampleH) * vh;

  return {
    x: clamp(px, 0, originalImage.width - pw),
    y: clamp(py, 0, originalImage.height - ph),
    w: clamp(pw, 20, originalImage.width),
    h: clamp(ph, 12, originalImage.height),
    heuristicScore: best.score,
  };
}

function fallbackPlateGuess(box) {
  const xMin = box.xmin;
  const yMin = box.ymin;
  const width = box.xmax - box.xmin;
  const height = box.ymax - box.ymin;
  const plateW = width * 0.34;
  const plateH = Math.max(height * 0.12, width * 0.045);
  const plateX = xMin + (width - plateW) / 2;
  const plateY = yMin + height * 0.60;
  return {
    x: clamp(plateX, 0, originalImage.width - plateW),
    y: clamp(plateY, 0, originalImage.height - plateH),
    w: clamp(plateW, 20, originalImage.width),
    h: clamp(plateH, 12, originalImage.height),
    heuristicScore: 0,
  };
}

function shapeFromGuess(guess, label, score) {
  return makeRectShape(guess.x, guess.y, guess.w, guess.h, `${label}-guess`, score);
}

async function autoDetect() {
  if (!originalImage) return;
  const session = await ensurePlateModel();

const prepCanvas = document.createElement('canvas');
prepCanvas.width = 640;
prepCanvas.height = 640;
const prepCtx = prepCanvas.getContext('2d');

prepCtx.drawImage(originalImage, 0, 0, 640, 640);

const imageData = prepCtx.getImageData(0, 0, 640, 640).data;
const inputData = new Float32Array(1 * 3 * 640 * 640);

for (let i = 0; i < 640 * 640; i++) {
  inputData[i] = imageData[i * 4] / 255;
  inputData[640 * 640 + i] = imageData[i * 4 + 1] / 255;
  inputData[2 * 640 * 640 + i] = imageData[i * 4 + 2] / 255;
}

const testInput = new ort.Tensor('float32', inputData, [1, 3, 640, 640]);
const testResults = await session.run({ images: testInput });
const out = testResults.output0;
const data = out.data;

const scaleX = originalImage.naturalWidth / 640;
const scaleY = originalImage.naturalHeight / 640;

const detections = [];

for (let i = 0; i < 8400; i++) {
  const score = data[4 * 8400 + i];
  if (score < 0.35) continue;

  const cx = data[0 * 8400 + i];
  const cy = data[1 * 8400 + i];
  const w = data[2 * 8400 + i];
  const h = data[3 * 8400 + i];

  const x = (cx - w / 2) * scaleX;
  const y = (cy - h / 2) * scaleY;
  const boxW = w * scaleX;
  const boxH = h * scaleY;

  detections.push({
    score,
    x,
    y,
    boxW,
    boxH
  });
}

if (!detections.length) {
  setStatus('Plate model found nothing reliable. Add a box manually.');
  return;
}

detections.sort((a, b) => b.score - a.score);

function iou(a, b) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.boxW, b.x + b.boxW);
  const y2 = Math.min(a.y + a.boxH, b.y + b.boxH);

  const interW = Math.max(0, x2 - x1);
  const interH = Math.max(0, y2 - y1);
  const intersection = interW * interH;

  const areaA = a.boxW * a.boxH;
  const areaB = b.boxW * b.boxH;
  const union = areaA + areaB - intersection;

  return union > 0 ? intersection / union : 0;
}

const filtered = [];
for (const d of detections) {
  const overlapsTooMuch = filtered.some(f => iou(d, f) > 0.5);
  if (!overlapsTooMuch) filtered.push(d);
  if (filtered.length >= 5) break;
}

shapes = filtered.map((d, idx) => ({
  id: 'plate-' + Date.now() + '-' + idx,
  label: 'plate',
  score: d.score,
  points: [
    { x: d.x, y: d.y },
    { x: d.x + d.boxW, y: d.y },
    { x: d.x + d.boxW, y: d.y + d.boxH },
    { x: d.x, y: d.y + d.boxH }
  ]
}));

selectedId = shapes[0].id;
updateBoxList();
render();
enabled(true);
setStatus(`Plate model added ${shapes.length} detected area(s). Please review.`);
return;

  try {
    const det = await ensureDetector();
    setStatus('Detecting vehicles locally…');
    const detections = await det(originalImage.src, { threshold: 0.55, percentage: false });
    console.log('Detections', detections);

    const allowed = new Set(['car', 'truck', 'bus']);
    const vehicles = detections
      .filter(d => allowed.has(String(d.label).toLowerCase()))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    if (!vehicles.length) {
      setStatus('No vehicles detected. Add a box manually.');
      return;
    }

    setStatus('Searching inside each vehicle for a likely plate area…');
    const candidates = vehicles.map(d => {
      const guess = findPlateCandidateInVehicle(d.box) || fallbackPlateGuess(d.box);
      const combinedScore = Math.min(0.99, d.score * 0.55 + (guess.heuristicScore || 0) * 0.45);
      return { detection: d, guess, combinedScore };
    });

    candidates.sort((a, b) => b.combinedScore - a.combinedScore);
    const best = candidates[0];
    if (!best) {
      setStatus('Could not guess a plate area. Add a box manually.');
      return;
    }

    shapes = [shapeFromGuess(best.guess, best.detection.label, best.combinedScore)];
    selectedId = shapes[0].id;
    updateBoxList();
    render();
    enabled(true);
    setStatus('Added 1 guessed plate area. Please review.');
  } catch (err) {
    console.error(err);
    setStatus('Auto detect failed. See browser console.');
  }
}

els.input.addEventListener('change', (e) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  batchImages = files;
  currentIndex = 0;

  loadFile(batchImages[currentIndex]);
});

els.mode.addEventListener('change', () => {
  redactionMode = els.mode.value;
  render();
});

els.next.addEventListener('click', () => {
  if (currentIndex >= batchImages.length - 1) return;

  batchState[imageName] = {
    shapes: JSON.parse(JSON.stringify(shapes)),
    selectedId
  };

  currentIndex++;
  loadFile(batchImages[currentIndex]);
});

els.prev.addEventListener('click', () => {
  if (currentIndex <= 0) return;

  batchState[imageName] = {
    shapes: JSON.parse(JSON.stringify(shapes)),
    selectedId
  };

  currentIndex--;
  loadFile(batchImages[currentIndex]);
});

els.clearBoxes.addEventListener('click', () => {
  if (!batchImages.length) return;

  shapes = [];
  selectedId = null;

  // update batch state for this photo
  batchState[imageName] = {
    shapes: [],
    selectedId: null
  };

  updateBoxList();
  render();
  setStatus('Boxes cleared for this photo.');
});

els.removePhoto.addEventListener('click', () => {
  if (!batchImages.length) return;

  delete batchState[imageName];
  batchImages.splice(currentIndex, 1);

  if (!batchImages.length) {
    originalImage = null;
    imageName = '';
    shapes = [];
    selectedId = null;
    currentIndex = 0;
    updateBoxList();
    enabled(false);
    ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
    setStatus('No photos in batch.');
    return;
  }

  if (currentIndex >= batchImages.length) {
    currentIndex = batchImages.length - 1;
  }

  loadFile(batchImages[currentIndex]);
});

els.addBox.addEventListener('click', addDefaultBox);
els.deleteBox.addEventListener('click', () => {
  if (!selectedId) return;
  shapes = shapes.filter(s => s.id !== selectedId);
  selectedId = shapes[0]?.id || null;
  updateBoxList();
  enabled(!!originalImage);
  render();
});
els.save.addEventListener('click', saveJpeg);
els.autoDetect.addEventListener('click', autoDetect);
els.autoDetectAll.addEventListener('click', async () => {
  if (!batchImages.length) return;

  // save current photo state first
  batchState[imageName] = {
    shapes: JSON.parse(JSON.stringify(shapes)),
    selectedId
  };

  const originalIndex = currentIndex;

  for (let i = 0; i < batchImages.length; i++) {
    currentIndex = i;
    loadFile(batchImages[i]);

    await new Promise(resolve => setTimeout(resolve, 400));

    await autoDetect();

    batchState[batchImages[i].name] = {
      shapes: JSON.parse(JSON.stringify(shapes)),
      selectedId
    };

    setStatus(`Auto detecting ${i + 1} / ${batchImages.length}...`);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // restore original photo
  currentIndex = originalIndex;
  loadFile(batchImages[currentIndex]);

  setStatus('Auto Detect All completed.');
});

els.blurSlider.addEventListener('input', render);
els.zoomSlider.addEventListener('input', fitToViewport);
els.saveAll.addEventListener('click', async () => {
  batchState[imageName] = {
    shapes: JSON.parse(JSON.stringify(shapes)),
    selectedId
  };
  const savedState = {
    shapes: JSON.parse(JSON.stringify(shapes)),
    selectedId
  };

  for (let i = 0; i < batchImages.length; i++) {
    currentIndex = i;
    loadFile(batchImages[i]);
    await new Promise(resolve => setTimeout(resolve, 400));

    if (batchState[batchImages[i].name]) {
      shapes = JSON.parse(JSON.stringify(batchState[batchImages[i].name].shapes || []));
      selectedId = batchState[batchImages[i].name].selectedId || null;
      updateBoxList();
      render();
    }

    saveJpeg();
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  shapes = savedState.shapes;
  selectedId = savedState.selectedId;
  updateBoxList();
  render();
  setStatus('Save All completed.');
});
window.addEventListener('resize', fitToViewport);

els.canvas.addEventListener('pointerdown', (e) => {
  isDragging = true;
  if (!originalImage) return;
  const pt = imageToCanvasPoint(e.clientX, e.clientY);
  const handle = findHandle(pt);
  if (handle) {
    selectedId = handle.shape.id;
    dragState = { type: 'handle', shapeId: handle.shape.id, index: handle.index };
    updateBoxList();
    render();
    return;
  }
  const shape = findShape(pt);
  if (shape) {
    selectedId = shape.id;
    dragState = { type: 'move', shapeId: shape.id, start: pt, original: clonePoints(shape.points) };
    updateBoxList();
    render();
    return;
  }
  selectedId = null;
  updateBoxList();
  render();
});

els.canvas.addEventListener('pointermove', (e) => {
  if (!originalImage) return;
  const pt = imageToCanvasPoint(e.clientX, e.clientY);
  hoverHandle = findHandle(pt);
  hoveredShape = hoverHandle ? hoverHandle.shape : findShape(pt);
  els.canvas.style.cursor = hoverHandle ? 'grab' : hoveredShape ? 'move' : 'default';

if (!dragState) {
  if (!isDragging) render();
  return;
}

  const shape = shapes.find(s => s.id === dragState.shapeId);
  if (!shape) return;

  if (dragState.type === 'handle') {
    shape.points[dragState.index] = {
      x: clamp(pt.x, 0, originalImage.width),
      y: clamp(pt.y, 0, originalImage.height)
    };
  } else if (dragState.type === 'move') {
    const dx = pt.x - dragState.start.x;
    const dy = pt.y - dragState.start.y;
    shape.points = dragState.original.map(p => ({
      x: clamp(p.x + dx, 0, originalImage.width),
      y: clamp(p.y + dy, 0, originalImage.height),
    }));
  }
  render();
});

['pointerup', 'pointerleave', 'pointercancel'].forEach(evt => {
  els.canvas.addEventListener(evt, () => {
    isDragging = false;
    dragState = null;
  });
});

enabled(false);
updateBoxList();
setStatus('Select a photo to begin.');
