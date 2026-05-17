import type { Earring } from '@/types';
import styles from './EarringGallery.module.css';

interface EarringGalleryProps {
  earrings: Earring[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function EarringGallery({ earrings, selectedId, onSelect }: EarringGalleryProps) {
  return (
    <div className={styles.card}>
      <div className={styles.sectionHeader}>
        <span className={styles.badge}>2</span>
        <span className={styles.title}>Choose Earring</span>
      </div>

      <div className={styles.grid}>
        {earrings.map((earring) => {
          const isSelected = earring.id === selectedId;
          return (
            <button
              key={earring.id}
              className={`${styles.earringCard} ${isSelected ? styles.earringCardSelected : ''}`}
              onClick={() => onSelect(earring.id)}
              title={earring.name}
              aria-pressed={isSelected}
            >
              <div className={styles.checkmark}>
                <CheckIcon className={styles.checkmarkIcon} />
              </div>

              <div className={styles.thumbWrap}>
                <img src={earring.file} alt={earring.name} className={styles.thumb} />
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.earringName}>{earring.name}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
