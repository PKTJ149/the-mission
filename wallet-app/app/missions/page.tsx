import type { Metadata } from "next";
import { MissionsView } from "@/components/missions/missions-view";

export const metadata: Metadata = {
  title: "ภารกิจ",
};

// Mission list page — opened from the "ภารกิจ" menu on the wallet page
export default function MissionsPage() {
  return <MissionsView />;
}
