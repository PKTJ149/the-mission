import type { IncomeWallet } from "@/components/wallet/income-wallets";
import type { QuickMenuItem } from "@/components/wallet/quick-menu";

// Mock data — shared by the mobile and desktop layouts. Replace with real data later.

export const user = {
  username: "0tdemo03994885",
  avatarSrc: "/wallet/avatar.png",
};

export const mainWallet = {
  amountWhole: "150,322.",
  amountDecimal: "30",
  updatedAt: "24/11/2016  -  13:23:22",
};

export const incomeWallets: IncomeWallet[] = [
  {
    label: "เงินคืน",
    amount: "250.45",
    icon: "hand-coins-sm",
    amountColor: "gold",
    labelRight: 14,
    shapeLeft: -121,
    canWithdraw: true,
  },
  {
    label: "แนะนำเพื่อน",
    amount: "0.00",
    icon: "heart-handshake-sm",
    amountColor: "gold-text",
    labelRight: 12,
    shapeLeft: -99,
    canWithdraw: false,
  },
];

export const bonusWallet = {
  amount: "2,230.43",
  promotion: "สมาชิกใหม่ฝากครั้งแรกรับโบนัส 20 %...",
  turnoverLabel: "2,650 / 5,000",
  turnoverProgress: (198.4 / 362) * 100, // matches the Figma bar width
  timeLeft: "20 : 43 : 21",
};

export const quickMenuItems: QuickMenuItem[] = [
  { label: "โปรโมชั่น", icon: "megaphone" },
  { label: "ประวัติ", icon: "history" },
  { label: "แนะนำเพื่อน", icon: "heart-handshake" },
  { label: "ฝาก - ถอน", icon: "banknote-arrow-up" },
  { label: "วงล้อลุ้นล้าน", icon: "ferris-wheel" },
  { label: "กล่องสุ่ม", icon: "box" },
  { label: "ภารกิจ", icon: "goal", href: "/missions" },
];

// Desktop-only sections (mock content + mock artwork in /public/wallet)

export type Promotion = {
  tag: string;
  title: string;
  description: string;
  image: string;
};

export const promotions: Promotion[] = [
  {
    tag: "สมาชิกใหม่",
    title: "ฝากครั้งแรกรับโบนัส 20%",
    description: "รับโบนัสเพิ่มทันทีเมื่อฝากครั้งแรก สูงสุด ฿2,000",
    image: "/wallet/promos/promo-bonus.svg",
  },
  {
    tag: "ทุกวัน",
    title: "วงล้อลุ้นล้าน",
    description: "หมุนฟรีวันละ 1 ครั้ง ลุ้นรางวัลใหญ่ทุกวัน",
    image: "/wallet/promos/promo-wheel.svg",
  },
  {
    tag: "ภารกิจ",
    title: "ทำภารกิจครบ รับกล่องสุ่ม",
    description: "สะสมภารกิจรายวันให้ครบ เปิดกล่องลุ้นเครดิตฟรี",
    image: "/wallet/promos/promo-mission.svg",
  },
];

export type GameProvider = {
  name: string;
  games: number;
  logo: string;
  badge?: string;
};

// Fictional provider names — swap in real providers and their official logos later
export const gameProviders: GameProvider[] = [
  { name: "Aurum Play", games: 128, logo: "/wallet/providers/aurum.svg", badge: "ยอดนิยม" },
  { name: "Nova Spin", games: 96, logo: "/wallet/providers/nova.svg" },
  { name: "Jade Gaming", games: 74, logo: "/wallet/providers/jade.svg" },
  { name: "Lucky Reels", games: 152, logo: "/wallet/providers/reel.svg", badge: "ใหม่" },
  { name: "Ember Studio", games: 61, logo: "/wallet/providers/ember.svg" },
  { name: "Orbit Games", games: 88, logo: "/wallet/providers/orbit.svg" },
  { name: "Mystic Moon", games: 45, logo: "/wallet/providers/mystic.svg" },
  { name: "Clover Live", games: 39, logo: "/wallet/providers/clover.svg" },
];
