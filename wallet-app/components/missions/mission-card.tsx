import Image from "next/image";
import Link from "next/link";
import { useId } from "react";
import { formatTimeLeft, type Mission, type MissionReward, type RewardType } from "@/lib/mission-data";
import { CompletedOverlay, CompletedStamp, FrameOver, FrameUnder } from "./card-frames";

// One mission card = a fixed 398×224 box with absolute positions taken from Figma.
// Cards come in two mirrored layouts: picture on the left, or picture on the right.

const ICONS = "/missions/icons";

const rewardIcons: Record<RewardType, { src: string; name: string }> = {
  credit: { src: `${ICONS}/reward-credit.svg`, name: "เครดิต" },
  point: { src: `${ICONS}/reward-point.svg`, name: "แต้ม" },
  wheel: { src: `${ICONS}/reward-wheel.svg`, name: "สิทธิ์หมุนวงล้อ" },
  box: { src: `${ICONS}/reward-box.svg`, name: "กล่องสุ่ม" },
  card: { src: `${ICONS}/reward-card.svg`, name: "การ์ด" },
  spin: { src: `${ICONS}/reward-spin.svg`, name: "ฟรีสปิน" },
  item: { src: `${ICONS}/reward-item.svg`, name: "ของรางวัล" },
};

type MissionCardProps = {
  mission: Mission;
  pinned: boolean;
  favorite: boolean;
  secondsLeft?: number;
  onTogglePin: () => void;
  onToggleFavorite: () => void;
};

function RewardRow({ rewards }: { rewards: MissionReward[] }) {
  return (
    <ul className="flex items-center gap-[4px]">
      {rewards.map((reward, index) => (
        <li key={`${reward.type}-${index}`} className="flex items-center gap-[4px]">
          <Image
            src={rewardIcons[reward.type].src}
            alt={rewardIcons[reward.type].name}
            width={20}
            height={20}
            className="size-[20px] shrink-0"
          />
          <span className="text-[11px]/[18px] font-bold whitespace-pre text-[#e9e9e9]">{reward.label}</span>
        </li>
      ))}
    </ul>
  );
}

function MissionInfo({
  mission,
  titleId,
  left,
  secondsLeft,
}: {
  mission: Mission;
  titleId: string;
  left: number;
  secondsLeft?: number;
}) {
  const rowOne = mission.rewards.slice(0, 4);
  const rowTwo = mission.rewards.slice(4);

  return (
    <div className="absolute top-[20px] h-[194px] w-[204px] overflow-clip" style={{ left }}>
      <h3
        id={titleId}
        className="absolute top-[8px] left-[8px] max-w-[194px] truncate text-[16px]/[26px] font-bold text-[#e9e9e9]"
      >
        {mission.title}
      </h3>
      <p className="absolute top-[34px] left-[8px] text-[13px]/[21px] whitespace-nowrap text-gold">
        {mission.subMissionCount} ภารกิจย่อย
      </p>

      {/* Gold divider line (vector from Figma, tilted -0.45°) */}
      <div className="absolute top-[60px] left-[8px] flex h-[1.5px] w-[193px] items-center justify-center">
        <div className="flex-none rotate-[-0.45deg]">
          <div className="relative h-0 w-[193.006px]">
            <div className="absolute inset-[-1px_0]">
              <Image src={`${ICONS}/divider.svg`} alt="" aria-hidden fill sizes="193px" />
            </div>
          </div>
        </div>
      </div>

      {secondsLeft !== undefined && (
        <>
          <p className="absolute top-[68px] left-[8px] text-[11px]/[18px] font-bold whitespace-nowrap text-[#e9e9e9]">
            เหลือเวลาอีก :
          </p>
          <p className="absolute top-[66px] left-[117px] text-[13px]/[21px] font-bold whitespace-nowrap text-[#eb3333] tabular-nums">
            {formatTimeLeft(secondsLeft)}
          </p>
        </>
      )}

      <p className="absolute top-[103px] left-[5px] text-[13px]/[21px] font-bold text-[#e9e9e9]">รางวัล</p>
      <div className="absolute top-[124px] left-[8px] flex w-[193px] flex-col gap-[8px]">
        <RewardRow rewards={rowOne} />
        {rowTwo.length > 0 && <RewardRow rewards={rowTwo} />}
      </div>
    </div>
  );
}

// Clock + fixed date range, used instead of the countdown
function PeriodRow({ period, left }: { period: string; left: number }) {
  return (
    <div className="absolute top-[81px] flex items-center gap-[2px]" style={{ left }}>
      <Image src={`${ICONS}/clock.svg`} alt="" aria-hidden width={32} height={32} className="size-[32px]" />
      <p className="w-[183px] text-[11px]/[18px] text-[#e9e9e9]">{period}</p>
    </div>
  );
}

// Red "ภารกิจเฉพาะคุณ" ribbon over the picture. Figma only shows it on picture-right cards;
// on picture-left cards it is mirrored so it never covers the reward list.
function ExclusiveRibbon({ isRight }: { isRight: boolean }) {
  return (
    <>
      <Image
        src={`${ICONS}/ribbon.svg`}
        alt=""
        aria-hidden
        width={135}
        height={30}
        className={`absolute top-[140px] h-[30px] w-[135px] max-w-none ${isRight ? "right-0" : "left-0 -scale-x-100"}`}
      />
      <p
        className={`absolute top-[145px] text-[13px]/[21px] font-bold whitespace-nowrap text-[#e9e9e9] ${
          isRight ? "left-[292px]" : "right-[292px]"
        }`}
      >
        ภารกิจเฉพาะคุณ
      </p>
    </>
  );
}

