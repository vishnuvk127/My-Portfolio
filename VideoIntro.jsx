'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import CinematicDataLayer from './CinematicDataLayer';
import styles from './VideoIntro.module.css';

/**
 * VideoIntro
 * Cinematic fullscreen hero section with:
 *  – Ambient blurred bg video + main video
 *  – Warm-orange + cool-blue gradient overlays
 *  – Three.js data-particle CinematicDataLayer
 *  – GSAP staggered content entrance
 *  – Glassmorphism play/pause + mute/unmute controls
 *  – Animated scroll indicator
 *  – Auto-dismissing "Tap for sound" badge
 *
 * Props:
 *  videoSrc   – path/URL to the talking-head video
 *  nextId     – id of the next section for scroll-to behaviour
 */
export default function VideoIntro({
  videoSrc = '/hero.mp4',
  nextId   = 'next',
}) {
  const mainRef    = useRef(null);
  const ambientRef = useRef(null);
  const taglineRef = useRef(null);
  const firstRef   = useRef(null);
  const lastRef    = useRef(null);
  const subRef     = useRef(null);
  const ctrlsRef   = useRef(null);
  const scrollRef  = useRef(null);
  const hintRef    = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted,   setIsMuted]   = useState(true);
  const [hintGone,  setHintGone]  = useState(false);

  // ── Entrance timeline ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.4 });
      tl
        .to(taglineRef.current, { opacity: 1, y: 0,  duration: 1.1, ease: 'power3.out' })
        .to(firstRef.current,   { opacity: 1, y: 0,  duration: 1.2, ease: 'power4.out' }, '-=0.55')
        .to(lastRef.current,    { opacity: 1, y: 0,  duration: 1.2, ease: 'power4.out' }, '-=0.95')
        .to(subRef.current,     { opacity: 1,         duration: 1.1, ease: 'power2.out' }, '-=0.6')
        .to(ctrlsRef.current,   { opacity: 1,         duration: 0.9, ease: 'power2.out' }, '-=0.5')
        .to(scrollRef.current,  { opacity: 0.55,      duration: 1.0, ease: 'power2.out' }, '-=0.4');
    });
    return () => ctx.revert();
  }, []);

  // ── Auto-hide sound hint ──
  useEffect(() => {
    const id = setTimeout(() => {
      if (hintRef.current) {
        gsap.to(hintRef.current, {
          opacity: 0, duration: 1.2, ease: 'power2.inOut',
          onComplete: () => setHintGone(true),
        });
      }
    }, 5000);
    return () => clearTimeout(id);
  }, []);

  // ── Controls ──
  const togglePlay = useCallback(() => {
    const v = mainRef.current;
    const a = ambientRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); a?.pause(); }
    else           { v.play(); a?.play(); }
    setIsPlaying(p => !p);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const v = mainRef.current;
    if (!v) return;
    v.muted = isMuted; // toggling to opposite
    setIsMuted(m => !m);
    if (isMuted && !hintGone && hintRef.current) {
      gsap.to(hintRef.current, { opacity: 0, duration: 0.6, ease: 'power2.inOut',
        onComplete: () => setHintGone(true) });
    }
  }, [isMuted, hintGone]);

  const scrollToNext = useCallback(() => {
    document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth' });
  }, [nextId]);

  return (
    <section className={styles.heroSection} aria-label="Portfolio introduction">

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
          autoPlay loop muted playsInline preload="auto"
        />
      </div>

      {/* Cinematic gradient overlays */}
      <div className={styles.gradTop}    aria-hidden="true" />
      <div className={styles.gradBottom} aria-hidden="true" />
      <div className={styles.gradLeft}   aria-hidden="true" />
      <div className={styles.gradRight}  aria-hidden="true" />
      <div className={styles.warmVignette} aria-hidden="true" />
      <div className={styles.coolGlow}   aria-hidden="true" />

      {/* Three.js data layer */}
      <CinematicDataLayer className={styles.canvasLayer} />

      {/* Content */}
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

      {/* Controls */}
      <div ref={ctrlsRef} className={styles.controls} aria-label="Video controls">
        <button
          className={styles.controlBtn}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          className={styles.controlBtn}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <MuteIcon /> : <SoundIcon />}
        </button>
      </div>

      {/* Sound hint */}
      {!hintGone && (
        <div ref={hintRef} className={styles.soundHint} aria-hidden="true">
          <div className={styles.soundPulse} />
          <span>Tap for sound</span>
        </div>
      )}

      {/* Scroll indicator */}
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

// ── Inline SVG icons ──
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  );
}
function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  );
}
