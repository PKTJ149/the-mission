"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { FilterCloseIcon, FilterTogglerIcon } from "./icons";
import { cx } from "./cx";
import { useFloatingDropdown, type FloatingOptions } from "./use-floating-dropdown";

export type DropdownItem = {
  value: string;
  label: ReactNode;
  chip?: string; // data-chip: shorter text shown in the pill / chip
  type?: "all"; // data-type="all"
  disabled?: boolean;
  className?: string; // extra item classes, e.g. "mission-page"
};

type FilterDropdownProps = FloatingOptions & {
  id: string; // pill id, e.g. "filterStatus"
  dropdownId: string; // dropdown wrapper id, e.g. "dropdownStatus"
  icon: ReactNode; // svg inside .filter-icon
  title: ReactNode; // "สถานะมินิเกมส์ :"
  titleClassName?: string;
  defaultText?: ReactNode; // shown when nothing is selected (original "filterDefault", e.g. "All")
  valueClassName?: string;
  items: DropdownItem[];
  value: string | null;
  onChange: (value: string | null) => void;
  // Text for the pill when an item is selected. Default: the item's chip, else its label.
  fakeValue?: (item: DropdownItem) => ReactNode;
  wrapperClassName?: string; // extra classes on .dropdown-wrapper, e.g. "dropdown-xs"
  wrapperStyle?: CSSProperties; // e.g. { "--border-color": "..." }
  disabled?: boolean;
};

// The "สถานะ : All" style filter pill: CustomFilter + CustomDropdown (single) from helper.js.
// Markup = button.custom-filter followed by div.dropdown-wrapper > .custom-dropdown > .custom-dropdown-body.
export function FilterDropdown({
  id,
  dropdownId,
  icon,
  title,
  titleClassName,
  defaultText = "",
  valueClassName,
  items,
  value,
  onChange,
  fakeValue,
  wrapperClassName,
  wrapperStyle,
  disabled,
  ...floating
}: FilterDropdownProps) {
  const pillRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dropdown = useFloatingDropdown({
    anchorRef: wrapperRef,
    dropdownRef,
    options: floating,
    disabled,
    isOwnTarget: (target) => target.closest(".custom-filter") === pillRef.current,
  });

  const selected = value === null ? undefined : items.find((item) => item.value === value);
  const filled = Boolean(value ?? "");
  let text: ReactNode = value ?? defaultText;
  if (selected) text = fakeValue ? fakeValue(selected) : (selected.chip ?? selected.label);

  const select = (item: DropdownItem) => {
    if (item.disabled) return;
    onChange(item.value);
    dropdown.close();
  };

  return (
    <>
      <button
        id={id}
        ref={pillRef}
        className={cx("custom-filter", filled && "fill", dropdown.show && "active", disabled && "disabled")}
        onClick={dropdown.toggle}
      >
        <span className="filter-icon">{icon}</span>
        <span className={cx("filter-title", titleClassName)}>{title}</span>
        <span className={cx("filter-value", valueClassName)}>{text}</span>
        <span className={cx("filter-toggler", dropdown.show && "toggled")}>
          <FilterTogglerIcon />
        </span>
        <span
          className="filter-close"
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onChange(null);
          }}
        >
          <FilterCloseIcon />
        </span>
      </button>
      <div id={dropdownId} ref={wrapperRef} className={cx("dropdown-wrapper", wrapperClassName)} style={wrapperStyle}>
        <div ref={dropdownRef} className={cx("custom-dropdown", dropdown.stateClassName)}>
          <div className="custom-dropdown-body">
            {items.map((item) => (
              <div
                key={item.value}
                data-value={item.value}
                data-chip={item.chip}
                data-type={item.type}
                className={cx(
                  "custom-dropdown-item",
                  item.className,
                  item.value === value && "selected",
                  item.disabled && "disabled",
                )}
                onClick={() => select(item)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
