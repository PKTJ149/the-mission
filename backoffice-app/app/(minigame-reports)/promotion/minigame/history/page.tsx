import { getManualMiniGames, getRightsRows } from "@/lib/api/minigame-reports";
import { MinigameHistory } from "./_components/minigame-history";

// Original URL: /promotion/minigame/history — ประวัติการรับ/ใช้สิทธิ์มินิเกมส์
export const metadata = { title: "ประวัติการรับ/ใช้สิทธิ์มินิเกมส์" };

export default async function MiniGameHistoryPage() {
  const [initialPage, miniGames] = await Promise.all([getRightsRows({ offset: 0, limit: 10 }), getManualMiniGames()]);
  return <MinigameHistory initialPage={initialPage} miniGames={miniGames} />;
}
