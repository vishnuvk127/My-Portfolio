'use client';

import { useEffect, useRef } from 'react';
import styles from './PageFX.module.css';

/**
 * AmbientDataField — lightweight canvas2D drifting-particle backdrop.
 * Cheaper than a second Three.js/WebGL context; intended to be dropped
 * behind a section's content (parent should have position: relative).
 * Pauses its draw loop when scrolled off-screen.
 */
export default function AmbientDataField({ density = 42, color = '255,140,66' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let raf;
    let w, h;
    let points = [];
    let visible = true;

    const resize = () => {
      const parent = canvas.parentElement;
      w = canvas.width = parent.clientWidth;
      h = canvas.height = parent.clientHeight;
      points = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.6 + 0.6,
      }));
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;

      const maxLinkDist = Math.min(w, h) * 0.18 || 120;
      ctx.clearRect(0, 0, w, h);

      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxLinkDist) {
            ctx.strokeStyle = `rgba(${color},${0.08 * (1 - d / maxLinkDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},0.35)`;
        ctx.fill();
      });
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      io.disconnect();
    };
  }, [density, color]);

  return <canvas ref={canvasRef} className={styles.ambientCanvas} aria-hidden="true" />;
}
