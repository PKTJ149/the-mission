import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComponentShowcase } from "@/components/ui/dev/component-showcase";

export const metadata: Metadata = { title: "Components (dev, mission CSS)" };

// Dev-only: the primitives with the mission form stylesheets (IBM Plex + mission.css + asColorPicker + CKEditor).
export default function DevMissionComponentsPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ComponentShowcase />;
}
