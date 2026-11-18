"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MISSION_DEMO } from "../_content";
import { Confetti } from "./art";
import styles from "./demos.module.css";
import { EASE_OUT, POP_SPRING } from "./motion-utils";

const FILL_MS = 1100;
const STEPS = MISSION_DEMO.steps;

// Number that counts up from 0 to `to` while its sub-mission runs
function CountUp({ to, run, done }: { to: number; run: boolean; done: boolean }) {
  const value = useMotionValue(done ? to : 0);
  const text = useTransform(value, (v) => Math.round(v).toLocaleString("en-US"));

  useEffect(() => {
    if (run) {
      const controls = animate(value, to, { duration: FILL_MS / 1000, ease: EASE_OUT });
      return () => controls.stop();
    }
    value.set(done ? to : 0);
  }, [run, done, to, value]);

  return <motion.span>{text}</motion.span>;
}

// Playable missions: sequential sub-missions using the 5 action types. Each one fills up, pays its
// reward and unlocks the next; finishing all pays the main reward with confetti.
export function DemoMissions() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(0); // number of finished sub-missions (they go in order)
  const [running, setRunning] = useState<number | null>(null);
  const [auto, setAuto] = useState(false);
  const [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allDone = done === STEPS.length;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function start(index: number) {
    if (running !== null || index !== done) return;
    setRunning(index);
    timer.current = setTimeout(
      () => {
        setRunning(null);
        setDone(index + 1);
        if (index + 1 === STEPS.length) {
          setAuto(false);
          setBurst((b) => b + 1);
        }
      },
      reduce ? 0 : FILL_MS,
    );
  }

  // Auto-play: start the next sub-mission shortly after the previous one finishes
  useEffect(() => {
    if (!auto || running !== null || done >= STEPS.length) return;
    const t = setTimeout(() => start(done), reduce ? 0 : 380);
    return () => clearTimeout(t);
  });

  function reset() {
    if (timer.current) clearTimeout(timer.current);
    setRunning(null);
    setDone(0);
    setAuto(false);
  }

  const status = allDone
    ? `ภารกิจหลักสำเร็จ! ได้รับรางวัลใหญ่ ${MISSION_DEMO.mainReward}`
    : running !== null
      ? `กำลังทำภารกิจ: ${STEPS[running].action}`
      : done > 0
        ? `สำเร็จ ${done} จาก ${STEPS.length} ภารกิจ ได้รับ ${STEPS[done - 1].reward} ภารกิจถัดไปปลดล็อกแล้ว`
        : "กด “ทำภารกิจ” ทีละข้อ หรือกดเล่นอัตโนมัติ";

  return (
    <div className={`${styles.game} ${styles.missionGame}`}>
      <div className={styles.missionHead}>
        <div className={styles.missionHeadText}>
          <span className={styles.missionKicker}>
            ภารกิจหลัก • {MISSION_DEMO.structure} • {done}/{STEPS.length}
          </span>
          <span className={styles.missionTitle}>{MISSION_DEMO.title}</span>
        </div>
        <motion.span
          className={`${styles.mainReward} ${allDone ? styles.mainRewardWon : ""}`}
          initial={false}
          animate={allDone && !reduce ? { scale: [1, 1.18, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <i className={`pi ${allDone ? "pi-check-circle" : "pi-gift"}`} aria-hidden="true" />
          รางวัลใหญ่ {MISSION_DEMO.mainReward}
        </motion.span>
      </div>

      <ol className={styles.missionList}>
        {STEPS.map((step, i) => {
          const isDone = i < done;
          const isRunning = running === i;
          const isActive = i === done && !allDone;
          const locked = i > done;
          return (
            <li
              key={step.action}
              className={`${styles.missionRow} ${isDone ? styles.missionRowDone : ""} ${isActive ? styles.missionRowActive : ""} ${locked ? styles.missionRowLocked : ""}`}
            >
              <span className={styles.missionIcon}>
                <i className={`pi ${step.icon}`} aria-hidden="true" />
              </span>
              <span className={styles.missionBody}>
                <span className={styles.missionAction}>{step.action}</span>
                <span className={styles.missionTask}>{step.task}</span>
                <span className={styles.missionBar} aria-hidden="true">
                  <motion.span
                    className={styles.missionBarFill}
                    initial={false}
                    animate={{ scaleX: isDone || isRunning ? 1 : 0 }}
                    transition={{ duration: isRunning ? FILL_MS / 1000 : 0.3, ease: EASE_OUT }}
                  />
                </span>
              </span>
              <span className={styles.missionCount}>
                <CountUp to={step.target} run={isRunning} done={isDone} />/{step.target.toLocaleString("en-US")} {step.unit}
              </span>
              <span className={`${styles.missionReward} ${isDone ? styles.missionRewardDone : ""}`}>{step.reward}</span>
              <span className={styles.missionAct}>
                {isDone ? (
                  <motion.span
                    className={styles.missionCheck}
                    initial={reduce ? false : { scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={POP_SPRING}
                  >
                    <i className="pi pi-check" aria-hidden="true" />
                    <span className={styles.srOnly}>สำเร็จแล้ว</span>
                  </motion.span>
                ) : locked ? (
                  <span className={styles.missionLock}>
                    <i className="pi pi-lock" aria-hidden="true" />
                    <span className={styles.srOnly}>ล็อกอยู่</span>
                  </span>
                ) : (
                  <button type="button" className={styles.missionButton} onClick={() => start(i)} disabled={isRunning}>
                    {isRunning ? "กำลังทำ..." : "ทำภารกิจ"}
                  </button>
                )}
              </span>

              {/* the reward floats up from the row when it is paid */}
              <AnimatePresence>
                {isDone && i === done - 1 && !reduce && (
                  <motion.span
                    key={`fly-${i}`}
                    className={styles.missionFly}
                    initial={{ opacity: 0, y: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 1, 1, 0], y: -38, scale: 1 }}
                    transition={{ duration: 1.1, ease: EASE_OUT, opacity: { duration: 1.1, times: [0, 0.15, 0.7, 1] } }}
                    aria-hidden="true"
                  >
                    {step.reward}
                  </motion.span>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>

      <div className={`${styles.controls} ${styles.controlsRow}`}>
        <p className={styles.status} aria-live="polite">
          {status}
        </p>
        {allDone || done > 0 ? (
          <button type="button" className={styles.ghostButton} onClick={reset}>
            <i className="pi pi-replay" aria-hidden="true" />
            เริ่มใหม่
          </button>
        ) : null}
        {!allDone && (
          <button type="button" className={styles.gameButton} onClick={() => setAuto(true)} disabled={auto}>
            <i className="pi pi-play" aria-hidden="true" />
            {auto ? "กำลังเล่น..." : "เล่นอัตโนมัติ"}
          </button>
        )}
      </div>
      <Confetti burst={burst} spread={1.2} />
    </div>
  );
}
