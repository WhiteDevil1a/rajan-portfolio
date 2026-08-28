import React from 'react';
import Link from 'next/link';
import { BRAND_TOOLS } from '@src/constants/brandToolsList';
import styles from '@src/styles/brandTools.module.scss';

function RelatedTools({ currentToolId, toolIds }) {
  const selected = (toolIds && toolIds.length > 0)
    ? BRAND_TOOLS.filter((t) => toolIds.includes(t.id))
    : BRAND_TOOLS.filter((t) => t.id !== currentToolId).slice(0, 3);

  if (selected.length === 0) return null;

  return (
    <div className={styles.educationalSection}>
      <h3 className={styles.sectionHeading}>Related Brand Tools</h3>
      <div className={styles.toolGrid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {selected.map((tool) => (
          <Link key={tool.id} href={tool.href} className={styles.toolCard}>
            <div>
              <div className={styles.toolCardTop}>
                <span className={styles.toolNumber}>{tool.number}</span>
                <span className={styles.toolCategoryBadge}>{tool.category}</span>
              </div>
              <h4 className={styles.toolCardTitle}>{tool.title}</h4>
              <p className={styles.toolCardDesc}>{tool.tagline}</p>
            </div>
            <div className={styles.toolCardFooter}>
              <span>Open Tool</span>
              <span className={styles.toolCardArrow}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RelatedTools;
