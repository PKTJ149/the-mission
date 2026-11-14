"use client";

import Image from "next/image";
import { useId, useState, type ReactNode } from "react";
import {
  getHeroArt,
  getMission,
  mainConditions,
  mainRewards,
  missionPeriod,
  subMissions,
  type SubMission,
} from "@/lib/mission-detail-data";
import { useMobileZoom } from "@/lib/use-mobile-zoom";
import { DesktopMissionHeader } from "./desktop-mission-header";
import { MissionDetailDesktop } from "./mission-detail-desktop";
import {
  ArrowLink,
  DemoButton,
  EASE_OUT,
  HERO_SIZES,
  ICONS,
  MissionDots,
  RewardList,
  formatProgress,
  isDone,
  useMissionSwipe,
  type SubState,
} from "./mission-detail-shared";
import { MissionHeader } from "./mission-header";

// Mission detail page. Mobile follows Figma 12:46689 ("เมื่อกดทำภารกิจ", 430px); desktop (1024px+)
// is its own two-column layout in mission-detail-desktop.tsx. Both read the same state, so a
// check-in on one shows on the other. It's a working demo: nothing is saved — reloading starts over.

// The parts that are the same for every mission (header + page title). Rendering them outside
// the mission-specific part lets Next.js show them instantly when you switch missions.
export function MissionDetailShell({ children }: { children: ReactNode }) {
  const zoom = useMobileZoom();
  return (
    <div className="min-h-dvh bg-page">
      {/* Phones: the 430px Figma header (scaled down on narrower screens) */}
      <div className="sticky top-0 z-20 mx-auto w-[430px] lg:hidden" style={{ zoom }}>
        <MissionHeader backHref="/missions" backLabel="กลับไปหน้าภารกิจ" />
      </div>
      {/* Desktop: `contents` drops the wrapper box, so the header can stick for the whole page */}
      <div className="hidden lg:contents">
        <DesktopMissionHeader backHref="/missions" backLabel="กลับไปหน้าภารกิจ" title="รายละเอียดภารกิจ" titleAs="p" />
      </div>
      <main>{children}</main>
    </div>
  );
}

