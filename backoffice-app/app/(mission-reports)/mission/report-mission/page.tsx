import type { Metadata } from "next";
import { getMissionFilterOptions, getMissionReport } from "@/lib/api/mission-reports";
import { MissionReport } from "./_components/mission-report";

// Document title not captured; the page heading is used
export const metadata: Metadata = { title: "สรุปรายงานรายภารกิจ" };

// Original URL: /mission/report-mission — สรุปรายงานรายภารกิจ
export default async function MissionReportByMissionPage() {
  const [missions, firstData] = await Promise.all([
    getMissionFilterOptions(),
    getMissionReport({ search: "", dates: null, status: null, missionId: null }),
  ]);
  return <MissionReport missions={missions} initialData={firstData} />;
}
