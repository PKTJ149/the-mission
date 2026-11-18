"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { Coin, GiftBox, GoldDefs, loop, Twinkle } from "./banner-art";
import type { DesignedScene } from "./banners";
import { SCENE_TEXT } from "./banners";
import styles from "./banner.module.css";

type SceneProps = { play: boolean };

// Deposit mission: a mission card whose progress bar fills (3 checkpoints), then the reward gift
// box pops open with coins. Story pose (inactive / reduced motion): full bar, box open.
function SceneMission({ play }: SceneProps) {
  const id = useId();
  const t = SCENE_TEXT.mission;
  const TRACK_X = 52;
  const TRACK_W = 218;
  // 0–.2 hold the finished state, .26 reset, .3–.66 fill, .74 the box opens (GiftBox uses the same 4.2 s clock)
  const times = [0, 0.2, 0.26, 0.3, 0.66, 1];

  return (
    <svg className={styles.sceneSvg} viewBox="0 0 520 220" aria-hidden="true">
      <defs>
        <GoldDefs id={id} />
        <linearGradient id={`${id}card`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1240" stopOpacity="0.95" />
          <stop offset="1" stopColor="#12061f" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* mission card */}
      <motion.g {...loop(play, { y: [0, -5, 0] }, { duration: 3.6 })}>
        <rect x="28" y="34" width="268" height="160" rx="18" fill={`url(#${id}card)`} stroke={`url(#${id}gold)`} strokeWidth="1.6" />
        <circle cx="66" cy="76" r="20" fill={`url(#${id}gold)`} />
        <text x="66" y="83" textAnchor="middle" fontSize="20" fontWeight="700" fill="#2a1240">
          ฿
        </text>
        <text x="98" y="72" fontSize="18" fontWeight="600" fill="#fff">
          {t.title}
        </text>
        <text x="98" y="94" fontSize="13" fill="#fff" fillOpacity="0.68">
          {t.sub}
        </text>

        <rect x={TRACK_X} y="128" width={TRACK_W} height="12" rx="6" fill="#3a2352" />
        <motion.g {...loop(play, { scaleX: [1, 1, 0, 0, 1, 1] }, { duration: 4.2, times })} style={{ originX: 0 }}>
          <rect x={TRACK_X} y="128" width={TRACK_W} height="12" rx="6" fill={`url(#${id}goldH)`} />
        </motion.g>

        {t.steps.map((label, i) => {
          const f = (i + 1) / t.steps.length;
          const cx = TRACK_X + TRACK_W * f - (i === t.steps.length - 1 ? 2 : 0);
          const on = 0.3 + 0.36 * f;
          return (
            <g key={label}>
              <circle cx={cx} cy="134" r="12" fill="#2a1240" stroke="#3a2352" strokeWidth="3" />
              <motion.g
                {...loop(play, { opacity: [1, 1, 0, 0, 0, 1, 1], scale: [1, 1, 1, 0.4, 0.4, 1, 1] }, { duration: 4.2, times: [0, 0.2, 0.26, 0.3, on - 0.01, on + 0.03, 1] })}
              >
                <circle cx={cx} cy="134" r="12" fill={`url(#${id}gold)`} />
                <path d={`M${cx - 5} 134 l3.6 3.6 l6.6 -7`} fill="none" stroke="#2a1240" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </motion.g>
              <text x={cx} y="168" textAnchor="middle" fontSize="11.5" fill="#fff" fillOpacity="0.6">
                {label}
              </text>
            </g>
          );
        })}
      </motion.g>

      {/* reward: gift box that pops open, coins jump out */}
      <g transform="translate(340 82) scale(1.25)">
        <GiftBox id={id} play={play} opens />
        {[
          { x: 22, y: 8, d: 0 },
          { x: 50, y: -6, d: 0.02 },
          { x: 78, y: 8, d: 0.04 },
        ].map((c) => (
          <motion.g
            key={c.x}
            {...loop(
              play,
              { opacity: [1, 1, 0, 0, 1, 1], y: [c.y, c.y, 34, 34, c.y - 10, c.y] },
              { duration: 4.2, times: [0, 0.22, 0.3, 0.8 + c.d, 0.88 + c.d, 1] },
            )}
          >
            <g transform={`translate(${c.x} 0) scale(0.6)`}>
              <Coin id={id} />
            </g>
          </motion.g>
        ))}
      </g>

      <Twinkle x={330} y={60} size={0.8} delay={0.3} />
      <Twinkle x={500} y={96} size={0.6} color="#fff" delay={1.1} />
      <Twinkle x={312} y={196} size={0.5} delay={1.8} />
    </svg>
  );
}

export const SCENES: Record<DesignedScene, (props: SceneProps) => React.JSX.Element> = {
  mission: SceneMission,
};
