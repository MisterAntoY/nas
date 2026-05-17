import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  kind: ToastKind;
  text: string;
}

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3700);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const kindClass =
    toast.kind === 'success'
      ? styles.toastSuccess
      : toast.kind === 'error'
        ? styles.toastError
        : styles.toastInfo;

  return (
    <div
      className={`${styles.toast} ${kindClass} ${visible ? styles.toastVisible : ''}`}
      role="alert"
      aria-live="polite"
    >
      <span className={styles.toastIcon}>
        {toast.kind === 'success' && (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        )}
        {toast.kind === 'error' && (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        )}
        {toast.kind === 'info' && (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        )}
      </span>
      <span className={styles.toastText}>{toast.text}</span>
      <button
        className={styles.toastClose}
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        aria-label="Dismiss"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className={styles.container} aria-label="Notifications">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

let nextId = 1;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  function addToast(text: string, kind: ToastKind = 'info') {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, kind, text }]);
  }

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return { toasts, addToast, dismiss };
}
