import React from 'react';
import Link from 'next/link';
import CustomHead from '@src/components/dom/CustomHead';
import { TOOLS_BY_CATEGORY, TOOL_CATEGORIES } from '@src/data/tools';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';
import ToolFaq from '@src/components/brandTools/ToolFaq';

const SITE_URL = 'https://rajanbhatta.com.np';

const seo = {
  title: 'Free Brand Design Tools & Online Utilities Suite | Rajan Bhatta',
  description:
    '17 free professional brand design tools — SVG converter, favicon generator, Nepali date converter, color contrast checker, QR code maker and more. No login, no watermark, runs in your browser.',
  canonical: `${SITE_URL}/brand-tools`,
};

const LANDING_FAQS = [
  {
    q: 'What is the Brand Design Tools Suite?',
    a: 'The Brand Design Tools Suite is an interconnected set of 17 free brand identity utilities. It enables designers, founders, and creative directors to define, manage, test, and export professional brand assets — connected through a central Brand Kit that automatically powers every generator.',
  },
  {
    q: 'How does the central Brand Kit sync across the entire tool suite?',
    a: 'When you configure your brand assets (logos, typography, primary and accent colors, contact details) in the Brand Kit hub, every generator — including Business Cards, Letterheads, Email Signatures, Gradients, and QR Codes — automatically inherits your identity parameters.',
  },
  {
    q: 'Are these tools completely free to use?',
    a: 'Yes. All 17 tools are 100% free with no login required, no subscription limits, and no watermarks. High-resolution PNGs, vector SVGs, and print-ready PDFs can be exported instantly.',
  },
  {
    q: 'Do my files ever get uploaded to a server?',
    a: 'Never. All processing — image conversion, SVG optimization, Nepali font conversion, favicon generation — runs entirely in your browser. Your files and text never leave your device.',
  },
  {
    q: 'Are there Nepali-language tools?',
    a: 'Yes. The Nepali Tools category includes a Preeti to Unicode converter, a Nepali Unicode typing editor with phonetic input, and a Bikram Sambat ↔ Gregorian date converter.',
  },
];

// Build ItemList JSON-LD from registry
const getItemListSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Free Brand Design Tools by Rajan Bhatta',
  url: `${SITE_URL}/brand-tools`,
  itemListElement: TOOL_CATEGORIES.flatMap((cat) =>
    (TOOLS_BY_CATEGORY[cat] || []).map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.title,
      url: `${SITE_URL}${tool.href}`,
    })),
  ),
});

function BrandToolsLandingPage() {
  return (
    <div className={clsx(styles.brandToolsRoot, 'layout-block-inner')}>
      <CustomHead
        title={seo.title}
        description={seo.description}
        canonical={seo.canonical}
        noPersonSchema
      />

      {/* ItemList JSON-LD */}
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getItemListSchema()) }}
      />

      {/* Breadcrumb JSON-LD */}
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Brand Tools', item: `${SITE_URL}/brand-tools` },
            ],
          }),
        }}
      />

      {/* Hero Section */}
      <section className={styles.landingHero}>
        <div style={{ marginBottom: '0.85rem' }}>
          <span className={styles.toolCategoryBadge}>Brand Identity &amp; Design System Suite</span>
        </div>
        <h1 className={styles.heroTitle}>Free Brand Design Tools</h1>
        <p className={styles.heroSubtitle}>
          Professional, 100% free brand design utilities to establish, manage, and deploy cohesive visual identity
          systems. Connected through a central Brand Kit that automatically powers every generator.
        </p>
        <div className={styles.privacyNote}>
          <span className={styles.dot} />
          <span>17 Tools · 100% Free · No Login · Your files never leave your browser</span>
        </div>
      </section>

      {/* 200-word intro — server-rendered for SEO */}
      <section className={styles.introSection}>
        <p className={styles.introText}>
          Building a consistent brand identity used to require expensive software and a large design team. This suite
          gives you 17 professional-grade tools — completely free, with no account, no watermark, and no data ever
          sent to a server.
        </p>
        <p className={styles.introText}>
          <strong>Brand Foundation tools</strong> help you define the core elements of your visual identity: extract
          color palettes from images, generate WCAG-compliant color systems, build CSS gradients, and store everything
          in a central Brand Kit that auto-fills every other tool.
        </p>
        <p className={styles.introText}>
          <strong>Branded Assets tools</strong> turn your identity into production-ready outputs — print-ready
          business cards at 300 DPI, HTML email signatures tested in Gmail and Outlook, A4 letterheads, and branded
          QR codes with logo embedding and SVG export.
        </p>
        <p className={styles.introText}>
          <strong>Image &amp; SVG tools</strong> handle technical file conversion: convert SVG to PNG/JPG/WebP,
          trace raster images to vectors, compress and optimize SVG files with SVGO, generate a complete favicon
          package, and compress images with quality and target-size controls.
        </p>
        <p className={styles.introText}>
          <strong>Nepali Tools</strong> are built for Devanagari script users: convert legacy Preeti font text to
          standard Unicode, type Nepali phonetically or with an on-screen keyboard, and convert dates between Bikram
          Sambat (BS) and Gregorian (AD) calendars with Nepali numerals and day names.
        </p>
      </section>

      {/* Tool categories */}
      {TOOL_CATEGORIES.map((cat) => {
        const tools = TOOLS_BY_CATEGORY[cat];
        if (!tools || tools.length === 0) return null;
        return (
          <section key={cat} className={styles.categorySection}>
            <div className={styles.categoryTitle}>
              <span>{cat}</span>
            </div>
            <div className={styles.toolGrid}>
              {tools.map((tool) => (
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
        );
      })}

      {/* Ecosystem Workflow */}
      <div className={styles.educationalSection}>
        <h2 className={styles.sectionHeading}>The Brand Design System Workflow</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>01</div>
            <h4>Define Foundation in Brand Kit</h4>
            <p>
              Input core company information, upload approved vector logos, specify color tokens, and select
              typography hierarchy in a unified dashboard.
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>02</div>
            <h4>Instant Cross-Tool Deployment</h4>
            <p>
              Open any asset generator — Business Cards, Letterheads, Email Signatures, Gradients, or QR Codes — with
              your identity tokens pre-populated automatically.
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>03</div>
            <h4>Export Production-Ready Deliverables</h4>
            <p>
              Download vector print PDFs, copy email-client HTML tables, generate high-DPI raster assets, and produce
              complete Brand Guidelines books.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.educationalSection}>
        <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
        <ToolFaq faqs={LANDING_FAQS} />
      </div>

      {/* All tools footer list */}
      <nav className={styles.allToolsFooter} aria-label="All brand tools">
        <h3 className={styles.allToolsHeading}>All Tools</h3>
        <ul className={styles.allToolsList}>
          {TOOL_CATEGORIES.flatMap((cat) =>
            (TOOLS_BY_CATEGORY[cat] || []).map((tool) => (
              <li key={tool.id}>
                <Link href={tool.href}>{tool.title}</Link>
              </li>
            )),
          )}
        </ul>
      </nav>
    </div>
  );
}

export default BrandToolsLandingPage;
