import React, { useState, useRef, useCallback } from 'react';
import styles from './ResultComponents.module.scss';

export interface BeforeAfterProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: string;
  className?: string;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Original',
  afterLabel = 'Optimized',
  aspectRatio,
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.beforeAfterContainer} ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After image (background layer) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={afterUrl} alt={afterLabel} className={styles.afterImage} />
      <span className={`${styles.imageBadge} ${styles.afterBadge}`}>{afterLabel}</span>

      {/* Before image (clipped layer) */}
      <div
        className={styles.beforeWrapper}
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeUrl} alt={beforeLabel} className={styles.beforeImage} />
        <span className={`${styles.imageBadge} ${styles.beforeBadge}`}>{beforeLabel}</span>
      </div>

      {/* Draggable Divider Handle */}
      <div
        className={styles.dividerLine}
        style={{ left: `${sliderPosition}%` }}
        role="slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Comparison slider position"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setSliderPosition((p) => Math.max(0, p - 5));
          if (e.key === 'ArrowRight') setSliderPosition((p) => Math.min(100, p + 5));
        }}
      >
        <div className={styles.sliderKnob}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
            <polyline points="9 18 3 12 9 6" />
          </svg>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
            <polyline points="15 18 21 12 15 6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfter;
