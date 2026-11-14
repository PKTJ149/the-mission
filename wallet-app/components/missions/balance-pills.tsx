import Image from "next/image";
import { memberBalance } from "@/lib/mission-data";

const ICONS = "/missions/icons";
// Padding is 1px less than Figma because CSS borders take space (Figma strokes don't)
const pill =
  "absolute left-0 flex h-[32px] items-center rounded-full border border-[#695a47] bg-[#232323] pr-[5px] pl-[47px]";
const amount = "text-[13px]/[21px] font-bold whitespace-pre text-[#e9e9e9]";

// Points + credit capsules from the "Mission Header" in Figma (same on mobile and desktop)
export function BalancePills() {
  return (
    <div className="flex shrink-0 items-center gap-[16px]">
      <div className="relative h-[40px] w-[149px]">
        <div className={`${pill} top-[4.5px] gap-[23px]`}>
          <span className={amount}>{`${memberBalance.points} pt`}</span>
          <button type="button" aria-label="แลกแต้ม" className="size-[20px] shrink-0 rounded-full">
            <Image src={`${ICONS}/exchange.svg`} alt="" width={20} height={20} />
          </button>
        </div>
        <Image src={`${ICONS}/star.svg`} alt="" width={40} height={40} className="absolute top-0 left-0 size-[40px]" />
      </div>

      <div className="relative h-[40px] w-[172px]">
        <div className={`${pill} top-[4px] gap-[16px]`}>
          <span className={amount}>{`${memberBalance.credit}  ฿`}</span>
          <button type="button" aria-label="เติมเงิน" className="size-[24px] shrink-0 rounded-full">
            <Image src={`${ICONS}/adding.svg`} alt="" width={24} height={24} />
          </button>
        </div>
        <Image src={`${ICONS}/coin.svg`} alt="" width={40} height={40} className="absolute top-0 left-0 size-[40px]" />
      </div>
    </div>
  );
}
