import React, { useState } from 'react';
import styles from '@src/styles/brandTools.module.scss';

export function formatBytes(bytes) {
  if (bytes === 0 || !bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function BeforeAfterPreview({
  originalSrc,
  processedSrc,
  originalSize,
  processedSize,
  originalLabel = 'Original',
  processedLabel = 'Output',
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'side-by-side'

  const savings =
    originalSize && processedSize && originalSize > processedSize
      ? Math.round(((originalSize - processedSize) / originalSize) * 100)
      : null;

  return (
    <div className={styles.beforeAfterContainer}>
      <div className={styles.previewHeader}>
        <div className={styles.previewMetrics}>
          {originalSize !== undefined && (
            <span className={styles.metricItem}>
              {originalLabel}: <strong>{formatBytes(originalSize)}</strong>
            </span>
          )}
          {processedSize !== undefined && (
            <span className={styles.metricItem}>
              {processedLabel}: <strong>{formatBytes(processedSize)}</strong>
            </span>
          )}
          {savings !== null && (
            <span className={styles.metricSavingsBadge}>
              -{savings}% Saved
            </span>
          )}
        </div>
        <div className={styles.viewModeToggle}>
          <button
            type="button"
            className={viewMode === 'split' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setViewMode('split')}
          >
            Split Slider
          </button>
          <button
            type="button"
            className={viewMode === 'side-by-side' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setViewMode('side-by-side')}
          >
            Side by Side
          </button>
        </div>
      </div>

      {viewMode === 'split' ? (
        <div className={styles.splitSliderWrap}>
          <div className={styles.splitImageContainer}>
            {/* Processed (after) image base */}
            <img src={processedSrc} alt={processedLabel} className={styles.splitImg} />
            <div className={styles.labelAfter}>{processedLabel}</div>

            {/* Original (before) image overlay clipped */}
            <div
              className={styles.splitOverlay}
              style={{ width: `${sliderPos}%` }}
            >
              <img src={originalSrc} alt={originalLabel} className={styles.splitImg} />
              <div className={styles.labelBefore}>{originalLabel}</div>
            </div>

            {/* Divider handle */}
            <div
              className={styles.splitDivider}
              style={{ left: `${sliderPos}%` }}
            />
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className={styles.sliderControl}
            aria-label="Before after split slider"
          />
        </div>
      ) : (
        <div className={styles.sideBySideGrid}>
          <div className={styles.sideCard}>
            <div className={styles.sideCardLabel}>{originalLabel}</div>
            <div className={styles.sideCardImgWrap}>
              <img src={originalSrc} alt={originalLabel} className={styles.sideImg} />
            </div>
          </div>
          <div className={styles.sideCard}>
            <div className={styles.sideCardLabel}>{processedLabel}</div>
            <div className={styles.sideCardImgWrap}>
              <img src={processedSrc} alt={processedLabel} className={styles.sideImg} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BeforeAfterPreview;
