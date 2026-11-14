import Link from "next/link";
import { Icon, type IconName } from "./icon";

export type QuickMenuItem = {
  label: string;
  icon: IconName;
  href?: string; // set once the page exists; items without it stay plain buttons
};

const itemClass = "flex h-[80px] flex-col items-center rounded-[16px]";

function ItemContent({ item }: { item: QuickMenuItem }) {
  return (
    <>
      <span className="flex size-[52px] items-center justify-center rounded-full">
        <Icon name={item.icon} size={31.2} />
      </span>
      <span className="text-center text-[14px]/[23px] whitespace-nowrap text-white">{item.label}</span>
    </>
  );
}

export function QuickMenu({ items }: { items: QuickMenuItem[] }) {
  return (
    <nav aria-label="เมนูลัด" className="mt-[11px] grid grid-cols-4 gap-x-[9px] pr-[19px] pl-[20px]">
      {items.map((item) =>
        item.href ? (
          <Link key={item.label} href={item.href} className={itemClass}>
            <ItemContent item={item} />
          </Link>
        ) : (
          <button key={item.label} type="button" className={itemClass}>
            <ItemContent item={item} />
          </button>
        ),
      )}
    </nav>
  );
}
