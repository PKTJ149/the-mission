"use client";

import { motion, useReducedMotion, type MotionValue } from "motion/react";
import { useId, type ReactNode } from "react";
import type { WheelSlice } from "../_content";
import styles from "./art.module.css";
import { EASE_OUT, seeded } from "./motion-utils";

// Game art shared by the hero showcase and the playable demos. Same look as the sidebar Minigames
// icon (components/shell/minigames-icon.tsx): gold-rim wheel with bulbs, purple mystery box.

const C = 100; // wheel centre in the 200 x 200 viewBox
const SLICE_R = 86;

function point(angleDeg: number, r: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180; // 0deg = top, clockwise
  return `${(C + r * Math.cos(a)).toFixed(2)} ${(C + r * Math.sin(a)).toFixed(2)}`;
}

function slicePath(index: number, count: number) {
  const step = 360 / count;
  return `M${C} ${C} L${point(index * step, SLICE_R)} A${SLICE_R} ${SLICE_R} 0 0 1 ${point((index + 1) * step, SLICE_R)} Z`;
}

const BULBS = Array.from({ length: 16 }, (_, i) => {
  const a = ((i * 22.5 - 90) * Math.PI) / 180;
  return { cx: +(C + 94.5 * Math.cos(a)).toFixed(2), cy: +(C + 94.5 * Math.sin(a)).toFixed(2), odd: i % 2 === 1 };
});

type WheelProps = {
  slices: WheelSlice[];
  rotation: MotionValue<number>;
  pointerRotate?: MotionValue<number>;
  winner?: number | null;
  // e.g. the spin button in the middle
  children?: ReactNode;
  className?: string;
};

