import React from 'react';
import styles from './ResultComponents.module.scss';

export interface FileCardProps {
  name: string;
  sizeBytes?: number;
  newSizeBytes?: number;
  previewUrl?: string;
  status?: 'ready' | 'processing' | 'done' | 'error';
  progress?: number;
  statusLabel?: string;
  onRemove?: () => void;
  className?: string;
}

export const FileCard: React.FC<FileCardProps> = ({
  name,
  sizeBytes,
  newSizeBytes,
  previewUrl,
  status = 'ready',
  progress,
  statusLabel,
  onRemove,
  className = '',
}) => {
  const formatBytes = (bytes?: number) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} B`;
  };

  const getSavings = () => {
    if (sizeBytes && newSizeBytes && sizeBytes > newSizeBytes) {
      const pct = Math.round(((sizeBytes - newSizeBytes) / sizeBytes) * 100);
      return `-${pct}%`;
    }
    return null;
  };

  const savings = getSavings();

  return (
    <div className={`${styles.fileCard} ${className}`}>
      <div className={styles.fileThumbnail}>
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={name} className={styles.thumbImage} />
        ) : (
          <span className={styles.fileIcon} aria-hidden="true">
            📄
          </span>
        )}
      </div>

      <div className={styles.fileDetails}>
        <div className={styles.fileNameRow}>
          <span className={styles.fileName} title={name}>
            {name}
          </span>
          {statusLabel ? (
            <span className={`${styles.statusChip} ${styles[status]}`}>{statusLabel}</span>
          ) : savings ? (
            <span className={styles.savingsChip}>{savings}</span>
          ) : null}
        </div>

        <div className={styles.fileMeta}>
          {sizeBytes ? <span>{formatBytes(sizeBytes)}</span> : null}
          {newSizeBytes && sizeBytes !== newSizeBytes ? (
            <>
              <span className={styles.metaArrow}>→</span>
              <span className={styles.newSize}>{formatBytes(newSizeBytes)}</span>
            </>
          ) : null}
        </div>

        {typeof progress === 'number' && status === 'processing' && (
          <div className={styles.cardProgressBar}>
            <div className={styles.cardProgressFill} style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {onRemove && (
        <button
          type="button"
          className={styles.removeBtn}
          onClick={onRemove}
          aria-label={`Remove ${name}`}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default FileCard;
