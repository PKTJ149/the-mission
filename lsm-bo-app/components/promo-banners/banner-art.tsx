"use client";

import { motion, type Easing, type TargetAndTransition, type Transition } from "motion/react";
import styles from "./banner.module.css";

// Shared art + motion helpers for the designed promo banners, in the style of PK's finished banner
// images: black-and-gold casino chips and cards, gold coins, black gift box with gold ribbon,
// glowing podium. Self-contained (not imported from app/minigames) so the Login page can reuse it.

// Strong ease-out (same curve as the promo page and the sidebar icon)
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// 4-point sparkle, 20 units across, centred on 0,0
export const SPARK = "M0 -10 L2.4 -2.4 L10 0 L2.4 2.4 L0 10 L-2.4 2.4 L-10 0 L-2.4 -2.4 Z";

type LoopTiming = { duration: number; times?: number[]; ease?: Easing | Easing[]; delay?: number };

// A looping keyframe animation that only runs while `play` is true. The first keyframe of every
// value is the "story" pose: shown while the banner is inactive and under reduced motion, and the
// loop starts and ends on it, so switching play on/off never jumps.
export function loop(play: boolean, frames: Record<string, number[]>, timing: LoopTiming) {
  const rest: Record<string, number> = {};
  for (const [key, values] of Object.entries(frames)) rest[key] = values[0];

  const transition: Transition = play
    ? { duration: timing.duration, times: timing.times, ease: timing.ease ?? "easeInOut", repeat: Infinity, delay: timing.delay ?? 0 }
    : { duration: 0.35, ease: EASE_OUT };

  return {
    initial: rest as TargetAndTransition,
    animate: (play ? frames : rest) as TargetAndTransition,
    transition,
  };
}

