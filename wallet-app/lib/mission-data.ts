// Mock data for the mission list page (Figma: "Mission Home Page" mobile + "Desktop - 3").
// Missions will come from the Back office later — keep this shape when wiring the API.

export type RewardType = "credit" | "point" | "wheel" | "box" | "card" | "spin" | "item";

export type MissionReward = {
  type: RewardType;
  label: string;
};

// Each card in Figma has a slightly different hand-drawn tilted frame (see card-frames.tsx)
export type MissionFrame = "a" | "b" | "c" | "d" | "e" | "f" | "g";

export type Mission = {
  id: string;
  title: string;
  subMissionCount: number;
  image: string;
  imageRounded?: boolean;
  layout: "image-left" | "image-right";
  frame: MissionFrame;
  // A mission shows either a live countdown or a fixed date range
  secondsLeft?: number;
  period?: string;
  rewards: MissionReward[]; // the first 4 sit on row 1, the rest on row 2
  exclusive?: boolean; // red "ภารกิจเฉพาะคุณ" ribbon
  isNew?: boolean;
  pinned: boolean;
  favorite: boolean;
  status: "active" | "completed";
  remainingMissions?: number; // completed, but more rounds are still open
};

export const memberBalance = {
  points: "1,290",
  credit: "59,893.90",
  userId: "Xbgb1709724394161",
  phone: "094-233-4442",
};

// 1 day 22:34:23 — the countdown shown in Figma
const FIGMA_COUNTDOWN = 1 * 86400 + 22 * 3600 + 34 * 60 + 23;

const baseRewards: MissionReward[] = [
  { type: "credit", label: "100" },
  { type: "point", label: "100" },
  { type: "wheel", label: "2" },
  { type: "box", label: "2" },
];

const fullRewards: MissionReward[] = [
  ...baseRewards,
  { type: "card", label: "2" },
  { type: "spin", label: "200" },
  { type: "item", label: "แก้วน้ำ  Yeti" },
];

export const missions: Mission[] = [
  {
    id: "rabbit-detective",
    title: "ภารกิจช่วยกระต่ายนักสืบ",
    subMissionCount: 5,
    image: "/missions/art/rabbit.png",
    imageRounded: true,
    layout: "image-left",
    frame: "a",
    secondsLeft: FIGMA_COUNTDOWN,
    rewards: [...baseRewards, { type: "card", label: "2" }],
    pinned: true,
    favorite: true,
    status: "active",
  },
  {
    id: "ice-king",
    title: "ภารกิจพิชิตราชาน้ำแข็ง",
    subMissionCount: 5,
    image: "/missions/art/ice-king.png",
    layout: "image-right",
    frame: "b",
    secondsLeft: FIGMA_COUNTDOWN,
    rewards: fullRewards,
    exclusive: true,
    pinned: false,
    favorite: false,
    status: "active",
  },
  {
    id: "sky-lord",
    title: "ภารกิจเจ้าเวหา",
    subMissionCount: 5,
    image: "/missions/art/eagle.png",
    layout: "image-left",
    frame: "c",
    secondsLeft: FIGMA_COUNTDOWN,
    rewards: [...baseRewards, { type: "card", label: "2" }, { type: "spin", label: "200" }],
    pinned: true,
    favorite: false,
    status: "active",
  },
  {
    id: "desert-run",
    title: "ภารกิจฝ่าด่านทะเลทราย",
    subMissionCount: 7,
    image: "/missions/art/chameleon.png",
    layout: "image-right",
    frame: "d",
    secondsLeft: FIGMA_COUNTDOWN,
    rewards: fullRewards,
    isNew: true,
    pinned: false,
    favorite: false,
    status: "active",
  },
  {
    id: "commando-bear",
    title: "ภารกิจเจ้าหมีคอมมานโด",
    subMissionCount: 3,
    image: "/missions/art/panda.png",
    layout: "image-left",
    frame: "e",
    period: "01/10/24 00:00 -31/10/24 23:59",
    rewards: baseRewards,
    isNew: true,
    pinned: false,
    favorite: true,
    status: "active",
  },
  {
    id: "ice-king-done",
    title: "ภารกิจพิชิตราชาน้ำแข็ง",
    subMissionCount: 5,
    image: "/missions/art/chameleon.png",
    layout: "image-right",
    frame: "f",
    secondsLeft: FIGMA_COUNTDOWN,
    rewards: fullRewards,
    pinned: false,
    favorite: false,
    status: "completed",
  },
  {
    id: "commando-bear-round",
    title: "ภารกิจเจ้าหมีคอมมานโด",
    subMissionCount: 3,
    image: "/missions/art/panda.png",
    layout: "image-left",
    frame: "g",
    period: "01/10/24 00:00 -31/10/24 23:59",
    rewards: baseRewards,
    pinned: false,
    favorite: false,
    status: "completed",
    remainingMissions: 2,
  },
];

export type MissionFilter = "all" | "pinned" | "favorite" | "new";

// Top-level tabs above the banner
export type MissionSection = "missions" | "history" | "redeem";

export type MissionBanner = {
  id: string;
  src: string;
  alt: string;
};

// Figma shows 4 dots but only 3 artworks, so the carousel uses the 3 real banners
export const missionBanners: MissionBanner[] = [
  {
    id: "mission-master-gold",
    src: "/missions/banners/mission-master-gold.jpg",
    alt: "The Mission Master — Mission accomplished, reap the rewards",
  },
  {
    id: "mission-rewards-neon",
    src: "/missions/banners/mission-rewards-neon.png",
    alt: "The Mission — Season of the rewards",
  },
  {
    id: "mission-master-red",
    src: "/missions/banners/mission-master-red.png",
    alt: "The Mission Master",
  },
];

// "1 วัน 22:34:23"
export function formatTimeLeft(totalSeconds: number) {
  if (totalSeconds <= 0) return "หมดเวลาแล้ว";
  const days = Math.floor(totalSeconds / 86400);
  const pad = (n: number) => String(n).padStart(2, "0");
  const hours = pad(Math.floor((totalSeconds % 86400) / 3600));
  const minutes = pad(Math.floor((totalSeconds % 3600) / 60));
  const seconds = pad(totalSeconds % 60);
  return days > 0 ? `${days} วัน ${hours}:${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
}
