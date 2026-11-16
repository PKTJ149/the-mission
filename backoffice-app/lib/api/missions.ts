// Data functions for the mission settings pages: /mission, /mission/setting,
// /mission/agent-setting and /mission/banner-setting.
// Pages call these instead of touching mock data directly, so later each body can be
// swapped for a real fetch() to the original endpoint without changing any page.

import {
  agentSettings,
  agents,
  bannerAutoSlide,
  bannerMenuOptions,
  banners,
  capturedEditValues,
  gameProviders,
  iconStyleGroups,
  imageStyleGroups,
  memberGroups,
  miniGames,
  missions,
  promotions,
} from "@/lib/mock/missions";

// ---------- /mission list ----------

export type MissionStatus = "online" | "offline" | "expired";

export type MissionSubSummary = { no: number; text: string; rewards: string[] };

export type MissionListItem = {
  id: string;
  status: MissionStatus;
  cover: string;
  name: string;
  subCount: number;
  dates: string; // as displayed, e.g. "15/10/2026 11:46 / เป็นต้นไป"
  enabled: boolean; // the card's on/off switch
  rewards: string[]; // chips under "รางวัลเมื่อทำภารกิจย่อยสำเร็จ"
  rewardIcon: string;
  condition: string;
  subMissions: MissionSubSummary[];
};

// Original: server-rendered list on GET /mission
export async function getMissions(): Promise<MissionListItem[]> {
  // A copy, so a page editing its own state can never change the mock source
  return structuredClone(missions);
}

// ---------- /mission/setting form ----------

export type Lang = "th" | "en" | "tl";
export type RewardType = "credit" | "mini-game-chance" | "promotion-chance" | "point" | "reward";
export type MemberType = "member-group" | "life-span" | "created-date";
export type ConditionType = "deposit" | "turn-over" | "login" | "affiliate" | "point";
export type RoundType = "custom" | "daily" | "weekly" | "monthly";

// `id` on repeated items is a client-side key only (the original numbers items by position)
export type MissionRewardForm = {
  id: number;
  icon: string;
  type: RewardType | null;
  credit: string;
  miniGameId: string | null;
  miniGameCount: string;
  promotionId: string | null;
  point: string;
  name: string;
};

export type MemberTypeForm = {
  id: number;
  type: MemberType | null;
  groups: string[];
  ageOperator: "from" | "equal";
  ageValue: string;
  ageUnit: "daily" | "weekly" | "monthly" | "yearly";
  registerOperator: "on-date" | "before-date" | "after-date" | "between-date";
  registerDate: string;
};

export type TimeSlotForm = {
  id: number;
  days: string[]; // monday … sunday
  monthDays: string[]; // "1" … "31", "end"
  start: string; // "HH:mm"
  end: string;
  allDay: boolean;
  reset: boolean;
  specifyDate?: string; // "d/m/Y", round type กำหนดเอง + ระบุวันที่ (1 -31)
};

export type SubConditionForm = {
  id: number;
  type: ConditionType | null;
  depositType: string | null;
  depositAmount: string;
  depositCount: string;
  depositAccumulated: string;
  depositEvery: string;
  turnOverType: string;
  turnOverAmount: string;
  turnOverTime: string;
  customBrandGame: boolean;
  brandGames: string[]; // "<category>-<providerId>"
  loginType: "total" | "consecutive";
  loginAmount: string;
  affiliateType: string | null;
  affiliatePeople: string;
  affiliateValue: string;
  pointAmount: string;
};

export type SubMissionForm = {
  id: number;
  icon: string;
  name: string;
  description: string; // CKEditor HTML
  conditions: SubConditionForm[];
  rewardEnabled: boolean;
  receiveType: "manual" | "auto";
  resetEnabled: boolean;
  limitReward: "no" | "yes";
  limitValue: string;
  rewards: MissionRewardForm[];
  turnOverEnabled: boolean;
  turnOverValue: string;
  alertEnabled: boolean;
  alertPopup: boolean;
  alertFloating: boolean;
};

