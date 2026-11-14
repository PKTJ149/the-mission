"use client";

import { useRef, useState, type ReactNode } from "react";
import type { DropdownItem } from "./filter-dropdown";
import { cx } from "./cx";
import { useFloatingDropdown, type FloatingOptions } from "./use-floating-dropdown";

type GoogleDropdownProps = FloatingOptions & {
  id?: string; // wrapper id, e.g. "manualSelectCustomer"
  inputId?: string; // e.g. "inputSelectCustomer"
  className?: string; // wrapper classes, default "custom-input dropdown-wrapper flex-grow-1"
  placeholder?: string;
  value: DropdownItem | null; // the picked item (input shows its label and turns read-only)
  onChange: (item: DropdownItem | null) => void;
  // Mock search; the original posts the keyword and gets select2-style results back
  onSearch: (keyword: string) => Promise<DropdownItem[]>;
  minimumCharacters?: number;
  disabled?: boolean;
  invalid?: boolean;
  children?: ReactNode; // e.g. <div className="invalid-feedback" />
};

const NOT_FOUND = (
  <div className="dropdown-body-caption">
    <i className="fa fa-search"></i> ไม่พบข้อมูล
  </div>
);
const LOADING = (
  <div className="dropdown-body-caption">
    <i className="fa fa-spinner fa-spin"></i> กำลังค้นหาข้อมูล
  </div>
);

// CustomDropdown with theme "google" (helper.js): a type-to-search input instead of a fake box.
// Used for the customer picker (#manualSelectCustomer) on history + redeem points.
export function GoogleDropdown({
  id,
  inputId,
  className = "custom-input dropdown-wrapper flex-grow-1",
  placeholder,
  value,
  onChange,
  onSearch,
  minimumCharacters = 0,
  disabled,
  invalid,
  children,
  ...floating
}: GoogleDropdownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState(false);
  const ticket = useRef(0);

  const dropdown = useFloatingDropdown({
    anchorRef: wrapperRef,
    dropdownRef,
    // The original forces offsetMargin 0 for this theme ("seamless")
    options: { offsetMargin: 0, ...floating },
    disabled,
    isOwnTarget: (target) => target.closest(".dropdown-input-wrapper")?.parentElement === wrapperRef.current,
  });

  const search = async (text: string) => {
    setKeyword(text);
    const trimmed = text.trim();
    if (minimumCharacters > 0 && trimmed.length < minimumCharacters) {
      setResults([]);
      dropdown.close();
      return;
    }
    // Ignore answers that come back after a newer keyword (same guard as the original)
    const current = ++ticket.current;
    setLoading(true);
    dropdown.open();
    const found = await onSearch(trimmed);
    if (current !== ticket.current) return;
    setResults(found);
    setLoading(false);
  };

  const pick = (item: DropdownItem) => {
    onChange(item);
    dropdown.close();
  };

  const clear = () => {
    if (disabled) return;
    onChange(null);
    setKeyword("");
    setResults([]);
  };

  return (
    <div
      id={id}
      ref={wrapperRef}
      className={cx(className, "dropdown-google", value ? "" : "empty", disabled && "disabled", invalid && "custom-invalid")}
    >
      <div className="dropdown-navigate">
        <div className="navigate-item navigate-reset" onClick={clear}>
          <i className="fa fa-times"></i>
        </div>
      </div>
      <div className="dropdown-input-wrapper">
        <input
          id={inputId}
          className="dropdown-input form-control"
          placeholder={placeholder}
          value={value ? String(typeof value.label === "string" ? value.label : value.value) : keyword}
          readOnly={Boolean(value)}
          disabled={disabled}
          onFocus={() => {
            if (!value && (minimumCharacters === 0 || keyword.trim().length >= minimumCharacters)) dropdown.open();
          }}
          onChange={(event) => search(event.target.value)}
        />
      </div>
      <div ref={dropdownRef} className={cx("custom-dropdown dropdown-wrap", dropdown.stateClassName)}>
        <div className="custom-dropdown-body">
          <div className="dropdown-body-scrollable">
            {loading
              ? LOADING
              : results.length === 0
                ? NOT_FOUND
                : results.map((item) => (
                    <div
                      key={item.value}
                      data-value={item.value}
                      className={cx("custom-dropdown-item", value?.value === item.value && "selected")}
                      onClick={() => pick(item)}
                    >
                      {item.label}
                    </div>
                  ))}
          </div>
          <div className="observer-target"></div>
        </div>
      </div>
      {children}
    </div>
  );
}
