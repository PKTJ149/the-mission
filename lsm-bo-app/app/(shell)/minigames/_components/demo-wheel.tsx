"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform, type AnimationPlaybackControls } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { WHEEL_SLICES } from "../_content";
import { Confetti, WheelArt } from "./art";
import styles from "./demos.module.css";
import { EASE_WHEEL, POP_SPRING } from "./motion-utils";

const SLICE = 360 / WHEEL_SLICES.length;

// Playable lucky wheel: spin → decelerates onto a random slice → reward pop-up.
export function DemoWheel() {
  const reduce = useReducedMotion();
  const rotation = useMotionValue(0);
  // The pointer gets flicked each time a slice border passes under it
  const pointerRotate = useTransform(rotation, (r) => {
    const phase = (((r % SLICE) + SLICE) % SLICE) / SLICE;
    return phase < 0.22 ? -24 * (1 - phase / 0.22) : 0;
  });
  const [phase, setPhase] = useState<"idle" | "spinning" | "won">("idle");
  const [winner, setWinner] = useState<number | null>(null);
  const [burst, setBurst] = useState(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => () => controls.current?.stop(), []);

  async function spin() {
    if (phase === "spinning") return;
    const index = Math.floor(Math.random() * WHEEL_SLICES.length);
    setWinner(null);
    setPhase("spinning");

    // Turn the disc so the chosen slice's centre (plus a little jitter) ends under the pointer
    const centre = (index + 0.5) * SLICE;
    const jitter = (Math.random() - 0.5) * SLICE * 0.5;
    const current = rotation.get();
    const base = current - (((current % 360) + 360) % 360);
    const target = base + 360 * 6 + (360 - centre) + jitter;

    if (reduce) {
      rotation.set(target);
    } else {
      // a short wind-up, then several turns that slowly settle
      controls.current = animate(rotation, current - 14, { duration: 0.2, ease: [0.33, 0, 0.67, 1] });
      await controls.current;
      controls.current = animate(rotation, target, { duration: 4.6, ease: EASE_WHEEL });
      await controls.current;
    }
    setWinner(index);
    setPhase("won");
    setBurst((b) => b + 1);
  }

  const prize = winner !== null ? WHEEL_SLICES[winner] : null;
  const status =
    phase === "spinning" ? "กำลังหมุน..." : prize ? `ยินดีด้วย! ได้รับ ${prize.value} ${prize.unit}` : "กดหมุนเพื่อลุ้นรางวัล";

  return (
    <div className={styles.game}>
      <div className={styles.wheelArea}>
        <WheelArt slices={WHEEL_SLICES} rotation={rotation} pointerRotate={pointerRotate} winner={winner} className={styles.wheelSize}>
          {/* The hub is a shortcut for mouse users; the labelled button below is the accessible one */}
          <button type="button" className={styles.hubButton} onClick={spin} tabIndex={-1} aria-hidden="true" disabled={phase === "spinning"}>
            SPIN
          </button>
        </WheelArt>
      </div>

      <div className={styles.controls}>
        <p className={styles.status} aria-live="polite">
          {status}
        </p>
        <button type="button" className={styles.gameButton} onClick={spin} disabled={phase === "spinning"}>
          <i className="pi pi-refresh" aria-hidden="true" />
          {phase === "won" ? "หมุนอีกครั้ง" : "หมุนวงล้อ"}
        </button>
      </div>

      <AnimatePresence>
        {phase === "won" && prize && (
          <motion.div
            className={styles.popupBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setPhase("idle")}
          >
            <motion.div
              className={styles.popup}
              role="dialog"
              aria-label="ผลรางวัล"
              initial={{ opacity: 0, scale: 0.7, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
              transition={POP_SPRING}
              onClick={(e) => e.stopPropagation()}
            >
              <span className={styles.popupRays} aria-hidden="true" />
              <span className={styles.popupKicker}>ยินดีด้วย!</span>
              <span className={styles.popupPrize}>{prize.value}</span>
              <span className={styles.popupUnit}>{prize.unit}</span>
              <div className={styles.popupActions}>
                <button type="button" className={styles.gameButton} onClick={spin}>
                  หมุนอีกครั้ง
                </button>
                <button type="button" className={styles.ghostButton} onClick={() => setPhase("idle")}>
                  ปิด
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Confetti burst={burst} />
    </div>
  );
}
