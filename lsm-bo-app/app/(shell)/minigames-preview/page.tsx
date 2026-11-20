import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { SalePreview } from "./_components/sale-preview";

export const metadata: Metadata = { title: "LSM-SYSTEM:" };

// Same font setup as /minigames: the shell only loads Kanit 400.
const kanit = Kanit({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--mg-font",
  display: "swap",
});

// THROWAWAY SPIKE (PK, 20-11-2026): a one-screen, no-scroll sale page idea for the Minigames menu.
// Lives next to /minigames so the current promo stays untouched until PK picks a direction.
export default function MinigamesPreviewPage() {
  return <SalePreview fontClassName={kanit.variable} />;
}
