import Image from "next/image";
import { Icon } from "./icon";

type MainCreditCardProps = {
  amountWhole: string; // e.g. "150,322."
  amountDecimal: string; // e.g. "30"
  updatedAt: string;
};

export function MainCreditCard({ amountWhole, amountDecimal, updatedAt }: MainCreditCardProps) {
  return (
    <section className="relative mx-[17px] mt-[16px] h-[156px] overflow-hidden rounded-[24px] bg-card-brown">
      {/* Diagonal light shape from Figma (Vector 1) */}
      <Image
        src="/wallet/card-shape.svg"
        alt=""
        aria-hidden
        width={237}
        height={213}
        className="pointer-events-none absolute top-0 right-px h-[213px] w-[237px] max-w-none"
      />

      <p className="absolute top-[17px] left-[25px] text-[14px]/[23px] whitespace-nowrap text-white">
        กระเป๋าเครดิตหลัก
      </p>

      <p className="absolute top-[72px] left-[25px] text-[30.588px]/[50px] font-bold whitespace-pre text-white">
        {`฿  ${amountWhole}`}
        <span className="text-[25.49px]/[42px]">{amountDecimal}</span>
      </p>

      <p className="absolute top-[122px] left-[26px] text-[11px]/[18px] whitespace-pre text-gold-muted">
        {`อัพเดตล่าสุด  ${updatedAt}`}
      </p>

      <button
        type="button"
        aria-label="ฝากเงิน"
        className="absolute top-[30px] right-[22px] flex size-[40px] items-center justify-center rounded-[8px] bg-add-bg"
      >
        <Icon name="plus" size={24} />
      </button>
      <button
        type="button"
        aria-label="ถอนเงิน"
        className="absolute top-[86px] right-[22px] flex size-[40px] items-center justify-center rounded-[8px] bg-remove-bg"
      >
        <Icon name="minus" size={24} />
      </button>
    </section>
  );
}
