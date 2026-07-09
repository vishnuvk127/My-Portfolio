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
    <section
      id="home"
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black"
      aria-label="Portfolio introduction"
    >

      {/* Ambient blurred bg */}
      <div className={`absolute inset-[-30px] z-[1] overflow-hidden ${styles.ambientLayer}`}>
        <video ref={ambientRef} className={`h-[calc(100%+60px)] w-[calc(100%+60px)] object-cover ${styles.ambientVideo}`}
          src={videoSrc} autoPlay loop muted playsInline preload="auto"
          aria-hidden="true" />
      </div>

      {/* Main video — no autoPlay attr; started in JS so we control muted state */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center">
        <video ref={mainRef} className="h-full w-full object-cover"
          src={videoSrc} loop playsInline preload="auto" />
      </div>

      {/* Gradient overlays */}
      <div className={`absolute inset-x-0 top-0 z-[3] h-[40%] pointer-events-none ${styles.gradTop}`}      aria-hidden="true" />
      <div className={`absolute inset-x-0 bottom-0 z-[3] h-[55%] pointer-events-none ${styles.gradBottom}`}   aria-hidden="true" />
      <div className={`absolute top-0 bottom-0 left-0 z-[3] w-[35%] pointer-events-none ${styles.gradLeft}`}     aria-hidden="true" />
      <div className={`absolute top-0 bottom-0 right-0 z-[3] w-[35%] pointer-events-none ${styles.gradRight}`}    aria-hidden="true" />
      <div className={`absolute inset-x-0 bottom-0 z-[3] h-[35%] pointer-events-none ${styles.warmVignette}`} aria-hidden="true" />
      <div className={`absolute top-0 right-0 z-[3] h-[50%] w-[40%] pointer-events-none ${styles.coolGlow}`}     aria-hidden="true" />

      {/* Three.js data particle layer */}
      <CinematicDataLayer className="z-[4]" />

      {/* Text */}
      <div className={`absolute inset-0 z-[5] flex flex-col justify-end px-[6vw] pb-[9vh] pointer-events-none ${styles.contentOverlay}`}>
        <p ref={greetRef} className={`mb-[0.55rem] text-[clamp(16px,2vw,22px)] font-normal tracking-[0.01em] ${styles.greeting}`}>
          <span className={`font-bold ${styles.greetingName}`}>Kaitepalli Vishnu Vardhan</span>
        </p>
        <h1 ref={roleRef} className={`block mb-[1.3rem] text-[clamp(34px,4.6vw,60px)] font-extrabold tracking-[-0.02em] ${styles.role}`}>Data Analyst</h1>
        <p ref={subRef} className={`mb-[1.9rem] max-w-[520px] text-[clamp(13px,1.5vw,17px)] font-light leading-[1.65] tracking-[0.02em] ${styles.subtitle}`}>
          Specialising in ETL automation, risk scoring models,
          <br />and scalable business intelligence architecture.
        </p>
        <div ref={ctaRef} className={`flex flex-wrap items-center gap-[14px] pointer-events-auto ${styles.ctaRow}`}>
          <a href="#projects" className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-[26px] py-[13px] text-sm font-semibold tracking-[0.01em] ${styles.ctaPrimary}`}>View My Work</a>
          <a href="#contact" className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-[26px] py-[13px] text-sm font-semibold tracking-[0.01em] ${styles.ctaAccent}`}>Contact Me</a>
          <a href="/resume.pdf" download className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-[26px] py-[13px] text-sm font-semibold tracking-[0.01em] ${styles.ctaGhost}`}>
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-[15px] w-[15px] shrink-0">
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
        className={`absolute bottom-8 left-1/2 z-[6] flex flex-col items-center gap-2 cursor-pointer pointer-events-auto ${styles.scrollIndicator}`}
        role="button" tabIndex={0}
        aria-label="Scroll to next section"
        onClick={scrollToNext}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && scrollToNext()}
      >
        <span className={`text-[10px] font-normal uppercase tracking-[0.2em] ${styles.scrollLabel}`}>Scroll</span>
        <div className={`relative h-[42px] w-px overflow-hidden ${styles.scrollLine}`} />
      </div>

    </section>
    </>
  );
}
