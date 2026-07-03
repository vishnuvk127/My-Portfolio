'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PhotoFrame.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const MAX_DISTANCE = 700;
const MAX_X = 360;
const MAX_UP = 420;
const MAX_DOWN = 180;
const HOME_ROTATE = -8;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function PhotoFrame({ src = '/images/profile.jpg', alt = 'Profile portrait' }) {
  const slotRef = useRef(null);
  const shellRef = useRef(null);
  const fallRef = useRef(null);
  const badgeRef = useRef(null);
  const lanyardRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const slot = slotRef.current;
    const shell = shellRef.current;
    const fallLayer = fallRef.current;
    const badge = badgeRef.current;

    if (!slot || !shell || !fallLayer || !badge) return;

    const positionShell = () => {
      const slotRect = slot.getBoundingClientRect();

      shell.style.setProperty('--home-left', `${slotRect.left + slotRect.width / 2}px`);
      shell.style.setProperty('--home-top', `${slotRect.top}px`);
    };

    positionShell();

    window.addEventListener('resize', positionShell);
    window.addEventListener('scroll', positionShell, { passive: true });

    const ctx = gsap.context(() => {
      gsap.set(shell, { autoAlpha: 0 });
      gsap.set(fallLayer, {
        y: -430,
        rotate: -20,
        transformOrigin: '50% 18%',
      });
      gsap.set(badge, {
        x: 0,
        y: 0,
        rotate: 0,
        transformOrigin: '50% 28%',
      });

      ScrollTrigger.create({
        trigger: slot,
        start: 'top 88%',
        end: 'bottom 10%',
        onEnter: () => {
          positionShell();

          gsap.timeline()
            .to(shell, { autoAlpha: 1, duration: 0.1 })
            .to(fallLayer, {
              y: 0,
              rotate: HOME_ROTATE,
              duration: 1.9,
              ease: 'elastic.out(1, 0.34)',
            }, 0);
        },
        onLeaveBack: () => {
          gsap.to(shell, { autoAlpha: 0, duration: 0.25 });
          gsap.set(fallLayer, { y: -430, rotate: -20 });
          gsap.set(badge, { x: 0, y: 0, rotate: 0 });
        },
      });
    }, shell);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', positionShell);
      window.removeEventListener('scroll', positionShell);
    };
  }, []);

  useEffect(() => {
    const badge = badgeRef.current;
    const lanyard = lanyardRef.current;
    if (!badge) return;

    const reset = () => {
      gsap.to(badge, {
        x: 0,
        y: 0,
        rotate: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.45)',
      });

      if (lanyard) {
        gsap.to(lanyard, {
          rotate: 0,
          scaleY: 1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.45)',
        });
      }
    };

    const handleMouseMove = (event) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const rect = badge.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const awayX = centerX - event.clientX;
        const awayY = centerY - event.clientY;

        const distance = Math.max(Math.hypot(awayX, awayY), 1);

        if (distance > MAX_DISTANCE) {
          reset();
          return;
        }

        const force = 1 - distance / MAX_DISTANCE;
        const smoothForce = force * force * (3 - 2 * force);
        const power = 520 * smoothForce;

        const moveX = clamp((awayX / distance) * power, -MAX_X, MAX_X);
        const moveY = clamp((awayY / distance) * power, -MAX_UP, MAX_DOWN);
        const rotate = clamp(moveX * 0.045 + moveY * 0.012, -18, 18);

        gsap.to(badge, {
          x: moveX,
          y: moveY,
          rotate,
          duration: 0.38,
          ease: 'power3.out',
        });

        if (lanyard) {
          gsap.to(lanyard, {
            rotate: clamp(moveX * -0.045, -14, 14),
            scaleY: clamp(1 + Math.abs(moveY) * 0.0009, 1, 1.22),
            duration: 0.38,
            ease: 'power3.out',
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', reset);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', reset);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={slotRef} className={styles.photoSlot} aria-hidden="true" />

      <div ref={shellRef} className={styles.floatShell}>
        <div ref={fallRef} className={styles.fallLayer}>
          <div ref={badgeRef} className={styles.badge}>
            <div ref={lanyardRef} className={styles.lanyard} aria-hidden="true">
              <span className={styles.lanyardLoop} />
              <span className={styles.leftStrap} />
              <span className={styles.rightStrap} />
              <span className={styles.clip} />
            </div>

            <div className={styles.frame}>
              <span className={styles.energy} aria-hidden="true" />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className={styles.photo} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}