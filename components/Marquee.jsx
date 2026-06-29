'use client';

import styles from './PageFX.module.css';

/**
 * Marquee — seamless infinite horizontal scroll ticker.
 * Pass an array of strings; the list is duplicated once so the
 * CSS animation (translateX 0 → -50%) loops with no visible seam.
 */
export default function Marquee({ items = [], speed = 28, reverse = false, className = '' }) {
  if (!items.length) return null;

  return (
    <div className={`${styles.marquee} ${className}`}>
      <div
        className={styles.marqueeTrack}
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className={styles.marqueeItem}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
