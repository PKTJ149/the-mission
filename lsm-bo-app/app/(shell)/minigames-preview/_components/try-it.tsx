"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { WALLET_APP_URL } from "@/lib/config/minigames";
import { LuckyCardsGame } from "./lucky-cards";
import { PICK_GAMES, PickGame, WheelGame } from "./play-phone";
import styles from "./sale-preview.module.css";

// The real player missions page (wallet-app), live and tappable. Locally wallet-app must run on 3300.
function MissionsLive() {
  return <iframe className={styles.playFrame} src={`${WALLET_APP_URL}/missions`} title="ตัวอย่างหน้าภารกิจของผู้เล่น" />;
}

// Each card opens the real player screen, playable, in a phone frame: 3 of PK's sample games + missions
const GAMES = [
  { key: "box", label: "กล่องสุ่ม", cover: "20-gold-boxes", Game: () => <PickGame config={PICK_GAMES.box} /> },
  { key: "wheel", label: "วงล้อนำโชค", cover: "forest-wheel", Game: () => <WheelGame /> },
  // Lucky Cards from PK's Figma (kHa9WnKLn6dOYLMnRiJ4Cv), replaces the gold cards demo
  { key: "cards", label: "เปิดไพ่", cover: "lucky-cards", Game: LuckyCardsGame },
  { key: "missions", label: "ภารกิจ", cover: null, Game: MissionsLive },
] as const;

type GameKey = (typeof GAMES)[number]["key"];

// "ลองเล่นเอง": the video lets the merchant watch, this lets them play what their players would.
export function TryIt() {
  const [open, setOpen] = useState<GameKey | null>(null);
  const game = GAMES.find((g) => g.key === open);

  return (
    <div className={styles.tryIt}>
      <p className={styles.tryTitle}>
        ลองเล่นเอง <span>เหมือนที่ลูกค้าของคุณจะได้เห็น</span>
      </p>
      <div className={styles.tryRow}>
        {GAMES.map((g) => (
          <button key={g.key} type="button" className={styles.tryCard} onClick={() => setOpen(g.key)}>
            {g.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/minigames-preview/games/${g.cover}.webp`} alt="" className={styles.tryCover} />
            ) : (
              <span className={`${styles.tryCover} ${styles.tryCoverMission}`} aria-hidden>
                <MissionIcon />
              </span>
            )}
            <span className={styles.tryPlay}>{g.cover ? "▶ เล่น" : "▶ ลองทำ"}</span>
            <span className={styles.tryLabel}>
              <strong>{g.label}</strong>
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {game && <GameDialog key={game.key} label={game.label} Game={game.Game} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </div>
  );
}

function GameDialog({ label, Game, onClose }: { label: string; Game: () => React.JSX.Element; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes; focus goes to the close button and back to the page afterwards
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className={styles.dialogBackdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.playWrap}
        role="dialog"
        aria-modal="true"
        aria-label={`ทดลองเล่น ${label}`}
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.playHead}>
          <span className={styles.playTitle}>
            <strong>ทดลองเล่น</strong>
            <span>
              {label} · ตัวอย่างจำลอง ไม่มีผลกับระบบจริง
            </span>
          </span>
          <button ref={closeRef} type="button" className={styles.dialogClose} onClick={onClose} aria-label="ปิด">
            ✕
          </button>
        </div>
        {/* Phone frame: the screen keeps the game's 1075 x 2180 shape */}
        <div className={styles.playPhone}>
          <Game />
        </div>
      </motion.div>
    </motion.div>
  );
}

function MissionIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 3.5h6v2H9z" />
      <path d="M8.5 11l1.5 1.5 3-3M8.5 16.5l1.5 1.5 3-3" />
    </svg>
  );
}
