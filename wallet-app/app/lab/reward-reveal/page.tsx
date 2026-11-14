import type { Metadata } from "next";
import { RewardRevealDemo } from "@/components/reward-reveal/reward-reveal-demo";

export const metadata: Metadata = {
  title: "ทดลองเปิดกล่องรางวัล",
  robots: { index: false }, // prototype only — keep it out of search engines
};

// Prototype page for the 3D reward reveal. Not linked from the app — open /lab/reward-reveal directly.
export default function RewardRevealPage() {
  return <RewardRevealDemo />;
}
