'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PageFX.module.css';

/**
 * Reveal — generic scroll-triggered fade/slide-up wrapper.
 *
 * Drop-in replacement for a single block element: pass the *original*
 * page.module.css className through `className` and Reveal renders exactly
 * one element (default <div>), so no extra DOM nesting or grid/flex layout
 * shifts are introduced. Animates in once via IntersectionObserver.
 *
 * Usage:
 *   <Reveal className={styles.statCard} delay={i * 0.08}>...</Reveal>
 *   <Reveal as="p">Some paragraph</Reveal>
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 28,
  as: Tag = 'div',
  once = true,
  ...rest
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`${className} ${styles.reveal} ${inView ? styles.revealIn : ''}`}
      style={{ transitionDelay: `${delay}s`, '--reveal-y': `${y}px` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
