import React, { useEffect, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import Toast from '@src/components/brandTools/Toast';
import styles from '@src/styles/brandTools.module.scss';
import { svgToPngBlob, downloadFile } from '@src/lib/logoSearch/renderIconPng';

const RELATED_LINKS = [
  { href: '/brand-tools/color-palette', label: 'Color Palette' },
  { href: '/brand-tools/brand-kit', label: 'Brand Kit' },
  { href: '/brand-tools/gradient', label: 'Gradient Generator' },
  { href: '/brand-tools/color-contrast', label: 'Color Contrast' },
];

function LogoDetailPanel({ icon, onClose, toast, setToast }) {
  const { slug, title, hex, svg } = icon;
  const brandColor = `#${hex}`;

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll while panel is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const copySvg = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(svg);
      setToast('SVG copied to clipboard');
    } catch {
      setToast('Copy failed — please try again');
    }
  }, [svg, setToast]);

  const copyHex = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(brandColor);
      setToast(`Hex ${brandColor} copied`);
    } catch {
      setToast('Copy failed — please try again');
    }
  }, [brandColor, setToast]);

  const downloadSvg = useCallback(() => {
    const coloredSvg = svg.replace('<svg', `<svg fill="${brandColor}"`);
    downloadFile(coloredSvg, `${slug}-logo.svg`, 'image/svg+xml');
    setToast(`${title} SVG downloaded`);
  }, [svg, slug, title, brandColor, setToast]);

  const downloadPng = useCallback(async () => {
    try {
      const blob = await svgToPngBlob(svg, hex, 512);
      downloadFile(blob, `${slug}-logo-512.png`, 'image/png');
      setToast(`${title} PNG downloaded`);
    } catch {
      setToast('PNG generation failed — try SVG instead');
    }
  }, [svg, hex, slug, title, setToast]);

  const coloredSvgMarkup = svg
    ? svg.replace(
        '<svg',
        `<svg fill="${brandColor}" aria-label="${title} logo" role="img"`,
      )
    : null;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const content = (
    <>
      {/* Backdrop */}
      <div
        className={styles.logoDetailOverlay}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={styles.logoDetailPanel}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} logo details`}
      >
        {/* Header */}
        <div className={styles.logoDetailHeader}>
          <h2>{title}</h2>
          <button
            type="button"
            className={styles.logoDetailClose}
            onClick={onClose}
            aria-label="Close panel"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className={styles.logoDetailBody}>
          {/* SVG Preview */}
          <div className={styles.logoDetailSvgBox}>
            {coloredSvgMarkup ? (
              // eslint-disable-next-line react/no-danger
              <span dangerouslySetInnerHTML={{ __html: coloredSvgMarkup }} />
            ) : (
              <span style={{ color: 'rgba(40,40,43,0.3)', fontSize: '0.85rem' }}>
                Loading…
              </span>
            )}
          </div>

          {/* Brand Color Row */}
          <div className={styles.logoDetailColorRow}>
            <span
              className={styles.logoDetailSwatch}
              style={{ background: brandColor }}
              aria-hidden="true"
            />
            <span className={styles.logoDetailHexText}>{brandColor}</span>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={copyHex}
              aria-label={`Copy hex color ${brandColor}`}
            >
              Copy
            </button>
          </div>

          {/* Download & Copy Actions */}
          <div>
            <span className={styles.logoDetailLabel}>Export Options</span>
            <div className={styles.logoDetailActions}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={downloadSvg}
              >
                Download SVG
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={downloadPng}
              >
                Download PNG
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={copySvg}
              >
                Copy SVG
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={copyHex}
              >
                Copy Hex
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.logoDetailFooter}>
          <Link
            href={`/brand-tools/logo/${slug}`}
            className={styles.logoDetailFooterLink}
            onClick={onClose}
          >
            View full page →
          </Link>
          <div className={styles.logoDetailInternalLinks}>
            {RELATED_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={styles.logoDetailInternalLink}
                onClick={onClose}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Toast notification */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </>
  );

  if (!mounted) return null;
  return ReactDOM.createPortal(content, document.body);
}

export default LogoDetailPanel;
