"use client";

/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

import { Fragment, type MouseEvent } from "react";
import type { RightsCategory, RightsRow, RightsStatus } from "@/lib/api/minigame-reports";
import { cx } from "@/components/ui";
import { CustomerSearchIcon, InfoIcon } from "./report-icons";
import type { useTooltip } from "./tooltip";

// Cells shared by the drill-down table on /report/promotion/minigame and the history table.

// "รอใช้โปร" and "ใช้โปรแล้ว" as staging renders them (15/11). Staging has no "หมดอายุ" / "ยกเลิก" rows,
// so those classes are guesses that follow the names in base.css.
// icon = class of the (i) after the label; title = class of the status line in its tooltip.
export const RIGHTS_STATUS: Record<RightsStatus, { text: string; label: string; row: string; icon: string; title: string }> = {
  waiting: { text: "รอใช้โปร", label: "label-warning", row: "warning", icon: "text-yellow-60", title: "text-yellow-50" },
  accept: { text: "ใช้โปรแล้ว", label: "label-cyan", row: "success", icon: "text-cyan-60", title: "text-cyan-50" },
  expired: { text: "หมดอายุ", label: "label-gray", row: "expired", icon: "text-gray-30", title: "text-gray-30" },
  rejected: { text: "ยกเลิก", label: "label-danger", row: "danger", icon: "text-red-50", title: "text-red-50" },
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

// "ประเภท" badge. Auto and Manual as on staging; the other two types (no rows on staging) reuse Auto's look.
const CATEGORY_LOOK: Record<RightsCategory, { className: string; icon: string }> = {
  auto: { className: "text-cyan-60 bg-cyan-10", icon: "setting.svg" },
  manual: { className: "text-orange-50 bg-orange-10", icon: "customer-service.svg" },
  promotion: { className: "text-cyan-60 bg-cyan-10", icon: "setting.svg" },
  "mini-game": { className: "text-cyan-60 bg-cyan-10", icon: "setting.svg" },
};

export function CategoryCell({ category }: { category: RightsCategory }) {
  const look = CATEGORY_LOOK[category];
  return (
    <td className="text-center">
      <span className={`custom-badge-status ${look.className}`}>
        <img src={`/assets/images/svg/${look.icon}`} />
        <span>{CATEGORY_TEXT[category]}</span>
      </span>
    </td>
  );
}

// Credit pill (yellow while "รอใช้โปร", plain once used) + the four bonus counts
export function BonusCells({ row }: { row: RightsRow }) {
  return (
    <>
      <td className="text-end pe-1">
        <span className={cx("custom-badge-pill p2 w-100", row.status === "waiting" && "bg-yellow-10")}>
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

// (i) after the status label: hover shows each status the row went through, newest first
// (.promotion-deposit-tooltip, placement top-end, offset "10,4"). Preceded by a space like the original markup.
// ORIGINAL: the tooltip HTML asks for style="--column-width: 74px;" but Bootstrap's sanitizer strips the
// style attribute, so the columns keep their CSS default width; left out here for the same result.
// rowTag: the history page opens the "ใช้โปรแล้ว" tooltip with <span class="custom-row …"> (closed with </div>)
export function StatusInfo({ row, tooltip, rowTag = "div" }: { row: RightsRow; tooltip: ReturnType<typeof useTooltip>; rowTag?: "div" | "span" }) {
  const RowTag = rowTag;
  const show = (event: MouseEvent<HTMLSpanElement>) =>
    tooltip.show(
      event.currentTarget,
      <RowTag className="custom-row row gy-10 text-start">
        {row.history.map((step, index) => (
          <Fragment key={index}>
            <p className={`col-h p4 fw-700 ${RIGHTS_STATUS[step.status].title}`}>{RIGHTS_STATUS[step.status].text}</p>
            <p className="col-d p4">{step.date}</p>
          </Fragment>
        ))}
      </RowTag>,
      "top-end",
      "promotion-deposit-tooltip",
      10,
    );

  return (
    <>
      {" "}
      <span className={RIGHTS_STATUS[row.status].icon} data-tooltip="" onMouseEnter={show} onMouseLeave={tooltip.hide}>
        <InfoIcon />
      </span>
    </>
  );
}

export function MakeByCell({ makeBy }: { makeBy: string }) {
  return (
    <td className="text-center">
      <span className="system-badge badge-success">{makeBy}</span>
    </td>
  );
}
