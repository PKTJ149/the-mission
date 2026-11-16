"use client";

import type { CSSProperties, MouseEvent } from "react";
import { cx } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { RightsRow } from "@/lib/api/minigame-reports";
import { LabelChevronIcon } from "@/app/(minigame-reports)/_components/report-icons";
import { BonusCells, CategoryCell, CustomerCell, MakeByCell, RIGHTS_STATUS, StatusInfo } from "@/app/(minigame-reports)/_components/rights-cells";
import type { useTooltip } from "@/app/(minigame-reports)/_components/tooltip";

type HistoryTableProps = {
  rows: RightsRow[];
  openStatusRowId: string | null; // row whose change-status dropdown is open
  onStatusClick: (event: MouseEvent<HTMLSpanElement>, row: RightsRow) => void; // openDropdownChangeStatus(this, '', id)
  onSearchCustomer: (username: string) => void;
  tooltip: ReturnType<typeof useTooltip>;
};

// Inline values set by the original JS (not captured): measured on staging at 1704px
// (credit column 142px = 122px pill + padding; the table is then 1425px wide and scrolls like staging)
const CREDIT_STYLE: CSSProperties = { minWidth: "142px" };
const NAME_STYLE: CSSProperties = { width: "210px" };

export function HistoryTable({ rows, openStatusRowId, onStatusClick, onSearchCustomer, tooltip }: HistoryTableProps) {
  const t = useT();

  return (
    <div className="table-scrollable">
      <table>
        <thead className="color-th-report-theme-emerald">
          <tr>
            <th rowSpan={2} className="w-0">
              {t("reportMiniGameHistory.text1", "วันที่ได้สิทธิ์รับโปร")}
            </th>
            <th rowSpan={2} className="text-center w-0">
              {t("reportMiniGameHistory.text2", "ลูกค้า (ยูสเซอร์เนม)")}
            </th>
            <th rowSpan={2} className="w-0">
              {t("reportMiniGameHistory.text3", "ชื่อโปรโมชั่น")}
            </th>
            <th rowSpan={2} className="text-center">
              {t("reportMiniGameHistory.text4", "ประเภท")}
            </th>
            <th colSpan={5} className="text-center th-0 pb-1 pe-0">
              <span className="custom-badge bg-green-0 w-100">{t("reportMiniGameHistory.text5", "จำนวนโบนัสที่ลูกค้าได้รับ")}</span>
            </th>
            <th rowSpan={2} className="w-0 text-center">
              {t("reportMiniGameHistory.text6", "สถานะ")}
            </th>
            <th rowSpan={2} className="w-0 text-center">
              {t("reportMiniGameHistory.text7", "ผู้ทำรายการ")}
            </th>
          </tr>
          <tr>
            <th className="text-center pt-0 pe-1 ps-3" style={CREDIT_STYLE}>
              <span className="custom-badge bg-green-60 text-white w-100">{t("reportMiniGameHistory.text8", "เครดิต (฿)")}</span>
            </th>
            <th className="text-center w-0 pe-0 pt-0 ps-1">
              <span className="custom-badge badge-start bg-green-20">{t("reportMiniGameHistory.text9", "สิทธิ์มินิเกมส์")}</span>
            </th>
            <th className="text-center w-0 ps-0 pt-0 pe-1">
              <span className="custom-badge badge-divider badge-end bg-green-20">{t("reportMiniGameHistory.text10", "สิทธิ์แทงหวย")}</span>
            </th>
            <th className="text-center w-0 pe-0 pt-0 ps-1">
              <span className="custom-badge badge-start bg-green-10">{t("reportMiniGameHistory.text11", "แต้มสะสม")}</span>
            </th>
            <th className="text-center w-0 ps-0 pt-0 pe-0">
              <span className="custom-badge badge-divider badge-end bg-green-10" style={{ "--badge-divider-color": "#8CE6C6" } as CSSProperties}>
                {t("reportMiniGameHistory.text12", "ของรางวัล")}
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="color-text-tbody-theme-emerald">
          {rows.map((row) => {
            const status = RIGHTS_STATUS[row.status];
            // Only "รอใช้โปร" (and "ใช้โปรแล้ว", which has its own dropdown) can still be changed
            const changeable = row.status === "waiting" || row.status === "accept";
            return (
              <tr key={row.id} className={`color-tr-status-emerald-detail-mini-game-${status.row}`}>
                <td>{row.date}</td>
                <CustomerCell row={row} onSearch={onSearchCustomer} />
                <td>
                  <div className="white-space-normal word-break-word" style={NAME_STYLE}>
                    {row.gameName}
                  </div>
                </td>
                <CategoryCell category={row.category} />
                <BonusCells row={row} />
                <td className="text-center">
                  {changeable ? (
                    <span
                      className={cx(
                        // Staging's markup differs per status (class order, align-middle, no promotion-deposit-change-status)
                        row.status === "waiting"
                          ? `promotion-deposit-change-status system-label label-xs ${status.label} label-hover label-dropdown`
                          : `system-label ${status.label} label-xs align-middle label-hover label-dropdown`,
                        openStatusRowId === row.id && "dropdown-show dropdown-fill",
                      )}
                      onClick={(event) => onStatusClick(event, row)}
                    >
                      {/* The label says "ใช้แล้ว" (text13) while the (i) tooltip says "ใช้โปรแล้ว" */}
                      <span>{row.status === "waiting" ? t("reportMiniGameHistory.text14", status.text) : t("reportMiniGameHistory.text13", "ใช้แล้ว")}</span>
                      <span className="label-icon ms-1">
                        <LabelChevronIcon />
                      </span>
                    </span>
                  ) : (
                    <span className={`system-label ${status.label} label-xs align-middle`}>{status.text}</span>
                  )}
                  <StatusInfo row={row} tooltip={tooltip} rowTag={row.status === "accept" ? "span" : "div"} />
                </td>
                <MakeByCell makeBy={row.makeBy} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
