import type { ReactNode } from "react";
import { BackOfficeDocument } from "@/components/shell/document";

// Root layout for /mission/redeem-points.
// Each route group is its own root layout so it can carry the original page's own <head>.
export default function Layout({ children }: { children: ReactNode }) {
  return <BackOfficeDocument group="missionRedeem">{children}</BackOfficeDocument>;
}
