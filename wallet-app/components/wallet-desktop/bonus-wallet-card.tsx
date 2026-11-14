type BonusWalletCardProps = {
  amount: string;
  promotion: string;
  turnoverLabel: string;
  turnoverProgress: number;
  timeLeft: string;
};

export function BonusWalletCard({ amount, promotion, turnoverLabel, turnoverProgress, timeLeft }: BonusWalletCardProps) {
  return (
    <section
      aria-labelledby="bonus-title"
      className="relative isolate flex h-full flex-col overflow-hidden rounded-[24px] border border-white/5 bg-surface-bonus p-7"
    >
      {/* Soft gold glow in the corner gives the tall card some depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-gold/15 blur-3xl"
      />
      <h2 id="bonus-title" className="text-[16px]/[26px] font-semibold text-grey-title">
        กระเป๋าโบนัส
      </h2>
      <p className="mt-2 text-[36px]/[48px] font-bold whitespace-pre text-gold tabular-nums">{`฿ ${amount}`}</p>
      <p className="mt-4 text-[18px]/[28px] font-semibold text-gold-dark">{promotion}</p>

      <div className="mt-auto pt-8">
        <div className="flex items-center justify-between text-[14px]/[22px]">
          <span className="text-grey-text">เทิร์นโอเวอร์</span>
          <span className="text-white tabular-nums">{turnoverLabel}</span>
        </div>
        <div
          role="progressbar"
          aria-label="ความคืบหน้าเทิร์นโอเวอร์"
          aria-valuenow={Math.round(turnoverProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="relative mt-3 h-2 w-full rounded-full bg-track"
        >
          <div className="absolute inset-y-0 left-0 rounded-full bg-gold" style={{ width: `${turnoverProgress}%` }} />
        </div>

        <p className="mt-5 rounded-xl bg-danger-bg/60 px-4 py-2.5 text-center text-[13px]/[20px] whitespace-pre text-timer tabular-nums">
          {`เหลือเวลาอีก  ${timeLeft} นาที`}
        </p>
      </div>
    </section>
  );
}
