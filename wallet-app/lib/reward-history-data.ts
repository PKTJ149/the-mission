// Mock data for the "ประวัติรับรางวัล" and "แลกรางวัล" tabs on the mission page
// (Figma 50:36845 and 50:35493). Will come from the Back office later — keep this shape.

const ICONS = "/missions/icons";

// Reward kinds shown in history and on the redeem price list, with their Figma icons
export const rewardKinds = {
  credit: { icon: `${ICONS}/coin.svg`, name: "เครดิต" },
  points: { icon: `${ICONS}/point-coin.svg`, name: "แต้มสะสม" },
  wheel: { icon: `${ICONS}/color-wheel.svg`, name: "สิทธิ์หมุนวงล้อ" },
  minigame: { icon: `${ICONS}/minigame.svg`, name: "สิทธิ์เล่นมินิเกมส์" },
  promo: { icon: `${ICONS}/megaphone.svg`, name: "สิทธิ์รับโปรโมชั่น" },
  spin: { icon: `${ICONS}/free-spin.svg`, name: "ฟรีสปิน" },
  prize: { icon: `${ICONS}/gift-voucher.svg`, name: "ของรางวัล" },
} as const;

export type RewardKind = keyof typeof rewardKinds;

// ---------- แลกรางวัล ----------

// What points can be swapped for
export const redeemOptions: { kind: RewardKind; label: string; cost: string }[] = [
  { kind: "credit", label: "100 เครดิต", cost: "1,000" },
  { kind: "credit", label: "1,000 เครดิต", cost: "90,000" },
  { kind: "wheel", label: "สิทธิ์หมุนวงล้อ 1 สิทธิ์", cost: "500" },
  { kind: "minigame", label: "สิทธิ์มินิเกมส์ 1 สิทธิ์", cost: "500" },
];

// Points earned (+) and spent (−), newest first
export type PointsEntry = {
  type: "earn" | "redeem";
  detail: string;
  date: string;
  amount: number;
};

export const pointsLedger: PointsEntry[] = [
  { type: "redeem", detail: "ของรางวัล - ไอโฟน 12", date: "01/02/2024 15:30", amount: -100000 },
  { type: "earn", detail: "ภารกิจ - ไพ่ปริศนาพารวย", date: "01/02/2024 13:30", amount: 5000000 },
  { type: "redeem", detail: "ของรางวัล - ไอโฟน 12", date: "01/02/2024 15:30", amount: -10000 },
  { type: "earn", detail: "ภารกิจ - ไพ่ปริศนาพารวย", date: "01/02/2024 13:30", amount: 20000 },
  { type: "redeem", detail: "ของรางวัล - หมวยหมายพาน", date: "01/02/2024 17:45", amount: -30000 },
  { type: "earn", detail: "ภารกิจ - ช่างต่อนโบสถ์", date: "01/02/2024 14:15", amount: 40000 },
  { type: "redeem", detail: "ของรางวัล - สาวเครื่องหมาย", date: "01/02/2024 18:00", amount: -50000 },
  { type: "earn", detail: "ภารกิจ - นายโต๊ะประทีป", date: "01/02/2024 12:00", amount: 60000 },
  { type: "redeem", detail: "ของรางวัล - กาวัยกานพายยา", date: "01/02/2024 19:30", amount: -70000 },
  { type: "earn", detail: "ภารกิจ - มินิลิสต์สัญญาณ", date: "01/02/2024 16:45", amount: 80000 },
];

// ---------- ประวัติรับรางวัล ----------

export const missionStats = [
  { label: "ภารกิจหลักสำเร็จ", value: "11", unit: "ภารกิจ" },
  { label: "ภารกิจย่อยสำเร็จ", value: "64", unit: "ภารกิจ" },
];

export const rewardStats: { kind: RewardKind; label: string; value: string; unit: string }[] = [
  { kind: "credit", label: "เครดิต", value: "2,380", unit: "เครดิต" },
  { kind: "points", label: "แต้มสะสม", value: "480", unit: "แต้ม" },
  { kind: "wheel", label: "สิทธิ์หมุนวงล้อ", value: "32", unit: "สิทธิ์" },
  { kind: "minigame", label: "สิทธิ์เล่นมินิเกมส์", value: "44", unit: "สิทธิ์" },
  { kind: "promo", label: "สิทธิ์รับโปรโมชั่น", value: "35", unit: "สิทธิ์" },
  { kind: "spin", label: "Free Spin", value: "5", unit: "สิทธิ์" },
  { kind: "prize", label: "ของรางวัล (ชิ้น)", value: "1", unit: "ชิ้น" },
];

export type RewardHistoryEntry = {
  date: string;
  mission: string;
  rewards: { kind: RewardKind; amount: string; unit: string }[];
};

const firstPage: RewardHistoryEntry[] = [
  {
    date: "24/11/24 11:32",
    mission: "ภารกิจพิชิตราชาภูเขาน้ำแข็ง",
    rewards: [{ kind: "credit", amount: "+100", unit: "เครดิต" }],
  },
  {
    date: "24/11/24 11:32",
    mission: "ภารกิจพิชิตราชาภูเขาน้ำแข็ง - เข้าสู่ระบบเช็คอินประจำวัน",
    rewards: [{ kind: "points", amount: "+50", unit: "แต้ม" }],
  },
  {
    date: "24/11/24 11:32",
    mission: "ภารกิจล่าจอมมาร",
    rewards: [
      { kind: "credit", amount: "+100", unit: "เครดิต" },
      { kind: "points", amount: "+100", unit: "แต้ม" },
      { kind: "wheel", amount: "+2", unit: "สิทธิ์" },
      { kind: "minigame", amount: "+2", unit: "สิทธิ์" },
      { kind: "spin", amount: "+20", unit: "สปิน" },
    ],
  },
  {
    date: "24/11/24 11:32",
    mission: "ภารกิจพิชิตราชาภูเขาน้ำแข็ง - เข้าสู่ระบบเช็คอินประจำวัน",
    rewards: [{ kind: "points", amount: "+50", unit: "แต้ม" }],
  },
  {
    date: "24/11/24 11:32",
    mission: "ภารกิจพิชิตราชาภูเขาน้ำแข็ง",
    rewards: [{ kind: "credit", amount: "+100", unit: "เครดิต" }],
  },
];

// Figma shows 5 pages; older pages repeat page 1 one day earlier each
export const rewardHistoryPages: RewardHistoryEntry[][] = Array.from({ length: 5 }, (_, page) =>
  firstPage.map((entry) => ({ ...entry, date: entry.date.replace("24/11", `${24 - page}/11`) })),
);
