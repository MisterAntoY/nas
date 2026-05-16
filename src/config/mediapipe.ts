const MEDIAPIPE_VERSION = '0.10.20';

export const MEDIAPIPE_CONFIG = {
  wasmUrl:
    import.meta.env.VITE_MEDIAPIPE_WASM_URL ??
    `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`,

  modelUrl:
    import.meta.env.VITE_MEDIAPIPE_MODEL_URL ??
    'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',

  maxFaces: 1,
  runningMode: 'IMAGE' as const,
} as const;

export const CANVAS_MAX_WIDTH = import.meta.env.VITE_CANVAS_MAX_WIDTH
  ? parseInt(import.meta.env.VITE_CANVAS_MAX_WIDTH, 10)
  : 900;
