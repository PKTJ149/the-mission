import Image from "next/image";
import Link from "next/link";
import { memberBalance } from "@/lib/mission-data";

const ICONS = "/missions/icons";

// Padding is 0.8px less than Figma because CSS borders take space (Figma strokes don't)
const pill =
  "absolute top-[3.2px] left-0 flex h-[25.6px] items-center rounded-full border-[0.8px] border-[#ba8a46] bg-[#202020] pr-[4px] pl-[37.6px]";
const amount = "text-[10.4px]/[17px] font-bold whitespace-pre text-[#e9e9e9]";
// The pill buttons are tiny, so an invisible ::after makes them easier to tap
const tapArea = "relative shrink-0 rounded-full after:absolute after:-inset-[8px]";

// Mobile "Mission Header" (Figma 48:26346): back arrow, member ID + phone, and the points / credit pills.
// Used on the mission list and the mission detail page.
export function MissionHeader({ backHref, backLabel }: { backHref: string; backLabel: string }) {
  return (
    <header className="sticky top-0 z-20 h-[80px] bg-black/80 shadow-[inset_0_0_0_1px_black] backdrop-blur-[5px]">
      <Link href={backHref} aria-label={backLabel} className="absolute top-[24px] left-[24px] size-[32px] rounded-[6px]">
        <Image src={`${ICONS}/arrow-white.svg`} alt="" width={32} height={32} />
      </Link>

      {/* Member ID + phone number */}
      <div className="absolute top-[9px] left-[128px] flex items-end rounded-[45px] bg-[#2d2d2d] py-px text-[11px]/[18px] text-white">
        <p className="flex items-end gap-px px-[16px]">
          <Image src={`${ICONS}/user-id.svg`} alt="" width={20} height={20} className="size-[20px]" />
          <span className="sr-only">รหัสสมาชิก </span>
          {memberBalance.userId}
        </p>
        <p className="flex items-center gap-px px-[16px]">
          <Image src={`${ICONS}/phone.svg`} alt="" width={14} height={14} className="size-[14px]" />
          <span className="sr-only">เบอร์โทร </span>
          {memberBalance.phone}
        </p>
      </div>

      {/* Points + credit */}
      <div className="absolute top-[37px] left-[154px] flex items-center gap-[6px]">
        <div className="relative h-[32px] w-[119px]">
          <div className={`${pill} gap-[18.4px]`}>
            <span className={amount}>{`${memberBalance.points} pt`}</span>
            <button type="button" aria-label="แลกแต้ม" className={`${tapArea} size-[16px]`}>
              <Image src={`${ICONS}/exchange-gold.svg`} alt="" width={16} height={16} />
            </button>
          </div>
          <Image src={`${ICONS}/star.svg`} alt="" width={32} height={32} className="absolute top-0 left-0 size-[32px]" />
        </div>

        <div className="relative h-[32px] w-[138px]">
          <div className={`${pill} gap-[12.8px]`}>
            <span className={amount}>{`${memberBalance.credit}  ฿`}</span>
            <button type="button" aria-label="เติมเงิน" className={`${tapArea} size-[19.2px]`}>
              <Image src={`${ICONS}/adding-gold.svg`} alt="" width={20} height={20} className="size-[19.2px]" />
            </button>
          </div>
          <Image src={`${ICONS}/coin.svg`} alt="" width={32} height={32} className="absolute top-0 left-0 size-[32px]" />
        </div>
      </div>
    </header>
  );
}
