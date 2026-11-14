// Mock data for /promotion/mini-game-v2, values exactly as captured on staging (2026-11-14).
// Read only through lib/api/mini-games.ts.

import type { Agent, GameProvider, MiniGame, MiniGameBonusCount, MiniGameDetail, MiniGameSlice } from "@/lib/api/mini-games";

const WHEEL_8 = "https://p88.blob.core.windows.net/images/minigame/wheel-8";

const wheel8Slices = Array.from({ length: 8 }, (_, i) => `${WHEEL_8}/pie-${i + 1}.png`);

// Bonus pills are always "unlimited" (nolimit icon) in the capture
const counts = (givenOut: number[]): MiniGameBonusCount[] =>
  givenOut.map((value, i) => ({ index: i + 1, givenOut: value, isUnlimited: true, limitAmount: 0 }));

// Slice values loaded by "แก้ไขข้อมูล" on "QA Test Wheel 0911" (edit-lucky-wheel_filled-values.json)
const qaSlices = (count: number): MiniGameSlice[] =>
  Array.from({ length: count }, (_, i) => ({
    description: `QA เครดิต ${i + 1} บาท`,
    percentage: "0",
    isUnlimited: true,
    isAlert: false,
    bonuses: [{ type: "credit_fix", credit: "1" }],
  }));

// Only the detail of "QA Test Wheel 0911" was captured; the other two reuse its values (guess).
const qaDetail = (slices: number): MiniGameDetail => ({
  conditionTh: "<p>QA test wheel: deposit 1 baht to get 1 spin</p>",
  depositType: "deposit-once",
  amountType: "min-deposit",
  minAmount: "1",
  bonusTiming: "before",
  times: [{ start: "00:00", end: "23:59" }],
  slices: qaSlices(slices),
});

export const miniGames: MiniGame[] = [
  {
    id: "uuid-1",
    name: "QA Test Wheel 0911",
    type: "lucky-wheel",
    status: "active",
    agentIds: ["501"],
    createdBy: "superx",
    updatedBy: "superx",
    createdAt: "09/11/2026 13:02",
    updatedAt: "09/11/2026 14:15",
    wheel: {
      slices: wheel8Slices,
      spin: "https://storage.googleapis.com/one-loyalty-stg-media/uploads/setting-minigame/20261109T071553326.png",
      frame: `${WHEEL_8}/frame.png`,
    },
    cover: null,
    bonusCounts: counts([3, 2, 2, 1, 1, 1, 0, 0]),
    detail: qaDetail(8),
  },
  {
    id: "uuid-2",
    name: "QA Wheel Retest 20261015",
    type: "lucky-wheel",
    status: "active",
    agentIds: ["501"],
    createdBy: "superx",
    updatedBy: "superx",
    createdAt: "15/10/2026 11:49",
    updatedAt: "15/10/2026 13:21",
    wheel: { slices: wheel8Slices, spin: `${WHEEL_8}/button.png`, frame: `${WHEEL_8}/frame.png` },
    cover: null,
    bonusCounts: counts([923, 923, 923, 923, 853, 852, 852, 852]),
    detail: qaDetail(8),
  },
  {
    id: "uuid-3",
    name: "QA Other Retest 20261015",
    type: "mini-game",
    status: "active",
    agentIds: ["501"],
    createdBy: "superx",
    updatedBy: "superx",
    createdAt: "15/10/2026 13:14",
    updatedAt: "15/10/2026 13:18",
    wheel: null,
    cover: "https://storage.googleapis.com/one-loyalty-stg-media/uploads/mini-game-image/20261015T045904756.png",
    bonusCounts: counts([1207, 1208, 1208, 1208, 1136, 1136]),
    detail: qaDetail(6),
  },
];

// "Agent ที่ใช้งาน" filter + wizard "เลือก Agent" dropdown
export const agents: Agent[] = [
  { value: "669", label: "superxx" },
  { value: "501", label: "superx" },
];

// "ผู้สร้างมินิเกมส์" filter (POST /api/staff/select2)
export const miniGameCreators = ["superx"];

// Step 2-3 "กลุ่มลูกค้า" dropdown
export const customerGroups: Agent[] = [
  { value: "1349", label: "SEO (กลุ่มสมาชิกทั่วไป)" },
  { value: "1386", label: "test" },
  { value: "1492", label: "ทดสอบถอนรวม" },
  { value: "1525", label: "ทดสอบ Gateway" },
  { value: "1567", label: "SigmaP2P" },
  { value: "1569", label: "ทดสอบเกตเวย์ QR" },
  { value: "1648", label: "ทดสอบสร้างกลุ่ม 01" },
  { value: "1673", label: "ปิดทุกสำหรับสมัครจากหน้าเว็บ" },
  { value: "1691", label: "test one2coin pay" },
  { value: "1697", label: "Lineliff Player" },
  { value: "1747", label: "test redesign" },
];

