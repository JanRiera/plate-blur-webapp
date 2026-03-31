const translations = {
  en: {
    appTitle: 'Plate Blur Prototype',
    uploadPhotos: 'Choose Photos',
    photoSelectionEmpty: 'No photos selected.',
    photoSelectionSingle: '{name}',
    photoSelectionMultiple: '{count} photos selected.',
    autoDetect: 'Auto Detect',
    autoDetectAll: 'Auto Detect All',
    addBox: 'Add Box',
    clearBoxes: 'Clear All Boxes',
    deleteBox: 'Clear Selected Box',
    saveCopy: 'Save Copy',
    saveAll: 'Save All',
    previous: 'Previous',
    next: 'Next',
    removePhoto: 'Remove Photo',
    groupPhotos: 'Photos',
    groupNavigation: 'Navigation',
    groupDetection: 'Detection',
    groupBoxes: 'Boxes',
    groupExport: 'Export',
    language: 'Language',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    languageNameEnglish: 'English',
    languageNameJapanese: 'Japanese',
    languageNameSpanish: 'Spanish',
    languageNameItalian: 'Italian',
    languageNameGerman: 'German',
    adjustments: 'Adjustments',
    mode: 'Mode',
    modeBlur: 'Blur',
    modeAmg: 'AMG Overlay',
    blurStrength: 'Blur strength',
    zoom: 'Zoom',
    helpDragResize: 'Drag inside a box to move it. Drag a corner handle to resize it.',
    helpReviewDetect: 'Auto-detect is only a rough prototype. Review every box before saving.',
    noShapesYet: 'No redaction areas yet.',
    boxListItem: 'Area {index}: {label}{confidence}',
    shapeConfidence: ' • {confidence}%',
    shapeManual: 'manual',
    shapePlate: 'plate',
    statusSelectPhoto: 'Select a photo to begin.',
    statusLoadedPhoto: 'Loaded {current} / {total}: {name}',
    statusBrowserUnsupported: 'This browser is missing features required for the local editor. Use a current version of Chrome, Edge, Firefox, or Safari.',
    statusLoadingRuntime: 'Loading the local ONNX Runtime...',
    statusRuntimeReady: 'Local runtime ready.',
    statusRuntimeFailed: 'The local runtime could not be loaded. Refresh the page and confirm the vendor files are present.',
    statusLoadingModel: 'Loading the local plate model...',
    statusModelReady: 'Plate model ready.',
    statusModelFailed: 'The local plate model could not be loaded.',
    statusLoadingOverlay: 'Loading the AMG overlay...',
    statusOverlayReady: 'AMG overlay ready.',
    statusOverlayFailed: 'The AMG overlay could not be loaded.',
    statusImageLoadFailed: 'The selected image could not be loaded.',
    statusResizedImageLoadFailed: 'The resized image preview could not be created.',
    statusAutoDetecting: 'Detecting plates locally...',
    statusAutoDetectNone: 'The plate model found nothing reliable. Add a box manually.',
    statusAutoDetectFound: 'Auto-detect added {count} area(s). Please review them.',
    statusAutoDetectFailed: 'Auto-detect failed in this browser.',
    statusAutoDetectAllProgress: 'Auto-detecting {current} / {total}...',
    statusAutoDetectAllComplete: 'Auto Detect All completed.',
    statusBoxesCleared: 'Boxes cleared for this photo.',
    statusNoPhotosInBatch: 'No photos in the batch.',
    statusPhotoRemoved: 'Removed {name}.',
    statusSaving: 'Preparing the download...',
    statusSaveFailed: 'The edited image could not be exported.',
    statusSaveAllProgress: 'Saving {current} / {total}...',
    statusSaveAllComplete: 'Save All completed.',
    statusOverlayRequiredForSave: 'The AMG overlay must finish loading before you save.',
    statusWaitingForImage: 'Load a photo before running this action.'
  },
  ja: {
    appTitle: 'ナンバープレートぼかしプロトタイプ',
    uploadPhotos: '写真を選択',
    photoSelectionEmpty: '写真が選択されていません。',
    photoSelectionSingle: '{name}',
    photoSelectionMultiple: '{count}枚の写真を選択しました。',
    autoDetect: '自動検出',
    autoDetectAll: 'すべて自動検出',
    addBox: 'ボックスを追加',
    clearBoxes: 'すべてのボックスを削除',
    deleteBox: '選択したボックスを削除',
    saveCopy: 'コピーを保存',
    saveAll: 'すべて保存',
    previous: '前へ',
    next: '次へ',
    removePhoto: '写真を削除',
    groupPhotos: '写真',
    groupNavigation: '移動',
    groupDetection: '検出',
    groupBoxes: 'ボックス',
    groupExport: '保存',
    language: '言語',
    theme: 'テーマ',
    themeLight: 'ライト',
    themeDark: 'ダーク',
    languageNameEnglish: '英語',
    languageNameJapanese: '日本語',
    languageNameSpanish: 'スペイン語',
    languageNameItalian: 'イタリア語',
    languageNameGerman: 'ドイツ語',
    adjustments: '調整',
    mode: 'モード',
    modeBlur: 'ぼかし',
    modeAmg: 'AMG オーバーレイ',
    blurStrength: 'ぼかしの強さ',
    zoom: 'ズーム',
    helpDragResize: 'ボックスの内側をドラッグすると移動できます。角のハンドルをドラッグするとサイズを変更できます。',
    helpReviewDetect: '自動検出は試作段階です。保存前にすべてのボックスを確認してください。',
    noShapesYet: 'まだマスク領域はありません。',
    boxListItem: '領域 {index}: {label}{confidence}',
    shapeConfidence: ' • {confidence}%',
    shapeManual: '手動',
    shapePlate: 'ナンバープレート',
    statusSelectPhoto: '開始するには写真を選択してください。',
    statusLoadedPhoto: '{current} / {total} を読み込みました: {name}',
    statusBrowserUnsupported: 'このブラウザにはローカルエディターに必要な機能がありません。Chrome、Edge、Firefox、Safari の最新版を使用してください。',
    statusLoadingRuntime: 'ローカル ONNX Runtime を読み込んでいます...',
    statusRuntimeReady: 'ローカルランタイムの準備ができました。',
    statusRuntimeFailed: 'ローカルランタイムを読み込めませんでした。ページを更新し、vendor ファイルがあることを確認してください。',
    statusLoadingModel: 'ローカルのプレートモデルを読み込んでいます...',
    statusModelReady: 'プレートモデルの準備ができました。',
    statusModelFailed: 'ローカルのプレートモデルを読み込めませんでした。',
    statusLoadingOverlay: 'AMG オーバーレイを読み込んでいます...',
    statusOverlayReady: 'AMG オーバーレイの準備ができました。',
    statusOverlayFailed: 'AMG オーバーレイを読み込めませんでした。',
    statusImageLoadFailed: '選択した画像を読み込めませんでした。',
    statusResizedImageLoadFailed: 'リサイズしたプレビュー画像を作成できませんでした。',
    statusAutoDetecting: 'ナンバープレートをローカルで検出しています...',
    statusAutoDetectNone: '信頼できる検出結果がありませんでした。手動でボックスを追加してください。',
    statusAutoDetectFound: '自動検出で {count} 件の領域を追加しました。確認してください。',
    statusAutoDetectFailed: 'このブラウザでは自動検出に失敗しました。',
    statusAutoDetectAllProgress: '{current} / {total} を自動検出しています...',
    statusAutoDetectAllComplete: 'すべての自動検出が完了しました。',
    statusBoxesCleared: 'この写真のボックスを削除しました。',
    statusNoPhotosInBatch: 'バッチに写真がありません。',
    statusPhotoRemoved: '{name} を削除しました。',
    statusSaving: 'ダウンロードを準備しています...',
    statusSaveFailed: '編集後の画像を書き出せませんでした。',
    statusSaveAllProgress: '{current} / {total} を保存しています...',
    statusSaveAllComplete: 'すべての保存が完了しました。',
    statusOverlayRequiredForSave: '保存する前に AMG オーバーレイの読み込みを完了してください。',
    statusWaitingForImage: 'この操作を行う前に写真を読み込んでください。'
  },
  es: {
    appTitle: 'Prototipo de difuminado de matrículas',
    uploadPhotos: 'Elegir fotos',
    photoSelectionEmpty: 'No hay fotos seleccionadas.',
    photoSelectionSingle: '{name}',
    photoSelectionMultiple: 'Se seleccionaron {count} fotos.',
    autoDetect: 'Detección automática',
    autoDetectAll: 'Detectar todas',
    addBox: 'Añadir cuadro',
    clearBoxes: 'Borrar todos los cuadros',
    deleteBox: 'Borrar cuadro seleccionado',
    saveCopy: 'Guardar copia',
    saveAll: 'Guardar todo',
    previous: 'Anterior',
    next: 'Siguiente',
    removePhoto: 'Eliminar foto',
    groupPhotos: 'Fotos',
    groupNavigation: 'Navegacion',
    groupDetection: 'Deteccion',
    groupBoxes: 'Cuadros',
    groupExport: 'Exportacion',
    language: 'Idioma',
    theme: 'Tema',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    languageNameEnglish: 'Inglés',
    languageNameJapanese: 'Japonés',
    languageNameSpanish: 'Español',
    languageNameItalian: 'Italiano',
    languageNameGerman: 'Alemán',
    adjustments: 'Ajustes',
    mode: 'Modo',
    modeBlur: 'Desenfoque',
    modeAmg: 'Superposición AMG',
    blurStrength: 'Intensidad del desenfoque',
    zoom: 'Zoom',
    helpDragResize: 'Arrastra dentro de un cuadro para moverlo. Arrastra un controlador de esquina para cambiar su tamaño.',
    helpReviewDetect: 'La detección automática todavía es un prototipo. Revisa cada cuadro antes de guardar.',
    noShapesYet: 'Todavía no hay áreas de censura.',
    boxListItem: 'Área {index}: {label}{confidence}',
    shapeConfidence: ' • {confidence}%',
    shapeManual: 'manual',
    shapePlate: 'matrícula',
    statusSelectPhoto: 'Selecciona una foto para empezar.',
    statusLoadedPhoto: 'Cargada {current} / {total}: {name}',
    statusBrowserUnsupported: 'A este navegador le faltan funciones necesarias para el editor local. Usa una versión reciente de Chrome, Edge, Firefox o Safari.',
    statusLoadingRuntime: 'Cargando ONNX Runtime local...',
    statusRuntimeReady: 'El runtime local está listo.',
    statusRuntimeFailed: 'No se pudo cargar el runtime local. Actualiza la página y confirma que existan los archivos vendorizados.',
    statusLoadingModel: 'Cargando el modelo local de matrículas...',
    statusModelReady: 'El modelo de matrículas está listo.',
    statusModelFailed: 'No se pudo cargar el modelo local de matrículas.',
    statusLoadingOverlay: 'Cargando la superposición AMG...',
    statusOverlayReady: 'La superposición AMG está lista.',
    statusOverlayFailed: 'No se pudo cargar la superposición AMG.',
    statusImageLoadFailed: 'No se pudo cargar la imagen seleccionada.',
    statusResizedImageLoadFailed: 'No se pudo crear la vista previa redimensionada.',
    statusAutoDetecting: 'Detectando matrículas localmente...',
    statusAutoDetectNone: 'El modelo de matrículas no encontró nada fiable. Añade un cuadro manualmente.',
    statusAutoDetectFound: 'La detección automática añadió {count} área(s). Revísalas.',
    statusAutoDetectFailed: 'La detección automática falló en este navegador.',
    statusAutoDetectAllProgress: 'Detectando {current} / {total}...',
    statusAutoDetectAllComplete: 'La detección automática de todas las fotos ha terminado.',
    statusBoxesCleared: 'Se borraron los cuadros de esta foto.',
    statusNoPhotosInBatch: 'No hay fotos en el lote.',
    statusPhotoRemoved: 'Se eliminó {name}.',
    statusSaving: 'Preparando la descarga...',
    statusSaveFailed: 'No se pudo exportar la imagen editada.',
    statusSaveAllProgress: 'Guardando {current} / {total}...',
    statusSaveAllComplete: 'Se guardaron todas las fotos.',
    statusOverlayRequiredForSave: 'La superposición AMG debe terminar de cargarse antes de guardar.',
    statusWaitingForImage: 'Carga una foto antes de ejecutar esta acción.'
  },
  it: {
    appTitle: 'Prototipo sfocatura targhe',
    uploadPhotos: 'Scegli foto',
    photoSelectionEmpty: 'Nessuna foto selezionata.',
    photoSelectionSingle: '{name}',
    photoSelectionMultiple: '{count} foto selezionate.',
    autoDetect: 'Rilevamento automatico',
    autoDetectAll: 'Rileva tutte',
    addBox: 'Aggiungi riquadro',
    clearBoxes: 'Cancella tutti i riquadri',
    deleteBox: 'Cancella il riquadro selezionato',
    saveCopy: 'Salva copia',
    saveAll: 'Salva tutto',
    previous: 'Precedente',
    next: 'Successiva',
    removePhoto: 'Rimuovi foto',
    groupPhotos: 'Foto',
    groupNavigation: 'Navigazione',
    groupDetection: 'Rilevamento',
    groupBoxes: 'Riquadri',
    groupExport: 'Esportazione',
    language: 'Lingua',
    theme: 'Tema',
    themeLight: 'Chiaro',
    themeDark: 'Scuro',
    languageNameEnglish: 'Inglese',
    languageNameJapanese: 'Giapponese',
    languageNameSpanish: 'Spagnolo',
    languageNameItalian: 'Italiano',
    languageNameGerman: 'Tedesco',
    adjustments: 'Regolazioni',
    mode: 'Modalità',
    modeBlur: 'Sfocatura',
    modeAmg: 'Overlay AMG',
    blurStrength: 'Intensità sfocatura',
    zoom: 'Zoom',
    helpDragResize: 'Trascina dentro un riquadro per spostarlo. Trascina una maniglia d\'angolo per ridimensionarlo.',
    helpReviewDetect: 'Il rilevamento automatico è ancora un prototipo. Controlla ogni riquadro prima di salvare.',
    noShapesYet: 'Non ci sono ancora aree di mascheratura.',
    boxListItem: 'Area {index}: {label}{confidence}',
    shapeConfidence: ' • {confidence}%',
    shapeManual: 'manuale',
    shapePlate: 'targa',
    statusSelectPhoto: 'Seleziona una foto per iniziare.',
    statusLoadedPhoto: 'Caricata {current} / {total}: {name}',
    statusBrowserUnsupported: 'A questo browser mancano funzioni necessarie per l\'editor locale. Usa una versione recente di Chrome, Edge, Firefox o Safari.',
    statusLoadingRuntime: 'Caricamento di ONNX Runtime locale...',
    statusRuntimeReady: 'Runtime locale pronto.',
    statusRuntimeFailed: 'Impossibile caricare il runtime locale. Aggiorna la pagina e verifica che i file vendorizzati siano presenti.',
    statusLoadingModel: 'Caricamento del modello locale per targhe...',
    statusModelReady: 'Modello per targhe pronto.',
    statusModelFailed: 'Impossibile caricare il modello locale per targhe.',
    statusLoadingOverlay: 'Caricamento dell\'overlay AMG...',
    statusOverlayReady: 'Overlay AMG pronto.',
    statusOverlayFailed: 'Impossibile caricare l\'overlay AMG.',
    statusImageLoadFailed: 'Impossibile caricare l\'immagine selezionata.',
    statusResizedImageLoadFailed: 'Impossibile creare l\'anteprima ridimensionata.',
    statusAutoDetecting: 'Rilevamento targhe in locale...',
    statusAutoDetectNone: 'Il modello non ha trovato nulla di affidabile. Aggiungi un riquadro manualmente.',
    statusAutoDetectFound: 'Il rilevamento automatico ha aggiunto {count} area(e). Controllale.',
    statusAutoDetectFailed: 'Il rilevamento automatico non è riuscito in questo browser.',
    statusAutoDetectAllProgress: 'Rilevamento {current} / {total}...',
    statusAutoDetectAllComplete: 'Rilevamento automatico completato per tutte le foto.',
    statusBoxesCleared: 'I riquadri di questa foto sono stati cancellati.',
    statusNoPhotosInBatch: 'Non ci sono foto nel lotto.',
    statusPhotoRemoved: '{name} rimossa.',
    statusSaving: 'Preparazione del download...',
    statusSaveFailed: 'Impossibile esportare l\'immagine modificata.',
    statusSaveAllProgress: 'Salvataggio {current} / {total}...',
    statusSaveAllComplete: 'Salvataggio di tutte le foto completato.',
    statusOverlayRequiredForSave: 'L\'overlay AMG deve completare il caricamento prima del salvataggio.',
    statusWaitingForImage: 'Carica una foto prima di eseguire questa azione.'
  },
  de: {
    appTitle: 'Kennzeichen-Unschärfe-Prototyp',
    uploadPhotos: 'Fotos wählen',
    photoSelectionEmpty: 'Keine Fotos ausgewählt.',
    photoSelectionSingle: '{name}',
    photoSelectionMultiple: '{count} Fotos ausgewählt.',
    autoDetect: 'Automatisch erkennen',
    autoDetectAll: 'Alle automatisch erkennen',
    addBox: 'Rahmen hinzufügen',
    clearBoxes: 'Alle Rahmen löschen',
    deleteBox: 'Ausgewählten Rahmen löschen',
    saveCopy: 'Kopie speichern',
    saveAll: 'Alle speichern',
    previous: 'Zurück',
    next: 'Weiter',
    removePhoto: 'Foto entfernen',
    groupPhotos: 'Fotos',
    groupNavigation: 'Navigation',
    groupDetection: 'Erkennung',
    groupBoxes: 'Rahmen',
    groupExport: 'Export',
    language: 'Sprache',
    theme: 'Thema',
    themeLight: 'Hell',
    themeDark: 'Dunkel',
    languageNameEnglish: 'Englisch',
    languageNameJapanese: 'Japanisch',
    languageNameSpanish: 'Spanisch',
    languageNameItalian: 'Italienisch',
    languageNameGerman: 'Deutsch',
    adjustments: 'Anpassungen',
    mode: 'Modus',
    modeBlur: 'Unschärfe',
    modeAmg: 'AMG-Overlay',
    blurStrength: 'Unschärfestärke',
    zoom: 'Zoom',
    helpDragResize: 'Innerhalb eines Rahmens ziehen, um ihn zu verschieben. Einen Eckpunkt ziehen, um die Größe zu ändern.',
    helpReviewDetect: 'Die automatische Erkennung ist noch ein Prototyp. Prüfe jeden Rahmen vor dem Speichern.',
    noShapesYet: 'Noch keine Verdeckungsbereiche vorhanden.',
    boxListItem: 'Bereich {index}: {label}{confidence}',
    shapeConfidence: ' • {confidence}%',
    shapeManual: 'manuell',
    shapePlate: 'Kennzeichen',
    statusSelectPhoto: 'Wähle ein Foto aus, um zu beginnen.',
    statusLoadedPhoto: 'Geladen {current} / {total}: {name}',
    statusBrowserUnsupported: 'Diesem Browser fehlen Funktionen, die der lokale Editor benötigt. Verwende eine aktuelle Version von Chrome, Edge, Firefox oder Safari.',
    statusLoadingRuntime: 'Lokale ONNX Runtime wird geladen...',
    statusRuntimeReady: 'Lokale Runtime bereit.',
    statusRuntimeFailed: 'Die lokale Runtime konnte nicht geladen werden. Aktualisiere die Seite und prüfe, ob die vendorizierten Dateien vorhanden sind.',
    statusLoadingModel: 'Lokales Kennzeichenmodell wird geladen...',
    statusModelReady: 'Kennzeichenmodell bereit.',
    statusModelFailed: 'Das lokale Kennzeichenmodell konnte nicht geladen werden.',
    statusLoadingOverlay: 'AMG-Overlay wird geladen...',
    statusOverlayReady: 'AMG-Overlay bereit.',
    statusOverlayFailed: 'Das AMG-Overlay konnte nicht geladen werden.',
    statusImageLoadFailed: 'Das ausgewählte Bild konnte nicht geladen werden.',
    statusResizedImageLoadFailed: 'Die verkleinerte Vorschau konnte nicht erstellt werden.',
    statusAutoDetecting: 'Kennzeichen werden lokal erkannt...',
    statusAutoDetectNone: 'Das Kennzeichenmodell hat nichts Verlässliches gefunden. Füge manuell einen Rahmen hinzu.',
    statusAutoDetectFound: 'Die automatische Erkennung hat {count} Bereich(e) hinzugefügt. Bitte prüfen.',
    statusAutoDetectFailed: 'Die automatische Erkennung ist in diesem Browser fehlgeschlagen.',
    statusAutoDetectAllProgress: 'Erkennung {current} / {total}...',
    statusAutoDetectAllComplete: 'Die automatische Erkennung für alle Fotos ist abgeschlossen.',
    statusBoxesCleared: 'Die Rahmen für dieses Foto wurden gelöscht.',
    statusNoPhotosInBatch: 'Keine Fotos im Stapel.',
    statusPhotoRemoved: '{name} wurde entfernt.',
    statusSaving: 'Download wird vorbereitet...',
    statusSaveFailed: 'Das bearbeitete Bild konnte nicht exportiert werden.',
    statusSaveAllProgress: 'Speichern {current} / {total}...',
    statusSaveAllComplete: 'Alle Fotos wurden gespeichert.',
    statusOverlayRequiredForSave: 'Das AMG-Overlay muss vollständig geladen sein, bevor gespeichert werden kann.',
    statusWaitingForImage: 'Lade ein Foto, bevor du diese Aktion ausführst.'
  }
};

