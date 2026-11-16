"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { cx } from "./cx";

export type Select2Option = { value: string; text: string; disabled?: boolean };

type Select2Props = {
  id: string; // id of the hidden <select>, e.g. "anyMiniGameId"
  options: Select2Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string; // select2 "placeholder" option (the captured ones have none)
  width?: string; // container width, default "100%"
  disabled?: boolean;
  selectClassName?: string; // default "form-select select2"
};

type Position = { top: number; left: number; width: number; below: boolean };

const RESULTS_MAX = 200; // .select2-results > .select2-results__options { max-height: 200px }
const SEARCH_HEIGHT = 40;

// Renders select2 4.1.0-rc.0's DOM (styled by the CDN select2.min.css + material.app.min.css) without jQuery:
// <select class="select2-hidden-accessible"> + span.select2-container, and when open a second
// span.select2-container--open appended to <body> holding the search box and results — the same
// positioning the original uses (absolute in page coordinates, dropdownAutoWidth: width auto + min-width).
export function Select2({
  id,
  options,
  value,
  onChange,
  placeholder,
  width = "100%",
  disabled,
  selectClassName = "form-select select2",
}: Select2Props) {
  const dataId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLSpanElement>(null);
  const selectionRef = useRef<HTMLSpanElement>(null);
  const dropdownRef = useRef<HTMLSpanElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [focused, setFocused] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [highlight, setHighlight] = useState<string | null>(null);

  const open = position !== null;
  const selected = options.find((option) => option.value === value);
  const results = options.filter((option) => option.text.toLowerCase().includes(keyword.toLowerCase()));

  const measure = () => {
    const container = containerRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    const height = Math.min(RESULTS_MAX, Math.max(1, options.length) * 32) + SEARCH_HEIGHT;
    // Same rule as AttachBody._positionDropdown: stay below unless only the top has room
    const roomBelow = window.innerHeight > rect.bottom + height;
    const roomAbove = rect.top - height > 0;
    const below = roomBelow || !roomAbove;
    return {
      top: (below ? rect.bottom : rect.top - height) + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      below,
    };
  };

  const openDropdown = () => {
    if (disabled) return;
    setKeyword("");
    setHighlight(value ?? options[0]?.value ?? null);
    setPosition(measure());
  };

  const closeDropdown = () => setPosition(null);

  // select2 gives focus back to the selection box when it closes after Escape or a pick
  const closeAndRefocus = () => {
    closeDropdown();
    selectionRef.current?.focus();
  };

  const choose = (option: Select2Option) => {
    if (option.disabled) return;
    onChange(option.value);
    closeAndRefocus();
  };

  // Focus the search box when it opens (select2 does)
  useLayoutEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  // Close on outside mousedown, follow scroll/resize
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      setPosition(null);
    };
    const onMove = () => {
      const next = measure();
      if (next) setPosition(next);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  });

  const onKeyDown = (event: KeyboardEvent) => {
    // select2's search box stops every keydown here, so Escape never reaches an offcanvas around it
    event.stopPropagation();
    if (event.key === "Escape") closeAndRefocus();
    if (event.key === "Enter") {
      const option = results.find((o) => o.value === highlight);
      if (option) choose(option);
      event.preventDefault();
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const index = results.findIndex((o) => o.value === highlight);
      const next = results[index + (event.key === "ArrowDown" ? 1 : -1)];
      if (next) setHighlight(next.value);
      event.preventDefault();
    }
  };

  const direction = position ? (position.below ? "below" : "above") : null;
  const dropdownStyle: CSSProperties = { width: "auto", minWidth: position ? `${position.width}px` : undefined, position: "relative" };

  return (
    <>
      <select
        className={cx(selectClassName, "select2-hidden-accessible")}
        id={id}
        tabIndex={-1}
        aria-hidden="true"
        data-select2-id={`select2-data-${id}`}
        value={value ?? ""}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {placeholder !== undefined && <option value=""></option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.text}
          </option>
        ))}
      </select>
      <span
        ref={containerRef}
        className={cx(
          "select2 select2-container select2-container--default",
          direction && `select2-container--${direction}`,
          open && "select2-container--open",
          (focused || open) && "select2-container--focus",
          disabled && "select2-container--disabled",
        )}
        dir="ltr"
        data-select2-id={`select2-data-${dataId}`}
        style={{ width }}
      >
        <span className="selection">
          <span
            ref={selectionRef}
            className="select2-selection select2-selection--single"
            role="combobox"
            aria-haspopup="true"
            aria-expanded={open}
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled ? "true" : "false"}
            aria-labelledby={`select2-${id}-container`}
            aria-controls={`select2-${id}-container`}
            aria-owns={open ? `select2-${id}-results` : undefined}
            onMouseDown={(event) => {
              event.preventDefault();
              if (open) closeDropdown();
              else openDropdown();
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(event) => {
              if (!open && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
                event.preventDefault();
                openDropdown();
              }
            }}
          >
            <span
              className="select2-selection__rendered"
              id={`select2-${id}-container`}
              role="textbox"
              aria-readonly="true"
              title={selected?.text}
            >
              {selected ? selected.text : placeholder ? <span className="select2-selection__placeholder">{placeholder}</span> : null}
            </span>
            <span className="select2-selection__arrow" role="presentation">
              <b role="presentation"></b>
            </span>
          </span>
        </span>
        <span className="dropdown-wrapper" aria-hidden="true"></span>
      </span>
      {position &&
        createPortal(
          <span
            ref={dropdownRef}
            className="select2-container select2-container--default select2-container--open"
            style={{ position: "absolute", top: position.top, left: position.left }}
          >
            <span className={`select2-dropdown select2-dropdown--${direction}`} dir="ltr" style={dropdownStyle}>
              <span className="select2-search select2-search--dropdown">
                <input
                  ref={searchRef}
                  className="select2-search__field"
                  type="search"
                  tabIndex={0}
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  role="searchbox"
                  aria-autocomplete="list"
                  autoComplete="off"
                  aria-label="Search"
                  aria-controls={`select2-${id}-results`}
                  value={keyword}
                  onChange={(event) => {
                    setKeyword(event.target.value);
                    const first = options.find((o) => o.text.toLowerCase().includes(event.target.value.toLowerCase()));
                    setHighlight(first?.value ?? null);
                  }}
                  onKeyDown={onKeyDown}
                />
              </span>
              <span className="select2-results">
                <ul className="select2-results__options" role="listbox" id={`select2-${id}-results`} aria-expanded="true" aria-hidden="false">
                  {results.length === 0 ? (
                    <li className="select2-results__option select2-results__message" role="alert" aria-live="assertive">
                      No results found
                    </li>
                  ) : (
                    results.map((option) => (
                      <li
                        key={option.value}
                        className={cx(
                          "select2-results__option",
                          option.disabled ? "select2-results__option--disabled" : "select2-results__option--selectable",
                          option.value === value && "select2-results__option--selected",
                          option.value === highlight && "select2-results__option--highlighted",
                        )}
                        role="option"
                        // select2 4.1 sets aria-selected="true" on the highlighted row (results:focus), and the
                        // theme paints [aria-selected=true] white: so the highlight shows white, not green
                        aria-selected={option.value === highlight}
                        aria-disabled={option.disabled ? "true" : undefined}
                        onMouseEnter={() => setHighlight(option.value)}
                        onMouseUp={() => choose(option)}
                      >
                        {option.text}
                      </li>
                    ))
                  )}
                </ul>
              </span>
            </span>
          </span>,
          document.body,
        )}
    </>
  );
}
