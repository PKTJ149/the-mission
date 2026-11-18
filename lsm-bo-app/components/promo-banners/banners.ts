// Content for the Mini Games promo banners (square, 1:1).
// Used by the Minigames page popup now, and later by the Login page slider, so everything a banner
// needs lives here. PK can swap a designed banner for a finished image at any time: change its
// entry to `kind: "image"` (file in public/promo-banners/).
//
// Font: designed banners use `var(--mg-font)` (Kanit 400–700, see app/minigames/page.tsx). A page
// that shows them must load Kanit with that CSS variable on an ancestor (or the portal root).

export type DesignedScene = "mission";

// One dark colour + gold per banner (PK's pattern: 1 = navy, 2 = emerald)
export type BannerTheme = {
  // Deepest colour (edges, frame behind the slide)
  base: string;
  // Lighter centre glow
  glow: string;
  // Light streaks
  streak: string;
};

// A finished bitmap from PK (it already contains its own copy and CTA graphic)
export type ImageBanner = {
  kind: "image";
  id: string;
  src: string;
  width: number;
  height: number;
  // Thai alt text: the banner's headline
  alt: string;
};

// A banner built in code: copy + an animated illustration, in the same navy-and-gold style
export type DesignedBanner = {
  kind: "designed";
  id: string;
  scene: DesignedScene;
  // One entry per line. The last line gets the metallic gold gradient.
  headline: string[];
  // "Mini Games" inside the body is highlighted in gold
  body: string;
  // Black gift box next to the CTA (off when the scene already has one)
  ctaGift: boolean;
  theme: BannerTheme;
};

export type PromoBanner = ImageBanner | DesignedBanner;

// Same on every designed banner
export const BANNER_EYEBROW = "Play. Engage. Repeat.";
export const BANNER_CTA = { lead: "ดูข้อมูลเพิ่มเติม", main: "ลุ้นรับสิทธิ์ใช้งานฟรี" };
// Accessible name of the CTA (image banners have it baked into the picture)
export const BANNER_CTA_LABEL = `${BANNER_CTA.lead} ${BANNER_CTA.main}`;

export const PROMO_BANNERS: PromoBanner[] = [
  {
    kind: "image",
    id: "comeback",
    src: "/promo-banners/banner-01.webp",
    width: 1254,
    height: 1254,
    alt: "ลูกค้าใหม่หายาก หาลูกค้าเก่าง่ายกว่า...",
  },
  {
    kind: "image",
    id: "coins",
    src: "/promo-banners/banner-02.webp",
    width: 1254,
    height: 1254,
    alt: "ไม่อยากให้ลูกค้า ได้ปุ๊บๆปั๊บๆ ถอนปุ๊บๆปั๊บๆ",
  },
  {
    kind: "designed",
    id: "mission",
    scene: "mission",
    // PK's copy is one line; split in two so every banner has the same two-line rhythm
    headline: ["ยอดเล่นเยอะ", "ยอดฝากน้อย"],
    body: "ต่อยอดการตลาดด้วย Mini Games ที่ช่วยสร้างกิจกรรม กระตุ้นการฝากเงินผ่านภารกิจ ที่พร้อมปรับกติกาและรางวัลได้ตามต้องการ",
    ctaGift: true,
    theme: { base: "#14031f", glow: "#6b1f8f", streak: "rgba(232, 121, 249, 0.85)" },
  },
  {
    kind: "image",
    id: "tomorrow",
    src: "/promo-banners/banner-04.webp",
    width: 1024,
    height: 1024,
    alt: "วันนี้คุณทำอะไร ให้ลูกค้ากลับมาพรุ่งนี้?",
  },
];

// Words drawn inside the illustrations (illustrative only)
export const SCENE_TEXT = {
  mission: {
    title: "ภารกิจฝากเงิน",
    sub: "ฝากสะสมครบ 3 ครั้ง",
    steps: ["ครั้งที่ 1", "ครั้งที่ 2", "ครั้งที่ 3"],
  },
};

// Labels for the slider and the popup (screen readers + visible)
export const BANNER_UI = {
  carouselLabel: "แนะนำ Mini Games",
  prev: "แบนเนอร์ก่อนหน้า",
  next: "แบนเนอร์ถัดไป",
  goTo: (n: number) => `ไปที่แบนเนอร์ที่ ${n}`,
  slideLabel: (n: number, total: number) => `${n} จาก ${total}`,
  close: "ปิด",
  skipToday: "ไม่แสดงอีกในวันนี้",
};
