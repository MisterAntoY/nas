import type { Earring } from '@/types';
import styles from './EarringGallery.module.css';

interface EarringGalleryProps {
  earrings: Earring[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function EarringGallery({
  earrings,
  selectedId,
  onSelect,
}: EarringGalleryProps) {
  return (
    <div className={styles.box}>
      <div className={styles.label}>2) Escolher brinco</div>
      <div className={styles.grid}>
        {earrings.map((earring) => (
          <button
            key={earring.id}
            className={`${styles.card} ${earring.id === selectedId ? styles.cardSelected : ''}`}
            onClick={() => onSelect(earring.id)}
            title={earring.name}
            aria-pressed={earring.id === selectedId}
          >
            <img src={earring.file} alt={earring.name} className={styles.thumb} />
            <div className={styles.name}>{earring.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
