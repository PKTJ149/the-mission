import { BonusWallet } from "@/components/wallet/bonus-wallet";
import { BottomNav } from "@/components/wallet/bottom-nav";
import { GameProviders } from "@/components/wallet/game-providers";
import { IncomeWallets } from "@/components/wallet/income-wallets";
import { MainCreditCard } from "@/components/wallet/main-credit-card";
import { PromoCarousel } from "@/components/wallet/promo-carousel";
import { QuickMenu } from "@/components/wallet/quick-menu";
import { WalletHeader } from "@/components/wallet/wallet-header";
import { DesktopWallet } from "@/components/wallet-desktop/desktop-wallet";
import {
  bonusWallet,
  gameProviders,
  incomeWallets,
  mainWallet,
  promotions,
  quickMenuItems,
  user,
} from "@/lib/wallet-data";

export default function WalletPage() {
  return (
    <>
      {/* Mobile layout (Figma "wallet" frame) — hidden from 1024px up */}
      <main className="relative mx-auto min-h-dvh w-full max-w-[430px] bg-page pb-[94px] lg:hidden">
        <WalletHeader username={user.username} avatarSrc={user.avatarSrc} />
        <MainCreditCard {...mainWallet} />
        <IncomeWallets wallets={incomeWallets} />
        <QuickMenu items={quickMenuItems} />
        <BonusWallet {...bonusWallet} />
        {/* Not in the Figma frame — added sections, styled to match the theme */}
        <PromoCarousel promotions={promotions} />
        <GameProviders providers={gameProviders} />
        <BottomNav />
      </main>

      {/* Desktop layout — shown from 1024px up */}
      <DesktopWallet />
    </>
  );
}
