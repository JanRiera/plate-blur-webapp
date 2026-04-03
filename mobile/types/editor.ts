export type RedactionMode = 'blur' | 'amg';
export type BoxLabel = 'manual' | 'plate';

export type PlateBox = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: BoxLabel;
  confidence: number | null;
};

export type WorkingPhoto = {
  uri: string;
  width: number;
  height: number;
  fileName: string;
};

export type ModelStatus = 'idle' | 'warming' | 'ready' | 'error';

export type DetectionMetrics = {
  sessionLoadMs: number | null;
  firstDetectMs: number | null;
};
