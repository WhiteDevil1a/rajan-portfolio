import React from 'react';
import Link from 'next/link';
import CustomHead from '@src/components/dom/CustomHead';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';

export default function Custom500() {
  return (
    <div className={clsx(styles.brandToolsRoot, 'layout-block-inner')}>
      <CustomHead
        title="500 — Server Error | Rajan Bhatta"
        description="An unexpected error occurred. Please refresh or return to the home page."
        robots="noindex,nofollow"
        noPersonSchema
      />

      <section className={styles.heroSection} style={{ textAlign: 'center', padding: '6rem 1rem 4rem' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.12em', color: '#ff2828', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          500 Error
        </p>
        <h1 className={styles.heroTitle} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>
          Server Error
        </h1>
        <p className={styles.heroSubtitle} style={{ maxWidth: '55ch', margin: '0 auto 2.5rem' }}>
          An internal processing exception occurred while preparing this view. Our tools run 100% locally in your browser, so you can safely refresh or return to the suite.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '9999px',
              background: '#ff2828',
              color: '#ffffff',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ← Return to Home
          </Link>
          <Link
            href="/brand-tools"
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '9999px',
              border: '1px solid rgba(0,0,0,0.15)',
              background: 'transparent',
              color: 'inherit',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Browse Brand Tools →
          </Link>
        </div>
      </section>
    </div>
  );
}
