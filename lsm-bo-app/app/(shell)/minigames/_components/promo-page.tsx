"use client";

import { MotionConfig } from "motion/react";
import { MinigamesBannerPopup } from "@/components/promo-banners/minigames-banner-popup";
import { Demos } from "./demos";
import { Hero } from "./hero";
import { Missions } from "./missions";
import styles from "./promo.module.css";
import { Benefits, CapabilityStrip, Features, FinalCta, Steps } from "./sections";

// Promo page for merchants who have not subscribed to Mini Games + Missions yet.
// reducedMotion="user": Motion skips transform animations when the OS asks for reduced motion.
export function PromoPage({ fontClassName }: { fontClassName: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={`${styles.page} ${fontClassName}`}>
        <Hero />
        <CapabilityStrip />
        <Demos />
        <Features />
        <Missions />
        <Benefits />
        <Steps />
        <FinalCta />
        {/* Inside .page so the banners get the Kanit font variable */}
        <MinigamesBannerPopup scrollTargetId="minigames-demo" />
      </div>
    </MotionConfig>
  );
}
