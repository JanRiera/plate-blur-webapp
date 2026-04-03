import type { PlateBox, WorkingPhoto } from '@/types/editor';

type NumericTensor = {
  data: ArrayLike<number>;
  dims?: readonly number[] | number[];
};

export type DetectionCandidate = {
  score: number;
  x: number;
  y: number;
  boxWidth: number;
  boxHeight: number;
};

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value));
}

export function createBoxId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `box-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createDefaultBox(photo: WorkingPhoto): PlateBox {
  const width = photo.width * 0.24;
  const height = photo.height * 0.12;
  return {
    id: createBoxId(),
    x: (photo.width - width) / 2,
    y: (photo.height - height) / 2,
    width,
    height,
    label: 'manual',
    confidence: null,
  };
}

export function clampBoxToBounds(
  box: PlateBox,
  imageWidth: number,
  imageHeight: number,
  minimumSize = 36,
): PlateBox {
  const nextWidth = clamp(box.width, minimumSize, imageWidth);
  const nextHeight = clamp(box.height, minimumSize, imageHeight);
  const nextX = clamp(box.x, 0, Math.max(0, imageWidth - nextWidth));
  const nextY = clamp(box.y, 0, Math.max(0, imageHeight - nextHeight));

  return {
    ...box,
    x: nextX,
    y: nextY,
    width: Math.min(nextWidth, imageWidth - nextX),
    height: Math.min(nextHeight, imageHeight - nextY),
  };
}

function calculateIntersectionOverUnion(firstBox: DetectionCandidate, secondBox: DetectionCandidate) {
  const left = Math.max(firstBox.x, secondBox.x);
  const top = Math.max(firstBox.y, secondBox.y);
  const right = Math.min(firstBox.x + firstBox.boxWidth, secondBox.x + secondBox.boxWidth);
  const bottom = Math.min(firstBox.y + firstBox.boxHeight, secondBox.y + secondBox.boxHeight);
  const intersectionWidth = Math.max(0, right - left);
  const intersectionHeight = Math.max(0, bottom - top);
  const intersectionArea = intersectionWidth * intersectionHeight;
  const firstArea = firstBox.boxWidth * firstBox.boxHeight;
  const secondArea = secondBox.boxWidth * secondBox.boxHeight;
  const union = firstArea + secondArea - intersectionArea;
  return union > 0 ? intersectionArea / union : 0;
}

export function parseDetections(
  outputTensor: NumericTensor | undefined,
  imageWidth: number,
  imageHeight: number,
): DetectionCandidate[] {
  if (!outputTensor?.data?.length) {
    return [];
  }

  const rawData = outputTensor.data;
  const outputDimensions = Array.isArray(outputTensor.dims) ? [...outputTensor.dims] : [];
  let detectionCount = 8400;
  let channelsFirst = true;
  const secondLastDimension = outputDimensions[outputDimensions.length - 2];
  const lastDimension = outputDimensions[outputDimensions.length - 1];

  if (secondLastDimension === 5) {
    detectionCount = lastDimension;
    channelsFirst = true;
  } else if (lastDimension === 5) {
    detectionCount = secondLastDimension;
    channelsFirst = false;
  }

  const scaleX = imageWidth / 640;
  const scaleY = imageHeight / 640;
  const detections: DetectionCandidate[] = [];

  for (let detectionIndex = 0; detectionIndex < detectionCount; detectionIndex += 1) {
    let centerX = 0;
    let centerY = 0;
    let width = 0;
    let height = 0;
    let score = 0;

    if (channelsFirst) {
      centerX = rawData[detectionIndex];
      centerY = rawData[detectionCount + detectionIndex];
      width = rawData[detectionCount * 2 + detectionIndex];
      height = rawData[detectionCount * 3 + detectionIndex];
      score = rawData[detectionCount * 4 + detectionIndex];
    } else {
      const offset = detectionIndex * 5;
      centerX = rawData[offset];
      centerY = rawData[offset + 1];
      width = rawData[offset + 2];
      height = rawData[offset + 3];
      score = rawData[offset + 4];
    }

    if (score < 0.35) {
      continue;
    }

    const scaledWidth = width * scaleX;
    const scaledHeight = height * scaleY;
    detections.push({
      score,
      x: clamp((centerX - width / 2) * scaleX, 0, imageWidth),
      y: clamp((centerY - height / 2) * scaleY, 0, imageHeight),
      boxWidth: clamp(scaledWidth, 0, imageWidth),
      boxHeight: clamp(scaledHeight, 0, imageHeight),
    });
  }

  detections.sort((firstDetection, secondDetection) => secondDetection.score - firstDetection.score);

  const filteredDetections: DetectionCandidate[] = [];
  for (const detection of detections) {
    const overlapsExisting = filteredDetections.some(
      (filteredDetection) => calculateIntersectionOverUnion(detection, filteredDetection) > 0.5,
    );
    if (!overlapsExisting) {
      filteredDetections.push(detection);
    }
    if (filteredDetections.length >= 5) {
      break;
    }
  }

  return filteredDetections;
}

export function detectionsToBoxes(detections: DetectionCandidate[]): PlateBox[] {
  return detections.map((detection) => ({
    id: createBoxId(),
    x: detection.x,
    y: detection.y,
    width: detection.boxWidth,
    height: detection.boxHeight,
    label: 'plate',
    confidence: detection.score,
  }));
}
