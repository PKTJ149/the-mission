"use client";

import Image from "next/image";
import { useState, type UIEvent } from "react";
import type { Promotion } from "@/lib/wallet-data";
import { SectionHeading } from "./section-heading";

function PromoCard({ promotion }: { promotion: Promotion }) {
  return (
    <article className="flex shrink-0 basis-[86%] snap-start flex-col overflow-hidden rounded-[16px] border border-white/5 bg-surface-card">
      {/* Mock artwork — swap the SVG for the real banner image (2:1) */}
      <div className="relative aspect-[2/1]">
        <Image src={promotion.image} alt="" fill sizes="340px" className="object-cover" />
        <span className="absolute top-[10px] left-[10px] rounded-full bg-black/60 px-[10px] text-[12px]/[20px] font-semibold text-gold backdrop-blur-sm">
          {promotion.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-[14px]">
        <h3 className="text-[16px]/[26px] font-semibold text-white">{promotion.title}</h3>
        <p className="mt-[2px] mb-[12px] text-[13px]/[20px] text-grey-text">{promotion.description}</p>
        <button
          type="button"
          className="mt-auto h-[40px] self-start rounded-[10px] bg-gold px-[18px] text-[14px]/[23px] font-semibold text-page transition-colors duration-200 active:bg-[#d6c0a3]"
        >
          รับสิทธิ์
        </button>
      </div>
    </article>
  );
}

export function PromoCarousel({ promotions }: { promotions: Promotion[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Find the card closest to the left edge so the matching dot lights up
  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const track = event.currentTarget;
    const cards = Array.from(track.children) as HTMLElement[];
    const reachedEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;

    if (reachedEnd) {
      setActiveIndex(cards.length - 1);
      return;
    }

    const firstLeft = cards[0].offsetLeft;
    let nearest = 0;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - firstLeft - track.scrollLeft);
      const best = Math.abs(cards[nearest].offsetLeft - firstLeft - track.scrollLeft);
      if (distance < best) nearest = index;
    });
    setActiveIndex(nearest);
  }

  return (
    <section aria-labelledby="promotions-title-mobile" className="mt-[16px]">
      <SectionHeading id="promotions-title-mobile" title="โปรโมชั่น" />

      <div
        onScroll={handleScroll}
        className="relative flex snap-x snap-mandatory scroll-pl-[18px] gap-[12px] overflow-x-auto overscroll-x-contain pr-[17px] pl-[18px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {promotions.map((promotion) => (
          <PromoCard key={promotion.title} promotion={promotion} />
        ))}
      </div>

      <div aria-hidden className="mt-[12px] flex justify-center gap-[6px]">
        {promotions.map((promotion, index) => (
          <span
            key={promotion.title}
            className={`h-[6px] rounded-full transition-[width,background-color] duration-300 ${
              index === activeIndex ? "w-[18px] bg-gold" : "w-[6px] bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
