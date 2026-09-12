import React, { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import LogoSearchInput from '@src/components/brandTools/LogoSearch/LogoSearchInput';
import LogoGrid from '@src/components/brandTools/LogoSearch/LogoGrid';
import LogoDetailPanel from '@src/components/brandTools/LogoSearch/LogoDetailPanel';
import styles from '@src/styles/brandTools.module.scss';
import { getAllIconsMeta } from '@src/lib/logoSearch/getIconData';

const SITE_URL = 'https://rajanbhatta.com.np';

const HOW_IT_WORKS = [
  {
    title: 'Search by Brand Name',
    desc: 'Type any brand name into the search field. The grid filters instantly in your browser — no page reloads, no servers involved.',
  },
  {
    title: 'Inspect Official Brand Color',
    desc: 'Each card shows the brand\'s official hex color code sourced directly from published brand guidelines.',
  },
  {
    title: 'Copy or Download in One Click',
    desc: 'Click any brand to open the detail panel. Copy the SVG markup, copy the hex code, or download a vector SVG / 512×512 PNG instantly.',
  },
];

const WHY_USE_IT = [
  {
    title: 'Accurate Brand Colors',
    desc: 'Official hex codes sourced from each brand\'s published identity guidelines — not approximations or fan-made palettes.',
  },
  {
    title: 'Vector Quality, Zero Compression',
    desc: 'Every logo is a clean SVG — infinitely scalable, lightweight, and ready for any use in design mockups and presentations.',
  },
  {
    title: 'Instant, No Sign-Up',
    desc: 'All 3,000+ logos are searchable and downloadable in seconds. No account, no subscription, no watermarks — ever.',
  },
];

const FAQS = [
  {
    q: 'How many brand logos are available?',
    a: 'The library contains over 3,000 brand logos, covering major technology companies, social media platforms, design tools, financial services, and many more categories.',
  },
  {
    q: 'Are these logos free to use?',
    a: 'The SVG data is available under the CC0 1.0 Universal license — no attribution required for the file itself. However, individual brand logos and trademarks are the intellectual property of their respective owners. Always ensure your use complies with each brand\'s usage guidelines before publishing.',
  },
  {
    q: 'What formats can I download?',
    a: 'SVG (vector, infinitely scalable) and PNG (512×512 pixels with white background, ready for presentations and mockups).',
  },
  {
    q: 'How do I get the official hex color for a brand?',
    a: 'Click any logo card to open its detail panel. The official brand hex color is displayed alongside a color swatch. Click "Copy Hex" to copy it to your clipboard.',
  },
  {
    q: 'Can I use these logos with the Brand Kit tool?',
    a: 'Yes — once you copy an SVG or download a PNG, you can upload it directly into the Brand Kit tool to build a full visual identity system around it.',
  },
];

function BrandLogoSearchPage({ icons }) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [layout, setLayout] = useState('grid');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [toast, setToast] = useState('');

  const filteredIcons = useMemo(() => {
    let result = icons;
    const q = query.trim().toLowerCase();
    
    if (q) {
      result = icons.filter((icon) => icon.title.toLowerCase().includes(q));
    }
    
    if (sortBy === 'color') {
      result = [...result].sort((a, b) => {
        if (!a.hsl || !b.hsl) return 0;
        if (Math.abs(a.hsl.h - b.hsl.h) > 10) return a.hsl.h - b.hsl.h;
        if (Math.abs(a.hsl.s - b.hsl.s) > 10) return b.hsl.s - a.hsl.s;
        return b.hsl.l - a.hsl.l;
      });
    }
    
    return result;
  }, [icons, query, sortBy]);

  const handleCardClick = useCallback((icon) => {
    setSelectedIcon(icon);
  }, []);

  const handlePanelClose = useCallback(() => {
    setSelectedIcon(null);
  }, []);

  const resultLabel = query.trim()
    ? `Showing ${filteredIcons.length.toLocaleString('en-US')} result${filteredIcons.length !== 1 ? 's' : ''} for "${query.trim()}"`
    : `Showing all ${icons.length.toLocaleString('en-US')} brands`;

  const pageUrl = `${SITE_URL}/brand-tools/logo`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Brand Logo Search — Download Brand Logos SVG & Official Colors',
    description:
      'Search 3,000+ brand logos. Download SVG and PNG, copy official brand hex colors. Free brand logo finder by Rajan Bhatta.',
    url: pageUrl,
    author: {
      '@type': 'Person',
      name: 'Rajan Bhatta',
      url: SITE_URL,
    },
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={pageUrl} />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <ToolLayout
        toolId="logo-search"
        number="09"
        category="Brand Research"
        title="Brand Logo Search"
        subtitle="Search 3,000+ official brand logos. Find the exact SVG and official hex color for any brand — copy, download, and use in your mockups instantly."
        seoTitle="Brand Logo Search — Download Brand Logos SVG & Official Colors | Rajan Bhatta"
        seoDescription="Free brand logo search tool. Find any brand's official logo SVG and exact hex color. Download SVG or PNG instantly — 3,000+ brands, no login required."
        seoKeywords={[
          'brand logo search',
          'download brand logo svg',
          'free brand logo finder',
          'official brand colors',
          'brand svg download',
          'logo hex color',
          'brand logo png download',
        ]}
        showBrandKitBanner={false}
        howItWorks={HOW_IT_WORKS}
        whyUseIt={WHY_USE_IT}
        faqs={FAQS}
        relatedToolIds={['color-palette', 'brand-kit', 'color-contrast']}
      >
        <div className={styles.logoSearchWrapper}>
          
          <div className={styles.logoControlsRow}>
            <div className={styles.logoSearchTop}>
              <div className={styles.logoSearchBarInner}>
                <LogoSearchInput value={query} onChange={setQuery} />
              </div>
              <div className={styles.logoFilters}>
                <div className={styles.filterGroup}>
                  <label htmlFor="sort-by">Sort by</label>
                  <select 
                    id="sort-by"
                    className={styles.logoSelect} 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="alphabetical">Alphabetical</option>
                    <option value="color">Color</option>
                  </select>
                </div>
                
                <div className={styles.logoLayoutToggle} role="group" aria-label="Layout View">
                  <button 
                    type="button" 
                    className={layout === 'grid' ? styles.activeLayout : ''}
                    onClick={() => setLayout('grid')}
                    aria-label="Grid View"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  </button>
                  <button 
                    type="button"
                    className={layout === 'compact' ? styles.activeLayout : ''}
                    onClick={() => setLayout('compact')}
                    aria-label="Compact View"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className={styles.logoResultCount}>{resultLabel}</p>
          <LogoGrid icons={filteredIcons} onCardClick={handleCardClick} layout={layout} />
        </div>
      </ToolLayout>

      {selectedIcon && (
        <LogoDetailPanel
          icon={selectedIcon}
          onClose={handlePanelClose}
          toast={toast}
          setToast={setToast}
        />
      )}
    </>
  );
}

export async function getStaticProps() {
  const icons = getAllIconsMeta();
  return {
    props: { icons },
  };
}

export default BrandLogoSearchPage;
