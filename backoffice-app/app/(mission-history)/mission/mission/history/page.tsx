import type { Metadata } from "next";
import { getMissionHistory } from "@/lib/api/mission-reports";
import { MissionHistory } from "./_components/mission-history";

// ORIGINAL: this page's <title> is empty
export const metadata: Metadata = { title: "" };

// Original URL: /mission/mission/history — ประวัติการแก้ไข (linked from /mission and /mission/agent-setting)
export default async function MissionHistoryPage() {
  const firstPage = await getMissionHistory({ search: "", dates: null, offset: 0, limit: 10 });
  return <MissionHistory initialData={firstPage} />;
}
