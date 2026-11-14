import Image from "next/image";

// Icons are the exact SVGs exported from Figma (Lucide set), stored in /public/wallet/icons
export type IconName =
  | "menu"
  | "bell"
  | "user-round"
  | "pencil-line"
  | "plus"
  | "minus"
  | "hand-coins-sm"
  | "heart-handshake-sm"
  | "heart-handshake"
  | "megaphone"
  | "history"
  | "banknote-arrow-up"
  | "ferris-wheel"
  | "box"
  | "goal"
  | "wallet"
  | "chevron-right";

type IconProps = {
  name: IconName;
  size: number;
};

export function Icon({ name, size }: IconProps) {
  return (
    <Image
      src={`/wallet/icons/${name}.svg`}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className="block max-w-none shrink-0"
      style={{ width: size, height: size }}
    />
  );
}
