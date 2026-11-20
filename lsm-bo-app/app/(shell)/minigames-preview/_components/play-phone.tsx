"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import styles from "./play-phone.module.css";

// The player screens are PK's real game designs (Figma exports in sale-video/assets/games),
// cropped to 1075 x 2180 px so the browser URL bar at the bottom is cut. Every position below
// is in those source pixels and turned into % of the screen, so it scales with the phone.
const SRC_W = 1075;
const SRC_H = 2180;
const pctX = (v: number) => `${(v / SRC_W) * 100}%`;
const pctY = (v: number) => `${(v / SRC_H) * 100}%`;
const IMG = (name: string) => `/minigames-preview/play/${name}.webp`;

type Box = { cx: number; cy: number; w: number; h: number };

// ---------- "Pick one" games (box, cards): grid → pick → result ----------

type PickConfig = {
  kind: "pick";
  asset: "boxes" | "cards";
  cols: number[]; // tile centre x
  rows: number[]; // tile centre y
  tile: { w: number; h: number };
  pickAt: { cx: number; cy: number; scale: number }; // where the picked item sits on the pick screen
  confirm: Box; // "ยืนยันรับของรางวัล" button on the result screen
};

export const PICK_GAMES: Record<"box" | "cards", PickConfig> = {
  box: {
    kind: "pick",
    asset: "boxes",
    cols: [250, 546, 840],
    rows: [743, 1007, 1275],
    tile: { w: 210, h: 210 },
    pickAt: { cx: 538, cy: 626, scale: 2.2 },
    confirm: { cx: 538, cy: 1570, w: 420, h: 90 },
  },
  cards: {
    kind: "pick",
    asset: "cards",
    cols: [225, 540, 853],
    rows: [720, 1030, 1340],
    tile: { w: 250, h: 270 },
    pickAt: { cx: 450, cy: 625, scale: 1.9 },
    confirm: { cx: 538, cy: 1460, w: 420, h: 90 },
  },
};

type PickPhase = "grid" | "shake" | "pick" | "result";

