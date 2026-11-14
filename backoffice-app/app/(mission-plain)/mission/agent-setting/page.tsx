import type { Metadata } from "next";
import { getMissionAgentSettings } from "@/lib/api/missions";
import { AgentSettingPage } from "./_components/agent-setting-page";

export const metadata: Metadata = { title: "ตั้งค่าการจัดการ Agent" };

// Original URL: /mission/agent-setting (gear button on /mission)
export default async function MissionAgentSettingPage() {
  const agents = await getMissionAgentSettings();
  return <AgentSettingPage initialAgents={agents} />;
}
