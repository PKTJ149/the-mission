"use client";

import { EmptyState, FilterDropdown, TableLoading } from "@/components/ui";
import { useT } from "@/lib/i18n";
import {
  getMissionReport,
  type MissionOption,
  type MissionReportFilters,
  type MissionReportRow,
  type MissionStatus,
  type Rewards,
} from "@/lib/api/mission-reports";
import { CreditPill, FilterGradientDefs, RewardHead, TEXT_COLUMN_STYLE } from "../../_components/report-cells";
import { DateSummaryColumn, missionItems, SearchColumn } from "../../_components/report-filters";
import { ActiveStatusIcon, DeletedStatusIcon, ExpiredStatusIcon, MissionFilterIcon, MissionStatusFilterIcon } from "../../_components/report-icons";
import { useReportTable } from "../../_components/use-report-table";

type Summary = Rewards & { rewardCount: number; memberCount: number };

type MissionReportProps = {
  missions: MissionOption[];
  initialData: { rows: MissionReportRow[]; summary: Summary };
};

const INITIAL_FILTERS: MissionReportFilters = { search: "", dates: null, status: null, missionId: null };
const NS = "missionReportByMissionPage";

// Row background per mission status (active rows have no class)
const ROW_CLASS: Record<MissionStatus, string | undefined> = {
  online: undefined,
  offline: undefined, // no offline mission on staging (guess)
  expired: "bg-red-950",
  deleted: "bg-black",
};

