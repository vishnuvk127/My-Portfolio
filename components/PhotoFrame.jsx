'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PhotoFrame.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const BASE_LANYARD_LENGTH = 150;
const MAX_PULL_DISTANCE = 115;

function limitMovement(x, y) {
  const distance = Math.sqrt(x * x + y * y);

  if (distance <= MAX_PULL_DISTANCE) {
    return { x, y };
  }

  const scale = MAX_PULL_DISTANCE / distance;

  return {
    x: x * scale,
    y: y * scale,
  };
}

export default function PhotoFrame({ src = '/images/profile.jpg', alt = 'Profile portrait' }) {
  const wrapRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    gsap.set(wrap, {
      y: -260,
      opacity: 0,
      rotate: -18,
      transformOrigin: '50% -150px',
    });

    const tween = gsap.to(wrap, {
      y: 0,
      opacity: 1,
      rotate: -7,
      duration: 1.85,
      ease: 'elastic.out(1, 0.36)',
      scrollTrigger: {
        trigger: wrap,
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

  const updateFrameAndLanyard = (x, y) => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const visibleLanyardY = BASE_LANYARD_LENGTH + y;
    const lanyardLength = Math.sqrt(x * x + visibleLanyardY * visibleLanyardY);
    const lanyardAngle = Math.atan2(x, visibleLanyardY) * (180 / Math.PI);
    const frameRotate = -7 + x * 0.045;

    wrap.style.setProperty('--pull-x', `${x}px`);
    wrap.style.setProperty('--pull-y', `${y}px`);
    wrap.style.setProperty('--lanyard-length', `${lanyardLength}px`);
    wrap.style.setProperty('--lanyard-angle', `${lanyardAngle}deg`);
    wrap.style.setProperty('--frame-rotate', `${frameRotate}deg`);
  };

  const handlePointerMove = (event) => {
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();

    const frameCenterX = rect.left + rect.width / 2;
    const frameCenterY = rect.top + rect.height / 2;

    /*
      Same-pole magnetic repulsion:
      mouse comes close -> frame moves away from the mouse.
    */
    const awayX = frameCenterX - event.clientX;
    const awayY = frameCenterY - event.clientY;

    const strength = 0.5;

    const rawX = awayX * strength;
    const rawY = awayY * strength;

    const { x, y } = limitMovement(rawX, rawY);

    updateFrameAndLanyard(x, y);
  };

  const handlePointerLeave = () => {
    updateFrameAndLanyard(0, 0);
  };

  return (
    <div
      ref={wrapRef}
      className={styles.frameWrap}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className={styles.reel} aria-hidden="true" />
      <span className={styles.lanyard} aria-hidden="true" />

      <div ref={frameRef} className={styles.frameMover}>
        <div className={styles.frame}>
          <span className={styles.energyFlow} aria-hidden="true" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className={styles.photo} />
        </div>
      </div>
    </div>
  );
}