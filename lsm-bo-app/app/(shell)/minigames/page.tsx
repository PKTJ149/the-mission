import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { getMinigamesSubscription } from "@/lib/api/subscription";
import { PromoPage } from "./_components/promo-page";

export const metadata: Metadata = { title: "LSM-SYSTEM:" };

// The shell only loads Kanit 400; the promo page needs the heavier weights too.
// Exposed as a CSS variable that promo.module.css uses (see .page).
const kanit = Kanit({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--mg-font",
  display: "swap",
});

// Our own page (not in the original LSM-SYSTEM): sidebar item "Minigames".
export default async function MinigamesPage() {
  const { subscribed } = await getMinigamesSubscription();

  // Case 2 (subscribed merchant) comes later: render the merchant's games/missions here instead.
  if (subscribed) return null;

  return <PromoPage fontClassName={kanit.variable} />;
}
