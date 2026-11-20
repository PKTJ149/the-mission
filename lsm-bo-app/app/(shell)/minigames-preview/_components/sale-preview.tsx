"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { MINIGAMES_CONTACT_URL } from "@/lib/config/minigames";
import styles from "./sale-preview.module.css";
import { TryIt } from "./try-it";

// The finished sales video (sale-video/film, HyperFrames render, web-encoded copy in public/).
const VIDEO_SRC = "/minigames-preview/video/smartgame.mp4";
const VIDEO_POSTER = "/minigames-preview/video/smartgame-poster.jpg";

// "ระบบทำอะไรได้", one tab per product (selling-points.md: MG-1, MG-2/3, MG-12, MS-1, MS-3, MS-4).
// Outcomes only, no "how it is set up" (manager's confidentiality rule for sales material).
const CAPABILITIES = {
  games: [
    { icon: "coin", title: "แจกสิทธิ์เองจากยอดฝาก", text: "ฝากถึงเงื่อนไข ได้สิทธิ์เล่นทันที" },
    { icon: "shield", title: "คุมงบได้ทุกชั้น", text: "งบรวม ลิมิตรายคน กันฟาร์มสิทธิ์" },
    { icon: "palette", title: "เปลี่ยนธีมได้ทุกเทศกาล", text: "ระบบเดียว เป็นวงล้อ กล่อง หรือไพ่" },
  ],
  missions: [
    { icon: "route", title: "เส้นทางยืดหยุ่น", text: "ภารกิจหลัก + ย่อย ทำเรียงหรือไม่เรียงก็ได้" },
    { icon: "repeat", title: "วนรอบเอง", text: "รายวัน สัปดาห์ เดือน รีเซ็ตอัตโนมัติ" },
    { icon: "gift", title: "รางวัล 5 แบบ", text: "เครดิต สิทธิ์เกม โปร แต้ม ของรางวัล" },
  ],
} as const;

const TABS = [
  { key: "games", label: "มินิเกม" },
  { key: "missions", label: "ภารกิจ" },
] as const;

type TabKey = (typeof TABS)[number]["key"];
type IconName = (typeof CAPABILITIES)[TabKey][number]["icon"];

export function SalePreview({ fontClassName }: { fontClassName: string }) {
  return (
    <div className={`${styles.page} ${fontClassName}`}>
      <section className={styles.copy}>
        <div className={styles.top}>
          {/* SmartGAME logo (PK, 20-11-2026). Its purple "GAME" disappears on the plum page,
              so the on-white version sits on a white pill. */}
          <span className={styles.logoPill}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/minigames-preview/smartgame-logo.png" alt="SmartGAME" className={styles.logo} />
          </span>
          <h1 className={styles.title}>
            <span className={styles.gold}>มินิเกม + ภารกิจ</span>
            <br />
            ให้ลูกค้าฝากเพิ่ม และกลับมาทุกวัน
          </h1>
          {/* Missions and games feed each other (selling-points.md, C-1) */}
          <p className={styles.lead}>ภารกิจพาลูกค้าไปเล่นเกม เกมพาลูกค้ากลับมาฝาก</p>
        </div>

        <Capabilities />

        <TryIt />

        <div className={styles.ctaRow}>
          <a className={styles.cta} href={MINIGAMES_CONTACT_URL} target="_blank" rel="noreferrer">
            ติดต่อเปิดใช้งาน
            <span aria-hidden>→</span>
          </a>
          <div className={styles.qr}>
            <FakeQr />
            <span>
              <strong>สแกนคุยทาง LINE</strong>
              <small>QR ตัวอย่าง รอลิงก์จริง</small>
            </span>
          </div>
        </div>
      </section>

      <SaleVideo />
    </div>
  );
}

