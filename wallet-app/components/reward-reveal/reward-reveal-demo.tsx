"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import type { BoxStatus } from "./mystery-box-scene";

// Prototype: open a 3D mystery box and see what's inside.
// The 3D part (three.js) is heavy, so it lives in its own file and only loads on this page,
// in the browser. Phones or browsers without 3D support get a flat 2D version instead.

const MysteryBoxScene = dynamic(() => import("./mystery-box-scene"), {
  ssr: false,
  loading: () => <FlatBox status="closed" note="กำลังโหลดฉาก 3D…" />,
});

type Prize = { icon: string; name: string; amount: string };

// Mock results — one is picked at random each time the box opens
const OUTCOMES: Prize[][] = [
  [
    { icon: "/missions/icons/reward-credit.svg", name: "เครดิต", amount: "100" },
    { icon: "/missions/icons/reward-point.svg", name: "แต้ม", amount: "100" },
  ],
  [{ icon: "/missions/icons/reward-spin.svg", name: "ฟรีสปิน", amount: "200" }],
  [
    { icon: "/missions/icons/reward-item.svg", name: "แก้วน้ำ Yeti", amount: "1" },
    { icon: "/missions/icons/reward-point.svg", name: "แต้ม", amount: "50" },
  ],
];

// Checked once: can this browser draw 3D (WebGL)?
let webglSupported: boolean | undefined;
function hasWebGL() {
  if (webglSupported === undefined) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    webglSupported = context !== null;
    context?.getExtension("WEBGL_lose_context")?.loseContext(); // free the test context
  }
  return webglSupported;
}
const neverChanges = () => () => {};

// Strong ease-out: fast start, soft landing
const EASE_OUT = "ease-[cubic-bezier(0.23,1,0.32,1)]";

