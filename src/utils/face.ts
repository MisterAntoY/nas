import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { MEDIAPIPE_CONFIG } from '@/config/mediapipe';
import type { EarringSide, FaceData, FaceLandmark } from '@/types';

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

/**
 * Inicializa o FaceLandmarker do MediaPipe de forma lazy e com cache.
 * O primeiro carregamento demora alguns segundos (download do modelo WASM).
 */
export async function getLandmarker(): Promise<FaceLandmarker> {
  if (landmarkerPromise) return landmarkerPromise;

  landmarkerPromise = (async () => {
    const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_CONFIG.wasmUrl);
    return FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MEDIAPIPE_CONFIG.modelUrl,
      },
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
      runningMode: MEDIAPIPE_CONFIG.runningMode,
      numFaces: MEDIAPIPE_CONFIG.maxFaces,
    });
  })();

  return landmarkerPromise;
}

/** Pré-aquece o modelo MediaPipe em background (evita delay na primeira detecção). */
export function warmupLandmarker(): void {
  getLandmarker().catch(() => {
    // Falha silenciosa — será reexperimentado quando o utilizador gerar o preview
  });
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
    return { ok: false, error: 'Falha ao carregar o modelo de detecção facial. Verifique a ligação à internet.' };
  }

  const result = landmarker.detect(img);
  const faces = result?.faceLandmarks;

  if (!faces || faces.length === 0) {
    return { ok: false, error: 'Rosto não detectado. Tente uma selfie com boa iluminação e rosto de frente.' };
  }

  const lm = faces[0] as FaceLandmark[];

  // Índices MediaPipe FaceLandmarker para pontos anatómicos relevantes
  const leftEye = lm[33];
  const rightEye = lm[263];
  const nose = lm[1];
  const chin = lm[152];
  const leftCheek = lm[234];
  const rightCheek = lm[454];

  const eyeDist = dist(leftEye, rightEye);

  // Roll: inclinação da cabeça pela linha dos olhos
  const rollRad = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

  // Yaw: estimativa de rotação horizontal pelo desvio do nariz
  const midEyeX = (leftEye.x + rightEye.x) / 2;
  const yaw = clamp((nose.x - midEyeX) / (eyeDist + 1e-6), -0.6, 0.6);

  // Posição da orelha com offset descendente para alinhar com o lóbulo
  const cheek = side === 'left' ? leftCheek : rightCheek;
  const faceHeight = Math.abs(chin.y - (leftEye.y + rightEye.y) / 2);
  const anchor = {
    x: cheek.x,
    y: cheek.y + 0.1 * faceHeight,
  };

  // Pequeno ajuste de perspectiva pelo yaw
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