const supportedLanguageCodes = ['en', 'ja', 'es', 'it', 'de'];
const languageOptionKeys = {
  en: 'languageNameEnglish',
  ja: 'languageNameJapanese',
  es: 'languageNameSpanish',
  it: 'languageNameItalian',
  de: 'languageNameGerman'
};
const storageKeys = {
  language: 'plateBlurLanguage',
  theme: 'plateBlurTheme',
  session: 'plateBlurSession'
};
const applicationBaseUrl = new URL('./', import.meta.url);
const overlayImageUrl = new URL('./assets/AMG-overlay.png', applicationBaseUrl).href;
const modelFileUrl = new URL('./models/license-plate-finetune-v1s.onnx', applicationBaseUrl).href;
const runtimeScriptUrl = new URL('./vendor/onnxruntime-web/ort.wasm.min.js', applicationBaseUrl).href;
const runtimeAssetBaseUrl = new URL('./vendor/onnxruntime-web/', applicationBaseUrl).href;
const elements = {
  input: document.getElementById('photoInput'),
  photoSelectionSummary: document.getElementById('photoSelectionSummary'),
  photoPositionBadge: document.getElementById('photoPositionBadge'),
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
  language: document.getElementById('languageSelect'),
  themeToggle: document.getElementById('themeToggleBtn'),
  themeToggleText: document.getElementById('themeToggleText'),
  mode: document.getElementById('redactionMode'),
  blurSlider: document.getElementById('blurSlider'),
  zoomSlider: document.getElementById('zoomSlider'),
  canvas: document.getElementById('editorCanvas'),
  canvasWrap: document.getElementById('canvasWrap'),
  boxList: document.getElementById('boxList')
};
const canvasContext = elements.canvas.getContext('2d');
const blurSourceCanvas = document.createElement('canvas');
const blurSourceContext = blurSourceCanvas.getContext('2d', { willReadFrequently: true });
const blurCanvas = document.createElement('canvas');
const blurContext = blurCanvas.getContext('2d');
const modelCanvas = document.createElement('canvas');
const modelContext = modelCanvas.getContext('2d', { willReadFrequently: true });
const browserSupported = Boolean(
  canvasContext &&
  blurSourceContext &&
  blurContext &&
  modelContext &&
  typeof window.Promise !== 'undefined' &&
  typeof window.PointerEvent !== 'undefined' &&
  typeof window.URL !== 'undefined' &&
  typeof window.URL.createObjectURL === 'function' &&
  typeof window.Uint8Array !== 'undefined' &&
  typeof window.Float32Array !== 'undefined' &&
  typeof window.WebAssembly !== 'undefined' &&
  typeof HTMLCanvasElement !== 'undefined' &&
  typeof HTMLCanvasElement.prototype.toBlob === 'function'
);

