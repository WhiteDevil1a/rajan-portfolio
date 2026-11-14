import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import Link from 'next/link';
import LinkText from '@src/components/animationComponents/linkText/Index';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import footerLinks from '@src/components/dom/navbar/constants/footerLinks';
import gsap from 'gsap';
import menuLinks from '@src/components/dom/navbar/constants/menuLinks';
import styles from '@src/components/dom/styles/footer.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';
import { useRouter } from 'next/router';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import { useWindowSize } from '@darkroom.engineering/hamo';
import { TOOLS_BY_CATEGORY } from '@src/data/tools';

const Time = dynamic(() => import('@src/components/dom/Time'), { ssr: false });
const GoTop = dynamic(() => import('@src/components/dom/GoTop'), { ssr: false });

const SITEMAP_PAGES = [
  ...menuLinks.slice(0, -1),
  { title: 'Privacy Policy', href: '/privacy' },
  { title: 'Terms of Service', href: '/terms' },
  { title: 'Open Licenses', href: '/licenses' },
];

const BRAND_FOUNDATION_TOOLS = [
  ...(TOOLS_BY_CATEGORY['Brand Foundation'] || []),
  ...(TOOLS_BY_CATEGORY['Branded Assets'] || []),
];

const IMAGE_SVG_TOOLS = [
  ...(TOOLS_BY_CATEGORY['Image & SVG Tools'] || []),
  ...(TOOLS_BY_CATEGORY['Brand Research'] || []),
];

const NEPALI_TOOLS = TOOLS_BY_CATEGORY['Nepali Tools'] || [];

