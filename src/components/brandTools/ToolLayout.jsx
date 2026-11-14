import React from 'react';
import Link from 'next/link';
import CustomHead from '@src/components/dom/CustomHead';
import BrandKitBanner from './BrandKitBanner';
import RelatedTools from './RelatedTools';
import ToolFaq from './ToolFaq';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';
import { TOOLS, TOOLS_BY_ID } from '@src/data/tools';

const SITE_URL = 'https://rajanbhatta.com.np';

/**
 * Standard page layout for every brand tool.
 *
 * Server-renders: breadcrumbs, H1, subtitle, trust line, how-to, features,
 * long description, FAQ, related tools, privacy note, all-tools list.
 * Only the interactive <children> widget is client-only.
 */
function ToolLayout({
  toolId,
  number,
  category,
  title,
  subtitle,
  seoTitle,
  seoDescription,
  canonical: canonicalProp,
  schemaType = 'UtilitiesApplication',
  showBrandKitBanner = true,
  howItWorks = [],
  features = [],
  longDescription = '',
  faqs = [],
  relatedToolIds = [],
  children,
}) {
  const canonicalUrl = canonicalProp || (toolId ? `${SITE_URL}/brand-tools/${toolId}` : undefined);
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(seoTitle || title)}`;

  // Build structured data
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: seoTitle || title,
    description: seoDescription,
    url: canonicalUrl,
    applicationCategory: schemaType,
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Person',
      name: 'Rajan Bhatta',
      url: SITE_URL,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Brand Tools', item: `${SITE_URL}/brand-tools` },
      { '@type': 'ListItem', position: 3, name: title, item: canonicalUrl },
    ],
  };

  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        }
      : null;

  // Get related tool objects from registry
  const relatedTools = relatedToolIds
    .map((id) => TOOLS_BY_ID[id])
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div className={clsx(styles.brandToolsRoot, 'layout-block-inner')}>
      <CustomHead
        title={seoTitle || `${title} | Brand Tools — Rajan Bhatta`}
        description={seoDescription || `${title} — free online tool by Rajan Bhatta. No login required. Your files never leave your browser.`}
        canonical={canonicalUrl}
        ogImage={ogImageUrl}
        noPersonSchema
      />

      {/* Structured data */}
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        // eslint-disable-next-line react/no-danger
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* Hero */}
      <section className={styles.heroSection}>
        {/* Visible breadcrumbs (also in JSON-LD above) */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className={styles.separator}>/</span>
          <Link href="/brand-tools">Brand Tools</Link>
          <span className={styles.separator}>/</span>
          <span className={styles.current} aria-current="page">{title}</span>
        </nav>

        <div className={styles.heroMeta}>
          {number && <span className={styles.toolNumber}>{number}</span>}
          {category && <span className={styles.toolCategoryBadge}>{category}</span>}
        </div>

        <h1 className={styles.heroTitle}>{title}</h1>
        {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}

        {/* Trust line — required on every tool page */}
        <div className={styles.privacyNote}>
          <span className={styles.dot} />
          <span>Free · No Signup · Your files never leave your browser</span>
        </div>
      </section>

      {/* Interactive tool widget (client-only) — immediately under H1/subtitle above the fold */}
      <div style={{ marginTop: 'calc(var(--layout-columns-gap) * 1)' }}>{children}</div>

      {/* Brand Kit Integration Banner */}
      {showBrandKitBanner && (
        <div style={{ marginTop: 'calc(var(--layout-columns-gap) * 1.5)' }}>
          <BrandKitBanner toolName={title} />
        </div>
      )}

      {/* How to use — ordered list (3–5 steps) */}
      {howItWorks.length > 0 && (
        <div className={styles.educationalSection}>
          <h2 className={styles.sectionHeading}>How to Use</h2>
          <ol className={styles.howToList}>
            {howItWorks.map((step) => (
              <li key={step.title} className={styles.howToItem}>
                <strong>{step.title}</strong>
                {step.desc && <p>{step.desc}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <div className={styles.educationalSection}>
          <h2 className={styles.sectionHeading}>Features</h2>
          <ul className={styles.featureList}>
            {features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Long description — 300–500 words, human-written, server-rendered */}
      {longDescription && (
        <div className={styles.educationalSection}>
          <div className={styles.longDescText}>
            {longDescription.split('\n\n').map((para, i) => {
              // Support **bold** in long descriptions
              const html = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code>$1</code>');
              return (
                // eslint-disable-next-line react/no-danger
                <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
              );
            })}
          </div>
        </div>
      )}

      {/* FAQ — real HTML, also in FAQPage JSON-LD */}
      {faqs.length > 0 && (
        <div className={styles.educationalSection}>
          <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
          <ToolFaq faqs={faqs} />
        </div>
      )}

      {/* Related tools (3–4 links) */}
      {relatedTools.length > 0 && (
        <div className={styles.educationalSection}>
          <h2 className={styles.sectionHeading}>Related Tools</h2>
          <div className={styles.relatedToolsGrid}>
            {relatedTools.map((tool) => (
              <Link key={tool.id} href={tool.href} className={styles.relatedToolCard}>
                <span className={styles.toolCategoryBadge}>{tool.category}</span>
                <strong>{tool.title}</strong>
                <p>{tool.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div className={styles.privacyBlock}>
        <strong>🔒 Privacy:</strong> This tool processes everything locally in your browser. No files, images, or text
        are ever uploaded to any server. Your data never leaves your device.
      </div>

      {/* All tools footer list — internal linking */}
      <nav className={styles.allToolsFooter} aria-label="All brand tools">
        <h3 className={styles.allToolsHeading}>All Brand Tools</h3>
        <ul className={styles.allToolsList}>
          {TOOLS.map((tool) => (
            <li key={tool.id}>
              <Link href={tool.href} aria-current={tool.id === toolId ? 'page' : undefined}>
                {tool.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default ToolLayout;