export type MissionFormValues = {
  status: boolean;
  cover: string;
  colorBg: string;
  colorText: string;
  names: Record<Lang, string>;
  conditions: Record<Lang, string>; // CKEditor HTML per language
  format: "option1" | "option2";
  showCountdown: boolean;
  agents: string[];
  memberRestrict: boolean;
  memberTypes: MemberTypeForm[];
  restrictVisible: boolean;
  startNow: boolean;
  startDate: string; // "d/m/Y"
  startTime: string; // "H:i"
  noEnd: boolean;
  endDate: string;
  endTime: string;
  roundType: RoundType;
  roundDayType: "day-of-week" | "day-of-month";
  timeSlots: TimeSlotForm[];
  rewardEnabled: boolean;
  receiveType: "manual" | "auto";
  rewards: MissionRewardForm[];
  turnOverEnabled: boolean;
  turnOverValue: string;
  alertEnabled: boolean;
  alertPopup: boolean;
  alertFloating: boolean;
  subMissions: SubMissionForm[];
  completeType: "all" | "some" | null;
  completeValue: string;
  resetSubMission: boolean;
  displayTime?: string; // edit/copy: the server's preview date line (data.time), e.g. "15/10/2026 11:46 / เป็นต้นไป"
  turnOverType?: "by-time" | "by-unit"; // section 2 turnover card (default by-unit)
  turnOverTimeValue?: string; // "ทำเทิร์นโอเวอร์ ขั้นต่ำ x เท่า" amount
};

export const DEFAULT_COVER = "https://cdn.lsmloyalty.com/images/mission/cover/preview-pic.png";
export const DEFAULT_REWARD_ICON = "https://cdn.lsmloyalty.com/images/mission/reward/icon-reward-1.png";
export const DEFAULT_COLOR_BG = "linear-gradient(90deg, #BA8A46 0%, #F5E386 50%, #BA8A46 100%)";
export const DEFAULT_COLOR_TEXT = "#1e1e1e";
export const ALL_MONTH_DAYS = [...Array.from({ length: 31 }, (_, i) => String(i + 1)), "end"];

let lastId = 0;
// Client-side keys for repeated items
export function nextFormId() {
  lastId += 1;
  return lastId;
}

export function newReward(): MissionRewardForm {
  return { id: nextFormId(), icon: DEFAULT_REWARD_ICON, type: null, credit: "", miniGameId: null, miniGameCount: "", promotionId: null, point: "", name: "" };
}

export function newMemberType(): MemberTypeForm {
  return { id: nextFormId(), type: null, groups: [], ageOperator: "from", ageValue: "", ageUnit: "daily", registerOperator: "on-date", registerDate: "" };
}

// Captured default: no weekday ticked, every day of the month ticked
export function newTimeSlot(): TimeSlotForm {
  return { id: nextFormId(), days: [], monthDays: [...ALL_MONTH_DAYS], start: "", end: "", allDay: false, reset: false };
}

export function newSubCondition(): SubConditionForm {
  return {
    id: nextFormId(),
    type: null,
    depositType: null,
    depositAmount: "",
    depositCount: "",
    depositAccumulated: "",
    depositEvery: "",
    turnOverType: "equal",
    turnOverAmount: "",
    turnOverTime: "",
    customBrandGame: false,
    brandGames: [],
    loginType: "total",
    loginAmount: "",
    affiliateType: null,
    affiliatePeople: "",
    affiliateValue: "",
    pointAmount: "",
  };
}

export function newSubMission(): SubMissionForm {
  return {
    id: nextFormId(),
    icon: DEFAULT_REWARD_ICON,
    name: "",
    description: "",
    conditions: [newSubCondition()],
    rewardEnabled: false,
    receiveType: "manual",
    resetEnabled: false,
    limitReward: "no",
    limitValue: "",
    rewards: [newReward()],
    turnOverEnabled: false,
    turnOverValue: "",
    alertEnabled: false,
    alertPopup: false,
    alertFloating: false,
  };
}

// State of /mission/setting right after page load (create mode)
export function newMissionForm(): MissionFormValues {
  return {
    status: true,
    cover: DEFAULT_COVER,
    colorBg: DEFAULT_COLOR_BG,
    colorText: DEFAULT_COLOR_TEXT,
    names: { th: "", en: "", tl: "" },
    conditions: { th: "", en: "", tl: "" },
    format: "option1",
    showCountdown: false,
    agents: [],
    memberRestrict: false,
    memberTypes: [newMemberType()],
    restrictVisible: false,
    startNow: false,
    startDate: "",
    startTime: "",
    noEnd: false,
    endDate: "",
    endTime: "",
    roundType: "custom",
    roundDayType: "day-of-week",
    timeSlots: [newTimeSlot()],
    rewardEnabled: false,
    receiveType: "manual",
    rewards: [newReward()],
    turnOverEnabled: false,
    turnOverValue: "",
    alertEnabled: false,
    alertPopup: false,
    alertFloating: false,
    subMissions: [newSubMission()],
    completeType: null,
    completeValue: "",
    resetSubMission: false,
  };
}

