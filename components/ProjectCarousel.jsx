'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ProjectCarousel.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ProjectCarousel — pins the Projects stage while the user scrolls through
 * it and steps through each child as a stacked slide: the active card sits
 * centered at full size and sharpness, the next card waits directly behind
 * it (smaller, blurred, faded) and scales/sharpens into place as it takes
 * over.
 *
 * Unlike a plain reversible scrub, the outgoing card doesn't just retrace
 * its own entrance — it's ejected toward whichever side matches the
 * *current* scroll direction (GSAP ScrollTrigger's `self.direction`):
 *   - scrolling down (direction  1) → outgoing card exits LEFT
 *   - scrolling up   (direction -1) → outgoing card exits RIGHT
 * so scrolling back up steps backward through the stack from the other
 * side, rather than rewinding the same animation.
 *
 * Usage:
 *   <ProjectCarousel>
 *     <TiltCard className={styles.projCard}>...</TiltCard>
 *     <TiltCard className={styles.projCard}>...</TiltCard>
 *     <TiltCard className={styles.projCard}>...</TiltCard>
 *   </ProjectCarousel>
 */
export default function ProjectCarousel({ children }) {
  const stageRef = useRef(null);
  const slideRefs = useRef([]);
  const items = Array.isArray(children) ? children : [children];

  useEffect(() => {
    const stage = stageRef.current;
    const slides = slideRefs.current.filter(Boolean);
    const n = slides.length;
    if (!stage || n === 0) return;

    const steps = Math.max(n - 1, 1);

    // progress: 0..1 across the whole pin. dir: ScrollTrigger's
    // self.direction (1 = scrolling down, -1 = scrolling up) — only used
    // to decide which side the *currently transitioning* card exits toward.
    const apply = (progress, dir) => {
      const raw = gsap.utils.clamp(0, steps, progress * steps);
      const active = Math.min(Math.floor(raw), steps - 1);
      const t = raw - active;
      const exitX = dir < 0 ? 42 : -42;

      slides.forEach((slide, i) => {
        if (i === active) {
          // Outgoing — sharp & centered at t=0, ejected to the
          // direction-of-travel side, shrunk, faded and blurred at t=1.
          gsap.set(slide, {
            xPercent: gsap.utils.interpolate(0, exitX, t),
            scale: gsap.utils.interpolate(1, 0.84, t),
            opacity: gsap.utils.interpolate(1, 0, t),
            filter: `blur(${gsap.utils.interpolate(0, 10, t)}px)`,
            zIndex: 5,
            pointerEvents: t > 0.5 ? 'none' : 'auto',
          });
        } else if (i === active + 1) {
          // Incoming — waits centered behind (small, blurred, faded) and
          // scales/sharpens into the active spot as t moves to 1.
          gsap.set(slide, {
            xPercent: 0,
            scale: gsap.utils.interpolate(0.86, 1, t),
            opacity: gsap.utils.interpolate(0.3, 1, t),
            filter: `blur(${gsap.utils.interpolate(9, 0, t)}px)`,
            zIndex: 10,
            pointerEvents: t > 0.5 ? 'auto' : 'none',
          });
        } else {
          // Not yet reached / already long gone — resting out of sight.
          gsap.set(slide, {
            xPercent: 0,
            scale: 0.86,
            opacity: 0,
            filter: 'blur(9px)',
            zIndex: 1,
            pointerEvents: 'none',
          });
        }
      });
    };

    apply(0, 1);

    const trigger = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: () => `+=${steps * window.innerHeight * 1.15}`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => apply(self.progress, self.direction),
    });

    return () => {
      trigger.kill();
    };
  }, [items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={stageRef} className={styles.stage}>
      {items.map((child, i) => (
        <div
          key={i}
          ref={(el) => { slideRefs.current[i] = el; }}
          className={styles.slide}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