// PK, 20-11-2026: the video plays as soon as the page opens, with a button to pause it.
// Browsers only autoplay muted video, so it starts muted and a second button turns the sound on.
function SaleVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  function togglePlay() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  function toggleSound() {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted && video.paused) void video.play();
  }

  return (
    <figure className={styles.phone}>
      {/* Phone mockup: bezel, Dynamic Island and side buttons around a 9:16 screen */}
      <div className={styles.device}>
        <span className={styles.island} aria-hidden />
        <div className={styles.screen}>
          <video
            ref={ref}
            className={styles.still}
            src={VIDEO_SRC}
            poster={VIDEO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
          <div className={styles.videoControls}>
            <button type="button" className={styles.videoBtn} onClick={togglePlay} aria-label={playing ? "หยุดวิดีโอ" : "เล่นวิดีโอ"}>
              {playing ? (
                <svg viewBox="0 0 24 24" aria-hidden><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" /></svg>
              )}
            </button>
            <button type="button" className={styles.videoBtn} onClick={toggleSound} aria-label={muted ? "เปิดเสียง" : "ปิดเสียง"}>
              {muted ? (
                <svg viewBox="0 0 24 24" aria-hidden><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" /><path d="m16 9.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </figure>
  );
}

function Capabilities() {
  const [tab, setTab] = useState<TabKey>("games");

  return (
    <div>
      <div className={styles.capHead}>
        <p className={styles.sectionTitle}>ระบบทำอะไรได้</p>
        <div className={styles.tabs} role="tablist" aria-label="ระบบทำอะไรได้">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`cap-tab-${t.key}`}
              aria-selected={tab === t.key}
              aria-controls="cap-panel"
              className={tab === t.key ? styles.tabActive : styles.tab}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={tab}
          id="cap-panel"
          role="tabpanel"
          aria-labelledby={`cap-tab-${tab}`}
          className={styles.goals}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {CAPABILITIES[tab].map((item) => (
            <li key={item.title} className={styles.goal}>
              <span className={styles.icon} aria-hidden>
                <CapIcon name={item.icon} />
              </span>
              <strong>{item.title}</strong>
              <small>{item.text}</small>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}

function CapIcon({ name }: { name: IconName }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "coin":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M9.5 9.5h3.75a1.75 1.75 0 0 1 0 3.5h-2.5a1.75 1.75 0 0 0 0 3.5H15" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "palette":
      return (
        <svg {...common}>
          <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.7-.9 1.4-1.8-.4-1.1.4-2.2 1.6-2.2H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z" />
          <circle cx="7.5" cy="11" r="1.2" />
          <circle cx="10.5" cy="7" r="1.2" />
          <circle cx="15" cy="7.5" r="1.2" />
        </svg>
      );
    case "route":
      return (
        <svg {...common}>
          <circle cx="6" cy="19" r="2.5" />
          <circle cx="18" cy="5" r="2.5" />
          <path d="M8.5 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.5" />
        </svg>
      );
    case "repeat":
      return (
        <svg {...common}>
          <path d="M17 2l4 4-4 4" />
          <path d="M3 11V9a3 3 0 0 1 3-3h15" />
          <path d="M7 22l-4-4 4-4" />
          <path d="M21 13v2a3 3 0 0 1-3 3H3" />
        </svg>
      );
    case "gift":
      return (
        <svg {...common}>
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <path d="M12 8v13M5 12v9h14v-9" />
          <path d="M12 8c-1.5-3-5-3.5-5-1.5S10 8 12 8zM12 8c1.5-3 5-3.5 5-1.5S14 8 12 8z" />
        </svg>
      );
  }
}

// Placeholder only: a QR-looking pattern, not a scannable code. Swap for the real LINE QR.
function FakeQr() {
  const size = 21;
  const cells: [number, number][] = [];
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const inFinder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
      if (!inFinder && (x * 7 + y * 13 + x * y) % 3 === 0) cells.push([x, y]);
    }
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={7} height={7} fill="#111" />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="#111" />
    </g>
  );
  return (
    <svg className={styles.qrCode} viewBox={`-1 -1 ${size + 2} ${size + 2}`} aria-hidden>
      <rect x={-1} y={-1} width={size + 2} height={size + 2} fill="#fff" />
      {cells.map(([x, y]) => (
        <rect key={`${x}.${y}`} x={x} y={y} width={1} height={1} fill="#111" />
      ))}
      {finder(0, 0)}
      {finder(14, 0)}
      {finder(0, 14)}
    </svg>
  );
}
