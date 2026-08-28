import React, { useEffect } from 'react';
import styles from '@src/styles/brandTools.module.scss';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={styles.toastContainer} role="status" aria-live="polite">
      <span>{type === 'success' ? '✓' : 'ℹ'}</span>
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(240, 244, 241, 0.6)',
          cursor: 'pointer',
          marginLeft: '0.5rem',
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
