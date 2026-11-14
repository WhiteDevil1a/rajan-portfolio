import React from 'react';
import Link from 'next/link';
import CustomHead from '@src/components/dom/CustomHead';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';

const SITE_URL = 'https://rajanbhatta.com.np';

export default function PrivacyPage() {
  return (
    <div className={clsx(styles.brandToolsRoot, 'layout-block-inner')}>
      <CustomHead
        title="Privacy Policy – 100% In-Browser Privacy | Rajan Bhatta"
        description="Privacy policy for rajanbhatta.com.np and Brand Tools. 100% client-side processing, no file uploads, no tracking accounts, zero data collection."
        canonical={`${SITE_URL}/privacy`}
        noPersonSchema
      />

      <section className={styles.heroSection}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className={styles.separator}>/</span>
          <span className={styles.current} aria-current="page">Privacy Policy</span>
        </nav>

        <h1 className={styles.heroTitle}>Privacy Policy</h1>
        <p className={styles.heroSubtitle}>
          Our core architectural guarantee: 100% client-side execution. Your files, documents, and data never leave your browser.
        </p>

        <div className={styles.privacyNote}>
          <span className={styles.dot} />
          <span>Last updated: November 2026 · Built by Rajan Bhatta</span>
        </div>
      </section>

      <div className={styles.educationalSection} style={{ maxWidth: '75ch', margin: '3rem auto' }}>
        <h2 className={styles.sectionHeading}>1. Zero-Upload Architecture</h2>
        <p style={{ lineHeight: '1.7', color: 'var(--tool-text-main)', marginBottom: '1.5rem' }}>
          Every tool hosted under <code>rajanbhatta.com.np/brand-tools</code> operates entirely inside your local browser sandbox memory using standard web standards: HTML5 Canvas, Web Audio API, Web Workers, and WebAssembly (WASM).
        </p>
        <p style={{ lineHeight: '1.7', color: 'var(--tool-text-main)', marginBottom: '1.5rem' }}>
          When you upload an SVG, PNG, JPG, PDF, Word (.docx) document, or record your voice via microphone, <strong>no bytes are ever transmitted across a network or stored on any server</strong>. You can verify this independently at any time by opening your browser&apos;s Developer Tools Network tab while executing conversions.
        </p>

        <h2 className={styles.sectionHeading}>2. No Accounts &amp; No Cloud Pickers</h2>
        <p style={{ lineHeight: '1.7', color: 'var(--tool-text-main)', marginBottom: '1.5rem' }}>
          We do not ask you to create an account, provide an email address, or connect third-party cloud storage accounts (such as Google Drive or Dropbox). Local processing ensures that your personal documents, client brand guidelines, and confidential files remain strictly on your device.
        </p>

        <h2 className={styles.sectionHeading}>3. Client-Side Storage &amp; Brand Kit Sync</h2>
        <p style={{ lineHeight: '1.7', color: 'var(--tool-text-main)', marginBottom: '1.5rem' }}>
          When you customize your Brand Kit (logos, colors, contact details), preferences are saved exclusively in your browser&apos;s local <code>localStorage</code>. This data never leaves your computer and can be completely wiped at any moment by clicking &ldquo;Reset Brand Kit&rdquo; or clearing your browser cookies/storage.
        </p>

        <h2 className={styles.sectionHeading}>4. AI Models &amp; Local Inference</h2>
        <p style={{ lineHeight: '1.7', color: 'var(--tool-text-main)', marginBottom: '1.5rem' }}>
          AI utilities such as Nepali OCR (Tesseract.js) and Speech-to-Text (Whisper via Transformers.js) run inference locally via WebAssembly or WebGPU. Model weights are downloaded once from static CDN hosts and cached in your browser&apos;s IndexedDB for offline availability. Audio streams and images are processed on-device.
        </p>

        <h2 className={styles.sectionHeading}>5. Contact</h2>
        <p style={{ lineHeight: '1.7', color: 'var(--tool-text-main)', marginBottom: '1.5rem' }}>
          If you have questions regarding this privacy policy or the technical architecture of our tools, please contact Rajan Bhatta at <a href="mailto:hi@rajanbhatta.com.np" style={{ color: 'var(--tool-accent-dark)', textDecoration: 'underline' }}>hi@rajanbhatta.com.np</a>.
        </p>
      </div>
    </div>
  );
}
