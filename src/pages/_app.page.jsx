/* eslint-disable react/jsx-props-no-spreading */

import '@src/styles/global.scss';
import '@src/styles/global.css';

import * as THREE from 'three';

import { useEffect, useMemo, useRef } from 'react';

import { Analytics } from '@vercel/analytics/react';
import Background from '@src/components/canvas/background/Index';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import Fluid from '@src/components/canvas/fluid/Fluid';
import Layout from '@src/components/dom/Layout';
import Lenis from 'lenis';
import Loader from '@src/components/dom/Loader';
import Navbar from '@src/components/dom/navbar/Index';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Scrollbar from '@src/components/dom/Scrollbar';

import Tempus from '@darkroom.engineering/tempus';
import { View } from '@react-three/drei';
import { gsap } from 'gsap';
import styles from '@src/pages/app.module.scss';
import useFoucFix from '@src/hooks/useFoucFix';
import { useFrame } from '@darkroom.engineering/hamo';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import useScroll from '@src/hooks/useScroll';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

// Routes that show the animated intro loader (percentage counter).
// All other routes get instant content — no overlay, no delay.
const LOADER_ROUTES = ['/', '/about'];

if (typeof window !== 'undefined') {
  gsap.defaults({ ease: 'none' });
  gsap.registerPlugin(ScrollTrigger);

  gsap.ticker.lagSmoothing(0);
  gsap.ticker.remove(gsap.updateRoot);
  Tempus?.add((time) => {
    gsap.updateRoot(time / 1000);
  }, 0);

  window.scrollTo(0, 0);
  window.history.scrollRestoration = 'manual';
  ScrollTrigger.clearScrollMemory(window.history.scrollRestoration);
}

