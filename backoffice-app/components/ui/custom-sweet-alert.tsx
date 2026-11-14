"use client";
/* eslint-disable @next/next/no-img-element -- original markup: plain <img> banner/avatar */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseIcon32 } from "./icons";
import { usePopup, type PopupDismiss } from "./popup";
import { cx } from "./cx";

export type SweetAlertType = "saving" | "success" | "danger" | "loading";

export type SweetAlertOptions = {
  type?: SweetAlertType | null; // sets /assets/images/swal/banner-{type}.png + icon-{type}.png
  title?: ReactNode;
  titleColor?: string; // default: #F64646 for danger, #00C17C for success
  text?: ReactNode;
  textColor?: string;
  bannerSrc?: string;
  avatarSrc?: string;
  customHtml?: ReactNode; // .swal-custom content
  showConfirmButton?: boolean; // default true
  showCancelButton?: boolean; // default true
  confirmText?: string; // default "ยืนยัน"
  cancelText?: string; // default "ยกเลิก"
  closeOnBackdrop?: boolean; // default true
  timer?: number; // ms, auto close (0 = never)
  // Original "ajaxConfirm": runs on confirm while the loading body shows. Return true to keep the
  // swal open (e.g. to open() it again with a result). Nothing is saved anywhere — use mock data.
  onConfirm?: () => Promise<boolean | void> | boolean | void;
  loadingOnConfirm?: boolean; // default true (original "ajaxLoading")
};

export type SweetAlertResult = { dismiss: PopupDismiss; isConfirmed?: boolean };

const TYPES: SweetAlertType[] = ["saving", "success", "danger", "loading"];

// Body shown while onConfirm runs (CustomSweetAlert.loadingHtml)
function LoadingBody() {
  return (
    <div className="text-center">
      <lord-icon className="swal-loading" src="/assets/images/swal/save-file.json" trigger="loop"></lord-icon>
      <p className="h4 text-purple-30 mb-2">เรากำลังทำงานอย่างหนักเพื่อคุณ !</p>
      <p className="text-gray30">
        อดใจอีกสักนิดนะคะ...ระบบกำลังบันทึก การเปลี่ยนแปลง,
        <br />
        ตั้งค่า หรือแก้ไข ข้อมูลต่าง ๆ ตามที่คุณต้องการ ใช้เวลาไม่นานค่ะ
      </p>
    </div>
  );
}

// const [swal, swalHolder] = useCustomSweetAlert();
// render {swalHolder} anywhere; then: const result = await swal.open({ type: "saving", title: "…" });
// The holder portals one <div class="system-swal"> into <body>, like `new CustomSweetAlert()` does.
export function useCustomSweetAlert() {
  const [options, setOptions] = useState<SweetAlertOptions>({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const resolver = useRef<((result: SweetAlertResult) => void) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const settled = useRef<SweetAlertResult | null>(null);

  const popup = usePopup({
    onClosed: (reason) => {
      clearTimeout(timer.current);
      const result = settled.current ?? { dismiss: reason };
      settled.current = null;
      resolver.current?.(result);
      resolver.current = null;
    },
  });
  const { open: openPopup, close: closePopup } = popup;

  // Portals need document.body, which only exists after hydration
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const open = useCallback(
    (next: SweetAlertOptions) =>
      new Promise<SweetAlertResult>((resolve) => {
        resolver.current?.({ dismiss: "closeImmediately" });
        resolver.current = resolve;
        settled.current = null;
        setOptions(next);
        setLoading(false);
        openPopup({ closeOnBackdrop: next.closeOnBackdrop ?? true });
        clearTimeout(timer.current);
        if (next.timer && next.timer > 0) timer.current = setTimeout(() => closePopup("timeout"), next.timer);
      }),
    [openPopup, closePopup],
  );

  const finishWith = useCallback(
    (result: SweetAlertResult) => {
      settled.current = result;
      closePopup(result.dismiss);
    },
    [closePopup],
  );

  const confirm = async () => {
    if (options.onConfirm) {
      if (options.loadingOnConfirm ?? true) setLoading(true);
      const keepOpen = await options.onConfirm();
      if (keepOpen) return;
    }
    finishWith({ dismiss: "confirm", isConfirmed: true });
  };

  const api = { open, close: () => finishWith({ dismiss: "close" }), renderLoading: () => setLoading(true) };

  const type = options.type && TYPES.includes(options.type) ? options.type : null;
  const banner = options.bannerSrc ?? (type ? `/assets/images/swal/banner-${type}.png` : undefined);
  const avatar = options.avatarSrc ?? (type ? `/assets/images/swal/icon-${type}.png` : undefined);
  const titleColor = options.titleColor ?? (type === "danger" ? "#F64646" : type === "success" ? "#00C17C" : undefined);
  const showConfirm = options.showConfirmButton ?? true;
  const showCancel = options.showCancelButton ?? true;
  const hide = { display: "none" } as const;

  const holder = mounted
    ? createPortal(
        <div className={cx("system-swal", popup.wrapperState)} onMouseDown={popup.onWrapperMouseDown}>
          <div className="swal-wrapper">
            <div className={cx("swal-content", popup.contentState)} onAnimationEnd={popup.onAnimationEnd}>
              <div className="swal-close" onClick={() => finishWith({ dismiss: "close" })}>
                <CloseIcon32 />
              </div>
              <img draggable="false" className="swal-banner" src={banner} style={banner ? undefined : hide} alt="" />
              <img
                draggable="false"
                className="swal-avatar"
                src={avatar}
                style={avatar && !loading ? undefined : hide}
                alt=""
              />
              <div className="swal-inner">
                <h4 className="swal-title mb-2" style={options.title && !loading ? { color: titleColor } : hide}>
                  {options.title}
                </h4>
                <p className="swal-text p3 mb-0" style={options.text && !loading ? { color: options.textColor } : hide}>
                  {options.text}
                </p>
                <div className="swal-custom mb-0" style={loading || options.customHtml ? undefined : hide}>
                  {loading ? <LoadingBody /> : options.customHtml}
                </div>
                <div
                  className="swal-btns"
                  style={
                    loading || !(showConfirm || showCancel)
                      ? hide
                      : showConfirm && showCancel
                        ? undefined
                        : { justifyContent: "center" }
                  }
                >
                  <button
                    className="swal-btn-cancel btn system-btn btn-a btn-rounded"
                    style={showCancel ? undefined : hide}
                    onClick={() => finishWith({ dismiss: "cancel" })}
                  >
                    {showCancel ? (options.cancelText ?? "ยกเลิก") : ""}
                  </button>
                  <button
                    className="swal-btn-confirm btn system-btn btn-rounded"
                    style={showConfirm ? undefined : hide}
                    onClick={confirm}
                  >
                    {showConfirm ? (options.confirmText ?? "ยืนยัน") : ""}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return [api, holder] as const;
}
