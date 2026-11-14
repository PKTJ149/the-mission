import Image from "next/image";
import Link from "next/link";
import { BalancePills } from "./balance-pills";

// Desktop "Mission Header" (Figma "Desktop - 3", 1241px wide): back link, page title, balance pills.
// Shared by the mission list and the mission detail page. Sticks to the top while scrolling.
export function DesktopMissionHeader({
  backHref,
  backLabel,
  title,
  titleAs: Title = "h1",
}: {
  backHref: string;
  backLabel: string;
  title: string;
  // The detail page has its own <h1> further down, so its header title is plain text
  titleAs?: "h1" | "p";
}) {
  return (
    <header className="sticky top-0 z-20 mx-auto flex h-[80px] max-w-[1241px] items-center justify-between rounded-b-[16px] bg-black/80 p-[24px] backdrop-blur-[5px]">
      <Link
        href={backHref}
        className="flex items-center gap-[16px] rounded-[8px] text-[16px]/[26px] font-bold text-gold transition-colors duration-200 hover:text-[#d6c0a3]"
      >
        <Image src="/missions/icons/arrow-desktop.svg" alt="" width={32} height={32} />
        {backLabel}
      </Link>
      <Title className="absolute top-[17px] left-1/2 -translate-x-1/2 text-[28px]/[46px] font-bold whitespace-nowrap text-white">
        {title}
      </Title>
      <BalancePills />
    </header>
  );
}
