// Data functions for the mini-game pages.
// Pages call these instead of touching mock data directly, so later each body can be
// swapped for a real fetch() to the original endpoint without changing any page.

import {
  agents,
  customerGroups,
  gameProviders,
  miniGameCreators,
  miniGames,
} from "@/lib/mock/mini-games";

export type MiniGameType = "mini-game" | "lucky-wheel";
export type MiniGameStatus = "active" | "inactive";

// One "bonus pill" on a card: how many times slice N was given out (openModalShowWheelDetail args)
export type MiniGameBonusCount = {
  index: number;
  givenOut: number;
  isUnlimited: boolean;
  limitAmount: number;
};

// One bonus row of a slice ("เพิ่มโบนัส" repeater). Only credit_fix was captured.
export type MiniGameSliceBonus = {
  type: "credit_fix" | "credit_percentage" | "point" | "mini-game" | "lotto" | "reward";
  credit?: string;
  percent?: string; // credit_percentage: "% คิดจากยอดฝาก"
  maxCredit?: string; // credit_percentage: "สูงไม่เกิน" (baht)
  gameId?: string; // mini-game: the coupon's mini-game (id of the list)
  quota?: string; // mini-game: "จำนวนสิทธิ์"
};

// One "Wheel N" / "ตั้งค่ารางวัลตัวเลือกที่ N" section of the wizard (step 4)
export type MiniGameSlice = {
  description: string;
  percentage: string;
  isUnlimited: boolean;
  isAlert: boolean;
  bonuses: MiniGameSliceBonus[];
};

// Values the wizard loads in edit / detail mode (POST /api/promotion/lucky-wheel/get/)
export type MiniGameDetail = {
  conditionTh: string; // CKEditor HTML
  depositType: "deposit-once" | "accumulated-deposit" | "continuous-deposit";
  amountType: "min-deposit" | "max-deposit" | "equal-deposit" | "deposit-period";
  minAmount: string;
  bonusTiming: "before" | "after"; // ได้รับก่อน / หลังทำเทิร์นโอเวอร์สำเร็จ
  times: { start: string; end: string }[];
  slices: MiniGameSlice[];
};

export type MiniGame = {
  id: string;
  name: string;
  type: MiniGameType;
  status: MiniGameStatus;
  agentIds: string[]; // values of the Agent dropdown ("501" = superx)
  createdBy: string;
  updatedBy: string;
  createdAt: string; // as shown on the card: "dd/mm/yyyy HH:mm" (Bangkok)
  updatedAt: string;
  // Card thumbnail: the 3-part wheel for lucky-wheel, a cover image for mini-game
  wheel: { slices: string[]; spin: string; frame: string } | null;
  cover: string | null;
  icon?: string; // play-page icon uploaded in step 1 of the wizard (the default icon when missing)
  bonusCounts: MiniGameBonusCount[];
  detail: MiniGameDetail;
};

export type Agent = { value: string; label: string };

// category: sport | game | casino | lotto drive the tabs; other values (fishing-game, p2p…) are in no tab
export type GameProvider = { id: string; code: string; name: string; category: string };

// Original: POST /api/promotion/mini-game-v2 (the list on /promotion/mini-game-v2).
// The server filters and returns ready-made card HTML; the page filters this list itself.
export async function getMiniGames(): Promise<MiniGame[]> {
  // ORIGINAL: on page load the original also fires POST /api/promotion/mini-game/update-sequence-auto
  // (re-saves the card order). Nothing is sent here.
  // A copy, so a page editing its own state can never change the mock source
  return structuredClone(miniGames);
}

// Original: GET /api/agent/get-credit-agent (Agent filter + wizard Agent dropdown)
export async function getAgents(): Promise<Agent[]> {
  return structuredClone(agents);
}

// Original: POST /api/staff/select2 ("ผู้สร้างมินิเกมส์" filter)
export async function getMiniGameCreators(): Promise<string[]> {
  return [...miniGameCreators];
}

// Original: POST /api/promotion/check-mini-game-name { name } → data true when the name is free
export async function checkMiniGameName(name: string, list: MiniGame[]): Promise<boolean> {
  return !list.some((game) => game.name === name);
}

// Original: GET /api/promotion/get-game-provider-list (step 2-3 game provider checklist)
export async function getGameProviders(): Promise<GameProvider[]> {
  return structuredClone(gameProviders);
}

// Customer groups of the step 2-3 "จำกัดการรับสิทธิ์ของกลุ่มลูกค้า" dropdown (rendered by the server)
export async function getCustomerGroups(): Promise<Agent[]> {
  return structuredClone(customerGroups);
}
