import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Transition as ReactTransition, SwitchTransition } from 'react-transition-group';

import Footer from '@src/components/dom/Footer';
import PreFooter from '@src/components/dom/PreFooter';
import gsap from 'gsap';
import styles from '@src/components/dom/styles/layout.module.scss';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function Layout({ children, layoutRef, mainRef, router }) {
  const [lenis, introOut, setIsLoading, isMenuOpen, setIsMenuOpen, setIsAbout, skipLoader, setSiteReady] = useStore(
    useShallow((state) => [
      state.lenis,
      state.introOut,
      state.setIsLoading,
      state.isMenuOpen,
      state.setIsMenuOpen,
      state.setIsAbout,
      state.skipLoader,
      state.setSiteReady,
    ]),
  );

  const enterTimelineRef = useRef();
  const exitTimelineRef = useRef();

  const [isEntering, setIsEntering] = useState(false);

  const menuTime = useMemo(() => (isMenuOpen ? 0.8 : 0), [isMenuOpen]);

  const handleEnter = useCallback(
    () => {
      if (introOut) {
        if (exitTimelineRef.current) exitTimelineRef.current.pause();

        // On routes without a loader, just reveal content immediately
        if (skipLoader) {
          setIsAbout(router.asPath === '/about');
          setIsLoading(false);
          setSiteReady(true);
          if (lenis) {
            lenis.start();
            lenis.resize();
          }
          if (mainRef.current) {
            gsap.set(mainRef.current, {
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
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            setIsAbout(router.asPath === '/about');
            setIsLoading(false);
            setSiteReady(true);
            lenis.start();
          },
        });

        enterTimelineRef.current = tl;
        setIsEntering(true);

        tl.set(
          layoutRef.current,
          {
            ease: 'power2.inOut',
            height: '90%',
            opacity: 1,
            onComplete: () => {
              setIsAbout(router.asPath === '/about');
              setIsEntering(false);
            },
          },
          2.5,
        )
          .to(
            '#loader',
            {
              x: '-100%',
              ease: 'power2.inOut',
            },
            2.5,
          )
          .to(
            mainRef.current,
            {
              ease: 'power2.inOut',
              x: '0px',
            },
            2.5,
          )
          .to(
            mainRef.current,
            {
              ease: 'power2.inOut',
              borderRadius: 0,
              scale: 1,
            },
            3,
          )
          .to(
            layoutRef.current,
            {
              ease: 'power2.inOut',
              height: '100%',
              opacity: 1,
            },
            3,
          )
          .to(
            'header',
            {
              ease: 'power2.inOut',
              autoAlpha: 1,
            },
            3.3,
          )
          .to(
            mainRef.current,
            {
              ease: 'power2.inOut',
              height: 'auto',
              border: 'none',
              pointerEvents: 'auto',
            },
            3.3,
          );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [introOut, skipLoader],
  );

  const handleExit = useCallback(
    () => {
      if (introOut) {
        if (enterTimelineRef.current) enterTimelineRef.current.pause();

        if (isMenuOpen) {
          setIsMenuOpen(false);
        }

        // On routes without a loader, skip the full GSAP slide choreography
        if (skipLoader) {
          setIsLoading(true);
          if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
          if (mainRef.current) mainRef.current.scrollTop = 0;
          return;
        }

        if (lenis) lenis.stop();

        if (isEntering === false) {
          const tl = gsap.timeline({
            onComplete: () => {
              setIsLoading(true);
              lenis.scrollTo(0, { force: true });
            },
          });

          exitTimelineRef.current = tl;

          if (document?.getElementById('scrollbar')) {
            tl.to(
              document.getElementById('scrollbar'),
              {
                ease: 'power2.inOut',
                autoAlpha: 0,
                duration: 0.5,
              },
              menuTime,
            );
          }

          tl.to(
            'header',
            {
              ease: 'power2.inOut',
              autoAlpha: 0,
              duration: 0.5,
              onComplete: () => {
                gsap.set('#loader', {
                  scale: 0.9,
                  x: '100%',
                  borderRadius: '1.3888888889vw',
                });
                gsap.set('header', {
                  left: 0,
                  top: 0,
                  scale: 1,
                  duration: 0,
                });
              },
              overwrite: true,
            },
            menuTime,
          )
            .to(
              layoutRef.current,
              {
                ease: 'power2.inOut',
                height: '90svh',
                opacity: 1,
                duration: 0.5,
              },
              menuTime,
            )
            .to(
              mainRef.current,
              {
                ease: 'power2.inOut',
                scale: 0.9,
                opacity: 1,
                border: '2px solid #f0f4f1',
                borderRadius: '1.3888888889vw',
                duration: 0.5,
              },
              menuTime,
            )
            .to(
              mainRef.current,
              {
                ease: 'power2.inOut',
                x: '-100%',
                duration: 0.5,
              },
              0.5 + menuTime,
            )
            .to(
              '#loader',
              {
                ease: 'power2.inOut',
                x: '0px',
                duration: 0.5,
              },
              0.5 + menuTime,
            )
            .set(mainRef.current, {
              x: '100%',
            });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [introOut, menuTime, isEntering, skipLoader],
  );

  return (
    <>
      <SwitchTransition>
        <ReactTransition
          key={router.asPath}
          in={false}
          unmountOnExit
          timeout={{
            enter: skipLoader ? 0 : introOut ? 4500 : 0,
            exit: skipLoader ? 0 : introOut ? 2550 : 0,
          }}
          onEnter={handleEnter}
          onExit={handleExit}
        >
          {children}
        </ReactTransition>
      </SwitchTransition>

      <PreFooter />
      <footer className={styles.footer}>
        <Footer />
      </footer>
    </>
  );
}

export default Layout;
