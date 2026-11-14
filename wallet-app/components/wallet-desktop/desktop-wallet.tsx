import { bonusWallet, gameProviders, incomeWallets, mainWallet, promotions, user } from "@/lib/wallet-data";
import { BonusWalletCard } from "./bonus-wallet-card";
import { DesktopTopBar } from "./desktop-top-bar";
import { GameProvidersSection } from "./game-providers-section";
import { IncomeWalletCards } from "./income-wallet-cards";
import { MainWalletCard } from "./main-wallet-card";
import { PromotionsSection } from "./promotions-section";
import { Sidebar } from "./sidebar";

// Desktop layout (≥1024px). Below that, the mobile layout from Figma is shown instead.
export function DesktopWallet() {
  return (
    <div className="hidden min-h-dvh bg-page lg:flex">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DesktopTopBar username={user.username} avatarSrc={user.avatarSrc} />

        <main className="mx-auto w-full max-w-[1200px] px-8 pt-8 pb-16">
          <div>
            <h1 className="text-[28px]/[40px] font-bold text-white">กระเป๋าเงิน</h1>
            <p className="text-[14px]/[22px] text-grey-text">ภาพรวมยอดเงิน โบนัส และสิทธิพิเศษของคุณ</p>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="flex flex-col gap-6">
              <MainWalletCard {...mainWallet} />
              <IncomeWalletCards wallets={incomeWallets} />
            </div>
            <BonusWalletCard {...bonusWallet} />
          </div>

          <PromotionsSection promotions={promotions} />
          <GameProvidersSection providers={gameProviders} />
        </main>
      </div>
    </div>
  );
}
