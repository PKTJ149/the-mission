"use client";

import type { InputHTMLAttributes } from "react";

type ToggleSwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
  // "minigame": div.custom-switch.switch-alone.form-check.form-switch > input.form-check-input
  // "mission":  div.mission-switch-btn > input.mission-switch-check-input
  variant?: "minigame" | "mission";
  inputClassName?: string; // extra input classes, e.g. "status-minigame-checkbox"
  wrapperClassName?: string; // replaces the wrapper classes if a page uses another combination
};

export function ToggleSwitch({
  checked,
  onChange,
  variant = "minigame",
  inputClassName,
  wrapperClassName,
  ...inputProps
}: ToggleSwitchProps) {
  const mission = variant === "mission";
  const wrapper = wrapperClassName ?? (mission ? "mission-switch-btn" : "custom-switch switch-alone form-check form-switch");
  const base = mission ? "mission-switch-check-input" : "form-check-input";

  return (
    <div className={wrapper}>
      <input
        {...inputProps}
        className={inputClassName ? `${base} ${inputClassName}` : base}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </div>
  );
}
