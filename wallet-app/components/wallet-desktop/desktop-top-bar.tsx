import Image from "next/image";
import { Icon, type IconName } from "@/components/wallet/icon";

function IconButton({ icon, label }: { icon: IconName; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-[10px] bg-surface transition-colors duration-200 hover:bg-[#333333]"
    >
      <Icon name={icon} size={22} />
    </button>
  );
}

type DesktopTopBarProps = {
  username: string;
  avatarSrc: string;
};

export function DesktopTopBar({ username, avatarSrc }: DesktopTopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-page/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-gold">
            <Image src={avatarSrc} alt="รูปโปรไฟล์" fill sizes="48px" className="object-cover" />
          </div>
          <div>
            <p className="text-[14px]/[20px] text-grey-text">ยินดีต้อนรับ,</p>
            <p className="text-[18px]/[26px] font-bold text-white">{username}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-[10px] px-3 text-[14px]/[22px] text-gold-text transition-colors duration-200 hover:bg-white/5"
          >
            <Icon name="pencil-line" size={14} />
            แก้ไขรหัสผ่าน
          </button>
          <span aria-hidden className="h-6 w-px bg-white/10" />
          <IconButton icon="bell" label="การแจ้งเตือน" />
          <IconButton icon="user-round" label="โปรไฟล์" />
        </div>
      </div>
    </header>
  );
}
