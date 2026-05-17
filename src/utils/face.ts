import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { MEDIAPIPE_CONFIG } from '@/config/mediapipe';
import type { EarringSide, FaceData, FaceLandmark } from '@/types';

export type LandmarkerStatus = 'idle' | 'loading' | 'ready' | 'error';

type StatusListener = (status: LandmarkerStatus) => void;

let landmarkerPromise: Promise<FaceLandmarker> | null = null;
let currentStatus: LandmarkerStatus = 'idle';
const listeners = new Set<StatusListener>();

function setStatus(s: LandmarkerStatus) {
  currentStatus = s;
  listeners.forEach((fn) => fn(s));
}

export function subscribeLandmarkerStatus(fn: StatusListener): () => void {
  listeners.add(fn);
  fn(currentStatus);
  return () => listeners.delete(fn);
}

export async function getLandmarker(): Promise<FaceLandmarker> {
  if (landmarkerPromise) return landmarkerPromise;

  setStatus('loading');
  landmarkerPromise = (async () => {
    const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_CONFIG.wasmUrl);
    return FaceLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MEDIAPIPE_CONFIG.modelUrl },
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
      runningMode: MEDIAPIPE_CONFIG.runningMode,
      numFaces: MEDIAPIPE_CONFIG.maxFaces,
    });
  })();

  landmarkerPromise
    .then(() => setStatus('ready'))
    .catch(() => {
      setStatus('error');
      landmarkerPromise = null;
    });

  return landmarkerPromise;
}

export function warmupLandmarker(): void {
  getLandmarker().catch(() => undefined);
}

function dist(a: FaceLandmark, b: FaceLandmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export async function detectFaceData(
  img: HTMLImageElement,
  side: EarringSide = 'left',
): Promise<FaceData> {
  let landmarker: FaceLandmarker;

  try {
    landmarker = await getLandmarker();
  } catch {
    return { ok: false, error: 'Failed to load the face detection model. Check your internet connection.' };
  }

  const result = landmarker.detect(img);
  const faces = result?.faceLandmarks;

  if (!faces || faces.length === 0) {
    return { ok: false, error: 'No face detected. Try a well-lit selfie facing the camera.' };
  }

  const lm = faces[0] as FaceLandmark[];

  const leftEye = lm[33];
  const rightEye = lm[263];
  const nose = lm[1];
  const chin = lm[152];
  const leftCheek = lm[234];
  const rightCheek = lm[454];

  const eyeDist = dist(leftEye, rightEye);
  const rollRad = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
  const midEyeX = (leftEye.x + rightEye.x) / 2;
  const yaw = clamp((nose.x - midEyeX) / (eyeDist + 1e-6), -0.6, 0.6);

  const cheek = side === 'left' ? leftCheek : rightCheek;
  const faceHeight = Math.abs(chin.y - (leftEye.y + rightEye.y) / 2);
  const anchor = {
    x: cheek.x,
    y: cheek.y + 0.1 * faceHeight,
  };

  const yawNudge = 0.06 * eyeDist * (side === 'left' ? -yaw : yaw);
  anchor.x = clamp(anchor.x + yawNudge, 0.02, 0.98);

  return {
    ok: true,
    landmarks: lm,
    rollRad,
    yaw,
    eyeDist,
    anchor,
    debug: { leftEye, rightEye, nose, chin, leftCheek, rightCheek },
  };
}
