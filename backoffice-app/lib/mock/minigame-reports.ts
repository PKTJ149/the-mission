// Mock data for the mini-game report pages, values exactly as captured on staging (2026-11-14):
// /report/promotion/minigame (+ its drill-down), /promotion/minigame/history and
// /promotion/minigame/minigame-period-deposit. Read only through lib/api/minigame-reports.ts.

import type {
  DepositCheckRow,
  MinigameDetail,
  MinigameOtherView,
  RightsPattern,
  SummaryRow,
  SummaryTotals,
} from "@/lib/api/minigame-reports";

// The three mini-games of staging (names copied from /promotion/mini-game-v2).
// `rightsCount` = rows each game has in the rights history (7103 + 7101 + 10 = 14214, the captured history total).
export const reportGames = [
  { id: "uuid-1", name: "QA Other Retest 20261015", type: "mini-game", rightsCount: 7103 },
  { id: "uuid-2", name: "QA Wheel Retest 20261015", type: "lucky-wheel", rightsCount: 7101 },
  { id: "uuid-3", name: "QA Test Wheel 0911", type: "lucky-wheel", rightsCount: 10 },
] as const;

// Summary table (state 1). Numbers are strings because the server sends them pre-formatted ("26.0000" next to "10").
export const summaryRows: SummaryRow[] = [
  {
    id: "uuid-1",
    name: "QA Other Retest 20261015",
    status: "active",
    agentIds: ["501"],
    eligiblePeople: "9",
    receivedPeople: "2",
    usableTimes: "7103",
    usedTimes: "9",
    credit: "26.0000",
    minigameRights: "2",
    lottoRights: "0",
    points: "0",
    rewards: "0",
  },
  {
    id: "uuid-2",
    name: "QA Wheel Retest 20261015",
    status: "active",
    agentIds: ["501"],
    eligiblePeople: "8",
    receivedPeople: "1",
    usableTimes: "7101",
    usedTimes: "5",
    credit: "18.0000",
    minigameRights: "0",
    lottoRights: "0",
    points: "0",
    rewards: "0",
  },
  {
    id: "uuid-3",
    name: "QA Test Wheel 0911",
    status: "active",
    agentIds: ["501"],
    eligiblePeople: "2",
    receivedPeople: "2",
    usableTimes: "10",
    usedTimes: "10",
    credit: "10",
    minigameRights: "0",
    lottoRights: "0",
    points: "0",
    rewards: "0",
  },
];

// "ยอดรวมทั้งหมด" row as captured (used while no filter hides a game)
export const summaryTotals: SummaryTotals = {
  eligiblePeople: "19",
  receivedPeople: "5",
  usableTimes: "14214",
  usedTimes: "24",
  credit: "54.0000",
  minigameRights: "2",
  lottoRights: "0",
  points: "0",
  rewards: "0",
};

// Drill-down card (#promotionDetailPanel). Only "QA Other Retest 20261015" was opened on staging;
// the two wheels reuse their summary-row numbers and the wheel image of their card on /promotion/mini-game-v2.
export const minigameDetails: MinigameDetail[] = [
  {
    id: "uuid-1",
    name: "QA Other Retest 20261015",
    type: "mini-game",
    descriptionHtml: "<p>ทดสอบมินิเกมส์อื่น ๆ และรางวัลครบสามประเภท บน staging</p>",
    status: "active",
    period: "-",
    image: "https://storage.googleapis.com/one-loyalty-stg-media/uploads/mini-game-image/20261015T045904756.png",
    promotionCustomerCount: "9",
    getPromotionCustomerCount: "2",
    promotionCount: "7103",
    getPromotionCount: "9",
    credit: "26",
    miniGameCount: "2",
    lottoCount: "0",
    pointCount: "0",
    rewardCount: "0",
  },
  {
    id: "uuid-2",
    name: "QA Wheel Retest 20261015",
    type: "lucky-wheel",
    descriptionHtml: "",
    status: "active",
    period: "-",
    image: "https://p88.blob.core.windows.net/images/minigame/wheel-8/button.png",
    promotionCustomerCount: "8",
    getPromotionCustomerCount: "1",
    promotionCount: "7101",
    getPromotionCount: "5",
    credit: "18",
    miniGameCount: "0",
    lottoCount: "0",
    pointCount: "0",
    rewardCount: "0",
  },
  {
    id: "uuid-3",
    name: "QA Test Wheel 0911",
    type: "lucky-wheel",
    descriptionHtml: "",
    status: "active",
    period: "-",
    image: "https://storage.googleapis.com/one-loyalty-stg-media/uploads/setting-minigame/20261109T071553326.png",
    promotionCustomerCount: "2",
    getPromotionCustomerCount: "2",
    promotionCount: "10",
    getPromotionCount: "10",
    credit: "10",
    miniGameCount: "0",
    lottoCount: "0",
    pointCount: "0",
    rewardCount: "0",
  },
];

