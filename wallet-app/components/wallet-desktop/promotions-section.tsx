import Image from "next/image";
import type { Promotion } from "@/lib/wallet-data";
import { SectionHeader } from "./section-header";

function PromotionCard({ promotion }: { promotion: Promotion }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] border border-white/5 bg-surface-card transition-colors duration-200 hover:border-gold/30">
      {/* Mock artwork — swap the SVG for the real banner image (2:1) */}
      <div className="relative aspect-[2/1] overflow-hidden">
        <Image
          src={promotion.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 380px, 30vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-0.5 text-[12px]/[20px] font-semibold text-gold backdrop-blur-sm">
          {promotion.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[18px]/[28px] font-bold text-white">{promotion.title}</h3>
        <p className="mt-1 mb-5 text-[13px]/[20px] text-grey-text">{promotion.description}</p>
        <button
          type="button"
          className="mt-auto h-10 self-start rounded-[10px] bg-gold px-5 text-[14px]/[22px] font-semibold text-page transition-colors duration-200 hover:bg-[#d6c0a3]"
        >
          รับสิทธิ์
        </button>
      </div>
    </article>
  );
}

export function PromotionsSection({ promotions }: { promotions: Promotion[] }) {
  return (
    <section aria-labelledby="promotions-title" className="mt-12">
      <SectionHeader id="promotions-title" title="โปรโมชั่น" subtitle="สิทธิพิเศษสำหรับคุณวันนี้" />
      <div className="mt-5 grid grid-cols-3 gap-5">
        {promotions.map((promotion) => (
          <PromotionCard key={promotion.title} promotion={promotion} />
        ))}
      </div>
    </section>
  );
}
