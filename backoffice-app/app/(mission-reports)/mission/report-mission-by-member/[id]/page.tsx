import type { Metadata } from "next";
import { getMissionFilterOptions, getMissionMemberReport, getReportMissionIds } from "@/lib/api/mission-reports";
import { ByMemberReport } from "../../_components/by-member-report";

export const metadata: Metadata = { title: "สรุปรายงานรายสมาชิก" };

export async function generateStaticParams() {
  const { missions, subMissions } = await getReportMissionIds();
  return [...missions, ...subMissions].map((id) => ({ id }));
}

// Original URL: /mission/report-mission-by-member/<id>?isMission=true|false (count link on /mission/report-mission).
// Same page as /mission/report-mission-by-reward/<id>; isMission is not needed by the mock.
export default async function ReportByMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [missions, firstData] = await Promise.all([
    getMissionFilterOptions(),
    getMissionMemberReport(id, { search: "", dates: null, missionId: null, category: null, maker: null }),
  ]);
  return <ByMemberReport id={id} missions={missions} initialData={firstData} />;
}
