import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Toast from '@src/components/brandTools/Toast';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';
import { getAllIconsMeta, getIconBySlug } from '@src/lib/logoSearch/getIconData';
import { svgToPngBlob, downloadFile } from '@src/lib/logoSearch/renderIconPng';

const SITE_URL = 'https://rajanbhatta.com.np';

const RELATED_TOOLS = [
  { href: '/brand-tools/logo', label: '← Brand Logo Search', primary: true },
  { href: '/brand-tools/color-palette', label: 'Color Palette Extractor' },
  { href: '/brand-tools/brand-kit', label: 'Brand Kit' },
  { href: '/brand-tools/gradient', label: 'Gradient Generator' },
  { href: '/brand-tools/color-contrast', label: 'Color Contrast & Shades' },
];

function BrandLogoDetailPage({ icon }) {
  const [toast, setToast] = useState('');

  if (!icon) return null;

  const { slug, title, hex, svg } = icon;
  const brandColor = `#${hex}`;
  const pageUrl = `${SITE_URL}/brand-tools/logo/${slug}`;

  // Unique dynamic description — varies by phrasing to avoid duplicate content
  const pageDescription = `Download the ${title} logo in SVG format, plus its official brand color (${brandColor}), free to use for design mockups, presentations, and UI prototypes.`;

  const coloredSvgMarkup = svg.replace(
    '<svg',
    `<svg fill="${brandColor}" aria-label="${title} logo SVG download" role="img"`,
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: `${title} Logo SVG`,
    description: pageDescription,
    contentUrl: `${SITE_URL}/brand-tools/logo/${slug}`,
    encodingFormat: 'image/svg+xml',
    author: {
      '@type': 'Person',
      name: 'Rajan Bhatta',
      url: SITE_URL,
    },
    about: {
      '@type': 'Brand',
      name: title,
      color: brandColor,
    },
  };

  const downloadSvg = useCallback(() => {
    const coloredSvg = svg.replace('<svg', `<svg fill="${brandColor}"`);
    downloadFile(coloredSvg, `${slug}-logo.svg`, 'image/svg+xml');
    setToast(`${title} SVG downloaded`);
  }, [svg, slug, title, brandColor]);

  const downloadPng = useCallback(async () => {
    try {
      const blob = await svgToPngBlob(svg, hex, 512);
      downloadFile(blob, `${slug}-logo-512.png`, 'image/png');
      setToast(`${title} PNG downloaded`);
    } catch {
      setToast('PNG generation failed — try SVG instead');
    }
  }, [svg, hex, slug, title]);

  const copySvg = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(svg);
      setToast('SVG copied to clipboard');
    } catch {
      setToast('Copy failed — please try again');
    }
  }, [svg]);

  const copyHex = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(brandColor);
      setToast(`${brandColor} copied`);
    } catch {
      setToast('Copy failed — please try again');
    }
  }, [brandColor]);

  return (
    <>
      <Head>
        <title>{`${title} Logo SVG & Brand Color (${brandColor}) — Free Download | Rajan Bhatta`}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content={`${title} logo svg, ${title} logo download, ${title} brand color, ${title} hex color ${brandColor}, download ${title} logo, ${title} png logo`}
        />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${title} Logo SVG & Brand Color — Free Download`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${title} Logo SVG & Brand Color — Free Download`} />
        <meta name="twitter:description" content={pageDescription} />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className={clsx(styles.brandToolsRoot, 'layout-block-inner')}>
        {/* Breadcrumbs */}
        <section className={styles.heroSection}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={styles.separator}>/</span>
            <Link href="/brand-tools">Brand Tools</Link>
            <span className={styles.separator}>/</span>
            <Link href="/brand-tools/logo">Brand Logo Search</Link>
            <span className={styles.separator}>/</span>
            <span className={styles.current}>{title}</span>
          </nav>

          <div className={styles.heroMeta}>
            <span className={styles.toolNumber}>09</span>
            <span className={styles.toolCategoryBadge}>Brand Research</span>
          </div>

          <h1 className={styles.heroTitle}>{title} Logo SVG &amp; Brand Color</h1>
          <p className={styles.heroSubtitle}>
            {pageDescription}
          </p>

          <div className={styles.privacyNote}>
            <span className={styles.dot} />
            <span>100% Free · No Login Required · Instant Export</span>
          </div>
        </section>

        {/* Main content */}
        <div className={styles.workspaceLayout} style={{ marginTop: 'calc(var(--layout-columns-gap) * 1.5)' }}>
          {/* SVG Preview + Color */}
          <div className={styles.controlsPanel}>
            {/* SVG Preview */}
            <div className={styles.panelHeader}>
              <h3>Logo Preview</h3>
            </div>
            <div className={styles.logoDetailSvgBox}>
              {/* eslint-disable-next-line react/no-danger */}
              <span dangerouslySetInnerHTML={{ __html: coloredSvgMarkup }} />
            </div>

            {/* Hex Color */}
            <div className={styles.logoDetailColorRow} style={{ marginTop: '1rem' }}>
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
          </div>

          {/* Download panel */}
          <div className={styles.previewPanel}>
            <div className={styles.panelHeader}>
              <h3>Export Options</h3>
            </div>

            <div className={styles.logoDetailActions} style={{ marginBottom: '1.5rem' }}>
              <button type="button" className={styles.btnPrimary} onClick={downloadSvg}>
                Download SVG
              </button>
              <button type="button" className={styles.btnSecondary} onClick={downloadPng}>
                Download PNG
              </button>
              <button type="button" className={styles.btnSecondary} onClick={copySvg}>
                Copy SVG
              </button>
              <button type="button" className={styles.btnSecondary} onClick={copyHex}>
                Copy Hex
              </button>
            </div>

            <div className={styles.divider} />

            {/* Descriptive content for SEO — dynamic, not boilerplate */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p className={styles.inlineNote}>
                The <strong>{title}</strong> logo is available here as a clean SVG file. The official {title} brand color is{' '}
                <strong>{brandColor}</strong>, sourced from published brand identity guidelines.
              </p>
              <p className={styles.inlineNote}>
                Use the SVG for high-fidelity design mockups, UI prototypes, and presentations. The PNG export is 512×512 pixels with a white background, suitable for documents and slide decks.
              </p>
              <p className={styles.inlineNote}>
                Need to build a complete brand identity? Open the{' '}
                <Link href="/brand-tools/color-palette" style={{ color: 'var(--brandColor)', fontWeight: 650 }}>
                  Color Palette Extractor
                </Link>{' '}
                to derive a full palette from this color, or load it into the{' '}
                <Link href="/brand-tools/gradient" style={{ color: 'var(--brandColor)', fontWeight: 650 }}>
                  Gradient Generator
                </Link>{' '}
                to create smooth branded gradients.
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools — internal link equity */}
        <div className={styles.educationalSection}>
          <h2 className={styles.sectionHeading}>Related Brand Tools</h2>
          <div
            className={styles.toolGrid}
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
          >
            {RELATED_TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} className={styles.toolCard}>
                <div>
                  <p className={styles.toolCardDesc} style={{ marginBottom: 0 }}>
                    {tool.label}
                  </p>
                </div>
                <div className={styles.toolCardFooter}>
                  <span>Open</span>
                  <span className={styles.toolCardArrow}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </>
  );
}

// Generate a static page for every icon slug
export async function getStaticPaths() {
  const icons = getAllIconsMeta();
  return {
    paths: icons.map((icon) => ({ params: { slug: icon.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const icon = getIconBySlug(params.slug);
  if (!icon) return { notFound: true };
  return { props: { icon } };
}

export default BrandLogoDetailPage;
