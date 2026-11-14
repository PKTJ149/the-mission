import Image from "next/image";
import { Icon } from "@/components/wallet/icon";

type MainWalletCardProps = {
  amountWhole: string;
  amountDecimal: string;
  updatedAt: string;
};

export function MainWalletCard({ amountWhole, amountDecimal, updatedAt }: MainWalletCardProps) {
  return (
    <section
      aria-label="กระเป๋าเครดิตหลัก"
      className="relative isolate flex min-h-[240px] flex-col justify-between overflow-hidden rounded-[24px] bg-card-brown p-8"
    >
      {/* Same diagonal light shape as mobile, stretched to the wider card */}
      <Image
        src="/wallet/card-shape.svg"
        alt=""
        aria-hidden
        width={237}
        height={213}
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 h-full w-[58%] max-w-none"
      />

      <p className="text-[16px]/[26px] text-white">กระเป๋าเครดิตหลัก</p>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-bold whitespace-nowrap text-white tabular-nums">
            <span className="text-[36px]/[60px]">฿</span>
            <span className="ml-4 text-[52px]/[60px]">{amountWhole}</span>
            <span className="text-[40px]/[60px]">{amountDecimal}</span>
          </p>
          <p className="mt-1 text-[13px]/[20px] whitespace-pre text-gold-muted">{`อัพเดตล่าสุด  ${updatedAt}`}</p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="flex h-12 items-center gap-2 rounded-xl border border-add-text/20 bg-add-bg px-5 text-[16px]/[24px] font-semibold text-add-text transition-colors duration-200 hover:border-add-text/50"
          >
            <Icon name="plus" size={22} />
            ฝากเงิน
          </button>
          <button
            type="button"
            className="flex h-12 items-center gap-2 rounded-xl border border-danger/20 bg-remove-bg px-5 text-[16px]/[24px] font-semibold text-danger transition-colors duration-200 hover:border-danger/50"
          >
            <Icon name="minus" size={22} />
            ถอนเงิน
          </button>
        </div>
      </div>
    </section>
  );
}
