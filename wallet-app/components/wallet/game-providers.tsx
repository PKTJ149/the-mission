import Image from "next/image";
import type { GameProvider } from "@/lib/wallet-data";
import { SectionHeading } from "./section-heading";

function ProviderTile({ provider }: { provider: GameProvider }) {
  return (
    <a
      href="#"
      className="relative flex flex-col items-center rounded-[16px] border border-white/5 bg-surface-card px-[4px] pt-[16px] pb-[10px] transition-colors duration-200 active:bg-surface-hover"
    >
      {provider.badge && (
        <span className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-[6px] bg-gold px-[6px] text-[10px]/[14px] font-semibold whitespace-nowrap text-page">
          {provider.badge}
        </span>
      )}
      <span className="flex size-[44px] items-center justify-center rounded-[12px] bg-black/50 ring-1 ring-white/5">
        {/* Mock emblem — swap for the provider's official logo */}
        <Image src={provider.logo} alt="" width={32} height={32} className="size-[32px]" />
      </span>
      {/* Wraps to 2 lines on narrow phones; the game count stays pinned to the bottom so rows line up */}
      <span className="mt-[6px] line-clamp-2 w-full text-center text-[12px]/[18px] font-semibold break-words text-white">
        {provider.name}
      </span>
      <span className="mt-auto pt-[2px] text-[11px]/[18px] text-grey-text">{provider.games} เกม</span>
    </a>
  );
}

export function GameProviders({ providers }: { providers: GameProvider[] }) {
  return (
    <section aria-labelledby="providers-title-mobile" className="mt-[12px]">
      <SectionHeading id="providers-title-mobile" title="ค่ายเกม" />
      <div className="grid grid-cols-4 gap-[9px] pr-[17px] pl-[18px]">
        {providers.map((provider) => (
          <ProviderTile key={provider.name} provider={provider} />
        ))}
      </div>
    </section>
  );
}
