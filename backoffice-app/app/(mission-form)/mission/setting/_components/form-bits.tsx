"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img>, often without alt */

import { useState, type ChangeEvent, type ReactNode } from "react";
import { cx } from "@/components/ui";

// .box-warning-mission: a 40 px yellow "!" tile that expands to show its text when clicked;
// the × collapses it again (styles in mission.css, .expanded)
export function WarningBox({ className, hidden, children }: { className?: string; hidden?: boolean; children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={cx("box-warning-mission", className, expanded && "expanded", hidden && "d-none")} onClick={() => setExpanded(true)}>
      <div className="icon-warning-mission">
        <img src="/assets/images/mission/icon-warning.png" width="32" height="32" />
      </div>
      <div className="box-warning-mission-text">{children}</div>
      <div
        className="btn-close-warning-mission"
        onClick={(event) => {
          event.stopPropagation();
          setExpanded(false);
        }}
      >
        <img src="/assets/images/mission/icon-close-warning.png" width="20" height="20" />
      </div>
    </div>
  );
}

// handleFileMission(event): previews the picked image locally. Nothing is uploaded.
export function previewFile(event: ChangeEvent<HTMLInputElement>, onPreview: (url: string) => void) {
  const file = event.target.files?.[0];
  if (file) onPreview(URL.createObjectURL(file));
  event.target.value = "";
}

// Error text under a field: display block when invalid (the original toggles element.style.display)
export function Feedback({
  id,
  show,
  i18nKey,
  className = "invalid-feedback mission-page",
  children,
}: {
  id?: string;
  show: boolean;
  i18nKey?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className} id={id} data-i18n={i18nKey} style={{ display: show ? "block" : "none" }}>
      {children}
    </div>
  );
}

// "ลบ" button in repeated item headers (hidden while there is only one item)
export function DeleteButton({ className = "group-btn-delete", show, onClick, size = 20, children }: {
  className?: string;
  show: boolean;
  onClick: () => void;
  size?: number;
  children: ReactNode;
}) {
  return (
    <div className={className} onClick={onClick} style={{ display: show ? undefined : "none" }}>
      <img src="/assets/images/mission/icon-trash.png" alt="ลบ" width={size} height={size} />{" "}
      {children}
    </div>
  );
}
