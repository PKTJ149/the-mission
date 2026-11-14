import Image from "next/image";
import type { MissionFilter } from "@/lib/mission-data";

const tabs: { id: MissionFilter; label: string; icon?: "pin" | "bookmark" }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "pinned", label: "ปักหมุด", icon: "pin" },
  { id: "favorite", label: "ภารกิจโปรด", icon: "bookmark" },
  { id: "new", label: "ภารกิจมาใหม่" },
];

type FilterTabsProps = {
  value: MissionFilter;
  onChange: (value: MissionFilter) => void;
  // Mobile pills hug their text; desktop pills are all 102×44 with a darker outline
  variant?: "mobile" | "desktop";
  className?: string;
};

export function FilterTabs({ value, onChange, variant = "mobile", className = "" }: FilterTabsProps) {
  const isDesktop = variant === "desktop";
  return (
    <div
      role="group"
      aria-label="กรองภารกิจ"
      className={`flex items-center ${isDesktop ? "gap-[16px]" : "gap-[11px]"} ${className}`}
    >
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(tab.id)}
            className={`flex shrink-0 items-center gap-[4px] rounded-full border px-[11px] text-[13px]/[21px] whitespace-nowrap transition-colors duration-200 ${
              isDesktop ? "h-[44px] w-[102px] justify-center" : "h-[40px]"
            } ${
              active
                ? "border-[#ba8a46] bg-[#c3aa8b] font-bold text-[#151515]"
                : `${isDesktop ? "border-[#474036]" : "border-[#695a47]"} bg-[#403a31] text-white hover:border-[#c4ab8c]`
            }`}
          >
            {tab.icon === "pin" && (
              <Image src="/missions/icons/tab-pin.svg" alt="" width={16} height={16} className="size-[16px] shrink-0" />
            )}
            {tab.icon === "bookmark" && (
              <span className="relative size-[16px] shrink-0">
                <span className="absolute inset-[6.25%_18.75%_6.58%_18.75%]">
                  <Image src="/missions/icons/tab-bookmark.svg" alt="" fill sizes="16px" />
                </span>
              </span>
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