let currentLanguage = getInitialLanguage();
let currentTheme = getInitialTheme();
let currentStatusKey = 'statusSelectPhoto';
let currentStatusValues = {};
let currentStatusTone = 'info';
let batchImages = [];
let currentIndex = 0;
let batchState = {};
let currentFileKey = '';
let originalImage = null;
let imageName = 'blurred-photo.jpg';
let redactionMode = elements.mode.value;
let fitScale = 1;
let viewScale = 1;
let shapes = [];
let selectedId = null;
let dragState = null;
let hoverHandle = null;
let hoveredShape = null;
let isDragging = false;
let isBusy = false;
let latestLoadRequestId = 0;
let blurCacheSignature = '';

const overlayState = {
  image: null,
  promise: null,
  failed: false
};
const runtimeState = {
  ort: null,
  promise: null,
  failed: false
};
const modelState = {
  session: null,
  promise: null,
  failed: false
};

function normalizeLanguageCode(languageCode) {
  if (typeof languageCode !== 'string' || !languageCode) {
    return 'en';
  }
  const normalizedCode = languageCode.toLowerCase().split('-')[0];
  return supportedLanguageCodes.includes(normalizedCode) ? normalizedCode : 'en';
}

function readStoredValue(storageKey) {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function writeStoredValue(storageKey, storageValue) {
  try {
    window.localStorage.setItem(storageKey, storageValue);
  } catch {
    return;
  }
}

function getInitialLanguage() {
  const storedLanguage = readStoredValue(storageKeys.language);
  if (typeof storedLanguage === 'string' && storedLanguage) {
    return normalizeLanguageCode(storedLanguage);
  }
  return 'en';
}

function getInitialTheme() {
  return readStoredValue(storageKeys.theme) === 'dark' ? 'dark' : 'light';
}

function translate(translationKey, values = {}) {
  const selectedTranslations = translations[currentLanguage] || translations.en;
  const template = selectedTranslations[translationKey] ?? translations.en[translationKey] ?? translationKey;
  return template.replace(/\{(\w+)\}/g, (match, valueKey) => {
    if (Object.prototype.hasOwnProperty.call(values, valueKey)) {
      return String(values[valueKey]);
    }
    return match;
  });
}

function updateLanguageSelectorOptions() {
  Array.from(elements.language.options).forEach(option => {
    option.textContent = translate(languageOptionKeys[option.value]);
  });
}

function applyTheme() {
  document.documentElement.dataset.theme = currentTheme;
}

function updateThemeToggle() {
  elements.themeToggle.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
  elements.themeToggleText.textContent = translate(currentTheme === 'dark' ? 'themeDark' : 'themeLight');
}

function refreshStatus() {
  elements.status.textContent = translate(currentStatusKey, currentStatusValues);
  elements.status.dataset.tone = currentStatusTone;
}

function setStatus(statusKey, values = {}, tone = 'info') {
  currentStatusKey = statusKey;
  currentStatusValues = values;
  currentStatusTone = tone;
  refreshStatus();
}

function updateStaticText() {
  document.documentElement.lang = currentLanguage;
  document.title = translate('appTitle');
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = translate(element.dataset.i18n);
  });
  applyTheme();
  updateThemeToggle();
  updateLanguageSelectorOptions();
  elements.language.value = currentLanguage;
  elements.mode.value = redactionMode;
  updatePhotoSelectionSummary();
  updatePhotoPositionBadge();
  updateBoxList();
  refreshStatus();
}

