import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { loadImageFromFile, revokeObjectUrl } from '@/utils/image';
import { detectFaceData } from '@/utils/face';
import { renderTryOn } from '@/utils/render';
import type { Earring, EarringSide, FaceData } from '@/types';
import styles from './PreviewCanvas.module.css';

interface PreviewCanvasProps {
  file: File | null;
  earring: Earring | null;
  side: EarringSide;
  debug: boolean;
  onResult: (data: FaceData | null) => void;
}

const PreviewCanvas = forwardRef<HTMLCanvasElement, PreviewCanvasProps>(
  ({ file, earring, side, debug, onResult }, ref) => {
    const internalRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) ?? internalRef;

    const [selfieImg, setSelfieImg] = useState<HTMLImageElement | null>(null);
    const [faceData, setFaceData] = useState<FaceData | null>(null);
    const [status, setStatus] = useState('Faça upload de uma selfie para começar.');

    // Carrega a imagem quando o ficheiro muda
    useEffect(() => {
      let objectUrl: string | null = null;
      let cancelled = false;

      async function load() {
        if (!file) {
          setSelfieImg(null);
          setFaceData(null);
          onResult(null);
          setStatus('Faça upload de uma selfie para começar.');
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = 900;
            canvas.height = 600;
            canvas.getContext('2d')?.clearRect(0, 0, 900, 600);
          }
          return;
        }

        setStatus('A carregar imagem...');
        try {
          const { img, url } = await loadImageFromFile(file);
          objectUrl = url;
          if (cancelled) return;
          setSelfieImg(img);
          setStatus('Pronto. Clique em Gerar.');
        } catch {
          setStatus('Falha ao carregar a imagem.');
        }
      }

      load();
      return () => {
        cancelled = true;
        if (objectUrl) revokeObjectUrl(objectUrl);
      };
    }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

    const canGenerate = useMemo(() => !!selfieImg && !!earring, [selfieImg, earring]);

    async function generate() {
      const canvas = canvasRef.current;
      if (!canvas || !selfieImg || !earring) return;

      setStatus('A detectar rosto...');
      const fd = await detectFaceData(selfieImg, side);
      setFaceData(fd);
      onResult(fd);

      setStatus(fd.ok ? 'A renderizar...' : fd.error);
      await renderTryOn({ canvas, selfieImg, faceData: fd, earring, side, debug });
      setStatus(fd.ok ? 'Pronto. Pode fazer download.' : fd.error);
    }

    // Re-renderiza quando debug ou side mudam (sem nova detecção facial)
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !selfieImg || !earring || !faceData?.ok) return;
      renderTryOn({ canvas, selfieImg, faceData, earring, side, debug });
    }, [debug, side]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <div className={styles.box}>
        <div className={styles.topRow}>
          <div className={styles.title}>3) Preview</div>
          <button
            className={styles.generateBtn}
            onClick={generate}
            disabled={!canGenerate}
          >
            Gerar
          </button>
        </div>

        <div className={styles.status}>{status}</div>

        <div className={styles.canvasWrap}>
          <canvas ref={canvasRef} className={styles.canvas} />
        </div>
      </div>
    );
  },
);

PreviewCanvas.displayName = 'PreviewCanvas';

export default PreviewCanvas;
