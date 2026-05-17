import { useRef, useMemo, useState, useCallback } from 'react';
import Upload from '@/components/Upload/Upload';
import EarringGallery from '@/components/EarringGallery/EarringGallery';
import OptionsPanel from '@/components/OptionsPanel/OptionsPanel';
import PreviewCanvas from '@/components/PreviewCanvas/PreviewCanvas';
import Hero from '@/components/Hero/Hero';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { ToastContainer, useToast } from '@/components/Toast/Toast';
import { earrings } from '@/data/earrings';
import { exportCanvasToDownload } from '@/utils/render';
import { warmupLandmarker } from '@/utils/face';
import type { EarringSide, FaceData } from '@/types';
import styles from './App.module.css';

warmupLandmarker();

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appSectionRef = useRef<HTMLElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(earrings[0]?.id ?? null);
  const [debug, setDebug] = useState(false);
  const [side, setSide] = useState<EarringSide>('left');
  const [faceDetected, setFaceDetected] = useState(false);

  const { toasts, addToast, dismiss } = useToast();

  const selectedEarring = useMemo(
    () => earrings.find((e) => e.id === selectedId) ?? null,
    [selectedId],
  );

  const canDownload = faceDetected && !!canvasRef.current;

  const scrollToApp = useCallback(() => {
    appSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  async function handleDownload() {
    if (!canvasRef.current) return;
    try {
      await exportCanvasToDownload(canvasRef.current, 'earring-tryon.png');
      addToast('Image saved to your downloads!', 'success');
    } catch {
      addToast('Download failed. Please try again.', 'error');
    }
  }

  function handleResult(data: FaceData | null) {
    const detected = !!data?.ok;
    setFaceDetected(detected);
    if (data && !data.ok) {
      addToast(data.error, 'error');
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <svg className={styles.brandMarkIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 2.61 1.38 4.91 3.46 6.22L9 21h6l.54-5.78C17.62 13.91 19 11.61 19 9c0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z"/>
            </svg>
          </div>
          <span className={styles.brandName}>
            try<span className={styles.brandDot}>·</span>on
          </span>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.privacyBadge}>
            <svg className={styles.privacyIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4a3 3 0 110 6 3 3 0 010-6zm0 8c-2 0-6 1-6 3v1h12v-1c0-2-4-3-6-3z"/>
            </svg>
            No photo uploads
          </span>
          <span className={styles.aiBadge}>On-device AI</span>
        </div>
      </header>

      <Hero onGetStarted={scrollToApp} />

      <main ref={appSectionRef} className={styles.layout}>
        <aside className={styles.sidebar}>
          <Upload onFile={setFile} />

          <EarringGallery
            earrings={earrings}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <OptionsPanel
            debug={debug}
            onDebugChange={setDebug}
            side={side}
            onSideChange={setSide}
          />

          <div className={styles.downloadSection}>
            <button
              className={styles.downloadBtn}
              onClick={handleDownload}
              disabled={!canDownload}
            >
              <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Download Photo
            </button>
            <p className={styles.footerNote}>
              Good lighting and a front-facing photo give the best results.
            </p>
          </div>
        </aside>

        <section>
          <ErrorBoundary>
            <PreviewCanvas
              ref={canvasRef}
              file={file}
              earring={selectedEarring}
              side={side}
              debug={debug}
              onResult={handleResult}
            />
          </ErrorBoundary>
        </section>
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
