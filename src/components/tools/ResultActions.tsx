import React from 'react';
import styles from './ResultComponents.module.scss';

export interface ResultActionsProps {
  onDownload?: () => void;
  downloadLabel?: string;
  onCopy?: () => void;
  copyLabel?: string;
  isCopied?: boolean;
  onDownloadZip?: () => void;
  zipLabel?: string;
  onReset?: () => void;
  resetLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ResultActions: React.FC<ResultActionsProps> = ({
  onDownload,
  downloadLabel = 'Download',
  onCopy,
  copyLabel = 'Copy',
  isCopied = false,
  onDownloadZip,
  zipLabel = 'Download all (ZIP)',
  onReset,
  resetLabel = 'Start over',
  className = '',
  children,
}) => {
  return (
    <div className={`${styles.resultActions} ${className}`}>
      {onDownload && (
        <button
          type="button"
          className={styles.primaryActionBtn}
          onClick={onDownload}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {downloadLabel}
        </button>
      )}

      {onDownloadZip && (
        <button
          type="button"
          className={styles.secondaryActionBtn}
          onClick={onDownloadZip}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="21 8 21 21 3 21 3 8" />
            <rect x="1" y="3" width="22" height="5" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </svg>
          {zipLabel}
        </button>
      )}

      {onCopy && (
        <button
          type="button"
          className={styles.secondaryActionBtn}
          onClick={onCopy}
        >
          {isCopied ? (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {copyLabel}
            </>
          )}
        </button>
      )}

      {onReset && (
        <button
          type="button"
          className={styles.ghostActionBtn}
          onClick={onReset}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          {resetLabel}
        </button>
      )}

      {children}
    </div>
  );
};

export default ResultActions;
