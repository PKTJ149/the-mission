"use client";

import { useT } from "@/lib/i18n";
import { CustomDropdown } from "./custom-dropdown";
import { PaginateFirstIcon, PaginateLastIcon, PaginateNextIcon, PaginatePrevIcon } from "./icons";

type PaginationProps = {
  total: number; // all rows matching the filters
  offset: number; // first row index of this page (0-based, like the original data-offset)
  limit: number; // rows per page
  onOffsetChange: (offset: number) => void;
  onLimitChange: (limit: number) => void; // the original also jumps back to offset 0
  limits?: number[];
};

// Colours the original sets inline on the "แสดง 1 - 3 จาก 3 รายการ" spans (page.styles.json)
const LABEL = { color: "rgb(233, 233, 233)" };
const NUMBER = { color: "rgb(80, 161, 152)" };

// .system-pagination as table.js renders it (the server built it; offsets copied from captures).
export function Pagination({ total, offset, limit, onOffsetChange, onLimitChange, limits = [10, 20, 50, 100] }: PaginationProps) {
  const t = useT();
  const totalPages = Math.ceil(total / limit);
  const currentPage = total === 0 ? 0 : Math.floor(offset / limit) + 1;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + limit, total);

  // Captured: page 1 of 5 and of 1422 both list pages 1-4, i.e. current-3 … current+3 (a guess beyond page 1)
  const pages: number[] = [];
  for (let page = Math.max(1, currentPage - 3); page <= Math.min(totalPages, currentPage + 3); page++) pages.push(page);

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  // Offsets exactly as captured: prev = (page-2)*limit (e.g. -10, -20 on empty), next = page*limit
  const prevOffset = (currentPage - 2) * limit;
  const nextOffset = currentPage * limit;
  const lastOffset = Math.max(0, (totalPages - 1) * limit);

  const go = (enabled: boolean, target: number) => () => {
    if (enabled) onOffsetChange(target);
  };

  return (
    <div className="system-pagination">
      <CustomDropdown
        className="pagination-limit custom-input dropdown-wrapper"
        bodyless
        stretch
        auto
        horizontal={false}
        items={limits.map((value) => ({ value: String(value), label: String(value) }))}
        itemAttributes={(item) => (item.value === String(limit) ? { "data-selected": "" } : {})}
        value={String(limit)}
        onChange={(value) => onLimitChange(Number(value))}
      />
      <div className="pagination-display p2">
        <span style={LABEL}>{t("global.table.show", "แสดง")}</span> <span style={NUMBER}>{`${from} - ${to}`}</span>{" "}
        <span style={LABEL}>{t("global.table.from", "จาก")}</span> <span style={NUMBER}>{total}</span>{" "}
        <span style={LABEL}>{t("global.table.item", "รายการ")}</span>
      </div>
      <div className="flex-fill"></div>
      <ul className="pagination-list">
        <li data-offset="0" className={`paginate-nav paginate-prev-all ${hasPrev ? "" : "disabled"}`} onClick={go(hasPrev, 0)}>
          <PaginateFirstIcon />
        </li>
        <li data-offset={prevOffset} className={`paginate-nav paginate-prev ${hasPrev ? "" : "disabled"}`} onClick={go(hasPrev, prevOffset)}>
          <PaginatePrevIcon />
        </li>
        {pages.map((page) => {
          const pageOffset = (page - 1) * limit;
          const active = page === currentPage;
          return (
            <li
              key={page}
              data-offset={pageOffset}
              data-page={page}
              className={`paginate-page ${active ? "active" : ""}`}
              onClick={go(!active, pageOffset)}
            >
              {page}
            </li>
          );
        })}
        <li data-offset={nextOffset} className={`paginate-nav paginate-next ${hasNext ? "" : "disabled"}`} onClick={go(hasNext, nextOffset)}>
          <PaginateNextIcon />
        </li>
        <li data-offset={lastOffset} className={`paginate-nav paginate-next-all ${hasNext ? "" : "disabled"}`} onClick={go(hasNext, lastOffset)}>
          <PaginateLastIcon />
        </li>
      </ul>
    </div>
  );
}
