import React, { useEffect, useRef, useState } from 'react';
import styles from '@src/styles/brandTools.module.scss';

/**
 * LogoCard
 * Renders a single brand icon card with lazy SVG loading via IntersectionObserver.
 * SVG is injected only when the card enters the viewport to keep render cost low.
 */
function LogoCard({ icon, onClick, isCompact }) {
  const { slug, title, hex, svg } = icon;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const brandColor = `#${hex}`;

  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.logoCard} ${isCompact ? styles.isCompact : ''}`}
      onClick={() => onClick(icon)}
      aria-label={`${title} logo SVG download`}
      title={title}
    >
      <div className={styles.logoCardSvg}>
        {visible && svg ? (
          <span
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: svg.replace(
                '<svg',
                `<svg fill="${brandColor}" aria-label="${title} logo SVG download" role="img"`,
              ),
            }}
          />
        ) : (
          /* Placeholder shimmer while not visible */
          <span
            style={{
              display: 'block',
              width: 36,
              height: 36,
              borderRadius: 4,
              background: 'rgba(40,40,43,0.06)',
            }}
          />
        )}
      </div>
      <span className={styles.logoCardName}>{title}</span>
      <span className={styles.logoCardHex}>
        <span
          className={styles.logoHexDot}
          style={{ background: brandColor }}
          aria-hidden="true"
        />
        #{hex}
      </span>
    </button>
  );
}

export default React.memo(LogoCard);