export function WheelArt({ slices, rotation, pointerRotate, winner = null, children, className }: WheelProps) {
  const id = useId();
  const step = 360 / slices.length;

  return (
    <div className={`${styles.wheel} ${className ?? ""}`}>
      {/* rim */}
      <svg className={styles.layer} viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}rim`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF1B8" />
            <stop offset="0.45" stopColor="#F5B800" />
            <stop offset="1" stopColor="#9A6200" />
          </linearGradient>
        </defs>
        <circle cx={C} cy={C} r="99.5" fill={`url(#${id}rim)`} />
        <circle cx={C} cy={C} r="90" fill="#3A1D00" />
      </svg>

      {/* the turning disc */}
      <motion.div className={styles.layer} style={{ rotate: rotation }}>
        <svg viewBox="0 0 200 200" aria-hidden="true" className={styles.svgFill}>
          {slices.map((s, i) => (
            <path key={i} d={slicePath(i, slices.length)} fill={s.color} stroke="#fff" strokeWidth="1.2" />
          ))}
          {winner !== null && (
            <path className={styles.winnerGlow} d={slicePath(winner, slices.length)} fill="#fff" />
          )}
          {slices.map((s, i) => (
            <g key={i} transform={`rotate(${(i + 0.5) * step} ${C} ${C})`} className={styles.sliceLabel}>
              <text x={C} y={C - 58} textAnchor="middle" fill={s.ink} fontSize="17" fontWeight="700">
                {s.value}
              </text>
              <text x={C} y={C - 44} textAnchor="middle" fill={s.ink} fontSize="8.5" fontWeight="500">
                {s.unit}
              </text>
            </g>
          ))}
        </svg>
      </motion.div>

      {/* shading, gloss, bulbs and hub stay still */}
      <svg className={styles.layer} viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}shade`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.32" />
          </radialGradient>
          <radialGradient id={`${id}hub`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#FFFDF0" />
            <stop offset="1" stopColor="#E0A100" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r={SLICE_R} fill={`url(#${id}shade)`} />
        {BULBS.map((b) => (
          <circle
            key={`${b.cx}-${b.cy}`}
            className={b.odd ? `${styles.bulb} ${styles.bulbOdd}` : styles.bulb}
            cx={b.cx}
            cy={b.cy}
            r="3.1"
            fill="#FFF8DC"
          />
        ))}
        <circle cx={C} cy={C} r="18" fill={`url(#${id}hub)`} stroke="#9A6200" strokeWidth="2" />
      </svg>

      {/* pointer at the top */}
      <motion.div className={styles.pointer} style={{ rotate: pointerRotate }}>
        <svg viewBox="0 0 24 30" aria-hidden="true">
          <defs>
            <linearGradient id={`${id}ptr`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FF6B6B" />
              <stop offset="1" stopColor="#B3001B" />
            </linearGradient>
          </defs>
          <path d="M2 3 Q12 -1 22 3 L12 28 Z" fill={`url(#${id}ptr)`} stroke="#7A0010" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="12" cy="8" r="3" fill="#FFE4E4" opacity="0.8" />
        </svg>
      </motion.div>

      {children}
    </div>
  );
}

// 4-point sparkle centred on 0,0
const SPARK = "M0 -2.2 L0.6 -0.6 L2.2 0 L0.6 0.6 L0 2.2 L-0.6 0.6 L-2.2 0 L-0.6 -0.6 Z";

type BoxProps = {
  open: boolean;
  className?: string;
};

// Isometric mystery box. The lid is its own layer so it can pop off with an HTML transform.
export function BoxArt({ open, className }: BoxProps) {
  const id = useId();
  const reduce = useReducedMotion();

  return (
    <div className={`${styles.box} ${className ?? ""}`}>
      <svg className={styles.layer} viewBox="0 0 26 26" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#A874FF" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6D28D9" />
            <stop offset="1" stopColor="#4C1D95" />
          </linearGradient>
          <radialGradient id={`${id}g`} cx="0.5" cy="0.6" r="0.6">
            <stop offset="0" stopColor="#FFF6B0" />
            <stop offset="0.5" stopColor="#FFB300" stopOpacity="0.8" />
            <stop offset="1" stopColor="#FFB300" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M4 12 L13 16.5 L13 24.5 L4 20 Z" fill={`url(#${id}l)`} />
        <path d="M13 16.5 L22 12 L22 20 L13 24.5 Z" fill={`url(#${id}r)`} />
        <text x="8.5" y="16.3" transform="matrix(1 0.5 0 1 0 0)" textAnchor="middle" fontSize="7" fontWeight="700" fill="#FFE27A" stroke="#5B21B6" strokeWidth="0.3">
          ?
        </text>
        <text x="17.5" y="29.3" transform="matrix(1 -0.5 0 1 0 0)" textAnchor="middle" fontSize="7" fontWeight="700" fill="#FFE27A" stroke="#3B0F80" strokeWidth="0.3">
          ?
        </text>
        <path d="M4 12 L13 7.5 L22 12 L13 16.5 Z" fill="#2A0E66" />
        <motion.g initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ duration: 0.3 }}>
          <path d="M4 12 L13 7.5 L22 12 L13 16.5 Z" fill={`url(#${id}g)`} />
          <ellipse cx="13" cy="6.5" rx="9" ry="7" fill={`url(#${id}g)`} opacity="0.75" />
        </motion.g>
        {open && !reduce && (
          <g>
            {[
              { x: 6.5, y: 4, c: "#FFE27A", d: 0.05 },
              { x: 13, y: 1, c: "#fff", d: 0.12 },
              { x: 19.5, y: 4.2, c: "#FF9AD5", d: 0.2 },
            ].map((s) => (
              <motion.path
                key={s.x}
                d={SPARK}
                fill={s.c}
                initial={{ opacity: 0, scale: 0.3, x: s.x, y: s.y + 2 }}
                animate={{ opacity: [0, 1, 0], scale: [0.3, 1.1, 0.6], x: s.x, y: [s.y + 2, s.y - 2, s.y - 4] }}
                transition={{ duration: 1.1, delay: s.d, ease: EASE_OUT }}
              />
            ))}
          </g>
        )}
      </svg>

      <motion.div
        className={styles.lid}
        initial={false}
        animate={open ? { x: "-14%", y: "-30%", rotate: -24 } : { x: 0, y: 0, rotate: 0 }}
        transition={open && !reduce ? { type: "spring", stiffness: 420, damping: 16 } : { duration: reduce ? 0 : 0.3, ease: EASE_OUT }}
      >
        <svg className={styles.layer} viewBox="0 0 26 26" aria-hidden="true">
          <defs>
            <linearGradient id={`${id}lid`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#D6BCFF" />
              <stop offset="1" stopColor="#A774FF" />
            </linearGradient>
            <linearGradient id={`${id}gold`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFE27A" />
              <stop offset="1" stopColor="#E0A100" />
            </linearGradient>
          </defs>
          <path d="M3 10.2 L13 15.2 L13 17 L3 12 Z" fill="#8B5CF6" />
          <path d="M13 15.2 L23 10.2 L23 12 L13 17 Z" fill="#5B21B6" />
          <path d="M3 10.2 L13 5.2 L23 10.2 L13 15.2 Z" fill={`url(#${id}lid)`} />
          <path d="M7.2 12.3 L17.2 7.3 L18.8 8.1 L8.8 13.1 Z" fill={`url(#${id}gold)`} />
          <path d="M7.2 8.1 L8.8 7.3 L18.8 12.3 L17.2 13.1 Z" fill={`url(#${id}gold)`} />
          <path d="M7.2 12.3 L8.8 13.1 L8.8 14.9 L7.2 14.1 Z" fill="#E0A100" />
          <path d="M17.2 13.1 L18.8 12.3 L18.8 14.1 L17.2 14.9 Z" fill="#B88400" />
          <ellipse cx="11.6" cy="9.3" rx="1.8" ry="1.1" fill={`url(#${id}gold)`} transform="rotate(-25 11.6 9.3)" />
          <ellipse cx="14.4" cy="9.3" rx="1.8" ry="1.1" fill={`url(#${id}gold)`} transform="rotate(25 14.4 9.3)" />
          <circle cx="13" cy="9.8" r="0.8" fill="#FFF1B8" />
        </svg>
      </motion.div>
    </div>
  );
}

const CONFETTI_COLORS = ["#FFC93C", "#FF4D8D", "#8B5CF6", "#3BA3FF", "#19C3A6", "#FF7A2F", "#FFFFFF"];

// A one-shot confetti burst from the centre of its parent. Change `burst` to fire again.
// Hidden for reduced motion.
export function Confetti({ burst, pieces = 34, spread = 1 }: { burst: number; pieces?: number; spread?: number }) {
  const reduce = useReducedMotion();
  if (!burst || reduce) return null;

  return (
    <div className={styles.confetti} aria-hidden="true" key={burst}>
      {Array.from({ length: pieces }, (_, i) => {
        const r1 = seeded(burst * 97 + i);
        const r2 = seeded(burst * 131 + i * 7);
        const r3 = seeded(burst * 17 + i * 3);
        const angle = (i / pieces) * Math.PI * 2 + r1 * 0.5;
        const dist = (110 + r2 * 150) * spread;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist * 0.75 - 70 * spread;
        return (
          <motion.span
            key={i}
            className={i % 3 === 0 ? `${styles.piece} ${styles.pieceRound}` : styles.piece}
            style={{ background: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
            animate={{ x: dx, y: [0, dy, dy + 140], opacity: [1, 1, 0], rotate: (r3 - 0.5) * 720, scale: 1 }}
            transition={{
              x: { duration: 1.5, ease: EASE_OUT },
              y: { duration: 1.5, times: [0, 0.4, 1], ease: ["easeOut", "easeIn"] },
              opacity: { duration: 1.5, times: [0, 0.75, 1] },
              rotate: { duration: 1.5, ease: "linear" },
              scale: { duration: 0.3 },
            }}
          />
        );
      })}
    </div>
  );
}
