// Mock data for the mission report pages (/mission/report, /mission/report-mission and their
// drill-downs), /mission/redeem-points and /mission/mission/history.
// Read only through lib/api/mission-reports.ts. Values are copied from the staging capture.

import type {
  Customer,
  MissionHistoryRow,
  RedeemConditions,
  RedeemHistoryRow,
  ReportMember,
  ReportMission,
  RewardLogRow,
} from "@/lib/api/mission-reports";

// The 5 missions as listed on /mission/report-mission (same order). Ids are the real staging
// GUIDs (read from the drill-down links on 15/11/2026), so the drill-down URLs match staging.
// Names are copied here on purpose — lib/mock/missions.ts belongs to the mission settings pages.
export const reportMissions: ReportMission[] = [
  {
    id: "696be291-7f2f-4624-b1c1-34fc791a4b63",
    name: "QA Test Mission 0911",
    duration: "09/11/2026 14:00 - 09/11/2026 17:00",
    status: "expired",
    subMissions: [{ id: "526fac9e-3b31-4854-83a2-1b60a8f6ed0b", name: "QA เข้าสู่ระบบ 1 ครั้ง" }],
  },
  {
    id: "7cc2af5a-194a-4293-8cee-3ef9609e97ff",
    name: "QA Mission 5 Tasks 20261016",
    duration: "16/10/2026 13:50 - เป็นต้นไป",
    status: "deleted",
    subMissions: [
      { id: "744c7a05-cb7d-4448-9ca8-02d61951658c", name: "1. เช็คอินครบ 1 วัน" },
      { id: "139da084-dcf7-44fc-99e3-0b368cb3adc3", name: "2. ฝากขั้นต่ำ 1 บาท 1 ครั้ง" },
      { id: "e79bf645-5a38-462a-a702-4a86387d143d", name: "3. ฝากสะสมครบ 2 บาท" },
      { id: "fc992770-a182-4c16-b7df-551a1964454a", name: "4. ทำเทิร์นสะสมครบ 1 บาท" },
      { id: "eca76e7f-1c68-4531-98e1-22befc666c54", name: "5. แนะนำเพื่อนครบ 1 คน" },
    ],
  },
  {
    id: "c315f762-0daf-452f-b637-4163df82a3c0",
    name: "QA Mission Rewards 20261015 Updated",
    duration: "15/10/2026 14:15 - 14/11/2026 12:00",
    status: "expired",
    subMissions: [
      { id: "dbade722-f333-40b0-a7ca-55ab6b72c55b", name: "QA Login ครบ 1 วัน" },
      { id: "6cc56311-94d1-472b-909f-2b1bc4d0bdce", name: "QA ฝากครั้งเดียว 1 บาท" },
    ],
  },
  {
    id: "50e4d2a0-a8cf-4051-b850-ab65296b6557",
    name: "QA Happy Mission Retest 20261015",
    duration: "15/10/2026 11:46 - เป็นต้นไป",
    status: "online",
    subMissions: [{ id: "648f6232-fe59-4c94-83e5-db412669f9e2", name: "QA เข้าสู่ระบบ 1 ครั้ง" }],
  },
  {
    id: "434abdca-9ea2-4cd7-b0df-258dc6430ffd",
    name: "ภารกิจ 001",
    duration: "14/10/2026 22:26 - เป็นต้นไป",
    status: "online",
    // On staging the report-mission search also finds this sub-mission with "ภารกิจ" / "001"
    // (a server-side text we can't see); other sub-missions are only found by their own name.
    subMissions: [{ id: "59e67609-8d8a-4eef-b7d4-8b57eaa815c4", name: "สะสมเทริน์ครบ 10", searchNames: ["สะสมเทริน์ครบ 10", "ภารกิจ 001"] }],
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

// Customer picker (#manualSelectCustomer) results, from staging's /api/customer/select2 on 15/11/2026.
// The first 10 are page 1 of the search "0Tsuperx5" in staging's order; the rest are the report
// members (looked up one by one). memberId is null where staging's answer was not looked up.
// The id is a GUID that staging re-generates on every search.
export const customerDirectory: Customer[] = [
  { id: "754ce563-1ba2-45f4-921e-7e162c400ff8", username: "0Tsuperx59196961343", name: "ปฏิญญา ชาตรี", memberId: null },
  { id: "af3ff568-8573-4367-90be-140ea90ede33", username: "0Tsuperx54509845025", name: "gml", memberId: null },
  { id: "34f1dfb1-3950-4bdc-a3dc-14e22bd365b4", username: "0Tsuperx53004683138", name: "", memberId: null },
  { id: "00502100-1348-4b92-abdd-9e05ac899820", username: "0Tsuperx59575402679", name: "อุดม สมบูรณ์", memberId: "3904718" },
  { id: "6851ad33-7df9-4e3f-8c41-8ae1ce9a04d9", username: "0Tsuperx50709296151", name: "", memberId: null },
  { id: "2bf4a899-6d03-4ac6-80c3-d44bd184e825", username: "0Tsuperx52016214171", name: "", memberId: null },
  { id: "6331f1a5-ac08-4e8b-9fa6-0585d76a5ebf", username: "0Tsuperx53347173456", name: "กรกฎ บุรินทร์กุล", memberId: null },
  { id: "bcb8e48b-b2d5-477b-840a-158c5d8af41c", username: "0Tsuperx59288943104", name: "Esc Test", memberId: null },
  { id: "84aad0e1-5396-4dba-9f2b-af9f0f004bf7", username: "0Tsuperx55648943765", name: "x'' OR 1=1-- -", memberId: null },
  { id: "cb5c1b9d-9ade-4318-9743-b32d63577c08", username: "0Tsuperx58848690667", name: "สหชาติ สูตรกระโทก", memberId: null },
  { id: "32ada3fa-3d5f-4732-b4ba-5a9cd570017f", username: "0Tsuperx97420509115", name: "แนะนำเพื่อน", memberId: "3948023" },
  { id: "c84f003f-7a96-4b73-8cf5-2ef172944d98", username: "0Tsuperx37530777112", name: "onebx allnew2", memberId: "3670878" },
  { id: "76b1b138-8541-4c50-b8e2-a90117b73f27", username: "0Tsuperx85064568312", name: "เมส123", memberId: "3685833" },
  { id: "fb8bf350-c9b8-4078-81be-99164ac8b4ff", username: "0Tsuperx87179333541", name: "รวี รวิวรรณ", memberId: "4070446" },
  { id: "781843d7-4c23-4ee7-b262-34450d128212", username: "0Tsuperx59557768142", name: "dasd asdsad", memberId: "2560195" },
  { id: "5c127e2d-5661-4908-a1ed-5b4fe901f187", username: "0Tsuperx50981552156", name: "รัฐพงษ์ หิรัญเรือง", memberId: "2589654" },
  { id: "cdfaa9c2-f452-4983-8e26-15353a3b18d7", username: "0Tsuperx81403971005", name: "รัฐงงงง นะครับ", memberId: "2772567" },
  { id: "8bb4d19e-6ff7-44fa-9210-12f94fa0bcbb", username: "0Tsuperx58528064595", name: "APOLLO TESTONLY", memberId: "3564528" },
];

const NO_REWARD = { credit: 0, minigameRights: 0, promotionRights: 0, points: 0, other: 0 };
const ONE_CREDIT = { ...NO_REWARD, credit: 1 };

// All 45 rows of /mission/report, newest first (page 1: data.json rowsPage1, pages 2–5:
// rows-pages-2-5.txt). memberName is the name as displayed — staging leaves it empty on some rows.
// Row r4 has no name and its link id was not captured; it is assumed to be r3's member.
// The drill-downs (member, by-mission) and the /mission/report-mission counts all derive from this list.
export const rewardLog: RewardLogRow[] = [
  { id: "r1", date: "12/11/2026", time: "11:24", memberId: "3948023", memberName: "", missionId: "50e4d2a0-a8cf-4051-b850-ab65296b6557", subMissionId: "648f6232-fe59-4c94-83e5-db412669f9e2", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r2", date: "12/11/2026", time: "11:24", memberId: "3948023", memberName: "", missionId: "50e4d2a0-a8cf-4051-b850-ab65296b6557", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r3", date: "11/11/2026", time: "22:22", memberId: "3904718", memberName: "0Tsuperx59575402679", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: "dbade722-f333-40b0-a7ca-55ab6b72c55b", type: "manual", maker: "user", ...ONE_CREDIT },
  { id: "r4", date: "11/11/2026", time: "22:22", memberId: "3904718", memberName: "", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: "dbade722-f333-40b0-a7ca-55ab6b72c55b", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r5", date: "11/11/2026", time: "16:06", memberId: "3948023", memberName: "0Tsuperx97420509115", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: "dbade722-f333-40b0-a7ca-55ab6b72c55b", type: "manual", maker: "user", ...ONE_CREDIT },
  { id: "r6", date: "11/11/2026", time: "15:57", memberId: "3948023", memberName: "", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: "dbade722-f333-40b0-a7ca-55ab6b72c55b", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r7", date: "09/11/2026", time: "14:21", memberId: "3948023", memberName: "", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "744c7a05-cb7d-4448-9ca8-02d61951658c", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r8", date: "09/11/2026", time: "14:20", memberId: "3948023", memberName: "0Tsuperx97420509115", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: "dbade722-f333-40b0-a7ca-55ab6b72c55b", type: "manual", maker: "user", ...ONE_CREDIT },
  { id: "r9", date: "09/11/2026", time: "14:20", memberId: "3948023", memberName: "", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: "dbade722-f333-40b0-a7ca-55ab6b72c55b", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r10", date: "09/11/2026", time: "14:18", memberId: "3948023", memberName: "", missionId: "696be291-7f2f-4624-b1c1-34fc791a4b63", subMissionId: "526fac9e-3b31-4854-83a2-1b60a8f6ed0b", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r11", date: "09/11/2026", time: "14:18", memberId: "3948023", memberName: "", missionId: "696be291-7f2f-4624-b1c1-34fc791a4b63", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r12", date: "09/11/2026", time: "13:33", memberId: "3670878", memberName: "", missionId: "50e4d2a0-a8cf-4051-b850-ab65296b6557", subMissionId: "648f6232-fe59-4c94-83e5-db412669f9e2", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r13", date: "09/11/2026", time: "13:33", memberId: "3670878", memberName: "", missionId: "50e4d2a0-a8cf-4051-b850-ab65296b6557", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r14", date: "09/11/2026", time: "13:33", memberId: "3670878", memberName: "0Tsuperx37530777112", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: "dbade722-f333-40b0-a7ca-55ab6b72c55b", type: "manual", maker: "user", ...ONE_CREDIT },
  { id: "r15", date: "09/11/2026", time: "13:33", memberId: "3670878", memberName: "", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: "dbade722-f333-40b0-a7ca-55ab6b72c55b", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r16", date: "09/11/2026", time: "13:32", memberId: "3670878", memberName: "", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "744c7a05-cb7d-4448-9ca8-02d61951658c", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r17", date: "07/11/2026", time: "20:43", memberId: "3670878", memberName: "0Tsuperx37530777112", missionId: "434abdca-9ea2-4cd7-b0df-258dc6430ffd", subMissionId: "59e67609-8d8a-4eef-b7d4-8b57eaa815c4", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r18", date: "07/11/2026", time: "20:43", memberId: "3670878", memberName: "0Tsuperx37530777112", missionId: "434abdca-9ea2-4cd7-b0df-258dc6430ffd", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r19", date: "07/11/2026", time: "20:41", memberId: "3670878", memberName: "0Tsuperx37530777112", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "fc992770-a182-4c16-b7df-551a1964454a", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r20", date: "05/11/2026", time: "16:12", memberId: "3685833", memberName: "0Tsuperx85064568312", missionId: "434abdca-9ea2-4cd7-b0df-258dc6430ffd", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r21", date: "05/11/2026", time: "16:12", memberId: "3685833", memberName: "0Tsuperx85064568312", missionId: "434abdca-9ea2-4cd7-b0df-258dc6430ffd", subMissionId: "59e67609-8d8a-4eef-b7d4-8b57eaa815c4", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r22", date: "05/11/2026", time: "16:07", memberId: "3685833", memberName: "0Tsuperx85064568312", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "fc992770-a182-4c16-b7df-551a1964454a", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r23", date: "04/11/2026", time: "20:26", memberId: "4070446", memberName: "0Tsuperx87179333541", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "139da084-dcf7-44fc-99e3-0b368cb3adc3", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r24", date: "04/11/2026", time: "20:26", memberId: "4070446", memberName: "0Tsuperx87179333541", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "e79bf645-5a38-462a-a702-4a86387d143d", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r25", date: "01/11/2026", time: "00:39", memberId: "2560195", memberName: "0Tsuperx59557768142", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "e79bf645-5a38-462a-a702-4a86387d143d", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r26", date: "01/11/2026", time: "00:39", memberId: "2560195", memberName: "0Tsuperx59557768142", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "139da084-dcf7-44fc-99e3-0b368cb3adc3", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r27", date: "01/11/2026", time: "00:39", memberId: "2589654", memberName: "0Tsuperx50981552156", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "139da084-dcf7-44fc-99e3-0b368cb3adc3", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r28", date: "01/11/2026", time: "00:39", memberId: "2589654", memberName: "0Tsuperx50981552156", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "e79bf645-5a38-462a-a702-4a86387d143d", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r29", date: "26/10/2026", time: "16:26", memberId: "3670878", memberName: "", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "eca76e7f-1c68-4531-98e1-22befc666c54", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r30", date: "23/10/2026", time: "02:16", memberId: "2772567", memberName: "0Tsuperx81403971005", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "139da084-dcf7-44fc-99e3-0b368cb3adc3", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r31", date: "23/10/2026", time: "02:16", memberId: "2772567", memberName: "0Tsuperx81403971005", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "e79bf645-5a38-462a-a702-4a86387d143d", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r32", date: "16/10/2026", time: "13:58", memberId: "3564528", memberName: "", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "744c7a05-cb7d-4448-9ca8-02d61951658c", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r33", date: "16/10/2026", time: "13:58", memberId: "3564528", memberName: "", missionId: "50e4d2a0-a8cf-4051-b850-ab65296b6557", subMissionId: "648f6232-fe59-4c94-83e5-db412669f9e2", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r34", date: "16/10/2026", time: "13:58", memberId: "3564528", memberName: "", missionId: "50e4d2a0-a8cf-4051-b850-ab65296b6557", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r35", date: "16/10/2026", time: "13:56", memberId: "3564528", memberName: "0Tsuperx58528064595", missionId: "434abdca-9ea2-4cd7-b0df-258dc6430ffd", subMissionId: "59e67609-8d8a-4eef-b7d4-8b57eaa815c4", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r36", date: "16/10/2026", time: "13:56", memberId: "3564528", memberName: "0Tsuperx58528064595", missionId: "434abdca-9ea2-4cd7-b0df-258dc6430ffd", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r37", date: "16/10/2026", time: "13:56", memberId: "3564528", memberName: "0Tsuperx58528064595", missionId: "7cc2af5a-194a-4293-8cee-3ef9609e97ff", subMissionId: "fc992770-a182-4c16-b7df-551a1964454a", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r38", date: "15/10/2026", time: "19:22", memberId: "3904718", memberName: "", missionId: "50e4d2a0-a8cf-4051-b850-ab65296b6557", subMissionId: "648f6232-fe59-4c94-83e5-db412669f9e2", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r39", date: "15/10/2026", time: "19:22", memberId: "3904718", memberName: "", missionId: "50e4d2a0-a8cf-4051-b850-ab65296b6557", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r40", date: "15/10/2026", time: "16:56", memberId: "3564528", memberName: "0Tsuperx58528064595", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: "dbade722-f333-40b0-a7ca-55ab6b72c55b", type: "manual", maker: "user", ...ONE_CREDIT },
  { id: "r41", date: "15/10/2026", time: "16:55", memberId: "3564528", memberName: "0Tsuperx58528064595", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: null, type: "manual", maker: "user", credit: 1, minigameRights: 1, promotionRights: 0, points: 1, other: 1 },
  { id: "r42", date: "15/10/2026", time: "16:55", memberId: "3564528", memberName: "", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: "dbade722-f333-40b0-a7ca-55ab6b72c55b", type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r43", date: "15/10/2026", time: "16:55", memberId: "3564528", memberName: "", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: null, type: "complete", maker: "auto", ...NO_REWARD },
  { id: "r44", date: "15/10/2026", time: "16:42", memberId: "3904718", memberName: "0Tsuperx59575402679", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: "dbade722-f333-40b0-a7ca-55ab6b72c55b", type: "manual", maker: "user", ...ONE_CREDIT },
  { id: "r45", date: "15/10/2026", time: "16:42", memberId: "3904718", memberName: "", missionId: "c315f762-0daf-452f-b637-4163df82a3c0", subMissionId: "dbade722-f333-40b0-a7ca-55ab6b72c55b", type: "complete", maker: "auto", ...NO_REWARD },
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
  // The Thai condition is one resized image (the redeem table) + 3 empty paragraphs. On staging the
  // image is an inline base64 PNG (348x392) that the capture tool can't read; this file is the same
  // image taken from a full-resolution screenshot on 15/11/2026 and scaled back to 348x392.
  th: '<figure class="image image_resized" style="width:100%;"><img src="/mock-content/redeem-condition-th.png"></figure><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>',
  en: "",
  tl: "",
  // Status labels as captured: TH "(ตั้งค่าแล้ว)", EN/TL "(ยังไม่กำหนด)"
  configured: { th: true, en: false, tl: false },
};
