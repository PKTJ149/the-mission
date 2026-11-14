import Image from "next/image";
import { useId } from "react";
import { pointsLedger, redeemOptions, rewardKinds } from "@/lib/reward-history-data";
import { formatPoints } from "./redeem-panel";

// Desktop "แลกรางวัล" tab. There's no desktop design in Figma yet, so this is built from the
// mobile screen (50:35493): how to redeem + price list on the left, the points history on the right.
// From 1280px the two sit side by side; between 1024 and 1279px they stack.

export function DesktopRedeemPanel() {
  const rulesId = useId();
  const ledgerId = useId();

  return (
    <div className="mt-[24px] grid items-start gap-[24px] xl:grid-cols-[395px_minmax(0,1fr)]">
      <div className="flex flex-col gap-[16px]">
        <section aria-labelledby={rulesId} className="@container rounded-[16px] border border-[#c4ab8c] bg-black/70 p-[24px]">
          <h2 id={rulesId} className="text-[16px]/[26px] font-bold text-white">
            เงื่อนไขการใช้แต้มแลกของรางวัล
          </h2>

          {/* When the card is wide (1024–1279px) the steps and the price list sit side by side */}
          <div className="mt-[12px] grid gap-[20px] @2xl:grid-cols-2 @2xl:gap-[32px]">
            <div className="text-[14px]/[23px] text-[#e9e9e9]">
              <h3 className="text-[14px]/[23px] font-bold text-[#c4ab8c]">เงื่อนไขการแลกของรางวัล</h3>
              <p className="mt-[8px]">คุณสามารถนำแต้มมาแลกของรางวัลได้ หากแต้มคุณถึงตามที่กำหนด โดยมีขั้นตอนดังนี้</p>
              <ol className="mt-[8px] list-decimal ps-[20px] marker:font-bold marker:text-[#c4ab8c]">
                <li>ติดต่อแอดมิน แจ้งของรางวัลที่ต้องการแลก</li>
                <li>รอแอดมินทำรายการแลกของรางวัลให้เท่านี้เป็นอันเรียบร้อย</li>
              </ol>
            </div>

            <div>
              <h3 className="text-[14px]/[23px] font-bold text-[#c4ab8c]">ของรางวัลในการแลกแต้มมีดังนี้</h3>
              <div className="mt-[8px] overflow-clip rounded-[8px]">
                <table className="w-full text-[14px]/[23px]">
                  <thead>
                    <tr className="h-[40px] bg-[#c4ab8c] font-bold text-[#141414]">
                      <th scope="col" className="pl-[16px] text-left">
                        ของรางวัล
                      </th>
                      <th scope="col" className="pr-[16px] text-right">
                        แต้มที่ใช้แลก
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[#e9e9e9]">
                    {redeemOptions.map((option, i) => (
                      <tr key={option.label} className={`h-[44px] ${i % 2 === 0 ? "bg-[#202020]" : "bg-[#313131]"}`}>
                        <td className="pl-[16px]">
                          <span className="flex items-center gap-[8px]">
                            <Image src={rewardKinds[option.kind].icon} alt="" width={24} height={24} className="size-[24px] shrink-0" />
                            {option.label}
                          </span>
                        </td>
                        <td className="pr-[16px]">
                          <span className="flex items-center justify-end gap-[6px] whitespace-nowrap">
                            <Image src="/missions/icons/star.svg" alt="" width={22} height={22} className="size-[22px]" />
                            <span className="font-bold tabular-nums">{option.cost}</span> แต้ม
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-[10px] text-[12px]/[20px] text-[#9c9c9c]">
                การเปลี่ยนแปลงของรางวัลเป็นไปตามเงื่อนไขที่บริษัทกำหนด โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
              </p>
            </div>
          </div>
        </section>

        {/* TODO: open the admin chat once the real contact channel is decided */}
        <button
          type="button"
          className="h-[48px] w-full rounded-[8px] bg-[#c4ab8c] text-[16px]/[26px] font-bold text-[#121212] transition-colors duration-200 hover:bg-[#d6c0a3]"
        >
          ติดต่อแอดมินเพื่อแลกของรางวัล
        </button>
      </div>

      <section aria-labelledby={ledgerId} className="overflow-clip rounded-[16px] border border-[#403a31] bg-[#151515]">
        {/* Title bar inside the card, so this card and the rules card start level */}
        <h2 id={ledgerId} className="px-[20px] py-[14px] text-[16px]/[26px] font-bold text-white">
          ประวัติการได้รับและแลกแต้ม
        </h2>
        <table className="w-full table-fixed text-left text-[14px]/[23px] text-[#e9e9e9]">
          <thead>
            <tr className="h-[44px] bg-[#302a22] font-bold text-[#c4ab8c]">
              <th scope="col" className="w-[160px] pl-[20px]">
                วันที่
              </th>
              <th scope="col" className="px-[16px]">
                รายการ
              </th>
              <th scope="col" className="w-[160px] pr-[20px] text-right">
                จำนวนแต้ม
              </th>
            </tr>
          </thead>
          <tbody>
            {pointsLedger.map((entry, i) => {
              const earned = entry.amount > 0;
              return (
                <tr
                  key={`${entry.date}-${i}`}
                  className={`border-t border-[#2b2b2b] first:border-t-0 ${i % 2 === 1 ? "bg-white/[0.04]" : ""}`}
                >
                  <td className="py-[12px] pl-[20px] text-[13px] whitespace-nowrap tabular-nums">{entry.date}</td>
                  <td className="px-[16px] py-[12px]">
                    <span className="flex items-center gap-[12px]">
                      {/* A word as well as a colour, so it doesn't rely on red/green alone */}
                      <span
                        className={`shrink-0 rounded-full px-[10px] text-[12px]/[22px] font-bold ${
                          earned ? "bg-[#00ffa6]/10 text-[#00ffa6]" : "bg-[#f10000]/15 text-[#ff6b6b]"
                        }`}
                      >
                        {entry.type === "earn" ? "ได้รับแต้ม" : "แลกแต้ม"}
                      </span>
                      <span className="truncate">{entry.detail}</span>
                    </span>
                  </td>
                  <td
                    className={`py-[12px] pr-[20px] text-right text-[19px]/[31px] font-bold tabular-nums ${
                      earned ? "text-[#00ffa6]" : "text-[#f10000]"
                    }`}
                  >
                    {formatPoints(entry.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
