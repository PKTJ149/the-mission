"use client";

import type { CSSProperties } from "react";
import { useT } from "@/lib/i18n";
import type { GameStatus, SummaryRow, SummaryTotals } from "@/lib/api/minigame-reports";
import { BadgeOffIcon, BadgeOnIcon, EyeIcon, ExpiredBadgeIcon } from "@/app/(minigame-reports)/_components/report-icons";
import type { useTooltip } from "@/app/(minigame-reports)/_components/tooltip";

type SummaryTableProps = {
  rows: SummaryRow[];
  totals: SummaryTotals;
  onOpen: (row: SummaryRow) => void; // nextDetail(event, name, id)
  tooltip: ReturnType<typeof useTooltip>;
};

// Inline values set by the original JS (not captured): measured on staging at 1704px
const NAME_STYLE: CSSProperties = { width: "210px" };
// Same gradient as base.css --color-bg-hover (colours match the screenshot)
const TOTAL_LABEL_STYLE: CSSProperties = { background: "var(--color-bg-hover)" };
const TOTAL_ROW_STYLE: CSSProperties = { position: "sticky", bottom: 0 };

// Row colour per game status; only "เปิดใช้งาน" rows were captured
const ROW_CLASS: Record<GameStatus, string> = {
  active: "color-tr-status-emerald-success",
  inactive: "color-tr-status-emerald-danger",
  expired: "color-tr-status-emerald-warning",
};

export function GameStatusBadge({ status }: { status: GameStatus }) {
  const t = useT();
  // Same markup as the original #status-badgeIcon templates (page script): only "active" has no colour classes
  if (status === "inactive") {
    return (
      <span className="custom-badge-status text-red-50 bg-red-5">
        <BadgeOffIcon />
        <span>{t("reportPromotionMinigame.off", "ปิดใช้งาน")}</span>
      </span>
    );
  }
  if (status === "expired") {
    return (
      <span className="custom-badge-status text-gray-30 bg-gray-5">
        <ExpiredBadgeIcon />
        <span>{t("reportPromotionMinigame.expired", "หมดอายุ")}</span>
      </span>
    );
  }
  return (
    <span className="custom-badge-status">
      <BadgeOnIcon />
      <span>{t("reportPromotionMinigameTable.text19", "เปิดใช้งาน")}</span>
    </span>
  );
}

