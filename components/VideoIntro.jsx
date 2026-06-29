'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import CinematicDataLayer from './CinematicDataLayer';
import NavMenu from './NavMenu';
import styles from './VideoIntro.module.css';

/**
 * VideoIntro — Scroll-aware cinematic hero
 *
 * • No controls UI, no sound hint badge
 * • Autoplays with sound on load
* • Volume fades 1→0 as hero scrolls out of view
 * • Video pauses when fully scrolled past, resumes on scroll back up
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
  const greetRef   = useRef(null);
  const roleRef    = useRef(null);
  const subRef     = useRef(null);
  const ctaRef     = useRef(null);
  const scrollRef  = useRef(null);
  const hasStarted = useRef(false);

  // ── Autoplay with sound ──────────────────────────────────────────
  useEffect(() => {
    const video = mainRef.current;
    if (!video) return;

    video.muted  = false;
    video.volume = 1;

    const tryPlay = async () => {
      try {
        await video.play();
        hasStarted.current = true;
      } catch {
        // Browser blocked unmuted autoplay — start muted, unmute on first interaction
        video.muted = true;
        try { await video.play(); } catch {}
        hasStarted.current = true;

        const unmute = () => {
          video.muted  = false;
          video.volume = 1;
        };
        window.addEventListener('click',      unmute, { once: true });
        window.addEventListener('touchstart', unmute, { once: true, passive: true });
        window.addEventListener('keydown',    unmute, { once: true });
      }
    };

    tryPlay();
  }, []);

  // ── Scroll-based volume fade ─────────────────────────────────────
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

        // scrolled: how many px the section top has moved above the viewport
        const scrolled  = Math.max(0, -top);
        const fadeZone  = height * 0.6;            // volume hits 0 at 60% of section height
        const progress  = Math.min(1, scrolled / fadeZone);
        const targetVol = 1 - progress;            // 1→0

        if (!video.muted) {
          video.volume = targetVol;
        }

        // Pause once fully past, resume when scrolled back in
        if (progress >= 1) {
          if (!video.paused) video.pause();
        } else if (video.paused && hasStarted.current) {
          video.play().catch(() => {});
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── GSAP entrance ────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.4 })
        .to(greetRef.current,  { opacity: 1, y: 0,  duration: 1.1, ease: 'power3.out' })
        .to(roleRef.current,   { opacity: 1, y: 0,  duration: 1.2, ease: 'power4.out' }, '-=0.6')
        .to(subRef.current,    { opacity: 1,         duration: 1.1, ease: 'power2.out' }, '-=0.6')
        .to(ctaRef.current,    { opacity: 1, y: 0,  duration: 0.9, ease: 'power2.out' }, '-=0.55')
        .to(scrollRef.current, { opacity: 0.55,      duration: 1.0, ease: 'power2.out' }, '-=0.4');
    });
    return () => ctx.revert();
  }, []);

  const scrollToNext = useCallback(() => {
    document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth' });
  }, [nextId]);

  return (
    <>
    <NavMenu />
    <section id="home" ref={sectionRef} className={styles.heroSection} aria-label="Portfolio introduction">

      {/* Ambient blurred bg */}
      <div className={styles.ambientLayer}>
        <video ref={ambientRef} className={styles.ambientVideo}
          src={videoSrc} autoPlay loop muted playsInline preload="auto"
          aria-hidden="true" />
      </div>

      {/* Main video — no autoPlay attr; started in JS so we control muted state */}
      <div className={styles.mainVideoWrap}>
        <video ref={mainRef} className={styles.mainVideo}
          src={videoSrc} loop playsInline preload="auto" />
      </div>

      {/* Gradient overlays */}
      <div className={styles.gradTop}      aria-hidden="true" />
      <div className={styles.gradBottom}   aria-hidden="true" />
      <div className={styles.gradLeft}     aria-hidden="true" />
      <div className={styles.gradRight}    aria-hidden="true" />
      <div className={styles.warmVignette} aria-hidden="true" />
      <div className={styles.coolGlow}     aria-hidden="true" />

      {/* Three.js data particle layer */}
      <CinematicDataLayer className={styles.canvasLayer} />

      {/* Text */}
      <div className={styles.contentOverlay}>
        <p ref={greetRef} className={styles.greeting}>
          <span className={styles.greetingName}>Kaitepalli Vishnu Vardhan</span>
        </p>
        <h1 ref={roleRef} className={styles.role}>Data Analyst</h1>
        <p ref={subRef} className={styles.subtitle}>
          Specialising in ETL automation, risk scoring models,
          <br />and scalable business intelligence architecture.
        </p>
        <div ref={ctaRef} className={styles.ctaRow}>
          <a href="#projects" className={styles.ctaPrimary}>View My Work</a>
          <a href="#contact" className={styles.ctaAccent}>Contact Me</a>
          <a href="/resume.pdf" download className={styles.ctaGhost}>
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 1.5v8.4M8 9.9 4.7 6.6M8 9.9l3.3-3.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2.5 11v1.8a1.7 1.7 0 0 0 1.7 1.7h7.6a1.7 1.7 0 0 0 1.7-1.7V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download Resume
          </a>
        </div>
      </div>

      {/* Scroll indicator — only interactive element remaining */}
      <div
        ref={scrollRef}
        className={styles.scrollIndicator}
        role="button" tabIndex={0}
        aria-label="Scroll to next section"
        onClick={scrollToNext}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && scrollToNext()}
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <div className={styles.scrollLine} />
      </div>

    </section>
    </>
  );
}
