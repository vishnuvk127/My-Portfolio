'use client';

import { useRef } from 'react';
import styles from './PageFX.module.css';

/**
 * TiltCard — wraps card content with a cursor-tracked 3D tilt and a
 * radial glow that follows the mouse. Pass the card's *original*
 * page.module.css className through; TiltCard renders exactly one root
 * element carrying that className, so existing background/border/padding
 * styling is untouched.
 *
 * Usage:
 *   <TiltCard className={styles.skillCard}>...</TiltCard>
 */
export default function TiltCard({ children, className = '', max = 9, glow = true, ...rest }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - py) * max;
    const rotateY = (px - 0.5) * max;

    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    el.style.setProperty('--glow-x', `${px * 100}%`);
    el.style.setProperty('--glow-y', `${py * 100}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div
      ref={ref}
      className={`${className} ${styles.tiltCard}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {glow && <span className={styles.tiltGlow} aria-hidden="true" />}
      {children}
    </div>
  );
}
