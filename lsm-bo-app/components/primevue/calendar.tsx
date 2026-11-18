"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { nextUniqueId, nextZIndex, relativePosition } from "@/lib/primevue/dom";
import { useToday } from "@/lib/use-mounted";

// PrimeVue 2 <Calendar dateFormat="dd/mm/yy"> with the original's markup: input + overlay panel
// (date / month / year views), opened on focus, closed on Escape, outside click or picking a day.
// (The original also has blank text nodes inside <table>/<tr>; React does not allow those and
// they never render, so they are left out.)

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS_MIN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Indents of the text inside the header buttons, copied from the original's markup
const TITLE_INDENT = "\n                                    ";
const TITLE_END = "\n                                ";
const CELL_INDENT = "\n                        ";
const CELL_END = "\n                    ";

const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
export const formatDate = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

function parseDate(text: string): Date | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text.trim());
  if (!m) return null;
  const date = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return date.getMonth() === Number(m[2]) - 1 ? date : null;
}

type Cell = { day: number; month: number; year: number; otherMonth: boolean };

// PrimeVue createMonths(): weeks start on Sunday, other-month days fill the first and last week.
function monthWeeks(month: number, year: number): Cell[][] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const prev = month === 0 ? { month: 11, year: year - 1 } : { month: month - 1, year };
  const next = month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year };
  const rows = Math.ceil((daysInMonth + firstDay) / 7);
  const weeks: Cell[][] = [];
  let dayNo = 1;

  for (let i = 0; i < rows; i++) {
    const week: Cell[] = [];
    if (i === 0) {
      for (let d = daysInPrev - firstDay + 1; d <= daysInPrev; d++) week.push({ day: d, ...prev, otherMonth: true });
      while (week.length < 7) week.push({ day: dayNo++, month, year, otherMonth: false });
    } else {
      for (let j = 0; j < 7; j++, dayNo++) {
        if (dayNo > daysInMonth) week.push({ day: dayNo - daysInMonth, ...next, otherMonth: true });
        else week.push({ day: dayNo, month, year, otherMonth: false });
      }
    }
    weeks.push(week);
  }
  return weeks;
}

const sameDay = (d: Date | null, c: Cell) =>
  !!d && d.getDate() === c.day && d.getMonth() === c.month && d.getFullYear() === c.year;

type View = "date" | "month" | "year";

type CalendarProps = {
  value: Date | null;
  onChange: (date: Date) => void;
  scope: string; // the page's data-v-* attribute, set on the wrapper <span>
};

