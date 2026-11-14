import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import footerLinks from '@src/components/dom/navbar/constants/footerLinks';
import gsap from 'gsap';
import menuLinks from '@src/components/dom/navbar/constants/menuLinks';
import styles from '@src/styles/menuLinksEnhanced.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useRouter } from 'next/router';
import { useStore } from '@src/store';
import { TOOLS_BY_CATEGORY, TOOL_CATEGORIES, TOOLS } from '@src/data/tools';

const TOOL_ICONS = {
  'brand-kit': '🎨',
  'color-palette': '🌈',
  'gradient': '📐',
  'color-contrast': '👁️',
  'business-card': '📇',
  'email-signature': '✉️',
  'letterhead': '📝',
  'qr-code': '📱',
  'logo-search': '🔍',
  'svg-to-png': '🖼️',
  'png-to-svg': '⚡',
  'svg-optimizer': '🧹',
  'favicon-generator': '🌐',
  'image-compressor': '🗜️',
  'preeti-to-unicode': '🔤',
  'preeti-word-to-unicode': '📄',
  'nepali-unicode-typing': '⌨️',
  'nepali-date-converter': '📅',
  'nepali-ocr': '📑',
  'nepali-speech-to-text': '🎙️',
  'preeti-pdf-to-unicode': '📜',
};

