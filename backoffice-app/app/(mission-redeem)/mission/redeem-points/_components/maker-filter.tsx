"use client";

import { useRef } from "react";
import { cx, FilterCloseIcon, FilterTogglerIcon } from "@/components/ui";
import { useFloatingDropdown } from "@/components/ui/use-floating-dropdown";
import { useT } from "@/lib/i18n";

// "ผู้ทำรายการ All" pill. Same as the shared FilterDropdown except that this pill has no
// .filter-icon span at all (the shared one always renders it, which would add an empty 20px box).
export function MakerFilter({ makers, value, onChange }: { makers: string[]; value: string | null; onChange: (value: string | null) => void }) {
  const t = useT();
  const pillRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdown = useFloatingDropdown({
    anchorRef: wrapperRef,
    dropdownRef,
    options: { stretch: true },
    isOwnTarget: (target) => target.closest(".custom-filter") === pillRef.current,
  });

  return (
    <>
      <button
        id="filterMakeBy"
        ref={pillRef}
        className={cx("custom-filter", value && "fill", dropdown.show && "active")}
        onClick={dropdown.toggle}
      >
        <span className="filter-title mission-page">{t("missionPointsPage.editedUser", "ผู้ทำรายการ")}</span>
        <span className="filter-value">{value ?? "All"}</span>
        <span className={cx("filter-toggler", dropdown.show && "toggled")}>
          <FilterTogglerIcon />
        </span>
        <span
          className="filter-close"
          onClick={(event) => {
            event.stopPropagation();
            onChange(null);
          }}
        >
          <FilterCloseIcon />
        </span>
      </button>
      <div id="dropdownFilterMakeBy" ref={wrapperRef} className="dropdown-wrapper">
        <div ref={dropdownRef} className={cx("custom-dropdown", dropdown.stateClassName)}>
          <div className="custom-dropdown-body">
            {makers.map((maker) => (
              <div
                key={maker}
                data-chip={maker}
                data-value={maker}
                className={cx("custom-dropdown-item", maker === value && "selected")}
                onClick={() => {
                  onChange(maker);
                  dropdown.close();
                }}
              >
                {maker}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
