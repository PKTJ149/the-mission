import type { Metadata } from "next";
import { getMissionFilterOptions, getMissionRewardReport, getReportMissionIds } from "@/lib/api/mission-reports";
import { ByMissionReport } from "./_components/by-mission-report";

export const metadata: Metadata = { title: "สรุปรายงานรายสมาชิก" };

// Opened with full page loads (<a href>) like the original, so the page may wait for its URL id
// instead of streaming a shell first (Next 16 instant-navigation check).
export const instant = false;

export async function generateStaticParams() {
  return (await getReportMissionIds()).missions.map((missionId) => ({ missionId }));
}

// Original URL: /mission/report-mission-by-mission/<missionId> (mission name on /mission/report-mission)
export default async function ReportByMissionPage({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  const [missions, firstData] = await Promise.all([
    getMissionFilterOptions(),
    getMissionRewardReport(missionId, { search: "", dates: null, missionId: null, category: null, maker: null }),
  ]);
  return <ByMissionReport missionId={missionId} missions={missions} initialData={firstData} />;
}
