import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MissionDetailShell, MissionDetailView } from "@/components/missions/mission-detail-view";
import { missions } from "@/lib/mission-data";
import { getMission } from "@/lib/mission-detail-data";

type Props = { params: Promise<{ id: string }> };

// Build one page per mission ahead of time (/missions/rabbit-detective, ...)
export function generateStaticParams() {
  return missions.map((mission) => ({ id: mission.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: getMission(id)?.title ?? "ภารกิจ" };
}

// Mission detail — opened from the "ทำภารกิจ" button on a mission card.
// The header shows straight away; the mission itself is read from the URL inside <Suspense>.
export default function MissionDetailPage({ params }: Props) {
  return (
    <MissionDetailShell>
      <Suspense fallback={<div className="min-h-dvh" />}>
        <MissionDetail params={params} />
      </Suspense>
    </MissionDetailShell>
  );
}

async function MissionDetail({ params }: Props) {
  const { id } = await params;
  if (!getMission(id)) notFound();
  return <MissionDetailView missionId={id} />;
}
