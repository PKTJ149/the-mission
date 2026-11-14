"use client";

import { useT } from "@/lib/i18n";
import type { RewardReportRow, Rewards } from "@/lib/api/mission-reports";
import { DateTimeCell, MakerBadge, RewardCells, RewardHead, SummaryRow, TEXT_COLUMN_STYLE, TypeBadge } from "./report-cells";

// The reward entries of one mission (/mission/report-mission-by-mission/<id>): ภารกิจ, วันที่รับรางวัล,
// ชื่อสมาชิก, ประเภท, the reward group, ผู้ทำรายการ and a totals row. Also used by the by-reward /
// by-member pages when their mock rows are switched on (their populated markup was never captured).
export function MissionEntriesTable({ rows, summary }: { rows: RewardReportRow[]; summary: Rewards }) {
  const t = useT();
  return (
    <table>
      <RewardHead
        ns="missionReportPage"
        leading={
          <>
            <th rowSpan={2} className="w-0 mission-page">
              {t("missionReportPage.mission", "ภารกิจ")}
            </th>
            <th rowSpan={2} className="w-0 mission-page">
              {t("missionReportPage.rewardGetDate", "วันที่รับรางวัล")}
            </th>
            <th rowSpan={2} className="w-0 mission-page">
              {t("missionReportPage.memberName", "ชื่อสมาชิก")}
            </th>
            <th rowSpan={2} className="text-center mission-page">
              {t("missionReportPage.type", "ประเภท")}
            </th>
          </>
        }
        trailing={
          <th rowSpan={2} className="w-0 text-center mission-page">
            {t("missionReportPage.editedUser", "ผู้ทำรายการ")}
          </th>
        }
      />
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>
              <div className="white-space-normal" style={TEXT_COLUMN_STYLE}>
                {row.missionText}
              </div>
            </td>
            <DateTimeCell date={row.date} time={row.time} />
            <td>
              <div className="white-space-normal" style={TEXT_COLUMN_STYLE}>
                {row.memberName}
              </div>
            </td>
            <td className="text-center">
              <TypeBadge type={row.type} />
            </td>
            <RewardCells rewards={row} />
            <td className="text-center">
              <MakerBadge maker={row.maker} />
            </td>
          </tr>
        ))}
        <SummaryRow
          colSpan={4}
          summary={summary}
          label={<div className="td-summary p1 fw-700 text-center">{t("missionReportByMissionPage.allSummary", "ยอดรวมทั้งหมด")}</div>}
        />
      </tbody>
    </table>
  );
}
