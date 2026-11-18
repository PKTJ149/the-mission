"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CARD_REWARDS } from "../_content";
import { Confetti } from "./art";
import styles from "./demos.module.css";
import { POP_SPRING } from "./motion-utils";

const REVEAL_OTHERS_MS = 900;

function shuffle<T>(list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Playable card flip: pick 1 of 6 → it flips in 3D, then the other cards reveal what they held.
export function DemoCards() {
  const reduce = useReducedMotion();
  const [rewards, setRewards] = useState(CARD_REWARDS);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealAll, setRevealAll] = useState(false);
  const [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function pick(index: number) {
    if (picked !== null) return;
    setPicked(index);
    setBurst((b) => b + 1);
    timer.current = setTimeout(() => setRevealAll(true), reduce ? 0 : REVEAL_OTHERS_MS);
  }

  function reset() {
    setPicked(null);
    setRevealAll(false);
    // shuffle after the cards have turned face down again
    timer.current = setTimeout(() => setRewards(shuffle(CARD_REWARDS)), reduce ? 0 : 350);
  }

  const status = picked === null ? "เลือก 1 ใบเพื่อเปิดรางวัล" : `ยินดีด้วย! ได้รับ ${rewards[picked]}`;
  // order in which the other cards flip, so they ripple out from the picked one
  const otherOrder = (i: number) => (picked === null ? 0 : Math.abs(i - picked));

  return (
    <div className={styles.game}>
      <div className={styles.cardGrid}>
        {rewards.map((reward, i) => {
          const isPicked = picked === i;
          const faceUp = isPicked || revealAll;
          const [value, ...unit] = reward.split(" ");
          return (
            <button
              key={i}
              type="button"
              className={`${styles.card} ${isPicked ? styles.cardPicked : ""} ${picked === null ? styles.cardPlayable : ""}`}
              onClick={() => pick(i)}
              disabled={picked !== null}
              aria-label={faceUp ? `ไพ่ใบที่ ${i + 1}: ${reward}` : `เปิดไพ่ใบที่ ${i + 1}`}
            >
              <motion.span
                className={styles.cardInner}
                initial={false}
                animate={reduce ? { rotateY: 0 } : { rotateY: faceUp ? 180 : 0 }}
                transition={{
                  ...POP_SPRING,
                  stiffness: 240,
                  damping: 22,
                  delay: faceUp && !isPicked ? 0.07 * otherOrder(i) : 0,
                }}
              >
                <span className={styles.cardBack} style={reduce ? { opacity: faceUp ? 0 : 1 } : undefined}>
                  <span className={styles.cardEmblem}>
                    <i className="pi pi-star-fill" aria-hidden="true" />
                  </span>
                </span>
                <span
                  className={`${styles.cardFace} ${isPicked ? styles.cardFaceWin : ""}`}
                  style={reduce ? { transform: "none", opacity: faceUp ? 1 : 0 } : undefined}
                >
                  {isPicked && <span className={styles.cardBadge}>รางวัลของคุณ</span>}
                  <span className={styles.cardValue}>{value}</span>
                  <span className={styles.cardUnit}>{unit.join(" ")}</span>
                </span>
              </motion.span>
            </button>
          );
        })}
      </div>

      <div className={styles.controls}>
        <p className={styles.status} aria-live="polite">
          {status}
        </p>
        {revealAll ? (
          <button type="button" className={styles.gameButton} onClick={reset}>
            <i className="pi pi-replay" aria-hidden="true" />
            สับไพ่แล้วเล่นอีกครั้ง
          </button>
        ) : (
          <span className={styles.buttonSpacer} aria-hidden="true" />
        )}
      </div>
      <Confetti burst={burst} pieces={26} />
    </div>
  );
}
