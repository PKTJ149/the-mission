"use client";

/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

import type { MouseEvent } from "react";
import type { RightsCategory, RightsRow, RightsStatus } from "@/lib/api/minigame-reports";
import { CustomerSearchIcon, InfoIcon } from "./report-icons";
import type { useTooltip } from "./tooltip";

// Cells shared by the drill-down table on /report/promotion/minigame and the history table.

// Only "รอใช้โปร" (warning) rows were captured; the other classes follow the names that exist in base.css.
export const RIGHTS_STATUS: Record<RightsStatus, { text: string; label: string; row: string; tooltip: string }> = {
  waiting: { text: "รอใช้โปร", label: "label-warning", row: "warning", tooltip: "text-yellow-50" },
  accept: { text: "ใช้โปรแล้ว", label: "label-success", row: "success", tooltip: "text-green-50" },
  expired: { text: "หมดอายุ", label: "label-gray", row: "expired", tooltip: "text-gray-30" },
  rejected: { text: "ยกเลิก", label: "label-danger", row: "danger", tooltip: "text-red-50" },
};

const CATEGORY_TEXT: Record<RightsCategory, string> = {
  auto: "Auto",
  manual: "Manual",
  promotion: "โปรโมชั่นหลัก",
  "mini-game": "มินิเกมส์",
};

// Magnifier button (shortcutSearchCustomer) + username link + (game username)
export function CustomerCell({ row, onSearch }: { row: RightsRow; onSearch: (username: string) => void }) {
  return (
    <td>
      <div className="d-flex align-items-center">
        <button className="system-action action-square action-outline action-info" onClick={() => onSearch(row.username)}>
          <CustomerSearchIcon />
        </button>
        <div className="ms-2">
          {/* ORIGINAL: href="#" jumps to the top of the page; the jump is not reproduced */}
          <a href="#" className="p2 text-green-50 fw-700" onClick={(event) => event.preventDefault()}>
            {row.username}
          </a>
          <p className="p2 mb-0 text-gray-20">{`(${row.gameUsername})`}</p>
        </div>
      </div>
    </td>
  );
}

// "ประเภท" badge. Only "Auto" (setting.svg) was captured; the other types reuse its markup.
export function CategoryCell({ category }: { category: RightsCategory }) {
  return (
    <td className="text-center">
      <span className="custom-badge-status text-cyan-60 bg-cyan-10">
        <img src="/assets/images/svg/setting.svg" />
        <span>{CATEGORY_TEXT[category]}</span>
      </span>
    </td>
  );
}

// Yellow credit pill + the four bonus counts
export function BonusCells({ row }: { row: RightsRow }) {
  return (
    <>
      <td className="text-end pe-1">
        <span className="custom-badge-pill p2 w-100 bg-yellow-10">
          <span className="w-100">{row.credit}</span>
        </span>
      </td>
      <td className="text-center">{row.minigameRights}</td>
      <td className="text-center">{row.lottoRights}</td>
      <td className="text-center">{row.points}</td>
      <td className="text-center">{row.rewards}</td>
    </>
  );
}

// (i) after the status label: hover shows the status + date (.promotion-deposit-tooltip, placement top-end).
// Its attributes were withheld by the capture tool; class names here are a guess from the screenshot (yellow icon).
export function StatusInfo({ row, tooltip }: { row: RightsRow; tooltip: ReturnType<typeof useTooltip> }) {
  const status = RIGHTS_STATUS[row.status];
  const show = (event: MouseEvent<HTMLSpanElement>) =>
    tooltip.show(
      event.currentTarget,
      <div className="custom-row row gy-10 text-start">
        <p className={`col-h p4 fw-700 ${status.tooltip}`}>{status.text}</p>
        <p className="col-d p4">{row.date}</p>
      </div>,
      "top-end",
      "promotion-deposit-tooltip",
    );

  return (
    <span className={`ms-1 ${status.tooltip}`} data-tooltip="" onMouseEnter={show} onMouseLeave={tooltip.hide}>
      <InfoIcon />
    </span>
  );
}

export function MakeByCell({ makeBy }: { makeBy: string }) {
  return (
    <td className="text-center">
      <span className="system-badge badge-success">{makeBy}</span>
    </td>
  );
}
