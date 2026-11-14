// Mock data for the mission settings pages, values exactly as captured on staging (2026-11-14).
// Read only through lib/api/missions.ts.

import type {
  GameProvider,
  IconStyleGroup,
  ImageStyleGroup,
  MissionAgentSetting,
  MissionBanner,
  MissionListItem,
  Option,
} from "@/lib/api/missions";

const CDN = "https://cdn.lsmloyalty.com/images/mission";
const REWARD_ICON = `${CDN}/reward/icon-reward-1.png`;

// /mission cards (record GUIDs were anonymised to uuid-N by the capture)
export const missions: MissionListItem[] = [
  {
    id: "uuid-1",
    status: "online",
    cover: `${CDN}/cover/01/mission-01.webp`,
    name: "QA Happy Mission Retest 20261015",
    subCount: 1,
    dates: "15/10/2026 11:46 / เป็นต้นไป",
    enabled: true,
    rewards: [],
    rewardIcon: REWARD_ICON,
    condition: "ทดสอบสร้างภารกิจ Happy flow ซ้ำหลังแก้ไขระบบ",
    subMissions: [{ no: 1, text: "Login ครบ 1 วัน", rewards: [] }],
  },
  {
    id: "uuid-2",
    status: "online",
    cover: `${CDN}/cover/preview-pic.png`,
    name: "ภารกิจ 001",
    subCount: 1,
    dates: "14/10/2026 22:26 / เป็นต้นไป",
    enabled: true,
    rewards: [],
    rewardIcon: REWARD_ICON,
    condition: "",
    subMissions: [{ no: 1, text: "ทำเทิร์นเท่ากับ 10.00 บาท", rewards: [] }],
  },
  {
    id: "uuid-3",
    status: "expired",
    cover: `${CDN}/cover/01/mission-07.webp`,
    name: "QA Test Mission 0911",
    subCount: 1,
    dates: "09/11/2026 14:00 / 09/11/2026 17:00",
    enabled: false,
    rewards: [],
    rewardIcon: REWARD_ICON,
    condition: "ทดสอบสร้างภารกิจ Happy flow ซ้ำหลังแก้ไขระบบ",
    subMissions: [{ no: 1, text: "Login ครบ 1 วัน", rewards: [] }],
  },
  {
    id: "uuid-4",
    status: "expired",
    cover: `${CDN}/cover/01/mission-02.webp`,
    name: "QA Mission Rewards 20261015 Updated",
    subCount: 2,
    dates: "15/10/2026 14:15 / 14/11/2026 12:00",
    enabled: false,
    rewards: ["1 ฿", "1 สิทธิ์", "1 pt.", "QA ของรางวัลทดสอบ ไม่จัดส่งจริง"],
    rewardIcon: REWARD_ICON,
    condition: "ทดสอบ Mission แบบมีรางวัลและตรวจข้อมูลหลังบันทึก บน staging",
    subMissions: [
      { no: 1, text: "Login ครบ 1 วัน", rewards: ["1 ฿"] },
      { no: 2, text: "ฝากขั้นต่ำ 1.00 บาท จำนวน 1 ครั้ง", rewards: [] },
    ],
  },
];

// Values the edit page loaded for "QA Happy Mission Retest 20261015"
// (create/edit-mission_filled-values.json). Everything not listed keeps the create default.
export const capturedEditValues: Record<
  string,
  {
    status: boolean;
    cover: string;
    name: string;
    condition: string;
    agents: string[];
    startDate: string;
    startTime: string;
    subMission: { name: string; description: string; loginAmount: string };
    completeValue: string;
  }