// Gradients every designed banner uses. Render once per <svg>, with that svg's own id prefix.
export function GoldDefs({ id }: { id: string }) {
  return (
    <>
      <linearGradient id={`${id}gold`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFF4C2" />
        <stop offset="0.38" stopColor="#F7C948" />
        <stop offset="0.62" stopColor="#C88A12" />
        <stop offset="1" stopColor="#FFE08A" />
      </linearGradient>
      <linearGradient id={`${id}goldH`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#B87A0A" />
        <stop offset="0.5" stopColor="#FFE9A0" />
        <stop offset="1" stopColor="#B87A0A" />
      </linearGradient>
      <linearGradient id={`${id}black`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2A2D3A" />
        <stop offset="1" stopColor="#06070C" />
      </linearGradient>
      <radialGradient id={`${id}coin`} cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#FFF6C8" />
        <stop offset="0.45" stopColor="#FFC93C" />
        <stop offset="1" stopColor="#B87400" />
      </radialGradient>
      <radialGradient id={`${id}glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFE9A0" stopOpacity="0.95" />
        <stop offset="0.45" stopColor="#FFC93C" stopOpacity="0.45" />
        <stop offset="1" stopColor="#FFC93C" stopOpacity="0" />
      </radialGradient>
    </>
  );
}

// Gold coin centred on 0,0, radius 16 (scale with a parent transform)
export function Coin({ id }: { id: string }) {
  return (
    <g>
      <circle cy="2.6" r="16" fill="#8A5300" />
      <circle r="16" fill={`url(#${id}coin)`} />
      <circle r="11.5" fill="none" stroke="#B87400" strokeOpacity="0.6" strokeWidth="1.6" />
      <path d="M0 -6.4 L1.9 -1.9 L6.4 -1.6 L3 1.4 L4 6 L0 3.6 L-4 6 L-3 1.4 L-6.4 -1.6 L-1.9 -1.9 Z" fill="#FFF3C4" stroke="#B87400" strokeWidth="0.8" strokeLinejoin="round" />
      <ellipse cx="-6" cy="-8" rx="5" ry="2.6" fill="#fff" opacity="0.55" transform="rotate(-35 -6 -8)" />
    </g>
  );
}

// Black-and-gold casino chip centred on 0,0, radius 30
export function Chip({ id }: { id: string }) {
  return (
    <g>
      <ellipse cy="6" rx="30" ry="30" fill="#5a3c00" />
      <circle r="30" fill={`url(#${id}black)`} />
      <circle r="25.5" fill="none" stroke={`url(#${id}gold)`} strokeWidth="9" strokeDasharray="10 10.03" />
      <circle r="17" fill="#0b0c14" stroke={`url(#${id}gold)`} strokeWidth="1.6" />
      <circle r="11" fill="none" stroke="#F7C948" strokeOpacity="0.35" strokeWidth="1" />
      <ellipse cx="-11" cy="-15" rx="10" ry="4" fill="#fff" opacity="0.18" transform="rotate(-30 -11 -15)" />
    </g>
  );
}

// Black playing card with a gold spade, centred on 0,0 (60 x 84)
export function PlayingCard({ id }: { id: string }) {
  return (
    <g>
      <rect x="-30" y="-42" width="60" height="84" rx="7" fill={`url(#${id}black)`} stroke={`url(#${id}gold)`} strokeWidth="1.6" />
      <rect x="-25" y="-37" width="50" height="74" rx="4" fill="none" stroke="#F7C948" strokeOpacity="0.35" strokeWidth="0.8" />
      <path d="M0 -14 C -5 -6 -15 -2 -15 6 C -15 12 -8 15 -3 11 L -6 20 L 6 20 L 3 11 C 8 15 15 12 15 6 C 15 -2 5 -6 0 -14 Z" fill={`url(#${id}gold)`} />
    </g>
  );
}

type GiftProps = { id: string; play?: boolean; opens?: boolean };

// Black gift box with a gold ribbon and bow, 100 x 100 box with its base at y = 100.
// With `opens`, the lid pops open on a loop (story pose: open, glowing).
export function GiftBox({ id, play = false, opens = false }: GiftProps) {
  const times = [0, 0.22, 0.3, 0.62, 0.68, 0.74, 0.8, 1];
  const lid = opens
    ? loop(play, { rotate: [-16, -16, 0, 0, 3, -3, -18, -16], y: [-20, -20, 0, 0, 0, 0, -24, -20], x: [-6, -6, 0, 0, 0, 0, -7, -6] }, { duration: 4.2, times })
    : null;
  const glow = opens ? loop(play, { opacity: [1, 1, 0, 0, 0, 0, 1, 1], scale: [1, 1, 0.6, 0.6, 0.6, 0.6, 1.15, 1] }, { duration: 4.2, times }) : null;

  return (
    <g>
      <ellipse cx="50" cy="101" rx="46" ry="6" fill="#000" opacity="0.45" />
      {opens && (
        <motion.g {...glow}>
          <ellipse cx="50" cy="30" rx="58" ry="46" fill={`url(#${id}glow)`} />
        </motion.g>
      )}
      {/* body */}
      <rect x="8" y="40" width="84" height="60" rx="4" fill={`url(#${id}black)`} />
      <rect x="44" y="40" width="12" height="60" fill={`url(#${id}goldH)`} />
      <rect x="8" y="40" width="84" height="60" rx="4" fill="none" stroke="#F7C948" strokeOpacity="0.4" strokeWidth="1" />
      {/* lid with bow */}
      <motion.g {...lid} style={{ originX: 0, originY: 1 }}>
        <rect x="3" y="26" width="94" height="17" rx="3" fill={`url(#${id}black)`} stroke="#F7C948" strokeOpacity="0.5" strokeWidth="1" />
        <rect x="44" y="26" width="12" height="17" fill={`url(#${id}goldH)`} />
        <path d="M50 26 C 36 4, 16 10, 26 22 C 31 27, 42 27, 50 26 Z" fill={`url(#${id}gold)`} stroke="#9A6200" strokeWidth="1" />
        <path d="M50 26 C 64 4, 84 10, 74 22 C 69 27, 58 27, 50 26 Z" fill={`url(#${id}gold)`} stroke="#9A6200" strokeWidth="1" />
        <ellipse cx="50" cy="25" rx="6" ry="5" fill="#FFE08A" stroke="#9A6200" strokeWidth="1" />
      </motion.g>
    </g>
  );
}

// A decorative sparkle at (x, y) that twinkles with CSS (paused while the banner is inactive)
export function Twinkle({ x, y, size = 1, color = "#FFE27A", delay = 0 }: { x: number; y: number; size?: number; color?: string; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path className={styles.twinkle} d={SPARK} fill={color} style={{ animationDelay: `${delay}s` }} />
    </g>
  );
}
