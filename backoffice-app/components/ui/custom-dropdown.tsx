"use client";

import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import type { DropdownItem } from "./filter-dropdown";
import { ChipCloseIcon, DropdownSearchIcon, DropdownTogglerIcon } from "./icons";
import { cx } from "./cx";
import { useFloatingDropdown, type FloatingOptions } from "./use-floating-dropdown";

type BaseProps = FloatingOptions & {
  id?: string;
  className?: string; // wrapper classes, default "custom-input dropdown-wrapper"
  items: DropdownItem[];
  placeholder?: ReactNode;
  fakeValue?: (item: DropdownItem) => ReactNode; // text in .input-fake for a selected item
  fakeClassName?: string; // extra classes on .input-fake
  search?: boolean; // .custom-dropdown-search box that filters the items (original "selfSearch")
  searchPlaceholder?: string;
  checkbox?: boolean; // items get a .custom-checkbox in front
  allItemLabel?: ReactNode; // multiple only: adds the data-type="all" item on top
  bodyless?: boolean; // items sit directly in .custom-dropdown (page-size select)
  dropdownClassName?: string;
  itemAttributes?: (item: DropdownItem) => HTMLAttributes<HTMLDivElement> & Record<string, unknown>;
  disabled?: boolean;
  invalid?: boolean; // adds .custom-invalid
  children?: ReactNode; // rendered after .custom-dropdown, e.g. <div className="invalid-feedback">
};

type SingleProps = BaseProps & { multiple?: false; value: string | null; onChange: (value: string | null) => void };
type MultipleProps = BaseProps & { multiple: true; value: string[]; onChange: (value: string[]) => void };

const CHIP_FONT = 'normal 12px "Inter", sans-serif';
let measureCanvas: HTMLCanvasElement | null = null;

// Same canvas text measuring the original uses to decide how many chips fit
function textWidth(text: string) {
  measureCanvas ??= document.createElement("canvas");
  const context = measureCanvas.getContext("2d");
  if (!context) return text.length * 7;
  context.font = CHIP_FONT;
  return context.measureText(text).width;
}

function chipText(item: DropdownItem | undefined, value: string) {
  if (!item) return value;
  return item.chip ?? (typeof item.label === "string" ? item.label : value);
}

