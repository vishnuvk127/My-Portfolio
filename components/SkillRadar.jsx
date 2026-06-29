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

const SIZE = 280;
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
 */
export default function SkillRadar() {
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(false);

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

  return (
    <div ref={wrapRef} className={styles.radarWrap}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.radarSvg}>
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

        {AXES.map((_, i) => {
          const [x, y] = pointFor(i, AXES.length, MAX_R);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={dataPoints}
          fill="url(#radarFill)"
          stroke="#FF8C42"
          strokeWidth="1.6"
          className={styles.radarPolygon}
          style={{
            transform: inView ? 'scale(1)' : 'scale(0)',
            transformOrigin: `${CENTER}px ${CENTER}px`,
          }}
        />

        {AXES.map((a, i) => {
          const [x, y] = pointFor(i, AXES.length, (a.value / 100) * MAX_R);
          return (
            <circle
              key={a.label}
              cx={x}
              cy={y}
              r="3.2"
              fill="#FFD166"
              className={styles.radarNode}
              style={{ opacity: inView ? 1 : 0, transitionDelay: `${0.5 + i * 0.06}s` }}
            />
          );
        })}
      </svg>

      <ul className={styles.radarLabels}>
        {AXES.map((a) => (
          <li key={a.label}>
            <span>{a.label}</span>
            <strong>{a.value}%</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
