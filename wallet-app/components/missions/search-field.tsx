import Image from "next/image";
import { Noto_Serif_Thai } from "next/font/google";

// Figma uses Noto Serif Thai (Medium 14) for this one input
const notoSerifThai = Noto_Serif_Thai({ weight: "500", subsets: ["thai", "latin"], display: "swap" });

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function SearchField({ value, onChange, className = "" }: SearchFieldProps) {
  return (
    <label
      className={`flex h-[40px] items-center justify-between gap-[8px] rounded-[8px] border border-[#545454] bg-[#2a2a2a] px-[16px] py-[8px] transition-colors duration-200 focus-within:border-gold ${className}`}
    >
      <span className="sr-only">ค้นหาภารกิจ</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="ค้นหาภารกิจ"
        className={`${notoSerifThai.className} min-w-0 flex-1 appearance-none bg-transparent text-[14px]/[24px] tracking-[-0.03px] text-[#e9e9e9] placeholder:text-[#adadad] [&::-webkit-search-cancel-button]:hidden`}
        // The gold border on the box shows focus, so the global focus ring is turned off here
        style={{ outline: "none" }}
      />
      <Image src="/missions/icons/search.svg" alt="" width={20} height={20} className="size-[20px] shrink-0" />
    </label>
  );
}
