import React, { useCallback, useEffect, useRef, useState } from 'react';
import LogoCard from './LogoCard';
import styles from '@src/styles/brandTools.module.scss';

const INITIAL_BATCH = 80;
const BATCH_SIZE = 80;

/**
 * LogoGrid
 * Renders a windowed grid of brand logo cards.
 * Uses an IntersectionObserver sentinel at the bottom to load more icons
 * in batches of BATCH_SIZE — no extra dependency needed.
 */
function LogoGrid({ icons, onCardClick, layout = 'grid' }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const sentinelRef = useRef(null);

  // Reset visible count whenever the icon list changes (new search)
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH);
  }, [icons]);

  // IntersectionObserver on the sentinel to load more
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, icons.length));
        }
      },
      { rootMargin: '400px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [icons.length]);

  const visibleIcons = icons.slice(0, visibleCount);
  const gridClass = layout === 'compact' ? styles.logoGridCompact : styles.logoGrid;

  if (icons.length === 0) {
    return (
      <div className={gridClass}>
        <div className={styles.logoEmptyState}>
          No brands match your search. Try a different keyword.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={gridClass}>
        {visibleIcons.map((icon) => (
          <LogoCard key={icon.slug} icon={icon} onClick={onCardClick} isCompact={layout === 'compact'} />
        ))}
        {/* Sentinel lives inside the grid so it doesn't affect layout */}
        <div ref={sentinelRef} className={styles.logoGridSentinel} aria-hidden="true" />
      </div>
      {visibleCount < icons.length && (
        <p className={styles.logoResultCount} style={{ marginTop: '0.75rem' }}>
          Showing {visibleCount.toLocaleString('en-US')} of {icons.length.toLocaleString('en-US')} — scroll to load more
        </p>
      )}
    </>
  );
}

export default LogoGrid;
