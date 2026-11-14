import Image from "next/image";
import type { GameProvider } from "@/lib/wallet-data";
import { SectionHeader } from "./section-header";

function ProviderTile({ provider }: { provider: GameProvider }) {
  return (
    <a
      href="#"
      className="group flex items-center gap-4 rounded-[16px] border border-white/5 bg-surface-card p-4 transition-colors duration-200 hover:border-gold/30 hover:bg-surface-hover"
    >
      <span className="flex size-14 shrink-0 items-center justify-center rounded-[12px] bg-black/50 ring-1 ring-white/5">
        {/* Mock emblem — swap for the provider's official logo */}
        <Image src={provider.logo} alt="" width={40} height={40} className="size-10" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="truncate text-[15px]/[24px] font-semibold text-white">{provider.name}</span>
          {provider.badge && (
            <span className="shrink-0 rounded-full bg-gold/15 px-2 text-[11px]/[18px] font-semibold text-gold">
              {provider.badge}
            </span>
          )}
        </span>
        <span className="block text-[13px]/[20px] text-grey-text">{provider.games} เกม</span>
      </span>
    </a>
  );
}

export function GameProvidersSection({ providers }: { providers: GameProvider[] }) {
  return (
    <section aria-labelledby="providers-title" className="mt-12">
      <SectionHeader id="providers-title" title="ค่ายเกม" subtitle="เลือกเล่นจากค่ายเกมชั้นนำ" />
      <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {providers.map((provider) => (
          <ProviderTile key={provider.name} provider={provider} />
        ))}
      </div>
    </section>
  );
}
