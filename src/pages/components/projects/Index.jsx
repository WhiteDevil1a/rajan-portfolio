/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
import AppearByWords from '@src/components/animationComponents/appearByWords/Index';
import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { gsap } from 'gsap';
import projects from '@src/constants/projects';
import styles from '@src/pages/components/projects/styles/projects.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import { useWindowSize } from '@darkroom.engineering/hamo';

function Projects() {
  const isMobile = useIsMobile();
  const windowSize = useWindowSize();
  const [isLoading] = useStore(useShallow((state) => [state.isLoading]));

  const rootRef = useRef();
  const projectRefs = useRef([]);

  const newProjects = [
    { ...projects[0], title: 'Art & Illustration', id: 'custom-1' },
    { ...projects[3], title: 'Graphic Design', id: 'custom-2' },
    { ...projects[1], title: 'Content Creation', id: 'custom-3' },
    { ...projects[2], title: 'Web Development', id: 'custom-4' },
  ];

  const setupProjectAnimations = () => {
    const ctx = gsap.context(() => {
      if (!isLoading) {
        projectRefs.current.slice(0, -1).forEach((projectRef, index) => {
          gsap.set(projectRef, { yPercent: 0 });
          gsap
            .timeline({
              scrollTrigger: {
                id: `projectRef-${index}`,
                trigger: rootRef.current,
                start: `top+=${windowSize.height * index}`,
                end: () => `+=${(projectRefs.current.length - 1) * windowSize.height}`,
                scrub: true,
                scroller: document?.querySelector('main'),
                invalidateOnRefresh: true,
              },
            })
            .to(projectRef, {
              yPercent: 100,
              stagger: 1,
            });
        });
      }
    });

    return ctx;
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = setupProjectAnimations();
    return () => ctx.kill();
  }, [isLoading, windowSize.height]);

  return (
    <>
      <section className={clsx(styles.titleContainer, 'layout-grid-inner')}>
        <h1 className={clsx(styles.title, 'h1')}>
          <AppearByWords>Creative Expertise</AppearByWords>
        </h1>
      </section>
      <section ref={rootRef} className={clsx(styles.root, 'layout-block-inner')}>
        <div className={styles.innerContainer}>
          {newProjects.map((project, index) => (
            <div id={project.id} key={project.id} className={clsx(styles.card)}>
              <div
                style={
                  !isMobile
                    ? {
                        height: index === newProjects.length - 1 ? '200svh' : `${200 + 100 * index}svh`,
                        top: index === 0 ? '0px' : '-100svh',
                      }
                    : {
                        height: index === newProjects.length - 1 ? '100svh' : `${200 + 100 * index}svh`,
                        top: index === 0 ? '0px' : '-50svh',
                      }
                }
                className={styles.projectsWrap}
              >
                <div className={clsx(styles.container, 'layout-grid-inner')}>
                  <div className={styles.projectsDetails}>
                    <h3 className="h3">{project.title}</h3>
                  </div>
                  <div className={styles.imageContainer}>
                    <Image src={project.img} fill sizes="100%" alt={project.title} />
                  </div>
                </div>
              </div>
              <div ref={(el) => (projectRefs.current[index] = el)} className={styles.canvas}>
                <Image priority className={index === 0 ? styles.firstCard : index === newProjects.length - 1 ? styles.lastCard : undefined} src={project.img} fill sizes="100%" alt={project.title} />
              </div>
              </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          {/* <ButtonLink href="/projects" label="ALL PROJECTS" /> */}
        </div>
      </section>
    </>
  );
}

export default Projects;