> = {
  "uuid-1": {
    status: true,
    cover: `${CDN}/cover/01/mission-01.webp`,
    name: "QA Happy Mission Retest 20261015",
    condition: "<p>ทดสอบสร้างภารกิจ Happy flow ซ้ำหลังแก้ไขระบบ</p>",
    agents: ["501"],
    // "เริ่มภารกิจทันที" was ticked; the preview card showed the creation time
    startDate: "15/10/2026",
    startTime: "11:46",
    subMission: {
      name: "QA เข้าสู่ระบบ 1 ครั้ง",
      description: "<p>ภารกิจทดสอบหนึ่งเงื่อนไขสำหรับตรวจสอบการสร้างข้อมูล</p>",
      loginAmount: "1",
    },
    completeValue: "1",
  },
};

// "Agent ที่ใช้ได้" (#dropdownSelectMissionAgent)
export const agents: Option[] = [
  { value: "501", label: "superx", chip: "superx" },
  { value: "669", label: "superxx", chip: "superxx" },
];

// "กลุ่มสมาชิก" (create-mission_part1….lists.json)
export const memberGroups: Option[] = [
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

// "มินิเกมส์" reward options (ids anonymised by the capture)
export const miniGames: Option[] = [
  { value: "uuid-5", label: "QA Test Wheel 0911" },
  { value: "uuid-6", label: "QA Wheel Retest 20261015" },
  { value: "uuid-7", label: "QA Other Retest 20261015" },
];

// "โปรโมชั่น" reward options — the list was empty on staging
export const promotions: Option[] = [];

// #popup-image-style: 3 categories of cover images
export const imageStyleGroups: ImageStyleGroup[] = [11, 12, 11].map((count, group) => ({
  title: String(group + 1),
  images: Array.from({ length: count }, (_, i) => `${CDN}/cover/0${group + 1}/mission-${String(i + 1).padStart(2, "0")}.webp`),
}));

// #popup-icon-style. Only the deposit, points and the first 3 turnover icons were captured
// (the other 7 turnover icons and the remaining categories' contents were not).
const ICONS = `${CDN}/mission-default-icon`;
export const iconStyleGroups: IconStyleGroup[] = [
  { i18nKey: "iconCategoryMissionDeposit", title: "ไอคอนภารกิจฝากเงิน", target: "Minigame1", images: [1, 2, 3, 4, 5].map((n) => `${ICONS}/deposit/Deposit-${n}.png`) },
  { i18nKey: "iconCategoryMissionTurnOver", title: "ไอคอนภารกิจ ทำเทิร์นโอเวอร์", target: "Minigame2", images: [1, 2, 3].map((n) => `${ICONS}/turnover/Turnover-${n}.png`) },
  { i18nKey: "iconCategoryMissionPoints", title: "ไอคอนภารกิจ สะสมแต้ม", target: "Minigame3", images: [1, 2, 3, 4, 5].map((n) => `${ICONS}/points/Points-${n}.png`) },
  { i18nKey: "iconCategoryMissionAffiliate", title: "ไอคอนภารกิจ แนะนำเพื่อน", target: "Minigame4", images: [] },
  { i18nKey: "iconCategoryMissionLogin", title: "ไอคอนภารกิจ Login", target: "Minigame5", images: [] },
  { i18nKey: "iconCategoryMissionCreditReward", title: "ไอคอนเงินรางวัล", target: "Minigame6", images: [] },
  { i18nKey: "iconCategoryMissionMiniGame", title: "ไอคอนมินิเกมส์", target: "Minigame7", images: [] },
  { i18nKey: "iconCategoryMissionGetPromotion", title: "ไอคอนสิทธิ์รับโปรโมชั่น", target: "Minigame8", images: [] },
  { i18nKey: "iconCategoryMissionFreeSpin", title: "ไอคอนฟรีสปิน", target: "Minigame9", images: [] },
  { i18nKey: "iconCategoryMissionReward", title: "ไอคอนของรางวัล", target: "Minigame10", images: [] },
  { i18nKey: "iconCategoryMissionRewardOther", title: "ไอคอนรางวัลอื่น ๆ", target: "Minigame11", images: [] },
  { i18nKey: "iconCategoryMissionOther", title: "ไอคอนอื่น ๆ", target: "Other", images: [] },
];

// #popup-game-type providers (popup-game-type_open.providers.json), in captured order
export const gameProviders: GameProvider[] = [
  { lsmGameId: 9, code: "muaypukyok", name: "ONE BX", category: "sport" },
  { lsmGameId: 11, code: "sabasport", name: "SABA", category: "sport" },
  { lsmGameId: 12, code: "sbo", name: "SBO", category: "sport" },
  { lsmGameId: 7, code: "newsportbook", name: "SPORT LSM", category: "sport" },
  { lsmGameId: 87, code: "amigo", name: "AMIGO", category: "game" },
  { lsmGameId: 46, code: "ADVANTPLAY", name: "Advantplay", category: "game" },
  { lsmGameId: 88, code: "allbet", name: "Allbet Game", category: "game" },
  { lsmGameId: 56, code: "bng", name: "BNG", category: "game" },
  { lsmGameId: 54, code: "btgaming", name: "BT Gaming", category: "game" },
  { lsmGameId: 94, code: "cp", name: "CP Gaming", category: "game" },
  { lsmGameId: 69, code: "dragoonsoft", name: "DragoonSoft", category: "game" },
  { lsmGameId: 53, code: "expanse", name: "Expanse", category: "game" },
  { lsmGameId: 72, code: "fachai", name: "Fachai", category: "game" },
  { lsmGameId: 2, code: "fastspin", name: "FastSpin", category: "game" },
  { lsmGameId: 95, code: "fungaming", name: "Fun Gaming", category: "game" },
  { lsmGameId: 30, code: "gpi", name: "GPI Game", category: "game" },
  { lsmGameId: 32, code: "gw", name: "Gaming World", category: "game" },
  { lsmGameId: 29, code: "haba", name: "Habanero", category: "game" },
  { lsmGameId: 75, code: "hotdog", name: "Hotdog Gaming", category: "game" },
  { lsmGameId: 5, code: "jili", name: "JILI", category: "game" },
  { lsmGameId: 27, code: "jk", name: "Joker", category: "game" },
  { lsmGameId: 36, code: "ka", name: "KA Game", category: "game" },
  { lsmGameId: 33, code: "kingmaker", name: "KingMaker", category: "game" },
  { lsmGameId: 57, code: "megawin", name: "MEGAWIN", category: "game" },
  { lsmGameId: 41, code: "mp", name: "MPoker", category: "game" },
  { lsmGameId: 84, code: "microgame", name: "Micro Gaming", category: "game" },
  { lsmGameId: 48, code: "naga", name: "NAGA GAMES", category: "game" },
  { lsmGameId: 25, code: "nextspin", name: "Next Spin", category: "game" },
  { lsmGameId: 73, code: "nolimitcity", name: "Nolimit City", category: "game" },
  { lsmGameId: 24, code: "ps", name: "Play Star", category: "game" },
  { lsmGameId: 38, code: "playtech", name: "Playtech", category: "game" },
  { lsmGameId: 78, code: "pgsoft", name: "Pocket Game (PG)", category: "game" },
  { lsmGameId: 43, code: "pp", name: "PragmaticPlay", category: "game" },
  { lsmGameId: 70, code: "rbsevenslot", name: "RB7 Slot", category: "game" },
  { lsmGameId: 47, code: "rich", name: "RICH88", category: "game" },
  { lsmGameId: 80, code: "relax", name: "Relax Gaming", category: "game" },
  { lsmGameId: 31, code: "spsg", name: "SimplePlay", category: "game" },
  { lsmGameId: 44, code: "sw", name: "Sky Wind", category: "game" },
  { lsmGameId: 26, code: "fg", name: "Spadegaming", category: "game" },
  { lsmGameId: 83, code: "vplus", name: "Vplus", category: "game" },
  { lsmGameId: 81, code: "alize", name: "alize", category: "game" },
  { lsmGameId: 62, code: "uuslots", name: "uuslots", category: "game" },
  { lsmGameId: 15, code: "ab", name: "ALLBET", category: "casino" },
  { lsmGameId: 63, code: "astar", name: "ASTAR", category: "casino" },
  { lsmGameId: 50, code: "bg", name: "Big Gaming", category: "casino" },
  { lsmGameId: 90, code: "cg", name: "CG Casino", category: "casino" },
  { lsmGameId: 19, code: "dg", name: "DG Casino", category: "casino" },
  { lsmGameId: 3, code: "evolution", name: "Evolution", category: "casino" },
  { lsmGameId: 71, code: "mangoplay", name: "MangoPlay", category: "casino" },
  { lsmGameId: 38, code: "playtech", name: "Playtech", category: "casino" },
  { lsmGameId: 43, code: "pp", name: "PragmaticPlay", category: "casino" },
  { lsmGameId: 20, code: "pretty", name: "Pretty Gaming", category: "casino" },
  { lsmGameId: 86, code: "audi", name: "RB7 Casino", category: "casino" },
  { lsmGameId: 18, code: "sa", name: "SA Casino", category: "casino" },
  { lsmGameId: 16, code: "sexy", name: "Sexy", category: "casino" },
  { lsmGameId: 44, code: "sw", name: "Sky Wind", category: "casino" },
  { lsmGameId: 85, code: "vivo", name: "Vivo Gaming", category: "casino" },
  { lsmGameId: 1, code: "wcasino", name: "WCASINO", category: "casino" },
  { lsmGameId: 17, code: "wm", name: "WM", category: "casino" },
  { lsmGameId: 58, code: "yeebet", name: "YEEBET", category: "casino" },
  { lsmGameId: 82, code: "iamlotto", name: "IAM LOTTO", category: "lotto" },
  { lsmGameId: 76, code: "rbsevenlotto", name: "Lotto Plus", category: "lotto" },
  { lsmGameId: 59, code: "mylotto99", name: "MYLOTTO99", category: "lotto" },
  { lsmGameId: 22, code: "qqkeno", name: "QQKeno", category: "lotto" },
];

// /mission/banner-setting
export const bannerAutoSlide = true;

export const bannerMenuOptions: Option[] = [
  { value: "mission", chip: "mission", label: "ทำภารกิจ" },
  { value: "mission-history", chip: "mission-history", label: "ประวัติรับรางวัล" },
  { value: "mission-point-exchange", chip: "mission-point-exchange", label: "แลกรางวัล" },
  { value: "uuid-1", chip: "mission-info", label: "QA Happy Mission Retest 20261015" },
  { value: "uuid-2", chip: "mission-info", label: "ภารกิจ 001" },
];

const BANNER_UPLOADS = "https://storage.googleapis.com/one-loyalty-stg-media/uploads/setting-mission-banner";

export const banners: MissionBanner[] = [
  { id: 1, image: `${BANNER_UPLOADS}/20261111T100814383.png`, showOnMissionPage: true, linkType: "menu", menu: "mission-history", url: "" },
  { id: 2, image: `${BANNER_UPLOADS}/20261111T100757764.png`, showOnMissionPage: true, linkType: "menu", menu: "mission-point-exchange", url: "" },
  {
    id: 3,
    image: `${BANNER_UPLOADS}/20261111T100740943.png`,
    showOnMissionPage: true,
    linkType: "menu",
    menu: "mission",
    url: "https://superx.l3t.lsmview.com/mission",
  },
];

// /mission/agent-setting
export const agentSettings: MissionAgentSetting[] = [
  { tenantId: "501", name: "superx", enabled: true, icon: `${CDN}/icon/Vector.png` },
  { tenantId: "669", name: "superxx", enabled: true, icon: `${CDN}/icon/Vector.png` },
];
