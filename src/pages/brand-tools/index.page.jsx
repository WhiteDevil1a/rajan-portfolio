import React from 'react';
import Link from 'next/link';
import CustomHead from '@src/components/dom/CustomHead';
import { BRAND_TOOLS } from '@src/constants/brandToolsList';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';
import ToolFaq from '@src/components/brandTools/ToolFaq';

const seo = {
  title: 'Free Brand Design Tools & Visual Identity System Suite | Rajan Bhatta',
  description:
    '100% free professional brand design tools and visual identity generator suite by Rajan Bhatta. No login required. Build Brand Kits, extract color palettes, check WCAG contrast, generate gradients, business cards, email signatures, letterheads, and custom QR codes.',
  keywords: [
    'Free Brand Design Tools',
    '100% Free Brand Tools',
    'No Login Brand Kit Generator',
    'Free Online Design Tools',
    'Visual Identity Systems',
    'Brand Kit Generator',
    'Color Palette Extractor',
    'WCAG Color Contrast Checker',
    'Brand Gradient Generator',
    'Business Card Generator',
    'HTML Email Signature Generator',
    'Company Letterhead Generator',
    'Custom QR Code Generator',
    'Brand Guidelines Creator',
    'Brand Strategy Nepal',
    'Visual Identity Designer',
    'Rajan Bhatta',
    'brandwithrajan',
  ],
};

const LANDING_FAQS = [
  {
    q: 'What is the Brand Design Tools Suite?',
    a: 'The Brand Design Tools Suite is an interconnected ecosystem of 100% free brand identity utilities. It enables designers, founders, and creative directors to define, manage, test, and export professional brand assets from a single unified Brand Kit without requiring any account or login.',
  },
  {
    q: 'How does the central Brand Kit sync across the entire tool suite?',
    a: 'When you configure your brand assets (logos, typography, primary and accent colors, contact details) in the Brand Kit hub, every generator—including Business Cards, Letterheads, Email Signatures, Gradients, and QR Codes—automatically inherits your identity parameters.',
  },
  {
    q: 'Are these tools completely free to use?',
    a: 'Yes. All 8 tools are 100% free with no login required, no subscription limits, and no watermarks. High-resolution PNGs, vector SVGs, and print-ready PDFs can be exported instantly.',
  },
  {
    q: 'Can I export Brand Guidelines and developer tokens?',
    a: 'Yes. You can instantly download a multi-page vector Brand Guidelines PDF book, copy production-ready CSS variables for web development, and export/import full JSON kit backups.',
  },
];

function BrandToolsLandingPage() {
  const foundationTools = BRAND_TOOLS.filter((t) => t.category === 'Brand Foundation');
  const assetTools = BRAND_TOOLS.filter((t) => t.category === 'Branded Assets');

  return (
    <div className={clsx(styles.brandToolsRoot, 'layout-block-inner')}>
      <CustomHead {...seo} />

      {/* Hero Section */}
      <section className={styles.landingHero}>
        <div style={{ marginBottom: '0.85rem' }}>
          <span className={styles.toolCategoryBadge}>
            Brand Identity &amp; Design System Suite
          </span>
        </div>
        <h1 className={styles.heroTitle}>Brand Tools</h1>
        <p className={styles.heroSubtitle}>
          Professional, 100% free brand design utilities to establish, manage, and deploy cohesive visual identity systems. Connected through a central Brand Kit that automatically powers every generator.
        </p>
        <div className={styles.privacyNote}>
          <span className={styles.dot} />
          <span>100% Free · No Login Required · Instant High-Resolution Export</span>
        </div>
      </section>

      {/* Brand Foundation Category */}
      <section className={styles.categorySection}>
        <div className={styles.categoryTitle}>
          <span>Brand Foundation</span>
        </div>
        <div className={styles.toolGrid}>
          {foundationTools.map((tool) => (
            <Link key={tool.id} href={tool.href} className={styles.toolCard}>
              <div>
                <div className={styles.toolCardTop}>
                  <span className={styles.toolNumber}>{tool.number}</span>
                  <span className={styles.toolCategoryBadge}>{tool.category}</span>
                </div>
                <h3 className={styles.toolCardTitle}>{tool.title}</h3>
                <p className={styles.toolCardDesc}>{tool.description}</p>
              </div>
              <div className={styles.toolCardFooter}>
                <span>Open Tool</span>
                <span className={styles.toolCardArrow}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Branded Assets Category */}
      <section className={styles.categorySection}>
        <div className={styles.categoryTitle}>
          <span>Branded Assets</span>
        </div>
        <div className={styles.toolGrid}>
          {assetTools.map((tool) => (
            <Link key={tool.id} href={tool.href} className={styles.toolCard}>
              <div>
                <div className={styles.toolCardTop}>
                  <span className={styles.toolNumber}>{tool.number}</span>
                  <span className={styles.toolCategoryBadge}>{tool.category}</span>
                </div>
                <h3 className={styles.toolCardTitle}>{tool.title}</h3>
                <p className={styles.toolCardDesc}>{tool.description}</p>
              </div>
              <div className={styles.toolCardFooter}>
                <span>Open Tool</span>
                <span className={styles.toolCardArrow}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ecosystem Workflow */}
      <div className={styles.educationalSection}>
        <h2 className={styles.sectionHeading}>The Brand Design System Workflow</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>01</div>
            <h4>Define Foundation in Brand Kit</h4>
            <p>
              Input core company information, upload approved vector logos, specify color tokens, and select typography hierarchy in a unified dashboard.
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>02</div>
            <h4>Instant Cross-Tool Deployment</h4>
            <p>
              Open any asset generator—Business Cards, Letterheads, Email Signatures, Gradients, or QR Codes—with your identity tokens pre-populated automatically.
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>03</div>
            <h4>Export Production-Ready Deliverables</h4>
            <p>
              Download vector print PDFs, copy email-client HTML tables, generate high-DPI raster assets, and produce complete Brand Guidelines books.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.educationalSection}>
        <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
        <ToolFaq faqs={LANDING_FAQS} />
      </div>
    </div>
  );
}

export default BrandToolsLandingPage;
