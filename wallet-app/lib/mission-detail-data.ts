// Mock data for the mission detail page (Figma 12:46689 "เมื่อกดทำภารกิจ").
// Figma only draws the rabbit mission, so every mission uses the same sub-missions for now.
// Will come from the Back office later — keep this shape.

import { missions, type Mission } from "./mission-data";

const ICONS = "/missions/icons";

export type DetailReward = { icon: string; label: string };

export type ProgressRow = {
  label: string;
  current: number;
  target: number;
  unit?: string;
};

export type SubMission = {
  id: string;
  title: string;
  rows: ProgressRow[];
  rewards: DetailReward[];
  conditions: string[];
  action?: "check-in"; // the only step the player can finish right here
  startOpen?: boolean; // Figma shows sub-mission 2 with its conditions open
};

const credit: DetailReward = { icon: `${ICONS}/reward-credit.svg`, label: "+100 ฿" };
const points: DetailReward = { icon: `${ICONS}/reward-point.svg`, label: "+100 pt" };
const wheel: DetailReward = { icon: `${ICONS}/reward-wheel.svg`, label: "+2 สิทธิ์" };
const box: DetailReward = { icon: `${ICONS}/reward-box.svg`, label: "+2 สิทธิ์" };
const card: DetailReward = { icon: `${ICONS}/reward-card.svg`, label: "+2 สิทธิ์" };

// Placeholder copy from Figma
const conditions = [
  "สิมิลันกำแพงเพชรโอบามามุมไบสีหมุนี อ่างขาง สิมิลันหนองคายปากีสถานพังงารุกฆาต",
  "พรั่นพรึงท็อปบูตซัมซุงอัตตะปือ ปารุสก์กรีดกราย ซาดิสม์คดเคี้ยวอ่อนด้อย",
  "วิทยายนสุขุมวิท พอประมาณพิษณุโลกเทพรัตนทรูมูฟทับถม เลโซโทวิกฤตกาลบูร์กินาฟาโซพอลล่า",
  "ส้มฉุนนักเทศน์กระดาษทรายแน่แท้ คู่คิดงงงวยพัทลุง ซิตี้รีทัชอุบลราชธานี",
];

export const missionPeriod = "01/11/2026 00:00 - 07/11/2026 23:59";
export const mainRewards: DetailReward[] = [credit, points, wheel, box, card];
export const mainConditions = conditions;

export const subMissions: SubMission[] = [
  {
    id: "daily-login",
    title: "Daily Login เช็คอินประจำวัน",
    rows: [{ label: "เข้าสู่ระบบ (Login) ครบ", current: 0, target: 1, unit: "ครั้ง" }],
    rewards: [credit, points],
    conditions,
    action: "check-in",
  },
  {
    id: "collect-points",
    title: "สะสมแต้ม",
    rows: [{ label: "สะสมแต้มครบ", current: 0, target: 100, unit: "pt" }],
    rewards: [credit, points],
    conditions,
    startOpen: true,
  },
  {
    id: "deposit",
    title: "ฝากสะบั้นหั่นแหลก",
    rows: [
      { label: "ฝากครั้งละ 100 ต่อเนื่อง 3 วัน", current: 0, target: 3 },
      { label: "ฝากสะสมครบ", current: 0, target: 300, unit: "บาท" },
    ],
    rewards: [credit, points, wheel],
    conditions,
  },
  {
    id: "turnover",
    title: "ทำเทิร์นโอเวอร์",
    rows: [{ label: "ยอดเล่นหมวดหมู่ Slot ครบ", current: 0, target: 5000 }],
    rewards: [credit, points],
    conditions,
  },
  {
    id: "play-more",
    title: "ยิ่งเล่นเยอะยิ่งได้",
    rows: [
      { label: "ยอดเล่นหมวดหมู่ Slot ครบ", current: 0, target: 10000, unit: "บาท" },
      { label: "ยอดเล่นหมวดหมู่ Slot ค่าย PG ครบ", current: 0, target: 10000, unit: "บาท" },
    ],
    rewards: [credit, points, wheel],
    conditions,
  },
];

// Big artwork for the detail carousel. Only the rabbit has one in Figma;
// the others reuse their card art (same 4:5 shape).
const heroArt: Record<string, string> = {
  "rabbit-detective": "/missions/art/rabbit-hero.png",
};

export function getHeroArt(mission: Mission) {
  return heroArt[mission.id] ?? mission.image;
}

export function getMission(id: string) {
  return missions.find((mission) => mission.id === id);
}
