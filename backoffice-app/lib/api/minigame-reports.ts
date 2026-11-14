// Data functions for the mini-game report pages:
// /report/promotion/minigame, /promotion/minigame/history and /promotion/minigame/minigame-period-deposit.
// Pages call these instead of touching mock data directly, so later each body can be swapped
// for a real fetch() to the original endpoint without changing any page.

import {
  agentOptions,
  customers,
  depositCheckRows,
  makeByOptions,
  minigameDetails,
  minigameOtherViews,
  reportGames,
  rewardPieces,
  rightsPattern,
  rightsRowDefaults,
  summaryRows,
  summaryTotals,
} from "@/lib/mock/minigame-reports";

export type GameStatus = "active" | "inactive" | "expired";
export type RightsStatus = "waiting" | "accept" | "expired" | "rejected";
export type RightsCategory = "auto" | "manual" | "promotion" | "mini-game";

export type SummaryCounts = {
  eligiblePeople: string; // คนมีสิทธิ์รับ
  receivedPeople: string; // คนที่รับโปร
  usableTimes: string; // ใช้ได้ทั้งหมด
  usedTimes: string; // ใช้ไปทั้งหมด
  credit: string; // เครดิต (฿)
  minigameRights: string;
  lottoRights: string;
  points: string;
  rewards: string;
};
export type SummaryRow = SummaryCounts & { id: string; name: string; status: GameStatus; agentIds: string[] };
export type SummaryTotals = SummaryCounts;

export type MinigameDetail = {
  id: string;
  name: string;
  type: "mini-game" | "lucky-wheel";
  descriptionHtml: string; // CKEditor HTML of the game condition
  status: GameStatus;
  period: string; // ระยะเวลาโปรโมชั่น
  image: string;
  promotionCustomerCount: string;
  getPromotionCustomerCount: string;
  promotionCount: string;
  getPromotionCount: string;
  credit: string;
  miniGameCount: string;
  lottoCount: string;
  pointCount: string;
  rewardCount: string;
};

export type RightsPattern = { credit: string; minigameRights: string };

// One row of the rights history (/promotion/minigame/history) and of the report drill-down
export type RightsRow = {
  id: string;
  date: string; // dd/MM/yyyy HH:mm
  username: string;
  gameUsername: string;
  gameId: string;
  gameName: string;
  category: RightsCategory;
  credit: string;
  minigameRights: string;
  lottoRights: string;
  points: string;
  rewards: string;
  status: RightsStatus;
  makeBy: string;
  agentId: string;
};

export type MinigameReward = {
  description: string;
  quantity: string;
  alert: string;
  chance: string;
  bonus: string;
  value: string;
};

export type MinigameOtherView = {
  title: string;
  headerText: string;
  tabTitle: string;
  image: string;
  statusOn: boolean;
  name: string;
  conditionHtml: string;
  agents: string[];
  period: string;
  countdownOn: boolean;
  promotionLimit: { on: boolean; perDay: string; perWeek: string; perMonth: string; perPromotion: string };
  personLimit: { on: boolean; perTime: string; perDay: string; perWeek: string; perMonth: string; perPromotion: string };
  customerGroupLimitOn: boolean;
  resetOn: boolean;
  removeChanceOn: boolean;
  otherLimit: { on: boolean; perGamePerDay: string; ifHasRights: string; balance: string };
  conditionGetBonus: string;
  numberOfParts: string;
  rewards: MinigameReward[];
  turnover: { on: boolean; value: string };
  withdraw: { on: boolean; minRemainCredit: string; maxWithdraw: string };
  clearTurnover: { on: boolean; value: string };
  increaseTurnoverOn: boolean;
};

export type DepositCheckRow = Record<string, string>;

export type DateRange = Date[]; // flatpickr selection: [] | [day] | [from, to]

export type SummaryFilters = { search?: string; status?: string | null; agent?: string | null; dates?: DateRange };

export type RightsFilters = {
  gameId?: string; // drill-down: only this mini-game
  search?: string; // history: promotion name or username; drill-down: username
  category?: string | null;
  status?: string | null;
  makeBy?: string | null;
  agent?: string | null;
  dates?: DateRange;
  offset: number;
  limit: number;
};

