"use client";

import type { ReactNode } from "react";
import { CloseIcon32 } from "./icons";
import { usePopup, type PopupControl, type PopupDismiss } from "./popup";
import { cx } from "./cx";

// const modal = useCustomModal();  modal.open();  modal.close();
export function useCustomModal(options: { closeOnBackdrop?: boolean; onClosed?: (reason: PopupDismiss) => void } = {}) {
  return usePopup(options);
}

type CustomModalProps = {
  control: PopupControl; // from useCustomModal()
  id?: string; // e.g. "modalShowWheelDetail"
  wrapperClassName?: string; // extra .modal-wrapper classes, e.g. "modal-wrapper-custom-width"
  children: ReactNode; // banner / avatar <img>s and .modal-inner, exactly as the page captured them
};

// CustomModal (helper.js): .system-modal > .modal-wrapper > .modal-container > .modal-close + content.
// Rendered in place (the original keeps it inside .main-content); opens with the shared backdrop.
export function CustomModal({ control, id, wrapperClassName, children }: CustomModalProps) {
  return (
    <div id={id} className={cx("system-modal", control.wrapperState)} onMouseDown={control.onWrapperMouseDown}>
      <div className={cx("modal-wrapper", wrapperClassName)}>
        <div className={cx("modal-container", control.contentState)} onAnimationEnd={control.onAnimationEnd}>
          <div className="modal-close" onClick={() => control.close("close")}>
            <CloseIcon32 />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
