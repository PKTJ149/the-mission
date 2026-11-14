"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getMissionFormValues, type MissionFormValues } from "@/lib/api/missions";
import { MissionForm, type MissionFormData } from "./mission-form";

// Reads ?missionId=…&edit=1 (toggleMissionEdit on /mission) and loads that mission's values.
// Must sit inside <Suspense> because it reads the URL search params.
export function MissionFormLoader({ data }: { data: MissionFormData }) {
  const searchParams = useSearchParams();
  const missionId = searchParams.get("missionId") ?? "";
  const edit = searchParams.get("edit") === "1" && missionId !== "";
  const [loaded, setLoaded] = useState<{ id: string; values: MissionFormValues | null } | null>(null);

  useEffect(() => {
    if (!edit) return;
    let active = true;
    getMissionFormValues(missionId).then((values) => {
      if (active) setLoaded({ id: missionId, values });
    });
    return () => {
      active = false;
    };
  }, [edit, missionId]);

  if (!edit) return <MissionForm key="create" data={data} initial={null} missionId="" edit={false} />;
  // Edit: wait for the values so the editors start with them (unknown id → empty form, like a create)
  if (loaded?.id !== missionId) return null;
  return <MissionForm key={missionId} data={data} initial={loaded.values} missionId={missionId} edit />;
}
