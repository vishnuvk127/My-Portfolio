'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Parses strings like "4+", "$15M", "30%", "0.89" into a prefix
 * (non-numeric leading chars), a numeric target, and a suffix
 * (non-numeric trailing chars), preserving decimal precision.
 */
function parseValue(raw) {
  const match = String(raw).match(/^([^\d.]*)([\d.]+)(.*)$/);
  if (!match) return { prefix: '', target: 0, suffix: String(raw), decimals: 0 };
  const [, prefix, numStr, suffix] = match;
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
  return { prefix, target: parseFloat(numStr), suffix, decimals };
}

/**
 * StatCounter — counts up from 0 to the numeric part of `value` once it
 * scrolls into view, keeping any prefix/suffix (currency signs, %, +, M).
 * Drop-in replacement for a static <div>{num}</div>; pass className through.
 */
export default function StatCounter({ value, duration = 1.4, className = '' }) {
  const ref = useRef(null);
  const startedRef = useRef(false);
  const { prefix, target, suffix, decimals } = parseValue(value);
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();

          const tick = (now) => {
            const t = Math.min(1, (now - start) / (duration * 1000));
            const eased = 1 - Math.pow(1 - t, 3);
            const current = (target * eased).toFixed(decimals);
            setDisplay(`${prefix}${current}${suffix}`);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={className}>
      {display}
    </div>
  );
}
