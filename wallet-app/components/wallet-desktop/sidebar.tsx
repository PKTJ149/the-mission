import Link from "next/link";
import { Icon, type IconName } from "@/components/wallet/icon";

type NavItem = {
  label: string;
  icon: IconName;
  href?: string;
  active?: boolean;
};

const mainItems: NavItem[] = [
  { label: "กระเป๋า", icon: "wallet", active: true },
  { label: "ฝาก - ถอน", icon: "banknote-arrow-up" },
  { label: "โปรโมชั่น", icon: "megaphone" },
  { label: "แนะนำเพื่อน", icon: "heart-handshake" },
  { label: "ประวัติ", icon: "history" },
];

const activityItems: NavItem[] = [
  { label: "วงล้อลุ้นล้าน", icon: "ferris-wheel" },
  { label: "กล่องสุ่ม", icon: "box" },
  { label: "ภารกิจ", icon: "goal", href: "/missions" },
];

function NavGroup({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <p className="px-3 text-[12px]/[20px] font-semibold tracking-wide text-grey-title">{title}</p>
      <ul className="mt-2 flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href ?? "#"}
              aria-current={item.active ? "page" : undefined}
              className={`group flex h-11 items-center gap-3 rounded-xl px-3 text-[15px]/[24px] transition-colors duration-200 ${
                item.active
                  ? "bg-pill-brown font-semibold text-gold-muted"
                  : "text-grey-text hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`transition-opacity duration-200 ${
                  item.active ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                }`}
              >
                <Icon name={item.icon} size={22} />
              </span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-dvh w-[248px] shrink-0 flex-col self-start border-r border-white/5 bg-surface-nav px-4 py-6">
      {/* Placeholder brand mark — swap for the real logo */}
      <div className="flex items-center gap-3 px-3">
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-gold text-[18px] font-bold text-page">
          M
        </span>
        <span className="text-[18px]/[26px] font-bold tracking-wide text-white">The Mission</span>
      </div>

      <nav aria-label="เมนูหลัก" className="mt-10 flex flex-col gap-8">
        <NavGroup title="เมนูหลัก" items={mainItems} />
        <NavGroup title="กิจกรรม" items={activityItems} />
      </nav>
    </aside>
  );
}