// Summary state of #promotionTable: two-row header with colour-coded column groups, one row per
// mini-game (click = drill-down) and the "ยอดรวมทั้งหมด" row.
export function SummaryTable({ rows, totals, onOpen, tooltip }: SummaryTableProps) {
  const t = useT();
  const total = (value: string, align = "text-center", extra = "") => (
    <td className={`${align} color-bg-last-row p-0 ${extra}`.trim()}>
      <div className="session-custom-last-row color">{value}</div>
    </td>
  );

  return (
    <div className="table-scrollable">
      <table>
        <thead className="color-th-report-theme-emerald">
          <tr>
            <th rowSpan={2}>{t("reportPromotionMinigameTable.text4", "ชื่อมินิเกมส์")}</th>
            <th rowSpan={2} className="text-center">
              {t("reportPromotionMinigameTable.text5", "สถานะเกมส์")}
            </th>
            <th colSpan={2} className="w-0 text-center th-0">
              <span className="custom-badge bg-blue-10 w-100">{t("reportPromotionMinigameTable.text6", "จำนวนการแจกและรับโปร(คน)")}</span>
            </th>
            <th colSpan={2} className="w-0 text-center th-0 pb-1">
              <span className="custom-badge bg-orange-5 w-100">{t("reportPromotionMinigameTable.text7", "จำนวนการใช้สิทธิ์ (ครั้ง)")}</span>
            </th>
            <th colSpan={5} className="w-0 text-center th-0 pb-1 pe-0">
              <span className="custom-badge bg-green-0 w-100">{t("reportPromotionMinigameTable.text8", "จำนวนโบนัสที่ลูกค้าได้รับ")}</span>
            </th>
            <th rowSpan={2} className="w-0"></th>
          </tr>
          <tr>
            <th className="text-center w-0 pt-0 px-3">
              <span className="custom-badge bg-blue-15 text-black w-100">{t("reportPromotionMinigameTable.text10", "คนมีสิทธิ์รับ")}</span>
            </th>
            <th className="text-center w-0 pt-0 px-3">
              <span className="custom-badge bg-blue-50 text-white w-100">{t("reportPromotionMinigameTable.text11", "คนที่รับโปร")}</span>
            </th>
            <th className="text-center w-0 pt-0 px-3">
              <span className="custom-badge bg-orange-15 text-black w-100">{t("reportPromotionMinigameTable.text12", "ใช้ได้ทั้งหมด")}</span>
            </th>
            <th className="text-center w-0 pt-0 ps-3">
              <span className="custom-badge bg-orange-50 text-white w-100">{t("reportPromotionMinigameTable.text13", "ใช้ไปทั้งหมด")}</span>
            </th>
            <th className="text-center w-0 pt-0 pe-1 ps-3">
              <span className="custom-badge bg-green-60 text-white w-100">{t("reportPromotionMinigameTable.text14", "เครดิต (฿)")}</span>
            </th>
            <th className="text-center w-0 pe-0 pt-0 ps-1">
              <span className="custom-badge badge-start bg-green-20">{t("reportPromotionMinigameTable.text15", "สิทธิ์มินิเกมส์")}</span>
            </th>
            <th className="text-center w-0 ps-0 pt-0 pe-1">
              <span className="custom-badge badge-divider badge-end bg-green-20">{t("reportPromotionMinigameTable.text16", "สิทธิ์แทงหวย")}</span>
            </th>
            <th className="text-center w-0 pe-0 pt-0 ps-1">
              <span className="custom-badge badge-start bg-green-10">{t("reportPromotionMinigameTable.text17", "แต้มสะสม")}</span>
            </th>
            <th className="text-center w-0 ps-0 pt-0 pe-0">
              <span className="custom-badge badge-divider badge-end bg-green-10" style={{ "--badge-divider-color": "#226F67" } as CSSProperties}>
                {t("reportPromotionMinigameTable.text18", "ของรางวัล")}
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="color-text-tbody-theme-emerald">
          {rows.map((row) => (
            <tr key={row.id} className={ROW_CLASS[row.status]} onClick={() => onOpen(row)}>
              <td>
                <div className="white-space-normal word-break-word" style={NAME_STYLE}>
                  {row.name}
                </div>
              </td>
              <td className="text-center">
                <GameStatusBadge status={row.status} />
              </td>
              <td className="text-center">{row.eligiblePeople}</td>
              <td className="text-center text-blue-50">{row.receivedPeople}</td>
              <td className="text-center">{row.usableTimes}</td>
              <td className="text-center text-orange-50">{row.usedTimes}</td>
              <td className="text-end pe-1">
                <span className="custom-badge-pill p2 w-100">
                  <span className="w-100">{row.credit}</span>
                </span>
              </td>
              <td className="text-center">{row.minigameRights}</td>
              <td className="text-center">{row.lottoRights}</td>
              <td className="text-center">{row.points}</td>
              <td className="text-center">{row.rewards}</td>
              {/* Collapsed in the capture; the eye + "รายละเอียด" tooltip are in the screenshots. The click bubbles to the row. */}
              <td className="text-center">
                <button
                  data-bs-toggle="tooltip"
                  className="system-action action-square action-outline action-info"
                  aria-label="รายละเอียด"
                  data-bs-original-title="รายละเอียด"
                  onMouseEnter={(event) => tooltip.show(event.currentTarget, "รายละเอียด")}
                  onMouseLeave={tooltip.hide}
                >
                  <EyeIcon />
                </button>
              </td>
            </tr>
          ))}
          <tr className="tr-summary tr-height no-hover td-last-summary-thmem-emerald" style={TOTAL_ROW_STYLE}>
            <td colSpan={2} className="tdx-0 dna">
              <div className="td-summary session-custom-last-row" style={TOTAL_LABEL_STYLE}>
                ยอดรวมทั้งหมด
              </div>
            </td>
            {total(totals.eligiblePeople)}
            {total(totals.receivedPeople, "text-center", "text-blue-50")}
            {total(totals.usableTimes)}
            {total(totals.usedTimes, "text-center", "text-orange-50")}
            {total(totals.credit, "text-end")}
            {total(totals.minigameRights)}
            {total(totals.lottoRights)}
            {total(totals.points)}
            {total(totals.rewards)}
            <td className="color-bg-last-row p-0">
              <div className="session-custom-last-row color"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