function Footer() {
  const isMobile = useIsMobile();
  const footerRef = useRef();
  const [isLoading, siteReady] = useStore(useShallow((state) => [state.isLoading, state.siteReady]));
  const windowSize = useWindowSize();
  const router = useRouter();

  const isReady = siteReady || !isLoading;

  useIsomorphicLayoutEffect(() => {
    if (isReady && footerRef.current) {
      const setupFooterAnimation = () => {
        gsap.set(footerRef.current, { height: 'auto' });
        const allSections = document.querySelectorAll('#mainContainer section');
        if (allSections.length > 1) {
          const lastSection = allSections[allSections.length - 2];
          const vh = windowSize.height || (typeof window !== 'undefined' ? window.innerHeight : 0);
          if (vh > 0 && footerRef.current.offsetHeight <= vh) {
            gsap.set(footerRef.current, { yPercent: -50 });
            const uncover = gsap.timeline({ paused: true });
            gsap.set(footerRef.current, { height: '100.5svh' });
            uncover.to(footerRef.current, {
              yPercent: 0,
              ease: 'none',
            });
            ScrollTrigger.create({
              id: 'footerTrigger',
              trigger: lastSection,
              start: 'bottom bottom',
              end: '+=100%',
              animation: uncover,
              scrub: true,
              scroller: document?.querySelector('main'),
            });
            ScrollTrigger.refresh();
          } else {
            gsap.set(footerRef.current, { transform: 'translate(0%, 0%)', height: 'auto' });
          }
        }
      };

      setupFooterAnimation();
    }

    return () => {
      const footerTrigger = ScrollTrigger.getById('footerTrigger');
      if (footerTrigger) {
        footerTrigger.kill();
      }
    };
  }, [isReady, windowSize.height, router.asPath]);

  return (
    <section ref={footerRef} className={clsx(styles.root, 'layout-grid-inner')} role="contentinfo">
      {/* Top Row: Connect Email + Social Follow */}
      <div style={{ gridColumn: isMobile ? '1 / 7' : '1 / 11' }} className={styles.emailContaineer}>
        <AppearTitle isFooter>
          <h4 className={clsx(styles.workWithMe, 'h4')}>Let&apos;s Connect:</h4>
          <div>
            <div className={styles.link}>
              <Link aria-label="Send email" scroll={false} href="mailto:hi@rajanbhatta.com.np">
                <h4 className={clsx(styles.email, 'h4')}>hi@rajanbhatta.com.np</h4>
              </Link>
              <svg className={clsx(styles.linkGraphic)} width="300%" height="100%" viewBox="0 0 1200 60" preserveAspectRatio="none">
                <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0" />
              </svg>
            </div>
          </div>
        </AppearTitle>
      </div>

      <div style={{ gridColumn: isMobile ? '1 / 7' : '11 / 17' }} className={styles.linksContainer}>
        <AppearTitle isFooter>
          <h6 className={clsx(styles.title, 'h6')}>Follow me</h6>
          {footerLinks.map((link) => (
            <div key={link.title} className={styles.linkTextContainer}>
              <LinkText target className={styles.linkText} title={link.title} href={link.href}>
                <span className="footer">{link.title}</span>
              </LinkText>
            </div>
          ))}
        </AppearTitle>
      </div>

      {/* Expanded Sitemap Grid (4 Columns) */}
      <div style={{ gridColumn: isMobile ? '1 / 4' : '1 / 5' }} className={styles.sitemapColumn}>
        <AppearTitle isFooter>
          <h6 className={styles.title}>Pages &amp; Legal</h6>
          {SITEMAP_PAGES.map((link) => (
            <div key={link.title} className={styles.linkTextContainer}>
              <LinkText className={styles.linkText} title={link.title} href={link.href}>
                <span className={styles.sitemapSpan}>{link.title}</span>
              </LinkText>
            </div>
          ))}
        </AppearTitle>
      </div>

      <div style={{ gridColumn: isMobile ? '4 / 7' : '5 / 9' }} className={styles.sitemapColumn}>
        <AppearTitle isFooter>
          <h6 className={styles.title}>Brand Foundation</h6>
          {BRAND_FOUNDATION_TOOLS.map((tool) => (
            <div key={tool.id} className={styles.linkTextContainer}>
              <LinkText className={styles.linkText} title={tool.title} href={tool.href}>
                <span className={styles.sitemapSpan}>{tool.title}</span>
              </LinkText>
            </div>
          ))}
        </AppearTitle>
      </div>

      <div style={{ gridColumn: isMobile ? '1 / 4' : '9 / 13' }} className={styles.sitemapColumn}>
        <AppearTitle isFooter>
          <h6 className={styles.title}>Image &amp; SVG Tools</h6>
          {IMAGE_SVG_TOOLS.map((tool) => (
            <div key={tool.id} className={styles.linkTextContainer}>
              <LinkText className={styles.linkText} title={tool.title} href={tool.href}>
                <span className={styles.sitemapSpan}>{tool.title}</span>
              </LinkText>
            </div>
          ))}
        </AppearTitle>
      </div>

      <div style={{ gridColumn: isMobile ? '4 / 7' : '13 / 17' }} className={styles.sitemapColumn}>
        <AppearTitle isFooter>
          <h6 className={styles.title}>Nepali Tools</h6>
          {NEPALI_TOOLS.map((tool) => (
            <div key={tool.id} className={styles.linkTextContainer}>
              <LinkText className={styles.linkText} title={tool.title} href={tool.href}>
                <span className={styles.sitemapSpan}>{tool.title}</span>
              </LinkText>
            </div>
          ))}
        </AppearTitle>
      </div>

      {/* Middle Status & Time Row */}
      <div className={styles.middleContainer} style={{ gridColumn: isMobile ? '1 / 7' : '1 / 9' }}>
        <AppearTitle isFooter>
          <div className="p-x">Based in Nepal</div>
          <div className={clsx('p-x', styles.middleText)}>
            Current Time: <Time />
          </div>
        </AppearTitle>
      </div>

      <div className={styles.middleContainer} style={{ gridColumn: isMobile ? '1 / 7' : '9 / 13' }}>
        <AppearTitle isFooter>
          <div className="p-x">Status</div>
          <div className={clsx('p-x', styles.middleText)}>Exploring ideas and creating quietly</div>
        </AppearTitle>
      </div>
      <div className={styles.middleContainer} style={{ gridColumn: isMobile ? '1 / 7' : '13 / 17', textAlign: isMobile ? 'left' : 'right' }}>
        <AppearTitle isFooter>
          <div className="p-x">© 2026 · Rajan Bhatta</div>
          <div className={clsx('p-x', styles.middleText)}>All Rights Reserved</div>
        </AppearTitle>
      </div>

      <div className={styles.brandSection}>
        <span>RAJ</span>
      </div>
      <div className={styles.goToTop}>
        <GoTop />
      </div>
    </section>
  );
}

export default Footer;
