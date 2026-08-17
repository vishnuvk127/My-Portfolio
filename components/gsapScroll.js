'use client';

/**
 * Shared GSAP + ScrollTrigger entry point.
 *
 * Registering the plugin is idempotent, but it was previously repeated
 * verbatim in every scroll-driven component. Importing from here keeps
 * that setup in one place — import { gsap, ScrollTrigger } from './gsapScroll'.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
