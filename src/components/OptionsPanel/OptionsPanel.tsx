import type { EarringSide } from '@/types';
import styles from './OptionsPanel.module.css';

interface OptionsPanelProps {
  debug: boolean;
  onDebugChange: (value: boolean) => void;
  side: EarringSide;
  onSideChange: (side: EarringSide) => void;
}

export default function OptionsPanel({ debug, onDebugChange, side, onSideChange }: OptionsPanelProps) {
  return (
    <div className={styles.card}>
      <div className={styles.sectionHeader}>
        <span className={styles.badge}>3</span>
        <span className={styles.title}>Options</span>
      </div>

      <div className={styles.sideLabel}>Earring side</div>
      <div className={styles.sideGroup} role="group" aria-label="Earring side">
        {(['left', 'right'] as const).map((s) => (
          <button
            key={s}
            className={`${styles.sideBtn} ${side === s ? styles.sideBtnActive : ''}`}
            onClick={() => onSideChange(s)}
            aria-pressed={side === s}
          >
            {s === 'left' ? 'Left' : 'Right'}
          </button>
        ))}
      </div>

      <label className={styles.debugRow}>
        <input
          type="checkbox"
          className={styles.debugCheckbox}
          checked={debug}
          onChange={(e) => onDebugChange(e.target.checked)}
        />
        <span className={styles.debugLabel}>Show face landmarks (debug)</span>
      </label>
    </div>
  );
}
