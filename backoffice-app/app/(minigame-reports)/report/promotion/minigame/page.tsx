import { getMinigameSummary } from "@/lib/api/minigame-reports";
import { MinigameReport } from "./_components/minigame-report";

// Original URL: /report/promotion/minigame — สรุปรายงานมินิเกมส์ (summary table + in-page drill-down)
export const metadata = { title: "สรุปรายงานมินิเกมส์" };

export default async function MiniGameReportPage() {
  const summary = await getMinigameSummary();
  return <MinigameReport initialSummary={summary} />;
}