// Step 2-3 game provider checklist, in the captured order (ids/codes/categories from the same
// provider list captured on /mission/setting; sport providers come last and are shown first)
export const gameProviders: GameProvider[] = [
  { id: "15", code: "ab", name: "ALLBET", category: "casino" },
  { id: "87", code: "amigo", name: "AMIGO", category: "game" },
  { id: "63", code: "astar", name: "ASTAR", category: "casino" },
  { id: "46", code: "ADVANTPLAY", name: "Advantplay", category: "game" },
  { id: "88", code: "allbet", name: "Allbet Game", category: "game" },
  { id: "56", code: "bng", name: "BNG", category: "game" },
  { id: "54", code: "btgaming", name: "BT Gaming", category: "game" },
  { id: "50", code: "bg", name: "Big Gaming", category: "casino" },
  { id: "90", code: "cg", name: "CG Casino", category: "casino" },
  { id: "94", code: "cp", name: "CP Gaming", category: "game" },
  { id: "19", code: "dg", name: "DG Casino", category: "casino" },
  { id: "69", code: "dragoonsoft", name: "DragoonSoft", category: "game" },
  { id: "3", code: "evolution", name: "Evolution", category: "casino" },
  { id: "53", code: "expanse", name: "Expanse", category: "game" },
  { id: "72", code: "fachai", name: "Fachai", category: "game" },
  { id: "2", code: "fastspin", name: "FastSpin", category: "game" },
  { id: "95", code: "fungaming", name: "Fun Gaming", category: "game" },
  { id: "30", code: "gpi", name: "GPI Game", category: "game" },
  { id: "32", code: "gw", name: "Gaming World", category: "game" },
  { id: "29", code: "haba", name: "Habanero", category: "game" },
  { id: "75", code: "hotdog", name: "Hotdog Gaming", category: "game" },
  { id: "82", code: "iamlotto", name: "IAM LOTTO", category: "lotto" },
  { id: "5", code: "jili", name: "JILI", category: "game" },
  { id: "27", code: "jk", name: "Joker", category: "game" },
  { id: "36", code: "ka", name: "KA Game", category: "game" },
  { id: "33", code: "kingmaker", name: "KingMaker", category: "game" },
  { id: "76", code: "rbsevenlotto", name: "Lotto Plus", category: "lotto" },
  { id: "57", code: "megawin", name: "MEGAWIN", category: "game" },
  { id: "41", code: "mp", name: "MPoker", category: "game" },
  { id: "59", code: "mylotto99", name: "MYLOTTO99", category: "lotto" },
  { id: "71", code: "mangoplay", name: "MangoPlay", category: "casino" },
  { id: "84", code: "microgame", name: "Micro Gaming", category: "game" },
  { id: "48", code: "naga", name: "NAGA GAMES", category: "game" },
  { id: "25", code: "nextspin", name: "Next Spin", category: "game" },
  { id: "73", code: "nolimitcity", name: "Nolimit City", category: "game" },
  { id: "24", code: "ps", name: "Play Star", category: "game" },
  { id: "38", code: "playtech", name: "Playtech", category: "game" },
  { id: "38", code: "playtech", name: "Playtech", category: "casino" },
  { id: "78", code: "pgsoft", name: "Pocket Game (PG)", category: "game" },
  { id: "43", code: "pp", name: "PragmaticPlay", category: "game" },
  { id: "43", code: "pp", name: "PragmaticPlay", category: "casino" },
  { id: "20", code: "pretty", name: "Pretty Gaming", category: "casino" },
  { id: "22", code: "qqkeno", name: "QQKeno", category: "lotto" },
  { id: "86", code: "audi", name: "RB7 Casino", category: "casino" },
  { id: "70", code: "rbsevenslot", name: "RB7 Slot", category: "game" },
  { id: "47", code: "rich", name: "RICH88", category: "game" },
  { id: "80", code: "relax", name: "Relax Gaming", category: "game" },
  { id: "18", code: "sa", name: "SA Casino", category: "casino" },
  { id: "16", code: "sexy", name: "Sexy", category: "casino" },
  { id: "31", code: "spsg", name: "SimplePlay", category: "game" },
  { id: "44", code: "sw", name: "Sky Wind", category: "game" },
  { id: "44", code: "sw", name: "Sky Wind", category: "casino" },
  { id: "26", code: "fg", name: "Spadegaming", category: "game" },
  { id: "85", code: "vivo", name: "Vivo Gaming", category: "casino" },
  { id: "83", code: "vplus", name: "Vplus", category: "game" },
  { id: "1", code: "wcasino", name: "WCASINO", category: "casino" },
  { id: "17", code: "wm", name: "WM", category: "casino" },
  { id: "58", code: "yeebet", name: "YEEBET", category: "casino" },
  { id: "81", code: "alize", name: "alize", category: "game" },
  { id: "62", code: "uuslots", name: "uuslots", category: "game" },
  { id: "9", code: "muaypukyok", name: "ONE BX", category: "sport" },
  { id: "11", code: "sabasport", name: "SABA", category: "sport" },
  { id: "12", code: "sbo", name: "SBO", category: "sport" },
  { id: "7", code: "newsportbook", name: "SPORT LSM", category: "sport" },
];
