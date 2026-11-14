"use client";

import Image from "next/image";
import { useState } from "react";
import { missionStats, rewardHistoryPages, rewardKinds, rewardStats } from "@/lib/reward-history-data";

// "ประวัติรับรางวัล" tab (Figma 50:36845, mobile 430px): totals so far, then every reward
// received, 5 entries per page.

const ICONS = "/missions/icons";

export function HistoryPanel() {
  const [page, setPage] = useState(0);
  const entries = rewardHistoryPages[page];

  return (
    <div className="pb-[28px]">
      {/* Totals */}
      <section
        aria-label="สถิติ"
        className="mt-[23px] ml-[19px] h-[481px] w-[395px] rounded-[8px] border border-[#c4ab8c] bg-black/70 px-[21px] pt-[23px]"
      >
        <h2 className="text-center text-[16px]/[26px] font-bold text-white">สถิติการทำภารกิจ</h2>
        <dl className="mt-[16px] flex flex-col gap-[4px] font-bold">
          {missionStats.map((stat, i) => (
            // Figma bottom-aligns the first row and centres the second, so they sit 30px apart
            <div key={stat.label} className={`flex h-[31px] gap-[16px] ${i === 0 ? "items-end" : "items-center"}`}>
              <dt className="w-[254px] text-[13px]/[21px] text-[#d5a952]">{stat.label}</dt>
              <dd className="w-[23px] text-center text-[19px]/[31px] text-[#c4ab8c]">{stat.value}</dd>
              <dd className="text-[13px]/[21px] text-[#e9e9e9]">{stat.unit}</dd>
            </div>
          ))}
        </dl>

        <div aria-hidden className="mt-[21.5px] ml-[3px] h-[2px] w-[352.5px] bg-[#c4ab8c]" />

        <h2 className="mt-[15.5px] text-center text-[16px]/[26px] font-bold text-white">สถิติการรับรางวัล</h2>
        <dl className="mt-[16px] ml-px flex flex-col gap-[12px]">
          {rewardStats.map((stat) => (
            // Rows are 24px tall like the icons; the bigger numbers hang a little lower, as in Figma
            <div key={stat.label} className="flex h-[24px] items-start">
              <dt className="flex w-[142px] items-center gap-[8px] text-[13px]/[21px] text-[#e9e9e9]">
                <Image src={rewardKinds[stat.kind].icon} alt="" width={24} height={24} className="size-[24px]" />
                {stat.label}
              </dt>
              <dd className="mt-[2px] w-[150px] text-right text-[16px]/[26px] font-bold text-[#c4ab8c]">{stat.value}</dd>
              <dd className="mt-[4px] ml-[17px] text-[13px]/[21px] font-bold text-[#e9e9e9]">{stat.unit}</dd>
            </div>
          ))}
        </dl>
      </section>

      <h2 id="reward-history" className="mt-[24px] text-center text-[16px]/[26px] font-bold text-white">
        ประวัติการรับรางวัล
      </h2>

      <div aria-hidden className="mt-[12px] ml-[16px] flex h-[42px] w-[398px] items-center gap-[96px] bg-[#c4ab8c] px-[16px] text-[16px]/[26px] font-bold text-black">
        <span className="w-[221px]">รายการรับรางวัลภารกิจ</span>
        <span>จำนวน</span>
      </div>

      <ul aria-labelledby="reward-history" className="mt-[13px] ml-[16px] w-[398px]">
        {entries.map((entry, i) => (
          <li
            key={`${page}-${i}`}
            className={`flex flex-col gap-[6px] px-[15px] py-[4px] ${i % 2 === 0 ? "bg-black/70" : "bg-[#3a3a3a]/70"}`}
          >
            <p className="flex items-end gap-[14px]">
              <span className="w-[81px] shrink-0 text-[11px]/[18px] text-[#e9e9e9]">{entry.date}</span>
              <span className="min-w-0 truncate text-[13px]/[21px] font-bold text-[#d5a952]">{entry.mission}</span>
            </p>
            {entry.rewards.map((reward) => (
              <p key={reward.kind} className="flex items-center justify-between text-[13px]/[21px]">
                <span className="flex items-center gap-[16px]">
                  <span className="font-bold text-white">รางวัล :</span>
                  <span className="flex items-center gap-[4px] text-[#e9e9e9]">
                    <Image
                      src={rewardKinds[reward.kind].icon}
                      alt=""
                      width={18}
                      height={18}
                      // Figma draws the points coin a little bigger than the others
                      className={reward.kind === "points" ? "size-[18px]" : "size-[16px]"}
                    />
                    {rewardKinds[reward.kind].name}
                  </span>
                </span>
                <span className="text-white">
                  <span className="text-[#7ec200]">{reward.amount}</span> {reward.unit}
                </span>
              </p>
            ))}
          </li>
        ))}
      </ul>

      <Pagination page={page} pageCount={rewardHistoryPages.length} onChange={setPage} />
    </div>
  );
}

// Also used by the desktop version of this tab
export function Pagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (page: number) => void }) {
  const last = pageCount - 1;
  const arrow = (label: string, icon: string, target: number, flip: boolean) => (
    <button
      type="button"
      aria-label={label}
      disabled={target === page}
      onClick={() => onChange(target)}
      className="flex size-[32px] items-center justify-center rounded-[6px] transition-[background-color,opacity] duration-200 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent"
    >
      <Image src={`${ICONS}/${icon}`} alt="" width={32} height={32} className={flip ? "-scale-x-100" : undefined} />
    </button>
  );

  return (
    <nav aria-label="หน้าประวัติการรับรางวัล" className="mt-[21px] flex justify-center gap-[4px]">
      {arrow("หน้าแรก", "page-first.svg", 0, false)}
      {arrow("หน้าก่อนหน้า", "page-prev.svg", Math.max(0, page - 1), false)}
      {Array.from({ length: pageCount }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`หน้า ${i + 1}`}
          aria-current={i === page ? "page" : undefined}
          onClick={() => onChange(i)}
          className={`size-[32px] rounded-[6px] text-[16px]/[26px] transition-colors duration-200 ${
            i === page ? "bg-[#c4ab8c] text-[#141414]" : "text-[#e9e9e9] hover:bg-white/10"
          }`}
        >
          {i + 1}
        </button>
      ))}
      {arrow("หน้าถัดไป", "page-prev.svg", Math.min(last, page + 1), true)}
      {arrow("หน้าสุดท้าย", "page-first.svg", last, true)}
    </nav>
  );
}
