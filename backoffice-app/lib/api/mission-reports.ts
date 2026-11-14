// Data functions for the mission report pages, redeem points and mission history.
// The original server filtered, paged and rendered these tables (table.js POSTs the filters and
// gets HTML rows back); here the same filtering happens on the mock data so a page can later swap
// each body for a real fetch() without changing its components.

import {
  missionHistory,
  redeemConditions,
  redeemHistory,
  redeemMakers,
  REDEEM_SAMPLE_ROWS,
  reportMembers,
  reportMissions,
  rewardLog,
  SHOW_MOCK_BY_MEMBER_ROWS,
  SHOW_MOCK_REDEEM_ROWS,
} from "@/lib/mock/mission-reports";

export type MissionStatus = "online" | "offline" | "expired" | "deleted";

export type ReportMission = {
  id: string;
  name: string;
  duration: string; // as displayed, e.g. "15/10/2026 11:46 - เป็นต้นไป"
  status: MissionStatus;
  subMissions: { id: string; name: string }[];
};

export type ReportMember = { id: string; username: string };

export type Rewards = {
  credit: number;
  minigameRights: number;
  promotionRights: number;
  points: number;
  other: number;
};

export type RewardType = "complete" | "manual";
export type RewardMaker = "auto" | "user" | "admin";

// One reward entry (one row of the member report)
export type RewardLogRow = Rewards & {
  id: string;
  date: string; // dd/mm/yyyy
  time: string; // HH:mm
  memberId: string;
  memberName: string; // as displayed ("" where staging shows no name)
  missionId: string;
  subMissionId: string | null; // null = the mission itself was completed
  type: RewardType;
  maker: RewardMaker;
};

// A reward entry ready for display
export type RewardReportRow = RewardLogRow & {
  missionText: string; // "Mission - Sub mission"
};

// null = no date filter. Dates come from flatpickr (browser only).
export type DateRange = { from: Date; to: Date } | null;

export type Paging = { offset: number; limit: number };

const NO_REWARDS: Rewards = { credit: 0, minigameRights: 0, promotionRights: 0, points: 0, other: 0 };
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// "12/11/2026" → 20261112, so dates can be compared as numbers
function dayNumber(ddmmyyyy: string) {
  const [d, m, y] = ddmmyyyy.split("/").map(Number);
  return y * 10000 + m * 100 + d;
}

function inRange(ddmmyyyy: string, range: DateRange) {
  if (!range) return true;
  const day = dayNumber(ddmmyyyy);
  const from = range.from.getFullYear() * 10000 + (range.from.getMonth() + 1) * 100 + range.from.getDate();
  const to = range.to.getFullYear() * 10000 + (range.to.getMonth() + 1) * 100 + range.to.getDate();
  return day >= from && day <= to;
}

function contains(text: string, search: string) {
  return text.toLowerCase().includes(search.trim().toLowerCase());
}

function page<T>(rows: T[], paging: Paging) {
  return { rows: rows.slice(paging.offset, paging.offset + paging.limit), total: rows.length };
}

function sumRewards(rows: Rewards[]): Rewards {
  return rows.reduce(
    (sum, row) => ({
      credit: sum.credit + row.credit,
      minigameRights: sum.minigameRights + row.minigameRights,
      promotionRights: sum.promotionRights + row.promotionRights,
      points: sum.points + row.points,
      other: sum.other + row.other,
    }),
    NO_REWARDS,
  );
}

const hasReward = (row: Rewards) => row.credit + row.minigameRights + row.promotionRights + row.points + row.other > 0;

function findMission(id: string) {
  return reportMissions.find((mission) => mission.id === id);
}

function memberName(id: string) {
  return reportMembers.find((member) => member.id === id)?.username ?? "";
}

function toReportRow(row: RewardLogRow): RewardReportRow {
  const mission = findMission(row.missionId);
  const sub = mission?.subMissions.find((s) => s.id === row.subMissionId);
  return {
    ...row,
    missionText: sub ? `${mission?.name} - ${sub.name}` : (mission?.name ?? ""),
  };
}

// ---------------------------------------------------------------- filter options

export type MissionOption = { id: string; name: string };

// "ภารกิจ" filter pill (all missions, same order on every report page)
export async function getMissionFilterOptions(): Promise<MissionOption[]> {
  return reportMissions.map(({ id, name }) => ({ id, name }));
}

export type ManualMissionOption = { id: string; name: string; kind: "mission" | "sub-mission" };

// Mission picker in the manual-reward popup: only active missions, each followed by its sub-missions
export async function getManualRewardOptions(): Promise<ManualMissionOption[]> {
  return reportMissions
    .filter((mission) => mission.status === "online")
    .flatMap((mission) => [
      { id: mission.id, name: mission.name, kind: "mission" as const },
      ...mission.subMissions.map((sub) => ({ id: sub.id, name: sub.name, kind: "sub-mission" as const })),
    ]);
}

