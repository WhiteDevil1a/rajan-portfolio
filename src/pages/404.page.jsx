import React from 'react';
import Link from 'next/link';
import CustomHead from '@src/components/dom/CustomHead';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';

const POPULAR_TOOLS = [
  { title: 'Brand Logo Search', href: '/brand-tools/logo', desc: 'Find official vector SVGs and hex colors' },
  { title: 'Preeti to Unicode', href: '/brand-tools/preeti-to-unicode', desc: 'Instant Nepali font converter' },
  { title: 'Color Contrast Checker', href: '/brand-tools/color-contrast', desc: 'WCAG 2.1 AA/AAA compliance' },
  { title: 'Favicon Generator', href: '/brand-tools/favicon-generator', desc: 'Create ICO, PNG, and Apple Touch icons' },
  { title: 'Custom QR Code Maker', href: '/brand-tools/qr-code', desc: 'Vector SVG & print-ready QR codes' },
  { title: 'Nepali Date Converter', href: '/brand-tools/nepali-date-converter', desc: 'Convert Bikram Sambat to Gregorian' },
];

export default function Custom404() {
  return (
    <div className={clsx(styles.brandToolsRoot, 'layout-block-inner')}>
      <CustomHead
        title="404 — Page Not Found | Rajan Bhatta"
        description="The page you were looking for does not exist. Browse our free brand design utilities and portfolio."
        robots="noindex,follow"
        noPersonSchema
      />

      <section className={styles.heroSection} style={{ textAlign: 'center', padding: '6rem 1rem 3rem' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.12em', color: '#ff2828', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          404 Error
        </p>
        <h1 className={styles.heroTitle} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>
          Page Not Found
        </h1>
        <p className={styles.heroSubtitle} style={{ maxWidth: '55ch', margin: '0 auto 2.5rem' }}>
          The page you requested could not be located. It may have been relocated, renamed, or is temporarily unavailable.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <Link
            href="/"
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '9999px',
              background: '#ff2828',
              color: '#ffffff',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
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
              transition: 'background 0.2s',
            }}
          >
            Browse All 21 Brand Tools →
          </Link>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 650, marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.5rem' }}>
            Popular Tools You Might Be Looking For
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {POPULAR_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                style={{
                  display: 'block',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  background: 'rgba(0,0,0,0.02)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--tool-text-title, #1f2120)', marginBottom: '0.25rem' }}>
                  {tool.title} →
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.6)' }}>
                  {tool.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