function setLanguage(languageCode) {
  currentLanguage = normalizeLanguageCode(languageCode);
  writeStoredValue(storageKeys.language, currentLanguage);
  updateStaticText();
}

function setTheme(themeValue) {
  currentTheme = themeValue === 'dark' ? 'dark' : 'light';
  writeStoredValue(storageKeys.theme, currentTheme);
  applyTheme();
  updateThemeToggle();
}

function createUniqueId() {
  const cryptoSource = globalThis.crypto;
  if (cryptoSource && typeof cryptoSource.randomUUID === 'function') {
    return cryptoSource.randomUUID();
  }
  const randomBytes = new Uint8Array(16);
  if (cryptoSource && typeof cryptoSource.getRandomValues === 'function') {
    cryptoSource.getRandomValues(randomBytes);
  } else {
    for (let index = 0; index < randomBytes.length; index += 1) {
      randomBytes[index] = Math.floor(Math.random() * 256);
    }
  }
  randomBytes[6] = (randomBytes[6] & 15) | 64;
  randomBytes[8] = (randomBytes[8] & 63) | 128;
  const hexSegments = Array.from(randomBytes, value => value.toString(16).padStart(2, '0'));
  return [
    hexSegments.slice(0, 4).join(''),
    hexSegments.slice(4, 6).join(''),
    hexSegments.slice(6, 8).join(''),
    hexSegments.slice(8, 10).join(''),
    hexSegments.slice(10, 16).join('')
  ].join('-');
}

function point(x, y) {
  return { x, y };
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function clonePoints(pointList) {
  return pointList.map(pointValue => ({
    x: pointValue.x,
    y: pointValue.y
  }));
}

function cloneShapes(shapeList) {
  return shapeList.map(shape => ({
    id: shape.id,
    labelKey: shape.labelKey,
    confidence: shape.confidence,
    points: clonePoints(shape.points)
  }));
}

function createRectangleShape(x, y, width, height, labelKey = 'manual', confidence = null) {
  return {
    id: createUniqueId(),
    labelKey,
    confidence,
    points: [
      point(x, y),
      point(x + width, y),
      point(x + width, y + height),
      point(x, y + height)
    ]
  };
}

function normalizeStoredShapes(candidateShapes) {
  if (!Array.isArray(candidateShapes)) {
    return [];
  }
  return candidateShapes
    .map(shape => {
      if (!shape || !Array.isArray(shape.points) || shape.points.length < 3) {
        return null;
      }
      const normalizedPoints = shape.points.map(pointValue => ({
        x: Number(pointValue?.x) || 0,
        y: Number(pointValue?.y) || 0
      }));
      const derivedLabelKey = typeof shape.labelKey === 'string'
        ? shape.labelKey
        : String(shape.label || '').toLowerCase().includes('plate')
          ? 'plate'
          : 'manual';
      const derivedConfidence = typeof shape.confidence === 'number'
        ? shape.confidence
        : typeof shape.score === 'number'
          ? shape.score
          : null;
      return {
        id: typeof shape.id === 'string' && shape.id ? shape.id : createUniqueId(),
        labelKey: derivedLabelKey,
        confidence: derivedConfidence,
        points: normalizedPoints
      };
    })
    .filter(Boolean);
}

function getFileIdentity(file) {
  return [file.name, file.size, file.lastModified].join(':');
}

function getShapeLabel(shape) {
  return translate(shape.labelKey === 'plate' ? 'shapePlate' : 'shapeManual');
}

function getCurrentEditorState() {
  return {
    shapes: cloneShapes(shapes),
    selectedId
  };
}

function saveBatchStateForCurrentFile() {
  if (!currentFileKey) {
    return;
  }
  batchState[currentFileKey] = getCurrentEditorState();
}

function saveSessionState() {
  if (!currentFileKey) {
    return;
  }
  writeStoredValue(storageKeys.session, JSON.stringify({
    fileKey: currentFileKey,
    shapes: cloneShapes(shapes),
    selectedId
  }));
}

function restoreSessionState(fileKey) {
  shapes = [];
  selectedId = null;
  const rawValue = readStoredValue(storageKeys.session);
  if (!rawValue) {
    return;
  }
  try {
    const sessionState = JSON.parse(rawValue);
    if (sessionState.fileKey !== fileKey) {
      return;
    }
    shapes = normalizeStoredShapes(sessionState.shapes);
    selectedId = typeof sessionState.selectedId === 'string' ? sessionState.selectedId : null;
  } catch (error) {
    console.error(error);
  }
}

function persistCurrentEditorState() {
  saveBatchStateForCurrentFile();
  saveSessionState();
}

function updatePhotoSelectionSummary() {
  if (!batchImages.length) {
    elements.photoSelectionSummary.textContent = translate('photoSelectionEmpty');
    return;
  }
  if (batchImages.length === 1) {
    elements.photoSelectionSummary.textContent = translate('photoSelectionSingle', {
      name: batchImages[0].name
    });
    return;
  }
  elements.photoSelectionSummary.textContent = translate('photoSelectionMultiple', {
    count: batchImages.length
  });
}

function updatePhotoPositionBadge() {
  if (!originalImage || batchImages.length <= 1) {
    elements.photoPositionBadge.hidden = true;
    elements.photoPositionBadge.textContent = '';
    return;
  }
  elements.photoPositionBadge.hidden = false;
  elements.photoPositionBadge.textContent = `${currentIndex + 1} / ${batchImages.length}`;
}

function setBusyState(nextBusyState) {
  isBusy = nextBusyState;
  document.body.dataset.busy = nextBusyState ? 'true' : 'false';
  updateControls();
}

function updateControls() {
  if (!browserSupported) {
    elements.input.disabled = true;
    elements.autoDetect.disabled = true;
    elements.autoDetectAll.disabled = true;
    elements.addBox.disabled = true;
    elements.clearBoxes.disabled = true;
    elements.deleteBox.disabled = true;
    elements.save.disabled = true;
    elements.saveAll.disabled = true;
    elements.prev.disabled = true;
    elements.next.disabled = true;
    elements.removePhoto.disabled = true;
    elements.mode.disabled = true;
    elements.blurSlider.disabled = true;
    elements.zoomSlider.disabled = true;
    elements.language.disabled = false;
    elements.themeToggle.disabled = false;
    return;
  }
  const hasImage = Boolean(originalImage);
  const hasMultipleImages = batchImages.length > 1;
  elements.input.disabled = isBusy;
  elements.autoDetect.disabled = !hasImage || isBusy;
  elements.autoDetectAll.disabled = !hasImage || !hasMultipleImages || isBusy;
  elements.addBox.disabled = !hasImage || isBusy;
  elements.clearBoxes.disabled = !hasImage || isBusy;
  elements.deleteBox.disabled = !hasImage || isBusy || !selectedId;
  elements.save.disabled = !hasImage || isBusy;
  elements.saveAll.disabled = !hasImage || !hasMultipleImages || isBusy;
  elements.prev.disabled = !hasImage || isBusy || currentIndex === 0;
  elements.next.disabled = !hasImage || isBusy || currentIndex >= batchImages.length - 1;
  elements.removePhoto.disabled = !hasImage || isBusy;
  elements.mode.disabled = !hasImage || isBusy;
  elements.blurSlider.disabled = !hasImage || isBusy || redactionMode !== 'blur';
  elements.zoomSlider.disabled = !hasImage;
  elements.language.disabled = false;
  elements.themeToggle.disabled = false;
}

function updateBoxList() {
  elements.boxList.innerHTML = '';
  if (!shapes.length) {
    const emptyState = document.createElement('div');
    emptyState.className = 'muted';
    emptyState.textContent = translate('noShapesYet');
    elements.boxList.appendChild(emptyState);
    return;
  }
  shapes.forEach((shape, index) => {
    const itemButton = document.createElement('button');
    itemButton.type = 'button';
    itemButton.className = shape.id === selectedId ? 'box-item selected' : 'box-item';
    const confidenceText = shape.confidence == null
      ? ''
      : translate('shapeConfidence', { confidence: Math.round(shape.confidence * 100) });
    itemButton.textContent = translate('boxListItem', {
      index: index + 1,
      label: getShapeLabel(shape),
      confidence: confidenceText
    });
    itemButton.addEventListener('click', () => {
      selectedId = shape.id;
      updateBoxList();
      updateControls();
      render();
      saveSessionState();
    });
    elements.boxList.appendChild(itemButton);
  });
}

function fitToViewport() {
  if (!originalImage) {
    return;
  }
  const padding = 20;
  const availableWidth = Math.max(200, elements.canvasWrap.clientWidth - padding);
  const availableHeight = Math.max(320, window.innerHeight * 0.7);
  fitScale = Math.min(availableWidth / originalImage.width, availableHeight / originalImage.height, 1);
  viewScale = fitScale * (Number(elements.zoomSlider.value) / 100);
  elements.canvas.width = Math.max(1, Math.round(originalImage.width * viewScale));
  elements.canvas.height = Math.max(1, Math.round(originalImage.height * viewScale));
  render();
}

function imageToCanvasPoint(clientX, clientY) {
  const canvasBounds = elements.canvas.getBoundingClientRect();
  return {
    x: (clientX - canvasBounds.left) / viewScale,
    y: (clientY - canvasBounds.top) / viewScale
  };
}

function polygonPath(context, pointList, scale = 1) {
  context.beginPath();
  context.moveTo(pointList[0].x * scale, pointList[0].y * scale);
  for (let index = 1; index < pointList.length; index += 1) {
    context.lineTo(pointList[index].x * scale, pointList[index].y * scale);
  }
  context.closePath();
}

function pointInPolygon(targetPoint, pointList) {
  let inside = false;
  for (let index = 0, previousIndex = pointList.length - 1; index < pointList.length; previousIndex = index, index += 1) {
    const currentPoint = pointList[index];
    const previousPoint = pointList[previousIndex];
    const intersects = ((currentPoint.y > targetPoint.y) !== (previousPoint.y > targetPoint.y)) &&
      (targetPoint.x < (previousPoint.x - currentPoint.x) * (targetPoint.y - currentPoint.y) / ((previousPoint.y - currentPoint.y) || 1e-9) + currentPoint.x);
    if (intersects) {
      inside = !inside;
    }
  }
  return inside;
}

function distance(firstPoint, secondPoint) {
  return Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y);
}

