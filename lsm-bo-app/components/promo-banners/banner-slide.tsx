"use client";
/* eslint-disable @next/next/no-img-element -- plain <img> for the square banner bitmaps */

import { BANNER_CTA, BANNER_CTA_LABEL, BANNER_EYEBROW, type PromoBanner } from "./banners";
import { SCENES } from "./banner-scenes";
import styles from "./banner.module.css";

type BannerSlideProps = {
  banner: PromoBanner;
  // Only the visible banner runs its animation
  active: boolean;
  onCta: () => void;
};

// "Mini Games" inside the body copy is gold
function Body({ text }: { text: string }) {
  const parts = text.split("Mini Games");
  return (
    <p className={styles.body}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <b>Mini Games</b>}
        </span>
      ))}
    </p>
  );
}

export function BannerSlide({ banner, active, onCta }: BannerSlideProps) {
  // PK's finished bitmaps carry their own CTA graphic, so the whole picture is the button
  if (banner.kind === "image") {
    return (
      <button type="button" className={styles.imageButton} onClick={onCta} aria-label={`${banner.alt} — ${BANNER_CTA_LABEL}`} tabIndex={active ? 0 : -1}>
        <img src={banner.src} width={banner.width} height={banner.height} alt="" draggable={false} />
      </button>
    );
  }

  const Scene = SCENES[banner.scene];
  const { base, glow, streak } = banner.theme;
  return (
    <div
      className={`${styles.designed}${active ? "" : ` ${styles.paused}`}`}
      style={{ background: `radial-gradient(circle at 50% 42%, ${glow} 0%, ${base} 72%)` }}
    >
      <div className={styles.streaks} aria-hidden="true">
        {[12, 30, 78].map((top, i) => (
          <span key={top} className={styles.streak} style={{ top: `${top}%`, background: `linear-gradient(90deg, transparent, ${streak}, transparent)`, opacity: 0.25 + i * 0.15 }} />
        ))}
      </div>
      <div className={styles.podium} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.eyebrow}>{BANNER_EYEBROW}</div>
        <h3 className={styles.headline}>
          {banner.headline.map((line, i) => (
            <span key={line} className={i === banner.headline.length - 1 ? styles.gold : undefined}>
              {line}
            </span>
          ))}
        </h3>
        <div className={styles.scene}>
          <Scene play={active} />
        </div>
        <Body text={banner.body} />
        <button type="button" className={styles.cta} onClick={onCta} tabIndex={active ? 0 : -1}>
          <span className={styles.ctaLead}>{BANNER_CTA.lead}</span>
          <span className={`${styles.ctaMain} ${styles.gold}`}>{BANNER_CTA.main}</span>
        </button>
      </div>
    </div>
  );
}