export function PickGame({ config }: { config: PickConfig }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<PickPhase>("grid");
  const [picked, setPicked] = useState<{ cx: number; cy: number } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function later(ms: number, fn: () => void) {
    timers.current.push(setTimeout(fn, reduce ? 0 : ms));
  }

  function pick(cx: number, cy: number) {
    if (phase !== "grid") return;
    setPicked({ cx, cy });
    setPhase("shake");
    later(750, () => setPhase("pick"));
    later(2300, () => setPhase("result"));
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    setPhase("grid");
    setPicked(null);
  }

  const { tile, pickAt, asset } = config;
  // How far the lifted tile travels to reach the pick spot, in % of its own size
  const fly = picked
    ? { x: `${((pickAt.cx - picked.cx) / tile.w) * 100}%`, y: `${((pickAt.cy - picked.cy) / tile.h) * 100}%` }
    : { x: "0%", y: "0%" };

  return (
    <div className={styles.layers}>
      {/* Screen 1: the grid */}
      <motion.img
        src={IMG(`${asset}-grid`)}
        alt=""
        className={styles.layer}
        animate={{ opacity: phase === "grid" || phase === "shake" ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />

      {/* Tap targets on every tile */}
      {phase === "grid" &&
        config.rows.flatMap((cy) =>
          config.cols.map((cx) => (
            <button
              key={`${cx}-${cy}`}
              type="button"
              aria-label="เลือกชิ้นนี้"
              className={styles.hit}
              style={hitStyle({ cx, cy, w: tile.w, h: tile.h })}
              onClick={() => pick(cx, cy)}
            />
          )),
        )}

      {/* Screen 2: the pick, fading in under the flying tile */}
      <AnimatePresence>
        {(phase === "pick" || phase === "result") && (
          <motion.img
            key="pick"
            src={IMG(`${asset}-pick`)}
            alt=""
            className={styles.layer}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Light burst when the item opens */}
      <AnimatePresence>
        {phase === "pick" && (
          <motion.span
            key="burst"
            className={styles.burst}
            style={{ left: pctX(pickAt.cx), top: pctY(pickAt.cy) }}
            initial={{ opacity: 0.95, scale: 0.2 }}
            animate={{ opacity: 0, scale: 2.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* The picked tile: a copy cut from the grid screen. It shakes in place, then flies up and grows. */}
      {picked && (phase === "shake" || phase === "pick") && (
        <motion.div
          className={styles.tile}
          style={tileStyle(picked, tile)}
          initial={{ rotate: 0, scale: 1, x: "0%", y: "0%", opacity: 1 }}
          animate={
            phase === "shake"
              ? { rotate: [0, -9, 9, -7, 7, -4, 4, 0], scale: [1, 1.08, 1.08, 1.1, 1.1, 1.12, 1.12, 1.12] }
              : { ...fly, scale: pickAt.scale, opacity: 0, rotate: 0 }
          }
          transition={phase === "shake" ? { duration: 0.7, ease: "easeInOut" } : { duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMG(`${asset}-grid`)}
            alt=""
            style={{
              position: "absolute",
              width: `${(SRC_W / tile.w) * 100}%`,
              left: `${(-(picked.cx - tile.w / 2) / tile.w) * 100}%`,
              top: `${(-(picked.cy - tile.h / 2) / tile.h) * 100}%`,
            }}
          />
        </motion.div>
      )}

      {/* Screen 3: the result, with a white flash */}
      <AnimatePresence>
        {phase === "result" && (
          <motion.div key="result" className={styles.layer} initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.img
              src={IMG(`${asset}-result`)}
              alt=""
              className={styles.layer}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
            <motion.span
              className={styles.flash}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
            <button
              type="button"
              className={`${styles.hit} ${styles.pulse}`}
              style={hitStyle(config.confirm)}
              onClick={reset}
              aria-label="ยืนยันรับของรางวัล แล้วเล่นอีกครั้ง"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "grid" && <Hint text="แตะเลือก 1 ชิ้น" />}
    </div>
  );
}

// ---------- Lucky wheel: "ป่าพิศวงนำโชค" ----------
// Design: Figma file MINIGAMES (bZ4tyDED96uqei0wPGT4Hg), section node 10051:20094 (PK, 20-11-2026).
// Layers exported from Figma: the screen with the wheel taken out, the wheel disc (turns),
// the "Spin Here" hub (stays still) and the Congratulations pop-up.

// Slices clockwise from the top, in เครดิต
const WHEEL_PRIZES = [1500, 10, 300, 100, 1000, 5, 500, 50];
const SLICE = 360 / WHEEL_PRIZES.length;
// The Figma pop-up always reads "เครดิตฟรี ฿ 100.00", so the demo always lands on the 100 slice
const WIN_INDEX = WHEEL_PRIZES.indexOf(100);
// Positions in source px (found by matching each Figma layer against the full-screen export)
const DISC: Box = { cx: 534, cy: 1015, w: 930, h: 930 };
const HUB: Box = { cx: 535.5, cy: 1013.5, w: 335, h: 345 };
const WIN_POPUP: Box = { cx: 537.5, cy: 843, w: 1075, h: 710 };
const WIN_BUTTON: Box = { cx: 536, cy: 1107.5, w: 407, h: 80 };

export function WheelGame() {
  const reduce = useReducedMotion();
  const rotation = useMotionValue(0);
  const [phase, setPhase] = useState<"idle" | "spinning" | "won">("idle");
  const stop = useRef<() => void>(() => {});

  useEffect(() => () => stop.current(), []);

  async function spin() {
    if (phase !== "idle") return;
    setPhase("spinning");
    // The slice at the top wins: turn so slice WIN_INDEX (at WIN_INDEX * SLICE degrees) reaches 0
    const current = rotation.get();
    const settle = (((-WIN_INDEX * SLICE - current) % 360) + 360) % 360;
    const jitter = (Math.random() - 0.5) * SLICE * 0.4;
    const target = current + 360 * 6 + settle + jitter;
    if (reduce) {
      rotation.set(target);
    } else {
      const windUp = animate(rotation, current - 12, { duration: 0.22, ease: "easeOut" });
      stop.current = () => windUp.stop();
      await windUp;
      const turn = animate(rotation, target, { duration: 5, ease: [0.12, 0.65, 0.1, 1] });
      stop.current = () => turn.stop();
      await turn;
    }
    setPhase("won");
  }

  return (
    <div className={styles.layers}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={IMG("forest-screen")} alt="" className={styles.layer} />

      {/* Green glow behind the wheel while it spins */}
      <motion.span
        className={styles.wheelGlow}
        style={hitStyle({ ...DISC, w: DISC.w * 0.86, h: DISC.h * 0.86 })}
        animate={{ opacity: phase === "spinning" ? [0.35, 0.85, 0.35] : 0 }}
        transition={phase === "spinning" ? { duration: 0.8, repeat: Infinity } : { duration: 0.3 }}
      />

      <motion.img src={IMG("forest-disc")} alt="" className={styles.part} style={{ ...hitStyle(DISC), rotate: rotation }} />

      {/* The "Spin Here" hub stays still while the slices turn */}
      <motion.button
        type="button"
        className={styles.hub}
        style={hitStyle(HUB)}
        onClick={spin}
        disabled={phase !== "idle"}
        aria-label="หมุนวงล้อ"
        animate={phase === "idle" ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={phase === "idle" ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG("forest-hub")} alt="" />
      </motion.button>

      {phase === "idle" && <Hint text="แตะ Spin Here เพื่อหมุน" />}

      {/* Congratulations pop-up from Figma, over a dimmed, blurred screen */}
      <AnimatePresence>
        {phase === "won" && (
          <motion.div
            key="won"
            className={styles.winBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className={styles.part}
              style={hitStyle(WIN_POPUP)}
              role="status"
              aria-label="ยินดีด้วย คุณได้รับรางวัล เครดิตฟรี 100 บาท"
              initial={{ scale: 0.55, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 17, delay: 0.1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG("forest-win")} alt="" className={styles.layer} />
            </motion.div>
            <button
              type="button"
              className={`${styles.hit} ${styles.pulse}`}
              style={hitStyle(WIN_BUTTON)}
              onClick={() => setPhase("idle")}
              aria-label="ยืนยันรับของรางวัล"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Shared bits ----------

function Hint({ text }: { text: string }) {
  return (
    <motion.span
      className={styles.hint}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: [0, -4, 0] }}
      transition={{ opacity: { duration: 0.3, delay: 0.4 }, y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }}
    >
      👆 {text}
    </motion.span>
  );
}

function hitStyle({ cx, cy, w, h }: Box) {
  return { left: pctX(cx - w / 2), top: pctY(cy - h / 2), width: pctX(w), height: pctY(h) };
}

function tileStyle(at: { cx: number; cy: number }, tile: { w: number; h: number }) {
  return hitStyle({ cx: at.cx, cy: at.cy, w: tile.w, h: tile.h });
}