function MyApp({ Component, pageProps, router }) {
  const [
    lenis,
    setLenis,
    fluidColor,
    isAbout,
    setIntroOut,
    setIsLoading,
    setIsAbout,
    setSkipLoader,
    setSiteReady,
  ] = useStore(
    useShallow((state) => [
      state.lenis,
      state.setLenis,
      state.fluidColor,
      state.isAbout,
      state.setIntroOut,
      state.setIsLoading,
      state.setIsAbout,
      state.setSkipLoader,
      state.setSiteReady,
    ]),
  );

  const mainRef = useRef();
  const mainContainerRef = useRef();
  const layoutRef = useRef();

  // Whether the current route uses the intro loader
  const isLoaderRoute = LOADER_ROUTES.includes(router.pathname);
  // Whether the current route is a brand-tools page (disable canvas on these)
  const isBrandToolsRoute = router.pathname.startsWith('/brand-tools');

  useFoucFix();
  useScroll(() => ScrollTrigger.update());

  useIsomorphicLayoutEffect(() => {
    // eslint-disable-next-line no-shadow
    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: true,
      syncTouch: true,
      wrapper: mainRef.current || undefined,
      content: mainContainerRef.current || undefined,
    });

    setLenis(lenis);

    if (isLoaderRoute) {
      // Loader animation will call lenis.start() when complete
      lenis.stop();
    } else {
      // On tool/other routes: scroll starts immediately, no loader needed
      lenis.start();
    }

    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (lenis) {
      ScrollTrigger.refresh();
    }
  }, [lenis]);

  useFrame((time) => {
    if (lenis) {
      lenis.raf(time);
    }
  }, 0);

  // Sync loader and site-ready states on mount and on route changes
  useIsomorphicLayoutEffect(() => {
    setIsAbout(router.pathname === '/about');

    if (!isLoaderRoute) {
      setSkipLoader(true);
      setIntroOut(true);
      setIsLoading(false);
      setSiteReady(true);

      // Ensure main is fully visible — loader never ran so opacity is still 0
      const main = mainRef.current;
      if (main) {
        gsap.set(main, {
          opacity: 1,
          x: '0px',
          scale: 1,
          border: 'none',
          borderRadius: 0,
          pointerEvents: 'auto',
          height: 'auto',
        });
      }
      if (layoutRef.current) {
        gsap.set(layoutRef.current, { height: '100%', opacity: 1 });
      }
      gsap.set('header', { autoAlpha: 1 });
      if (lenis) {
        lenis.start();
      }
    } else {
      setSkipLoader(false);
    }
  }, [router.pathname, isLoaderRoute, lenis]);

  const scrollPositions = useRef(new Map());
  const isPopStateRef = useRef(false);

  // Track browser back/forward buttons (popstate events)
  useEffect(() => {
    const handlePopState = () => {
      isPopStateRef.current = true;
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save current scroll position before navigating away
  useEffect(() => {
    const handleRouteChangeStart = () => {
      if (!isPopStateRef.current) {
        const currentScroll = lenis ? lenis.scroll : (mainRef.current ? mainRef.current.scrollTop : window.scrollY);
        scrollPositions.current.set(router.asPath, currentScroll);
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router.asPath, router.events, lenis]);

  // Handle scroll position and focus restoration after route changes
  useEffect(() => {
    const handleRouteChangeComplete = (url) => {
      const isPop = isPopStateRef.current;
      isPopStateRef.current = false;

      const hash = window.location.hash || (url && url.includes('#') ? '#' + url.split('#')[1] : null);

      if (isPop) {
        // PopState (Back / Forward): restore previously saved scroll position
        const savedPos = scrollPositions.current.get(url) ?? 0;
        requestAnimationFrame(() => {
          if (lenis) {
            lenis.resize();
            lenis.scrollTo(savedPos, { immediate: true });
          }
          if (mainRef.current) {
            mainRef.current.scrollTop = savedPos;
          }
          ScrollTrigger.refresh();
        });
      } else if (hash) {
        // Hash navigation: scroll to target element with fixed header offset
        requestAnimationFrame(() => {
          const target = document.querySelector(hash);
          if (target) {
            const header = document.querySelector('header');
            const offset = (header ? header.getBoundingClientRect().height : 60) + 24;
            if (lenis) {
              lenis.resize();
              lenis.scrollTo(target, { offset: -offset, immediate: true });
            } else if (mainRef.current) {
              const targetTop = target.getBoundingClientRect().top + mainRef.current.scrollTop - offset;
              mainRef.current.scrollTop = targetTop;
            }
          }
          ScrollTrigger.refresh();
        });
      } else {
        // Standard client-side navigation: reset scroll immediately to top!
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        }
        if (mainRef.current) {
          mainRef.current.scrollTop = 0;
        }
        window.scrollTo(0, 0);

        requestAnimationFrame(() => {
          if (lenis) {
            lenis.resize();
            lenis.scrollTo(0, { immediate: true });
          }
          if (mainRef.current) {
            mainRef.current.scrollTop = 0;
          }
          window.scrollTo(0, 0);
          ScrollTrigger.refresh();

          // Move focus to page's <h1> (tabindex=-1) for accessibility without scrolling away
          const h1 = document.querySelector('h1');
          if (h1) {
            if (!h1.hasAttribute('tabindex')) {
              h1.setAttribute('tabindex', '-1');
            }
            h1.focus({ preventScroll: true });
          }
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events, lenis]);

  // Handle in-page hash links (e.g. clicking /page#faq from within the same page)
  useEffect(() => {
    const handleHashChangeComplete = (url) => {
      const hash = window.location.hash || (url && url.includes('#') ? '#' + url.split('#')[1] : null);
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          const header = document.querySelector('header');
          const offset = (header ? header.getBoundingClientRect().height : 60) + 24;
          const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (lenis) {
            lenis.scrollTo(target, {
              offset: -offset,
              immediate: isReduced,
              duration: isReduced ? 0 : 1,
            });
          } else {
            target.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth' });
          }
        }
      }
    };

    router.events.on('hashChangeComplete', handleHashChangeComplete);
    return () => {
      router.events.off('hashChangeComplete', handleHashChangeComplete);
    };
  }, [router.events, lenis]);

  // Refresh ScrollTrigger after route changes so all trigger bounds recalculate
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => clearTimeout(timer);
  }, [router.asPath]);

  const domElements = useMemo(
    () => (
      <>
        {/* Loader only on designated routes */}
        {isLoaderRoute && <Loader />}
        {/* Fullscreen animated background shader for atmospheric margins and footer across all routes */}
        <div className={styles.background}>
          <Background />
        </div>
        <Scrollbar />
        <Navbar />
        <Analytics />
      </>
    ),
    [isLoaderRoute],
  );

  const canvasElements = useMemo(
    () =>
      !isBrandToolsRoute ? (
        <Canvas
          gl={{
            pixelRatio: 0.5,
            outputColorSpace: isAbout === false ? THREE.LinearSRGBColorSpace : THREE.SRGBColorSpace,
          }}
          style={{ zIndex: 0 }}
          resize={{ debounce: { resize: 0, scroll: 0 }, polyfill: undefined }}
          className={styles.canvasContainer}
          dpr={[0.5, 1.5]}
        >
          <View.Port />
        </Canvas>
      ) : null,
    [isAbout, isBrandToolsRoute],
  );

  return (
    <div className={styles.root}>
      {domElements}
      <div ref={layoutRef} id="layout" className={styles.layout}>
        {canvasElements}
        {/* Fluid canvas — portfolio pages only */}
        {!isBrandToolsRoute && (
          <Canvas
            id="fluidCanvas"
            flat
            gl={{
              antialias: false,
              stencil: false,
              depth: false,
              pixelRatio: 0.1,
            }}
            style={{ mixBlendMode: 'difference', background: 'black' }}
            linear
            className={styles.canvasContainer}
            eventSource={mainRef.current}
            dpr={[0.1, 0.5]}
          >
            <EffectComposer>
              <Fluid fluidColor={fluidColor} mainRef={mainRef} />
            </EffectComposer>
          </Canvas>
        )}
        <main ref={mainRef} className={styles.main} style={!isLoaderRoute ? { opacity: 1 } : undefined}>
          <div ref={mainContainerRef} id="mainContainer" className={styles.mainContainer}>
            <Layout layoutRef={layoutRef} mainRef={mainRef} router={router}>
              <Component {...pageProps} />
            </Layout>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MyApp;
