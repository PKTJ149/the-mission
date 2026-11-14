import Image from "next/image";

// "THE MISSION" artwork, tilted -6.45° like in Figma.
// Mobile shows it whole; desktop crops it into a 314×133 box.
export function MissionLogo({ variant }: { variant: "mobile" | "desktop" }) {
  const isMobile = variant === "mobile";
  return (
    <div className={isMobile ? "relative h-[142px] w-[350px]" : "relative h-[133.321px] w-[314px] shrink-0 overflow-clip"}>
      <div
        className={`absolute flex h-[176.778px] w-[349.881px] items-center justify-center ${
          isMobile ? "top-0 left-0" : "top-[0.68px] left-[-5.15px]"
        }`}
      >
        <div className="flex-none rotate-[-6.45deg]">
          <Image
            src="/missions/art/logo.png"
            alt="The Mission"
            width={336}
            height={140}
            preload
            className="h-[139.9px] w-[336.299px] max-w-none object-cover"
          />
        </div>
      </div>
    </div>
  );
}