// Page 1 of the rights history / drill-down (both captured with the same 10 rows).
// Only page 1 exists in the capture; lib/api repeats these 10 rows to fill the captured totals.
export const rightsPattern: RightsPattern[] = [
  { credit: "4", minigameRights: "0" },
  { credit: "5", minigameRights: "0" },
  { credit: "4", minigameRights: "0" },
  { credit: "1", minigameRights: "0" },
  { credit: "0", minigameRights: "1" },
  { credit: "6", minigameRights: "0" },
  { credit: "4", minigameRights: "0" },
  { credit: "1", minigameRights: "0" },
  { credit: "0", minigameRights: "1" },
  { credit: "5", minigameRights: "0" },
];

// Shared by every captured row
export const rightsRowDefaults = {
  date: "12/11/2026 07:37",
  username: "0Tsuperx81403971005",
  gameUsername: "0Tsuperx81403971005",
  category: "auto",
  status: "waiting",
  makeBy: "auto",
  agentId: "501",
} as const;

// Filter options (value | text exactly as captured)
export const agentOptions = [
  { value: " ", label: "ทั้งหมด" },
  { value: "669", label: "superxx" },
  { value: "501", label: "superx" },
];
export const makeByOptions = ["auto", "superx"];

// Customers the manual-promotion picker can find. The capture only shows the empty "ไม่พบข้อมูล" state,
// so these are the usernames seen in the report tables.
export const customers = [
  { username: "0Tsuperx81403971005", gameUsername: "0Tsuperx81403971005" },
  { username: "0Tsuperx97420509115", gameUsername: "0Tsuperx97420509115" },
];

// "รางวัลที่จะเพิ่มให้" options per mini-game. Not captured (filled after choosing a mini-game):
// the other-type game uses its reward descriptions, the 8-slice wheels "Wheel 1" … "Wheel 8".
export const rewardPieces: Record<string, string[]> = {
  "uuid-1": [
    "QA เครดิตคงที่ 1 บาท",
    "QA เครดิต 1% สูงสุด 1 บาท",
    "QA สิทธิ์วงล้อ 1 สิทธิ์",
    "QA เครดิตคงที่ 4 บาท",
    "QA เครดิตคงที่ 5 บาท",
    "QA เครดิตคงที่ 6 บาท",
  ],
  "uuid-2": Array.from({ length: 8 }, (_, index) => `Wheel ${index + 1}`),
  "uuid-3": Array.from({ length: 8 }, (_, index) => `Wheel ${index + 1}`),
};

