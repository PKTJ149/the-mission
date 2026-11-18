"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMounted } from "@/lib/use-mounted";
import { EASE_OUT } from "./banner-art";
import { BANNER_UI } from "./banners";
import { BannerCarousel } from "./banner-carousel";
import styles from "./banner.module.css";

const HIDE_KEY = "lsm.minigamesBannerPopup.hiddenOn";
const todayKey = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local day

function hiddenToday() {
  try {
    return window.localStorage.getItem(HIDE_KEY) === todayKey();
  } catch {
    return false;
  }
}

function hideForToday() {
  try {
    window.localStorage.setItem(HIDE_KEY, todayKey());
  } catch {
    // storage blocked: the popup just shows again next time
  }
}

// Popup with the 4 promo banners, shown every time the Minigames page opens unless the merchant
// ticked "ไม่แสดงอีกในวันนี้" today. `scrollTargetId`: where the banner CTA takes them.
export function MinigamesBannerPopup({ scrollTargetId }: { scrollTargetId: string }) {
  const mounted = useMounted();
  const [closed, setClosed] = useState(false);
  const [skipToday, setSkipToday] = useState(false);
  const reduce = useReducedMotion();
  const open = mounted && !closed && !hiddenToday();
  const returnFocus = useRef<Element | null>(null);

  const close = () => {
    if (skipToday) hideForToday();
    setClosed(true);
  };

  const goToDemos = () => {
    close();
    // after the exit animation
    window.setTimeout(() => {
      document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 180);
  };

  // Escape closes; lock page scroll while open; give focus back afterwards
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setClosed(true);
    };
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previousOverflow;
      (returnFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.16 } }}
          transition={{ duration: 0.22, ease: EASE_OUT }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={BANNER_UI.carouselLabel}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.16 } }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            <button type="button" className={styles.close} onClick={close} aria-label={BANNER_UI.close} autoFocus>
              <i className="pi pi-times" aria-hidden="true"></i>
            </button>
            <BannerCarousel
              onCta={goToDemos}
              footerStart={
                <label className={styles.skip}>
                  <input type="checkbox" checked={skipToday} onChange={(e) => setSkipToday(e.target.checked)} />
                  {BANNER_UI.skipToday}
                </label>
              }
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
