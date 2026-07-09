'use client';

import Reveal from './Reveal';
import StatCounter from './StatCounter';
import styles from '../app/page.module.css';

/**
 * AboutStatCard — a flip stat card for the About section.
 *
 * Two interactive behaviours live here (both need real DOM geometry, so they
 * can't be pure CSS):
 *
 *  1. Auto-height — on hover/focus the card grows to exactly fit its context
 *     (back-face) text, so long and short blurbs both sit inside the borders
 *     with even padding instead of being clipped by a fixed height.
 *
 *  2. Graduated "depth of field" — the other stat cards blur in rings by
 *     distance from the inspected one: nearest 30% → next 80% → 100%. The rest
 *     of the page is left sharp (no more full-page blur).
 *
 * Styles come from app/page.module.css; the blur/opacity animate via the
 * .statCard transition declared there.
 */

const MAX_BLUR = 6; // px, applied to the farthest ring (100%)
const RING_FRACTION = { 1: 0.3, 2: 0.8 }; // nearest ring 30%, next 80%, ≥3 ⇒ 100%

function statSiblings(card) {
  return [...card.parentElement.children].filter(
    (el) => el !== card && [...el.classList].some((c) => c.includes('statCard'))
  );
}

function activate(card) {
  // The inspected card is always sharp — clear any leftover ring styling.
  card.style.filter = '';
  card.style.opacity = '';

  // Fit the card height to the context text (+ a little cushion).
  const back = card.querySelector('[class*="statBack"]');
  if (back) {
    const fit = back.scrollHeight + 2;
    card.style.height = `${fit}px`;
    card.style.minHeight = `${fit}px`;
  }

  // Rank the other cards by centre-to-centre distance and blur them in rings.
  const a = card.getBoundingClientRect();
  const ax = a.left + a.width / 2;
  const ay = a.top + a.height / 2;
  const step = a.width + 18; // one grid cell across (column width + 18px gap)

  statSiblings(card).forEach((el) => {
    const r = el.getBoundingClientRect();
    const dist = Math.hypot(r.left + r.width / 2 - ax, r.top + r.height / 2 - ay);
    const ring = Math.max(1, Math.round(dist / step));
    const frac = ring >= 3 ? 1 : RING_FRACTION[ring];
    el.style.filter = `blur(${(MAX_BLUR * frac).toFixed(2)}px) brightness(${(1 - 0.18 * frac).toFixed(2)})`;
    el.style.opacity = `${(1 - 0.3 * frac).toFixed(2)}`;
  });
}

function deactivate(card) {
  card.style.height = '';
  card.style.minHeight = '';
  statSiblings(card).forEach((el) => {
    el.style.filter = '';
    el.style.opacity = '';
  });
}

export default function AboutStatCard({ stat, delay, group, index }) {
  const { num, lbl, contextTitle, context } = stat;
  const cardId = `${group}-about-stat-${index}`;

  return (
    <Reveal
      className={`${styles.statCard} ${styles.bentoStat}`}
      delay={delay}
      tabIndex={0}
      role="article"
      aria-labelledby={`${cardId}-label`}
      aria-describedby={`${cardId}-context`}
      onMouseEnter={(e) => activate(e.currentTarget)}
      onMouseLeave={(e) => deactivate(e.currentTarget)}
      onFocus={(e) => activate(e.currentTarget)}
      onBlur={(e) => deactivate(e.currentTarget)}
    >
      <div className={styles.statCardInner}>
        <div className={`${styles.statFace} ${styles.statFront}`}>
          <StatCounter value={num} className={styles.statNum} />
          <div id={`${cardId}-label`} className={styles.statLbl}>{lbl}</div>
          <span className={styles.statHint}>Hover for context</span>
        </div>

        <div className={`${styles.statFace} ${styles.statBack}`}>
          <strong className={styles.statBackTitle}>{contextTitle}</strong>
          <p id={`${cardId}-context`} className={styles.statBackText}>{context}</p>
        </div>
      </div>

      <span className={styles.statLightning} aria-hidden="true" />
    </Reveal>
  );
}
