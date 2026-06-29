'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PageFX.module.css';

// Cosmetic proficiency levels per skill category — adjust freely.
const AXES = [
  { label: 'Analytics', value: 92 },
  { label: 'Engineering', value: 88 },
  { label: 'Cloud / ETL', value: 85 },
  { label: 'ML', value: 90 },
  { label: 'BI / Viz', value: 84 },
  { label: 'Delivery', value: 80 },
];

const SIZE = 320;
const CENTER = SIZE / 2;
const MAX_R = SIZE * 0.36;
const LEVELS = 4;

function pointFor(i, total, r) {
  const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
}

function ringPoints(level) {
  const r = (MAX_R * level) / LEVELS;
  return AXES.map((_, i) => pointFor(i, AXES.length, r).join(',')).join(' ');
}

/**
 * SkillRadar — animated SVG radar/spider chart of skill categories.
 * Draws in (scale 0 -> 1) once scrolled into view. Self-contained;
 * drop in place of a static visual (e.g. the "VV" monogram).
 *
 * Interactivity: each axis has a generously wide invisible hit-stroke
 * laid directly over its full spoke line (center -> outer ring), so
 * hovering or focusing ANY point along that line — not just the data
 * dot — highlights the node, brightens the spoke, and shows a
 * name + percentage tooltip. The legend rows below are two-way linked
 * to the same hover state.
 */
export default function SkillRadar() {
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dataPoints = AXES.map((a, i) => pointFor(i, AXES.length, (a.value / 100) * MAX_R))
    .map((p) => p.join(','))
    .join(' ');

  const activeAxis = hovered !== null ? AXES[hovered] : null;
  let tooltipPos = null;
  if (activeAxis) {
    const [tx, ty] = pointFor(hovered, AXES.length, (activeAxis.value / 100) * MAX_R);
    tooltipPos = { left: (tx / SIZE) * 100, top: (ty / SIZE) * 100, flipDown: ty / SIZE < 0.22 };
  }

  return (
    <div ref={wrapRef} className={styles.radarWrap}>
      <div className={styles.radarStage}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className={styles.radarSvg}
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF8C42" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FFD166" stopOpacity="0.18" />
            </linearGradient>
          </defs>

          {Array.from({ length: LEVELS }).map((_, lvl) => (
            <polygon
              key={lvl}
              points={ringPoints(lvl + 1)}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
          ))}

          {/* Spokes — visible thin line + a fat invisible hit-stroke
              layered on top so the WHOLE line (not just the tip) reacts. */}
          {AXES.map((a, i) => {
            const [x, y] = pointFor(i, AXES.length, MAX_R);
            const active = hovered === i;
            return (
              <g key={i}>
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={x}
                  y2={y}
                  stroke={active ? 'rgba(255,140,66,0.7)' : 'rgba(255,255,255,0.14)'}
                  strokeWidth={active ? 1.8 : 1.1}
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                />
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={x}
                  y2={y}
                  strokeWidth="24"
                  className={styles.radarSpokeHit}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  tabIndex={0}
                  role="img"
                  aria-label={`${a.label}: ${a.value}%`}
                />
              </g>
            );
          })}

          <polygon
            points={dataPoints}
            fill="url(#radarFill)"
            stroke="#FF8C42"
            strokeWidth="1.8"
            className={styles.radarPolygon}
            style={{
              transform: inView ? 'scale(1)' : 'scale(0)',
              transformOrigin: `${CENTER}px ${CENTER}px`,
              filter: activeAxis ? 'drop-shadow(0 0 6px rgba(255,140,66,0.45))' : 'none',
            }}
          />

          {AXES.map((a, i) => {
            const [x, y] = pointFor(i, AXES.length, (a.value / 100) * MAX_R);
            const active = hovered === i;
            return (
              <g key={a.label}>
                {active && (
                  <circle cx={x} cy={y} r="10.8" fill="none" stroke="#FF8C42" strokeWidth="1.5" opacity="0.55" />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={active ? 6.2 : 3.6}
                  fill={active ? '#fff' : '#FFD166'}
                  className={styles.radarNode}
                  style={{
                    opacity: inView ? 1 : 0,
                    transitionDelay: `${0.5 + i * 0.06}s`,
                  }}
                />
              </g>
            );
          })}
        </svg>

        {activeAxis && tooltipPos && (
          <div
            className={styles.radarTooltip}
            style={{
              left: `${tooltipPos.left}%`,
              top: `${tooltipPos.top}%`,
              transform: `translate(-50%, ${tooltipPos.flipDown ? '16px' : 'calc(-100% - 16px)'})`,
            }}
          >
            <div className={styles.radarTooltipInner}>
              <strong>{activeAxis.value}%</strong>
              <span>{activeAxis.label}</span>
            </div>
          </div>
        )}
      </div>

      <ul className={styles.radarLabels}>
        {AXES.map((a, i) => (
          <li
            key={a.label}
            className={hovered === i ? styles.radarLabelActive : ''}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            tabIndex={0}
          >
            <span>{a.label}</span>
            <strong>{a.value}%</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
