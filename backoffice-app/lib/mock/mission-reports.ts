// Mock data for the mission report pages (/mission/report, /mission/report-mission and their
// drill-downs), /mission/redeem-points and /mission/mission/history.
// Read only through lib/api/mission-reports.ts. Values are copied from the staging capture.

import type {
  MissionHistoryRow,
  RedeemConditions,
  RedeemHistoryRow,
  ReportMember,
  ReportMission,
  RewardLogRow,
} from "@/lib/api/mission-reports";

// The 5 missions as listed on /mission/report-mission (same order). Ids are the capture's
// placeholders (real ones are GUIDs): missions uuid-1…5, sub-missions uuid-6…15.
// Names are copied here on purpose — lib/mock/missions.ts belongs to the mission settings pages.
export const reportMissions: ReportMission[] = [
  {
    id: "uuid-1",
    name: "QA Test Mission 0911",
    duration: "09/11/2026 14:00 - 09/11/2026 17:00",
    status: "expired",
    subMissions: [{ id: "uuid-6", name: "QA เข้าสู่ระบบ 1 ครั้ง" }],
  },
  {
    id: "uuid-2",
    name: "QA Mission 5 Tasks 20261016",
    duration: "16/10/2026 13:50 - เป็นต้นไป",
    status: "deleted",
    subMissions: [
      { id: "uuid-7", name: "1. เช็คอินครบ 1 วัน" },
      { id: "uuid-8", name: "2. ฝากขั้นต่ำ 1 บาท 1 ครั้ง" },
      { id: "uuid-9", name: "3. ฝากสะสมครบ 2 บาท" },
      { id: "uuid-10", name: "4. ทำเทิร์นสะสมครบ 1 บาท" },
      { id: "uuid-11", name: "5. แนะนำเพื่อนครบ 1 คน" },
    ],
  },
  {
    id: "uuid-3",
    name: "QA Mission Rewards 20261015 Updated",
    duration: "15/10/2026 14:15 - 14/11/2026 12:00",
    status: "expired",
    subMissions: [
      { id: "uuid-12", name: "QA Login ครบ 1 วัน" },
      { id: "uuid-13", name: "QA ฝากครั้งเดียว 1 บาท" },
    ],
  },
  {
    id: "uuid-4",
    name: "QA Happy Mission Retest 20261015",
    duration: "15/10/2026 11:46 - เป็นต้นไป",
    status: "online",
    subMissions: [{ id: "uuid-14", name: "QA เข้าสู่ระบบ 1 ครั้ง" }],
  },
  {
    id: "uuid-5",
    name: "ภารกิจ 001",
    duration: "14/10/2026 22:26 - เป็นต้นไป",
    status: "online",
    subMissions: [{ id: "uuid-15", name: "สะสมเทริน์ครบ 10" }],
  },
];

// Members seen on /mission/report (id = the row link /mission/report-mission-member-detail/<id>)
export const reportMembers: ReportMember[] = [
  { id: "3948023", username: "0Tsuperx97420509115" },
  { id: "3904718", username: "0Tsuperx59575402679" },
  { id: "3670878", username: "0Tsuperx37530777112" },
  { id: "3685833", username: "0Tsuperx85064568312" },
  { id: "4070446", username: "0Tsuperx87179333541" },
  { id: "2560195", username: "0Tsuperx59557768142" },
  { id: "2589654", username: "0Tsuperx50981552156" },
  { id: "2772567", username: "0Tsuperx81403971005" },
  { id: "3564528", username: "0Tsuperx58528064595" },
];

const NO_REWARD = { credit: 0, minigameRights: 0, promotionRights: 0, points: 0, other: 0 };
const ONE_CREDIT = { ...NO_REWARD, credit: 1 };

