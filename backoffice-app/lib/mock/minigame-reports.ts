// Mock data for the mini-game report pages, values exactly as captured on staging (2026-11-14):
// /report/promotion/minigame (+ its drill-down), /promotion/minigame/history and
// /promotion/minigame/minigame-period-deposit. Read only through lib/api/minigame-reports.ts.

import type {
  DepositCheckRow,
  DetailCounts,
  MinigameDetail,
  MinigameView,
  RightsPattern,
  RightsStatus,
  SummaryRow,
  SummaryTotals,
  UsedRight,
} from "@/lib/api/minigame-reports";

// The three mini-games of staging (names copied from /promotion/mini-game-v2).
// `waitingCount` = "รอใช้โปร" rows each game has (drill-down filtered by status on staging, 15/11). With the
// "ใช้โปรแล้ว" rows in `usedRights` that makes 7103 + 7101 + 10 = 14214, the history total.
export const reportGames = [
  { id: "uuid-1", name: "QA Other Retest 20261015", type: "mini-game", waitingCount: 7094 },
  { id: "uuid-2", name: "QA Wheel Retest 20261015", type: "lucky-wheel", waitingCount: 7096 },
  { id: "uuid-3", name: "QA Test Wheel 0911", type: "lucky-wheel", waitingCount: 0 },
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

// Drill-down card (#promotionDetailPanel), as staging shows it for each game (checked 15/11).
// For the wheels `image` is the centre (spin) image; the 8 slices + frame are the shared WHEEL_8_ART.
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
    descriptionHtml: "<p>ทดสอบวงล้อ Happy flow หลังแก้ไข บน staging</p>",
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
    descriptionHtml: "<p>QA test wheel: deposit 1 baht to get 1 spin</p>",
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

// Base URL of the 8-slice wheel art (pie-1..8.png, frame.png) both lucky wheels use in the drill-down card
export const WHEEL_8_ART = "https://p88.blob.core.windows.net/images/minigame/wheel-8/";

// Drill-down card numbers when the "สถานะ" filter is set (POST /api/report/summary-mini-game gets the filter
// too). Measured on staging 15/11; a status missing here shows all zeros.
const zeroCounts: DetailCounts = {
  promotionCustomerCount: "0",
  getPromotionCustomerCount: "0",
  promotionCount: "0",
  getPromotionCount: "0",
  credit: "0",
  miniGameCount: "0",
  lottoCount: "0",
  pointCount: "0",
  rewardCount: "0",
};
const counts = (values: [string, string, string, string, string, string]): DetailCounts => ({
  ...zeroCounts,
  promotionCustomerCount: values[0],
  getPromotionCustomerCount: values[1],
  promotionCount: values[2],
  getPromotionCount: values[3],
  credit: values[4],
  miniGameCount: values[5],
});
export const detailCountsByStatus: Record<string, Partial<Record<RightsStatus, DetailCounts>>> = {
  "uuid-1": { waiting: counts(["8", "0", "7094", "0", "0", "0"]), accept: counts(["2", "2", "9", "9", "26", "2"]) },
  "uuid-2": { waiting: counts(["8", "0", "7096", "0", "0", "0"]), accept: counts(["1", "1", "5", "5", "18", "0"]) },
  "uuid-3": { accept: counts(["2", "2", "10", "10", "10", "0"]) },
};
export const emptyDetailCounts = zeroCounts;

// "รอใช้โปร" rows: only the first pages of each game are known (12/11/2026 07:37, auto, 0Tsuperx81403971005);
// lib/api repeats a game's known rows to fill its waitingCount — a stand-in, not real data (staging's
// later pages hold other dates/users, e.g. 15/10/2026 rows of 0Tsuperx58528064595 on the last page).
// uuid-1: pages 1-4 as staging shows them (15/11)
const p = (credit: string, minigameRights: string): RightsPattern => ({ credit, minigameRights });
export const rightsPatterns: Record<string, RightsPattern[]> = {
  "uuid-1": [
    p("4", "0"), p("5", "0"), p("4", "0"), p("1", "0"), p("0", "1"), p("6", "0"), p("4", "0"), p("1", "0"), p("0", "1"), p("5", "0"),
    p("0", "1"), p("0", "1"), p("6", "0"), p("1", "0"), p("4", "0"), p("6", "0"), p("1", "0"), p("6", "0"), p("0", "1"), p("5", "0"),
    p("5", "0"), p("6", "0"), p("1", "0"), p("0", "1"), p("5", "0"), p("5", "0"), p("1", "0"), p("1", "0"), p("4", "0"), p("5", "0"),
    p("4", "0"), p("1", "0"), p("0", "1"), p("4", "0"), p("1", "0"), p("6", "0"), p("0", "1"), p("6", "0"), p("0", "1"), p("5", "0"),
  ],
  "uuid-2": [
    { credit: "8", minigameRights: "0" },
    { credit: "7", minigameRights: "0" },
    { credit: "7", minigameRights: "0" },
    { credit: "6", minigameRights: "0" },
    { credit: "1", minigameRights: "0" },
    { credit: "1", minigameRights: "0" },
    { credit: "6", minigameRights: "0" },
    { credit: "8", minigameRights: "0" },
    { credit: "4", minigameRights: "0" },
    { credit: "0", minigameRights: "1" },
  ],
};

// Shared by every "รอใช้โปร" row
export const rightsRowDefaults = {
  date: "12/11/2026 07:37",
  username: "0Tsuperx81403971005",
  gameUsername: "0Tsuperx81403971005",
  category: "auto",
  status: "waiting",
  makeBy: "auto",
  agentId: "501",
} as const;

// Every "ใช้โปรแล้ว" row on staging (15/11), newest first per game. Manual rows have an empty username
// (staging shows an empty link and "()"). `accepted` = the "ใช้โปรแล้ว" time in the (i) tooltip.
const manual = (gameId: string, date: string, accepted: string, credit: string): UsedRight => ({
  gameId,
  date,
  accepted,
  username: "",
  gameUsername: "",
  category: "manual",
  credit,
  minigameRights: "0",
  makeBy: "superx",
});
const auto = (gameId: string, accepted: string, credit: string, minigameRights = "0"): UsedRight => ({
  gameId,
  date: "15/10/2026 16:55",
  accepted,
  username: "0Tsuperx58528064595",
  gameUsername: "0Tsuperx58528064595",
  category: "auto",
  credit,
  minigameRights,
  makeBy: "auto",
});
export const usedRights: UsedRight[] = [
  manual("uuid-1", "09/11/2026 13:30", "09/11/2026 13:32", "6"),
  manual("uuid-1", "09/11/2026 13:29", "09/11/2026 13:32", "5"),
  manual("uuid-1", "09/11/2026 13:29", "09/11/2026 13:31", "4"),
  auto("uuid-1", "16/10/2026 13:55", "1"),
  auto("uuid-1", "16/10/2026 13:55", "1.0000"),
  auto("uuid-1", "16/10/2026 13:55", "0", "1"),
  auto("uuid-1", "16/10/2026 13:55", "4"),
  auto("uuid-1", "16/10/2026 13:55", "5"),
  auto("uuid-1", "16/10/2026 13:55", "0", "1"),
  auto("uuid-2", "15/10/2026 16:56", "5"),
  auto("uuid-2", "16/10/2026 13:54", "7"),
  auto("uuid-2", "16/10/2026 13:54", "4"),
  auto("uuid-2", "16/10/2026 13:55", "1"),
  auto("uuid-2", "16/10/2026 13:55", "1.0000"),
  manual("uuid-3", "10/11/2026 15:42", "10/11/2026 15:42", "1"),
  manual("uuid-3", "09/11/2026 14:17", "09/11/2026 14:17", "1"),
  manual("uuid-3", "09/11/2026 14:10", "09/11/2026 14:16", "1"),
  manual("uuid-3", "09/11/2026 14:10", "09/11/2026 14:13", "1"),
  manual("uuid-3", "09/11/2026 14:10", "09/11/2026 14:13", "1"),
  manual("uuid-3", "09/11/2026 14:10", "09/11/2026 14:11", "1"),
  manual("uuid-3", "09/11/2026 13:29", "09/11/2026 13:31", "1"),
  manual("uuid-3", "09/11/2026 13:28", "09/11/2026 13:31", "1"),
  manual("uuid-3", "09/11/2026 13:28", "09/11/2026 13:30", "1"),
  manual("uuid-3", "09/11/2026 13:22", "09/11/2026 13:23", "1"),
];

// Filter options (value | text exactly as captured)
export const agentOptions = [
  { value: " ", label: "ทั้งหมด" },
  { value: "669", label: "superxx" },
  { value: "501", label: "superx" },
];
export const makeByOptions = ["auto", "superx"];

// Customers the manual-promotion picker finds (#manualSelectCustomer search on staging, 15/11):
// the 10 the server returns for "0Ts" (it returns at most 10), then the one found with "0Tsuperx814".
// gameUsername = username (the history shows "username (username)" for these accounts).
export const customers = [
  { username: "0Tsuperxx8157178456", name: "" },
  { username: "0Tsuperxx1878734085", name: "" },
  { username: "0Tsuperx73598421321", name: "oop" },
  { username: "0Tsuperx64182804037", name: "อติกานต์  พุทธกูล" },
  { username: "0Tsuperx41736096687", name: "จตุพล ฉายวิเชียร" },
  { username: "0Tsuperx45168665210", name: "leepp" },
  { username: "0Tsuperx43240409325", name: "live" },
  { username: "0Tsuperx87179333541", name: "รวี รวิวรรณ" },
  { username: "0Tsuperx28950565521", name: "ทัวร์ลง ออโต้ฟาสต์" },
  { username: "0Tsuperx44651169705", name: "รรชัย บุธรรม" },
  { username: "0Tsuperx81403971005", name: "รัฐงงงง นะครับ" },
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

// Shared by the three views below: every limit / turnover section is off (staging 15/11)
const VIEW_LIMITS_OFF = {
  countdownOn: false,
  promotionLimit: { on: false, perDay: "0 สิทธิ์", perWeek: "0 สิทธิ์", perMonth: "0 สิทธิ์", perPromotion: "0 สิทธิ์" },
  personLimit: { on: false, perTime: "0 สิทธิ์", perDay: "0 สิทธิ์", perWeek: "0 สิทธิ์", perMonth: "0 สิทธิ์", perPromotion: "0 สิทธิ์" },
  customerGroupLimitOn: false,
  resetOn: false,
  removeChanceOn: false,
  otherLimit: { on: false, perGamePerDay: "0 สิทธิ์", ifHasRights: "0 สิทธิ์", balance: "0 บาท" },
  turnover: { on: false, value: "0 บาท" },
  withdraw: { on: false, minRemainCredit: "0 บาท", maxWithdraw: "0 บาท" },
  clearTurnover: { on: false, value: "0 %" },
  increaseTurnoverOn: false,
};

const credit = (description: string, chance: string, value: string) => ({
  description,
  quantity: "ไม่จำกัดจำนวนแจก",
  alert: "ไม่แจ้งเตือน",
  chance,
  bonus: "เครดิต Fixed Rate",
  value,
});

// View offcanvas of each game (eye button in the drill-down card), as staging shows it (15/11)
export const minigameViews: Record<string, MinigameView> = {
  "uuid-1": {
    ...VIEW_LIMITS_OFF,
    type: "mini-game",
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
    conditionGetBonus: "ฝากครั้งเดียว ฝากขั้นต่ำ 1 บาท",
    numberOfParts: "มินิเกมส์ 6 ชิ้น",
    rewards: [
      credit("QA เครดิตคงที่ 1 บาท", "17%", "1 บาท"),
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
      credit("QA เครดิตคงที่ 4 บาท", "17%", "4 บาท"),
      credit("QA เครดิตคงที่ 5 บาท", "16%", "5 บาท"),
      credit("QA เครดิตคงที่ 6 บาท", "16%", "6 บาท"),
    ],
  },
  "uuid-2": {
    ...VIEW_LIMITS_OFF,
    type: "lucky-wheel",
    title: "รายละเอียดวงล้อนำโชค",
    headerText: "สรุปข้อมูลการตั้งค่าวงล้อนำโชค ของคุณ",
    tabTitle: "สรุปรายละเอียดมินิเกมส์ - วงล้อนำโชค",
    image: "https://p88.blob.core.windows.net/images/minigame/wheel-8/button.png",
    wheelArt: WHEEL_8_ART,
    statusOn: true,
    // ORIGINAL: the wheels' views show this name too, not the card name (data as staging shows it)
    name: "ฝากประจำนับโปร ทุกวัน รับไม่เว้น ไม่เน้น รับไปเล้ย",
    conditionHtml: "<p>ทดสอบวงล้อ Happy flow หลังแก้ไข บน staging</p>",
    agents: ["superx"],
    period: "-",
    conditionGetBonus: "ฝากครั้งเดียว ฝากขั้นต่ำ 1 บาท",
    numberOfParts: "วงล้อ 8 ชิ้น",
    rewards: [
      credit("QA เครดิตคงที่ 1 บาท", "13%", "1 บาท"),
      {
        description: "QA เครดิต 1% สูงสุด 1 บาท",
        quantity: "ไม่จำกัดจำนวนแจก",
        alert: "ไม่แจ้งเตือน",
        chance: "13%",
        bonus: "เครดิต เป็น Percentage (%)",
        value: "1 % จากยอดฝาก สูงสุดไม่เกิน 1 บาท",
      },
      // ORIGINAL: "undefined 1 สิทธิ์", same legacy-JS bug as Minigame 3 of uuid-1
      { description: "QA สิทธิ์เกมอื่น 1 สิทธิ์", quantity: "ไม่จำกัดจำนวนแจก", alert: "ไม่แจ้งเตือน", chance: "13%", bonus: "สิทธิ์มินิเกมส์", value: "undefined 1 สิทธิ์" },
      credit("QA เครดิตคงที่ 4 บาท", "13%", "4 บาท"),
      credit("QA เครดิตคงที่ 5 บาท", "12%", "5 บาท"),
      credit("QA เครดิตคงที่ 6 บาท", "12%", "6 บาท"),
      credit("QA เครดิตคงที่ 7 บาท", "12%", "7 บาท"),
      credit("QA เครดิตคงที่ 8 บาท", "12%", "8 บาท"),
    ],
  },
  "uuid-3": {
    ...VIEW_LIMITS_OFF,
    type: "lucky-wheel",
    title: "รายละเอียดวงล้อนำโชค",
    headerText: "สรุปข้อมูลการตั้งค่าวงล้อนำโชค ของคุณ",
    tabTitle: "สรุปรายละเอียดมินิเกมส์ - วงล้อนำโชค",
    image: "https://storage.googleapis.com/one-loyalty-stg-media/uploads/setting-minigame/20261109T071553326.png",
    wheelArt: WHEEL_8_ART,
    statusOn: true,
    name: "ฝากประจำนับโปร ทุกวัน รับไม่เว้น ไม่เน้น รับไปเล้ย",
    conditionHtml: "<p>QA test wheel: deposit 1 baht to get 1 spin</p>",
    agents: ["superx"],
    period: "-",
    conditionGetBonus: "ฝากครั้งเดียว ฝากขั้นต่ำ 1 บาท",
    numberOfParts: "วงล้อ 8 ชิ้น",
    // Data as staging shows it: slices 2-8 are named "QA เครดิต N บาท" but all give 1 บาท, all at 0%
    rewards: Array.from({ length: 8 }, (_, index) => credit(`QA เครดิต ${index + 1} บาท`, "0%", "1 บาท")),
  },
};

// /promotion/minigame/minigame-period-deposit: staging only had the empty state, and no captured script
// shows the row markup (rows are server-rendered HTML, see legacy-js/table.js), so there are no rows to mock.
export const depositCheckRows: DepositCheckRow[] = [];