function findHandle(targetPoint) {
  const handleRadius = 12 / viewScale;
  for (const shape of [...shapes].reverse()) {
    for (let index = 0; index < shape.points.length; index += 1) {
      if (distance(targetPoint, shape.points[index]) <= handleRadius) {
        return { shape, index };
      }
    }
  }
  return null;
}

function findShape(targetPoint) {
  for (const shape of [...shapes].reverse()) {
    if (pointInPolygon(targetPoint, shape.points)) {
      return shape;
    }
  }
  return null;
}

function blurAmount() {
  return Number(elements.blurSlider.value);
}

function buildBlurLayer() {
  if (!originalImage) {
    return;
  }
  const blurSignature = [currentFileKey || imageName, originalImage.width, originalImage.height, blurAmount()].join(':');
  if (
    blurCacheSignature === blurSignature &&
    blurCanvas.width === originalImage.width &&
    blurCanvas.height === originalImage.height
  ) {
    return;
  }
  blurCacheSignature = blurSignature;
  blurCanvas.width = originalImage.width;
  blurCanvas.height = originalImage.height;
  const scaleFactor = Math.max(0.02, 1 / (1 + blurAmount() / 1.4));
  const sampleWidth = Math.max(6, Math.round(originalImage.width * scaleFactor));
  const sampleHeight = Math.max(6, Math.round(originalImage.height * scaleFactor));
  blurSourceCanvas.width = sampleWidth;
  blurSourceCanvas.height = sampleHeight;
  blurSourceContext.imageSmoothingEnabled = true;
  blurSourceContext.clearRect(0, 0, sampleWidth, sampleHeight);
  blurSourceContext.drawImage(originalImage, 0, 0, sampleWidth, sampleHeight);
  blurContext.clearRect(0, 0, blurCanvas.width, blurCanvas.height);
  blurContext.imageSmoothingEnabled = true;
  for (let iteration = 0; iteration < 4; iteration += 1) {
    blurContext.drawImage(blurSourceCanvas, 0, 0, sampleWidth, sampleHeight, 0, 0, blurCanvas.width, blurCanvas.height);
    if (iteration < 3) {
      blurSourceContext.clearRect(0, 0, sampleWidth, sampleHeight);
      blurSourceContext.drawImage(blurCanvas, 0, 0, blurCanvas.width, blurCanvas.height, 0, 0, sampleWidth, sampleHeight);
    }
  }
}

function drawOverlayRect(context, shape, scale) {
  const xValues = shape.points.map(pointValue => pointValue.x);
  const yValues = shape.points.map(pointValue => pointValue.y);
  const minimumX = Math.min(...xValues) * scale;
  const minimumY = Math.min(...yValues) * scale;
  const maximumX = Math.max(...xValues) * scale;
  const maximumY = Math.max(...yValues) * scale;
  const width = maximumX - minimumX;
  const height = maximumY - minimumY;
  if (overlayState.image) {
    context.drawImage(overlayState.image, minimumX, minimumY, width, height);
    return;
  }
  context.fillStyle = overlayState.failed ? 'rgba(17, 24, 39, 0.92)' : 'rgba(17, 24, 39, 0.68)';
  context.fillRect(minimumX, minimumY, width, height);
}

function render() {
  canvasContext.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
  if (!originalImage) {
    return;
  }
  canvasContext.drawImage(originalImage, 0, 0, elements.canvas.width, elements.canvas.height);
  if (redactionMode === 'blur') {
    buildBlurLayer();
  }
  shapes.forEach(shape => {
    canvasContext.save();
    polygonPath(canvasContext, shape.points, viewScale);
    canvasContext.clip();
    if (redactionMode === 'blur') {
      canvasContext.drawImage(blurCanvas, 0, 0, blurCanvas.width * viewScale, blurCanvas.height * viewScale);
    } else {
      drawOverlayRect(canvasContext, shape, viewScale);
    }
    canvasContext.restore();
  });
  shapes.forEach(shape => {
    const isSelected = shape.id === selectedId;
    canvasContext.save();
    polygonPath(canvasContext, shape.points, viewScale);
    canvasContext.lineWidth = isSelected ? 4 : 3;
    canvasContext.strokeStyle = isSelected ? '#2563eb' : '#ef4444';
    canvasContext.stroke();
    shape.points.forEach((pointValue, pointIndex) => {
      canvasContext.beginPath();
      canvasContext.arc(pointValue.x * viewScale, pointValue.y * viewScale, isSelected ? 7 : 6, 0, Math.PI * 2);
      canvasContext.fillStyle = hoverHandle && hoverHandle.shape.id === shape.id && hoverHandle.index === pointIndex ? '#111827' : '#ffffff';
      canvasContext.fill();
      canvasContext.lineWidth = 3;
      canvasContext.strokeStyle = isSelected ? '#2563eb' : '#ef4444';
      canvasContext.stroke();
    });
    canvasContext.restore();
  });
}

