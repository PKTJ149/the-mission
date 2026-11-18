"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "./motion-utils";
import styles from "./promo.module.css";

// Fades + lifts its content in the first time it scrolls into view.
// (MotionConfig reducedMotion="user" on the page drops the lift for reduced motion; the fade stays.)
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
    >
      {children}
    </Tag>
  );
}

// Eyebrow + H2 + sub line used by every light section
export function SectionHead({
  id,
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={`${styles.head} ${align === "left" ? styles.headLeft : ""}`}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2 id={id} className={styles.h2}>
        {title}
      </h2>
      {sub && <p className={styles.lead}>{sub}</p>}
    </Reveal>
  );
}
