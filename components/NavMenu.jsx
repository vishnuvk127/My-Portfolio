'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './NavMenu.module.css';

/**
 * NavMenu — fixed hamburger toggle (top-right) that opens a vertical,
 * slide-in section menu. Rendered once from VideoIntro so it sits "at
 * the hero" but, being position:fixed, stays usable while scrolling
 * the rest of the page.
 *
 * Features: animated hamburger -> X, backdrop + Escape + outside-click
 * to close, body-scroll lock while open, staggered link entrance, and
 * a scrollspy that highlights whichever section is currently in view.
 */
const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  const close = useCallback(() => setOpen(false), []);

  // Lock background scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Scrollspy — highlight the section currently centred in the viewport
  useEffect(() => {
    const sections = LINKS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <button
        type="button"
        className={`${styles.toggle} ${open ? styles.toggleOpen : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-nav-panel"
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      <div
        className={`${styles.backdrop} ${open ? styles.backdropShow : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      <nav
        id="site-nav-panel"
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        aria-label="Section navigation"
      >
        <span className={styles.panelLabel}>Navigate</span>
        <ul className={styles.linkList}>
          {LINKS.map(({ id, label }, i) => (
            <li key={id} style={{ transitionDelay: open ? `${0.06 + i * 0.04}s` : '0s' }}>
              <a
                href={`#${id}`}
                className={activeId === id ? styles.linkActive : ''}
                onClick={close}
              >
                <span className={styles.linkIndex}>{String(i + 1).padStart(2, '0')}</span>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
