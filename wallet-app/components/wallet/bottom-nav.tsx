import { Icon } from "./icon";

export function BottomNav() {
  return (
    <nav
      aria-label="เมนูหลัก"
      className="fixed bottom-[10px] left-1/2 flex w-[min(417px,calc(100%-13px))] -translate-x-1/2 items-center justify-between rounded-full bg-surface-nav px-[16px] py-[8px] opacity-90"
    >
      {/* Active tab */}
      <button
        type="button"
        aria-current="page"
        className="flex items-start gap-[17px] rounded-full bg-pill-brown px-[16px] py-[8px]"
      >
        <Icon name="wallet" size={24} />
        <span className="text-right text-[14px]/[23px] whitespace-nowrap text-gold-muted">กระเป๋า</span>
      </button>

      <button type="button" aria-label="ฝาก - ถอน" className="p-[10.4px]">
        <Icon name="banknote-arrow-up" size={31.2} />
      </button>
      <button type="button" aria-label="โปรโมชั่น" className="p-[10.4px]">
        <Icon name="megaphone" size={31.2} />
      </button>
      <button type="button" aria-label="แนะนำเพื่อน" className="p-[10.4px]">
        <Icon name="heart-handshake" size={31.2} />
      </button>
    </nav>
  );
}
