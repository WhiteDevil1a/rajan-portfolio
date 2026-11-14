import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import footerLinks from '@src/components/dom/navbar/constants/footerLinks';
import gsap from 'gsap';
import menuLinks from '@src/components/dom/navbar/constants/menuLinks';
import projectsLinks from '@src/components/dom/navbar/constants/projectsLinks';
import styles from '@src/components/dom/navbar/styles/menuLinks.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useRouter } from 'next/router';
import { useStore } from '@src/store';
import { TOOLS_BY_CATEGORY } from '@src/data/tools';

function MenuLinks() {
  const timeline = useRef(gsap.timeline({ paused: true, defaults: { duration: 0.92, ease: 'expo.inOut' } }));
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen, lenis, isLoading] = useStore((state) => [
    state.isMenuOpen,
    state.setIsMenuOpen,
    state.lenis,
    state.isLoading,
  ]);
  const menuRef = useRef();
  const menuLinksItemsRef = useRef([]);
  const router = useRouter();

  // Dropdown state for Brand Tools
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    if (lenis) lenis.start();
  }, [lenis, setIsMenuOpen]);

  const setupMenuAnimation = (gsapTimeline, refs) => {
    const fluidCanvas = document?.getElementById('fluidCanvas');
    const layout = document?.getElementById('layout');
    const scrollbar = document?.getElementById('scrollbar');
    const header = document?.querySelector('header');

    gsap.set(refs.menuRef.current, { pointerEvents: 'none', autoAlpha: 0 });
    gsap.set(refs.menuLinksItemsRef.current, { x: '-100%' });

    gsapTimeline
      .to(refs.menuRef.current, { autoAlpha: 1, stagger: 0.01, pointerEvents: 'auto' }, 0)
      .to(fluidCanvas, { duration: 0, opacity: 0 }, 0)
      .to(refs.menuLinksItemsRef.current, { x: 0, stagger: 0.016, pointerEvents: 'auto' }, 0)
      .to('main', { borderRadius: '1.3888888889vw', border: '2px solid #f0f4f1', scale: 0.9, pointerEvents: 'none', left: isMobile ? '-100vw' : '-40vw' }, 0)
      .to(layout, { opacity: isMobile ? 0.05 : 0.3, height: '90svh' }, 0)
      .to(scrollbar, { opacity: 0, right: '46vw', scale: 0.9 }, 0)
      .to(header, { autoAlpha: 0, left: isMobile ? '-100vw' : '-40vw', top: isMobile ? '6vw' : '3vw', scale: 0.9, overwrite: true }, 0);
  };

  useEffect(() => {
    const tl = timeline.current;
    const refs = { menuRef, menuLinksItemsRef };
    const ctx = gsap.context(() => {
      setupMenuAnimation(tl, refs);
    });

    return () => {
      if (tl) {
        tl.kill();
      }
      ctx.kill();
    };
  }, [isLoading, isMobile]);

  useEffect(() => {
    const tl = timeline.current;
    if (isMenuOpen) {
      tl.play();
    } else {
      tl.reverse();
    }
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
      if (lenis) lenis.start();
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events, lenis, setIsMenuOpen]);

  // ESC key to close menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  const goToBottom = () => {
    setIsMenuOpen(false);

    setTimeout(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        const mainHeight = mainElement.scrollHeight;
        if (lenis) {
          lenis.scrollTo(mainHeight, {
            duration: 1.5,
            force: true,
            easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
            onComplete: () => {
              lenis.start();
            },
          });
        }
      }
    }, 850);
  };

  const renderMenuLinks = (links, refs, pathname) =>
    links.map((link, index) => {
      const isBrandTools = link.title === 'Brand Tools';

      return (
        <div
          ref={(el) => {
            menuLinksItemsRef.current[index + 1] = el;
          }}
          key={link.title}
          className={clsx(styles.menuListItem, pathname === link.href && styles.menuListItemActive)}
        >
          {isBrandTools ? (
            <div>
              <div className={styles.brandToolsHeader}>
                <Link aria-label={`Go ${link.title}`} scroll={false} href={link.href} onClick={closeMenu}>
                  <span>{link.title}</span>
                </Link>
                <button
                  type="button"
                  aria-expanded={isDropdownOpen}
                  aria-label="Toggle Brand Tools dropdown"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className={styles.dropdownToggleBtn}
                >
                  <svg
                    className={clsx(styles.chevron, isDropdownOpen && styles.chevronOpen)}
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 4.5L6 8L9.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {/* Brand Foundation */}
                  <div className={styles.dropdownCategoryTitle}>Brand Foundation</div>
                  {(TOOLS_BY_CATEGORY['Brand Foundation'] || []).map((tool) => (
                    <Link key={tool.id} href={tool.href} scroll={false} className={styles.dropdownItem} onClick={closeMenu}>
                      {tool.title}
                    </Link>
                  ))}

                  {/* Branded Assets */}
                  <div className={styles.dropdownCategoryTitle}>Branded Assets</div>
                  {(TOOLS_BY_CATEGORY['Branded Assets'] || []).map((tool) => (
                    <Link key={tool.id} href={tool.href} scroll={false} className={styles.dropdownItem} onClick={closeMenu}>
                      {tool.title}
                    </Link>
                  ))}

                  {/* Image & SVG Tools */}
                  <div className={styles.dropdownCategoryTitle}>Image &amp; SVG Tools</div>
                  {(TOOLS_BY_CATEGORY['Image & SVG Tools'] || []).map((tool) => (
                    <Link key={tool.id} href={tool.href} scroll={false} className={styles.dropdownItem} onClick={closeMenu}>
                      {tool.title}
                    </Link>
                  ))}

                  {/* Nepali Tools */}
                  <div className={styles.dropdownCategoryTitle}>Nepali Tools</div>
                  {(TOOLS_BY_CATEGORY['Nepali Tools'] || []).map((tool) => (
                    <Link key={tool.id} href={tool.href} scroll={false} className={styles.dropdownItem} onClick={closeMenu}>
                      {tool.title}
                    </Link>
                  ))}

                  <Link href="/brand-tools" scroll={false} className={styles.dropdownViewAll} onClick={closeMenu}>
                    View All 21 Tools →
                  </Link>
                </div>
              )}
            </div>
          ) : link.href !== undefined ? (
            <Link aria-label={`Go ${link.title}`} scroll={false} href={link.href} onClick={closeMenu}>
              <span>{link.title}</span>
            </Link>
          ) : (
            <span
              onClick={goToBottom}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  goToBottom();
                }
              }}
            >
              {link.title}
            </span>
          )}
        </div>
      );
    });

  return (
    <nav id="menu" ref={menuRef} className={styles.menu}>
      <div className={clsx(styles.menuWrapper, 'layout-block-inner')}>
        <div
          ref={(el) => {
            menuLinksItemsRef.current[0] = el;
          }}
          className={styles.menuList}
        >
          {renderMenuLinks(menuLinks, menuLinksItemsRef, router.pathname)}
        </div>
        <div
          ref={(el) => {
            menuLinksItemsRef.current[menuLinks.length + 2] = el;
          }}
          className={styles.menuList}
        >
          {projectsLinks.map((link, index) => (
            <div
              ref={(el) => {
                menuLinksItemsRef.current[menuLinks.length + index + 2] = el;
              }}
              key={link.title}
              className={styles.menuListItem}
            >
              <Link aria-label={`Go ${link.title}`} scroll={false} href={link.href} onClick={closeMenu}>
                <span>{link.title}</span>
              </Link>
            </div>
          ))}
        </div>
        <div
          ref={(el) => {
            menuLinksItemsRef.current[menuLinks.length + projectsLinks.length + 3] = el;
          }}
          className={styles.menuList}
        >
          <div
            role="presentation"
            ref={(el) => {
              menuLinksItemsRef.current[menuLinks.length + projectsLinks.length + 3] = el;
            }}
            className={styles.menuListItem}
          >
            <Link aria-label="Send email" scroll={false} href="mailto:hi@rajanbhatta.com.np" onClick={closeMenu}>
              <span>SAY HELLO</span>
            </Link>
          </div>
        </div>
        <div
          ref={(el) => {
            menuLinksItemsRef.current[menuLinks.length + projectsLinks.length + 4] = el;
          }}
          className={styles.menuList}
        >
          {footerLinks.map((link, index) => (
            <div
              ref={(el) => {
                menuLinksItemsRef.current[menuLinks.length + projectsLinks.length + index + 4] = el;
              }}
              key={link.title}
              className={styles.menuListItem}
            >
              <Link aria-label={`Find me on ${link.title}`} target="_blank" rel="noopener noreferrer" scroll={false} href={link.href} onClick={closeMenu}>
                <span>{link.title}</span>
              </Link>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={closeMenu}
          className={styles.menuClose}
          aria-label="Close menu"
        >
          <p>&#10005;</p>
        </button>
      </div>
    </nav>
  );
}

export default MenuLinks;
