"use client";

import { animate, motion, useMotionValue, useReducedMotion, type PanInfo } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { EASE_OUT } from "./banner-art";
import { BANNER_UI, PROMO_BANNERS } from "./banners";
import { BannerSlide } from "./banner-slide";
import styles from "./banner.module.css";

type BannerCarouselProps = {
  onCta: () => void;
  // Auto-advance every few seconds (off under reduced motion)
  autoPlay?: boolean;
  intervalMs?: number;
  // Rendered under the slides, left column (the popup puts its checkbox there)
  footerStart?: React.ReactNode;
};

// Square banner slider: drag/swipe, arrows, dots, ← → keys, autoplay that pauses on hover, focus,
// drag and while the tab is hidden. Reused later by the Login page (autoPlay, no popup).
export function BannerCarousel({ onCta, autoPlay = true, intervalMs = 5000, footerStart }: BannerCarouselProps) {
  const total = PROMO_BANNERS.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const width = useRef(0);
  const dragged = useRef(false);
  const x = useMotionValue(0);

  const goTo = useCallback((next: number) => setIndex(((next % total) + total) % total), [total]);

  // Slide the track to the current banner (also after a drag that didn't change it)
  const snap = useCallback(
    (to: number) => {
      animate(x, -to * width.current, reduce ? { duration: 0 } : { duration: 0.45, ease: EASE_OUT });
    },
    [reduce, x],
  );

  useLayoutEffect(() => {
    const measure = () => {
      width.current = viewportRef.current?.offsetWidth ?? 0;
      x.set(-index * width.current);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [index, x]);

  useEffect(() => snap(index), [index, snap]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay || reduce || paused) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % total);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [autoPlay, reduce, paused, intervalMs, total]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = width.current * 0.18;
    if (info.offset.x < -threshold || info.velocity.x < -500) goTo(index + 1);
    else if (info.offset.x > threshold || info.velocity.x > 500) goTo(index - 1);
    else snap(index);
    window.setTimeout(() => (dragged.current = false), 0);
    setPaused(false);
  };

  // A drag that ends over a banner must not count as a click on its CTA
  const handleCta = () => {
    if (!dragged.current) onCta();
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={BANNER_UI.carouselLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(index + 1);
        if (e.key === "ArrowLeft") goTo(index - 1);
      }}
    >
      <div className={styles.viewport} ref={viewportRef}>
        <motion.div
          className={styles.track}
          style={{ x }}
          drag="x"
          dragElastic={0.12}
          dragMomentum={false}
          dragConstraints={viewportRef}
          onDragStart={() => {
            dragged.current = true;
            setPaused(true);
          }}
          onDragEnd={onDragEnd}
        >
          {PROMO_BANNERS.map((banner, i) => (
            <div
              key={banner.id}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={BANNER_UI.slideLabel(i + 1, total)}
              aria-hidden={i !== index}
            >
              <BannerSlide banner={banner} active={i === index} onCta={handleCta} />
            </div>
          ))}
        </motion.div>
        <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => goTo(index - 1)} aria-label={BANNER_UI.prev}>
          <i className="pi pi-chevron-left" aria-hidden="true"></i>
        </button>
        <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => goTo(index + 1)} aria-label={BANNER_UI.next}>
          <i className="pi pi-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
      <div className={styles.footer}>
        <div>{footerStart}</div>
        <div className={styles.dots}>
          {PROMO_BANNERS.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              className={`${styles.dot}${i === index ? ` ${styles.dotActive}` : ""}`}
              onClick={() => goTo(i)}
              aria-label={BANNER_UI.goTo(i + 1)}
              aria-current={i === index}
            />
          ))}
        </div>
        <div />
      </div>
    </div>
  );
}
