"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { missionStats, rewardHistoryPages, rewardKinds, rewardStats } from "@/lib/reward-history-data";
import { Pagination } from "./history-panel";

// Desktop "ประวัติรับรางวัล" tab. There's no desktop design in Figma yet, so this is built from
// the mobile screen (50:36845): totals on the left, every reward in a real table on the right.
// From 1280px the two sit side by side; between 1024 and 1279px they stack.

export function DesktopHistoryPanel() {
  const [page, setPage] = useState(0);
  const entries = rewardHistoryPages[page];
  const titleId = useId();

  return (
    <div className="mt-[24px] grid items-start gap-[24px] xl:grid-cols-[395px_minmax(0,1fr)]">
      <StatsCard />

      <section aria-labelledby={titleId}>
        <div className="overflow-clip rounded-[16px] border border-[#403a31] bg-[#151515]">
          {/* Title bar inside the card, so this card and the totals card start level */}
          <div className="flex items-center justify-between gap-[16px] px-[20px] py-[14px]">
            <h2 id={titleId} className="text-[16px]/[26px] font-bold text-white">
              ประวัติการรับรางวัล
            </h2>
            {/* Read out when the page changes */}
            <p aria-live="polite" className="text-[13px]/[21px] text-[#9c9c9c]">
              หน้า {page + 1} จาก {rewardHistoryPages.length}
            </p>
          </div>
          <table className="w-full table-fixed text-left text-[14px]/[23px] text-[#e9e9e9]">
            <thead>
              <tr className="h-[44px] bg-[#c4ab8c] font-bold text-[#141414]">
                <th scope="col" className="w-[148px] pl-[20px]">
                  วันที่
                </th>
                <th scope="col" className="px-[16px]">
                  ภารกิจ
                </th>
                <th scope="col" className="w-[200px] px-[16px]">
                  รางวัล
                </th>
                <th scope="col" className="w-[132px] pr-[20px] text-right">
                  จำนวน
                </th>
              </tr>
            </thead>

            {/* One <tbody> per mission, one row per reward — date and mission span all its rows */}
            {entries.map((entry, i) => (
              <tbody
                key={`${page}-${i}`}
                className={`border-t border-[#2b2b2b] first-of-type:border-t-0 ${i % 2 === 1 ? "bg-white/[0.04]" : ""}`}
              >
                {entry.rewards.map((reward, r) => {
                  const rowCount = entry.rewards.length;
                  // Breathing room above the first reward and below the last one
                  const pad = `${r === 0 ? "pt-[14px]" : "pt-[6px]"} ${r === rowCount - 1 ? "pb-[14px]" : ""}`;
                  return (
                    <tr key={reward.kind}>
                      {r === 0 && (
                        <>
                          <td rowSpan={rowCount} className="py-[14px] pl-[20px] align-top text-[13px]/[23px] whitespace-nowrap tabular-nums">
                            {entry.date}
                          </td>
                          <th scope="rowgroup" rowSpan={rowCount} className="px-[16px] py-[14px] align-top font-bold text-[#d5a952]">
                            {entry.mission}
                          </th>
                        </>
                      )}
                      <td className={`px-[16px] ${pad}`}>
                        <span className="flex items-center gap-[8px]">
                          <Image src={rewardKinds[reward.kind].icon} alt="" width={20} height={20} className="size-[20px] shrink-0" />
                          {rewardKinds[reward.kind].name}
                        </span>
                      </td>
                      <td className={`pr-[20px] text-right whitespace-nowrap ${pad}`}>
                        <span className="font-bold text-[#7ec200] tabular-nums">{reward.amount}</span>{" "}
                        <span className="text-white">{reward.unit}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ))}
          </table>
        </div>

        <Pagination page={page} pageCount={rewardHistoryPages.length} onChange={setPage} />
      </section>
    </div>
  );
}

// Totals card. When it's wide (1024–1279px) the two groups sit side by side.
function StatsCard() {
  return (
    <section aria-label="สถิติ" className="@container rounded-[16px] border border-[#c4ab8c] bg-black/70 p-[24px]">
      <div className="grid gap-[20px] @xl:grid-cols-2 @xl:gap-[40px]">
        <div>
          <h2 className="text-[16px]/[26px] font-bold text-white">สถิติการทำภารกิจ</h2>
          <dl className="mt-[12px] flex flex-col gap-[8px]">
            {missionStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between gap-[16px] rounded-[8px] bg-white/[0.04] px-[16px] py-[8px]">
                <dt className="text-[14px]/[23px] font-bold text-[#d5a952]">{stat.label}</dt>
                <dd className="flex items-baseline gap-[8px]">
                  <span className="text-[24px]/[38px] font-bold text-[#c4ab8c] tabular-nums">{stat.value}</span>
                  <span className="text-[13px]/[21px] text-[#e9e9e9]">{stat.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-t-2 border-[#c4ab8c] pt-[20px] @xl:border-t-0 @xl:border-l-2 @xl:pt-0 @xl:pl-[40px]">
          <h2 className="text-[16px]/[26px] font-bold text-white">สถิติการรับรางวัล</h2>
          <dl className="mt-[12px] flex flex-col gap-[10px]">
            {rewardStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-[12px]">
                <dt className="flex min-w-0 flex-1 items-center gap-[10px] text-[14px]/[23px] text-[#e9e9e9]">
                  <Image src={rewardKinds[stat.kind].icon} alt="" width={24} height={24} className="size-[24px] shrink-0" />
                  {stat.label}
                </dt>
                <dd className="text-[16px]/[26px] font-bold text-[#c4ab8c] tabular-nums">{stat.value}</dd>
                <dd className="w-[40px] text-[13px]/[21px] text-[#e9e9e9]">{stat.unit}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
