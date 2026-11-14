import type { Metadata } from "next";
import { getMissions } from "@/lib/api/missions";
import { MissionList } from "./_components/mission-list";

export const metadata: Metadata = { title: "ตั้งค่าภารกิจ" };

// Original URL: /mission (ตั้งค่าภารกิจ)
export default async function MissionPage() {
  const missions = await getMissions();
  return <MissionList initialMissions={missions} />;
}
