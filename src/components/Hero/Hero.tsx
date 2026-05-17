import styles from './Hero.module.css';

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          AI-Powered Virtual Try-On
        </div>

        <h1 className={styles.headline}>
          Find your perfect<br className={styles.br} />
          <span className={styles.accent}>earring</span> — instantly.
        </h1>

        <p className={styles.subheadline}>
          Upload a selfie and try on any earring in seconds.
          No app, no account, no data sent to any server.
        </p>

        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </span>
            <div>
              <strong>100% Private</strong>
              <p>All processing happens on your device</p>
            </div>
          </div>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 3C8.03 3 4 7.03 4 12H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
              </svg>
            </span>
            <div>
              <strong>Instant Results</strong>
              <p>Face detection in under a second</p>
            </div>
          </div>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
            </span>
            <div>
              <strong>No Registration</strong>
              <p>Open and start trying on immediately</p>
            </div>
          </div>
        </div>

        <div className={styles.cta}>
          <button className={styles.ctaBtn} onClick={onGetStarted}>
            Try it free — no signup
            <svg className={styles.ctaArrow} viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <p className={styles.ctaNote}>Works in your browser · No app needed</p>
        </div>
      </div>

      <div className={styles.visual} aria-hidden="true">
        <div className={styles.visualRing} />
        <div className={styles.visualCard}>
          <div className={styles.visualDots}>
            <span /><span /><span />
          </div>
          <div className={styles.visualFace}>
            <svg viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="48" r="28" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4 3"/>
              <circle cx="60" cy="48" r="18" fill="var(--color-accent-light)" stroke="var(--color-accent)" strokeWidth="1.5"/>
              <circle cx="52" cy="44" r="3" fill="var(--color-accent)"/>
              <circle cx="68" cy="44" r="3" fill="var(--color-accent)"/>
              <path d="M52 54 Q60 60 68 54" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <ellipse cx="36" cy="68" rx="8" ry="14" fill="var(--color-accent)" opacity="0.8"/>
              <ellipse cx="84" cy="68" rx="8" ry="14" fill="var(--color-accent)" opacity="0.8"/>
              <circle cx="36" cy="58" r="3" fill="var(--color-accent-light)"/>
              <circle cx="84" cy="58" r="3" fill="var(--color-accent-light)"/>
            </svg>
          </div>
          <p className={styles.visualLabel}>AI detecting face landmarks</p>
        </div>
      </div>
    </section>
  );
}
