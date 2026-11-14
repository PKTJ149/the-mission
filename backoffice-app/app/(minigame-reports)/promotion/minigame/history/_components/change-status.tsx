"use client";

/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { CustomModal, cx, type useCustomModal } from "@/components/ui";
import { positionDropdown } from "@/components/ui/use-floating-dropdown";

// The two hidden pairs that sit after .page-content on /promotion/minigame/history:
// #dropdownChangeStatusPromotion + #modalConfirmChangeStatus (row "รอใช้โปร") and the same with the
// suffix "CancelPromotion" (row "ใช้โปรแล้ว"). The page's own script was not captured; the flow here is
// label → dropdown → "ยกเลิก" → confirm modal with a required reason.

export type ChangeStatusVariant = "" | "CancelPromotion";

// --border-color is set inline by the original JS (value not captured): the warning label colour
const WRAPPER_STYLE = { "--border-color": "#CCAB00" } as CSSProperties;
// Width of the two modal buttons (inline, not captured) — estimated from the screenshots
const BUTTON_STYLE: CSSProperties = { width: "110px" };

const ITEMS: Record<ChangeStatusVariant, { value: string; text: string }[]> = {
  "": [
    { value: "Waiting", text: "รอใช้โปร" },
    { value: "Cancel", text: "ยกเลิก" },
  ],
  // ORIGINAL: this variant also uses data-value="Waiting" for "ใช้โปรแล้ว"
  CancelPromotion: [
    { value: "Waiting", text: "ใช้โปรแล้ว" },
    { value: "Cancel", text: "ยกเลิก" },
  ],
};

type StatusMenuProps = {
  variant: ChangeStatusVariant;
  anchor: HTMLElement | null; // the clicked label; null = closed
  onPick: (value: string) => void;
  onClose: () => void;
};

// CustomDropdown (position: fixed, placed under the label) with the "เลือกเปลี่ยนสถานะ :" title
export function StatusMenu({ variant, anchor, onPick, onClose }: StatusMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const latestClose = useRef(onClose);

  useEffect(() => {
    latestClose.current = onClose;
  });

  useLayoutEffect(() => {
    const dropdown = ref.current;
    if (!anchor || !dropdown) return;
    const place = () => positionDropdown(dropdown, anchor);
    // Clicks on the label toggle it themselves (see the page); any other outside click closes
    const dismiss = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdown.contains(target) || anchor.contains(target)) return;
      latestClose.current();
    };
    place();
    document.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    window.addEventListener("mousedown", dismiss);
    return () => {
      document.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
      window.removeEventListener("mousedown", dismiss);
    };
  }, [anchor]);

  return (
    <div id={`dropdownChangeStatusPromotion${variant}`} className="dropdown-wrapper dropdown-xs" style={WRAPPER_STYLE}>
      <div ref={ref} className={cx("custom-dropdown", anchor && "show")}>
        <p className="custom-dropdown-title p4 text-gray30">เลือกเปลี่ยนสถานะ :</p>
        <div className="custom-dropdown-body">
          {ITEMS[variant].map((item, index) => (
            <div
              key={item.value}
              data-value={item.value}
              data-chip={item.text}
              className={cx("custom-dropdown-item", index === 0 && "selected")}
              onClick={() => onPick(item.value)}
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type ConfirmModalProps = {
  variant: ChangeStatusVariant;
  control: ReturnType<typeof useCustomModal>;
  onConfirm: (remark: string) => void;
};

// #modalConfirmChangeStatus{variant}: reason required; "ยืนยัน" stays disabled until it is filled
// (validated 500 ms after typing stops, like Helper.debounce(() => validateChangeStatus(), 500)).
export function ConfirmChangeStatusModal({ variant, control, onConfirm }: ConfirmModalProps) {
  const [remark, setRemark] = useState("");
  const [valid, setValid] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(debounce.current), []);

  const reset = () => {
    clearTimeout(debounce.current);
    setRemark("");
    setValid(false);
  };

  const cancel = () => {
    control.close();
    reset();
  };

  return (
    <CustomModal control={control} id={`modalConfirmChangeStatus${variant}`}>
      <img draggable="false" className="modal-banner" src="/assets/images/swal/banner-saving.png" />
      {/* ORIGINAL: both modals reuse the ids changeStatusAvatar / changeStatusTitle / changeStatusText */}
      <img id="changeStatusAvatar" draggable="false" className="modal-avatar" src="/assets/images/swal/status-chang.png" />
      <div className="modal-inner">
        <h3 id="changeStatusTitle" className="mb-2">
          ยืนยันเปลี่ยนสถานะใช่หรือไม่ ?
        </h3>
        <p id="changeStatusText" className="p3 fw-400 text-gray30 mb-20">
          การเปลี่ยนแปลงสถานะ เมื่อเปลี่ยนแล้วจะไม่สามารถเปลี่ยนกลับมาเป็นสถานะเดิมได้อีก
        </p>
        <div className="custom-input mb-3">
          <label className="form-label">
            สาเหตุการยกเลิกโปร <span className="text-red-50">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id={`changeStatusRemark${variant}`}
            placeholder="ระบุสาเหตุการยกเลิกโปร"
            value={remark}
            onChange={(event) => {
              const value = event.target.value;
              setRemark(value);
              clearTimeout(debounce.current);
              debounce.current = setTimeout(() => setValid(value.trim() !== ""), 500);
            }}
          />
          <div className="invalid-feedback"></div>
        </div>
        <div className="text-end">
          <button type="button" className="btn system-btn btn-a btn-rounded" style={BUTTON_STYLE} onClick={cancel}>
            ยกเลิก
          </button>{" "}
          <button
            disabled={!valid}
            id={`buttonConfirmChangeStatus${variant}`}
            type="button"
            className="btn system-btn btn-rounded"
            style={BUTTON_STYLE}
            onClick={() => {
              onConfirm(remark.trim());
              reset();
            }}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