// View offcanvas of "QA Other Retest 20261015" (eye button in the drill-down card)
export const minigameOtherViews: Record<string, MinigameOtherView> = {
  "uuid-1": {
    title: "รายละเอียดเกมส์อื่น ๆ",
    headerText: "สรุปข้อมูลการตั้งค่าเกมส์อื่นๆ ของคุณ",
    tabTitle: "สรุปรายละเอียดมินิเกมส์",
    image: "https://storage.googleapis.com/one-loyalty-stg-media/uploads/mini-game-image/20261015T045904756.png",
    statusOn: true,
    // ORIGINAL: the view shows this name, not the card name "QA Other Retest 20261015" (data as captured)
    name: "ฝากประจำนับโปร ทุกวัน รับไม่เว้น ไม่เน้น รับไปเล้ย",
    conditionHtml: "<p>ทดสอบมินิเกมส์อื่น ๆ และรางวัลครบสามประเภท บน staging</p>",
    agents: ["superx"],
    period: "-",
    countdownOn: false,
    promotionLimit: { on: false, perDay: "0 สิทธิ์", perWeek: "0 สิทธิ์", perMonth: "0 สิทธิ์", perPromotion: "0 สิทธิ์" },
    personLimit: { on: false, perTime: "0 สิทธิ์", perDay: "0 สิทธิ์", perWeek: "0 สิทธิ์", perMonth: "0 สิทธิ์", perPromotion: "0 สิทธิ์" },
    customerGroupLimitOn: false,
    resetOn: false,
    removeChanceOn: false,
    otherLimit: { on: false, perGamePerDay: "0 สิทธิ์", ifHasRights: "0 สิทธิ์", balance: "0 บาท" },
    conditionGetBonus: "ฝากครั้งเดียว ฝากขั้นต่ำ 1 บาท",
    numberOfParts: "มินิเกมส์ 6 ชิ้น",
    rewards: [
      { description: "QA เครดิตคงที่ 1 บาท", quantity: "ไม่จำกัดจำนวนแจก", alert: "ไม่แจ้งเตือน", chance: "17%", bonus: "เครดิต Fixed Rate", value: "1 บาท" },
      {
        description: "QA เครดิต 1% สูงสุด 1 บาท",
        quantity: "ไม่จำกัดจำนวนแจก",
        alert: "ไม่แจ้งเตือน",
        chance: "17%",
        bonus: "เครดิต เป็น Percentage (%)",
        value: "1 % จากยอดฝาก สูงสุดไม่เกิน 1 บาท",
      },
      {
        description: "QA สิทธิ์วงล้อ 1 สิทธิ์",
        quantity: "ไม่จำกัดจำนวนแจก",
        alert: "ไม่แจ้งเตือน",
        chance: "17%",
        bonus: "สิทธิ์มินิเกมส์",
        // ORIGINAL: legacy JS builds `${minigameBonuseName} ${quota} สิทธิ์` from an input that does not exist
        // in view mode, so staging literally shows "undefined 1 สิทธิ์".
        value: "undefined 1 สิทธิ์",
      },
      { description: "QA เครดิตคงที่ 4 บาท", quantity: "ไม่จำกัดจำนวนแจก", alert: "ไม่แจ้งเตือน", chance: "17%", bonus: "เครดิต Fixed Rate", value: "4 บาท" },
      { description: "QA เครดิตคงที่ 5 บาท", quantity: "ไม่จำกัดจำนวนแจก", alert: "ไม่แจ้งเตือน", chance: "16%", bonus: "เครดิต Fixed Rate", value: "5 บาท" },
      { description: "QA เครดิตคงที่ 6 บาท", quantity: "ไม่จำกัดจำนวนแจก", alert: "ไม่แจ้งเตือน", chance: "16%", bonus: "เครดิต Fixed Rate", value: "6 บาท" },
    ],
    turnover: { on: false, value: "0 บาท" },
    withdraw: { on: false, minRemainCredit: "0 บาท", maxWithdraw: "0 บาท" },
    clearTurnover: { on: false, value: "0 %" },
    increaseTurnoverOn: false,
  },
};

// /promotion/minigame/minigame-period-deposit: staging only had the empty state, and no captured script
// shows the row markup (rows are server-rendered HTML, see legacy-js/table.js), so there are no rows to mock.
export const depositCheckRows: DepositCheckRow[] = [];