// Original: the edit page loads GET /mission/get-mission?missionId=… (getMissionData). Values as staging
// returned them on 15/11/2026; missions without captured data answer "Mission not found" (null), and the
// edit page then stays an empty create form.
export async function getMissionFormValues(missionId: string): Promise<MissionFormValues | null> {
  const captured = capturedEditValues[missionId];
  if (!captured) return null;
  const form = newMissionForm();
  const sub = newSubMission();
  const condition = { ...sub.conditions[0], ...captured.subMission.condition };
  return {
    ...form,
    status: captured.status,
    cover: captured.cover,
    names: { th: captured.name, en: "", tl: "" },
    conditions: { th: captured.condition, en: "<p>&nbsp;</p>", tl: "<p>&nbsp;</p>" },
    agents: captured.agents,
    startNow: true,
    noEnd: true,
    roundType: "daily",
    timeSlots: [{ ...form.timeSlots[0], ...captured.round }],
    subMissions: [{ ...sub, name: captured.subMission.name, description: captured.subMission.description, conditions: [condition] }],
    completeType: captured.completeType,
    completeValue: captured.completeValue,
    displayTime: captured.time,
  };
}

export type Option = { value: string; label: string; chip?: string };

// Original: GET /mission/get-agent
export async function getMissionAgents(): Promise<Option[]> {
  return structuredClone(agents);
}

// Original: GET /mission/get-member-group
export async function getMemberGroups(): Promise<Option[]> {
  return structuredClone(memberGroups);
}

// Original: GET /api/promotion/get-promotion-deposit-mini-game
export async function getMiniGames(): Promise<Option[]> {
  return structuredClone(miniGames);
}

// Original: GET /mission/get-promotions (empty on staging)
export async function getPromotions(): Promise<Option[]> {
  return structuredClone(promotions);
}

// Missions offered by the "คัดลอกการตั้งค่าจากภารกิจอื่น" picker (captured order)
export async function getCopyableMissions(): Promise<Option[]> {
  // Staging order: cards 3, 4, 1, 2 (by position, so it survives id changes in the mock)
  const order = [2, 3, 0, 1];
  return order.map((index) => {
    const mission = missions[index];
    return { value: mission.id, label: mission.name };
  });
}

export type ImageStyleGroup = { title: string; images: string[] };

// #popup-image-style (mission cover images)
export async function getImageStyles(): Promise<ImageStyleGroup[]> {
  return structuredClone(imageStyleGroups);
}

export type IconStyleGroup = { i18nKey: string; title: string; target: string; images: string[] };

// #popup-icon-style (sub-mission / reward icons)
export async function getIconStyles(): Promise<IconStyleGroup[]> {
  return structuredClone(iconStyleGroups);
}

export type GameCategory = "sport" | "game" | "casino" | "lotto";
export type GameProvider = { lsmGameId: number; code: string; name: string; category: GameCategory };

// Original: GET /api/promotion/get-game-provider-list
export async function getGameProviders(): Promise<GameProvider[]> {
  return structuredClone(gameProviders);
}

// ---------- /mission/banner-setting ----------

export type BannerLinkType = "menu" | "url";

export type MissionBanner = {
  id: number; // position number shown as "รูปแบนเนอร์ N"
  image: string;
  showOnMissionPage: boolean;
  linkType: BannerLinkType | null;
  menu: string | null;
  url: string;
};

export const NEW_BANNER_IMAGE = "https://cdn.lsmloyalty.com/images/mission/banner/default.png";

// Original: GET /mission/get-mission-banner
export async function getMissionBanners(): Promise<MissionBanner[]> {
  return structuredClone(banners);
}

// Original: GET /mission/get-mission-banner-url
export async function getBannerMenuOptions(): Promise<Option[]> {
  return structuredClone(bannerMenuOptions);
}

// Original: GET /mission/get-mission-banner-auto-slide
export async function getBannerAutoSlide(): Promise<boolean> {
  return bannerAutoSlide;
}

// ---------- /mission/agent-setting ----------

export type MissionAgentSetting = { tenantId: string; name: string; enabled: boolean; icon: string };

export const DEFAULT_AGENT_ICON = "https://cdn.lsmloyalty.com/images/mission/icon/Vector.png";

// Original: GET /mission/get-mission-agent-setting
export async function getMissionAgentSettings(): Promise<MissionAgentSetting[]> {
  return structuredClone(agentSettings);
}
