"use client";

import Image from "next/image";
import { useId, useState } from "react";
import {
  getHeroArt,
  mainConditions,
  mainRewards,
  missionPeriod,
  subMissions,
  type SubMission,
} from "@/lib/mission-detail-data";
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

// Mission detail page on desktop (1024px+). There's no desktop design in Figma yet, so this is
// built from the mobile screen (12:46689) in two columns: the mission and its big reward on the
// left, the rocket track and the sub-missions on the right. The state lives in MissionDetailView.

const button =
  "rounded-[8px] bg-[#c4ab8c] font-bold text-[#141414] shadow-[0_4px_2px_rgba(0,0,0,0.41)] transition-[background-color,opacity] duration-200 hover:bg-[#d6c0a3] aria-disabled:cursor-default aria-disabled:opacity-20 aria-disabled:hover:bg-[#c4ab8c]";

type Props = {
  missionId: string;
  subs: SubState[];
  mainClaimed: boolean;
  onCheckIn: (index: number) => void;
  onClaim: (index: number) => void;
  onClaimMain: () => void;
};

export function MissionDetailDesktop({ missionId, subs, mainClaimed, onCheckIn, onClaim, onClaimMain }: Props) {
  const claimedCount = subs.filter((sub) => sub.claimed).length;
  const total = subMissions.length;

  return (
    <div className="mx-auto hidden w-full max-w-[1234px] grid-cols-[432px_minmax(0,1fr)] items-start gap-x-[32px] px-[24px] pt-[24px] pb-[64px] lg:grid xl:gap-x-[48px] xl:px-0">
      <h1 className="col-span-2 text-[24px]/[40px] font-bold text-[#e9e9e9]">เส้นทางภารกิจนี้ คุณจะต้องพิชิตให้ได้ !</h1>

      {/* Left: the mission itself and the big reward at the end */}
      <div className="mt-[20px] flex flex-col gap-[24px]">
        <Hero missionId={missionId} />
        <MainReward canClaim={claimedCount === total && !mainClaimed} claimed={mainClaimed} total={total} onClaim={onClaimMain} />
      </div>

      {/* Right: how far along you are, and the sub-missions that get you there */}
      <div className="mt-[20px] flex flex-col gap-[16px]">
        <ProgressCard claimed={claimedCount} total={total} />
        {subMissions.map((sub, i) => (
          <SubMissionCard
            key={sub.id}
            index={i}
            subMission={sub}
            state={subs[i]}
            onCheckIn={() => onCheckIn(i)}
            onClaim={() => onClaim(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ---------- Mission artwork (arrows / dots / drag move to another mission) ----------

function Hero({ missionId }: { missionId: string }) {
  const { index, mission, hrefAt, swipeHandlers } = useMissionSwipe(missionId);

  return (
    <div className="flex flex-col items-center gap-[16px]">
      <div className="flex w-full items-center gap-[16px]">
        <ArrowLink href={hrefAt(-1)} direction="prev" />

        <div className="relative h-[420px] w-[336px] shrink-0 touch-pan-y overflow-clip select-none" {...swipeHandlers}>
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
          <div className="absolute inset-x-0 bottom-[6px] flex flex-col gap-[6px] px-[17px] py-[9px]">
            <div className="flex items-end justify-between gap-[16px] font-bold whitespace-nowrap">
              <h2 className="truncate text-[17px]/[28px] text-[#e9e9e9]">{mission.title}</h2>
              <span className="shrink-0 text-[14px]/[23px] text-[#c4ab8c]">{mission.subMissionCount} ภารกิจย่อย</span>
            </div>
            <p className="flex items-center gap-[8px] text-[14px]/[23px] text-[#e9e9e9]">
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

function MainReward({
  canClaim,
  claimed,
  total,
  onClaim,
}: {
  canClaim: boolean;
  claimed: boolean;
  total: number;
  onClaim: () => void;
}) {
  const [open, setOpen] = useState(true);
  const titleId = useId();
  const panelId = useId();

  return (
    <section aria-labelledby={titleId} className="flex flex-col items-center">
      <div className="flex w-full flex-col gap-[14px] rounded-[16px] border-2 border-[#403a31] bg-[#151515] p-[18px]">
        <h2 id={titleId} className="text-center text-[16px]/[26px] font-bold text-[#e9e9e9]">
          ของรางวัลภารกิจหลัก ทำสำเร็จรับไปเลย !
        </h2>
        <div>
          <h3 className="text-[14px]/[23px] font-bold text-[#c4ab8c]">รางวัลที่ได้รับ</h3>
          <div className="mt-[8px]">
            <RewardList rewards={mainRewards} textClass="text-[13px]/[21px]" />
          </div>
        </div>
        <DemoButton enabled={canClaim} onPress={onClaim} className={`${button} h-[40px] w-full text-[16px]/[26px]`}>
          {claimed ? "รับรางวัลแล้ว" : "รับรางวัล"}
        </DemoButton>
        {/* Says why the button is still off */}
        {!claimed && !canClaim && (
          <p className="-mt-[4px] text-center text-[12px]/[20px] text-[#9c9c9c]">
            กดรับได้เมื่อรับรางวัลภารกิจย่อยครบ {total} ภารกิจ
          </p>
        )}
      </div>

      {/* Conditions hang under the card like a drawer, as on mobile */}
      <div className="flex w-[calc(100%-32px)] flex-col rounded-b-[16px] border-x-2 border-b-2 border-[#403a31] bg-[#302a22] px-[16px] pt-[14px]">
        <h3 className="text-[14px]/[23px] font-bold text-[#e9e9e9]">เงื่อนไขภารกิจย่อย</h3>
        {open && (
          <div id={panelId} className="mt-[8px]">
            <ol className="list-decimal ps-[20px] text-[14px]/[23px] text-[#e9e9e9]">
              {mainConditions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
            <div aria-hidden className="mt-[8px] h-px bg-[#c4ab8c]/50" />
          </div>
        )}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="h-[40px] w-full text-[14px]/[23px] font-bold text-[#c4ab8c] transition-colors duration-200 hover:text-[#d6c0a3]"
        >
          {open ? "ปิดเงื่อนไขภารกิจย่อย" : "ดูเงื่อนไขภารกิจย่อย"}
        </button>
      </div>
    </section>
  );
}

// ---------- START → finish track, stretched to the column width ----------

const FILL_START = 37; // px of the bar already filled behind the rocket at 0% (same as mobile)

function ProgressCard({ claimed, total }: { claimed: number; total: number }) {
  const progress = claimed / total;
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="rounded-[16px] border border-[#403a31] bg-[#151515] px-[20px] pt-[14px] pb-[12px]">
      <div className="flex items-center justify-between gap-[16px]">
        <h2 id={titleId} className="text-[16px]/[26px] font-bold text-[#e9e9e9]">
          ความคืบหน้าภารกิจ
        </h2>
        <p className="text-[14px]/[23px] text-[#9c9c9c]">
          รับรางวัลแล้ว{" "}
          <span className="font-bold text-[#c4ab8c] tabular-nums">
            {claimed}/{total}
          </span>{" "}
          ภารกิจย่อย
        </p>
      </div>

      {/* overflow-x-clip trims the rocket's sliding strip at the right edge but lets the rocket poke out above */}
      <div
        role="progressbar"
        aria-labelledby={titleId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="relative mt-[10px] h-[48px] overflow-x-clip"
      >
        <div className="absolute top-[21.32px] right-[21px] left-[15px] h-[9.36px] rounded-[21px] bg-[#3f3f3f]" />
        {/* The gold part grows by un-clipping a full-width bar (cheaper than animating width) */}
        <div
          className={`absolute top-[21px] right-[21px] left-[16px] h-[10px] rounded-[21px] bg-[#c4ab8c] transition-[clip-path] duration-700 ${EASE_OUT}`}
          style={{ clipPath: `inset(0 calc((100% - ${FILL_START}px) * ${1 - progress}) 0 0 round 21px)` }}
        />
        {/* The rocket sits at the left of a strip as wide as its trip; sliding the strip by
            progress × its own width moves the rocket that far, whatever the column width */}
        <div
          className={`absolute top-[-6px] right-[108px] left-[24px] transition-transform duration-700 ${EASE_OUT}`}
          style={{ transform: `translateX(${progress * 100}%)` }}
        >
          <Image src={`${ICONS}/path-rocket.svg`} alt="" width={64} height={64} className="size-[64px]" />
        </div>
        <Image src={`${ICONS}/path-start.svg`} alt="" width={42} height={42} className="absolute top-[4px] left-0 size-[42px]" />
        <Image src={`${ICONS}/path-flags.svg`} alt="" width={48} height={48} className="absolute top-[-1px] right-0 size-[48px]" />
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
    <section
      aria-label={`ภารกิจย่อย ${index + 1}: ${subMission.title}`}
      className="overflow-clip rounded-[16px] border border-[#403a31] bg-[#151515]"
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex h-[48px] w-full items-center gap-[10px] bg-[#302a22] px-[16px] text-left transition-colors duration-200 hover:bg-[#3a3228]"
        >
          <Image src={`${ICONS}/sub-mission.svg`} alt="" width={24} height={24} className="size-[24px] shrink-0" />
          <span className="text-[12px]/[20px] font-bold whitespace-nowrap text-white/45">ภารกิจย่อย {index + 1} :</span>
          <span className="min-w-0 flex-1 truncate text-[16px]/[26px] font-bold text-white">{subMission.title}</span>
          <span className="shrink-0 text-[13px]/[21px] font-bold text-[#c4ab8c]">{open ? "ซ่อนเงื่อนไข" : "ดูเงื่อนไข"}</span>
          <Image
            src={`${ICONS}/chevron-small.svg`}
            alt=""
            width={16}
            height={16}
            className={`size-[16px] shrink-0 transition-transform duration-200 ${EASE_OUT} ${open ? "-scale-y-100" : ""}`}
          />
        </button>
      </h3>

      {open && (
        <div id={panelId} className="border-b border-[#403a31] bg-black/40 px-[20px] py-[14px]">
          <h4 className="text-[13px]/[21px] font-bold text-[#e9e9e9]">เงื่อนไขภารกิจย่อย</h4>
          <ol className="mt-[6px] list-decimal ps-[20px] text-[14px]/[23px] text-[#e9e9e9]">
            {subMission.conditions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex flex-col gap-[12px] px-[20px] pt-[12px] pb-[16px]">
        {state.rows.map((row) => (
          <div key={row.label} className="flex items-center gap-[16px]">
            <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
              <p className="flex items-center justify-between gap-[12px] text-[14px]/[23px] whitespace-nowrap text-[#e9e9e9]">
                <span className="truncate">{row.label}</span>
                <span className="font-bold tabular-nums">{formatProgress(row)}</span>
              </p>
              <div className="relative h-[8px] rounded-[21px] bg-black">
                <div
                  className={`absolute inset-0 rounded-[21px] bg-[#c4ab8c] transition-[clip-path] duration-500 ${EASE_OUT}`}
                  style={{ clipPath: `inset(0 ${100 - Math.min(1, row.current / row.target) * 100}% 0 0 round 21px)` }}
                />
              </div>
            </div>
            {subMission.action === "check-in" && (
              <DemoButton
                enabled={!done}
                onPress={onCheckIn}
                className={`${button} h-[36px] w-[112px] shrink-0 text-[14px]/[23px]`}
              >
                {done ? "เช็คอินแล้ว" : "เช็คอิน"}
              </DemoButton>
            )}
          </div>
        ))}

        <div className="flex items-end gap-[16px] border-t border-[#2b2b2b] pt-[12px]">
          <div className="min-w-0 flex-1">
            <h4 className="text-[12px]/[20px] font-bold text-[#c4ab8c]">รางวัลที่ได้รับ</h4>
            <div className="mt-[4px]">
              <RewardList rewards={subMission.rewards} textClass="text-[14px]/[23px]" />
            </div>
          </div>
          <DemoButton
            enabled={done && !state.claimed}
            onPress={onClaim}
            className={`${button} h-[36px] w-[112px] shrink-0 text-[14px]/[23px]`}
          >
            {state.claimed ? "รับแล้ว" : "รับรางวัล"}
          </DemoButton>
        </div>
      </div>
    </section>
  );
}
