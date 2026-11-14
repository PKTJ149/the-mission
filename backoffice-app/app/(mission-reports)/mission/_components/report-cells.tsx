"use client";

import type { CSSProperties, ReactNode } from "react";
import { useT } from "@/lib/i18n";
import type { RewardMaker, RewardType, Rewards } from "@/lib/api/mission-reports";
import { ManualBadgeIcon } from "./report-icons";

// Shared pieces of the mission report tables (/mission/report, /mission/report-mission and the
// drill-downs). Markup copied from the captured rows.

// Hidden gradient used by the filter icons (first child of .container-fluid on every report page)
export function FilterGradientDefs({ className = "d-box" }: { className?: string }) {
  return (
    <svg className={className || undefined} width="0" height="0" viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="filter-gradient" x1="7.91113" y1="0.666748" x2="7.91113" y2="17.3334" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#50A198"></stop>
          <stop offset="1" stopColor="#FEDB6B"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

// Inline values from page.styles.json (member drill-down / by-mission; reused on the other report pages)
export const SEARCH_COLUMN_STYLE: CSSProperties = { flexBasis: "264px" };
export const TEXT_COLUMN_STYLE: CSSProperties = { width: "216px" };
const GROUP_BADGE_STYLE: CSSProperties = { height: "34px" };
const SUB_BADGE_STYLE: CSSProperties = { height: "29px" };
const LAST_SUB_BADGE_STYLE = { "--badge-divider-color": "#608D9D", height: "29px" } as CSSProperties;

// "12/11/2026<br><small>11:24</small>"
export function DateTimeCell({ date, time }: { date: string; time: string }) {
  return (
    <td>
      {date}
      <br />
      <small>{time}</small>
    </td>
  );
}

// ประเภท badge: Complete (orange) / Manual (teal-green with the people icon)
export function TypeBadge({ type }: { type: RewardType }) {
  if (type === "manual") {
    return (
      <span className="custom-badge-status text-teal-900 bg-teal-green-300 br-teal-green-900">
        <ManualBadgeIcon />
        <span>Manual</span>
      </span>
    );
  }
  return (
    <span className="custom-badge-status text-orange-50 bg-orange-10">
      <span>Complete</span>
    </span>
  );
}

// ผู้ทำรายการ badge: Auto = olive (.system-badge), User = lavender (.badge-primary).
// No Admin row exists on staging; it gets the plain badge (guess).
export function MakerBadge({ maker }: { maker: RewardMaker }) {
  if (maker === "user") return <span className="system-badge badge-primary">User</span>;
  return <span className="system-badge">{maker === "admin" ? "Admin" : "Auto"}</span>;
}

export function CreditPill({ children }: { children: ReactNode }) {
  return <span className="custom-badge-pill p2 bg-teal-900 w-100 justify-content-end">{children}</span>;
}

// The 5 reward cells of an entry row (credit with 2 decimals, like the captured rows)
export function RewardCells({ rewards }: { rewards: Rewards }) {
  return (
    <>
      <td>
        <CreditPill>{rewards.credit.toFixed(2)}</CreditPill>
      </td>
      <td className="text-end">{rewards.minigameRights}</td>
      <td className="text-end">{rewards.promotionRights}</td>
      <td className="text-end">{rewards.points}</td>
      <td className="text-end">{rewards.other}</td>
    </>
  );
}

// Sticky "ยอดรวมทั้งหมด" row of the entry tables (member drill-down, by-mission)
export function SummaryRow({
  colSpan,
  summary,
  label,
  trailingCell = true,
}: {
  colSpan: number;
  summary: Rewards;
  label: ReactNode;
  trailingCell?: boolean;
}) {
  return (
    <tr className="tr-summary tr-height no-hover" style={{ bottom: "0px" }}>
      <td colSpan={colSpan} className="summary-background tdx-0">
        {label}
      </td>
      <td className="text-center">
        <CreditPill>{summary.credit}</CreditPill>
      </td>
      <td className="text-end">{summary.minigameRights}</td>
      <td className="text-end">{summary.promotionRights}</td>
      <td className="text-end">{summary.points}</td>
      <td className="text-end">{summary.other}</td>
      {trailingCell && <td className="text-center"></td>}
    </tr>
  );
}

type RewardHeadProps = {
  // i18n namespace of the header labels: "missionReportPage" or "missionReportByMissionPage"
  ns: string;
  leading: ReactNode; // the rowSpan=2 <th>s before the group
  trailing?: ReactNode; // the rowSpan=2 <th>s after the group (ผู้ทำรายการ)
  // Entry tables put pe-0 on the group header and on the last sub header; /mission/report-mission doesn't
  flushEnd?: boolean;
};

// Two-row <thead>: "รางวัลที่ลูกค้าได้รับ" over เครดิต | สิทธิ์มินิเกมส์ | สิทธิ์โปรโมชั่น | แต้มสะสม | อื่น ๆ
export function RewardHead({ ns, leading, trailing, flushEnd = true }: RewardHeadProps) {
  const t = useT();
  return (
    <thead>
      <tr>
        {leading}
        <th colSpan={5} className={flushEnd ? "text-center th-0 pb-1 pe-0" : "text-center th-0 pb-1"}>
          <span className="custom-badge bg-teal-950 w-100" style={GROUP_BADGE_STYLE}>
            <span className="p1 mission-page">{t(`${ns}.rewardGivenMember`, "รางวัลที่ลูกค้าได้รับ")}</span>
          </span>
        </th>
        {trailing}
      </tr>
      <tr>
        <th className="text-center pt-0 pe-1 ps-3" style={{ minWidth: "142px" }}>
          <span className="custom-badge bg-teal-500 w-100" style={SUB_BADGE_STYLE}>
            <span className="p2 mission-page">{t(`${ns}.credit`, "เครดิต")}</span>
          </span>
        </th>
        <th className="text-center w-0 pe-0 pt-0 ps-1">
          <span className="custom-badge badge-start bg-teal-500" style={SUB_BADGE_STYLE}>
            <span className="p2 mission-page">{t(`${ns}.miniGamePoints`, "สิทธิ์มินิเกมส์")}</span>
          </span>
        </th>
        <th className="text-center w-0 ps-0 pt-0 pe-1">
          <span className="custom-badge badge-divider badge-end bg-teal-500" style={SUB_BADGE_STYLE}>
            <span className="p2 mission-page">{t(`${ns}.promotionPoints`, "สิทธิ์โปรโมชั่น")}</span>
          </span>
        </th>
        <th className="text-center w-0 pe-0 pt-0 ps-1">
          <span className="custom-badge badge-start bg-teal-500" style={SUB_BADGE_STYLE}>
            <span className="p2 mission-page">{t(`${ns}.points`, "แต้มสะสม")}</span>
          </span>
        </th>
        <th className={flushEnd ? "text-center w-0 ps-0 pt-0 pe-0" : "text-center w-0 ps-0 pt-0"}>
          <span className="custom-badge badge-divider badge-end bg-teal-500" style={LAST_SUB_BADGE_STYLE}>
            <span className="p2 mission-page">{t(`${ns}.other`, "อื่น ๆ")}</span>
          </span>
        </th>
      </tr>
    </thead>
  );
}