// "ทำภารกิจ" opens the mission detail page; "สำเร็จแล้ว" (no href) is a disabled button
function ActionButton({
  isRight,
  label,
  titleId,
  href,
}: {
  isRight: boolean;
  label: string;
  titleId: string;
  href?: string;
}) {
  const className = `flex h-[32px] w-[136.747px] flex-none items-center justify-center rounded-[8px] bg-[#c4ab8c] text-[16px]/[26px] font-bold whitespace-nowrap text-[#151515] shadow-[-5px_-3px_9.2px_0px_rgba(0,0,0,0.31)] transition-colors duration-200 ${
    isRight ? "rotate-[-3.25deg]" : "rotate-[3.95deg]"
  } ${href ? "hover:bg-[#d6c0a3]" : "cursor-default"}`;
  return (
    <div
      className={`absolute flex items-center justify-center ${
        isRight
          ? "top-[172.83px] left-[244.52px] h-[39.699px] w-[138.341px]"
          : "top-[172px] left-[15px] h-[41.351px] w-[138.628px]"
      }`}
    >
      {href ? (
        <Link href={href} aria-describedby={titleId} className={className}>
          {label}
        </Link>
      ) : (
        <button type="button" disabled aria-describedby={titleId} className={className}>
          {label}
        </button>
      )}
    </div>
  );
}

function PinButtons({
  pinned,
  favorite,
  onTogglePin,
  onToggleFavorite,
}: Pick<MissionCardProps, "pinned" | "favorite" | "onTogglePin" | "onToggleFavorite">) {
  return (
    <div className="absolute top-0 left-[366px] flex w-[32px] flex-col gap-[8px]">
      <button
        type="button"
        aria-pressed={pinned}
        aria-label="ปักหมุดภารกิจ"
        onClick={onTogglePin}
        className="size-[32px] rounded-[6px] transition-transform duration-150 active:scale-95"
      >
        <Image src={`${ICONS}/${pinned ? "pin-on" : "pin-off"}.svg`} alt="" width={32} height={32} />
      </button>
      <button
        type="button"
        aria-pressed={favorite}
        aria-label="เพิ่มในภารกิจโปรด"
        onClick={onToggleFavorite}
        className="size-[32px] rounded-[6px] transition-transform duration-150 active:scale-95"
      >
        <Image src={`${ICONS}/${favorite ? "bookmark-on" : "bookmark-off"}.svg`} alt="" width={32} height={32} />
      </button>
    </div>
  );
}

function RemainingPill({ count, isRight }: { count: number; isRight: boolean }) {
  return (
    <p
      className={`absolute top-[181px] flex h-[32px] w-[193px] items-center justify-center rounded-[50px] bg-[#202020] p-[8px] text-[13px]/[21px] whitespace-pre text-gold ${
        isRight ? "left-[39px]" : "left-[166px]"
      }`}
    >
      {"ยังเหลืออีก "}
      <span className="text-[23px]/[38px] font-bold">{`${count} `}</span>
      ภารกิจให้คุณทำ
    </p>
  );
}

export function MissionCard({ mission, pinned, favorite, secondsLeft, onTogglePin, onToggleFavorite }: MissionCardProps) {
  const titleId = useId();
  const isRight = mission.layout === "image-right";
  const textLeft = isRight ? 20 : 174;
  const imageLeft = isRight ? 232 : 10;
  const detailHref = `/missions/${mission.id}`;
  const pins = (
    <PinButtons pinned={pinned} favorite={favorite} onTogglePin={onTogglePin} onToggleFavorite={onToggleFavorite} />
  );

  const body = (
    <>
      <FrameUnder frame={mission.frame} />
      <MissionInfo mission={mission} titleId={titleId} left={textLeft} secondsLeft={secondsLeft} />
      {mission.period && <PeriodRow period={mission.period} left={textLeft} />}
      <FrameOver frame={mission.frame} />
      <Image
        src={mission.image}
        alt=""
        width={156}
        height={195}
        className={`absolute top-0 h-[195px] w-[156px] object-cover ${mission.imageRounded ? "rounded-[8px]" : ""}`}
        style={{ left: imageLeft }}
      />
      {mission.exclusive && <ExclusiveRibbon isRight={isRight} />}
    </>
  );

  if (mission.status === "active") {
    return (
      <article aria-labelledby={titleId} className="relative h-[224px] w-[398px]">
        {body}
        <ActionButton isRight={isRight} label="ทำภารกิจ" titleId={titleId} href={detailHref} />
        {pins}
      </article>
    );
  }

  // Completed: a blurred glass pane covers the whole card (pins and "สำเร็จแล้ว" button too),
  // everything below the stamp turns grey, and the MISSION COMPLETE stamp sits on top.
  const remaining = mission.remainingMissions ?? 0;
  return (
    <article aria-labelledby={titleId} className="relative h-[224px] w-[398px]">
      {body}
      {pins}
      {remaining === 0 && <ActionButton isRight={isRight} label="สำเร็จแล้ว" titleId={titleId} />}
      <CompletedOverlay layout={mission.layout} />
      {/* Figma greys the card with a "luminosity" blend over the black page. A grey layer in
          "saturation" mode gives the same result here without breaking the blur in Chrome. */}
      <div aria-hidden className="pointer-events-none absolute -inset-[8px] bg-[#808080] mix-blend-saturation" />
      <CompletedStamp layout={mission.layout} />
      {remaining > 0 && (
        <>
          <RemainingPill count={remaining} isRight={isRight} />
          <ActionButton isRight={isRight} label="ทำภารกิจ" titleId={titleId} href={detailHref} />
        </>
      )}
    </article>
  );
}
