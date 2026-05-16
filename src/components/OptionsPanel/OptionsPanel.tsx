import type { EarringSide } from '@/types';
import styles from './OptionsPanel.module.css';

interface OptionsPanelProps {
  debug: boolean;
  onDebugChange: (value: boolean) => void;
  side: EarringSide;
  onSideChange: (side: EarringSide) => void;
}

export default function OptionsPanel({
  debug,
  onDebugChange,
  side,
  onSideChange,
}: OptionsPanelProps) {
  return (
    <div className={styles.box}>
      <div className={styles.label}>Opções</div>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={debug}
          onChange={(e) => onDebugChange(e.target.checked)}
        />
        <span>Mostrar landmarks (debug)</span>
      </label>

      <div className={styles.sideLabel}>Lado do brinco</div>
      <div className={styles.sideButtons}>
        {(['left', 'right'] as const).map((s) => (
          <button
            key={s}
            className={`${styles.pill} ${side === s ? styles.pillActive : ''}`}
            onClick={() => onSideChange(s)}
            aria-pressed={side === s}
          >
            {s === 'left' ? 'Esquerdo' : 'Direito'}
          </button>
        ))}
      </div>
    </div>
  );
}
