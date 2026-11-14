"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { missions } from "@/lib/mission-data";
import type { DetailReward, ProgressRow } from "@/lib/mission-detail-data";

// Pieces of the mission detail page that the mobile and desktop layouts share.

export const ICONS = "/missions/icons";
export const EASE_OUT = "ease-[cubic-bezier(0.23,1,0.32,1)]"; // fast start, soft landing
// Same value in both layouts, so the browser downloads the artwork only once
export const HERO_SIZES = "(min-width: 1024px) 336px, 312px";
const SWIPE_DISTANCE = 40;

export type SubState = { rows: ProgressRow[]; claimed: boolean };

export const isDone = (rows: ProgressRow[]) => rows.every((row) => row.current >= row.target);
export const formatProgress = (row: ProgressRow) =>
  `${row.current.toLocaleString("en-US")}/${row.target.toLocaleString("en-US")}${row.unit ? ` ${row.unit}` : ""}`;

// Neighbouring missions + swipe on the artwork (finger or mouse drag) to move between them
export function useMissionSwipe(missionId: string) {
  const router = useRouter();
  const index = missions.findIndex((mission) => mission.id === missionId);
  const hrefAt = (offset: number) => `/missions/${missions[(index + offset + missions.length) % missions.length].id}`;
  const pointerStart = useRef<number | null>(null);

  const swipeHandlers = {
    onPointerDown: (event: PointerEvent) => {
      pointerStart.current = event.clientX;
    },
    onPointerUp: (event: PointerEvent) => {
      if (pointerStart.current === null) return;
      const distance = event.clientX - pointerStart.current;
      pointerStart.current = null;
      if (Math.abs(distance) >= SWIPE_DISTANCE) router.replace(hrefAt(distance < 0 ? 1 : -1), { scroll: false });
    },
    onPointerCancel: () => {
      pointerStart.current = null;
    },
  };

  return { index, mission: missions[index], hrefAt, swipeHandlers };
}

export function ArrowLink({ href, direction }: { href: string; direction: "prev" | "next" }) {
  return (
    <Link
      href={href}
      replace
      scroll={false}
      aria-label={direction === "prev" ? "ภารกิจก่อนหน้า" : "ภารกิจถัดไป"}
      // 32px circle in Figma; the invisible ::after brings the tap area up to 44px
      className="relative flex size-[32px] shrink-0 items-center justify-center rounded-full border-2 border-[#c4ab8c] bg-[#1e1e1e] transition-colors duration-200 after:absolute after:-inset-[6px] hover:bg-[#302a22]"
    >
      {/* Figma's arrow is the "go down" chevron turned sideways */}
      <Image
        src={`${ICONS}/chevron-down.svg`}
        alt=""
        width={18}
        height={18}
        className="size-[18px]"
        style={{ transform: `rotate(90deg)${direction === "next" ? " scaleY(-1)" : ""}` }}
      />
    </Link>
  );
}

// One dot per mission; the current one is a long gold bar
export function MissionDots({ index }: { index: number }) {
  return (
    <nav aria-label="เลือกภารกิจ" className="flex items-center gap-[4px]">
      {missions.map((item, i) => (
        <Link
          key={item.id}
          href={`/missions/${item.id}`}
          replace
          scroll={false}
          aria-label={`ภารกิจที่ ${i + 1}: ${item.title}`}
          aria-current={i === index ? "page" : undefined}
          // The dots are tiny, so an invisible ::after makes them easier to tap
          className={`relative h-[8px] rounded-[4px] transition-[width,background-color] duration-300 ${EASE_OUT} after:absolute after:-inset-x-[2px] after:-inset-y-[12px] ${
            i === index ? "w-[48px] bg-[#c4ab8c]" : "w-[8px] bg-[#9c9c9c] hover:bg-[#bdbdbd]"
          }`}
        />
      ))}
    </nav>
  );
}

// Uses aria-disabled instead of disabled: a button that turns off right after you press it
// keeps keyboard focus (a truly disabled button drops focus back to the top of the page).
export function DemoButton({
  enabled,
  onPress,
  className,
  children,
}: {
  enabled: boolean;
  onPress: () => void;
  className: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-disabled={!enabled}
      onClick={() => {
        if (enabled) onPress();
      }}
      className={className}
    >
      {children}
    </button>
  );
}

export function RewardList({ rewards, textClass }: { rewards: DetailReward[]; textClass: string }) {
  return (
    <ul className="flex flex-wrap items-center gap-[9px]">
      {rewards.map((reward, i) => (
        <li key={i} className={`flex items-center gap-[4px] text-white ${textClass}`}>
          <Image src={reward.icon} alt="" width={20} height={20} className="size-[20px]" />
          {reward.label}
        </li>
      ))}
    </ul>
  );
}
