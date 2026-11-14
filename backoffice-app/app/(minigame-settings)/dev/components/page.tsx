import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComponentShowcase } from "@/components/ui/dev/component-showcase";

export const metadata: Metadata = { title: "Components (dev)" };

// Dev-only: every shared primitive inside the real shell, with the mini-game page stylesheets.
// /dev/components/mission shows the same thing with the mission stylesheets.
export default function DevComponentsPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ComponentShowcase />;
}
