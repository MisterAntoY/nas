import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { loadImageFromFile, revokeObjectUrl } from '@/utils/image';
import { detectFaceData } from '@/utils/face';
import { renderTryOn } from '@/utils/render';
import { CANVAS_MAX_WIDTH } from '@/config/mediapipe';
import { useLandmarkerStatus } from '@/hooks/useLandmarkerStatus';
import type { Earring, EarringSide, FaceData } from '@/types';
import styles from './PreviewCanvas.module.css';

interface PreviewCanvasProps {
  file: File | null;
  earring: Earring | null;
  side: EarringSide;
  debug: boolean;
  onResult: (data: FaceData | null) => void;
}

type StatusKind = 'idle' | 'loading' | 'success' | 'error';

function GenerateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm-1 6v4H7l5 5 5-5h-4V8h-2z"/>
    </svg>
  );
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIllustration}>
        <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 7h-3a2 2 0 01-2-2V2"/>
          <path d="M16 2H8a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7z"/>
          <circle cx="10" cy="13" r="2"/>
          <path d="M20 17l-3.3-3.3a1 1 0 00-1.4 0L12 17"/>
        </svg>
      </div>

      <p className={styles.emptyTitle}>Your preview appears here</p>

      <ul className={styles.emptySteps}>
        <li className={styles.emptyStep}>
          <span className={styles.emptyStepNum}>1</span>
          Upload a selfie
        </li>
        <li className={styles.emptyStep}>
          <span className={styles.emptyStepNum}>2</span>
          Choose an earring
        </li>
        <li className={styles.emptyStep}>
          <span className={styles.emptyStepNum}>3</span>
          Tap <strong>Generate</strong>
        </li>
      </ul>

      <div className={styles.emptyNote}>
        <svg className={styles.emptyNoteIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4a3 3 0 110 6 3 3 0 010-6zm0 8c-2 0-6 1-6 3v1h12v-1c0-2-4-3-6-3z"/>
        </svg>
        Photo never leaves your device
      </div>
    </div>
  );
}

const PreviewCanvas = forwardRef<HTMLCanvasElement, PreviewCanvasProps>(
  ({ file, earring, side, debug, onResult }, ref) => {
    const internalRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) ?? internalRef;

    const modelStatus = useLandmarkerStatus();

    const [selfieImg, setSelfieImg] = useState<HTMLImageElement | null>(null);
    const [faceData, setFaceData] = useState<FaceData | null>(null);
    const [status, setStatus] = useState('');
    const [statusKind, setStatusKind] = useState<StatusKind>('idle');

    useEffect(() => {
      let objectUrl: string | null = null;
      let cancelled = false;

      async function load() {
        if (!file) {
          setSelfieImg(null);
          setFaceData(null);
          setStatus('');
          setStatusKind('idle');
          onResult(null);
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = CANVAS_MAX_WIDTH;
            canvas.height = 600;
            canvas.getContext('2d')?.clearRect(0, 0, CANVAS_MAX_WIDTH, 600);
          }
          return;
        }

        setStatus('Loading image…');
        setStatusKind('loading');

        try {
          const { img, url } = await loadImageFromFile(file);
          objectUrl = url;
          if (cancelled) return;

          const canvas = canvasRef.current;
          if (canvas) {
            const scale = Math.min(1, CANVAS_MAX_WIDTH / img.naturalWidth);
            const w = Math.round(img.naturalWidth * scale);
            const h = Math.round(img.naturalHeight * scale);
            canvas.width = w;
            canvas.height = h;
            canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
          }

          setSelfieImg(img);
          setStatus('Choose an earring and tap Generate.');
          setStatusKind('idle');
        } catch {
          setStatus('Failed to load image.');
          setStatusKind('error');
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

      setStatus('Detecting face…');
      setStatusKind('loading');

      const fd = await detectFaceData(selfieImg, side);
      setFaceData(fd);
      onResult(fd);

      if (!fd.ok) {
        setStatus(fd.error);
        setStatusKind('error');
        return;
      }

      setStatus('Rendering…');
      await renderTryOn({ canvas, selfieImg, faceData: fd, earring, side, debug });
      setStatus('Done! Ready to download.');
      setStatusKind('success');
    }

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !selfieImg || !earring || !faceData?.ok) return;
      renderTryOn({ canvas, selfieImg, faceData, earring, side, debug });
    }, [debug, side]); // eslint-disable-line react-hooks/exhaustive-deps

    const dotClass = [
      styles.statusDot,
      statusKind === 'loading' ? styles.statusDotActive : '',
      statusKind === 'success' ? styles.statusDotSuccess : '',
      statusKind === 'error' ? styles.statusDotError : '',
    ].join(' ');

    return (
      <div className={styles.box}>
        <div className={styles.topBar}>
          <div className={styles.sectionHeader}>
            <span className={styles.badge}>4</span>
            <span className={styles.sectionTitle}>Preview</span>
          </div>
        </div>

        {modelStatus === 'loading' && (
          <div className={styles.modelBanner}>
            <span className={styles.modelSpinner} />
            Loading AI model — first run takes a few seconds…
          </div>
        )}
        {modelStatus === 'error' && (
          <div className={`${styles.modelBanner} ${styles.modelBannerError}`}>
            AI model failed to load. Check your connection and try again.
          </div>
        )}

        <div className={styles.canvasArea}>
          {!selfieImg && <EmptyState />}
          <canvas
            ref={canvasRef}
            className={`${styles.canvas} ${!selfieImg ? styles.canvasHidden : ''}`}
          />
        </div>

        <div className={styles.actionBar}>
          <div className={styles.statusWrap}>
            <span className={dotClass} />
            {status && <span className={styles.statusText}>{status}</span>}
          </div>

          <button
            className={styles.generateBtn}
            onClick={generate}
            disabled={!canGenerate}
          >
            <GenerateIcon className={styles.generateIcon} />
            Generate
          </button>
        </div>
      </div>
    );
  },
);

PreviewCanvas.displayName = 'PreviewCanvas';

export default PreviewCanvas;
