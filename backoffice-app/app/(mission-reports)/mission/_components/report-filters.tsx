"use client";

import type { ReactNode } from "react";
import { DateRangeFilter, SearchInput, type DropdownItem } from "@/components/ui";
import type { DateRange, MissionOption } from "@/lib/api/mission-reports";
import { SEARCH_COLUMN_STYLE } from "./report-cells";
import { ReportCalendarIcon } from "./report-icons";

// Filter-row pieces shared by the mission report pages (row = .row.align-items-center.gx-2.mb-3)

export function SearchColumn({ placeholder = "Search", onSearch }: { placeholder?: string; onSearch: (value: string) => void }) {
  return (
    <div className="col-auto" style={SEARCH_COLUMN_STYLE}>
      <SearchInput id="tableSearch" placeholder={placeholder} clearId="clearValuePromotionSearch" onSearch={onSearch} />
    </div>
  );
}

// "วันที่สรุป" flatpickr pill. Reloads once a full range is picked (or the range is cleared).
export function DateSummaryColumn({
  title,
  titleClassName,
  onChange,
}: {
  title: ReactNode;
  titleClassName?: string;
  onChange: (range: DateRange) => void;
}) {
  return (
    <div className="col-auto">
      <DateRangeFilter
        id="filterDateSummary"
        inputId="datepickerDateSummary"
        title={title}
        titleClassName={titleClassName}
        icon={<ReportCalendarIcon />}
        onChange={(dates) => {
          if (dates.length === 2) onChange({ from: dates[0], to: dates[1] });
          else if (dates.length === 0) onChange(null);
        }}
      />
    </div>
  );
}

// Items of the "ภารกิจ" pill: "ทั้งหมด" + every mission
export function missionItems(missions: MissionOption[], all: DropdownItem): DropdownItem[] {
  return [all, ...missions.map((mission) => ({ value: mission.id, label: mission.name }))];
}

// Items for the "ประเภท" pill (same values on every report page)
export const CATEGORY_ITEMS: DropdownItem[] = [
  { value: "auto", label: "Auto" },
  { value: "admin", label: "Admin" },
  { value: "manual", label: "Manual" },
  { value: "mission-complete", label: "Complete" },
];

// Items for the "ผู้ทำรายการ" pill
export const MAKER_ITEMS: DropdownItem[] = [
  { value: "admin", label: "Admin" },
  { value: "auto", label: "Auto" },
  { value: "user", label: "User" },
];
