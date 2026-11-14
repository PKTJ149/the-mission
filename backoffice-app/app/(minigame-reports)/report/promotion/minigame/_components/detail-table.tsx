"use client";

import type { CSSProperties } from "react";
import { useT } from "@/lib/i18n";
import type { RightsRow } from "@/lib/api/minigame-reports";
import { BonusCells, CategoryCell, CustomerCell, MakeByCell, RIGHTS_STATUS, StatusInfo } from "@/app/(minigame-reports)/_components/rights-cells";
import type { useTooltip } from "@/app/(minigame-reports)/_components/tooltip";

type DetailTableProps = {
  rows: RightsRow[];
  onSearchCustomer: (username: string) => void; // shortcutSearchCustomer(username)
  tooltip: ReturnType<typeof useTooltip>;
};

// Inline width of the credit header, read live at 1704px viewport (page_state-drilldown-per-member.styles.json)
const CREDIT_STYLE: CSSProperties = { width: "142px" };

// Drill-down state of #promotionTable: one row per right given to a member for the chosen mini-game.
export function DetailTable({ rows, onSearchCustomer, tooltip }: DetailTableProps) {
  const t = useT();

  return (
    <div className="table-scrollable">
      <table>
        <thead className="color-th-report-theme-emerald">
          <tr>
            <th rowSpan={2} className="w-0">
              {t("reportPromotionMinigameDetail.dateTimeGet", "วันที่ได้สิทธิ์รับโปร")}
            </th>
            <th rowSpan={2} className="w-0">
              {t("reportPromotionMinigameDetail.username", "ลูกค้า (ยูสเซอร์เนม)")}
            </th>
            <th rowSpan={2} className="w-0 text-center">
              {t("reportPromotionMinigameDetail.type", "ประเภท")}
            </th>
            <th colSpan={5} className="text-center th-0 pb-1 pe-0">
              <span className="custom-badge bg-green-0 w-100">{t("reportPromotionMinigameDetail.bonusAmount", "จำนวนโบนัสที่ลูกค้าได้รับ")}</span>
            </th>
            <th rowSpan={2} className="text-center w-0">
              {t("reportPromotionMinigameDetail.status", "สถานะ")}
            </th>
            <th rowSpan={2} className="text-center w-0">
              {t("reportPromotionMinigameDetail.createBy", "ผู้ทำรายการ")}
            </th>
          </tr>
          <tr>
            <th className="text-center pt-0 pe-1 ps-3" style={CREDIT_STYLE}>
              <span className="custom-badge bg-green-60 text-white w-100">{t("reportPromotionMinigameDetail.credit", "เครดิต (฿)")}</span>
            </th>
            <th className="text-center w-0 pe-0 pt-0 ps-1">
              <span className="custom-badge badge-start bg-green-20">{t("reportPromotionMinigameDetail.minigameCount", "สิทธิ์มินิเกมส์")}</span>
            </th>
            <th className="text-center w-0 ps-0 pt-0 pe-1">
              <span className="custom-badge badge-divider badge-end bg-green-20">{t("reportPromotionMinigameDetail.lottoCount", "สิทธิ์แทงหวย")}</span>
            </th>
            <th className="text-center w-0 pe-0 pt-0 ps-1">
              <span className="custom-badge badge-start bg-green-10">{t("reportPromotionMinigameDetail.points", "แต้มสะสม")}</span>
            </th>
            <th className="text-center w-0 ps-0 pt-0 pe-0">
              <span className="custom-badge badge-divider badge-end bg-green-10" style={{ "--badge-divider-color": "#8CE6C6" } as CSSProperties}>
                {t("reportPromotionMinigameDetail.reward", "ของรางวัล")}
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="color-text-tbody-theme-emerald">
          {rows.map((row) => {
            const status = RIGHTS_STATUS[row.status];
            return (
              <tr key={row.id} className={`no-hover color-tr-status-emerald-detail-mini-game-${status.row}`}>
                <td>{row.date}</td>
                <CustomerCell row={row} onSearch={onSearchCustomer} />
                <CategoryCell category={row.category} />
                <BonusCells row={row} />
                <td className="text-center">
                  <span className={`system-label ${status.label} label-xs align-middle`}>{status.text}</span>
                  <StatusInfo row={row} tooltip={tooltip} />
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
