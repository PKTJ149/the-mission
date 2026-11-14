"use client";

import { useEffect, useRef } from "react";
import type { Instance } from "flatpickr/dist/types/instance";
import { cx } from "@/components/ui";

type FlatpickrInputProps = {
  id: string;
  className: string; // e.g. "form-control custom-date-flatpickr flatpickr-input date-picker"
  kind: "date" | "time";
  value: string; // "d/m/Y" or "H:i"
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
};

// The original's [data-provider="flatpickr"] (d/m/Y) and [data-provider="timepickr"]
// (noCalendar, enableTime, time_24hr, H:i) inputs. flatpickr 4.6.13, styled by material.app.min.css.
export function FlatpickrInput({ id, className, kind, value, onChange, placeholder, disabled }: FlatpickrInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const picker = useRef<Instance | null>(null);
  const latest = useRef(onChange);

  useEffect(() => {
    latest.current = onChange;
  });

  useEffect(() => {
    let cancelled = false;
    // flatpickr touches window, so it is loaded in the browser only
    import("flatpickr").then(({ default: flatpickr }) => {
      if (cancelled || !inputRef.current) return;
      const options =
        kind === "date"
          ? { dateFormat: "d/m/Y" }
          : { noCalendar: true, enableTime: true, time_24hr: true, dateFormat: "H:i" };
      picker.current = flatpickr(inputRef.current, {
        ...options,
        defaultDate: inputRef.current.value || undefined,
        onChange: (_dates, text) => latest.current(text),
      });
    });
    return () => {
      cancelled = true;
      picker.current?.destroy();
      picker.current = null;
    };
  }, [kind]);

  // Values set from outside (all-day tick, copy, reset) are pushed into the picker
  useEffect(() => {
    const instance = picker.current;
    if (instance && instance.input.value !== value) instance.setDate(value || [], false);
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="text"
      id={id}
      className={cx(className)}
      data-provider={kind === "date" ? "flatpickr" : "timepickr"}
      data-date-format={kind === "date" ? "d/m/Y" : "H:i"}
      {...(kind === "time" ? { "data-no-calendar": "true", "data-enable-time": "true", "data-time_24hr": "true" } : {})}
      value={value}
      placeholder={placeholder}
      readOnly
      disabled={disabled}
      onChange={() => undefined}
    />
  );
}
