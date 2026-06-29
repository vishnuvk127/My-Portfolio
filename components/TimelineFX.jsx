'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PageFX.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * TimelineFX — decorates the existing, static Experience timeline with:
 *  1. A scroll-scrubbed progress line overlaid on the dim static guide line.
 *  2. A pulse-in animation on each timeline dot as it enters the viewport.
 *
 * Renders no visible markup of its own (besides the injected overlay line),
 * so page.module.css never needs to change. It locates its parent
 * `.timeline` container via its own anchor ref — place it as the LAST
 * child inside that container, e.g.:
 *
 *   <div className={styles.timeline}>
 *     {experience.map(...)}
 *     <TimelineFX dotClass={styles.tlDot} />
 *   </div>
 */
export default function TimelineFX({ dotClass }) {
  const anchorRef = useRef(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    const container = anchor?.parentElement;
    if (!container) return;

    if (!container.style.position) container.style.position = 'relative';

    const line = document.createElement('div');
    line.className = styles.timelineProgress;
    container.appendChild(line);

    const lineTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 75%',
      end: 'bottom 70%',
      scrub: true,
      onUpdate: (self) => {
        line.style.transform = `scaleY(${self.progress})`;
      },
    });

    const dots = dotClass ? Array.from(container.getElementsByClassName(dotClass)) : [];
    const dotAnims = dots.map((dot) =>
      gsap.fromTo(
        dot,
        { scale: 0.3, opacity: 0.4 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: dot,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    );

    return () => {
      lineTrigger.kill();
      dotAnims.forEach((a) => a.scrollTrigger && a.scrollTrigger.kill());
      line.remove();
    };
  }, [dotClass]);

  return <span ref={anchorRef} className={styles.fxAnchor} aria-hidden="true" />;
}
