"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import phone from "./play-phone.module.css";
import styles from "./lucky-cards.module.css";

// "เปิดไพ่ลุ้นล้าน" (Lucky Cards) from PK's Figma file kHa9WnKLn6dOYLMnRiJ4Cv, section 19:21913:
//   frame 1 (19:20714) grid of cards -> tap one
//   frame 2 (19:21163) portal: Figma's own 6.5 s keyframe timeline, played once
//   frame 3 (19:21297) reward, shown only after frame 2 has finished
// Everything is laid out in Figma px on a 430 x 872 stage (frame cut at the same height as the
// other demos) and the stage is scaled to the phone.

const plex = IBM_Plex_Sans_Thai({ subsets: ["thai", "latin"], weight: ["700"] });

const STAGE_W = 430;
const IMG = (name: string) => `/minigames-preview/play/${name}.webp`;

// Card stacks on frame 1 (19:21222 / 19:21232 / 19:21242): row origin + 3 columns, 81.73 x 91 each
const ROWS = [
  { left: 60, top: 267 },
  { left: 59, top: 379 },
  { left: 50, top: 503 },
];
const COLS = [0, 118.73, 237.47];
const TILE = { w: 81.73, h: 91 };

// Frame 2 timeline, copied from Figma's motion data (get_motion_context, cohort 19:21163)
const DIM_IN = 0.3; // the dark overlay fades in first, then the timeline starts
const PORTAL_S = 6.5;
const RING_Y = [4.637, 0, -2.65, 1.325, 0, -140.432, -140.432];
const RING_Y_TIMES = [0, 0.3231, 0.4308, 0.5308, 0.6154, 0.9385, 1];
const RING_SX = [0.96, 1, 1.035, 0.99, 1, 1];
const RING_SX_TIMES = [0, 0.3231, 0.4231, 0.5154, 0.6154, 1];
const RING_OP = [0, 0.02, 1, 0.75, 1, 0.78, 1, 0.9, 1, 1, 0, 0];
const RING_OP_TIMES = [0, 0.0615, 0.3231, 0.3923, 0.4538, 0.5077, 0.5692, 0.6154, 0.8615, 0.9385, 0.9723, 1];
const CROP_TIMES = [0, 0.6154, 0.9385, 1];

const timed = (times: number[], ease: Transition["ease"] = "easeInOut"): Transition => ({
  duration: PORTAL_S,
  delay: DIM_IN,
  times,
  ease,
});

type Phase = "grid" | "pick" | "portal" | "reward";

export function LuckyCardsGame() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("grid");
  const [picked, setPicked] = useState<number | null>(null);
  const { ref, scale } = useStageScale();

  // Frame 3 waits for frame 2's whole timeline (overlay fade + 6.5 s)
  useEffect(() => {
    if (phase === "pick") {
      const t = window.setTimeout(() => setPhase("portal"), 380);
      return () => window.clearTimeout(t);
    }
    if (phase === "portal") {
      const ms = reduce ? 400 : (DIM_IN + PORTAL_S) * 1000;
      const t = window.setTimeout(() => setPhase("reward"), ms);
      return () => window.clearTimeout(t);
    }
  }, [phase, reduce]);

  const reset = () => {
    setPicked(null);
    setPhase("grid");
  };

  return (
    <div ref={ref} className={phone.layers}>
      <div className={`${styles.stage} ${plex.className}`} style={{ transform: `scale(${scale})` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG("lucky-grid")} alt="" className={styles.full} />

        {(phase === "grid" || phase === "pick") &&
          ROWS.flatMap((row, r) =>
            COLS.map((dx, c) => {
              const i = r * 3 + c;
              return (
                <button
                  key={i}
                  type="button"
                  className={styles.tile}
                  style={{ left: row.left + dx, top: row.top, width: TILE.w, height: TILE.h }}
                  onClick={() => {
                    if (phase !== "grid") return;
                    setPicked(i);
                    setPhase("pick");
                  }}
                  aria-label={`เลือกไพ่ใบที่ ${i + 1}`}
                >
                  {picked === i && (
                    <motion.span
                      className={styles.pickGlow}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: [0, 1, 1], scale: [0.9, 1.12, 1.06] }}
                      transition={{ duration: 0.35 }}
                    />
                  )}
                </button>
              );
            }),
          )}

        <AnimatePresence>
          {(phase === "portal" || phase === "reward") && (
            <motion.img
              key="dim"
              src={IMG("lucky-dim")}
              alt=""
              className={styles.full}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DIM_IN }}
            />
          )}
        </AnimatePresence>

        {phase === "portal" && !reduce && <Portal />}
        {phase === "reward" && <Reward onConfirm={reset} />}
      </div>

      {phase === "grid" && <span className={phone.hint}>แตะเลือกไพ่ 1 ใบ</span>}
    </div>
  );
}

