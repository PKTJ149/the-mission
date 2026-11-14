"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { missionBanners } from "@/lib/mission-data";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

// Banner carousel above the mission filters: the current banner sits big in the middle,
// the previous and next ones peek out blurred on each side (Figma "Frame 1618874325" /
// "Group 1000005205"). Mobile: swipe or tap a dot. Desktop: arrows, dots or click a side banner.
// It also moves on by itself every 3 seconds, but holds still while someone is using it.

type Slot = { x: number; top: number; width: number; height: number }; // x = offset from the centre line
type Role = "current" | "next" | "prev" | "hidden";

type Layout = {
  box: string;
  slots: Record<"current" | "prev" | "next", Slot>;
  frame: string;
  sideBlur: string;
  dotsTop: number;
  activeDot: string;
};

const LAYOUTS: Record<"mobile" | "desktop", Layout> = {
  mobile: {
    box: "h-[249px] w-[390px]",
    slots: {
      current: { x: -195, top: 0, width: 390, height: 220 },
      prev: { x: -415, top: 30, width: 300, height: 168 },
      next: { x: 115, top: 30, width: 300, height: 168 },
    },
    frame: "rounded-[13px] border",
    sideBlur: "blur-[2px]",
    dotsTop: 239,
    activeDot: "bg-[#c4ab8c]",
  },
  desktop: {
    box: "h-[364px] w-full",
    slots: {
      current: { x: -284, top: 0, width: 574, height: 322 },
      prev: { x: -616, top: 28, width: 472, height: 266 },
      next: { x: 147, top: 28, width: 472, height: 266 },
    },
    frame: "rounded-[14px] border-2",
    sideBlur: "blur-[5px]",
    dotsTop: 354,
    activeDot: "bg-linear-to-r from-[#ba8a46] via-[#f5e386] to-[#ba8a46]",
  },
};

const SWIPE_DISTANCE = 40;
// How long each banner stays before the next one slides in.
// People who ask their device for less motion never get the automatic sliding (see `paused`).
const AUTO_SLIDE_MS = 3000;

// True while some of the banner is on screen and the browser tab is open.
// (The page renders a mobile and a desktop banner; the hidden one never counts as on screen.)
function useIsOnScreen(ref: RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  const [tabOpen, setTabOpen] = useState(true);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(element);
    const onTabChange = () => setTabOpen(!document.hidden);
    document.addEventListener("visibilitychange", onTabChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onTabChange);
    };
  }, [ref]);
  return inView && tabOpen;
}

// Where slide `i` sits when slide `index` is the current one (wraps around both ends)
function roleOf(i: number, index: number, count: number): Role {
  const offset = (i - index + count) % count;
  if (offset === 0) return "current";
  if (offset === 1) return "next";
  if (offset === count - 1) return "prev";
  return "hidden";
}

