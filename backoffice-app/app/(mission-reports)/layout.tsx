import type { ReactNode } from "react";
import { BackOfficeDocument } from "@/components/shell/document";

// Root layout for /promotion/minigame/minigame-period-deposit, /mission/report, /mission/report-mission.
// Each route group is its own root layout so it can carry the original page's own <head>.
export default function Layout({ children }: { children: ReactNode }) {
  return <BackOfficeDocument group="missionReports">{children}</BackOfficeDocument>;
}
