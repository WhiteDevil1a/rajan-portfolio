import React from 'react';
import Link from 'next/link';
import CustomHead from '@src/components/dom/CustomHead';
import BrandKitBanner from './BrandKitBanner';
import RelatedTools from './RelatedTools';
import ToolFaq from './ToolFaq';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';

function ToolLayout({
  toolId,
  number,
  category,
  title,
  subtitle,
  seoTitle,
  seoDescription,
  seoKeywords = [],
  showBrandKitBanner = true,
  howItWorks = [],
  whyUseIt = [],
  faqs = [],
  relatedToolIds = [],
  children,
}) {
  const defaultKeywords = [
    'Brand Tools',
    'Brand Designer Nepal',
    'Rajan Bhatta',
    'Visual Identity',
    'Brand Kit',
    title,
    ...seoKeywords,
  ];

  return (
    <div className={clsx(styles.brandToolsRoot, 'layout-block-inner')}>
      <CustomHead
        title={seoTitle || `${title} | Brand Tools — Rajan Bhatta`}
        description={
          seoDescription ||
          `${title} — professional brand design utility by Rajan Bhatta. No login required.`
        }
        keywords={defaultKeywords}
      />

      {/* Hero */}
      <section className={styles.heroSection}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className={styles.separator}>/</span>
          <Link href="/brand-tools">Brand Tools</Link>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>{title}</span>
        </nav>

        <div className={styles.heroMeta}>
          {number && <span className={styles.toolNumber}>{number}</span>}
          {category && <span className={styles.toolCategoryBadge}>{category}</span>}
        </div>

        <h1 className={styles.heroTitle}>{title}</h1>
        {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}

        <div className={styles.privacyNote}>
          <span className={styles.dot} />
          <span>100% Free · No Login Required · Instant Export</span>
        </div>
      </section>

      {/* Brand Kit Integration Banner */}
      {showBrandKitBanner && (
        <div style={{ marginTop: 'calc(var(--layout-columns-gap) * 1.5)' }}>
          <BrandKitBanner toolName={title} />
        </div>
      )}

      {/* Main Tool Interactive Workspace */}
      <div style={{ marginTop: 'calc(var(--layout-columns-gap) * 1)' }}>{children}</div>

      {/* How It Works */}
      {howItWorks.length > 0 && (
        <div className={styles.educationalSection}>
          <h2 className={styles.sectionHeading}>How It Works</h2>
          <div className={styles.stepsGrid}>
            {howItWorks.map((step, idx) => (
              <div key={step.title} className={styles.stepCard}>
                <div className={styles.stepNum}>{String(idx + 1).padStart(2, '0')}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why Use It */}
      {whyUseIt.length > 0 && (
        <div className={styles.educationalSection}>
          <h2 className={styles.sectionHeading}>Why Use It</h2>
          <div className={styles.stepsGrid}>
            {whyUseIt.map((item) => (
              <div key={item.title} className={styles.stepCard}>
                <h4 style={{ color: 'var(--brandColor)' }}>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <div className={styles.educationalSection}>
          <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
          <ToolFaq faqs={faqs} />
        </div>
      )}

      {/* Related Tools */}
      <RelatedTools currentToolId={toolId} toolIds={relatedToolIds} />
    </div>
  );
}

export default ToolLayout;
