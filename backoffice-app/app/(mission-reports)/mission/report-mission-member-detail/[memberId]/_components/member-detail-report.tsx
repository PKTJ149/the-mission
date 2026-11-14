"use client";

import { EmptyState, FilterDropdown, TableLoading } from "@/components/ui";
import { useT } from "@/lib/i18n";
import {
  getMemberDetailReport,
  type MissionOption,
  type RewardFilters,
  type RewardReportRow,
  type Rewards,
} from "@/lib/api/mission-reports";
import {
  DateTimeCell,
  FilterGradientDefs,
  MakerBadge,
  RewardCells,
  RewardHead,
  SummaryRow,
  TEXT_COLUMN_STYLE,
  TypeBadge,
} from "../../../_components/report-cells";
import { CATEGORY_ITEMS, DateSummaryColumn, MAKER_ITEMS, missionItems, SearchColumn } from "../../../_components/report-filters";
import { CategoryFilterIcon, MakerFilterIcon, MissionFilterIcon } from "../../../_components/report-icons";
import { useReportTable } from "../../../_components/use-report-table";

type MemberDetailReportProps = {
  memberId: string;
  missions: MissionOption[];
  initialData: { rows: RewardReportRow[]; summary: Rewards };
};

const INITIAL_FILTERS: RewardFilters = { search: "", dates: null, missionId: null, category: null, maker: null };

// /mission/report-mission-member-detail/<memberId> — the member report filtered to one member:
// no member column, no pager, a totals row, and nothing on the page says which member it is.
export function MemberDetailReport({ memberId, missions, initialData }: MemberDetailReportProps) {
  const t = useT();
  const table = useReportTable((filters: RewardFilters) => getMemberDetailReport(memberId, filters), INITIAL_FILTERS, initialData);
  const { filters, data, loading } = table;
  const all = t("missionReportPage.all", "ทั้งหมด");

  return (
    <div className="page-content">
      <div className="container-fluid full-container">
        <FilterGradientDefs />
        <div className="inner-container full-flex">
          <div className="custom-card full-card full-flex">
            <div className="w-title">
              <h4 className="mb-0 mission-page">{t("missionReportPage.title", "สรุปรายงานรายสมาชิก")}</h4>
              {/* ORIGINAL: no "manual" class and no #openModalManual on this page, so the button does nothing */}
              <button className="btn system-btn btn-rounded mission-page">
                {t("missionReportPage.addRewardManual", "เพิ่มรางวัลให้สมาชิก​ (Manual)")}
              </button>
            </div>
            <div className="row align-items-center gx-2 mb-3">
              <SearchColumn placeholder="search" onSearch={(search) => table.update({ search })} />
              <DateSummaryColumn
                title={t("missionReportPage.dateReport", "วันที่สรุป")}
                titleClassName="mission-page"
                onChange={(dates) => table.update({ dates })}
              />
              <div className="col-auto">
                <FilterDropdown
                  id="filterMission"
                  dropdownId="dropdownFilterMission"
                  icon={<MissionFilterIcon />}
                  title={t("missionReportPage.mission", "ภารกิจ")}
                  titleClassName="mission-page"
                  defaultText={all}
                  valueClassName="mission-page"
                  stretch
                  items={missionItems(missions, { value: "all", label: all, className: "mission-page" })}
                  value={filters.missionId}
                  onChange={(missionId) => table.update({ missionId })}
                />
              </div>
              <div className="col-auto">
                <FilterDropdown
                  id="filterCategory"
                  dropdownId="dropdownFilterCategory"
                  icon={<CategoryFilterIcon />}
                  title={t("missionReportPage.type", "ประเภท")}
                  titleClassName="mission-page"
                  defaultText={all}
                  valueClassName="mission-page"
                  stretch
                  items={[{ value: "all", label: "ทั้งหมด" }, ...CATEGORY_ITEMS]}
                  value={filters.category}
                  onChange={(category) => table.update({ category })}
                />
              </div>
              <div className="col-auto">
                <FilterDropdown
                  id="filterMakeBy"
                  dropdownId="dropdownFilterMakeBy"
                  icon={<MakerFilterIcon />}
                  title={t("missionReportPage.editedUser", "ผู้ทำรายการ")}
                  titleClassName="mission-page"
                  defaultText={all}
                  valueClassName="mission-page"
                  stretch
                  items={[{ value: "all", label: "All" }, ...MAKER_ITEMS]}
                  value={filters.maker}
                  onChange={(maker) => table.update({ maker })}
                />
              </div>
            </div>
            <div id="reportMemberTable" className="mission-report-table system-table table-full">
              <TableLoading
                show={loading}
                titleKey="missionReportPage.findingData"
                textKey="missionReportPage.findingDataText"
                textClassName="mission-page"
              />
              {!loading && (
                <div className="table-scrollable">
                  {data.rows.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <table>
                      <RewardHead
                        ns="missionReportPage"
                        leading={
                          <>
                            <th rowSpan={2} className="w-0 mission-page">
                              {t("missionReportPage.rewardGetDate", "วันที่รับรางวัล")}
                            </th>
                            <th rowSpan={2} className="w-0 mission-page">
                              {t("missionReportPage.mission", "ภารกิจ")}
                            </th>
                            <th rowSpan={2} className="text-center mission-page">
                              {t("missionReportPage.type", "ประเภท")}
                            </th>
                          </>
                        }
                        trailing={
                          <th rowSpan={2} className="w-0 text-center  mission-page">
                            {t("missionReportPage.editedUser", "ผู้ทำรายการ")}
                          </th>
                        }
                      />
                      <tbody>
                        {data.rows.map((row) => (
                          <tr key={row.id}>
                            <DateTimeCell date={row.date} time={row.time} />
                            <td>
                              <div className="white-space-normal" style={TEXT_COLUMN_STYLE}>
                                {row.missionText}
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
                          colSpan={3}
                          summary={data.summary}
                          label={<div className="td-summary p1 fw-700 text-center">ยอดรวมทั้งหมด</div>}
                        />
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
