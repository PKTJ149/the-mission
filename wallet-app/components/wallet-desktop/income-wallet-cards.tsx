import Image from "next/image";
import { Icon } from "@/components/wallet/icon";
import type { IncomeWallet } from "@/components/wallet/income-wallets";

function IncomeCard({ wallet }: { wallet: IncomeWallet }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[16px] border border-white/5 bg-surface-card p-5 transition-colors duration-200 hover:border-gold/30">
      <Image
        src="/wallet/mini-card-shape.svg"
        alt=""
        aria-hidden
        width={338}
        height={109}
        className="pointer-events-none absolute -top-3 -left-1/2 -z-10 h-[calc(100%+24px)] w-[150%] max-w-none"
      />

      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-gold">
          <Icon name={wallet.icon} size={18} />
        </span>
        <p className="text-[15px]/[24px] font-semibold text-white">{wallet.label}</p>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <p
          className={`text-[24px]/[32px] font-bold whitespace-pre tabular-nums ${
            wallet.amountColor === "gold" ? "text-gold" : "text-gold-text"
          }`}
        >
          {`฿ ${wallet.amount}`}
        </p>
        <button
          type="button"
          disabled={!wallet.canWithdraw}
          className={`h-8 rounded-full bg-danger-bg px-4 text-[14px]/[22px] font-semibold text-danger transition-colors duration-200 ${
            wallet.canWithdraw ? "hover:bg-[#4a0000]" : "cursor-not-allowed mix-blend-luminosity"
          }`}
        >
          ถอน
        </button>
      </div>
    </div>
  );
}

export function IncomeWalletCards({ wallets }: { wallets: IncomeWallet[] }) {
  return (
    <section aria-labelledby="income-title">
      <h2 id="income-title" className="text-[16px]/[26px] font-semibold text-grey-title">
        กระเป๋ารายได้อื่น ๆ
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-4">
        {wallets.map((wallet) => (
          <IncomeCard key={wallet.label} wallet={wallet} />
        ))}
      </div>
    </section>
  );
}