// Customer typeahead (original: POSTs the keyword and gets select2-style results back)
export async function searchMembers(keyword: string): Promise<ReportMember[]> {
  await wait(300);
  return structuredClone(reportMembers.filter((member) => contains(member.username, keyword)));
}

// ---------------------------------------------------------------- /mission/report and drill-downs

// Values of the "ประเภท" filter. Only Complete/Manual rows exist on staging, so what Auto/Admin
// match is a guess (here: the maker).
export type RewardCategory = "auto" | "admin" | "manual" | "mission-complete";

export type RewardFilters = {
  search: string;
  dates: DateRange;
  missionId: string | null;
  category: string | null;
  maker: string | null;
};

function matchesFilters(row: RewardReportRow, filters: RewardFilters) {
  const { search, dates, missionId, category, maker } = filters;
  if (search && !contains(`${row.memberName} ${memberName(row.memberId)} ${row.missionText}`, search)) return false;
  if (!inRange(row.date, dates)) return false;
  if (missionId && missionId !== "all" && row.missionId !== missionId) return false;
  if (category === "manual" && row.type !== "manual") return false;
  if (category === "mission-complete" && row.type !== "complete") return false;
  if ((category === "auto" || category === "admin") && row.maker !== category) return false;
  if (maker && maker !== "all" && row.maker !== maker) return false;
  return true;
}

function filteredRewards(filters: RewardFilters, extra: (row: RewardLogRow) => boolean = () => true) {
  return rewardLog
    .filter(extra)
    .map(toReportRow)
    .filter((row) => matchesFilters(row, filters));
}

// Original: POST /mission/report-table
export async function getMemberReport(filters: RewardFilters & Paging) {
  return structuredClone(page(filteredRewards(filters), filters));
}

// Original: POST /mission/mission-member-detail-table/<memberId> (no pager, with a totals row)
export async function getMemberDetailReport(memberId: string, filters: RewardFilters) {
  const rows = filteredRewards(filters, (row) => row.memberId === memberId);
  return structuredClone({ rows, summary: sumRewards(rows) });
}

// Original: POST /mission/report-mission-by-mission-table/<missionId>
export async function getMissionRewardReport(missionId: string, filters: RewardFilters) {
  const rows = filteredRewards(filters, (row) => row.missionId === missionId);
  return structuredClone({ rows, summary: sumRewards(rows) });
}

// Original: POST /mission/report-mission-by-member-table/<id>?isMission=… — used by BOTH the
// by-reward and the by-member page. Staging always answered with the empty state.
export async function getMissionMemberReport(id: string, filters: RewardFilters) {
  const rows = SHOW_MOCK_BY_MEMBER_ROWS
    ? filteredRewards(filters, (row) => row.missionId === id || row.subMissionId === id)
    : [];
  return structuredClone({ rows, summary: sumRewards(rows) });
}

export async function getReportMemberIds(): Promise<string[]> {
  return reportMembers.map((member) => member.id);
}

export async function getReportMissionIds(): Promise<{ missions: string[]; subMissions: string[] }> {
  return {
    missions: reportMissions.map((mission) => mission.id),
    subMissions: reportMissions.flatMap((mission) => mission.subMissions.map((sub) => sub.id)),
  };
}

