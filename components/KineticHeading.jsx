'use client';

import { useEffect, useRef } from 'react';
import { gsap } from './gsapScroll';

/**
 * KineticHeading — large heading whose scale / opacity / letter-spacing
 * scrubs with scroll position as it crosses the viewport. Renders exactly
 * one element (default <h3>) carrying the passed className, so existing
 * page.module.css typography rules apply unchanged — this only layers a
 * scroll-driven transform on top, same pattern as TimelineFX/Reveal.
 *
 * Usage:
 *   <KineticHeading>{role}</KineticHeading>
 *   <KineticHeading as="h2" className={styles.secTitle}>Heading</KineticHeading>
 */
export default function KineticHeading({ children, as: Tag = 'h3', className = '', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { transformOrigin: '0% 50%' });

    const tween = gsap.fromTo(
      el,
      { scale: 0.86, opacity: 0.35 },
      {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          end: 'top 45%',
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
