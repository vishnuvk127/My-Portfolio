'use client';

import { useCallback } from 'react';
import styles from './CoverSplash.module.css';

/**
 * CoverSplash — the very first thing a visitor sees.
 *
 * A light-orange entry screen with a full-bleed portrait photo and a
 * short "Hi, I'm ___ / Role" line. Clicking anywhere on the screen (the
 * photo included) smooth-scrolls past it into the rest of the site —
 * it's a normal in-flow section, not a fixed overlay, so a plain mouse
 * wheel / trackpad scroll or a Tab+Enter keypress moves past it too.
 *
 * The photo at /public/images/profile.jpg is a placeholder — swap that
 * file for the real photo (same filename) and it updates automatically,
 * no code changes needed.
 */
export default function CoverSplash({ nextId = 'home' }) {
  const enter = useCallback(() => {
    document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth' });
  }, [nextId]);

  return (
    <section
      className={styles.splash}
      role="button"
      tabIndex={0}
      aria-label="Enter site"
      onClick={enter}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && enter()}
    >
      <div className={styles.photoWrap} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/profile.jpg" alt="" className={styles.photo} />
        <div className={styles.photoFade} />
      </div>

      <div className={styles.textBlock}>
        <p className={styles.greeting}>
          Hi, I&apos;m <span className={styles.greetingName}>Kaitepalli Vishnu Vardhan</span>,
        </p>
        <h1 className={styles.role}>Data Analyst</h1>
      </div>

      <div className={styles.enterCue} aria-hidden="true">
        <span>Click or scroll to enter</span>
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
