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
      className={`fixed inset-0 z-[2000] h-screen w-full cursor-pointer overflow-hidden outline-none ${styles.splash} ${exiting ? styles.exiting : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Enter site"
      onClick={dismiss}
    >
      <div className={`absolute top-0 right-0 bottom-0 w-[56%] overflow-hidden ${styles.photoWrap}`} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/profile.jpg" alt="" className={`h-full w-full object-cover ${styles.photo}`} />
        <div className={`absolute inset-0 pointer-events-none ${styles.photoFade}`} />
      </div>

      <div className={`absolute left-[6vw] bottom-[14vh] z-[2] max-w-[46%] ${styles.textBlock}`}>
        <p className={`mb-2 text-[clamp(16px,2vw,22px)] font-normal tracking-[0.01em] ${styles.greeting}`}>
          Hi, I&apos;m <span className={`font-bold ${styles.greetingName}`}>Kaitepalli Vishnu Vardhan</span>,
        </p>
        <h1 className={`block text-[clamp(34px,4.6vw,60px)] font-extrabold tracking-[-0.02em] ${styles.role}`}>Data Analyst</h1>
      </div>

      <div className={`absolute left-1/2 bottom-9 z-[2] flex flex-col items-center gap-1.5 ${styles.enterCue}`} aria-hidden="true">
        <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em]">Click or scroll to enter</span>
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
