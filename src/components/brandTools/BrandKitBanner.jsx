import React from 'react';
import Link from 'next/link';
import useBrandKit from '@src/hooks/useBrandKit';
import styles from '@src/styles/brandTools.module.scss';

function BrandKitBanner({ toolName = 'this tool' }) {
  const { brandKit, isCustom } = useBrandKit();

  if (isCustom) {
    return (
      <div className={styles.brandKitBanner}>
        <div className={styles.bannerLeft}>
          <span className={styles.check}>✓</span>
          <span>
            Using your saved Brand Kit for <strong>{brandKit.brandName || 'your brand'}</strong> (Logo, Colors &amp; Fonts connected)
          </span>
        </div>
        <Link href="/brand-tools/brand-kit" className={styles.bannerLink}>
          Edit Brand Kit →
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.brandKitBanner}>
      <div className={styles.bannerLeft}>
        <span>💡</span>
        <span>
          Auto-fill {toolName} with your official logo, colors and typography in seconds.
        </span>
      </div>
      <Link href="/brand-tools/brand-kit" className={styles.bannerLink}>
        Set up your Brand Kit →
      </Link>
    </div>
  );
}

export default BrandKitBanner;
