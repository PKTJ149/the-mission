import Image from "next/image";
import { pointsLedger, redeemOptions, rewardKinds } from "@/lib/reward-history-data";

// "แลกรางวัล" tab (Figma 50:35493, mobile 430px): how to swap points for prizes,
// the price list, and every time points were earned or spent.

export const formatPoints = (amount: number) => `${amount > 0 ? "+" : "-"}${Math.abs(amount).toLocaleString("en-US")}`;

export function RedeemPanel() {
  return (
    <div className="pb-[28px]">
      <h2 className="mt-[15px] text-center text-[19px]/[31px] font-bold text-white">เงื่อนไขการใช้แต้มแลกของรางวัล</h2>

      {/* Rules + price list */}
      <section
        aria-labelledby="redeem-rules"
        className="mt-[12px] ml-[17px] h-[463px] w-[395px] overflow-clip rounded-[8px] border border-[#c4ab8c] bg-black/70 px-[21px] pt-[20px]"
      >
        <h3 id="redeem-rules" className="text-[16px]/[26px] font-bold text-white">
          เงื่อนไขการแลกของรางวัล
        </h3>
        <div className="mt-[16px] max-w-[349px] text-[13px]/[21px] text-white">
          <p>
            คุณสามารถนำแต้มมาแลกของรางวัลได้
            <br />
            หากแต้มคุณถึงตามที่กำหนด โดยมีขั้นตอนดังนี้
          </p>
          <ol className="list-decimal ps-[19.5px]">
            <li>ติดต่อแอดมิน แจ้งของรางวัลที่ต้องการแลก</li>
            <li>รอแอดมินทำรายการแลกของรางวัลให้เท่านี้เป็นอันเรียบร้อย</li>
          </ol>
          <p className="mt-[21px]">ของรางวัลในการแลกแต้มมีดังนี้</p>
        </div>

        <table className="mt-[3px] w-[354px] text-[13px]/[21px]">
          <thead>
            <tr className="h-[37px] bg-[#c4ab8c] font-bold text-black">
              <th scope="col" className="pl-[24px] text-left">
                ของรางวัล
              </th>
              <th scope="col" className="pr-[24px] text-right">
                จำนวนแต้มที่ใช้แลก
              </th>
            </tr>
          </thead>
          <tbody className="text-[#e9e9e9]">
            {redeemOptions.map((option, i) => (
              <tr key={option.label} className={`h-[40px] ${i % 2 === 0 ? "bg-[#202020]" : "bg-[#313131]"}`}>
                <td className="pl-[24px]">
                  <span className="flex items-center gap-[8px]">
                    <Image src={rewardKinds[option.kind].icon} alt="" width={24} height={24} className="size-[24px]" />
                    {option.label}
                  </span>
                </td>
                <td className="pr-[24px]">
                  <span className="flex items-end justify-end gap-[4px]">
                    <Image src="/missions/icons/star.svg" alt="" width={24} height={24} className="size-[24px]" />
                    <span className="w-[70px] text-right">{option.cost} แต้ม</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-[11px] ml-[8px] max-w-[349px] text-[11px]/[18px] text-[#9c9c9c]">
          การเปลี่ยนแปลงของรางวัลเป็นไปตามเงื่อนไขที่บริษัทกำหนด โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
        </p>
      </section>

      {/* TODO: open the admin chat once the real contact channel is decided */}
      <button
        type="button"
        className="mt-[20px] ml-[17px] h-[42px] w-[395px] rounded-[8px] bg-[#c4ab8c] text-[16px]/[26px] font-bold text-[#121212] transition-colors duration-200 hover:bg-[#d6c0a3]"
      >
        ติดต่อแอดมินเพื่อแลกของรางวัล
      </button>

      <h2 className="mt-[21px] text-center text-[16px]/[26px] font-bold text-white">ประวัติการได้รับและแลกแต้ม</h2>

      <table className="mt-[12px] ml-[15px] w-[399px] table-fixed text-[#e9e9e9]">
        <thead>
          <tr className="h-[42px] bg-[#302a22] text-[16px]/[26px] font-bold text-[#c4ab8c]">
            <th scope="col" className="pl-[16px] text-left">
              รายการได้รับและแลกแต้ม
            </th>
            {/* Figma lines this label up a little left of the amounts below */}
            <th scope="col" className="w-[136px] pr-[27px] text-right">
              จำนวนแต้ม
            </th>
          </tr>
        </thead>
        <tbody>
          {pointsLedger.map((entry, i) => (
            <tr
              key={`${entry.date}-${i}`}
              // Figma alternates a fixed 56px dark row with an auto-height lighter row
              className={`border-b-2 border-[#949695] ${i % 2 === 0 ? "h-[56px] bg-black/80" : "bg-white/10"}`}
            >
              <td className="py-[8px] pl-[16px]">
                <p className="truncate text-[13px]/[21px]">
                  <span className="font-bold">{entry.type === "earn" ? "ได้รับแต้ม :" : "แลกแต้ม :"}</span> {entry.detail}
                </p>
                <p className="mt-[4px] text-[11px]/[18px]">{entry.date}</p>
              </td>
              <td
                className={`py-[8px] pr-[16px] text-right text-[19px]/[31px] font-bold ${
                  entry.amount > 0 ? "text-[#00ffa6]" : "text-[#f10000]"
                }`}
              >
                {formatPoints(entry.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
