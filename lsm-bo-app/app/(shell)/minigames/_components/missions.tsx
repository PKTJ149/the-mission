"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ACTION_TYPES, MISSION_EXTRAS, MISSION_STRUCTURES, MISSIONS_SECTION, type StructureKind } from "../_content";
import { POP_SPRING } from "./motion-utils";
import styles from "./promo.module.css";
import { Reveal, SectionHead } from "./reveal";

const TICK_MS = 650;

// A step counter that loops 0 → length-1 while the element is visible (fixed at the end for
// reduced motion, so the diagram shows its finished state).
function useLoop(length: number, active: boolean, reduce: boolean | null) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active || reduce) return;
    const t = setTimeout(() => setTick((v) => (v + 1) % length), TICK_MS);
    return () => clearTimeout(t);
  }, [tick, active, reduce, length]);
  return reduce ? length - 1 : tick;
}

// One mission node: locked → open → done
function Node({ label, state }: { label: string; state: "locked" | "open" | "done" }) {
  return (
    <span className={`${styles.node} ${styles[`node_${state}`]}`}>
      {state === "done" ? (
        <motion.i key="done" className="pi pi-check" initial={{ scale: 0.3 }} animate={{ scale: 1 }} transition={POP_SPRING} />
      ) : state === "locked" ? (
        <i className="pi pi-lock" />
      ) : (
        <span>{label}</span>
      )}
    </span>
  );
}

function Line({ filled, vertical = false }: { filled: boolean; vertical?: boolean }) {
  return (
    <span className={vertical ? `${styles.line} ${styles.lineSlant}` : styles.line}>
      <span className={styles.lineFill} style={{ transform: filled ? "scaleX(1)" : "scaleX(0)" }} />
    </span>
  );
}

function Gift({ won, big = false }: { won: boolean; big?: boolean }) {
  return (
    <motion.span
      className={`${styles.gift} ${big ? styles.giftBig : ""} ${won ? styles.giftWon : ""}`}
      initial={false}
      animate={{ scale: won ? [1, 1.18, 1] : 1 }}
      transition={{ duration: 0.45 }}
    >
      <i className="pi pi-gift" />
    </motion.span>
  );
}

// Small reward chip above a node in the sequential diagram
function MiniReward({ show }: { show: boolean }) {
  return (
    <span className={styles.miniReward} style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(6px)" }}>
      <i className="pi pi-star-fill" />
    </span>
  );
}

function Diagram({ kind, active }: { kind: StructureKind; active: boolean }) {
  const reduce = useReducedMotion();

  // single: 0 idle · 1 done · 2 reward · 3 hold
  const single = useLoop(5, active && kind === "single", reduce);
  // sequential: nodes finish one by one (ticks 1-3), then the big reward (4), hold
  const seq = useLoop(7, active && kind === "sequential", reduce);
  // any order: nodes finish in the order 2, 3, 1, then the big reward
  const any = useLoop(7, active && kind === "any", reduce);

  if (kind === "single") {
    return (
      <div className={styles.diagram}>
        <Node label="1" state={single >= 1 ? "done" : "open"} />
        <Line filled={single >= 2} />
        <Gift won={single >= 2} big />
      </div>
    );
  }

  if (kind === "sequential") {
    const state = (i: number) => (seq >= i + 1 ? "done" : seq >= i ? "open" : "locked");
    return (
      <div className={styles.diagram}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={styles.nodeWrap}>
            <MiniReward show={seq >= i + 1} />
            <Node label={String(i + 1)} state={state(i)} />
            {i < 2 ? <Line filled={seq >= i + 1} /> : <Line filled={seq >= 4} />}
          </span>
        ))}
        <Gift won={seq >= 4} big />
      </div>
    );
  }

  const order = [1, 2, 0]; // finish order of nodes 1..3 (by index)
  const doneAt = (i: number) => order.indexOf(i) + 1;
  return (
    <div className={`${styles.diagram} ${styles.diagramAny}`}>
      <div className={styles.anyNodes}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={styles.anyRow}>
            <Node label={String(i + 1)} state={any >= doneAt(i) ? "done" : "open"} />
            <Line filled={any >= doneAt(i)} />
          </span>
        ))}
      </div>
      <span className={styles.anyJoin} aria-hidden="true" />
      <Gift won={any >= 4} big />
    </div>
  );
}

function StructureCard({ kind, title, text, index }: { kind: StructureKind; title: string; text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  return (
    <Reveal delay={index * 0.07} className={styles.structureCard}>
      <div ref={ref} className={styles.diagramStage} aria-hidden="true">
        <Diagram kind={kind} active={inView} />
      </div>
      <span className={styles.structureIndex}>รูปแบบที่ {index + 1}</span>
      <h3 className={styles.structureTitle}>{title}</h3>
      <p className={styles.structureText}>{text}</p>
    </Reveal>
  );
}

// Section 5: mission structures as small animated diagrams + the 5 action types
export function Missions() {
  return (
    <section className={styles.section} aria-labelledby="missions-title">
      <SectionHead id="missions-title" eyebrow={MISSIONS_SECTION.eyebrow} title={MISSIONS_SECTION.title} sub={MISSIONS_SECTION.sub} />

      <div className={styles.structureGrid}>
        {MISSION_STRUCTURES.map((s, i) => (
          <StructureCard key={s.kind} kind={s.kind} title={s.title} text={s.text} index={i} />
        ))}
      </div>

      <div className={styles.missionInfo}>
        <Reveal className={styles.infoCard}>
          <h3 className={styles.infoTitle}>{MISSIONS_SECTION.actionsTitle}</h3>
          <ul className={styles.actionList}>
            {ACTION_TYPES.map((a) => (
              <li key={a.label} className={styles.actionChip}>
                <span className={styles.actionIcon} aria-hidden="true">
                  <i className={`pi ${a.icon}`} />
                </span>
                {a.label}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.06} className={styles.infoCard}>
          <h3 className={styles.infoTitle}>{MISSIONS_SECTION.extrasTitle}</h3>
          <ul className={styles.extraList}>
            {MISSION_EXTRAS.map((x) => (
              <li key={x.label} className={styles.extraItem}>
                <i className={`pi ${x.icon}`} aria-hidden="true" />
                {x.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