// ---------- helpers ----------

const includes = (text: string, keyword: string) => text.toLowerCase().includes(keyword.trim().toLowerCase());

// "12/11/2026 07:37" → Date (local time)
function parseRowDate(text: string) {
  const [day, month, rest] = text.split("/");
  const [year, time] = rest.split(" ");
  const [hour, minute] = time.split(":");
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
}

// table.js sends "<field>From"/"<field>To" by day; one picked day = that whole day
function inRange(text: string, dates: DateRange = []) {
  if (dates.length === 0) return true;
  const date = parseRowDate(text);
  const from = new Date(dates[0]);
  from.setHours(0, 0, 0, 0);
  const to = new Date(dates[dates.length - 1]);
  to.setHours(23, 59, 59, 999);
  return date >= from && date <= to;
}

// Agent filter: " " is the "ทั้งหมด" item
const agentMatches = (agent: string | null | undefined, ids: string[]) => !agent || agent.trim() === "" || ids.includes(agent);

// ---------- in-memory changes (lost on reload, nothing is sent anywhere) ----------

const statusChanges = new Map<string, RightsStatus>();
const manualRows: RightsRow[] = [];

// Only page 1 (10 rows) was captured. To fill the captured totals (7103 / 7101 / 10 rows per game,
// 14214 in the history) row N of a game repeats captured row N % 10 — a stand-in, not real data.
function patternRow(gameIndex: number, index: number): RightsRow {
  const game = reportGames[gameIndex];
  const pattern = rightsPattern[index % rightsPattern.length];
  const id = `${game.id}-${index + 1}`;
  return {
    id,
    ...rightsRowDefaults,
    gameId: game.id,
    gameName: game.name,
    credit: pattern.credit,
    minigameRights: pattern.minigameRights,
    lottoRights: "0",
    points: "0",
    rewards: "0",
    status: statusChanges.get(id) ?? rightsRowDefaults.status,
  };
}

function* allRightsRows(gameId?: string): Generator<RightsRow> {
  for (const row of manualRows) {
    if (!gameId || row.gameId === gameId) yield { ...row, status: statusChanges.get(row.id) ?? row.status };
  }
  for (let gameIndex = 0; gameIndex < reportGames.length; gameIndex++) {
    if (gameId && reportGames[gameIndex].id !== gameId) continue;
    for (let index = 0; index < reportGames[gameIndex].rightsCount; index++) yield patternRow(gameIndex, index);
  }
}

// ---------- report summary ----------

// Original: POST /report/promotion/minigame-table (returns the rendered rows)
export async function getMinigameSummary(filters: SummaryFilters = {}): Promise<{ rows: SummaryRow[]; totals: SummaryTotals }> {
  // The date filter is accepted but the per-day breakdown of the summary was not captured, so it changes nothing.
  const rows = summaryRows.filter(
    (row) =>
      (!filters.search || includes(row.name, filters.search)) &&
      (!filters.status || row.status === filters.status) &&
      agentMatches(filters.agent, row.agentIds),
  );
  if (rows.length === summaryRows.length) return structuredClone({ rows, totals: summaryTotals });

  // Some games filtered out: add up what is left (credit keeps the server's 4 decimals)
  const sum = (key: keyof SummaryCounts) => rows.reduce((total, row) => total + Number(row[key]), 0);
  const totals: SummaryTotals = {
    eligiblePeople: String(sum("eligiblePeople")),
    receivedPeople: String(sum("receivedPeople")),
    usableTimes: String(sum("usableTimes")),
    usedTimes: String(sum("usedTimes")),
    credit: sum("credit").toFixed(4),
    minigameRights: String(sum("minigameRights")),
    lottoRights: String(sum("lottoRights")),
    points: String(sum("points")),
    rewards: String(sum("rewards")),
  };
  return structuredClone({ rows, totals });
}

