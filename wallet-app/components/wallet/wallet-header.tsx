import Image from "next/image";
import { Icon } from "./icon";
import { TopBar } from "./top-bar";

type WalletHeaderProps = {
  username: string;
  avatarSrc: string;
};

export function WalletHeader({ username, avatarSrc }: WalletHeaderProps) {
  return (
    <>
      {/* Top bar: stays pinned to the top while scrolling */}
      <TopBar />

      {/* Greeting + avatar (top bar's 12px bottom padding + 7px = 19px gap from Figma) */}
      <section className="mt-[7px] flex items-start justify-between pr-[38px] pl-[27px]">
        <div className="flex w-[202px] flex-col gap-[12px]">
          <div className="flex flex-col">
            <p className="-mb-[8px] text-[18px]/[30px] text-grey-text">ยินดีต้อนรับ,</p>
            <p className="text-[24px]/[40px] font-bold break-words text-white">{username}</p>
          </div>
          <button type="button" className="flex items-center gap-[9px] self-start">
            <Icon name="pencil-line" size={14} />
            <span className="text-[12px]/[20px] whitespace-nowrap text-gold-text">แก้ไขรหัสผ่าน</span>
          </button>
        </div>

        <div className="relative size-[94px] shrink-0 overflow-hidden rounded-full border border-gold">
          <Image src={avatarSrc} alt="รูปโปรไฟล์" fill sizes="94px" className="object-cover" priority />
        </div>
      </section>
    </>
  );
}
