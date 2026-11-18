"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import { DEMO_SECTION, DEMO_TABS, type DemoKey } from "../_content";
import { DemoBox } from "./demo-box";
import { DemoCards } from "./demo-cards";
import { DemoMissionsLive } from "./demo-missions-live";
import { DemoWheel } from "./demo-wheel";
import styles from "./demos.module.css";
import { EASE_OUT } from "./motion-utils";
import promo from "./promo.module.css";
import { Reveal, SectionHead } from "./reveal";

const GAMES: Record<DemoKey, () => React.JSX.Element> = {
  wheel: DemoWheel,
  box: DemoBox,
  cards: DemoCards,
  // the real player missions page, live (PK). The mock version stays in demo-missions.tsx.
  missions: DemoMissionsLive,
};

// Section 3: "ลองเล่นเลย" – tabs with a playable demo and the matching back-office settings.
export function Demos() {
  const [active, setActive] = useState<DemoKey>("wheel");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = DEMO_TABS.find((t) => t.key === active) ?? DEMO_TABS[0];
  const Game = GAMES[active];

  // Left / right arrows move between tabs (WAI-ARIA tabs pattern)
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const index = DEMO_TABS.findIndex((t) => t.key === active);
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + DEMO_TABS.length) % DEMO_TABS.length;
    setActive(DEMO_TABS[next].key);
    tabRefs.current[next]?.focus();
    e.preventDefault();
  }

  return (
    <section id="minigames-demo" className={`${promo.section} ${promo.demoSection}`} aria-labelledby="demo-title">
      <SectionHead id="demo-title" eyebrow={DEMO_SECTION.eyebrow} title={DEMO_SECTION.title} sub={DEMO_SECTION.sub} />

      <Reveal delay={0.08}>
        <div className={styles.tabs} role="tablist" aria-label="เลือกตัวอย่างเกม" onKeyDown={onKeyDown}>
          {DEMO_TABS.map((t, i) => {
            const selected = t.key === active;
            return (
              <button
                key={t.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`demo-tab-${t.key}`}
                aria-selected={selected}
                aria-controls="demo-panel"
                tabIndex={selected ? 0 : -1}
                className={`${styles.tab} ${selected ? styles.tabActive : ""}`}
                onClick={() => setActive(t.key)}
              >
                {selected && (
                  <motion.span layoutId="demo-tab-pill" className={styles.tabPill} transition={{ type: "spring", stiffness: 500, damping: 38 }} />
                )}
                <i className={`pi ${t.icon} ${styles.tabIcon}`} aria-hidden="true" />
                <span className={styles.tabLabel}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={0.14}>
        <div className={styles.demoCard} id="demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${active}`}>
          <div className={styles.stage}>
            <span className={styles.stageGlow} aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                className={styles.stageInner}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
              >
                <Game />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.settings}>
            <span className={styles.settingsKicker}>
              <i className="pi pi-cog" aria-hidden="true" />
              {DEMO_SECTION.settingsTitle}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                <h3 className={styles.settingsTitle}>{tab.label}</h3>
                <ul className={styles.settingsList}>
                  {tab.settings.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.05 + i * 0.04 }}
                    >
                      <span className={styles.settingsCheck} aria-hidden="true">
                        <i className="pi pi-check" />
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
            <p className={styles.disclaimer}>
              <i className="pi pi-info-circle" aria-hidden="true" />
              {DEMO_SECTION.disclaimer}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