// Original: POST /api/report/summary-mini-game (numbers of the drill-down card)
export async function getMinigameDetail(id: string): Promise<MinigameDetail | null> {
  const detail = minigameDetails.find((item) => item.id === id);
  return detail ? structuredClone(detail) : null;
}

// Original: POST /api/promotion/mini-game/get/ — only the "มินิเกมส์อื่น ๆ" game's view was captured
export async function getMinigameOtherView(id: string): Promise<MinigameOtherView | null> {
  const view = minigameOtherViews[id];
  return view ? structuredClone(view) : null;
}

// ---------- rights rows (history + drill-down) ----------

// Original: POST /promotion/minigame/history-table and POST /report/promotion/minigame-detail-table?anyMiniGameId=<id>
export async function getRightsRows(filters: RightsFilters): Promise<{ rows: RightsRow[]; total: number }> {
  const { offset, limit } = filters;
  const rows: RightsRow[] = [];
  let total = 0;
  for (const row of allRightsRows(filters.gameId)) {
    const matches =
      (!filters.search || includes(row.gameName, filters.search) || includes(row.username, filters.search) || includes(row.gameUsername, filters.search)) &&
      (!filters.category || row.category === filters.category) &&
      (!filters.status || row.status === filters.status) &&
      (!filters.makeBy || row.makeBy === filters.makeBy) &&
      agentMatches(filters.agent, [row.agentId]) &&
      inRange(row.date, filters.dates);
    if (!matches) continue;
    if (total >= offset && rows.length < limit) rows.push(row);
    total++;
  }
  return { rows, total };
}

// Original: openDropdownChangeStatus → confirmChangeStatus (endpoint not captured)
export async function changeRightsStatus(id: string, status: RightsStatus, remark: string): Promise<void> {
  void remark; // the remark would be sent with the request
  statusChanges.set(id, status);
}

export type ManualPromotionInput = { username: string; gameId: string; reward: string; remark: string; depositAmount: string };

// Original: createManual() on /promotion/minigame/history (endpoint not captured)
export async function createManualPromotion(input: ManualPromotionInput): Promise<void> {
  const customer = customers.find((item) => item.username === input.username);
  const game = reportGames.find((item) => item.id === input.gameId);
  if (!customer || !game) return;
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  manualRows.unshift({
    id: `manual-${manualRows.length + 1}`,
    date: `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
    username: customer.username,
    gameUsername: customer.gameUsername,
    gameId: game.id,
    gameName: game.name,
    category: "manual",
    credit: "0",
    minigameRights: "0",
    lottoRights: "0",
    points: "0",
    rewards: "0",
    status: "waiting",
    makeBy: "superx",
    agentId: "501",
  });
}

// ---------- options ----------

export async function getAgentOptions() {
  return structuredClone(agentOptions);
}

export async function getMakeByOptions() {
  return [...makeByOptions];
}

// select2 #anyMiniGameId (order as captured)
export async function getManualMiniGames(): Promise<{ value: string; text: string }[]> {
  return ["uuid-3", "uuid-2", "uuid-1"].map((id) => ({ value: id, text: reportGames.find((game) => game.id === id)!.name }));
}

// select2 #selectRewardPiece, filled after a mini-game is chosen
export async function getRewardPieces(gameId: string): Promise<{ value: string; text: string }[]> {
  return (rewardPieces[gameId] ?? []).map((text, index) => ({ value: String(index + 1), text }));
}

// #manualSelectCustomer (CustomDropdown theme "google") search
export async function searchCustomers(keyword: string): Promise<{ value: string; label: string }[]> {
  return customers
    .filter((customer) => includes(customer.username, keyword) || includes(customer.gameUsername, keyword))
    .map((customer) => ({ value: customer.username, label: `${customer.username} (${customer.gameUsername})` }));
}

// ---------- deposit check ----------

// Original: POST /promotion/minigame/minigame-period-deposit-table — always empty on staging
export async function getDepositCheckRows(filters: { offset: number; limit: number }): Promise<{ rows: DepositCheckRow[]; total: number }> {
  return { rows: depositCheckRows.slice(filters.offset, filters.offset + filters.limit), total: depositCheckRows.length };
}