// /mission/report-mission — สรุปรายงานรายภารกิจ: each mission row followed by its sub-mission rows
export function MissionReport({ missions, initialData }: MissionReportProps) {
  const t = useT();
  const table = useReportTable(getMissionReport, INITIAL_FILTERS, initialData);
  const { filters, data, loading } = table;

  const statusItems = [
    { value: "all", label: t(`${NS}.all`, "ทั้งหมด") },
    { value: "online", label: t(`${NS}.active`, "ใช้งานอยู่") },
    { value: "offline", label: t(`${NS}.deactive`, "ปิดการใช้งาน") },
    { value: "expired", label: t(`${NS}.expired`, "หมดอายุ") },
    { value: "deleted", label: t(`${NS}.delete`, "ถูกลบ") },
  ];
  const rewardCountHead = (
    <th rowSpan={2} className="w-0 text-center">
      <span className="mission-page">{t(`${NS}.getReward`, "รับรางวัล")}</span>
      <br />
      <span className="mission-page">{t(`${NS}.count`, "(ครั้ง)")}</span>
    </th>
  );

  return (
    <div className="page-content">
      <div className="container-fluid full-container">
        <FilterGradientDefs />
        <div className="inner-container full-flex">
          <div className="custom-card full-card full-flex">
            <div className="w-title">
              <h4 className="mb-0 mission-page">{t(`${NS}.title`, "สรุปรายงานรายภารกิจ")}</h4>
            </div>
            <div className="row align-items-center gx-2 mb-3">
              <SearchColumn onSearch={(search) => table.update({ search })} />
              <DateSummaryColumn
                title={t(`${NS}.dateReport`, "วันที่สรุป")}
                titleClassName="mission-page"
                onChange={(dates) => table.update({ dates })}
              />
              <div className="col-auto">
                <FilterDropdown
                  id="filterStatus"
                  dropdownId="dropdownFilterStatus"
                  icon={<MissionStatusFilterIcon />}
                  // ORIGINAL: the status pill's title reuses the key "dateReport", so it reads "วันที่สรุป"
                  // (missionStatus "สถานะภารกิจ :" exists but is not used)
                  title={t(`${NS}.dateReport`, "วันที่สรุป")}
                  defaultText="All"
                  stretch
                  items={statusItems}
                  value={filters.status}
                  onChange={(status) => table.update({ status })}
                />
              </div>
              <div className="col-auto">
                <FilterDropdown
                  id="filterMission"
                  dropdownId="dropdownFilterMission"
                  icon={<MissionFilterIcon />}
                  title={t(`${NS}.mission`, "ภารกิจ")}
                  defaultText={t(`${NS}.all`, "ทั้งหมด")}
                  stretch
                  items={missionItems(missions, { value: "all", label: t(`${NS}.all`, "ทั้งหมด") })}
                  value={filters.missionId}
                  onChange={(missionId) => table.update({ missionId })}
                />
              </div>
            </div>
            <div id="reportTable" className="mission-report-table system-table table-full">
              <TableLoading show={loading} titleKey={`${NS}.findingData`} textKey={`${NS}.findingDataText`} />
              {!loading && (
                <div className="table-scrollable">
                  {data.rows.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <table>
                      <RewardHead
                        ns={NS}
                        flushEnd={false}
                        leading={
                          <>
                            <th rowSpan={2} className="w-0 mission-page">
                              {t(`${NS}.missionDuration`, "ระยะเวลาภารกิจ")}
                            </th>
                            <th rowSpan={2} className="w-0 mission-page">
                              {t(`${NS}.name`, "ชื่อ")}
                            </th>
                            <th rowSpan={2} className="w-0 text-center mission-page">
                              {t(`${NS}.status`, "สถานะ")}
                            </th>
                            {rewardCountHead}
                            {rewardCountHead}
                          </>
                        }
                      />
                      <tbody>
                        {data.rows.map((row) => (
                          <MissionRow key={row.id} row={row} />
                        ))}
                        <MissionSummaryRow summary={data.summary} />
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

function MissionRow({ row }: { row: MissionReportRow }) {
  // Mission rows link to by-mission with ?isMission=true, sub-mission rows send ?isMission=false
  const query = `?isMission=${row.isMission}`;
  return (
    <tr className={ROW_CLASS[row.status]}>
      {row.isMission ? <td>{row.duration}</td> : <td className="submission-divider"></td>}
      <td>
        {row.isMission ? (
          <div className="white-space-normal text-teal-green-300" style={TEXT_COLUMN_STYLE}>
            <a className="title-header" data-key="#" href={`/mission/report-mission-by-mission/${row.id}`}>
              {row.name}
            </a>
          </div>
        ) : (
          <div className="white-space-normal" style={TEXT_COLUMN_STYLE}>
            {row.name}
          </div>
        )}
      </td>
      <td>
        <StatusBadge status={row.status} />
      </td>
      <td className="text-center text-teal-500">
        <a className="title-header" data-key="#" href={`/mission/report-mission-by-reward/${row.id}${query}`}>
          <span className="p1 fw-700">{row.rewardCount}</span>
        </a>
      </td>
      <td className="text-center text-teal-500">
        <a className="title-header" data-key="#" href={`/mission/report-mission-by-member/${row.id}${query}`}>
          <span className="p1 fw-700">{row.memberCount}</span>
        </a>
      </td>
      <td>
        <CreditPill>{row.credit}</CreditPill>
      </td>
      <td className="text-end">{row.minigameRights}</td>
      <td className="text-end">{row.promotionRights}</td>
      <td className="text-end">{row.points}</td>
      <td className="text-end">{row.other}</td>
    </tr>
  );
}

function StatusBadge({ status }: { status: MissionStatus }) {
  const t = useT();
  if (status === "expired") {
    return (
      <span className="custom-badge-status text-red-600 bg-red-200 br-red-600">
        <ExpiredStatusIcon />
        <span className="mission-page">{t(`${NS}.expired`, "หมดอายุ")}</span>
      </span>
    );
  }
  if (status === "deleted") {
    return (
      <span className="custom-badge-status text-grey-200 bg-base-black br-grey-200">
        <DeletedStatusIcon />
        <span className="mission-page">{t(`${NS}.delete`, "ถูกลบ")}</span>
      </span>
    );
  }
  if (status === "offline") {
    // No offline mission on staging: grey badge + toggle icon is a guess
    return (
      <span className="custom-badge-status text-grey-200 bg-base-black br-grey-200">
        <ActiveStatusIcon />
        <span className="mission-page">{t(`${NS}.deactive`, "ปิดการใช้งาน")}</span>
      </span>
    );
  }
  return (
    <span className="custom-badge-status text-teal-500 bg-teal-100 br-teal-500">
      <ActiveStatusIcon />
      <span className="mission-page">{t(`${NS}.active`, "ใช้งานอยู่")}</span>
    </span>
  );
}

// Sticky "ยอดรวมทั้งหมด" row (its own markup, unlike the entry tables' totals row)
function MissionSummaryRow({ summary }: { summary: Summary }) {
  const t = useT();
  return (
    // position/bottom were set inline (values not captured; sticky at the bottom is a guess)
    <tr className="tr-summary tr-height no-hover td-last-summary-thmem-emerald" style={{ position: "sticky", bottom: "0px" }}>
      <td colSpan={3} className="summary-background tdx-0">
        <div className="td-summary p1 fw-700 text-center mission-page">{t(`${NS}.allSummary`, "ยอดรวมทั้งหมด")}</div>
      </td>
      <td className="text-center color-bg-last-row p-0 text-blue-50 fw-700">
        <div className="session-custom-last-row color">
          <span className="p1 fw-700">{summary.rewardCount}</span>
        </div>
      </td>
      <td className="text-center color-bg-last-row p-0 text-blue-50 fw-700">
        <div className="session-custom-last-row color">
          <span className="p1 fw-700">{summary.memberCount}</span>
        </div>
      </td>
      <td className="text-end color-bg-last-row p-0 fw-700">
        <div className="p-2 session-custom-last-row color justify-content-end">
          <CreditPill>{summary.credit}</CreditPill>
        </div>
      </td>
      <td className="text-end color-bg-last-row p-0 fw-700">
        <div className="p-2 session-custom-last-row color justify-content-end">
          <span className="p2 w-100 justify-content-end">{summary.minigameRights}</span>
        </div>
      </td>
      <td className="text-end color-bg-last-row p-0">
        <div className="p-2 session-custom-last-row color justify-content-end">{summary.promotionRights}</div>
      </td>
      <td className="text-end color-bg-last-row p-0">
        <div className="p-2 session-custom-last-row color justify-content-end">{summary.points}</div>
      </td>
      <td className="text-end color-bg-last-row p-0">
        <div className="p-2 session-custom-last-row color justify-content-center">{summary.other}</div>
      </td>
    </tr>
  );
}
