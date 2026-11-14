type BonusWalletProps = {
  amount: string;
  promotion: string;
  turnoverLabel: string;
  turnoverProgress: number; // 0–100, width of the gold bar
  timeLeft: string;
};

export function BonusWallet({ amount, promotion, turnoverLabel, turnoverProgress, timeLeft }: BonusWalletProps) {
  return (
    <section className="mt-[11px] mr-[17px] ml-[18px] flex h-[171px] flex-col items-center gap-[8px] rounded-[16px] bg-surface-bonus p-[16px]">
      <div className="flex w-full items-center justify-between text-[16px]/[26px] font-semibold">
        <h2 className="whitespace-nowrap text-grey-title">กระเป๋าโบนัส</h2>
        <p className="text-right whitespace-pre text-gold">{`฿  ${amount}`}</p>
      </div>

      <p className="w-full shrink-0 overflow-hidden text-[20px]/[33px] font-semibold whitespace-nowrap text-gold-dark">
        {promotion}
      </p>

      <div className="flex w-full flex-col gap-[8px]">
        <div className="flex items-start justify-between text-[14px]/[23px] text-white">
          {/* Figma places this label 3px lower than the value */}
          <span className="relative top-[3px] left-px whitespace-nowrap">เทิร์นโอเวอร์</span>
          <span className="text-right">{turnoverLabel}</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={turnoverProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="relative ml-[0.5px] h-[7px] w-[calc(100%-1px)] rounded-full bg-track"
        >
          <div className="absolute inset-y-0 left-0 rounded-full bg-gold" style={{ width: `${turnoverProgress}%` }} />
        </div>
      </div>

      <p className="text-[12px]/[20px] whitespace-pre text-timer">{`เหลือเวลาอีก  ${timeLeft} นาที`}</p>
    </section>
  );
}
