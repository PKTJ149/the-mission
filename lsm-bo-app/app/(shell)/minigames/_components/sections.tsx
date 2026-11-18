"use client";

import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { MINIGAMES_CONTACT_URL } from "@/lib/config/minigames";
import {
  BENEFITS,
  BENEFITS_SECTION,
  CAPABILITIES,
  CAPABILITY_DETAILS,
  FEATURES,
  FEATURES_SECTION,
  FINAL_CTA,
  STEPS,
  STEPS_SECTION,
  WHEEL_SLICES,
} from "../_content";
import { BoxArt, WheelArt } from "./art";
import { useScrollToDemo } from "./hero";
import styles from "./promo.module.css";
import { Reveal, SectionHead } from "./reveal";

// Section 2: true capability facts, overlapping the bottom of the hero
export function CapabilityStrip() {
  return (
    <Reveal className={styles.strip}>
      <ul className={styles.stripList} aria-label="ความสามารถหลัก">
        {CAPABILITIES.map((c) => (
          <li key={c.label} className={styles.stripItem}>
            <span className={styles.stripValue}>{c.value}</span>
            <span className={styles.stripLabel}>{c.label}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

const FEATURE_TONES = ["toneViolet", "tonePink", "toneGold", "toneBlue"] as const;

// Section 4: the 4 feature cards from the reference image + the detailed capability grid
export function Features() {
  return (
    <section className={styles.section} aria-labelledby="features-title">
      <SectionHead id="features-title" eyebrow={FEATURES_SECTION.eyebrow} title={FEATURES_SECTION.title} sub={FEATURES_SECTION.sub} />

      <div className={styles.featureGrid}>
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06} className={styles.featureCard}>
            <span className={`${styles.featureIcon} ${styles[FEATURE_TONES[i]]}`} aria-hidden="true">
              <i className={`pi ${f.icon}`} />
            </span>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureText}>{f.text}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className={styles.subHead}>
        <h3 className={styles.h3}>{FEATURES_SECTION.detailTitle}</h3>
      </Reveal>
      <div className={styles.detailGrid}>
        {CAPABILITY_DETAILS.map((d, i) => (
          <Reveal key={d.title} delay={(i % 4) * 0.05} className={styles.detailCard}>
            <div className={styles.detailHead}>
              <span className={styles.detailIcon} aria-hidden="true">
                <i className={`pi ${d.icon}`} />
              </span>
              <h4 className={styles.detailTitle}>{d.title}</h4>
            </div>
            <ul className={styles.tagList}>
              {d.tags.map((t) => (
                <li key={t} className={styles.tag}>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// Section 6: business benefits
export function Benefits() {
  return (
    <section className={styles.section} aria-labelledby="benefits-title">
      <div className={styles.benefitBand}>
        <SectionHead id="benefits-title" eyebrow={BENEFITS_SECTION.eyebrow} title={BENEFITS_SECTION.title} />
        <div className={styles.benefitGrid}>
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06} className={styles.benefit}>
              <span className={`${styles.benefitIcon} ${styles[FEATURE_TONES[i]]}`} aria-hidden="true">
                <i className={`pi ${b.icon}`} />
              </span>
              <h3 className={styles.benefitTitle}>{b.title}</h3>
              <p className={styles.benefitText}>{b.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section 7: how it starts
export function Steps() {
  return (
    <section className={styles.section} aria-labelledby="steps-title">
      <SectionHead id="steps-title" eyebrow={STEPS_SECTION.eyebrow} title={STEPS_SECTION.title} />
      <ol className={styles.stepList}>
        {STEPS.map((s, i) => (
          <Reveal key={s.title} as="li" delay={i * 0.08} className={styles.step}>
            <span className={styles.stepNumber}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.stepIcon} aria-hidden="true">
              <i className={`pi ${s.icon}`} />
            </span>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p className={styles.stepText}>{s.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

// Section 8: final call to action
export function FinalCta() {
  const reduce = useReducedMotion();
  const scrollToDemo = useScrollToDemo();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const rotation = useMotionValue(-20);

  // the wheel idles round slowly while the band is visible
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(rotation, rotation.get() + 360, { duration: 26, ease: "linear", repeat: Infinity });
    return () => controls.stop();
  }, [inView, reduce, rotation]);

  return (
    <section className={styles.section} aria-labelledby="final-title">
      <Reveal>
        <div ref={ref} className={`${styles.finalBand} ${inView ? "" : styles.paused}`}>
          <span className={styles.heroGlowA} aria-hidden="true" />
          <span className={styles.heroGlowB} aria-hidden="true" />
          <div className={styles.finalArt} aria-hidden="true">
            <WheelArt slices={WHEEL_SLICES} rotation={rotation} className={styles.finalWheel} />
            <div className={styles.finalBox}>
              <BoxArt open />
            </div>
          </div>
          <div className={styles.finalCopy}>
            <h2 id="final-title" className={styles.finalTitle}>
              {FINAL_CTA.title}
            </h2>
            <p className={styles.finalSub}>{FINAL_CTA.sub}</p>
            <div className={styles.ctaRow}>
              <a className={styles.ctaPrimary} href={MINIGAMES_CONTACT_URL} target="_blank" rel="noopener noreferrer">
                {FINAL_CTA.primaryCta}
                <i className="pi pi-arrow-right" aria-hidden="true" />
                <span className={styles.srOnly}>(เปิดในแท็บใหม่)</span>
              </a>
              <button type="button" className={styles.ctaSecondary} onClick={scrollToDemo}>
                <i className="pi pi-play" aria-hidden="true" />
                {FINAL_CTA.secondaryCta}
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
