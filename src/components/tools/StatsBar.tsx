import React from 'react';
import styles from './ResultComponents.module.scss';

export interface StatItem {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export interface StatsBarProps {
  stats: StatItem[];
  className?: string;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats, className = '' }) => {
  return (
    <div className={`${styles.statsBar} ${className}`}>
      {stats.map((stat, idx) => (
        <div key={idx} className={styles.statItem}>
          <span className={styles.statLabel}>{stat.label}</span>
          <span className={`${styles.statValue} ${stat.highlight ? styles.statHighlight : ''}`}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
