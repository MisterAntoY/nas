import { useRef, useMemo, useState } from 'react';
import Upload from '@/components/Upload/Upload';
import EarringGallery from '@/components/EarringGallery/EarringGallery';
import OptionsPanel from '@/components/OptionsPanel/OptionsPanel';
import PreviewCanvas from '@/components/PreviewCanvas/PreviewCanvas';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { earrings } from '@/data/earrings';
import { exportCanvasToDownload } from '@/utils/render';
import { warmupLandmarker } from '@/utils/face';
import type { EarringSide, FaceData } from '@/types';
import styles from './App.module.css';

// Pré-aquece o modelo MediaPipe assim que o módulo carrega (melhora UX)
warmupLandmarker();

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(earrings[0]?.id ?? null);
  const [debug, setDebug] = useState(false);
  const [side, setSide] = useState<EarringSide>('left');
  const [faceDetected, setFaceDetected] = useState(false);

  const selectedEarring = useMemo(
    () => earrings.find((e) => e.id === selectedId) ?? null,
    [selectedId],
  );

  const canDownload = faceDetected && !!canvasRef.current;

  async function handleDownload() {
    if (!canvasRef.current) return;
    await exportCanvasToDownload(canvasRef.current, 'earring-tryon.png');
  }

  function handleResult(data: FaceData | null) {
    setFaceDetected(!!data?.ok);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.headerTitle}>Virtual Earring Try-On</span>
        <span className={styles.headerSub}>Upload → Escolher → Gerar → Download</span>
      </header>

      <main className={styles.layout}>
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

          <button
            className={styles.downloadBtn}
            onClick={handleDownload}
            disabled={!canDownload}
          >
            4) Download
          </button>

          <p className={styles.footerNote}>
            Dica: foto com boa luz, rosto quase de frente. Se o brinco ficar torto,
            troca o lado (Esquerdo / Direito).
          </p>
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
    </div>
  );
}
