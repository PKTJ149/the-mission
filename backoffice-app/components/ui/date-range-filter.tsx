"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Instance } from "flatpickr/dist/types/instance";
import type { Options } from "flatpickr/dist/types/options";
import { CalendarFilterIcon, FilterCloseIcon, FilterTogglerIcon } from "./icons";
import { cx } from "./cx";

type DateRangeFilterProps = {
  id: string; // pill id, e.g. "filterPromotionDateTime"
  inputId: string; // hidden flatpickr input id, e.g. "datepickerPromotionDateTime"
  title: ReactNode; // "วันที่สร้าง: "
  titleClassName?: string;
  valueClassName?: string;
  icon?: ReactNode; // default: the calendar-clock icon
  // Same as the original onChange: the dates and flatpickr's text ("01/11/2026 to 14/11/2026")
  onChange?: (dates: Date[], text: string) => void;
  options?: Options; // extra flatpickr options
};

// Date pill with flatpickr 4.6.13 in range mode (CSS comes from material.app.min.css, not flatpickr's own).
// Original config: { enableTime: false, mode: 'range', dateFormat: 'd/m/Y' }, English locale,
// calendar appended to <body>. Like the original, the pill never gets .fill, so its × stays hidden.
export function DateRangeFilter({ id, inputId, title, titleClassName, valueClassName, icon, onChange, options }: DateRangeFilterProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const picker = useRef<Instance | null>(null);
  const latest = useRef({ onChange, options });
  const [text, setText] = useState("");

  useEffect(() => {
    latest.current = { onChange, options };
  });

  useEffect(() => {
    let cancelled = false;
    // flatpickr touches window, so it is loaded in the browser only
    import("flatpickr").then(({ default: flatpickr }) => {
      if (cancelled || !inputRef.current) return;
      picker.current = flatpickr(inputRef.current, {
        enableTime: false,
        mode: "range",
        dateFormat: "d/m/Y",
        ...latest.current.options,
        onChange: (dates, dateText) => {
          setText(dateText);
          latest.current.onChange?.(dates, dateText);
        },
      });
    });
    return () => {
      cancelled = true;
      picker.current?.destroy();
      picker.current = null;
    };
  }, []);

  return (
    <div id={id} className="custom-filter" onClick={() => picker.current?.toggle()}>
      <input ref={inputRef} id={inputId} type="text" className="filter-flatpicker flatpickr-input" readOnly />
      <span className="filter-icon">{icon ?? <CalendarFilterIcon />}</span>
      <span className={cx("filter-title", titleClassName)}>{title}</span>
      <span className={cx("filter-value", valueClassName)}>{text}</span>
      <span className="filter-toggler">
        <FilterTogglerIcon />
      </span>
      <span
        className="filter-close"
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
        }}
      >
        <FilterCloseIcon />
      </span>
    </div>
  );
}