// All 45 rows of /mission/report, newest first (page 1: data.json rowsPage1, pages 2–5:
// rows-pages-2-5.txt). memberName is the name as displayed — staging leaves it empty on some rows.
// Row r4 has no name and its link id was not captured; it is assumed to be r3's member.
// The drill-downs (member, by-mission) and the /mission/report-mission counts all derive from this list.
export const rewardLog: RewardLogRow[] = [
  { id: "r1", date: "12/11/2026", time: "11:24", memberId: "3948023", memberName: "", missionId: "uuid-4", subMissionId: "uuid-14", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r2", date: "12/11/2026", time: "11:24", memberId: "3948023", memberName: "", missionId: "uuid-4", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r3", date: "11/11/2026", time: "22:22", memberId: "3904718", memberName: "0Tsuperx59575402679", missionId: "uuid-3", subMissionId: "uuid-12", type: "manual", maker: "user", ...ONE_CREDIT },
  { id: "r4", date: "11/11/2026", time: "22:22", memberId: "3904718", memberName: "", missionId: "uuid-3", subMissionId: "uuid-12", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r5", date: "11/11/2026", time: "16:06", memberId: "3948023", memberName: "0Tsuperx97420509115", missionId: "uuid-3", subMissionId: "uuid-12", type: "manual", maker: "user", ...ONE_CREDIT },
  { id: "r6", date: "11/11/2026", time: "15:57", memberId: "3948023", memberName: "", missionId: "uuid-3", subMissionId: "uuid-12", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r7", date: "09/11/2026", time: "14:21", memberId: "3948023", memberName: "", missionId: "uuid-2", subMissionId: "uuid-7", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r8", date: "09/11/2026", time: "14:20", memberId: "3948023", memberName: "0Tsuperx97420509115", missionId: "uuid-3", subMissionId: "uuid-12", type: "manual", maker: "user", ...ONE_CREDIT },
  { id: "r9", date: "09/11/2026", time: "14:20", memberId: "3948023", memberName: "", missionId: "uuid-3", subMissionId: "uuid-12", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r10", date: "09/11/2026", time: "14:18", memberId: "3948023", memberName: "", missionId: "uuid-1", subMissionId: "uuid-6", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r11", date: "09/11/2026", time: "14:18", memberId: "3948023", memberName: "", missionId: "uuid-1", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r12", date: "09/11/2026", time: "13:33", memberId: "3670878", memberName: "", missionId: "uuid-4", subMissionId: "uuid-14", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r13", date: "09/11/2026", time: "13:33", memberId: "3670878", memberName: "", missionId: "uuid-4", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r14", date: "09/11/2026", time: "13:33", memberId: "3670878", memberName: "0Tsuperx37530777112", missionId: "uuid-3", subMissionId: "uuid-12", type: "manual", maker: "user", ...ONE_CREDIT },
  { id: "r15", date: "09/11/2026", time: "13:33", memberId: "3670878", memberName: "", missionId: "uuid-3", subMissionId: "uuid-12", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r16", date: "09/11/2026", time: "13:32", memberId: "3670878", memberName: "", missionId: "uuid-2", subMissionId: "uuid-7", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r17", date: "07/11/2026", time: "20:43", memberId: "3670878", memberName: "0Tsuperx37530777112", missionId: "uuid-5", subMissionId: "uuid-15", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r18", date: "07/11/2026", time: "20:43", memberId: "3670878", memberName: "0Tsuperx37530777112", missionId: "uuid-5", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r19", date: "07/11/2026", time: "20:41", memberId: "3670878", memberName: "0Tsuperx37530777112", missionId: "uuid-2", subMissionId: "uuid-10", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r20", date: "05/11/2026", time: "16:12", memberId: "3685833", memberName: "0Tsuperx85064568312", missionId: "uuid-5", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r21", date: "05/11/2026", time: "16:12", memberId: "3685833", memberName: "0Tsuperx85064568312", missionId: "uuid-5", subMissionId: "uuid-15", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r22", date: "05/11/2026", time: "16:07", memberId: "3685833", memberName: "0Tsuperx85064568312", missionId: "uuid-2", subMissionId: "uuid-10", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r23", date: "04/11/2026", time: "20:26", memberId: "4070446", memberName: "0Tsuperx87179333541", missionId: "uuid-2", subMissionId: "uuid-8", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r24", date: "04/11/2026", time: "20:26", memberId: "4070446", memberName: "0Tsuperx87179333541", missionId: "uuid-2", subMissionId: "uuid-9", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r25", date: "01/11/2026", time: "00:39", memberId: "2560195", memberName: "0Tsuperx59557768142", missionId: "uuid-2", subMissionId: "uuid-9", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r26", date: "01/11/2026", time: "00:39", memberId: "2560195", memberName: "0Tsuperx59557768142", missionId: "uuid-2", subMissionId: "uuid-8", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r27", date: "01/11/2026", time: "00:39", memberId: "2589654", memberName: "0Tsuperx50981552156", missionId: "uuid-2", subMissionId: "uuid-8", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r28", date: "01/11/2026", time: "00:39", memberId: "2589654", memberName: "0Tsuperx50981552156", missionId: "uuid-2", subMissionId: "uuid-9", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r29", date: "26/10/2026", time: "16:26", memberId: "3670878", memberName: "", missionId: "uuid-2", subMissionId: "uuid-11", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r30", date: "23/10/2026", time: "02:16", memberId: "2772567", memberName: "0Tsuperx81403971005", missionId: "uuid-2", subMissionId: "uuid-8", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r31", date: "23/10/2026", time: "02:16", memberId: "2772567", memberName: "0Tsuperx81403971005", missionId: "uuid-2", subMissionId: "uuid-9", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r32", date: "16/10/2026", time: "13:58", memberId: "3564528", memberName: "", missionId: "uuid-2", subMissionId: "uuid-7", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r33", date: "16/10/2026", time: "13:58", memberId: "3564528", memberName: "", missionId: "uuid-4", subMissionId: "uuid-14", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r34", date: "16/10/2026", time: "13:58", memberId: "3564528", memberName: "", missionId: "uuid-4", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r35", date: "16/10/2026", time: "13:56", memberId: "3564528", memberName: "0Tsuperx58528064595", missionId: "uuid-5", subMissionId: "uuid-15", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r36", date: "16/10/2026", time: "13:56", memberId: "3564528", memberName: "0Tsuperx58528064595", missionId: "uuid-5", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r37", date: "16/10/2026", time: "13:56", memberId: "3564528", memberName: "0Tsuperx58528064595", missionId: "uuid-2", subMissionId: "uuid-10", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r38", date: "15/10/2026", time: "19:22", memberId: "3904718", memberName: "", missionId: "uuid-4", subMissionId: "uuid-14", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r39", date: "15/10/2026", time: "19:22", memberId: "3904718", memberName: "", missionId: "uuid-4", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r40", date: "15/10/2026", time: "16:56", memberId: "3564528", memberName: "0Tsuperx58528064595", missionId: "uuid-3", subMissionId: "uuid-12", type: "manual", maker: "user", ...ONE_CREDIT },
  { id: "r41", date: "15/10/2026", time: "16:55", memberId: "3564528", memberName: "0Tsuperx58528064595", missionId: "uuid-3", subMissionId: null, type: "manual", maker: "user", credit: 1, minigameRights: 1, promotionRights: 0, points: 1, other: 1 },
  { id: "r42", date: "15/10/2026", time: "16:55", memberId: "3564528", memberName: "", missionId: "uuid-3", subMissionId: "uuid-12", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r43", date: "15/10/2026", time: "16:55", memberId: "3564528", memberName: "", missionId: "uuid-3", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r44", date: "15/10/2026", time: "16:42", memberId: "3904718", memberName: "0Tsuperx59575402679", missionId: "uuid-3", subMissionId: "uuid-12", type: "manual", maker: "user", ...ONE_CREDIT },
  { id: "r45", date: "15/10/2026", time: "16:42", memberId: "3904718", memberName: "", missionId: "uuid-3", subMissionId: "uuid-12", type: "complete", maker: "auto", ...NO_REWARD },
];

// /mission/report-mission-by-reward|by-member/<id> only ever showed the empty state on staging.
// Set to true to fill them with the matching rewardLog rows instead (same table as by-mission;
// the populated markup itself was never captured).
export const SHOW_MOCK_BY_MEMBER_ROWS = false;

// /mission/mission/history — all 25 rows (data.json), newest first
export const missionHistory: MissionHistoryRow[] = [
  { editDate: "12/11/2026 20:36", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนการเริ่มภารกิจทันทีที่สร้างเสร็จเป็น เปิด", editor: "(superx)" },
  { editDate: "12/11/2026 19:19", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนสถานะเวลาทั้งวันเป็นภารกิจที่ 1 เป็น ปิด", editor: "(superx)" },
  { editDate: "12/11/2026 19:19", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนเวลาเริ่มทำภารกิจที่ 1 เป็น 00:00", editor: "(superx)" },
  { editDate: "12/11/2026 19:19", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนเวลาสิ้นสุดทำภารกิจที่ 1 เป็น 22:00", editor: "(superx)" },
  { editDate: "12/11/2026 19:11", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนการเริ่มภารกิจทันทีที่สร้างเสร็จเป็น ปิด", editor: "(superx)" },
  { editDate: "12/11/2026 19:11", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนวันที่เริ่มต้นเป็น 20261111", editor: "(superx)" },
  { editDate: "12/11/2026 19:11", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนเวลาที่เริ่มต้นเป็น 12:00", editor: "(superx)" },
  { editDate: "12/11/2026 19:11", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนการเป็นภารกิจไม่มีวันสิ้นสุดเป็น ปิด", editor: "(superx)" },
  { editDate: "12/11/2026 19:11", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนวันที่สิ้นสุดเป็น 20261114", editor: "(superx)" },
  { editDate: "12/11/2026 19:11", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนเวลาที่สิ้นสุดเป็น 12:00", editor: "(superx)" },
  { editDate: "11/11/2026 15:57", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนการเปิดใช้งานการแจ้งเตือนเป็น เปิด", editor: "(superx)" },
  { editDate: "11/11/2026 15:57", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนแจ้งเตือน Pop up เมื่อเข้าสู่ระบบเป็น เปิด", editor: "(superx)" },
  { editDate: "11/11/2026 15:57", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนแจ้งเตือน Floating เมื่อเข้าสู่ระบบเป็น เปิด", editor: "(superx)" },
  { editDate: "11/11/2026 15:54", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนรูปแบบการทำภารกิจเป็น เรียงลำดับทำภารกิจ", editor: "(superx)" },
  { editDate: "09/11/2026 14:28", mission: "QA Mission 5 Tasks 20261016", detail: "ลบภารกิจ", editor: "(superx)" },
  { editDate: "09/11/2026 14:28", mission: "QA Mission 5 Tasks 20261016", detail: "เปลี่ยนสถานะเป็น online", editor: "(superx)" },
  { editDate: "09/11/2026 14:28", mission: "QA Mission 5 Tasks 20261016", detail: "เปลี่ยนสถานะเป็น offline", editor: "(superx)" },
  { editDate: "09/11/2026 14:27", mission: "QA Test Mission 0911", detail: "เปลี่ยนรูปภาพเป็น https://cdn.lsmloyalty.com/images/mission/cover/01/mission-07.webp", editor: "(superx)" },
  { editDate: "09/11/2026 14:04", mission: "QA Test Mission 0911", detail: "เปลี่ยนเวลาที่เริ่มต้นเป็น 14:00", editor: "(superx)" },
  { editDate: "09/11/2026 14:03", mission: "QA Test Mission 0911", detail: "เปลี่ยนเวลาที่เริ่มต้นเป็น 12:00", editor: "(superx)" },
  { editDate: "09/11/2026 14:03", mission: "QA Test Mission 0911", detail: "เปลี่ยนการเป็นภารกิจไม่มีวันสิ้นสุดเป็น ปิด", editor: "(superx)" },
  { editDate: "09/11/2026 14:03", mission: "QA Test Mission 0911", detail: "เปลี่ยนวันที่สิ้นสุดเป็น 20261109", editor: "(superx)" },
  { editDate: "09/11/2026 14:03", mission: "QA Test Mission 0911", detail: "เปลี่ยนเวลาที่สิ้นสุดเป็น 17:00", editor: "(superx)" },
  { editDate: "15/10/2026 14:18", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนชื่อเป็น QA Mission Rewards 20261015 Updated", editor: "(superx)" },
  { editDate: "15/10/2026 14:18", mission: "QA Mission Rewards 20261015 Updated", detail: "เปลี่ยนชื่อในภาษา Default (Thai) เป็น QA Mission Rewards 20261015 Updated", editor: "(superx)" },
];

// /mission/redeem-points — staging had no redeem history (empty state)
export const redeemHistory: RedeemHistoryRow[] = [];

// Set to true to show REDEEM_SAMPLE_ROWS instead of the empty state. The row markup was never
// captured (no rows on staging), so these rows and their markup are a guess.
export const SHOW_MOCK_REDEEM_ROWS = false;
export const REDEEM_SAMPLE_ROWS: RedeemHistoryRow[] = [
  { id: "s1", date: "12/11/2026", time: "10:15", username: "0Tsuperx58528064595", pointsBefore: 1000, pointsUsed: 1000, pointsAfter: 0, reward: "100 เครดิต", maker: "superx" },
];

// The only "ผู้ทำรายการ" option on staging
export const redeemMakers = ["superx"];

export const redeemConditions: RedeemConditions = {
  enabled: true,
  // ORIGINAL: the Thai condition was one resized image (a table: 100 เครดิต 1,000 แต้ม, 1,000 เครดิต
  // 10,000 แต้ม, สิทธิ์หมุนวงล้อ 1 สิทธิ์ 500 แต้ม, สิทธิ์มินิเกมส์ 1 สิทธิ์ 500 แต้ม) + 3 empty
  // paragraphs. The <img> was withheld by the capture tool, so only the paragraphs are kept.
  th: "<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>",
  en: "",
  tl: "",
  // Status labels as captured: TH "(ตั้งค่าแล้ว)", EN/TL "(ยังไม่กำหนด)"
  configured: { th: true, en: false, tl: false },
};
