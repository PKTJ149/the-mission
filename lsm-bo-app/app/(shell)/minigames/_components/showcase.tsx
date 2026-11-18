"use client";

import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HERO_CHIPS, WHEEL_SLICES } from "../_content";
import { BoxArt, WheelArt } from "./art";
import { EASE_OUT, EASE_WHEEL, POP_SPRING } from "./motion-utils";
import styles from "./showcase.module.css";

// Hero right side: a phone that auto-plays wheel spin → box open → card flip → mission complete,
// with floating reward chips around it. Pauses while off-screen.

const SCENE_MS = 4200;

const SCENES = [
  { key: "wheel", label: "วงล้อนำโชค" },
  { key: "box", label: "กล่องสุ่ม" },
  { key: "cards", label: "เปิดไพ่" },
  { key: "missions", label: "ภารกิจ" },
] as const;

// Runs `fn` after `ms` (immediately for reduced motion); cleared on unmount
function useLater(ms: number, fn: () => void, reduce: boolean | null) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });
  useEffect(() => {
    const t = setTimeout(() => fnRef.current(), reduce ? 0 : ms);
    return () => clearTimeout(t);
  }, [ms, reduce]);
}

function RewardPop({ show, children, tone = "gold" }: { show: boolean; children: string; tone?: "gold" | "pink" }) {
  return (
    <div className={styles.popSlot}>
      <AnimatePresence>
        {show && (
          <motion.span
            className={`${styles.pop} ${tone === "pink" ? styles.popPink : ""}`}
            initial={{ opacity: 0, y: 14, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={POP_SPRING}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function SceneWheel({ reduce }: { reduce: boolean | null }) {
  const rotation = useMotionValue(0);
  const [won, setWon] = useState(false);
  // land on slice 1 ("+1 สิทธิ์หมุน")
  const target = 360 * 4 + (360 - 1.5 * (360 / WHEEL_SLICES.length));

  useEffect(() => {
    if (reduce) {
      rotation.set(target);
      return;
    }
    const controls = animate(rotation, target, { duration: 2.6, ease: EASE_WHEEL, delay: 0.25 });
    return () => controls.stop();
  }, [reduce, rotation, target]);
  useLater(2900, () => setWon(true), reduce);

  return (
    <div className={styles.scene}>
      <WheelArt slices={WHEEL_SLICES} rotation={rotation} winner={won ? 1 : null} className={styles.sceneWheel} />
      <RewardPop show={won}>+1 สิทธิ์หมุน</RewardPop>
    </div>
  );
}

function SceneBox({ reduce }: { reduce: boolean | null }) {
  const [open, setOpen] = useState(false);
  useLater(1100, () => setOpen(true), reduce);

  return (
    <div className={styles.scene}>
      <motion.div
        className={styles.sceneBox}
        animate={reduce ? undefined : { rotate: [0, -8, 8, -7, 7, -4, 0], y: [0, -3, 0, -3, 0, -1, 0] }}
        transition={{ duration: 0.65, delay: 0.35, ease: "easeInOut" }}
      >
        <BoxArt open={open} />
      </motion.div>
      <RewardPop show={open} tone="pink">
        +50 เครดิต
      </RewardPop>
    </div>
  );
}

const MINI_CARDS = ["+20 เครดิต", "50 แต้ม", "+1 สิทธิ์หมุน"];

function SceneCards({ reduce }: { reduce: boolean | null }) {
  const [picked, setPicked] = useState(false);
  const [others, setOthers] = useState(false);
  useLater(500, () => setPicked(true), reduce);
  useLater(1500, () => setOthers(true), reduce);

  return (
    <div className={styles.scene}>
      <div className={styles.sceneCards}>
        {MINI_CARDS.map((reward, i) => {
          const isPicked = i === 1;
          const up = isPicked ? picked : others;
          const [value, ...unit] = reward.split(" ");
          return (
            <motion.span
              key={reward}
              className={styles.miniCard}
              initial={false}
              animate={reduce ? {} : { rotateY: up ? 180 : 0, y: isPicked && up ? -10 : 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 22, delay: !isPicked && up ? i * 0.08 : 0 }}
            >
              <span className={styles.miniBack} style={reduce ? { opacity: up ? 0 : 1 } : undefined}>
                <i className="pi pi-star-fill" aria-hidden="true" />
              </span>
              <span
                className={`${styles.miniFace} ${isPicked ? styles.miniFaceWin : ""}`}
                style={reduce ? { transform: "none", opacity: up ? 1 : 0 } : undefined}
              >
                <b>{value}</b>
                <small>{unit.join(" ")}</small>
              </span>
            </motion.span>
          );
        })}
      </div>
      <RewardPop show={picked}>50 แต้ม</RewardPop>
    </div>
  );
}

const MINI_MISSIONS = [
  { icon: "pi-calendar", label: "เช็คอินประจำวัน" },
  { icon: "pi-wallet", label: "ฝากเงิน" },
  { icon: "pi-user-plus", label: "ชวนเพื่อน" },
];

function SceneMissions({ reduce }: { reduce: boolean | null }) {
  const [done, setDone] = useState(reduce ? MINI_MISSIONS.length : 0);
  useLater(900, () => setDone(1), reduce);
  useLater(1600, () => setDone(2), reduce);
  useLater(2300, () => setDone(3), reduce);

  return (
    <div className={styles.scene}>
      <div className={styles.sceneMissions}>
        {MINI_MISSIONS.map((m, i) => {
          const isDone = i < done;
          return (
            <div key={m.label} className={`${styles.miniMission} ${isDone ? styles.miniMissionDone : ""}`}>
              <span className={styles.miniMissionIcon}>
                <i className={`pi ${isDone ? "pi-check" : m.icon}`} aria-hidden="true" />
              </span>
              <span className={styles.miniMissionText}>
                <span>{m.label}</span>
                <span className={styles.miniBar}>
                  <motion.span
                    className={styles.miniBarFill}
                    initial={{ scaleX: reduce ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.7, ease: EASE_OUT }}
                  />
                </span>
              </span>
            </div>
          );
        })}
      </div>
      <RewardPop show={done === MINI_MISSIONS.length}>ภารกิจสำเร็จ +100 เครดิต</RewardPop>
    </div>
  );
}

export function Showcase() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [scene, setScene] = useState(0);
  const [cycle, setCycle] = useState(0);

  // Advance to the next scene on a timer, only while visible
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setScene((s) => (s + 1) % SCENES.length), SCENE_MS);
    return () => clearTimeout(t);
  }, [inView, scene, cycle]);

  function jump(index: number) {
    setScene(index);
    setCycle((c) => c + 1);
  }

  const Scene = [SceneWheel, SceneBox, SceneCards, SceneMissions][scene];

  return (
    <div ref={ref} className={`${styles.showcase} ${inView ? "" : styles.paused}`}>
      <span className={styles.orbit} aria-hidden="true" />
      <span className={`${styles.orbit} ${styles.orbitInner}`} aria-hidden="true" />

      <motion.div
        className={styles.phone}
        initial={{ opacity: 0, y: 24, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
      >
        <div className={styles.screen} aria-hidden="true">
          <span className={styles.notch} />
          <div className={styles.screenHead}>
            <span className={styles.screenTitle}>{SCENES[scene].label}</span>
            <span className={styles.screenPill}>
              <i className="pi pi-gift" /> รางวัล
            </span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${scene}-${cycle}`}
              className={styles.sceneWrap}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <Scene reduce={reduce} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {HERO_CHIPS.map((chip, i) => (
        <motion.span
          key={chip}
          className={`${styles.chip} ${styles[`chip${i}`]}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...POP_SPRING, delay: 0.6 + i * 0.08 }}
          aria-hidden="true"
        >
          <span className={styles.chipBob}>
            <span className={styles.chipIcon}>
              <i className={`pi ${["pi-wallet", "pi-sun", "pi-star-fill", "pi-flag"][i]}`} />
            </span>
            {chip}
          </span>
        </motion.span>
      ))}

      <div className={styles.sceneTabs} role="group" aria-label="ตัวอย่างที่กำลังเล่น">
        {SCENES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            className={`${styles.sceneTab} ${i === scene ? styles.sceneTabActive : ""}`}
            onClick={() => jump(i)}
            aria-pressed={i === scene}
          >
            {s.label}
            {i === scene && <span key={`${scene}-${cycle}`} className={styles.sceneProgress} style={{ animationDuration: `${SCENE_MS}ms` }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
