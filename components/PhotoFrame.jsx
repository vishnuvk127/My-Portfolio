'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PhotoFrame.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HOME_ROTATE = -8;
const INFLUENCE_RADIUS = 620;
const MAX_X = 360;
const MAX_UP = 420;
const MAX_DOWN = 180;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function PhotoFrame({ src = '/images/profile.jpg', alt = 'Profile portrait' }) {
  const holderRef = useRef(null);
  const fallRef = useRef(null);
  const moveRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const fallLayer = fallRef.current;
    if (!fallLayer) return;

    gsap.set(fallLayer, {
      y: -520,
      opacity: 0,
      rotate: -22,
      transformOrigin: '50% 18%',
    });

    const tween = gsap.to(fallLayer, {
      y: 0,
      opacity: 1,
      rotate: HOME_ROTATE,
      duration: 1.9,
      ease: 'elastic.out(1, 0.34)',
      scrollTrigger: {
        trigger: fallLayer,
        start: 'top 88%',
        end: 'bottom 18%',
        toggleActions: 'play reverse play reverse',
      },
    });

    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  useEffect(() => {
    const holder = holderRef.current;
    const moveLayer = moveRef.current;
    if (!holder || !moveLayer) return;

    const reset = () => {
      holder.style.setProperty('--move-x', '0px');
      holder.style.setProperty('--move-y', '0px');
      holder.style.setProperty('--rotate', `${HOME_ROTATE}deg`);
      holder.style.setProperty('--lanyard-sway', '0deg');
      holder.style.setProperty('--lanyard-pull', '0px');
    };

    const updateFromPointer = (event) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const rect = moveLayer.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const awayX = centerX - event.clientX;
        const awayY = centerY - event.clientY;

        const distance = Math.max(Math.hypot(awayX, awayY), 1);

        if (distance > INFLUENCE_RADIUS) {
          reset();
          return;
        }

        const force = 1 - distance / INFLUENCE_RADIUS;
        const easedForce = force * force * (3 - 2 * force);
        const power = 430 * easedForce;

        const moveX = clamp((awayX / distance) * power, -MAX_X, MAX_X);
        const moveY = clamp((awayY / distance) * power, -MAX_UP, MAX_DOWN);

        const rotate = clamp(HOME_ROTATE + moveX * 0.035 + moveY * 0.012, -24, 16);
        const lanyardSway = clamp(moveX * -0.045, -16, 16);
        const lanyardPull = clamp(Math.abs(moveY) * 0.08 + Math.abs(moveX) * 0.04, 0, 24);

        holder.style.setProperty('--move-x', `${moveX}px`);
        holder.style.setProperty('--move-y', `${moveY}px`);
        holder.style.setProperty('--rotate', `${rotate}deg`);
        holder.style.setProperty('--lanyard-sway', `${lanyardSway}deg`);
        holder.style.setProperty('--lanyard-pull', `${lanyardPull}px`);
      });
    };

    window.addEventListener('pointermove', updateFromPointer, { passive: true });
    window.addEventListener('pointerleave', reset);

    return () => {
      window.removeEventListener('pointermove', updateFromPointer);
      window.removeEventListener('pointerleave', reset);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={holderRef} className={styles.frameHolder}>
      <div ref={fallRef} className={styles.fallLayer}>
        <div ref={moveRef} className={styles.moveLayer}>
          <div className={styles.neckLanyard} aria-hidden="true">
            <span className={styles.lanyardLoop} />
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
    </div>
  );
}