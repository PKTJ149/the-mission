import type { Metadata } from "next";
import { getBannerAutoSlide, getBannerMenuOptions, getMissionBanners } from "@/lib/api/missions";
import { BannerSettingPage } from "./_components/banner-setting-page";

export const metadata: Metadata = { title: "ตั้งค่าแบนเนอร์ภารกิจ" };

// Original URL: /mission/banner-setting (ตั้งค่าแบนเนอร์ภารกิจ, "อัพโหลดแบนเนอร์" on /mission)
export default async function MissionBannerSettingPage() {
  const [banners, menuOptions, autoSlide] = await Promise.all([getMissionBanners(), getBannerMenuOptions(), getBannerAutoSlide()]);
  return <BannerSettingPage initialBanners={banners} menuOptions={menuOptions} initialAutoSlide={autoSlide} />;
}
