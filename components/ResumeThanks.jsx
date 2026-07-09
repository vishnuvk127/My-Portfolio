'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import styles from './ResumeThanks.module.css';

/**
 * ResumeThanks — an animated résumé box for the About "Connect" area.
 *
 * No download icon/symbol: it's a text box with a slow shimmer sweep so it
 * reads as interactive. On click it fires the native file download AND, in
 * place (not a popup/alert), morphs into a glowing thank-you message. The
 * message auto-reverts after a few seconds so the download affordance
 * returns and the box can be used again.
 */
export default function ResumeThanks({
  href = '/resume.pdf',
  fileName = 'Kaitepalli-Vishnu-Vardhan-Resume.pdf',
  className = '',
}) {
  const [thanked, setThanked] = useState(false);
  const timerRef = useRef(null);
  const reduce = useReducedMotion();

  // Clear the revert timer if the component unmounts mid-thank.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleDownload = useCallback(() => {
    // Native, same-origin download — no navigation, no popup.
    const a = document.createElement('a');
    a.href = href;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setThanked(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setThanked(false), 7000);
  }, [href, fileName]);

  return (
    <motion.button
      type="button"
      layout
      onClick={handleDownload}
      aria-label="Download résumé"
      className={`relative flex w-fit items-center justify-center overflow-hidden rounded-xl px-3.5 py-2 text-center ${styles.box} ${thanked ? styles.boxThanked : ''} ${className}`}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
    >
      <span className={styles.shimmer} aria-hidden="true" />

      <AnimatePresence mode="wait" initial={false}>
        {!thanked ? (
          <motion.span
            key="cta"
            className={`text-[10px] font-bold uppercase tracking-[0.12em] ${styles.cta}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
          >
            Résumé
          </motion.span>
        ) : (
          <motion.span
            key="thanks"
            role="status"
            className={`flex max-w-[210px] flex-col items-center gap-0.5 ${styles.thanks}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className={styles.thanksMain}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.3 }}
            >
              Thank you for taking the time to review my profile.
            </motion.span>
            <motion.span
              className={styles.thanksSub}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              I look forward to connecting with you.
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