export function Calendar({ value, onChange, scope }: CalendarProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const typing = useRef(false);
  // PrimeVue's attributeSelector (pv_id_N), handed out the first time the panel opens
  const [attributeSelector, setAttributeSelector] = useState<string | null>(null);
  const today = useToday();
  const [open, setOpen] = useState(false); // overlay wanted
  const [rendered, setRendered] = useState(false); // overlay in the DOM (stays during the leave transition)
  const [focused, setFocused] = useState(false);
  const [view, setView] = useState<View>("date");
  const [current, setCurrent] = useState({ month: 0, year: 2000 });

  // The input's text is written like PrimeVue does (DOM property, no value attribute), except while typing
  useEffect(() => {
    if (inputRef.current && !typing.current) inputRef.current.value = value ? formatDate(value) : "";
    typing.current = false;
  }, [value]);

  const show = () => {
    if (open) return;
    if (!attributeSelector) setAttributeSelector(nextUniqueId());
    const base = value ?? new Date();
    setCurrent({ month: base.getMonth(), year: base.getFullYear() });
    setView("date");
    setOpen(true);
    setRendered(true);
  };
  const hide = () => setOpen(false);

  // Vue <transition name="p-connected-overlay">: enter / leave classes around a CSS transition
  useLayoutEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const input = inputRef.current!;
    if (open) {
      el.style.zIndex = String(nextZIndex());
      relativePosition(el, input);
      el.classList.add("p-connected-overlay-enter", "p-connected-overlay-enter-active");
      const frame = requestAnimationFrame(() => {
        el.classList.remove("p-connected-overlay-enter");
        el.classList.add("p-connected-overlay-enter-to");
      });
      const done = () => el.classList.remove("p-connected-overlay-enter-active", "p-connected-overlay-enter-to");
      el.addEventListener("transitionend", done, { once: true });
      return () => {
        cancelAnimationFrame(frame);
        el.removeEventListener("transitionend", done);
        done();
      };
    }
    el.classList.add("p-connected-overlay-leave", "p-connected-overlay-leave-active");
    const frame = requestAnimationFrame(() => {
      el.classList.remove("p-connected-overlay-leave");
      el.classList.add("p-connected-overlay-leave-to");
    });
    const done = () => setRendered(false);
    el.addEventListener("transitionend", done, { once: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("transitionend", done);
    };
  }, [open, rendered]);

  // Close on a mousedown outside the input wrapper and the panel
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const selectDate = (cell: Cell) => {
    onChange(new Date(cell.year, cell.month, cell.day));
    hide();
  };

  const prev = () => {
    if (view === "month") setCurrent((c) => ({ ...c, year: c.year - 1 }));
    else if (view === "year") setCurrent((c) => ({ ...c, year: c.year - 10 }));
    else setCurrent((c) => (c.month === 0 ? { month: 11, year: c.year - 1 } : { month: c.month - 1, year: c.year }));
  };
  const next = () => {
    if (view === "month") setCurrent((c) => ({ ...c, year: c.year + 1 }));
    else if (view === "year") setCurrent((c) => ({ ...c, year: c.year + 10 }));
    else setCurrent((c) => (c.month === 11 ? { month: 0, year: c.year + 1 } : { month: c.month + 1, year: c.year }));
  };

  const filled = !!value;
  const decadeStart = current.year - (current.year % 10);
  const weeks = monthWeeks(current.month, current.year);
  // The cell that gets tabindex="0": the selected day if shown, else today, else the first day
  const focusCell =
    weeks.flat().find((c) => !c.otherMonth && sameDay(value, c)) ??
    weeks.flat().find((c) => !c.otherMonth && sameDay(today, c)) ??
    weeks.flat().find((c) => !c.otherMonth);

  let body: ReactNode = null;
  if (view === "date") {
    body = (
      <div className="p-datepicker-calendar-container">
        <table className="p-datepicker-calendar">
          <thead>
            <tr>
              {DAYS_MIN.map((d) => (
                <th key={d} scope="col">
                  <span>{d}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={`${week[0].day}${week[0].month}`}>
                {week.map((cell) => {
                  const tdClass = [cell.otherMonth ? "p-datepicker-other-month" : "", sameDay(today, cell) ? "p-datepicker-today" : ""]
                    .filter(Boolean)
                    .join(" ");
                  const spanClass = [sameDay(value, cell) ? "p-highlight" : "", cell.otherMonth ? "p-disabled" : ""].filter(Boolean).join(" ");
                  return (
                    <td key={`${cell.day}${cell.month}`} className={tdClass}>
                      <span
                        draggable="false"
                        className={spanClass}
                        tabIndex={cell === focusCell ? 0 : undefined}
                        onClick={() => !cell.otherMonth && selectDate(cell)}
                      >
                        {cell.day}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const overlay = (
    <div ref={overlayRef} role="dialog" className="p-datepicker p-component" {...(attributeSelector ? { [attributeSelector]: "" } : {})}>
      <div className="p-datepicker-group-container">
        <div className="p-datepicker-group">
          <div className="p-datepicker-header">
            {" "}
            <button type="button" className="p-datepicker-prev p-link" onClick={prev}>
              <span className="p-datepicker-prev-icon pi pi-chevron-left"></span>
            </button>{" "}
            <div className="p-datepicker-title">
              {view === "date" && (
                <button type="button" className="p-datepicker-month p-link" onClick={() => setView("month")}>
                  {TITLE_INDENT + MONTHS[current.month] + TITLE_END}
                </button>
              )}{" "}
              {view !== "year" && (
                <button type="button" className="p-datepicker-year p-link" onClick={() => setView("year")}>
                  {TITLE_INDENT + current.year + TITLE_END}
                </button>
              )}{" "}
              {view === "year" && (
                <span className="p-datepicker-decade">{`${TITLE_INDENT}    ${decadeStart} - ${decadeStart + 9}${TITLE_INDENT}`}</span>
              )}
            </div>{" "}
            <button type="button" className="p-datepicker-next p-link" onClick={next}>
              <span className="p-datepicker-next-icon pi pi-chevron-right"></span>
            </button>
          </div>{" "}
          {body}
        </div>
      </div>{" "}
      {view === "month" && (
        <div className="p-monthpicker">
          {MONTHS_SHORT.map((m, i) => (
            <span
              key={m}
              className={`p-monthpicker-month${value && value.getMonth() === i && value.getFullYear() === current.year ? " p-highlight" : ""}`}
              onClick={() => {
                setCurrent((c) => ({ ...c, month: i }));
                setView("date");
              }}
            >
              {CELL_INDENT + m + CELL_END}
            </span>
          ))}
        </div>
      )}{" "}
      {view === "year" && (
        <div className="p-yearpicker">
          {Array.from({ length: 10 }, (_, i) => decadeStart + i).map((y) => (
            <Fragment key={y}>
              <span
                className={`p-yearpicker-year${value && value.getFullYear() === y ? " p-highlight" : ""}`}
                onClick={() => {
                  setCurrent((c) => ({ ...c, year: y }));
                  setView("month");
                }}
              >
                {CELL_INDENT + y + CELL_END}
              </span>
            </Fragment>
          ))}
        </div>
      )}{" "}
    </div>
  );

  return (
    <span
      ref={wrapperRef}
      {...{ [scope]: "" }}
      className={`p-calendar p-component p-inputwrapper${filled ? " p-inputwrapper-filled" : ""}${focused ? " p-inputwrapper-focus" : ""}`}
    >
      <input
        ref={inputRef}
        className={`p-inputtext p-component${filled ? " p-filled" : ""}`}
        type="text"
        inputMode="none"
        onFocus={() => {
          setFocused(true);
          show();
        }}
        onClick={show}
        onBlur={(e) => {
          setFocused(false);
          e.currentTarget.value = value ? formatDate(value) : "";
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") hide();
          if (e.key === "Tab") hide();
        }}
        onInput={(e) => {
          const parsed = parseDate(e.currentTarget.value);
          if (parsed) {
            typing.current = true;
            onChange(parsed);
          }
        }}
      />{" "}
      {rendered && overlay}
    </span>
  );
}
