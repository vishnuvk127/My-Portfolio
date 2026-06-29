'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PhotoFrame.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * PhotoFrame — a small frame/badge that holds the profile image, hung
 * from an off-centre ring so it rests with a slight clockwise list to
 * the right, like a tag that's hanging a little askew. Swap
 * /public/images/profile.jpg for a 3D render any time — same filename,
 * no code changes needed.
 *
 * Scroll behaviour (GSAP ScrollTrigger, toggleActions "play reverse
 * play reverse" — all four directions wired, not a one-shot reveal):
 *  - onEnter      (scrolling down, frame enters view)        → swings in from the left
 *  - onLeave      (scrolling down further, frame exits view) → retreats back out left
 *  - onEnterBack  (scrolling back up, frame re-enters view)  → swings in again
 *  - onLeaveBack  (scrolling up past the section)             → retreats out left again
 */
export default function PhotoFrame({ src = '/images/profile.jpg', alt = 'Profile portrait' }) {
  const frameRef = useRef(null);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    // Pivot near the hanging ring, off-centre to the left — this is what
    // makes the resting tilt read as "hung from that point" rather than
    // an arbitrary rotation.
    gsap.set(el, { x: -170, opacity: 0, rotate: -16, transformOrigin: '30% -8px' });

    const tween = gsap.to(el, {
      x: 0,
      opacity: 1,
      rotate: 6,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play reverse play reverse',
      },
    });

    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={frameRef} className={styles.frameWrap}>
      <span className={styles.frameHook} aria-hidden="true" />
      <div className={styles.frame}>
        <div className={styles.frameGlow} aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={styles.frameImg} />
      </div>
    </div>
  );
}
