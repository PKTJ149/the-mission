import { Icon } from "./icon";

type SectionHeadingProps = {
  id: string;
  title: string;
  href?: string;
};

// Same title style as "กระเป๋ารายได้อื่น ๆ" in the Figma frame, plus a "see all" link.
// The row is 44px tall so the link is a comfortable touch target.
export function SectionHeading({ id, title, href = "#" }: SectionHeadingProps) {
  return (
    <div className="flex h-[44px] items-center justify-between pr-[25px] pl-[34px]">
      <h2 id={id} className="text-[16px]/[26px] font-semibold text-grey-title">
        {title}
      </h2>
      <a href={href} className="flex h-full items-center gap-[2px] px-[8px] text-[14px]/[23px] text-gold-text">
        ดูทั้งหมด
        <span className="sr-only">{title}</span>
        <Icon name="chevron-right" size={16} />
      </a>
    </div>
  );
}
