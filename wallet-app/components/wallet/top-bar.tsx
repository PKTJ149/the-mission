"use client";

import { useSyncExternalStore } from "react";
import { Icon, type IconName } from "./icon";

// Listen to page scroll so the bar can react to it
function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

function HeaderButton({ icon, label }: { icon: IconName; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-[40px] items-center justify-center rounded-[8px] bg-surface"
    >
      <Icon name={icon} size={24} />
    </button>
  );
}

export function TopBar() {
  // true once the page has scrolled away from the very top
  const isScrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 0,
    () => false,
  );

  return (
    <header
      className={`sticky top-0 z-10 flex items-start justify-between pt-[22px] pr-[18px] pb-[12px] pl-[24px] transition-colors duration-200 ${
        isScrolled ? "bg-surface-nav/90" : "bg-transparent"
      }`}
    >
      <HeaderButton icon="menu" label="เมนู" />
      <div className="flex gap-[11px]">
        <HeaderButton icon="bell" label="การแจ้งเตือน" />
        <HeaderButton icon="user-round" label="โปรไฟล์" />
      </div>
    </header>
  );
}