function resetCanvas() {
  canvasContext.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
}

function sameHandle(firstHandle, secondHandle) {
  return Boolean(
    firstHandle &&
    secondHandle &&
    firstHandle.shape.id === secondHandle.shape.id &&
    firstHandle.index === secondHandle.index
  ) || (!firstHandle && !secondHandle);
}

function sameShape(firstShape, secondShape) {
  return Boolean(firstShape && secondShape && firstShape.id === secondShape.id) || (!firstShape && !secondShape);
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('blob-failed'));
      }
    }, mimeType, quality);
  });
}

function loadImageFromUrl(imageUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('image-load-failed'));
    image.src = imageUrl;
  });
}

async function createResizedPreview(sourceImage) {
  const largestEdge = Math.max(sourceImage.width, sourceImage.height);
  if (largestEdge <= 1200) {
    return sourceImage;
  }
  const scale = 1200 / largestEdge;
  const resizedWidth = Math.round(sourceImage.width * scale);
  const resizedHeight = Math.round(sourceImage.height * scale);
  const resizeCanvas = document.createElement('canvas');
  resizeCanvas.width = resizedWidth;
  resizeCanvas.height = resizedHeight;
  const resizeContext = resizeCanvas.getContext('2d');
  resizeContext.drawImage(sourceImage, 0, 0, resizedWidth, resizedHeight);
  const resizedBlob = await canvasToBlob(resizeCanvas, 'image/jpeg', 0.9);
  const resizedUrl = URL.createObjectURL(resizedBlob);
  try {
    return await loadImageFromUrl(resizedUrl);
  } finally {
    setTimeout(() => URL.revokeObjectURL(resizedUrl), 1000);
  }
}

async function loadFile(file, options = {}) {
  if (!file) {
    return;
  }
  const { skipStatus = false, keepZoom = false } = options;
  const loadRequestId = ++latestLoadRequestId;
  const objectUrl = URL.createObjectURL(file);
  currentFileKey = getFileIdentity(file);
  imageName = file.name || 'photo.jpg';
  blurCacheSignature = '';
  try {
    const loadedImage = await loadImageFromUrl(objectUrl);
    const resizedImage = await createResizedPreview(loadedImage);
    if (loadRequestId !== latestLoadRequestId) {
      return;
    }
    originalImage = resizedImage;
    if (batchState[currentFileKey]) {
      shapes = normalizeStoredShapes(batchState[currentFileKey].shapes);
      selectedId = typeof batchState[currentFileKey].selectedId === 'string' ? batchState[currentFileKey].selectedId : null;
    } else {
      restoreSessionState(currentFileKey);
    }
    if (!keepZoom) {
      elements.zoomSlider.value = '100';
    }
    hoverHandle = null;
    hoveredShape = null;
    updatePhotoPositionBadge();
    updateControls();
    updateBoxList();
    fitToViewport();
    saveSessionState();
    if (!skipStatus) {
      setStatus('statusLoadedPhoto', {
        current: currentIndex + 1,
        total: batchImages.length || 1,
        name: imageName
      }, 'info');
    }
  } catch (error) {
    console.error(error);
    if (loadRequestId !== latestLoadRequestId) {
      return;
    }
    originalImage = null;
    shapes = [];
    selectedId = null;
    updatePhotoPositionBadge();
    updateControls();
    updateBoxList();
    resetCanvas();
    setStatus(error.message === 'blob-failed' ? 'statusResizedImageLoadFailed' : 'statusImageLoadFailed', {}, 'error');
  } finally {
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}

async function loadCurrentBatchImage(options = {}) {
  if (!batchImages.length) {
    return;
  }
  await loadFile(batchImages[currentIndex], options);
}

function ensureCurrentImageAvailable() {
  if (originalImage) {
    return true;
  }
  setStatus('statusWaitingForImage', {}, 'error');
  return false;
}

function loadScript(scriptUrl, attributeName) {
  return new Promise((resolve, reject) => {
    const selector = `script[${attributeName}]`;
    const existingScript = document.querySelector(selector);
    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        resolve();
        return;
      }
      if (existingScript.dataset.failed === 'true') {
        existingScript.remove();
      } else {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('script-load-failed')), { once: true });
        return;
      }
    }
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.setAttribute(attributeName, 'true');
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => {
      script.dataset.failed = 'true';
      reject(new Error('script-load-failed'));
    }, { once: true });
    document.head.appendChild(script);
  });
}

async function ensureOrtRuntime() {
  if (runtimeState.ort) {
    return runtimeState.ort;
  }
  if (runtimeState.promise) {
    return runtimeState.promise;
  }
  setStatus('statusLoadingRuntime', {}, 'loading');
  runtimeState.promise = loadScript(runtimeScriptUrl, 'data-onnxruntime-web')
    .then(() => {
      if (!window.ort) {
        throw new Error('runtime-missing');
      }
      window.ort.env.wasm.proxy = false;
      window.ort.env.wasm.wasmPaths = runtimeAssetBaseUrl;
      window.ort.env.wasm.numThreads = window.crossOriginIsolated
        ? Math.min(4, Math.max(1, Math.ceil((navigator.hardwareConcurrency || 1) / 2)))
        : 1;
      runtimeState.ort = window.ort;
      runtimeState.failed = false;
      setStatus('statusRuntimeReady', {}, 'ready');
      return runtimeState.ort;
    })
    .catch(error => {
      console.error(error);
      runtimeState.failed = true;
      setStatus('statusRuntimeFailed', {}, 'error');
      throw error;
    })
    .finally(() => {
      runtimeState.promise = null;
    });
  return runtimeState.promise;
}

async function ensurePlateModel() {
  if (modelState.session) {
    return modelState.session;
  }
  if (modelState.promise) {
    return modelState.promise;
  }
  const ort = await ensureOrtRuntime();
  setStatus('statusLoadingModel', {}, 'loading');
  modelState.promise = ort.InferenceSession.create(modelFileUrl, {
    executionProviders: ['wasm']
  })
    .then(session => {
      modelState.session = session;
      modelState.failed = false;
      setStatus('statusModelReady', {}, 'ready');
      return session;
    })
    .catch(error => {
      console.error(error);
      modelState.failed = true;
      setStatus('statusModelFailed', {}, 'error');
      throw error;
    })
    .finally(() => {
      modelState.promise = null;
    });
  return modelState.promise;
}

async function ensureOverlayImage() {
  if (overlayState.image) {
    return overlayState.image;
  }
  if (overlayState.promise) {
    return overlayState.promise;
  }
  setStatus('statusLoadingOverlay', {}, 'loading');
  overlayState.promise = new Promise((resolve, reject) => {
    const overlayImage = new Image();
    overlayImage.decoding = 'async';
    overlayImage.onload = () => {
      overlayState.image = overlayImage;
      overlayState.failed = false;
      setStatus('statusOverlayReady', {}, 'ready');
      render();
      resolve(overlayImage);
    };
    overlayImage.onerror = () => {
      overlayState.failed = true;
      setStatus('statusOverlayFailed', {}, 'error');
      render();
      reject(new Error('overlay-load-failed'));
    };
    overlayImage.src = overlayImageUrl;
  }).finally(() => {
    overlayState.promise = null;
  });
  return overlayState.promise;
}

function createModelTensor(ort, imageSource) {
  const inputSize = 640;
  modelCanvas.width = inputSize;
  modelCanvas.height = inputSize;
  modelContext.clearRect(0, 0, inputSize, inputSize);
  modelContext.drawImage(imageSource, 0, 0, inputSize, inputSize);
  const imageData = modelContext.getImageData(0, 0, inputSize, inputSize).data;
  const pixelCount = inputSize * inputSize;
  const tensorData = new Float32Array(pixelCount * 3);
  for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += 1) {
    tensorData[pixelIndex] = imageData[pixelIndex * 4] / 255;
    tensorData[pixelCount + pixelIndex] = imageData[pixelIndex * 4 + 1] / 255;
    tensorData[pixelCount * 2 + pixelIndex] = imageData[pixelIndex * 4 + 2] / 255;
  }
  return new ort.Tensor('float32', tensorData, [1, 3, inputSize, inputSize]);
}

