'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PhotoFrame.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PhotoFrame({ src = '/images/profile.jpg', alt = 'Profile portrait' }) {
  const wrapRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    gsap.set(el, {
      y: -70,
      opacity: 0,
      rotate: 0,
    });

    const tween = gsap.to(el, {
      y: 0,
      opacity: 1,
      rotate: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        end: 'bottom 20%',
        toggleActions: 'play reverse play reverse',
      },
    });

    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  const handleMouseMove = (e) => {
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = centerX - e.clientX;
    const distanceY = centerY - e.clientY;

    const distance = Math.max(
      Math.sqrt(distanceX * distanceX + distanceY * distanceY),
      1
    );

    const strength = Math.max(0, 1 - distance / 240);

    const moveX = (distanceX / distance) * strength * 28;
    const moveY = (distanceY / distance) * strength * 22;

    frame.style.setProperty('--move-x', `${moveX}px`);
    frame.style.setProperty('--move-y', `${moveY}px`);
  };

  const handleMouseLeave = () => {
    const frame = frameRef.current;
    if (!frame) return;

    frame.style.setProperty('--move-x', '0px');
    frame.style.setProperty('--move-y', '0px');
  };

  return (
    <div ref={wrapRef} className={styles.frameWrap}>
      <span className={styles.hangingWire} aria-hidden="true" />
      <span className={styles.hook} aria-hidden="true" />

      <div
        ref={frameRef}
        className={styles.frameMagnet}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.frame}>
          <span className={styles.energyLine} aria-hidden="true" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className={styles.photo} />
        </div>
      </div>
    </div>
  );
}