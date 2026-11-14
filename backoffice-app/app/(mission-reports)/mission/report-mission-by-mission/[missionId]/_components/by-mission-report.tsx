"use client";

import { EmptyState, FilterDropdown, TableLoading } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { getMissionRewardReport, type MissionOption, type RewardFilters, type RewardReportRow, type Rewards } from "@/lib/api/mission-reports";
import { MissionEntriesTable } from "../../../_components/mission-entries-table";
import { FilterGradientDefs } from "../../../_components/report-cells";
import { CATEGORY_ITEMS, DateSummaryColumn, missionItems, SearchColumn } from "../../../_components/report-filters";
import { CategoryFilterIcon, MissionFilterIcon } from "../../../_components/report-icons";
import { useReportTable } from "../../../_components/use-report-table";

type ByMissionReportProps = {
  missionId: string;
  missions: MissionOption[];
  initialData: { rows: RewardReportRow[]; summary: Rewards };
};

const INITIAL_FILTERS: RewardFilters = { search: "", dates: null, missionId: null, category: null, maker: null };
const NS = "missionReportByMissionPage";

// /mission/report-mission-by-mission/<missionId> — every reward entry of one mission
// (mission name link on /mission/report-mission). ORIGINAL: titled "สรุปรายงานรายสมาชิก", no mission name.
export function ByMissionReport({ missionId, missions, initialData }: ByMissionReportProps) {
  const t = useT();
  const table = useReportTable((filters: RewardFilters) => getMissionRewardReport(missionId, filters), INITIAL_FILTERS, initialData);
  const { filters, data, loading } = table;
  const all = t(`${NS}.all`, "ทั้งหมด");

  return (
    <div className="page-content">
      <div className="container-fluid full-container">
        <FilterGradientDefs />
        <div className="inner-container full-flex">
          <div className="custom-card full-card full-flex">
            <div className="w-title">
              <h4 className="mb-0">สรุปรายงานรายสมาชิก</h4>
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
                  id="filterMission"
                  dropdownId="dropdownFilterMission"
                  icon={<MissionFilterIcon />}
                  title={t(`${NS}.mission`, "ภารกิจ")}
                  titleClassName="mission-page"
                  defaultText={all}
                  valueClassName="mission-page"
                  stretch
                  items={missionItems(missions, { value: "", label: all, className: "mission-page" })}
                  value={filters.missionId}
                  onChange={(value) => table.update({ missionId: value })}
                />
              </div>
              <div className="col-auto">
                <FilterDropdown
                  id="filterCategory"
                  dropdownId="dropdownFilterCategory"
                  icon={<CategoryFilterIcon />}
                  title={t(`${NS}.type`, "ประเภท")}
                  titleClassName="mission-page"
                  defaultText={all}
                  valueClassName="mission-page"
                  stretch
                  items={[{ value: "all", label: all, className: "mission-page" }, ...CATEGORY_ITEMS]}
                  value={filters.category}
                  onChange={(category) => table.update({ category })}
                />
              </div>
            </div>
            <div id="reportMissionByMemberTable" className="mission-report-table system-table table-full">
              <TableLoading show={loading} titleKey={`${NS}.findingData`} textKey={`${NS}.findingDataText`} textClassName="mission-page" />
              {!loading && (
                <div className="table-scrollable">
                  {data.rows.length === 0 ? <EmptyState /> : <MissionEntriesTable rows={data.rows} summary={data.summary} />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
