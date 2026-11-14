import type { Metadata } from "next";
import { Suspense } from "react";
import {
  getCopyableMissions,
  getGameProviders,
  getIconStyles,
  getImageStyles,
  getMemberGroups,
  getMiniGames,
  getMissionAgents,
  getPromotions,
} from "@/lib/api/missions";
import { MissionForm, type MissionFormData } from "./_components/mission-form";
import { MissionFormLoader } from "./_components/mission-form-loader";

export const metadata: Metadata = { title: "ตั้งค่าภารกิจ" };

// Original URL: /mission/setting (create) and /mission/setting?missionId=<id>&edit=1 (edit)
export default async function MissionSettingFormPage() {
  const [agents, memberGroups, miniGames, promotions, copyMissions, imageStyles, iconStyles, providers] = await Promise.all([
    getMissionAgents(),
    getMemberGroups(),
    getMiniGames(),
    getPromotions(),
    getCopyableMissions(),
    getImageStyles(),
    getIconStyles(),
    getGameProviders(),
  ]);
  const data: MissionFormData = { agents, memberGroups, miniGames, promotions, copyMissions, imageStyles, iconStyles, providers };

  return (
    // The prerendered HTML shows the create form until the URL's search params are known
    <Suspense fallback={<MissionForm data={data} initial={null} missionId="" edit={false} />}>
      <MissionFormLoader data={data} />
    </Suspense>
  );
}
