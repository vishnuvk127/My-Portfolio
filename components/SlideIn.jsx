'use client';

import { useEffect, useRef } from 'react';
import { gsap } from './gsapScroll';

/**
 * SlideIn — bidirectional scroll-triggered slide entrance.
 *
 * Slides the wrapped element in from the left or right as it enters the
 * viewport, and slides it back out the same way it came whenever the
 * user scrolls past it — in either direction (GSAP ScrollTrigger,
 * toggleActions "play reverse play reverse" — all four directions
 * wired, not a one-shot reveal):
 *  - onEnter      (scrolling down, enters view)        → slides in
 *  - onLeave      (scrolling down further, exits view) → slides back out
 *  - onEnterBack  (scrolling back up, re-enters view)  → slides in again
 *  - onLeaveBack  (scrolling up past it)                 → slides back out again
 *
 * Usage:
 *   <SlideIn direction="left" className={styles.tlItem}>...</SlideIn>
 *   <SlideIn direction="right" distance={200}>...</SlideIn>
 */
export default function SlideIn({
  children,
  className = '',
  direction = 'left',
  distance = 160,
  duration = 0.9,
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const startX = direction === 'right' ? distance : -distance;
    gsap.set(el, { x: startX, opacity: 0 });

    const tween = gsap.to(el, {
      x: 0,
      opacity: 1,
      duration,
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
  }, [direction, distance, duration]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
