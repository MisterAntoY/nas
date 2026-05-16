export interface Earring {
  id: string;
  name: string;
  /** Caminho para a imagem (relative to public) ou data URI */
  file: string;
  /** Ponto de fixação horizontal do brinco (0–1) */
  anchorX: number;
  /** Ponto de fixação vertical do brinco (0–1) */
  anchorY: number;
  /** Factor de escala relativo à distância entre olhos */
  scaleFactor: number;
  /** Rotação adicional em graus */
  rotOffsetDeg: number;
}

export interface FaceLandmark {
  x: number;
  y: number;
  z: number;
}

export interface FaceDebugPoints {
  leftEye: FaceLandmark;
  rightEye: FaceLandmark;
  nose: FaceLandmark;
  chin: FaceLandmark;
  leftCheek: FaceLandmark;
  rightCheek: FaceLandmark;
}

export interface FaceAnchor {
  x: number;
  y: number;
}

export type EarringSide = 'left' | 'right';

export type FaceData =
  | {
      ok: true;
      landmarks: FaceLandmark[];
      rollRad: number;
      yaw: number;
      eyeDist: number;
      anchor: FaceAnchor;
      debug: FaceDebugPoints;
    }
  | {
      ok: false;
      error: string;
    };
