'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ProjectCarousel.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ProjectCarousel — pins the Projects stage while the user scrolls through it
 * and steps through each child as a stacked slide. Only ever two cards are
 * visible: the one in front (centered, full size, sharp) and the one taking
 * over (off to a side, smaller, blurred, fading in). Every other card is
 * fully hidden until its turn comes.
 *
 * The motion is a single, fully reversible function of scroll progress, laid
 * out so each card has a fixed "home side":
 *   - the lower card of an active pair lives on / exits to the LEFT
 *   - the upper card of an active pair lives on / enters from the RIGHT
 *
 * Because the card sitting in front is the *lower* card while scrolling down
 * and the *upper* card while scrolling up, this reads as a mirror:
 *   - scrolling DOWN → front card slides off LEFT, next card eases in from
 *     behind/right and sharpens into place
 *   - scrolling UP   → front card slides off RIGHT, previous card eases in
 *     from the left and sharpens into place
 * Scrubbing back and forth retraces cleanly with no jump on direction change.
 *
 * A "dwell" hold at the start/end of every step keeps each card centered and
 * fully readable for a stretch of scroll before the next transition begins.
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

    // ── tuning ────────────────────────────────────────────────────────────
    const EXIT = 46;       // how far (%) a card sits off to its home side
    const MIN_SCALE = 0.82; // size of a card when parked in the background
    const MAX_BLUR = 12;    // blur (px) of a card when parked in the background
    const HOLD = 0.22;      // fraction of each step a card rests, fully readable

    // Smootherstep — soft acceleration in and out of every transition.
    const ease = (x) => {
      x = gsap.utils.clamp(0, 1, x);
      return x * x * x * (x * (x * 6 - 15) + 10);
    };

    // Remap the raw step fraction so the card holds still (readable) for the
    // first and last HOLD of the step, then transitions through the middle.
    const dwell = (t) => ease((t - HOLD) / (1 - 2 * HOLD));

    const apply = (progress) => {
      const raw = gsap.utils.clamp(0, steps, progress * steps);
      const seg = Math.min(Math.floor(raw), steps - 1); // lower card index
      const t = dwell(raw - seg);                        // 0 → lower front, 1 → upper front

      slides.forEach((slide, i) => {
        if (i === seg) {
          // Lower card of the pair — home side is LEFT.
          // t=0: centered, sharp, in front. t=1: slid off left, shrunk, gone.
          gsap.set(slide, {
            xPercent: gsap.utils.interpolate(0, -EXIT, t),
            scale: gsap.utils.interpolate(1, MIN_SCALE, t),
            opacity: gsap.utils.interpolate(1, 0, t),
            filter: `blur(${gsap.utils.interpolate(0, MAX_BLUR, t)}px)`,
            zIndex: 6,
            visibility: 'visible',
            pointerEvents: t < 0.5 ? 'auto' : 'none',
          });
        } else if (i === seg + 1) {
          // Upper card of the pair — home side is RIGHT.
          // t=0: off right, shrunk, hidden. t=1: centered, sharp, in front.
          gsap.set(slide, {
            xPercent: gsap.utils.interpolate(EXIT, 0, t),
            scale: gsap.utils.interpolate(MIN_SCALE, 1, t),
            opacity: gsap.utils.interpolate(0, 1, t),
            filter: `blur(${gsap.utils.interpolate(MAX_BLUR, 0, t)}px)`,
            zIndex: 8,
            visibility: 'visible',
            pointerEvents: t > 0.5 ? 'auto' : 'none',
          });
        } else {
          // Everyone else — parked fully out of sight on their home side until
          // their turn arrives (left if already passed, right if still ahead).
          gsap.set(slide, {
            xPercent: i < seg ? -EXIT : EXIT,
            scale: MIN_SCALE,
            opacity: 0,
            filter: `blur(${MAX_BLUR}px)`,
            zIndex: 1,
            visibility: 'hidden',
            pointerEvents: 'none',
          });
        }
      });
    };

    apply(0);

    const trigger = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      // Longer runway per step → slower, more deliberate pacing.
      end: () => `+=${steps * window.innerHeight * 1.35}`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.8, // a little smoothing lag so motion trails the scroll gently
      invalidateOnRefresh: true,
      // Gently settle onto whole cards so each one pauses for reading.
      snap: {
        snapTo: (value) => Math.round(value * steps) / steps,
        duration: { min: 0.2, max: 0.5 },
        delay: 0.06,
        ease: 'power1.inOut',
      },
      onUpdate: (self) => apply(self.progress),
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
