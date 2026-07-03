'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PhotoFrame.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const INFLUENCE_RADIUS = 420;
const MAX_LEFT_RIGHT = 280;
const MAX_UP = 300;
const MAX_DOWN = 150;
const HOME_ROTATE = -7;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function PhotoFrame({ src = '/images/profile.jpg', alt = 'Profile portrait' }) {
  const wrapRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const badge = badgeRef.current;
    if (!badge) return;

    gsap.set(badge, {
      y: -340,
      opacity: 0,
      rotate: -18,
      transformOrigin: '50% 35%',
    });

    const tween = gsap.to(badge, {
      y: 0,
      opacity: 1,
      rotate: HOME_ROTATE,
      duration: 1.85,
      ease: 'elastic.out(1, 0.35)',
      scrollTrigger: {
        trigger: badge,
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

  useEffect(() => {
    const wrap = wrapRef.current;
    const badge = badgeRef.current;
    if (!wrap || !badge) return;

    const resetBadge = () => {
      wrap.style.setProperty('--move-x', '0px');
      wrap.style.setProperty('--move-y', '0px');
      wrap.style.setProperty('--rotate', `${HOME_ROTATE}deg`);
      wrap.style.setProperty('--lanyard-sway', '0deg');
    };

    const handlePointerMove = (event) => {
      const rect = badge.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const awayX = centerX - event.clientX;
      const awayY = centerY - event.clientY;

      const distance = Math.max(Math.sqrt(awayX * awayX + awayY * awayY), 1);

      if (distance > INFLUENCE_RADIUS) {
        resetBadge();
        return;
      }

      const force = 1 - distance / INFLUENCE_RADIUS;
      const power = 260 * force;

      const moveX = clamp((awayX / distance) * power, -MAX_LEFT_RIGHT, MAX_LEFT_RIGHT);
      const moveY = clamp((awayY / distance) * power, -MAX_UP, MAX_DOWN);

      const rotate = clamp(HOME_ROTATE + moveX * 0.035, -18, 10);
      const lanyardSway = clamp(moveX * -0.06, -12, 12);

      wrap.style.setProperty('--move-x', `${moveX}px`);
      wrap.style.setProperty('--move-y', `${moveY}px`);
      wrap.style.setProperty('--rotate', `${rotate}deg`);
      wrap.style.setProperty('--lanyard-sway', `${lanyardSway}deg`);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', resetBadge);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', resetBadge);
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.frameWrap}>
      <div ref={badgeRef} className={styles.badgeGroup}>
        <div className={styles.lanyard} aria-hidden="true">
          <span className={styles.lanyardBand} />
          <span className={styles.lanyardLeft} />
          <span className={styles.lanyardRight} />
          <span className={styles.lanyardClip} />
        </div>

        <div className={styles.frame}>
          <span className={styles.energyFlow} aria-hidden="true" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className={styles.photo} />
        </div>
      </div>
    </div>
  );
}