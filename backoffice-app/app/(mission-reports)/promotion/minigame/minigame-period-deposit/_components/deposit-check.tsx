"use client";

import { useState } from "react";
import { DateRangeFilter, EmptyState, FilterDropdown, Pagination, SearchInput, TableLoading, type DropdownItem } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { getDepositCheckRows } from "@/lib/api/minigame-reports";
import { useTableRequest } from "@/app/(minigame-reports)/_components/use-table-request";
import { CalendarIcon, MakerIcon, TypeIcon } from "./deposit-icons";

type Query = { search: string; category: string | null; makeBy: string | null; dates: Date[]; offset: number; limit: number };

const INITIAL_QUERY: Query = { search: "", category: null, makeBy: null, dates: [], offset: 0, limit: 10 };

// Inline values (not captured), measured on staging 15/11:
// search column flex-basis 264px (static inline style in the original HTML); 10px gap under "รายชื่อโปรโมชั่น" (measured on staging)
const SEARCH_STYLE = { flexBasis: "264px" };
const SUBTITLE_STYLE = { marginBottom: "10px" };

// /promotion/minigame/minigame-period-deposit — ตรวจสอบยอดฝาก (mission page template).
// Staging only ever returned the empty state, and the rows are server-rendered HTML that no captured
// script shows, so the table has no row markup: every search ends in "ไม่พบข้อมูลที่ค้นหา" like staging.
export function DepositCheck() {
  const t = useT();
  const table = useTableRequest();
  const [query, setQuery] = useState<Query>(INITIAL_QUERY);
  const [total, setTotal] = useState(0);

  const request = (next: Query) => {
    setQuery(next);
    table.run(getDepositCheckRows(next), (page) => setTotal(page.total));
  };
  const update = (patch: Partial<Query>) => request({ ...query, offset: 0, ...patch });

  const all = t("missionReportPage.all", "ทั้งหมด");
  const categoryItems: DropdownItem[] = [
    { value: "all", label: all, className: "mission-page" },
    { value: "auto", label: "Auto" },
    { value: "admin", label: "Admin" },
    { value: "manual", label: "Manual" },
    { value: "mission-complete", label: "Complete" },
  ];
  const makeByItems: DropdownItem[] = [
    { value: "all", label: all, className: "mission-page" },
    { value: "admin", label: "Admin" },
    { value: "auto", label: "Auto" },
    { value: "user", label: "User" },
  ];

  return (
    <div className="page-content">
      <div className="container-fluid full-container">
        <svg className="d-box" width="0" height="0" viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="filter-gradient" x1="7.91113" y1="0.666748" x2="7.91113" y2="17.3334" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#50A198"></stop>
              <stop offset="1" stopColor="#FEDB6B"></stop>
            </linearGradient>
          </defs>
        </svg>
        <div className="inner-container full-flex">
          <div className="custom-card full-card full-flex">
            <div className="w-title">
              <h4 className="mb-0 mission-page">ตรวจสอบยอดฝาก</h4>
            </div>
            <div className="w-title" style={SUBTITLE_STYLE}>
              <h5 className="mb-0 mission-page">รายชื่อโปรโมชั่น</h5>
            </div>
            <div className="row align-items-center gx-2 mb-3">
              <div className="col-auto" style={SEARCH_STYLE}>
                <SearchInput id="tableSearch" placeholder="Search" clearId="clearValuePromotionSearch" onSearch={(value) => update({ search: value })} />
              </div>
              <div className="col-auto">
                <DateRangeFilter
                  id="filterDateSummary"
                  inputId="datepickerDateSummary"
                  icon={<CalendarIcon />}
                  title={t("missionReportPage.dateReport", "วันที่สรุป")}
                  titleClassName="mission-page"
                  onChange={(dates) => update({ dates })}
                />
              </div>
              <div className="col-auto">
                <FilterDropdown
                  id="filterCategory"
                  dropdownId="dropdownFilterCategory"
                  icon={<TypeIcon />}
                  title={t("missionReportPage.type", "ประเภท")}
                  titleClassName="mission-page"
                  defaultText={all}
                  valueClassName="mission-page"
                  items={categoryItems}
                  stretch
                  value={query.category}
                  onChange={(category) => update({ category })}
                />
              </div>
              <div className="col-auto">
                <FilterDropdown
                  id="filterMakeBy"
                  dropdownId="dropdownFilterMakeBy"
                  icon={<MakerIcon />}
                  title={t("missionReportPage.editedUser", "ผู้ทำรายการ")}
                  titleClassName="mission-page"
                  defaultText={all}
                  valueClassName="mission-page"
                  items={makeByItems}
                  stretch
                  value={query.makeBy}
                  onChange={(makeBy) => update({ makeBy })}
                />
              </div>
            </div>
            <div id="reportTable" className="mission-report-table system-table table-full">
              <TableLoading show={table.loading} />
              {!table.loading && (
                <>
                  <div className="table-scrollable">
                    <EmptyState />
                  </div>
                  <Pagination
                    total={total}
                    offset={query.offset}
                    limit={query.limit}
                    onOffsetChange={(offset) => request({ ...query, offset })}
                    onLimitChange={(limit) => update({ limit })}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
