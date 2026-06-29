'use client';

import { useRef } from 'react';

/**
 * MagneticButton — wraps an anchor/button; while the cursor is over the
 * element it nudges toward the pointer, snapping back on mouseleave.
 * Relies on the *passed-in* className already having a transform
 * transition defined (e.g. page.module.css .ctaBtn), so this component
 * adds no styling of its own — purely behaviour, same pattern as TiltCard.
 *
 * Usage:
 *   <MagneticButton as="a" href="mailto:..." className={styles.ctaBtn}>Send</MagneticButton>
 */
export default function MagneticButton({ as: Tag = 'a', className = '', strength = 0.35, children, ...rest }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  };

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}