function MenuLinks() {
  const timeline = useRef(gsap.timeline({ paused: true, defaults: { duration: 0.8, ease: 'expo.inOut' } }));
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen, lenis, isLoading] = useStore((state) => [
    state.isMenuOpen,
    state.setIsMenuOpen,
    state.lenis,
    state.isLoading,
  ]);
  const menuRef = useRef(null);
  const router = useRouter();

  // Dropdown & Search state
  const isBrandToolsRoute = router.pathname.startsWith('/brand-tools');
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(isBrandToolsRoute);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState(
    () => new Set(TOOL_CATEGORIES) // Default all expanded in dropdown for easy discovery
  );

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    if (lenis) lenis.start();
    const toggleBtn = document.getElementById('menu-toggle-button');
    if (toggleBtn) toggleBtn.focus();
  }, [lenis, setIsMenuOpen]);

  // Setup GSAP Animation
  useEffect(() => {
    const tl = timeline.current;
    const fluidCanvas = document?.getElementById('fluidCanvas');
    const layout = document?.getElementById('layout');
    const scrollbar = document?.getElementById('scrollbar');
    const header = document?.querySelector('header');

    if (menuRef.current) {
      gsap.set(menuRef.current, { pointerEvents: 'none', autoAlpha: 0 });
    }

    tl.clear();
    tl.to(menuRef.current, { autoAlpha: 1, duration: 0.45, pointerEvents: 'auto' }, 0)
      .to(fluidCanvas, { duration: 0, opacity: 0 }, 0)
      .to('main', { borderRadius: '1.3888888889vw', border: '2px solid #f0f4f1', scale: 0.9, pointerEvents: 'none', left: isMobile ? '-100vw' : '-45vw' }, 0)
      .to(layout, { opacity: isMobile ? 0.05 : 0.3, height: '90svh' }, 0)
      .to(scrollbar, { opacity: 0, right: '46vw', scale: 0.9 }, 0)
      .to(header, { autoAlpha: 0, left: isMobile ? '-100vw' : '-45vw', top: isMobile ? '6vw' : '3vw', scale: 0.9, overwrite: true }, 0);

    return () => {
      if (tl) tl.kill();
    };
  }, [isLoading, isMobile]);

  // Play/Reverse menu animation
  useEffect(() => {
    const tl = timeline.current;
    if (isMenuOpen) {
      tl.play();
    } else {
      tl.reverse();
    }
  }, [isMenuOpen]);

  // Automatically close menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      if (isMenuOpen) {
        closeMenu();
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events, isMenuOpen, closeMenu]);

  // Accessibility: Keyboard trap & Escape to close
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }

      // Focus trap
      if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  const toggleCategory = (cat) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  // Filter tools by search query
  const filteredToolsByCategory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const result = {};

    for (const cat of TOOL_CATEGORIES) {
      const tools = TOOLS_BY_CATEGORY[cat] || [];
      if (!q) {
        result[cat] = tools;
      } else {
        const matching = tools.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.tagline?.toLowerCase().includes(q)
        );
        if (matching.length > 0) {
          result[cat] = matching;
        }
      }
    }

    return result;
  }, [searchQuery]);

  const goToBottom = () => {
    closeMenu();
    setTimeout(() => {
      const mainElement = document.querySelector('main');
      if (mainElement && lenis) {
        const mainHeight = mainElement.scrollHeight;
        lenis.scrollTo(mainHeight, {
          duration: 1.5,
          force: true,
          easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          onComplete: () => {
            lenis.start();
          },
        });
      }
    }, 500);
  };

  return (
    <nav
      id="menu"
      ref={menuRef}
      className={styles.menuRoot}
      aria-label="Site menu"
      aria-hidden={!isMenuOpen}
    >
      <div className={styles.menuContainer}>
        {/* Top Header Row with Close Button */}
        <div className={styles.menuHeader}>
          <span className={styles.sitemapTitle}>Navigation</span>
          <button
            type="button"
            onClick={closeMenu}
            className={styles.closeBtn}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Live Search Field */}
        <div className={styles.searchSection}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon} aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              placeholder="Search 21 brand tools..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isToolsDropdownOpen) setIsToolsDropdownOpen(true);
              }}
              className={styles.searchInput}
              aria-label="Search brand tools"
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Top-Level Navigation Links */}
        <ul className={styles.topLevelList}>
          {/* 1. Home */}
          <li className={clsx(styles.topLevelItem, router.pathname === '/' && styles.activeItem)}>
            <Link href="/" onClick={closeMenu}>
              <span>Home</span>
            </Link>
          </li>

          {/* 2. About me */}
          <li className={clsx(styles.topLevelItem, router.pathname === '/about' && styles.activeItem)}>
            <Link href="/about" onClick={closeMenu}>
              <span>About me</span>
            </Link>
          </li>

          {/* 3. Brand Tools — WITH EXPANDABLE DROPDOWN */}
          <li
            className={clsx(
              styles.topLevelItem,
              styles.dropdownItem,
              router.pathname.startsWith('/brand-tools') && styles.activeItem
            )}
          >
            <div className={styles.dropdownHeaderRow}>
              <Link href="/brand-tools" onClick={closeMenu} className={styles.dropdownMainLink}>
                <span>Brand Tools</span>
                <span className={styles.toolCountBadge}>21</span>
              </Link>

              {/* Dropdown Toggle Button */}
              <button
                type="button"
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className={clsx(
                  styles.dropdownToggleBtn,
                  isToolsDropdownOpen && styles.dropdownToggleActive
                )}
                aria-expanded={isToolsDropdownOpen}
                aria-controls="brand-tools-dropdown-panel"
                aria-label="Toggle brand tools dropdown"
              >
                <span className={styles.chevron}>▾</span>
              </button>
            </div>

            {/* Expandable Dropdown Panel */}
            <div
              id="brand-tools-dropdown-panel"
              className={clsx(
                styles.dropdownPanel,
                isToolsDropdownOpen && styles.dropdownPanelOpen
              )}
            >
              <div className={styles.dropdownPanelInner}>
                <div className={styles.hubQuickLinkRow}>
                  <Link href="/brand-tools" onClick={closeMenu} className={styles.viewHubLink}>
                    View All Tools Hub →
                  </Link>
                </div>

                {Object.entries(filteredToolsByCategory).map(([cat, tools]) => (
                  <div key={cat} className={styles.categoryGroup}>
                    <button
                      type="button"
                      className={styles.categoryAccordionHeader}
                      onClick={() => toggleCategory(cat)}
                      aria-expanded={openCategories.has(cat)}
                    >
                      <span className={styles.categoryTitleText}>{cat}</span>
                      <span className={styles.categoryCount}>({tools.length})</span>
                      <span className={styles.accordionChevron}>
                        {openCategories.has(cat) ? '−' : '+'}
                      </span>
                    </button>

                    {openCategories.has(cat) && (
                      <ul className={styles.toolSubList}>
                        {tools.map((tool) => (
                          <li
                            key={tool.id}
                            className={clsx(
                              styles.toolSubItem,
                              router.asPath === tool.href && styles.activeToolItem
                            )}
                          >
                            <Link href={tool.href} onClick={closeMenu} className={styles.toolLink}>
                              <span className={styles.toolIcon}>
                                {TOOL_ICONS[tool.id] || '✦'}
                              </span>
                              <span className={styles.toolTitleText}>{tool.title}</span>
                              <span className={styles.toolLinkArrow}>→</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </li>

          {/* 4. Contact */}
          <li className={styles.topLevelItem}>
            <button type="button" onClick={goToBottom} className={styles.contactBtn}>
              <span>Contact</span>
            </button>
          </li>
        </ul>

        {/* Say Hello Section */}
        <div className={styles.sayHelloSection}>
          <a
            href="mailto:hi@rajanbhatta.com.np"
            className={styles.sayHelloLink}
            onClick={closeMenu}
          >
            <span>SAY HELLO</span>
            <span className={styles.emailAddress}>hi@rajanbhatta.com.np</span>
          </a>
        </div>

        {/* Follow Me Social Links */}
        <div className={styles.footerSection}>
          <span className={styles.footerSectionHeading}>Follow Me</span>
          <div className={styles.socialLinksRow}>
            {footerLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                {link.title}
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className={styles.legalLinksRow}>
            <Link href="/privacy" onClick={closeMenu}>
              Privacy
            </Link>
            <span className={styles.legalDot}>·</span>
            <Link href="/terms" onClick={closeMenu}>
              Terms
            </Link>
            <span className={styles.legalDot}>·</span>
            <Link href="/licenses" onClick={closeMenu}>
              Licenses
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default MenuLinks;