function calculateIntersectionOverUnion(firstBox, secondBox) {
  const left = Math.max(firstBox.x, secondBox.x);
  const top = Math.max(firstBox.y, secondBox.y);
  const right = Math.min(firstBox.x + firstBox.boxWidth, secondBox.x + secondBox.boxWidth);
  const bottom = Math.min(firstBox.y + firstBox.boxHeight, secondBox.y + secondBox.boxHeight);
  const intersectionWidth = Math.max(0, right - left);
  const intersectionHeight = Math.max(0, bottom - top);
  const intersection = intersectionWidth * intersectionHeight;
  const firstArea = firstBox.boxWidth * firstBox.boxHeight;
  const secondArea = secondBox.boxWidth * secondBox.boxHeight;
  const union = firstArea + secondArea - intersection;
  return union > 0 ? intersection / union : 0;
}

function parseDetections(outputTensor) {
  if (!originalImage || !outputTensor || !outputTensor.data) {
    return [];
  }
  const rawData = outputTensor.data;
  const outputDimensions = Array.isArray(outputTensor.dims) ? outputTensor.dims : [];
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
  const scaleX = originalImage.width / 640;
  const scaleY = originalImage.height / 640;
  const detections = [];
  for (let detectionIndex = 0; detectionIndex < detectionCount; detectionIndex += 1) {
    let centerX;
    let centerY;
    let width;
    let height;
    let score;
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
    const x = clamp((centerX - width / 2) * scaleX, 0, originalImage.width);
    const y = clamp((centerY - height / 2) * scaleY, 0, originalImage.height);
    detections.push({
      score,
      x,
      y,
      boxWidth: clamp(scaledWidth, 0, originalImage.width),
      boxHeight: clamp(scaledHeight, 0, originalImage.height)
    });
  }
  detections.sort((firstDetection, secondDetection) => secondDetection.score - firstDetection.score);
  const filteredDetections = [];
  for (const detection of detections) {
    const overlapsExisting = filteredDetections.some(filteredDetection => calculateIntersectionOverUnion(detection, filteredDetection) > 0.5);
    if (!overlapsExisting) {
      filteredDetections.push(detection);
    }
    if (filteredDetections.length >= 5) {
      break;
    }
  }
  return filteredDetections;
}

async function detectPlateBoxes() {
  const session = await ensurePlateModel();
  const ort = runtimeState.ort;
  const inputTensor = createModelTensor(ort, originalImage);
  const inputName = session.inputNames?.[0] || 'images';
  const result = await session.run({ [inputName]: inputTensor });
  const outputName = session.outputNames?.[0] || Object.keys(result)[0];
  return parseDetections(result[outputName]);
}

function applyDetectedShapes(detections) {
  shapes = detections.map(detection => createRectangleShape(
    detection.x,
    detection.y,
    detection.boxWidth,
    detection.boxHeight,
    'plate',
    detection.score
  ));
  selectedId = shapes[0]?.id || null;
  updateBoxList();
  updateControls();
  render();
  persistCurrentEditorState();
}

function addDefaultBox() {
  if (!ensureCurrentImageAvailable()) {
    return;
  }
  const width = originalImage.width * 0.2;
  const height = originalImage.height * 0.08;
  const x = (originalImage.width - width) / 2;
  const y = (originalImage.height - height) / 2;
  const newShape = createRectangleShape(x, y, width, height);
  shapes.push(newShape);
  selectedId = newShape.id;
  updateBoxList();
  updateControls();
  render();
  persistCurrentEditorState();
}

function clearBoxesForCurrentPhoto() {
  if (!batchImages.length) {
    return;
  }
  shapes = [];
  selectedId = null;
  updateBoxList();
  updateControls();
  render();
  persistCurrentEditorState();
  setStatus('statusBoxesCleared', {}, 'info');
}

function deleteSelectedBox() {
  if (!selectedId) {
    return;
  }
  shapes = shapes.filter(shape => shape.id !== selectedId);
  selectedId = shapes[0]?.id || null;
  updateBoxList();
  updateControls();
  render();
  persistCurrentEditorState();
}

function resetEditorForEmptyBatch() {
  originalImage = null;
  imageName = '';
  currentFileKey = '';
  shapes = [];
  selectedId = null;
  currentIndex = 0;
  blurCacheSignature = '';
  hoverHandle = null;
  hoveredShape = null;
  updatePhotoSelectionSummary();
  updatePhotoPositionBadge();
  updateControls();
  updateBoxList();
  resetCanvas();
  elements.input.value = '';
  setStatus('statusNoPhotosInBatch', {}, 'info');
}

async function navigateBatch(nextIndex) {
  if (nextIndex < 0 || nextIndex >= batchImages.length || isBusy) {
    return;
  }
  persistCurrentEditorState();
  setBusyState(true);
  try {
    currentIndex = nextIndex;
    await loadCurrentBatchImage();
  } finally {
    setBusyState(false);
  }
}

async function removeCurrentPhoto() {
  if (!batchImages.length || isBusy) {
    return;
  }
  const removedName = batchImages[currentIndex].name;
  delete batchState[currentFileKey];
  batchImages.splice(currentIndex, 1);
  updatePhotoSelectionSummary();
  if (!batchImages.length) {
    resetEditorForEmptyBatch();
    return;
  }
  if (currentIndex >= batchImages.length) {
    currentIndex = batchImages.length - 1;
  }
  setBusyState(true);
  try {
    await loadCurrentBatchImage({ skipStatus: true });
    setStatus('statusPhotoRemoved', { name: removedName }, 'info');
  } finally {
    setBusyState(false);
  }
}

function buildDownloadName() {
  const filenameBase = imageName ? imageName.replace(/\.[^.]+$/, '') : 'photo';
  const modeSuffix = redactionMode === 'blur' ? 'blurred' : 'amg';
  return `${currentIndex + 1}-${filenameBase}-${modeSuffix}.jpg`;
}

