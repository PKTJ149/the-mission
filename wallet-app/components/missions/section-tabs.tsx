"use client";

import { useRef, type KeyboardEvent } from "react";
import type { MissionSection } from "@/lib/mission-data";

// The 3 big tabs under the header: ทำภารกิจ / ประวัติรับรางวัล / แลกรางวัล.
// Mobile and desktop use different sizes and (in Figma) a slightly different history label.

const sections: { id: MissionSection; mobileLabel: string; desktopLabel: string }[] = [
  { id: "missions", mobileLabel: "ทำภารกิจ", desktopLabel: "ทำภารกิจ" },
  { id: "history", mobileLabel: "ประวัติรับรางวัล", desktopLabel: "ประวัติการรับรางวัล" },
  { id: "redeem", mobileLabel: "แลกรางวัล", desktopLabel: "แลกรางวัล" },
];

// Figma widths of the 3 mobile tabs (desktop tabs share the row equally)
const MOBILE_WIDTHS = ["w-[131px]", "w-[132px]", "w-[126px]"];

type SectionTabsProps = {
  variant: "mobile" | "desktop";
  value: MissionSection;
  onChange: (value: MissionSection) => void;
  idPrefix: string; // keeps ids unique, since the mobile and desktop trees both render
  className?: string;
};

export function SectionTabs({ variant, value, onChange, idPrefix, className = "" }: SectionTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isMobile = variant === "mobile";

  // Arrow keys move between tabs, like a native tab bar
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = sections.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    onChange(sections[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="เมนูภารกิจ"
      className={`flex h-[50px] items-center bg-[#151515] p-[4px] ${
        isMobile ? "rounded-[9px]" : "rounded-[100px] pr-0"
      } ${className}`}
    >
      {sections.map((section, index) => {
        const active = section.id === value;
        return (
          <button
            key={section.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${section.id}`}
            aria-selected={active}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(section.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`flex h-[42px] items-center justify-center rounded-[8px] px-[16px] py-[8px] text-center text-[16px]/[26px] font-bold whitespace-nowrap transition-colors duration-200 ${
              isMobile ? `shrink-0 ${MOBILE_WIDTHS[index]}` : "min-w-0 flex-1"
            } ${
              active
                ? `${isMobile ? "bg-[#c3aa8b]" : "bg-[#c4ab8c]"} text-[#151515]`
                : "text-[#828282] hover:text-[#bdbdbd]"
            }`}
          >
            {isMobile ? section.mobileLabel : section.desktopLabel}
          </button>
        );
      })}
    </div>
  );
}
