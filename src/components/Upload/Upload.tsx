import styles from './Upload.module.css';

interface UploadProps {
  onFile: (file: File) => void;
}

export default function Upload({ onFile }: UploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div className={styles.box}>
      <div className={styles.label}>1) Upload selfie</div>
      <input
        className={styles.input}
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
      <p className={styles.hint}>
        Dica: boa luz, rosto quase de frente. Orelhas visíveis melhoram o resultado.
      </p>
    </div>
  );
}