export function MissionDetailView({ missionId }: { missionId: string }) {
  const mission = getMission(missionId)!;
  // Missions already marked complete on the list open with everything claimed
  const finished = mission.status === "completed";
  const [subs, setSubs] = useState<SubState[]>(() =>
    subMissions.map((sub) => ({
      rows: finished ? sub.rows.map((row) => ({ ...row, current: row.target })) : sub.rows,
      claimed: finished,
    })),
  );
  const [mainClaimed, setMainClaimed] = useState(finished);
  const [announcement, setAnnouncement] = useState("");
  const zoom = useMobileZoom();

  const claimedCount = subs.filter((sub) => sub.claimed).length;
  const allClaimed = claimedCount === subMissions.length;

  const update = (index: number, change: (sub: SubState) => SubState) =>
    setSubs((current) => current.map((sub, i) => (i === index ? change(sub) : sub)));

  const checkIn = (index: number) => {
    update(index, (sub) => ({ ...sub, rows: sub.rows.map((row) => ({ ...row, current: row.target })) }));
    setAnnouncement("เช็คอินสำเร็จ กดรับรางวัลได้เลย");
  };

  const claim = (index: number) => {
    update(index, (sub) => ({ ...sub, claimed: true }));
    setAnnouncement(`รับรางวัลภารกิจย่อย ${index + 1} แล้ว`);
  };

  const claimMain = () => {
    setMainClaimed(true);
    setAnnouncement("รับรางวัลภารกิจหลักแล้ว");
  };

  return (
    <>
      {/* ---------- Mobile (Figma 12:46689, 430px) — hidden from 1024px up ---------- */}
      <div className="mx-auto w-[430px] overflow-clip pb-[31px] lg:hidden" style={{ zoom }}>
        <h1 className="p-[8px] text-center text-[19px]/[31px] font-bold text-[#e9e9e9]">
          เส้นทางภารกิจนี้ คุณจะต้องพิชิตให้ได้ !
        </h1>
        <MissionPath progress={claimedCount / subMissions.length} />

        <h2 className="sr-only">{mission.title}</h2>
        <HeroCarousel missionId={mission.id} />

        <MainReward canClaim={allClaimed && !mainClaimed} claimed={mainClaimed} onClaim={claimMain} />

        {subMissions.map((sub, i) => (
          <SubMissionCard
            key={sub.id}
            index={i}
            subMission={sub}
            state={subs[i]}
            onCheckIn={() => checkIn(i)}
            onClaim={() => claim(i)}
          />
        ))}
      </div>

      {/* ---------- Desktop (no Figma design yet) — shown from 1024px up ---------- */}
      <MissionDetailDesktop
        missionId={mission.id}
        subs={subs}
        mainClaimed={mainClaimed}
        onCheckIn={checkIn}
        onClaim={claim}
        onClaimMain={claimMain}
      />

      {/* Screen readers hear the result of each check-in / claim */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </>
  );
}

// ---------- START → finish track (Figma "strpper") ----------

const FILL_START = 37; // px of the bar already filled behind the rocket at 0%
const BAR_WIDTH = 361;
const ROCKET_TRAVEL = 266; // the rocket stops just before the finish flags

function MissionPath({ progress }: { progress: number }) {
  const filled = FILL_START + progress * (BAR_WIDTH - FILL_START);
  return (
    <div
      role="progressbar"
      aria-label="ความคืบหน้าภารกิจ"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="mx-auto mt-0 h-[64px] w-[414px] p-[8px]"
    >
      <div className="relative h-[48px] w-[398px]">
        <div className="absolute top-[21.32px] left-[15px] h-[9.36px] w-[362px] rounded-[21px] bg-[#3f3f3f]" />
        {/* The gold part grows by un-clipping a full-width bar (cheaper than animating width) */}
        <div
          className={`absolute top-[21px] left-[16px] h-[10px] w-[361px] rounded-[21px] bg-[#c4ab8c] transition-[clip-path] duration-700 ${EASE_OUT}`}
          style={{ clipPath: `inset(0 ${BAR_WIDTH - filled}px 0 0 round 21px)` }}
        />
        <Image
          src={`${ICONS}/path-rocket.svg`}
          alt=""
          width={64}
          height={64}
          className={`absolute top-[-6px] left-[24px] size-[64px] transition-transform duration-700 ${EASE_OUT}`}
          style={{ transform: `translateX(${progress * ROCKET_TRAVEL}px)` }}
        />
        <Image src={`${ICONS}/path-start.svg`} alt="" width={42} height={42} className="absolute top-[4px] left-0 size-[42px]" />
        <Image src={`${ICONS}/path-flags.svg`} alt="" width={48} height={48} className="absolute top-[-1px] left-[350px] size-[48px]" />
      </div>
    </div>
  );
}

// ---------- Mission artwork carousel (arrows / dots / swipe move to another mission) ----------

function HeroCarousel({ missionId }: { missionId: string }) {
  const { index, mission, hrefAt, swipeHandlers } = useMissionSwipe(missionId);

  return (
    <div className="mt-[16px] flex flex-col items-center gap-[16px] px-[16px]">
      <div className="flex w-full items-center gap-[11px]">
        <ArrowLink href={hrefAt(-1)} direction="prev" />

        <div className="relative h-[390px] w-[312px] touch-pan-y overflow-clip select-none" {...swipeHandlers}>
          {/* Every artwork has its own rounded card baked in; characters poke out above it */}
          <Image
            src={getHeroArt(mission)}
            alt=""
            fill
            sizes={HERO_SIZES}
            preload
            draggable={false}
            className="rounded-[8px] object-cover"
          />
          <div className="absolute inset-x-0 bottom-[5px] flex h-[72px] flex-col gap-[8px] py-[8px]">
            <p className="flex items-end justify-between gap-[16px] px-[16px] font-bold whitespace-nowrap">
              <span className="truncate text-[16px]/[26px] text-[#e9e9e9]">{mission.title}</span>
              <span className="shrink-0 text-[13px]/[21px] text-[#c4ab8c]">{mission.subMissionCount} ภารกิจย่อย</span>
            </p>
            <p className="flex items-center gap-[8px] px-[16px] text-[13px]/[21px] text-[#e9e9e9]">
              <Image src={`${ICONS}/clock.svg`} alt="" width={20} height={20} className="size-[20px]" />
              <span className="sr-only">ระยะเวลาภารกิจ </span>
              {missionPeriod}
            </p>
          </div>
        </div>

        <ArrowLink href={hrefAt(1)} direction="next" />
      </div>

      <MissionDots index={index} />
    </div>
  );
}

// ---------- Main mission reward + its conditions ----------

const claimButton =
  "h-[32px] rounded-[8px] bg-[#c4ab8c] text-[13px]/[21px] font-bold text-black drop-shadow-[0px_4px_2px_rgba(0,0,0,0.41)] transition-[background-color,opacity] duration-200 hover:bg-[#d6c0a3] aria-disabled:cursor-default aria-disabled:opacity-20 aria-disabled:hover:bg-[#c4ab8c]";

function MainReward({ canClaim, claimed, onClaim }: { canClaim: boolean; claimed: boolean; onClaim: () => void }) {
  const [open, setOpen] = useState(true);
  const panelId = useId();
  return (
    <section aria-labelledby="main-reward" className="mx-auto mt-[20px] flex w-[398px] flex-col items-center">
      {/* Padding is 2px less than Figma because of the CSS border */}
      <div className="flex w-full flex-col items-center gap-[16px] rounded-[16px] border-2 border-[#403a31] bg-[#151515] py-[14px] backdrop-blur-[5px]">
        <h2 id="main-reward" className="text-center text-[16px]/[26px] font-bold text-[#e9e9e9]">
          ของรางวัลภารกิจหลัก ทำสำเร็จรับไปเลย !
        </h2>
        <div className="flex w-full flex-col gap-[8px] px-[14px]">
          <h3 className="text-[13px]/[21px] font-bold text-[#e9e9e9]">รางวัลที่ได้รับ</h3>
          <RewardList rewards={mainRewards} textClass="text-[11px]/[18px]" />
          <DemoButton enabled={canClaim} onPress={onClaim} className={`${claimButton} w-[365px]`}>
            {claimed ? "รับรางวัลแล้ว" : "รับรางวัล"}
          </DemoButton>
        </div>
      </div>

      <div className="flex w-[366px] flex-col items-center rounded-b-[16px] border-x-2 border-b-2 border-[#403a31] bg-[#302a22] px-[14px] pt-[16px]">
        <h3 className="w-full text-[13px]/[21px] font-bold text-[#e9e9e9]">เงื่อนไขภารกิจย่อย</h3>
        {open && (
          <div id={panelId} className="mt-[16px] w-[334px]">
            <ol className="list-decimal ps-[19.5px] text-[13px]/[21px] text-[#e9e9e9]">
              {mainConditions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
            <div aria-hidden className="mt-[4px] h-px bg-[#c4ab8c]/50" />
          </div>
        )}
        {/* 30px, not Figma's 32: the panel's bottom border sits inside the button in Figma */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="h-[30px] w-full text-[13px]/[21px] font-bold text-[#c4ab8c] transition-colors duration-200 hover:text-[#d6c0a3]"
        >
          {open ? "ปิดเงื่อนไขภารกิจย่อย" : "ดูเงื่อนไขภารกิจย่อย"}
        </button>
      </div>
    </section>
  );
}

// ---------- One sub-mission (header opens its conditions) ----------

function SubMissionCard({
  index,
  subMission,
  state,
  onCheckIn,
  onClaim,
}: {
  index: number;
  subMission: SubMission;
  state: SubState;
  onCheckIn: () => void;
  onClaim: () => void;
}) {
  const [open, setOpen] = useState(subMission.startOpen ?? false);
  const panelId = useId();
  const done = isDone(state.rows);

  return (
    <section aria-label={`ภารกิจย่อย ${index + 1}: ${subMission.title}`} className="mx-auto mt-[20px] w-[398px]">
      <h3 className="pt-px">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="relative flex h-[32px] w-full items-center gap-[8px] rounded-t-[8px] bg-[#302a22] pr-[8px] pl-[33px] text-left"
        >
          <Image src={`${ICONS}/sub-mission.svg`} alt="" width={24} height={24} className="absolute top-[4px] left-[4px] size-[24px]" />
          <span className="text-[10px]/[16px] font-bold whitespace-nowrap text-white/45">ภารกิจย่อย {index + 1} :</span>
          <span className="min-w-0 flex-1 truncate text-[13px]/[21px] font-bold text-white">{subMission.title}</span>
          <Image
            src={`${ICONS}/chevron-small.svg`}
            alt=""
            width={16}
            height={16}
            className={`absolute top-[8px] left-[374px] size-[16px] transition-transform duration-200 ${EASE_OUT} ${
              open ? "-scale-y-100" : ""
            }`}
          />
        </button>
      </h3>

      {open && (
        <div id={panelId} className="flex flex-col border-t-2 border-[#403a31] bg-[#151515] px-[16px] pt-[16px] pb-[16px]">
          <h4 className="text-[10px]/[16px] font-bold text-[#e9e9e9]">เงื่อนไขภารกิจย่อย</h4>
          <ol className="mx-auto mt-[11px] w-[334px] list-decimal ps-[18px] text-[12px]/[19.6px] text-[#e9e9e9]">
            {subMission.conditions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Padding is 1px less than Figma because of the CSS border */}
      <div className="flex flex-col gap-[8px] rounded-b-[16px] border border-[#403a31] bg-[#151515] pt-[7px] pb-[16px] backdrop-blur-[5px]">
        <div>
          {state.rows.map((row) => (
            <div key={row.label} className="flex items-center gap-[8px] py-[8px] pr-[7px] pl-[15px]">
              <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
                <p className="flex items-center justify-between gap-[8px] text-[12px]/[20px] whitespace-nowrap text-[#e9e9e9]">
                  <span className="truncate">{row.label}</span>
                  <span className="font-bold">{formatProgress(row)}</span>
                </p>
                <div className="relative h-[6px] w-full rounded-[21px] bg-black">
                  <div
                    className={`absolute inset-y-0 left-px right-0 rounded-[21px] bg-[#c4ab8c] transition-[clip-path] duration-500 ${EASE_OUT}`}
                    style={{ clipPath: `inset(0 ${100 - Math.min(1, row.current / row.target) * 100}% 0 0 round 21px)` }}
                  />
                </div>
              </div>
              {subMission.action === "check-in" && (
                <DemoButton
                  enabled={!done}
                  onPress={onCheckIn}
                  className={`${claimButton} w-[87px] shrink-0 text-[12px]/[20px] text-[#1e1e1e]`}
                >
                  {done ? "เช็คอินแล้ว" : "เช็คอิน"}
                </DemoButton>
              )}
            </div>
          ))}
        </div>

        <div>
          <h4 className="px-[15px] text-[10px]/[16px] font-bold text-[#c4ab8c]">รางวัลที่ได้รับ</h4>
          <div className="flex items-center gap-[8px] pr-[7px]">
            <div className="min-w-0 flex-1 px-[15px]">
              <RewardList rewards={subMission.rewards} textClass="text-[12px]/[20px]" />
            </div>
            <DemoButton enabled={done && !state.claimed} onPress={onClaim} className={`${claimButton} w-[87px] shrink-0`}>
              {state.claimed ? "รับแล้ว" : "รับรางวัล"}
            </DemoButton>
          </div>
        </div>
      </div>
    </section>
  );
}