// Manual reward (popup on /mission/report). Saved in memory only — lost on reload.
// The rewards of each mission were not captured, so the entry carries no reward amounts.
export async function addManualReward(input: { memberId: string; missionId: string }) {
  const mission = reportMissions.find((m) => m.id === input.missionId || m.subMissions.some((s) => s.id === input.missionId));
  if (!mission) throw new Error("Unknown mission " + input.missionId);
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const row: RewardLogRow = {
    id: "local-" + now.getTime(),
    date: `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    memberId: input.memberId,
    memberName: memberName(input.memberId),
    missionId: mission.id,
    subMissionId: mission.id === input.missionId ? null : input.missionId,
    type: "manual",
    maker: "user",
    ...NO_REWARDS,
  };
  rewardLog.unshift(row);
  return structuredClone(toReportRow(row));
}

// ---------------------------------------------------------------- /mission/report-mission

export type MissionReportRow = Rewards & {
  id: string; // mission or sub-mission id (drill-down links)
  isMission: boolean;
  name: string;
  duration: string; // "" on sub-mission rows
  status: MissionStatus;
  rewardCount: number; // "รับรางวัล (ครั้ง)" → by-reward link
  memberCount: number; // "รับรางวัล (ครั้ง)" → by-member link (distinct members)
};

export type MissionReportFilters = {
  search: string;
  dates: DateRange;
  status: string | null;
  missionId: string | null;
};

function aggregate(entries: RewardLogRow[]) {
  const rewarded = entries.filter(hasReward);
  return {
    ...sumRewards(rewarded),
    rewardCount: rewarded.length,
    memberCount: new Set(rewarded.map((row) => row.memberId)).size,
  };
}

// Original: POST /mission/report-mission-table (no pager; totals row at the end).
// Counts are worked out from the reward entries; with the captured entries they give exactly
// the captured numbers (e.g. QA Login ครบ 1 วัน: 6 rewards, 4 members, credit 6; totals 7/4/7/1/0/1/1).
export async function getMissionReport(filters: MissionReportFilters) {
  const { search, dates, status, missionId } = filters;
  const missions = reportMissions.filter(
    (mission) =>
      (!status || status === "all" || mission.status === status) &&
      (!missionId || missionId === "all" || mission.id === missionId) &&
      (!search || contains([mission.name, ...mission.subMissions.map((s) => s.name)].join(" "), search)),
  );
  const entries = rewardLog.filter((row) => inRange(row.date, dates));

  const rows: MissionReportRow[] = missions.flatMap((mission) => [
    {
      id: mission.id,
      isMission: true,
      name: mission.name,
      duration: mission.duration,
      status: mission.status,
      ...aggregate(entries.filter((row) => row.missionId === mission.id && row.subMissionId === null)),
    },
    ...mission.subMissions.map((sub) => ({
      id: sub.id,
      isMission: false,
      name: sub.name,
      duration: "",
      status: mission.status,
      ...aggregate(entries.filter((row) => row.subMissionId === sub.id)),
    })),
  ]);

  const ids = new Set(missions.map((mission) => mission.id));
  const summary = aggregate(entries.filter((row) => ids.has(row.missionId)));
  return structuredClone({ rows, summary });
}

// ---------------------------------------------------------------- /mission/redeem-points

export type RedeemHistoryRow = {
  id: string;
  date: string; // dd/mm/yyyy
  time: string; // HH:mm
  username: string;
  pointsBefore: number;
  pointsUsed: number;
  pointsAfter: number;
  reward: string;
  maker: string;
};

export type RedeemFilters = { search: string; dates: DateRange; maker: string | null };

// Original: POST /mission/redeem-points-table
export async function getRedeemHistory(filters: RedeemFilters & Paging) {
  const source = SHOW_MOCK_REDEEM_ROWS ? [...redeemHistory, ...REDEEM_SAMPLE_ROWS] : redeemHistory;
  const rows = source.filter(
    (row) =>
      (!filters.search || contains(`${row.username} ${row.reward}`, filters.search)) &&
      inRange(row.date, filters.dates) &&
      (!filters.maker || row.maker === filters.maker),
  );
  return structuredClone(page(rows, filters));
}

export async function getRedeemMakers(): Promise<string[]> {
  return [...redeemMakers];
}

// Current points of a member (shown under the points field once a customer is picked).
// Not captured: worked out here as points earned in the reward entries minus points redeemed.
export async function getMemberPoints(memberId: string): Promise<number> {
  const username = memberName(memberId);
  const earned = sumRewards(rewardLog.filter((row) => row.memberId === memberId)).points;
  const used = redeemHistory.filter((row) => row.username === username).reduce((sum, row) => sum + row.pointsUsed, 0);
  return earned - used;
}

// "ยืนยัน" in the redeem popup. Saved in memory only — lost on reload.
export async function redeemPoints(input: { memberId: string; points: number; reward: string }) {
  const before = await getMemberPoints(input.memberId);
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const row: RedeemHistoryRow = {
    id: "local-" + now.getTime(),
    date: `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    username: memberName(input.memberId),
    pointsBefore: before,
    pointsUsed: input.points,
    pointsAfter: before - input.points,
    reward: input.reward,
    maker: "superx", // the logged-in staff user on staging
  };
  redeemHistory.unshift(row);
  return structuredClone(row);
}

export type RedeemLang = "th" | "en" | "tl";

export type RedeemConditions = {
  enabled: boolean;
  th: string; // CKEditor HTML
  en: string;
  tl: string;
  configured: Record<RedeemLang, boolean>; // "(ตั้งค่าแล้ว)" / "(ยังไม่กำหนด)" under each language button
};

// Original: /mission/get-condition-point-exchange
export async function getRedeemConditions(): Promise<RedeemConditions> {
  return structuredClone(redeemConditions);
}

// "บันทึก" in the conditions panel. Saved in memory only — lost on reload.
export async function saveRedeemConditions(conditions: RedeemConditions) {
  Object.assign(redeemConditions, structuredClone(conditions));
}

// ---------------------------------------------------------------- /mission/mission/history

export type MissionHistoryRow = {
  editDate: string; // "dd/mm/yyyy HH:mm"
  mission: string;
  detail: string;
  editor: string; // "(superx)"
};

export type MissionHistoryFilters = { search: string; dates: DateRange };

// Original: POST /mission/history-table
export async function getMissionHistory(filters: MissionHistoryFilters & Paging) {
  const rows = missionHistory.filter(
    (row) =>
      (!filters.search || contains(`${row.mission} ${row.detail} ${row.editor}`, filters.search)) &&
      inRange(row.editDate.slice(0, 10), filters.dates),
  );
  return structuredClone(page(rows, filters));
}
