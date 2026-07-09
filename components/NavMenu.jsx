'use client';

import { useEffect, useState } from 'react';
import { BrainCircuit, FolderKanban, Home, Mail, UserRound } from 'lucide-react';
import styles from './NavMenu.module.css';

const LINKS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'about', label: 'About', Icon: UserRound },
  { id: 'skills', label: 'Skills', Icon: BrainCircuit },
  { id: 'projects', label: 'Projects', Icon: FolderKanban },
  { id: 'contact', label: 'Contact', Icon: Mail },
];

const SECTION_THEMES = {
  projects: 'neonEdge',
  contact: 'frostedAcrylic',
};

export default function NavMenu() {
  const [activeId, setActiveId] = useState('home');
  const activeTheme = styles[SECTION_THEMES[activeId] ?? 'ultraClear'];

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

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={styles.header}>
      <nav className={`${styles.glassBubble} ${activeTheme}`} aria-label="Primary navigation">
        <a
          href="#home"
          className={styles.brand}
          aria-label="Kaitepalli Vishnu Vardhan — back to top"
        >
          <span className={styles.brandCore}>KVV</span>
          <span className={styles.brandPulse} aria-hidden="true" />
        </a>

        <span className={styles.divider} aria-hidden="true" />

        <ul className={styles.linkList}>
          {LINKS.map(({ id, label, Icon }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`${styles.navLink} ${activeId === id ? styles.linkActive : ''}`}
                aria-current={activeId === id ? 'page' : undefined}
                aria-label={label}
                title={label}
                onClick={() => setActiveId(id)}
              >
                <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
