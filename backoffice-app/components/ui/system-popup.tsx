"use client";

import { useCallback, useState, type ReactNode } from "react";
import { cx } from "./cx";

// .system-popup (mission.css) — the mission pages' own modal, e.g. #redeemModal on /mission/redeem-points.
// The script that opens it was not captured; it is styled like .system-popup-alert, so it is driven
// the same way: "show animate-in" to open, "animate-out" (without show) to close.
export function useSystemPopup() {
  const [state, setState] = useState("");
  const open = useCallback(() => setState("show animate-in"), []);
  const close = useCallback(() => setState((current) => (current ? "animate-out" : current)), []);
  return { isOpen: state.startsWith("show"), open, close, state };
}

export type SystemPopupControl = ReturnType<typeof useSystemPopup>;

type SystemPopupProps = {
  control: SystemPopupControl;
  id?: string; // e.g. "redeemModal"
  className?: string; // e.g. "redeem-point-modal", "choose-icon-style"
  closeOnBackdrop?: boolean; // unknown in the original; default false
  children: ReactNode; // .system-popup-content > header / inner / .system-popup-btns, as captured
};

export function SystemPopup({ control, id, className, closeOnBackdrop = false, children }: SystemPopupProps) {
  return (
    <div
      id={id}
      className={cx("system-popup", className, control.state)}
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) control.close();
      }}
    >
      {children}
    </div>
  );
}
