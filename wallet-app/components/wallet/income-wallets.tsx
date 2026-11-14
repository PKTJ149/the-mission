import Image from "next/image";
import { Icon, type IconName } from "./icon";

export type IncomeWallet = {
  label: string;
  amount: string;
  icon: IconName;
  amountColor: "gold" | "gold-text";
  labelRight: number; // px from the right edge, matches Figma
  shapeLeft: number; // px offset of the background shape, matches Figma
  canWithdraw: boolean;
};

function IncomeWalletCard({ wallet }: { wallet: IncomeWallet }) {
  return (
    <div className="relative h-[87px] overflow-hidden rounded-[16px] bg-surface-card">
      <Image
        src="/wallet/mini-card-shape.svg"
        alt=""
        aria-hidden
        width={338}
        height={109}
        className="pointer-events-none absolute top-[-11px] h-[109px] w-[338px] max-w-none"
        style={{ left: wallet.shapeLeft }}
      />

      <div className="absolute top-[9px] left-[12px] flex size-[24px] items-center justify-center rounded-full bg-gold">
        <Icon name={wallet.icon} size={14.4} />
      </div>

      <p
        className="absolute top-[9px] text-[14px]/[23px] font-semibold whitespace-nowrap text-white"
        style={{ right: wallet.labelRight }}
      >
        {wallet.label}
      </p>

      <p
        className={`absolute top-[56px] left-[12px] text-[15px]/[25px] font-bold whitespace-pre ${
          wallet.amountColor === "gold" ? "text-gold" : "text-gold-text"
        }`}
      >
        {`฿  ${wallet.amount}`}
      </p>

      <button
        type="button"
        disabled={!wallet.canWithdraw}
        className={`absolute top-[58px] right-[13px] flex h-[22px] w-[54px] items-center justify-center rounded-[20px] bg-danger-bg ${
          wallet.canWithdraw ? "" : "mix-blend-luminosity"
        }`}
      >
        <span className="text-[16px]/[26px] font-semibold whitespace-nowrap text-danger">ถอน</span>
      </button>
    </div>
  );
}

export function IncomeWallets({ wallets }: { wallets: IncomeWallet[] }) {
  return (
    <section>
      <h2 className="mt-[16px] pl-[34px] text-[16px]/[26px] font-semibold text-grey-title">
        กระเป๋ารายได้อื่น ๆ
      </h2>
      <div className="mt-[9px] grid grid-cols-2 gap-[15px] pr-[17px] pl-[18px]">
        {wallets.map((wallet) => (
          <IncomeWalletCard key={wallet.label} wallet={wallet} />
        ))}
      </div>
    </section>
  );
}
