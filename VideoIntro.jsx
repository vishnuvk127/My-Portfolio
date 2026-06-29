'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import CinematicDataLayer from './CinematicDataLayer';
import styles from './VideoIntro.module.css';

/**
 * VideoIntro — Scroll-aware cinematic hero
 *
 * Behaviour:
 *  • Video autoplays WITH sound immediately on load (no controls, no hint)
 *  • As user scrolls down, volume fades 1 → 0 proportionally
 *  • Once hero is fully scrolled past, video pauses
 *  • Scrolling back up resumes video and fades volume back in
 */
export default function VideoIntro({
  videoSrc = '/videos/hero.mp4',
  nextId   = 'about',
}) {
  const sectionRef = useRef(null);
  const mainRef    = useRef(null);
  const ambientRef = useRef(null);
  const taglineRef = useRef(null);
  const firstRef   = useRef(null);
  const lastRef    = useRef(null);
  const subRef     = useRef(null);
  const scrollRef  = useRef(null);

  // Track whether video was manually started (needed for autoplay policy)
  const hasStarted = useRef(false);

  // ── Autoplay with sound (requires user gesture on some browsers) ──
  useEffect(() => {
    const video = mainRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1;

    const tryPlay = async () => {
      try {
        await video.play();
        hasStarted.current = true;
      } catch {
        // Browser blocked unmuted autoplay — fall back to muted, then unmute on first interaction
        video.muted = true;
        await video.play().catch(() => {});
        hasStarted.current = true;

        const unmute = () => {
          video.muted = false;
          video.volume = 1;
          window.removeEventListener('click',      unmute);
          window.removeEventListener('touchstart', unmute);
          window.removeEventListener('keydown',    unmute);
        };
        window.addEventListener('click',      unmute, { once: true });
        window.addEventListener('touchstart', unmute, { once: true, passive: true });
        window.addEventListener('keydown',    unmute, { once: true });
      }
    };

    tryPlay();
  }, []);

  // ── Scroll-based volume fade ──
  useEffect(() => {
    const section = sectionRef.current;
    const video   = mainRef.current;
    if (!section || !video) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const { top, height } = section.getBoundingClientRect();
        const viewH = window.innerHeight;

        // progress: 0 = hero fully in view, 1 = hero fully scrolled past
        // Start fading when top of section goes above viewport
        const scrolled = Math.max(0, -top);         // px scrolled into section
        const fadeZone = height * 0.6;               // fade completes over 60% of section height
        const progress = Math.min(1, scrolled / fadeZone);

        // Volume: 1 → 0
        const targetVol = Math.max(0, 1 - progress);
        if (!video.muted) {
          video.volume = targetVol;
        }

        // Ambient video matches (muted, just visual)
        const amb = ambientRef.current;
        if (amb) amb.style.opacity = 1 - progress * 0.4;

        // Pause when fully scrolled past
        if (progress >= 1) {
          if (!video.paused) video.pause();
        } else {
          if (video.paused && hasStarted.current) {
            video.play().catch(() => {});
          }
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── GSAP entrance timeline ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.4 });
      tl
        .to(taglineRef.current, { opacity: 1, y: 0,   duration: 1.1, ease: 'power3.out' })
        .to(firstRef.current,   { opacity: 1, y: 0,   duration: 1.2, ease: 'power4.out' }, '-=0.55')
        .to(lastRef.current,    { opacity: 1, y: 0,   duration: 1.2, ease: 'power4.out' }, '-=0.95')
        .to(subRef.current,     { opacity: 1,          duration: 1.1, ease: 'power2.out' }, '-=0.6')
        .to(scrollRef.current,  { opacity: 0.55,       duration: 1.0, ease: 'power2.out' }, '-=0.4');
    });
    return () => ctx.revert();
  }, []);

  // ── Scroll to next section ──
  const scrollToNext = useCallback(() => {
    document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth' });
  }, [nextId]);

  return (
    <section
      ref={sectionRef}
      className={styles.heroSection}
      aria-label="Portfolio introduction"
    >
      {/* Ambient blurred bg */}
      <div className={styles.ambientLayer}>
        <video
          ref={ambientRef}
          className={styles.ambientVideo}
          src={videoSrc}
          autoPlay loop muted playsInline preload="auto"
          aria-hidden="true"
        />
      </div>

      {/* Main video */}
      <div className={styles.mainVideoWrap}>
        <video
          ref={mainRef}
          className={styles.mainVideo}
          src={videoSrc}
          loop playsInline preload="auto"
        />
      </div>

      {/* Cinematic gradient overlays */}
      <div className={styles.gradTop}      aria-hidden="true" />
      <div className={styles.gradBottom}   aria-hidden="true" />
      <div className={styles.gradLeft}     aria-hidden="true" />
      <div className={styles.gradRight}    aria-hidden="true" />
      <div className={styles.warmVignette} aria-hidden="true" />
      <div className={styles.coolGlow}     aria-hidden="true" />

      {/* Three.js data particle layer */}
      <CinematicDataLayer className={styles.canvasLayer} />

      {/* Text content */}
      <div className={styles.contentOverlay}>
        <p ref={taglineRef} className={styles.tagline}>
          Data Analytics &amp; Predictive Modeling
        </p>
        <div className={styles.nameBlock}>
          <span ref={firstRef} className={styles.firstName}>VISHNU</span>
          <span ref={lastRef}  className={styles.lastName}>VARDHAN</span>
        </div>
        <p ref={subRef} className={styles.subtitle}>
          Specialising in ETL automation, risk scoring models,
          <br />and scalable business intelligence architecture.
        </p>
      </div>

      {/* Scroll indicator only */}
      <div
        ref={scrollRef}
        className={styles.scrollIndicator}
        role="button"
        tabIndex={0}
        aria-label="Scroll to next section"
        onClick={scrollToNext}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && scrollToNext()}
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <div className={styles.scrollLine} />
      </div>

    </section>
  );
}
