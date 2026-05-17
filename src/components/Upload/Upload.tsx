import { useRef, useState } from 'react';
import styles from './Upload.module.css';

interface UploadProps {
  onFile: (file: File) => void;
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function Upload({ onFile }: UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFileName(file.name);
    onFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const zoneClass = [
    styles.dropZone,
    isDragging ? styles.dragging : '',
    fileName ? styles.hasFile : '',
  ].join(' ');

  return (
    <div className={styles.card}>
      <div className={styles.sectionHeader}>
        <span className={styles.badge}>1</span>
        <span className={styles.title}>Upload Selfie</span>
      </div>

      <div
        className={zoneClass}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {fileName ? (
          <>
            <CheckIcon className={styles.icon} />
            <span className={styles.fileName}>{fileName}</span>
            <span className={styles.changeText}>Click to change</span>
          </>
        ) : (
          <>
            <UploadIcon className={styles.icon} />
            <span className={styles.dropText}>
              {isDragging ? 'Drop it here' : 'Drag & drop or click to upload'}
            </span>
            <span className={styles.hint}>JPG, PNG, WebP · Face forward, good lighting</span>
          </>
        )}
      </div>
    </div>
  );
}
