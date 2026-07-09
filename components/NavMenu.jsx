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
      <a
        href="#home"
        className={`fixed top-[30px] left-[6vw] z-[1000] max-w-[60vw] truncate text-[clamp(15px,1.8vw,20px)] font-extrabold tracking-[0.03em] no-underline ${styles.brand}`}
        aria-label="Kaitepalli Vishnu Vardhan — back to top"
      >
        Kaitepalli Vishnu Vardhan
      </a>

      <button
        type="button"
        className={`fixed top-7 right-[6vw] z-[1000] flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-1 rounded-full p-0 ${styles.toggle} ${open ? styles.toggleOpen : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-nav-panel"
      >
        <span className={`block h-[1.3px] w-[14px] rounded-[2px] ${styles.bar}`} />
        <span className={`block h-[1.3px] w-[14px] rounded-[2px] ${styles.bar}`} />
        <span className={`block h-[1.3px] w-[14px] rounded-[2px] ${styles.bar}`} />
      </button>

      <div
        className={`fixed inset-0 z-[998] pointer-events-none ${styles.catcher} ${open ? styles.catcherShow : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      <nav
        id="site-nav-panel"
        className={`fixed top-[72px] right-[6vw] z-[999] min-w-[168px] rounded-[14px] p-[7px] ${styles.panel} ${open ? styles.panelOpen : ''}`}
        aria-label="Section navigation"
      >
        <ul className={`flex list-none flex-col gap-px ${styles.linkList}`}>
          {LINKS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`block whitespace-nowrap rounded-[9px] px-4 py-[9px] text-sm font-medium tracking-[0.01em] no-underline ${activeId === id ? styles.linkActive : ''}`}
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
