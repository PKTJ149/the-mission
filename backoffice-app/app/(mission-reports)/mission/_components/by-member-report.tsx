"use client";

import { EmptyState, FilterDropdown, TableLoading } from "@/components/ui";
import {
  getMissionMemberReport,
  type MissionOption,
  type RewardFilters,
  type RewardReportRow,
  type Rewards,
} from "@/lib/api/mission-reports";
import { MissionEntriesTable } from "./mission-entries-table";
import { FilterGradientDefs } from "./report-cells";
import { CATEGORY_ITEMS, DateSummaryColumn, missionItems, SearchColumn } from "./report-filters";
import { CategoryFilterIcon, MissionFilterIcon } from "./report-icons";
import { useReportTable } from "./use-report-table";

type ByMemberReportProps = {
  id: string; // mission or sub-mission id from the URL
  missions: MissionOption[];
  initialData: { rows: RewardReportRow[]; summary: Rewards };
};

const INITIAL_FILTERS: RewardFilters = { search: "", dates: null, missionId: null, category: null, maker: null };

// /mission/report-mission-by-reward/<id> and /mission/report-mission-by-member/<id> (the two count
// links on /mission/report-mission). ORIGINAL: both pages are byte-identical, call the same endpoint
// and only ever showed the empty state; their texts are plain Thai (no i18n keys).
// Rows only appear when SHOW_MOCK_BY_MEMBER_ROWS is switched on in lib/mock/mission-reports.ts.
export function ByMemberReport({ id, missions, initialData }: ByMemberReportProps) {
  const table = useReportTable((filters: RewardFilters) => getMissionMemberReport(id, filters), INITIAL_FILTERS, initialData);
  const { filters, data, loading } = table;

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
              <SearchColumn placeholder="ค้นหาโปรโมชั่น" onSearch={(search) => table.update({ search })} />
              <DateSummaryColumn title="วันที่สรุป" onChange={(dates) => table.update({ dates })} />
              <div className="col-auto">
                <FilterDropdown
                  id="filterMission"
                  dropdownId="dropdownFilterMission"
                  icon={<MissionFilterIcon />}
                  title="ภารกิจ :"
                  defaultText="ทั้งหมด"
                  stretch
                  items={missionItems(missions, { value: "", label: "ทั้งหมด" })}
                  value={filters.missionId}
                  onChange={(missionId) => table.update({ missionId })}
                />
              </div>
              <div className="col-auto">
                <FilterDropdown
                  id="filterCategory"
                  dropdownId="dropdownFilterCategory"
                  icon={<CategoryFilterIcon />}
                  title="ประเภท :"
                  defaultText="ทั้งหมด"
                  stretch
                  items={[{ value: "", label: "ทั้งหมด" }, ...CATEGORY_ITEMS]}
                  value={filters.category}
                  onChange={(category) => table.update({ category })}
                />
              </div>
            </div>
            <div id="reportMissionByMemberTable" className="mission-report-table system-table table-full">
              <TableLoading show={loading} />
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
