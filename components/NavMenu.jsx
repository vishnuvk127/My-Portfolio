'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './NavMenu.module.css';

/**
 * NavMenu — small fixed hamburger toggle (top-right) that opens a
 * compact, glassy dropdown anchored right under the button — not a
 * full-height side drawer. Rendered once from VideoIntro so it sits
 * "at the hero" but, being position:fixed, stays usable everywhere.
 *
 * Features: animated hamburger -> X, click-outside + Escape to close,
 * and a scrollspy that highlights whichever section is in view.
 */
const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');

  const close = useCallback(() => setOpen(false), []);

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
      <a href="#home" className={styles.brand} aria-label="Kaitepalli Vishnu Vardhan — back to top">
        Kaitepalli Vishnu Vardhan
      </a>

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
        className={`${styles.catcher} ${open ? styles.catcherShow : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      <nav
        id="site-nav-panel"
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        aria-label="Section navigation"
      >
        <ul className={styles.linkList}>
          {LINKS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeId === id ? styles.linkActive : ''}
                onClick={close}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
