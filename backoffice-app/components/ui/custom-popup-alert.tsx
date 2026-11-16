"use client";
/* eslint-disable @next/next/no-img-element -- original markup: plain <img> icon */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "./cx";

// "edit-3": the redeem-points page's popups (icon-edit-3.png)
export type PopupAlertType = "on" | "off" | "delete" | "error" | "success" | "edit" | "edit-3";

export type PopupAlertOptions = {
  title: ReactNode;
  type: PopupAlertType; // icon /assets/images/mission/system-popup-alert/icon-{type}.png
  message: ReactNode;
  needConfirmation?: boolean; // Cancel + Confirm (or Edit) instead of a single Close
  loading?: boolean; // Confirm does not close the popup; call hide(true) yourself
  loadingId?: string; // id put on the Confirm button when loading
};

export type PopupAlertResult = "confirmed" | "cancelled";

type Shown = PopupAlertOptions & { state: string };

// CustomPopupAlert (scriptmission.js). The original rejects with 'cancelled' on Cancel; here the
// promise always resolves with "confirmed" or "cancelled" so pages don't need try/catch.
// const [popupAlert, popupAlertHolder] = useCustomPopupAlert();  render {popupAlertHolder};
// const result = await popupAlert.show({ title, type: "delete", message, needConfirmation: true });
export function useCustomPopupAlert() {
  const [shown, setShown] = useState<Shown | null>(null);
  const [target, setTarget] = useState<Element | null>(null);
  const resolver = useRef<((result: PopupAlertResult) => void) | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Appended to .main-content like the original (its padding-left follows the sidebar width)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setTarget(document.querySelector(".main-content")));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const hide = useCallback((hideLoading = false) => {
    setShown((current) => {
      if (!current || (current.loading && !hideLoading)) return current;
      return { ...current, state: "animate-out" };
    });
    // Removed from the DOM 800 ms later
    timers.current.push(setTimeout(() => setShown((current) => (current?.state === "animate-out" ? null : current)), 800));
  }, []);

  const show = useCallback((options: PopupAlertOptions) => {
    return new Promise<PopupAlertResult>((resolve) => {
      resolver.current = resolve;
      setShown({ ...options, state: "" });
      // "show animate-in" is added 10 ms after insertion so the transition runs
      timers.current.push(setTimeout(() => setShown((current) => current && { ...current, state: "show animate-in" }), 10));
    });
  }, []);

  const answer = (result: PopupAlertResult, hideLoading: boolean) => {
    hide(hideLoading);
    resolver.current?.(result);
    resolver.current = null;
  };

  const holder =
    shown && target
      ? createPortal(
          <div className={cx("system-popup-alert", shown.state)}>
            <div className="system-popup-alert-content">
              <div className="system-popup-alert-content-header">
                <h4>{shown.title}</h4>
              </div>
              <div className="system-popup-alert-content-inner">
                <div className="system-popup-alert-content-inner-text">
                  <img src={`/assets/images/mission/system-popup-alert/icon-${shown.type}.png`} alt="" />
                  <p>{shown.message}</p>
                </div>
                {shown.needConfirmation ? (
                  <div className="system-popup-alert-btns confirm">
                    <button className="mission-btn-outline system-popup-alert-btn-cancel" onClick={() => answer("cancelled", true)}>
                      Cancel
                    </button>
                    <button
                      className="mission-btn system-popup-alert-btn-confirm"
                      id={shown.loading ? shown.loadingId : undefined}
                      onClick={() => answer("confirmed", false)}
                    >
                      {shown.type === "edit" ? "Edit" : "Confirm"}
                    </button>
                  </div>
                ) : (
                  <div className="system-popup-alert-btns">
                    <button className="mission-btn system-popup-alert-btn-confirm" onClick={() => answer("cancelled", true)}>
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>,
          target,
        )
      : null;

  return [{ show, hide }, holder] as const;
}
