"use client";

import { EmptyState, FilterDropdown, Pagination, TableLoading, useSystemPopup } from "@/components/ui";
import { useT } from "@/lib/i18n";
import {
  getMemberReport,
  type ManualMissionOption,
  type MissionOption,
  type RewardFilters,
  type RewardReportRow,
} from "@/lib/api/mission-reports";
import { DateTimeCell, FilterGradientDefs, MakerBadge, RewardCells, RewardHead, TEXT_COLUMN_STYLE, TypeBadge } from "../../_components/report-cells";
import { CATEGORY_ITEMS, DateSummaryColumn, MAKER_ITEMS, missionItems, SearchColumn } from "../../_components/report-filters";
import { CategoryFilterIcon, MakerFilterIcon, MissionFilterIcon } from "../../_components/report-icons";
import { useReportTable } from "../../_components/use-report-table";
import { ManualRewardPopup } from "./manual-reward-popup";

type Filters = RewardFilters & { offset: number; limit: number };

type MemberReportProps = {
  missions: MissionOption[];
  manualOptions: ManualMissionOption[];
  initialData: { rows: RewardReportRow[]; total: number };
};

const INITIAL_FILTERS: Filters = { search: "", dates: null, missionId: null, category: null, maker: null, offset: 0, limit: 10 };

// /mission/report — สรุปรายงานรายสมาชิก (one row per reward a member received)
export function MemberReport({ missions, manualOptions, initialData }: MemberReportProps) {
  const t = useT();
  const table = useReportTable(getMemberReport, INITIAL_FILTERS, initialData);
  const manualPopup = useSystemPopup();
  const { filters, data, loading } = table;

  const all = { value: "all", label: t("missionReportPage.all", "ทั้งหมด"), className: "mission-page" };
  // Any filter change starts again at page 1
  const filter = (patch: Partial<Filters>) => table.update({ ...patch, offset: 0 });

  return (
    <>
      <div className="page-content">
        <div className="container-fluid full-container">
          <FilterGradientDefs />
          <div className="inner-container full-flex">
            <div className="custom-card full-card full-flex">
              <div className="w-title">
                <h4 className="mb-0 mission-page">{t("missionReportPage.title", "สรุปรายงานรายสมาชิก")}</h4>
                <button className="btn system-btn btn-rounded manual mission-page" onClick={manualPopup.open}>
                  {t("missionReportPage.addRewardManual", "เพิ่มรางวัลให้สมาชิก​ (Manual)")}
                </button>
              </div>
              <div className="row align-items-center gx-2 mb-3">
                <SearchColumn onSearch={(search) => filter({ search })} />
                <DateSummaryColumn
                  title={t("missionReportPage.dateReport", "วันที่สรุป")}
                  titleClassName="mission-page"
                  onChange={(dates) => filter({ dates })}
                />
                <div className="col-auto">
                  <FilterDropdown
                    id="filterMission"
                    dropdownId="dropdownFilterMission"
                    icon={<MissionFilterIcon />}
                    title={t("missionReportPage.mission", "ภารกิจ")}
                    titleClassName="mission-page"
                    defaultText={t("missionReportPage.all", "ทั้งหมด")}
                    valueClassName="mission-page"
                    stretch
                    items={missionItems(missions, all)}
                    value={filters.missionId}
                    onChange={(missionId) => filter({ missionId })}
                  />
                </div>
                <div className="col-auto">
                  <FilterDropdown
                    id="filterCategory"
                    dropdownId="dropdownFilterCategory"
                    icon={<CategoryFilterIcon />}
                    title={t("missionReportPage.type", "ประเภท")}
                    titleClassName="mission-page"
                    defaultText={t("missionReportPage.all", "ทั้งหมด")}
                    valueClassName="mission-page"
                    stretch
                    items={[all, ...CATEGORY_ITEMS]}
                    value={filters.category}
                    onChange={(category) => filter({ category })}
                  />
                </div>
                <div className="col-auto">
                  <FilterDropdown
                    id="filterMakeBy"
                    dropdownId="dropdownFilterMakeBy"
                    icon={<MakerFilterIcon />}
                    title={t("missionReportPage.editedUser", "ผู้ทำรายการ")}
                    titleClassName="mission-page"
                    defaultText={t("missionReportPage.all", "ทั้งหมด")}
                    valueClassName="mission-page"
                    stretch
                    items={[all, ...MAKER_ITEMS]}
                    value={filters.maker}
                    onChange={(maker) => filter({ maker })}
                  />
                </div>
              </div>
              <div id="reportTable" className="mission-report-table system-table table-full">
                <TableLoading show={loading} />
                {!loading && (
                  <>
                    <div className="table-scrollable">
                      {data.rows.length === 0 ? (
                        // Not captured on this page: the empty state the drill-downs show
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
                                <th rowSpan={2} className="text-center w-0 mission-page">
                                  {t("missionReportPage.memberName", "ชื่อสมาชิก")}
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
                              <th rowSpan={2} className="w-0 text-center mission-page">
                                {t("missionReportPage.editedUser", "ผู้ทำรายการ")}
                              </th>
                            }
                          />
                          <tbody>
                            {data.rows.map((row) => (
                              <tr key={row.id}>
                                <DateTimeCell date={row.date} time={row.time} />
                                <td>
                                  <a className="title-header" data-key="#" href={`/mission/report-mission-member-detail/${row.memberId}`}>
                                    <span className="p2 text-teal-300 fw-700">{row.memberName}</span>
                                  </a>
                                </td>
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
                          </tbody>
                        </table>
                      )}
                    </div>
                    <Pagination
                      total={data.total}
                      offset={filters.offset}
                      limit={filters.limit}
                      onOffsetChange={(offset) => table.update({ offset })}
                      onLimitChange={(limit) => table.update({ limit, offset: 0 })}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ManualRewardPopup control={manualPopup} options={manualOptions} onSaved={table.refresh} />
    </>
  );
}
