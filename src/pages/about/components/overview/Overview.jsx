import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import clsx from 'clsx';
import styles from '@src/pages/about/components/overview/styles/overview.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';

function Overview() {
  const isMobile = useIsMobile();

  return (
    <section className={clsx(styles.root, 'layout-grid-inner')}>
      <div className={styles.title}>
        {isMobile ? (
          <AppearTitle key="mobile-queto">
            <h3 className="h3">
              A brand designer&apos;s path is like a journey, <span className="medium">turning</span> simple ideas into <span className="medium">meaningful</span> and <span className="medium">impactful</span> visual identities.
            </h3>
          </AppearTitle>
        ) : (
          <AppearTitle key="desktop-queto">
            <h3 className="h3">
              A brand designer&apos;s path is like a journey, <span className="medium">turning</span> simple ideas into <span className="medium">meaningful</span> and <span className="medium">impactful</span> visual identities.
            </h3>
          </AppearTitle>
        )}
      </div>
      <div className={clsx(styles.text, 'p-l', styles.myStory)}>
        <AppearTitle>
          <span>My Story</span>
        </AppearTitle>
      </div>
      <div className={styles.desc}>
        {!isMobile ? (
          <AppearTitle key="desktop-overview">
            <h6 className="h6">I&apos;m Rajan Bhatta—a brand designer and visual identity specialist originally from Nepal. Over the years, I&apos;ve had the chance to dive into brand design, color strategy, and creative industries.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>I love learning how brands communicate and turning those insights into real visual identities. One of my goals is to keep exploring new ideas while crafting brand systems that actually matter.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Beyond brand work, I build ventures across tech and marketing, and I enjoy tapping into my creative side through sketching, design, and video making.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>This space is simply a reflection of the journey so far.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Rajan Bhatta.</h6>
          </AppearTitle>
        ) : (
          <AppearTitle key="mobile-overview">
            <h6 className="h6">I&apos;m Rajan Bhatta—a brand designer and visual identity specialist originally from Nepal. Over the years, I&apos;ve had the chance to dive into brand design, color strategy, and creative industries.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>I love learning how brands communicate and turning those insights into real visual identities. One of my goals is to keep exploring new ideas while crafting brand systems that actually matter.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Beyond brand work, I build ventures across tech and marketing, and I enjoy tapping into my creative side through sketching, design, and video making.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>This space is simply a reflection of the journey so far.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Rajan Bhatta.</h6>
          </AppearTitle>
        )}
      </div>
    </section>
  );
}
export default Overview;