export function RewardRevealDemo() {
  const webgl = useSyncExternalStore(neverChanges, hasWebGL, () => true);
  const reducedMotion = usePrefersReducedMotion();
  const [status, setStatus] = useState<BoxStatus>("closed");
  const [prize, setPrize] = useState<Prize[]>(OUTCOMES[0]);
  const openButton = useRef<HTMLButtonElement>(null);
  const replayButton = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false); // only after the user acts — never on first load

  const openBox = () => {
    if (status !== "closed") return;
    moveFocus.current = true;
    setPrize(OUTCOMES[Math.floor(Math.random() * OUTCOMES.length)]);
    // The 2D version has no animation to wait for, so it shows the reward right away
    setStatus(webgl ? "opening" : "open");
  };

  const replay = () => {
    moveFocus.current = true;
    setStatus("closed");
  };

  // The button the user pressed disappears when the box opens or closes, so move keyboard
  // focus to the button that replaces it — otherwise keyboard users are dropped back at the top
  useEffect(() => {
    if (!moveFocus.current || status === "opening") return;
    (status === "open" ? replayButton : openButton).current?.focus({ preventScroll: true });
  }, [status]);

  const prizeText = prize.map((item) => `${item.name} ${item.amount}`).join(" และ ");

  return (
    <div className="min-h-dvh bg-page">
      <header className="mx-auto flex h-[65px] max-w-[640px] items-center gap-[16px] px-[16px]">
        <Link href="/missions" aria-label="กลับไปหน้าภารกิจ" className="size-[32px] shrink-0 rounded-[6px]">
          <Image src="/missions/icons/arrow-mobile.svg" alt="" width={32} height={32} />
        </Link>
        <h1 className="text-[18px]/[29px] font-bold text-white">เปิดกล่องรางวัล</h1>
        <span className="rounded-full border border-card-brown px-[10px] text-[11px]/[18px] text-gold">ต้นแบบ 3D</span>
      </header>

      <main className="mx-auto max-w-[640px] px-[16px] pb-[48px]">
        {/* Stage: the 3D canvas fills it; the gold glow behind is plain CSS */}
        <div
          role="img"
          aria-label={status === "closed" ? "กล่องรางวัลสีทอง ยังปิดอยู่" : "กล่องรางวัลเปิดออก มีแสงและเหรียญทองพุ่งออกมา"}
          className="relative h-[420px] overflow-hidden rounded-[16px] border border-[#2a2620] bg-[#0b0907] bg-[radial-gradient(ellipse_at_50%_45%,rgba(196,171,140,0.22),transparent_65%)] lg:h-[520px]"
        >
          {webgl ? (
            <MysteryBoxScene
              status={status}
              reducedMotion={reducedMotion}
              onTap={openBox}
              onRevealed={() => setStatus("open")}
            />
          ) : (
            <FlatBox status={status} />
          )}
        </div>

        {/* Below the stage: the button while closed, the reward card once open.
            min-h keeps the page from jumping when one swaps for the other. */}
        <div className="mt-[20px] flex min-h-[210px] flex-col items-center">
          {status === "open" ? (
            <section
              aria-labelledby="prize-title"
              className={`w-full rounded-[14px] border border-[#c4ab8c]/40 bg-surface-card p-[20px] text-center transition-[opacity,translate,scale] duration-300 ${EASE_OUT} starting:translate-y-[8px] starting:scale-[0.97] starting:opacity-0`}
            >
              <h2 id="prize-title" className="text-[20px]/[32px] font-bold text-gold">
                ยินดีด้วย! คุณได้รับ
              </h2>
              <ul className="mt-[12px] flex flex-wrap justify-center gap-[12px]">
                {prize.map((item, i) => (
                  <li
                    key={`${item.name}-${item.amount}`}
                    // Each prize arrives a moment after the one before it
                    style={{ transitionDelay: `${120 + i * 60}ms` }}
                    className={`flex items-center gap-[8px] rounded-full bg-[#403a31] py-[6px] pr-[16px] pl-[8px] transition-[opacity,translate] duration-300 ${EASE_OUT} starting:translate-y-[6px] starting:opacity-0`}
                  >
                    <Image src={item.icon} alt="" width={28} height={28} className="size-[28px]" />
                    <span className="text-[16px]/[26px] font-bold text-white">
                      {item.name} <span className="text-gold">{item.amount}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <button
                ref={replayButton}
                type="button"
                onClick={replay}
                className="mt-[20px] h-[44px] min-w-[180px] rounded-[8px] border border-gold px-[20px] text-[16px]/[26px] font-bold text-gold transition-colors duration-200 hover:bg-gold/10"
              >
                เปิดอีกครั้ง
              </button>
            </section>
          ) : (
            <>
              <button
                ref={openButton}
                type="button"
                onClick={openBox}
                disabled={status !== "closed"}
                className="h-[44px] min-w-[180px] rounded-[8px] bg-gold px-[20px] text-[16px]/[26px] font-bold text-[#151515] shadow-[-5px_-3px_9.2px_0px_rgba(0,0,0,0.31)] transition-colors duration-200 hover:bg-[#d6c0a3] disabled:cursor-default disabled:opacity-60"
              >
                {status === "closed" ? "เปิดกล่อง" : "กำลังเปิด…"}
              </button>
              {webgl && status === "closed" && (
                <p className="mt-[8px] text-[13px]/[21px] text-grey-text">หรือแตะที่กล่องเพื่อเปิด</p>
              )}
            </>
          )}
        </div>

        {/* Screen readers hear the result as soon as it appears */}
        <p aria-live="polite" className="sr-only">
          {status === "open" ? `ยินดีด้วย คุณได้รับ ${prizeText}` : ""}
        </p>
      </main>
    </div>
  );
}

// Flat 2D box: shown while the 3D scene loads, and for browsers without 3D support
function FlatBox({ status, note }: { status: BoxStatus; note?: ReactNode }) {
  const open = status !== "closed";
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[16px]">
      <div className="relative">
        <div
          aria-hidden
          className={`absolute inset-[-40px] rounded-full bg-[radial-gradient(circle,rgba(245,227,134,0.45),transparent_70%)] transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <Image src="/missions/icons/reward-box.svg" alt="" width={120} height={120} className="relative size-[120px]" />
      </div>
      {note && <p className="text-[13px]/[21px] text-grey-text">{note}</p>}
    </div>
  );
}
