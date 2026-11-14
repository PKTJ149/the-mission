import type { Metadata } from "next";
import { MiniGamePage } from "./_components/minigame-page";

export const metadata: Metadata = { title: "ตั้งค่ามินิเกมส์" };

// Original URL: /promotion/mini-game-v2 — mini-game list + create / edit / detail wizard
export default function Page() {
  return <MiniGamePage />;
}
