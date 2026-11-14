import type { Metadata } from "next";
import { getManualRewardOptions, getMemberReport, getMissionFilterOptions } from "@/lib/api/mission-reports";
import { MemberReport } from "./_components/member-report";

export const metadata: Metadata = { title: "สรุปรายงานรายสมาชิก" };

// Original URL: /mission/report — สรุปรายงานรายสมาชิก
export default async function MissionReportPage() {
  const [missions, manualOptions, firstPage] = await Promise.all([
    getMissionFilterOptions(),
    getManualRewardOptions(),
    getMemberReport({ search: "", dates: null, missionId: null, category: null, maker: null, offset: 0, limit: 10 }),
  ]);
  return <MemberReport missions={missions} manualOptions={manualOptions} initialData={firstPage} />;
}