export function MissionBanner({ variant, className = "" }: { variant: "mobile" | "desktop"; className?: string }) {
  const layout = LAYOUTS[variant];
  const count = missionBanners.length;
  // `from` remembers the previous slide so a banner that jumps from one side to the other
  // can skip the animation instead of sliding behind the middle one
  const [{ index, from }, setPosition] = useState({ index: 0, from: 0 });
  const pointerStart = useRef<number | null>(null);
  const swiped = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Reasons to hold the automatic sliding
  const [hovering, setHovering] = useState(false); // mouse is over the banner
  const [touching, setTouching] = useState(false); // finger is on the banner
  const [keyboardFocus, setKeyboardFocus] = useState(false); // a dot or arrow was reached with Tab
  const reducedMotion = usePrefersReducedMotion();
  const onScreen = useIsOnScreen(sectionRef);
  const paused = hovering || touching || keyboardFocus || reducedMotion || !onScreen;

  const goTo = (target: number) =>
    setPosition((current) => ({ index: (target + count) % count, from: current.index }));

  // Wait 3 s, then show the next banner. Because `index` is a dependency, the wait starts
  // over after every change — so a swipe, dot or arrow always gets a full 3 s on screen.
  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(
      () => setPosition((current) => ({ index: (current.index + 1) % count, from: current.index })),
      AUTO_SLIDE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [index, paused, count]);

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="แบนเนอร์ภารกิจ"
      className={`relative touch-pan-y select-none ${layout.box} ${className}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovering(true);
      }}
      onPointerLeave={() => {
        setHovering(false);
        setTouching(false);
      }}
      onPointerDown={(event) => {
        pointerStart.current = event.clientX;
        swiped.current = false;
        if (event.pointerType !== "mouse") setTouching(true);
      }}
      onPointerUp={(event) => {
        setTouching(false);
        if (pointerStart.current === null) return;
        const distance = event.clientX - pointerStart.current;
        pointerStart.current = null;
        if (Math.abs(distance) < SWIPE_DISTANCE) return;
        swiped.current = true;
        goTo(index + (distance < 0 ? 1 : -1));
      }}
      onPointerCancel={() => {
        pointerStart.current = null;
        setTouching(false);
      }}
      // Only keyboard focus pauses: after a mouse click the button keeps focus,
      // and that alone shouldn't stop the banner forever
      onFocus={(event) => {
        if (event.target.matches(":focus-visible")) setKeyboardFocus(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocus(false);
      }}
    >
      {missionBanners.map((banner, i) => {
        const role = roleOf(i, index, count);
        const previousRole = roleOf(i, from, count);
        const slot = layout.slots[role === "hidden" ? "next" : role];
        const jumpsSides = role !== previousRole && role !== "current" && previousRole !== "current";
        return (
          <div
            key={banner.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} จาก ${count}`}
            aria-hidden={role !== "current"}
            onClick={() => {
              if (!swiped.current && role !== "current") goTo(i);
            }}
            className={`absolute overflow-hidden border-[#c4ab8c] ${layout.frame} ${
              role === "current"
                ? "z-10 opacity-90"
                : `z-0 ${layout.sideBlur} ${role === "hidden" ? "pointer-events-none opacity-0" : "cursor-pointer"}`
            } ${
              jumpsSides
                ? ""
                : "transition-[left,top,width,height,opacity,filter] duration-300 ease-out motion-reduce:transition-none"
            }`}
            style={{ left: `calc(50% + ${slot.x}px)`, top: slot.top, width: slot.width, height: slot.height }}
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              sizes="(min-width: 1024px) 574px, 390px"
              preload={i === 0}
              draggable={false}
              className="object-cover"
            />
          </div>
        );
      })}

      {variant === "desktop" && (
        <>
          <ArrowButton direction="prev" onClick={() => goTo(index - 1)} style={{ left: "calc(50% - 319px)", top: 122 }} />
          <ArrowButton direction="next" onClick={() => goTo(index + 1)} style={{ left: "calc(50% + 261px)", top: 123 }} />
        </>
      )}

      <div
        className="absolute left-1/2 z-20 flex -translate-x-1/2 items-center gap-[10px]"
        style={{ top: layout.dotsTop }}
      >
        {missionBanners.map((banner, i) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`ไปที่แบนเนอร์ ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => goTo(i)}
            // The dots are tiny, so an invisible ::after makes them easier to tap
            className={`relative h-[10px] rounded-[3.5px] transition-[width] duration-300 ease-out after:absolute after:-inset-x-[4px] after:-inset-y-[12px] motion-reduce:transition-none ${
              i === index ? `w-[59.623px] ${layout.activeDot}` : "w-[10px] bg-[#565656] hover:bg-[#7a7a7a]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

// Round gold-ringed arrow on the desktop banner (Figma "Next-back")
function ArrowButton({
  direction,
  onClick,
  style,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  style: CSSProperties;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "แบนเนอร์ก่อนหน้า" : "แบนเนอร์ถัดไป"}
      onClick={onClick}
      className="absolute z-20 flex size-[63px] items-center justify-center rounded-full border-[3.938px] border-[#c4ab8c] bg-[#302a22] transition-colors duration-200 hover:bg-[#40372c]"
      style={style}
    >
      {/* The Figma icon is a "go down" chevron turned sideways */}
      <Image
        src="/missions/icons/chevron-down.svg"
        alt=""
        width={35}
        height={35}
        className="size-[35.438px] max-w-none"
        style={{
          transform: `translate(0.5px, 0.5px) rotate(90deg)${direction === "next" ? " scaleY(-1)" : ""}`,
        }}
      />
    </button>
  );
}