// Form-style CustomDropdown (helper.js): .dropdown-wrapper with .dropdown-toggler, .input-fake
// and a fixed-position .custom-dropdown. Single or multiple (chips), optional search and checkboxes.
export function CustomDropdown(props: SingleProps | MultipleProps) {
  const {
    id,
    className = "custom-input dropdown-wrapper",
    items,
    placeholder = "",
    fakeValue,
    fakeClassName,
    search,
    searchPlaceholder = "Search",
    checkbox,
    allItemLabel,
    bodyless,
    dropdownClassName,
    itemAttributes,
    disabled,
    invalid,
    children,
    ...rest
  } = props;
  const { multiple, value, onChange, ...floating } = rest as typeof rest & { multiple?: boolean };

  const wrapperRef = useRef<HTMLDivElement>(null);
  const fakeRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState("");
  const [fakeWidth, setFakeWidth] = useState(0);

  const dropdown = useFloatingDropdown({
    anchorRef: fakeRef,
    dropdownRef,
    options: floating,
    disabled,
    isOwnTarget: (target) => {
      const toggler = target.closest(".dropdown-toggler");
      return (toggler !== null && toggler.parentElement === wrapperRef.current) || target.closest(".multiple-item") !== null;
    },
  });

  // Chips need the real width of .input-fake (multiple mode only)
  useEffect(() => {
    if (!multiple || !fakeRef.current) return;
    const observer = new ResizeObserver(([entry]) => setFakeWidth(entry.target.clientWidth));
    observer.observe(fakeRef.current);
    return () => observer.disconnect();
  }, [multiple]);

  const selectedList = multiple ? (value as string[]) : [];
  const isSelected = (item: DropdownItem) =>
    multiple ? selectedList.includes(item.value) : item.value === String(value ?? "");

  const selectItem = (item: DropdownItem) => {
    if (item.disabled) return;
    if (multiple) {
      const change = onChange as (value: string[]) => void;
      if (item.type === "all") {
        const all = items.map((i) => i.value);
        change(selectedList.length < all.length || selectedList.length === 0 ? all : []);
      } else {
        change(isSelected(item) ? selectedList.filter((v) => v !== item.value) : [...selectedList, item.value]);
      }
      return;
    }
    (onChange as (value: string | null) => void)(item.value);
    dropdown.close();
  };

  // What .input-fake shows
  let filled = false;
  let fake: ReactNode = placeholder;
  if (!multiple) {
    const item = items.find((i) => i.value === String(value ?? ""));
    if (value) {
      filled = true;
      fake = item ? (fakeValue ? fakeValue(item) : item.label) : value;
    }
  } else if (selectedList.length > 0) {
    filled = true;
    fake = renderChips(selectedList, items, fakeWidth, (removed) =>
      (onChange as (value: string[]) => void)(selectedList.filter((v) => v !== removed)),
    );
  }

  const allSelected = Boolean(multiple) && items.length > 0 && items.every((i) => selectedList.includes(i.value));
  const visible = (item: DropdownItem) =>
    !keyword || (typeof item.label === "string" ? item.label : item.chip ?? item.value).includes(keyword);

  const itemNodes = (
    <>
      {multiple && allItemLabel !== undefined && (
        <div
          data-type="all"
          className={cx("custom-dropdown-item", !checkbox && allSelected && "selected")}
          onClick={() => selectItem({ value: "", label: allItemLabel, type: "all" })}
        >
          {checkbox && <Checkbox checked={allSelected} />}
          {allItemLabel}
        </div>
      )}
      {items.map((item) => (
        <div
          key={item.value}
          data-value={item.value}
          data-chip={item.chip}
          data-type={item.type}
          className={cx(
            "custom-dropdown-item",
            item.className,
            !checkbox && isSelected(item) && "selected",
            item.disabled && "disabled",
          )}
          style={visible(item) ? undefined : { display: "none" }}
          onClick={() => selectItem(item)}
          {...itemAttributes?.(item)}
        >
          {checkbox && <Checkbox checked={isSelected(item)} />}
          {item.label}
        </div>
      ))}
    </>
  );

  return (
    <div
      id={id}
      ref={wrapperRef}
      className={cx(className, multiple && "multiple", filled ? "fill" : "empty", disabled && "disabled", invalid && "custom-invalid")}
    >
      <div className={cx("dropdown-toggler", dropdown.show && "toggled")} onClick={dropdown.toggle}>
        <DropdownTogglerIcon />
      </div>
      <div ref={fakeRef} className={cx("input-fake", fakeClassName)}>
        {fake}
      </div>
      <div ref={dropdownRef} className={cx("custom-dropdown", dropdownClassName, dropdown.stateClassName)}>
        {search && (
          <div className="custom-dropdown-search">
            <div className="input-group">
              <input
                type="text"
                className="input-search form-control"
                placeholder={searchPlaceholder}
                value={keyword}
                onChange={(event) => setKeyword(event.target.value.trim())}
              />
              <button className="btn-search btn sms-btn" type="button">
                <DropdownSearchIcon />
              </button>
            </div>
          </div>
        )}
        {bodyless ? itemNodes : <div className="custom-dropdown-body">{itemNodes}</div>}
      </div>
      {children}
    </div>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div className="custom-checkbox form-check d-inline-block align-text-top me-2">
      <input type="checkbox" className="form-check-input" checked={checked} readOnly />
    </div>
  );
}

// Port of the multiple-mode fake(): as many chips as fit, then a "+N" chip
function renderChips(selected: string[], items: DropdownItem[], fakeWidth: number, remove: (value: string) => void) {
  const available = fakeWidth - 30;
  const padding = 22 + 25;
  let used = 10;
  let hidden = 0;
  const shown: string[] = [];

  for (const value of selected) {
    const text = chipText(items.find((i) => i.value === value), value);
    // fakeWidth is 0 before the first measurement (and on the server): show everything
    const width = fakeWidth > 0 ? textWidth(text) + padding : 0;
    if (hidden > 0 || (fakeWidth > 0 && used + width > available)) {
      hidden += 1;
      continue;
    }
    used += width;
    shown.push(value);
  }

  return (
    <>
      {shown.map((value) => (
        <div key={value} className="multiple-item">
          <a
            className="multiple-close"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              remove(value);
            }}
          >
            <ChipCloseIcon />
          </a>
          <span className="multiple-text">{chipText(items.find((i) => i.value === value), value)}</span>
        </div>
      ))}
      {hidden > 0 && (
        <div className="multiple-item">
          <span className="multiple-text">+{hidden.toLocaleString()}</span>
        </div>
      )}
    </>
  );
}
