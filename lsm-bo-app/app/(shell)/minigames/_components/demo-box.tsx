"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BOX_REWARDS } from "../_content";
import { BoxArt, Confetti } from "./art";
import styles from "./demos.module.css";
import { EASE_OUT, POP_SPRING } from "./motion-utils";

const BOXES = [0, 1, 2];
const SHAKE_MS = 750;

// Called from the click handler only
const randomReward = () => BOX_REWARDS[Math.floor(Math.random() * BOX_REWARDS.length)];

// Playable mystery box: pick 1 of 3 → it shakes, the lid pops, the reward rises out.
export function DemoBox() {
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "shaking" | "open">("idle");
  const [reward, setReward] = useState("");
  const [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function pick(index: number) {
    if (phase !== "idle") return;
    setPicked(index);
    setReward(randomReward());
    const reveal = () => {
      setPhase("open");
      setBurst((b) => b + 1);
    };
    if (reduce) {
      reveal();
    } else {
      setPhase("shaking");
      timer.current = setTimeout(reveal, SHAKE_MS);
    }
  }

  function reset() {
    setPicked(null);
    setPhase("idle");
  }

  const status =
    phase === "idle" ? "เลือก 1 กล่องเพื่อเปิดรางวัล" : phase === "shaking" ? "กำลังเปิดกล่อง..." : `ยินดีด้วย! ได้รับ ${reward}`;

  return (
    <div className={styles.game}>
      <div className={styles.boxRow}>
        {BOXES.map((i) => {
          const isPicked = picked === i;
          const dimmed = picked !== null && !isPicked;
          return (
            <motion.div
              key={i}
              className={styles.boxSlot}
              // not initial={false}: that would also stop the reward chip inside from animating in
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: dimmed ? 0.4 : 1, scale: dimmed ? 0.9 : isPicked && phase === "open" ? 1.06 : 1 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              <button
                type="button"
                className={`${styles.boxButton} ${phase === "idle" ? styles.boxIdle : ""}`}
                style={{ animationDelay: `${i * -0.6}s` }}
                onClick={() => pick(i)}
                disabled={phase !== "idle"}
                aria-label={`เลือกกล่องที่ ${i + 1}`}
              >
                <motion.span
                  className={styles.boxShake}
                  // not initial={false}: that would also stop the lid sparkles inside from animating in
                  initial={{ rotate: 0, y: 0 }}
                  animate={
                    isPicked && phase === "shaking"
                      ? { rotate: [0, -8, 8, -7, 7, -4, 4, 0], y: [0, -3, 0, -3, 0, -2, 0, 0] }
                      : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: SHAKE_MS / 1000, ease: "easeInOut" }}
                >
                  <BoxArt open={isPicked && phase === "open"} />
                </motion.span>
              </button>

              <AnimatePresence>
                {isPicked && phase === "open" && (
                  <motion.span
                    className={styles.rewardChip}
                    initial={{ opacity: 0, y: 40, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ ...POP_SPRING, delay: reduce ? 0 : 0.12 }}
                  >
                    {reward}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className={styles.controls}>
        <p className={styles.status} aria-live="polite">
          {status}
        </p>
        {phase === "open" ? (
          <button type="button" className={styles.gameButton} onClick={reset}>
            <i className="pi pi-replay" aria-hidden="true" />
            เล่นอีกครั้ง
          </button>
        ) : (
          <span className={styles.buttonSpacer} aria-hidden="true" />
        )}
      </div>
      <Confetti burst={burst} />
    </div>
  );
}
