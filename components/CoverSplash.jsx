'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './CoverSplash.module.css';

/**
 * CoverSplash — a fixed, full-screen entry overlay shown on top of the
 * whole site. It locks page scroll while visible. The very first
 * click anywhere, scroll/swipe attempt, or keypress dismisses it: it
 * plays a quick fade/slide-up exit, then unmounts itself completely
 * and unlocks scrolling, revealing the real site (already sitting at
 * the top, behind it) underneath.
 *
 * The photo at /public/images/profile.jpg is a placeholder — swap that
 * file for the real photo (same filename) and it updates automatically,
 * no code changes needed.
 */
export default function CoverSplash() {
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const triggeredRef = useRef(false);

  const dismiss = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    setExiting(true);
    setTimeout(() => setHidden(true), 520);
  }, []);

  // Lock page scroll while the splash is up; release it once dismissed.
  // Any wheel, touch-scroll, or keypress also counts as "dismiss".
  useEffect(() => {
    if (hidden) return;

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';

    window.addEventListener('wheel', dismiss, { passive: true });
    window.addEventListener('touchmove', dismiss, { passive: true });
    window.addEventListener('keydown', dismiss);

    return () => {
      html.style.overflow = prevOverflow;
      window.removeEventListener('wheel', dismiss);
      window.removeEventListener('touchmove', dismiss);
      window.removeEventListener('keydown', dismiss);
    };
  }, [hidden, dismiss]);

  if (hidden) return null;

  return (
    <section
      className={`${styles.splash} ${exiting ? styles.exiting : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Enter site"
      onClick={dismiss}
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
