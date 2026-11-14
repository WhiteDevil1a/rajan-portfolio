import React from 'react';
import Link from 'next/link';
import CustomHead from '@src/components/dom/CustomHead';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';

const SITE_URL = 'https://rajanbhatta.com.np';

const THIRD_PARTY_LIBRARIES = [
  { name: 'Next.js', license: 'MIT', url: 'https://github.com/vercel/next.js', desc: 'React framework for production' },
  { name: 'React & React DOM', license: 'MIT', url: 'https://github.com/facebook/react', desc: 'UI component architecture' },
  { name: 'GSAP', license: 'Standard GreenSock License', url: 'https://greensock.com', desc: 'Motion and layout transitions' },
  { name: 'Lenis', license: 'MIT', url: 'https://github.com/darkroomengineering/lenis', desc: 'Smooth scroll management' },
  { name: 'Three.js & React Three Fiber', license: 'MIT', url: 'https://github.com/pmndrs/react-three-fiber', desc: 'WebGL graphics and canvas shaders' },
  { name: 'Tesseract.js', license: 'Apache-2.0', url: 'https://github.com/naptha/tesseract.js', desc: 'In-browser OCR engine' },
  { name: 'Transformers.js', license: 'Apache-2.0', url: 'https://github.com/xenova/transformers.js', desc: 'Client-side Whisper speech-to-text inference' },
  { name: 'pdfjs-dist', license: 'Apache-2.0', url: 'https://github.com/mozilla/pdf.js', desc: 'Mozilla PDF parsing and canvas rendering' },
  { name: 'JSZip', license: 'MIT / GPLv3', url: 'https://github.com/Stuk/jszip', desc: 'Archive generation and docx package inspection' },
  { name: 'SVGO', license: 'MIT', url: 'https://github.com/svg/svgo', desc: 'Vector SVG optimization and cleaning' },
  { name: 'ImageTracerJS', license: 'Public Domain', url: 'https://github.com/jankovicsandras/imagetracerjs', desc: 'Raster to vector tracing engine' },
  { name: 'jsPDF', license: 'MIT', url: 'https://github.com/parallax/jsPDF', desc: 'Client-side vector PDF generation' },
  { name: 'Browser-Image-Compression', license: 'MIT', url: 'https://github.com/Donaldcwl/browser-image-compression', desc: 'In-browser raster image compressor' },
  { name: 'Noto Sans Devanagari', license: 'SIL Open Font License (OFL)', url: 'https://fonts.google.com/specimen/Noto+Sans+Devanagari', desc: 'Clean typography for Nepali complex script' },
];

export default function LicensesPage() {
  return (
    <div className={clsx(styles.brandToolsRoot, 'layout-block-inner')}>
      <CustomHead
        title="Open Source Licenses &amp; Trademarks | Rajan Bhatta"
        description="Open source licenses, third-party library attributions, and trademark disclaimers for rajanbhatta.com.np and Brand Tools."
        canonical={`${SITE_URL}/licenses`}
        noPersonSchema
      />

      <section className={styles.heroSection}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className={styles.separator}>/</span>
          <span className={styles.current} aria-current="page">Open Source Licenses</span>
        </nav>

        <h1 className={styles.heroTitle}>Licenses &amp; Attributions</h1>
        <p className={styles.heroSubtitle}>
          We stand on the shoulders of the open source community. Every library used runs permissively in your browser.
        </p>

        <div className={styles.privacyNote}>
          <span className={styles.dot} />
          <span>All dependencies are MIT, BSD, ISC, Apache-2.0, or Public Domain</span>
        </div>
      </section>

      <div className={styles.educationalSection} style={{ maxWidth: '85ch', margin: '3rem auto' }}>
        <h2 className={styles.sectionHeading}>Trademark &amp; Logo Notice</h2>
        <div className={styles.privacyBlock} style={{ marginBottom: '2.5rem' }}>
          <strong>⚠️ Notice:</strong> All brand logos, wordmarks, trademarks, and registered assets indexed in the{' '}
          <Link href="/brand-tools/logo" style={{ color: 'var(--tool-accent-dark)', textDecoration: 'underline' }}>
            Logo Search &amp; Vector Library
          </Link>{' '}
          belong entirely to their respective copyright and trademark owners. They are provided solely for editorial, educational, and recognized identification purposes under fair use.
        </div>

        <h2 className={styles.sectionHeading}>Open Source Libraries</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          {THIRD_PARTY_LIBRARIES.map((lib) => (
            <div
              key={lib.name}
              style={{
                background: 'var(--tool-surface)',
                border: '1px solid var(--tool-border)',
                borderRadius: '10px',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '1rem', color: 'var(--tool-text-main)' }}>{lib.name}</strong>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    background: 'var(--tool-accent-bg)',
                    color: 'var(--tool-accent-dark)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                  }}
                >
                  {lib.license}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--tool-text-muted)', margin: '0 0 0.5rem 0' }}>{lib.desc}</p>
              <a
                href={lib.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.78rem', color: 'var(--tool-accent-dark)', textDecoration: 'underline' }}
              >
                Project Repository →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
