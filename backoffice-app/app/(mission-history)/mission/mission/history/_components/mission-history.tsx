"use client";
/* eslint-disable @next/next/no-img-element -- original markup: plain <img> icon */

import { DateRangeFilter, EmptyState, Pagination, SearchInput, TableLoading } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { getMissionHistory, type MissionHistoryFilters, type MissionHistoryRow } from "@/lib/api/mission-reports";
// Shared with the mission report pages (same icon, gradient and table behaviour)
import { FilterGradientDefs, SEARCH_COLUMN_STYLE } from "@/app/(mission-reports)/mission/_components/report-cells";
import { ReportCalendarIcon } from "@/app/(mission-reports)/mission/_components/report-icons";
import { useReportTable } from "@/app/(mission-reports)/mission/_components/use-report-table";

type Filters = MissionHistoryFilters & { offset: number; limit: number };

const INITIAL_FILTERS: Filters = { search: "", dates: null, offset: 0, limit: 10 };

// Inline values from page.styles.json
const DARK_BG = { backgroundColor: "rgb(21, 21, 21)" };
const BODY_STYLE = { color: "rgb(255, 255, 255)", backgroundColor: "rgb(21, 21, 21)" };

// /mission/mission/history — ประวัติการแก้ไข of the missions ("ประวัติการแก้ไข" button on /mission).
// Plain back-office styling: this page loads neither IBM Plex nor mission.css (inline style D only).
export function MissionHistory({ initialData }: { initialData: { rows: MissionHistoryRow[]; total: number } }) {
  const t = useT();
  const table = useReportTable(getMissionHistory, INITIAL_FILTERS, initialData);
  const { filters, data, loading } = table;
  const filter = (patch: Partial<Filters>) => table.update({ ...patch, offset: 0 });

  return (
    <div className="page-content">
      <div className="container-fluid full-container font-set">
        <FilterGradientDefs className="" />
        <div className="inner-container full-flex">
          <div className="custom-card full-card full-flex">
            <div className="title-header-custom-mission flex">
              <h4 className="mb-0">{t("missionHistoryPage.missionSetting", "ตั้งค่าภารกิจ")}</h4>
              <div className="flex title-header title-margin">
                <img src="/assets/images/mission/purpose.png" alt="" />
                <a className="title-header" data-key="#" href="/mission">
                  <span className="mission-page">{t("missionHistoryPage.missionListName", "รายชื่อภารกิจ")}</span> &gt;{" "}
                </a>
                <span className="mission-page">{t("missionHistoryPage.history", "ประวัติการแก้ไข")}</span>
              </div>
            </div>
            <div className="row align-items-center gx-2 mb-3">
              <div className="col-auto" style={SEARCH_COLUMN_STYLE}>
                <SearchInput id="tableSearch" placeholder="Search" clearId="clearValueMissionHistorySearch" onSearch={(search) => filter({ search })} />
              </div>
              <div className="col-auto">
                <DateRangeFilter
                  id="filterDateSummary"
                  inputId="datepickerDateSummary"
                  title={t("missionHistoryPage.editDate", "วันที่แก้ไข")}
                  titleClassName="mission-page"
                  icon={<ReportCalendarIcon />}
                  onChange={(dates) => {
                    if (dates.length === 2) filter({ dates: { from: dates[0], to: dates[1] } });
                    else if (dates.length === 0) filter({ dates: null });
                  }}
                />
              </div>
              <div className="filter-fill"></div>
            </div>
            <div id="missionTable" className="promotion-deposit-table system-table table-full">
              <TableLoading show={loading} />
              {!loading && (
                <>
                  {/* ORIGINAL: a stray empty <tzr> element sits before the <table>; left out */}
                  <div className="table-scrollable" style={DARK_BG}>
                    {data.rows.length === 0 ? (
                      // Not captured on this page: the shared empty state with this page's keys
                      <EmptyState titleKey="missionHistoryPage.notFoundInfo" textKey="missionHistoryPage.notFoundInfoText" />
                    ) : (
                      <table>
                        <thead className="color-th-report-theme-emerald">
                          <tr>
                            <th className="w-0 mission-page" style={{ width: "10%" }}>
                              {t("missionHistoryPage.editDate", "วันที่แก้ไข")}
                            </th>
                            <th rowSpan={2} className="w-0 mission-page" style={{ width: "40%" }}>
                              {t("missionHistoryPage.editMission", "ภารกิจที่แก้ไข")}
                            </th>
                            <th rowSpan={2} className="w-0 mission-page" style={{ width: "40%" }}>
                              {t("missionHistoryPage.editDetail", "รายละเอียดการแก้ไข")}
                            </th>
                            <th className="w-0 text-center mission-page" style={{ width: "10%" }}>
                              {t("missionHistoryPage.editUser", "ผู้แก้ไข")}
                            </th>
                          </tr>
                        </thead>
                        <tbody style={BODY_STYLE}>
                          {data.rows.map((row, index) => (
                            <tr key={filters.offset + index} className="color-tr-status-emerald-detail-mini-game">
                              <td>{row.editDate}</td>
                              <td>
                                <span>{row.mission}</span>
                              </td>
                              <td>
                                <span>{row.detail}</span>
                              </td>
                              <td className="text-center">
                                <span className="system-badge badge-success-mission">{row.editor}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div style={DARK_BG}>
                    <Pagination
                      total={data.total}
                      offset={filters.offset}
                      limit={filters.limit}
                      onOffsetChange={(offset) => table.update({ offset })}
                      onLimitChange={(limit) => table.update({ limit, offset: 0 })}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