function downloadBlob(blob, filename) {
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

async function saveCurrentPhotoCopy(options = {}) {
  const { skipStatus = false } = options;
  if (!ensureCurrentImageAvailable()) {
    return false;
  }
  try {
    if (redactionMode === 'amg') {
      if (!skipStatus) {
        setStatus('statusLoadingOverlay', {}, 'loading');
      }
      await ensureOverlayImage();
      if (!overlayState.image) {
        throw new Error('overlay-missing');
      }
    }
    if (!skipStatus) {
      setStatus('statusSaving', {}, 'loading');
    }
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = originalImage.width;
    exportCanvas.height = originalImage.height;
    const exportContext = exportCanvas.getContext('2d');
    exportContext.drawImage(originalImage, 0, 0);
    if (redactionMode === 'blur') {
      buildBlurLayer();
    }
    shapes.forEach(shape => {
      exportContext.save();
      polygonPath(exportContext, shape.points, 1);
      exportContext.clip();
      if (redactionMode === 'blur') {
        exportContext.drawImage(blurCanvas, 0, 0);
      } else {
        drawOverlayRect(exportContext, shape, 1);
      }
      exportContext.restore();
    });
    const jpegBlob = await canvasToBlob(exportCanvas, 'image/jpeg', 0.95);
    downloadBlob(jpegBlob, buildDownloadName());
    if (!skipStatus) {
      setStatus('statusLoadedPhoto', {
        current: currentIndex + 1,
        total: batchImages.length || 1,
        name: imageName
      }, 'info');
    }
    return true;
  } catch (error) {
    console.error(error);
    if (error.message === 'overlay-missing' || error.message === 'overlay-load-failed') {
      if (currentStatusKey !== 'statusOverlayFailed') {
        setStatus('statusOverlayRequiredForSave', {}, 'error');
      }
    } else {
      setStatus('statusSaveFailed', {}, 'error');
    }
    return false;
  }
}

function delay(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

async function autoDetectCurrentPhoto() {
  if (!ensureCurrentImageAvailable() || isBusy) {
    return;
  }
  setBusyState(true);
  try {
    setStatus('statusAutoDetecting', {}, 'loading');
    const detections = await detectPlateBoxes();
    if (!detections.length) {
      setStatus('statusAutoDetectNone', {}, 'error');
      return;
    }
    applyDetectedShapes(detections);
    setStatus('statusAutoDetectFound', { count: shapes.length }, 'ready');
  } catch (error) {
    console.error(error);
    setStatus('statusAutoDetectFailed', {}, 'error');
  } finally {
    setBusyState(false);
  }
}

async function autoDetectAllPhotos() {
  if (!batchImages.length || isBusy) {
    return;
  }
  persistCurrentEditorState();
  const originalBatchIndex = currentIndex;
  const savedZoomValue = elements.zoomSlider.value;
  setBusyState(true);
  try {
    for (let index = 0; index < batchImages.length; index += 1) {
      currentIndex = index;
      await loadCurrentBatchImage({ skipStatus: true });
      setStatus('statusAutoDetectAllProgress', {
        current: index + 1,
        total: batchImages.length
      }, 'loading');
      const detections = await detectPlateBoxes();
      if (detections.length) {
        applyDetectedShapes(detections);
      } else {
        persistCurrentEditorState();
      }
    }
    currentIndex = Math.min(originalBatchIndex, batchImages.length - 1);
    await loadCurrentBatchImage({ skipStatus: true, keepZoom: true });
    elements.zoomSlider.value = savedZoomValue;
    fitToViewport();
    setStatus('statusAutoDetectAllComplete', {}, 'ready');
  } catch (error) {
    console.error(error);
    currentIndex = Math.min(originalBatchIndex, Math.max(0, batchImages.length - 1));
    if (batchImages.length) {
      await loadCurrentBatchImage({ skipStatus: true, keepZoom: true });
      elements.zoomSlider.value = savedZoomValue;
      fitToViewport();
    }
    setStatus('statusAutoDetectFailed', {}, 'error');
  } finally {
    setBusyState(false);
  }
}

async function saveAllPhotos() {
  if (!batchImages.length || isBusy) {
    return;
  }
  persistCurrentEditorState();
  const originalBatchIndex = currentIndex;
  const savedZoomValue = elements.zoomSlider.value;
  setBusyState(true);
  try {
    for (let index = 0; index < batchImages.length; index += 1) {
      currentIndex = index;
      await loadCurrentBatchImage({ skipStatus: true });
      setStatus('statusSaveAllProgress', {
        current: index + 1,
        total: batchImages.length
      }, 'loading');
      const saveSucceeded = await saveCurrentPhotoCopy({ skipStatus: true });
      if (!saveSucceeded) {
        throw new Error('save-failed');
      }
      await delay(200);
    }
    currentIndex = Math.min(originalBatchIndex, batchImages.length - 1);
    await loadCurrentBatchImage({ skipStatus: true, keepZoom: true });
    elements.zoomSlider.value = savedZoomValue;
    fitToViewport();
    setStatus('statusSaveAllComplete', {}, 'ready');
  } catch (error) {
    console.error(error);
    currentIndex = Math.min(originalBatchIndex, Math.max(0, batchImages.length - 1));
    if (batchImages.length) {
      await loadCurrentBatchImage({ skipStatus: true, keepZoom: true });
      elements.zoomSlider.value = savedZoomValue;
      fitToViewport();
    }
    if (currentStatusKey !== 'statusOverlayRequiredForSave' && currentStatusKey !== 'statusSaveFailed') {
      setStatus('statusSaveFailed', {}, 'error');
    }
  } finally {
    setBusyState(false);
  }
}

function endDrag(pointerId) {
  if (typeof pointerId === 'number') {
    try {
      elements.canvas.releasePointerCapture(pointerId);
    } catch {
      void 0;
    }
  }
  if (!isDragging && !dragState) {
    return;
  }
  isDragging = false;
  dragState = null;
  render();
  persistCurrentEditorState();
}

elements.input.addEventListener('change', async event => {
  const selectedFiles = Array.from(event.target.files || []);
  event.target.value = '';
  if (!selectedFiles.length || isBusy) {
    return;
  }
  batchImages = selectedFiles;
  batchState = {};
  currentIndex = 0;
  updatePhotoSelectionSummary();
  setBusyState(true);
  try {
    await loadCurrentBatchImage();
  } finally {
    setBusyState(false);
  }
});

elements.language.addEventListener('change', event => {
  setLanguage(event.target.value);
});

elements.themeToggle.addEventListener('click', () => {
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

elements.mode.addEventListener('change', async () => {
  redactionMode = elements.mode.value;
  updateControls();
  render();
  saveSessionState();
  if (redactionMode === 'amg') {
    try {
      await ensureOverlayImage();
      render();
    } catch (error) {
      console.error(error);
    }
  }
});

elements.addBox.addEventListener('click', addDefaultBox);
elements.clearBoxes.addEventListener('click', clearBoxesForCurrentPhoto);
elements.deleteBox.addEventListener('click', deleteSelectedBox);
elements.save.addEventListener('click', () => {
  if (!isBusy) {
    saveCurrentPhotoCopy();
  }
});
elements.saveAll.addEventListener('click', saveAllPhotos);
elements.autoDetect.addEventListener('click', autoDetectCurrentPhoto);
elements.autoDetectAll.addEventListener('click', autoDetectAllPhotos);
elements.prev.addEventListener('click', () => navigateBatch(currentIndex - 1));
elements.next.addEventListener('click', () => navigateBatch(currentIndex + 1));
elements.removePhoto.addEventListener('click', removeCurrentPhoto);

elements.blurSlider.addEventListener('input', () => {
  blurCacheSignature = '';
  render();
  saveSessionState();
});

elements.zoomSlider.addEventListener('input', fitToViewport);
window.addEventListener('resize', fitToViewport);

elements.canvas.addEventListener('pointerdown', event => {
  if (!originalImage || isBusy) {
    return;
  }
  isDragging = true;
  if (typeof elements.canvas.setPointerCapture === 'function') {
    elements.canvas.setPointerCapture(event.pointerId);
  }
  const canvasPoint = imageToCanvasPoint(event.clientX, event.clientY);
  const handle = findHandle(canvasPoint);
  if (handle) {
    selectedId = handle.shape.id;
    dragState = {
      type: 'handle',
      shapeId: handle.shape.id,
      index: handle.index
    };
    updateBoxList();
    updateControls();
    render();
    return;
  }
  const shape = findShape(canvasPoint);
  if (shape) {
    selectedId = shape.id;
    dragState = {
      type: 'move',
      shapeId: shape.id,
      start: canvasPoint,
      original: clonePoints(shape.points)
    };
    updateBoxList();
    updateControls();
    render();
    return;
  }
  selectedId = null;
  dragState = null;
  updateBoxList();
  updateControls();
  render();
  saveSessionState();
});

elements.canvas.addEventListener('pointermove', event => {
  if (!originalImage) {
    return;
  }
  const canvasPoint = imageToCanvasPoint(event.clientX, event.clientY);
  const nextHandle = findHandle(canvasPoint);
  const nextHoveredShape = nextHandle ? nextHandle.shape : findShape(canvasPoint);
  elements.canvas.style.cursor = nextHandle ? 'grab' : nextHoveredShape ? 'move' : 'default';
  if (!dragState) {
    const handleChanged = !sameHandle(nextHandle, hoverHandle);
    const shapeChanged = !sameShape(nextHoveredShape, hoveredShape);
    hoverHandle = nextHandle;
    hoveredShape = nextHoveredShape;
    if (handleChanged || shapeChanged) {
      render();
    }
    return;
  }
  const shape = shapes.find(candidateShape => candidateShape.id === dragState.shapeId);
  if (!shape) {
    return;
  }
  if (dragState.type === 'handle') {
    shape.points[dragState.index] = {
      x: clamp(canvasPoint.x, 0, originalImage.width),
      y: clamp(canvasPoint.y, 0, originalImage.height)
    };
  } else {
    const deltaX = canvasPoint.x - dragState.start.x;
    const deltaY = canvasPoint.y - dragState.start.y;
    shape.points = dragState.original.map(originalPoint => ({
      x: clamp(originalPoint.x + deltaX, 0, originalImage.width),
      y: clamp(originalPoint.y + deltaY, 0, originalImage.height)
    }));
  }
  render();
});

elements.canvas.addEventListener('pointerleave', () => {
  if (dragState) {
    return;
  }
  hoverHandle = null;
  hoveredShape = null;
  elements.canvas.style.cursor = 'default';
  render();
});

elements.canvas.addEventListener('pointerup', event => {
  endDrag(event.pointerId);
});

elements.canvas.addEventListener('pointercancel', event => {
  endDrag(event.pointerId);
});

updateStaticText();
document.body.dataset.busy = 'false';
updateControls();
updateBoxList();
if (!browserSupported) {
  setStatus('statusBrowserUnsupported', {}, 'error');
} else {
  setStatus('statusSelectPhoto', {}, 'info');
}
