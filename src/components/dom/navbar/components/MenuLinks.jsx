import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import footerLinks from '@src/components/dom/navbar/constants/footerLinks';
import gsap from 'gsap';
import styles from '@src/styles/menuLinksEnhanced.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useRouter } from 'next/router';
import { useStore } from '@src/store';
import { TOOLS_BY_CATEGORY, TOOL_CATEGORIES } from '@src/data/tools';



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

  const isBrandToolsRoute = router.pathname.startsWith('/brand-tools');
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(isBrandToolsRoute);
  const [openCategories, setOpenCategories] = useState(
    () => new Set(TOOL_CATEGORIES)
  );

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    if (lenis) lenis.start();
    const toggleBtn = document.getElementById('menu-toggle-button');
    if (toggleBtn) toggleBtn.focus();
  }, [lenis, setIsMenuOpen]);

  const toggleCategory = useCallback((cat) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  // Setup GSAP Animation — identical to original animation
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

  // Auto-close on route change
  useEffect(() => {
    const handleRouteChange = () => closeMenu();
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events, closeMenu]);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, closeMenu]);

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

                {TOOL_CATEGORIES.map((cat) => {
                  const tools = TOOLS_BY_CATEGORY[cat] || [];
                  if (tools.length === 0) return null;
                  return (
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
                                <span className={styles.toolTitleText}>{tool.title}</span>
                                <span className={styles.toolLinkArrow}>→</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
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
