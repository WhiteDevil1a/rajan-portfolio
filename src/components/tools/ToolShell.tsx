import React from 'react';
import Link from 'next/link';
import CustomHead from '@src/components/dom/CustomHead';
import Prose from './Prose';
import styles from './ToolShell.module.scss';
import clsx from 'clsx';
import { TOOLS, TOOLS_BY_ID, Tool } from '@src/data/tools';

const SITE_URL = 'https://rajanbhatta.com.np';

export interface HowToStep {
  title: string;
  desc?: string;
  icon?: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface TipOrLimitation {
  type: 'tip' | 'limitation' | 'note';
  title: string;
  desc: string;
}

export interface ToolShellProps {
  toolId?: string;
  number?: string;
  category?: string;
  title: string;
  subtitle?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
  schemaType?: string;
  howToSteps?: HowToStep[];
  features?: string[];
  howItWorksContent?: string;
  tipsAndLimitations?: TipOrLimitation[];
  faqs?: FAQItem[];
  relatedToolIds?: string[];
  lastUpdated?: string;
  toc?: Array<{ id: string; label: string }>;
  children: React.ReactNode;
}

export const ToolShell: React.FC<ToolShellProps> = ({
  toolId,
  number,
  category,
  title,
  subtitle,
  seoTitle,
  seoDescription,
  canonical: canonicalProp,
  schemaType = 'UtilitiesApplication',
  howToSteps = [],
  features = [],
  howItWorksContent,
  tipsAndLimitations = [],
  faqs = [],
  relatedToolIds = [],
  lastUpdated = 'November 2026',
  toc,
  children,
}) => {
  const canonicalUrl = canonicalProp || (toolId ? `${SITE_URL}/brand-tools/${toolId}` : undefined);
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(seoTitle || title)}`;

  // JSON-LD WebApplication schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: seoTitle || title,
    description: seoDescription || subtitle,
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

  // JSON-LD BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Brand Tools', item: `${SITE_URL}/brand-tools` },
      { '@type': 'ListItem', position: 3, name: title, item: canonicalUrl },
    ],
  };

  // JSON-LD FAQPage schema
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

  // Resolve related tools from the registry
  const relatedTools: Tool[] = relatedToolIds
    .map((id) => TOOLS_BY_ID[id])
    .filter((t): t is Tool => Boolean(t))
    .slice(0, 4);

  return (
    <div className={clsx(styles.shellRoot, 'layout-block-inner')}>
      <CustomHead
        title={seoTitle || `${title} | Brand Tools — Rajan Bhatta`}
        description={seoDescription || `${title} — free online tool by Rajan Bhatta. No login required. 100% private in-browser processing.`}
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

      {/* 1. Header / Hero section */}
      <header className={styles.heroHeader}>
        {/* Breadcrumb (Home › Brand Tools › Tool) */}
        <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <Link href="/brand-tools">Brand Tools</Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span className={styles.breadcrumbCurrent} aria-current="page">
            {title}
          </span>
        </nav>

        <div className={styles.metaRow}>
          {number && <span className={styles.toolNumberBadge}>{number}</span>}
          {category && <span className={styles.toolCategoryBadge}>{category}</span>}
        </div>

        {/* 2. H1 + one-line subtitle + trust chips */}
        <h1 className={styles.h1Title} tabIndex={-1}>
          {title}
        </h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <div className={styles.trustChipsRow}>
          <span className={styles.trustChip}>
            <span className={styles.trustDot} /> Free
          </span>
          <span className={styles.trustChip}>
            <span className={styles.trustDot} /> No signup
          </span>
          <span className={styles.trustChip}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Files stay in your browser
          </span>
        </div>
      </header>

      {/* 3. The Tool Area Card (generous padding, immediately visible above fold) */}
      <main className={styles.toolAreaCard}>
        {children}
      </main>

      {/* Optional Table of Contents for deep content pages */}
      {toc && toc.length > 0 && (
        <aside className={styles.tocContainer} aria-label="Table of contents">
          <span className={styles.tocHeading}>Jump to:</span>
          <ul className={styles.tocList}>
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* 5. Content sections as separate, well-spaced blocks */}
      <div className={styles.contentSections}>
        {/* How to Use: 3–5 numbered step cards with icons */}
        {howToSteps.length > 0 && (
          <section id="how-to-use" className={styles.contentBlock}>
            <h2 className={styles.blockHeading}>How to Use</h2>
            <div className={styles.howToGrid}>
              {howToSteps.map((step, idx) => (
                <div key={idx} className={styles.howToCard}>
                  <div className={styles.stepHeader}>
                    <span className={styles.stepIndex}>0{idx + 1}</span>
                    <span className={styles.stepIcon}>{step.icon || '✦'}</span>
                  </div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  {step.desc && <p className={styles.stepDesc}>{step.desc}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Features: responsive 2–3 column grid of small cards */}
        {features.length > 0 && (
          <section id="key-features" className={styles.contentBlock}>
            <h2 className={styles.blockHeading}>Key Features</h2>
            <div className={styles.featuresGrid}>
              {features.map((feat, idx) => (
                <div key={idx} className={styles.featureCard}>
                  <span className={styles.featureCheck}>✓</span>
                  <span className={styles.featureText}>{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* How It Works: Prose split with H3s and structured steps */}
        {howItWorksContent && (
          <section id="how-it-works" className={styles.contentBlock}>
            <h2 className={styles.blockHeading}>How It Works</h2>
            <div className={styles.howItWorksCard}>
              <Prose content={howItWorksContent} />
            </div>
          </section>
        )}

        {/* Tips & Limitations: honest limitation callout cards */}
        {tipsAndLimitations.length > 0 && (
          <section id="tips-and-limitations" className={styles.contentBlock}>
            <h2 className={styles.blockHeading}>Tips &amp; Honest Limitations</h2>
            <div className={styles.tipsGrid}>
              {tipsAndLimitations.map((item, idx) => (
                <div key={idx} className={`${styles.tipCard} ${styles[item.type]}`}>
                  <span className={styles.tipBadge}>
                    {item.type === 'tip' ? '💡 Tip' : item.type === 'limitation' ? '⚠️ Limitation' : 'ℹ️ Note'}
                  </span>
                  <h3 className={styles.tipTitle}>{item.title}</h3>
                  <p className={styles.tipDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ: Accessible accordion using <details>/<summary> for server-rendered HTML */}
        {faqs.length > 0 && (
          <section id="faq" className={styles.contentBlock}>
            <h2 className={styles.blockHeading}>Frequently Asked Questions</h2>
            <div className={styles.faqAccordion}>
              {faqs.map((faq, idx) => (
                <details key={idx} className={styles.faqItem} open={idx === 0}>
                  <summary className={styles.faqQuestion}>
                    <span>{faq.q}</span>
                    <span className={styles.faqIcon} aria-hidden="true">+</span>
                  </summary>
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Tools: Card grid with icon and one line each */}
        {relatedTools.length > 0 && (
          <section id="related-tools" className={styles.contentBlock}>
            <h2 className={styles.blockHeading}>Related Tools</h2>
            <div className={styles.relatedGrid}>
              {relatedTools.map((tool) => (
                <Link key={tool.id} href={tool.href} className={styles.relatedCard}>
                  <div className={styles.relatedTop}>
                    <span className={styles.relatedCategory}>{tool.category}</span>
                    <span className={styles.relatedArrow}>→</span>
                  </div>
                  <h3 className={styles.relatedTitle}>{tool.title}</h3>
                  <p className={styles.relatedTagline}>{tool.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Author / Trust Line */}
        <footer className={styles.trustFooter}>
          <div className={styles.authorBadge}>
            <span>
              Built by{' '}
              <Link href="/about" className={styles.authorLink}>
                Rajan Bhatta
              </Link>{' '}
              · Last updated {lastUpdated}
            </span>
            <span className={styles.privacyGuarantee}>
              🔒 100% Client-side · Zero server uploads
            </span>
          </div>

          {/* Quick link back to all tools */}
          <nav className={styles.allToolsNav} aria-label="Brand tools directory">
            <h3 className={styles.allToolsHeader}>All 21 Free Brand Tools</h3>
            <ul className={styles.allToolsUl}>
              {TOOLS.map((t) => (
                <li key={t.id}>
                  <Link href={t.href} className={t.id === toolId ? styles.activeToolLink : undefined}>
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default ToolShell;
