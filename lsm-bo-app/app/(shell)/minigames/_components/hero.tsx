"use client";

import { motion, useReducedMotion } from "motion/react";
import { MINIGAMES_CONTACT_URL } from "@/lib/config/minigames";
import { HERO } from "../_content";
import { EASE_OUT } from "./motion-utils";
import styles from "./promo.module.css";
import { Showcase } from "./showcase";

// Smooth-scrolls to the playable demos (instant for reduced motion)
export function useScrollToDemo() {
  const reduce = useReducedMotion();
  return () => {
    const target = document.getElementById("minigames-demo");
    target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
}

// Sparkles scattered over the hero background (decorative)
const SPARKLES = [
  { left: "6%", top: "14%", size: 10, delay: 0 },
  { left: "44%", top: "8%", size: 7, delay: 1.2 },
  { left: "52%", top: "78%", size: 9, delay: 0.6 },
  { left: "92%", top: "12%", size: 8, delay: 1.8 },
  { left: "3%", top: "82%", size: 6, delay: 2.4 },
  { left: "97%", top: "70%", size: 10, delay: 0.9 },
];

const item = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE_OUT, delay: 0.05 + i * 0.07 },
});

export function Hero() {
  const scrollToDemo = useScrollToDemo();

  return (
    <section className={styles.hero} aria-labelledby="minigames-title">
      <div className={styles.heroBg} aria-hidden="true">
        <span className={styles.heroGlowA} />
        <span className={styles.heroGlowB} />
        <span className={styles.heroGrid} />
        {SPARKLES.map((s) => (
          <span
            key={`${s.left}-${s.top}`}
            className={styles.sparkle}
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          />
        ))}
      </div>

      <div className={styles.heroLayout}>
        <div className={styles.heroCopy}>
          <motion.span className={styles.heroEyebrow} {...item(0)}>
            <span className={styles.heroEyebrowDot} aria-hidden="true" />
            {HERO.eyebrow}
            <span className={styles.newBadge}>NEW</span>
          </motion.span>

          <motion.h1 id="minigames-title" className={styles.h1} {...item(1)}>
            {HERO.titleLead}
            <br />
            <span className={styles.h1Accent}>{HERO.titleAccent}</span>
          </motion.h1>

          <motion.p className={styles.heroSub} {...item(2)}>
            {HERO.sub}
          </motion.p>
          <motion.p className={styles.heroBody} {...item(3)}>
            {HERO.body}
          </motion.p>

          <motion.div className={styles.ctaRow} {...item(4)}>
            <a className={styles.ctaPrimary} href={MINIGAMES_CONTACT_URL} target="_blank" rel="noopener noreferrer">
              {HERO.primaryCta}
              <i className="pi pi-arrow-right" aria-hidden="true" />
              <span className={styles.srOnly}>(เปิดในแท็บใหม่)</span>
            </a>
            <button type="button" className={styles.ctaSecondary} onClick={scrollToDemo}>
              <i className="pi pi-play" aria-hidden="true" />
              {HERO.secondaryCta}
            </button>
          </motion.div>

          <motion.p className={styles.heroNote} {...item(5)}>
            {HERO.note}
          </motion.p>
        </div>

        <Showcase />
      </div>
    </section>
  );
}