// Frame 2: the two rings flicker in, the card fades in and spins 4 turns, then gets "teleported"
// (cropped away) while the rings rise and fade. Positions and keyframes are Figma's.
function Portal() {
  return (
    <div className={styles.portal} aria-hidden>
      {/* top ring (19:19261) is the same image flipped upside down */}
      <div className={styles.ringTop}>
        <motion.img
          src={IMG("lucky-ring")}
          alt=""
          className={styles.ringImg}
          initial={{ opacity: 0, scaleX: 0.96, y: -4.637 }}
          animate={{
            opacity: RING_OP,
            scaleX: RING_SX,
            // inside the flipped wrapper, so the sign is reversed: on screen it rises like the bottom one
            y: RING_Y.map((v) => -v),
          }}
          transition={{ opacity: timed(RING_OP_TIMES), scaleX: timed(RING_SX_TIMES), y: timed(RING_Y_TIMES) }}
        />
      </div>

      {/* card (19:19246) inside the "teleport compression" crop frame (21:18409) */}
      <motion.div
        className={styles.cardCrop}
        initial={{ height: 2120, y: 0 }}
        animate={{ height: [2120, 2120, 0.01, 0.01], y: [0, 0, 140.432, 140.432] }}
        transition={timed(CROP_TIMES)}
      >
        <div className={styles.cardSlot}>
          <div className={styles.cardSkew}>
            <motion.div
              className={styles.cardBack}
              style={{ transformOrigin: "0 0" }}
              // Figma: undo the slot's skew, move, re-apply the skew, then spin around the centre
              transformTemplate={({ y, rotateY }) =>
                `matrix(1.034945, 0.266667, 0, 1, 0, 0) translateY(${unit(y, "px")}) matrix(0.966235, -0.257663, 0, 1, 0, 0) translate(50%, 50%) rotateY(${unit(rotateY, "deg")}) translate(-50%, -50%)`
              }
              initial={{ opacity: 0, rotateY: 0, y: 0 }}
              animate={{
                opacity: [0, 0, 1, 1, 0, 0],
                rotateY: [0, 0, 360, 720, 1080, 1440, 1440],
                y: [0, 0, -140.432, -140.432],
              }}
              transition={{
                opacity: timed([0, 0.1385, 0.3231, 0.9369, 0.9385, 1]),
                rotateY: timed([0, 0.3231, 0.4, 0.4769, 0.5538, 0.6154, 1], ["linear", "linear", "linear", "linear", "easeOut", "linear"]),
                y: timed(CROP_TIMES),
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG("lucky-card-back")} alt="" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* bottom ring (19:19260) */}
      <motion.img
        src={IMG("lucky-ring")}
        alt=""
        className={`${styles.ringImg} ${styles.ringBottom}`}
        initial={{ opacity: 0, scaleX: 0.96, y: 4.637 }}
        animate={{ opacity: RING_OP, scaleX: RING_SX, y: RING_Y }}
        transition={{ opacity: timed(RING_OP_TIMES), scaleX: timed(RING_SX_TIMES), y: timed(RING_Y_TIMES) }}
      />
    </div>
  );
}

// Frame 3: the card flips over to its front on the portal, then the reward and the confirm button.
// The prize list is hidden (PK, 20-11-2026): only the credit, matching the card.
function Reward({ onConfirm }: { onConfirm: () => void }) {
  return (
    <>
      <div className={styles.rewardGroup}>
        <motion.div
          className={styles.rewardRing}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG("lucky-ring")} alt="" />
        </motion.div>

        <div className={styles.flipScene}>
          <motion.div
            className={styles.flipCard}
            initial={{ rotateY: 180, y: 70, scale: 0.75, opacity: 0 }}
            animate={{ rotateY: 0, y: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], opacity: { duration: 0.2 } }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG("lucky-card-front")} alt="Credit Free ฿100.00" className={styles.face} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG("lucky-card-back")} alt="" className={`${styles.face} ${styles.faceBack}`} />
          </motion.div>
        </div>
      </div>

      <motion.p
        className={styles.rewardTitle}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.3 }}
      >
        รางวัลที่คุณได้รับ
      </motion.p>

      <motion.div
        className={styles.rewardBand}
        initial={{ opacity: 0, scaleX: 0.6 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1.05, duration: 0.35 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/minigames-preview/play/lucky-coin.png" alt="" className={styles.coin} />
        <span>+100 ฿</span>
      </motion.div>

      <motion.button
        type="button"
        className={styles.confirm}
        onClick={onConfirm}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.25, duration: 0.3 }}
      >
        ยืนยันรับของรางวัล
      </motion.button>
    </>
  );
}

// motion hands transformTemplate either numbers or strings with units
function unit(value: unknown, u: string) {
  if (value === undefined) return `0${u}`;
  return typeof value === "number" ? `${value}${u}` : String(value);
}

// Scale the 430 px Figma stage to whatever width the phone frame has
function useStageScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / STAGE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, scale };
}
