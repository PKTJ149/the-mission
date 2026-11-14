import { Icon } from "@/components/wallet/icon";

type SectionHeaderProps = {
  id: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ id, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-[22px]/[32px] font-bold text-white">
          {title}
        </h2>
        {subtitle && <p className="text-[14px]/[22px] text-grey-text">{subtitle}</p>}
      </div>
      <a
        href="#"
        className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[14px]/[22px] text-gold-text transition-colors duration-200 hover:bg-white/5"
      >
        ดูทั้งหมด
        <Icon name="chevron-right" size={16} />
      </a>
    </div>
  );
}
