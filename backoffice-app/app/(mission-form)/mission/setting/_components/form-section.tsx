"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img>, often without alt */

import type { ReactNode } from "react";
import { cx } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { AccordionHeader, Collapse } from "./collapse";

type FormSectionProps = {
  panelId: string; // e.g. "openDropdownMissionSetting1"
  open: boolean;
  onToggle: () => void;
  onHeaderClick?: () => void;
  title: ReactNode; // the .title-mission-setting span
  statusId: string;
  statusI18n: string; // data-i18n of the status text
  valid: boolean;
  headerExtra?: ReactNode; // e.g. the sub-mission delete button (before the arrow)
  mainProps?: Record<string, string | number | undefined>; // id/data-* on .dropdown-main
  before?: ReactNode; // rendered first inside .dropdown-main (sub-mission hidden id input)
  children: ReactNode; // the .group-content-mission-setting-item columns
};

// One accordion section of #dropdownMainMissionSetting:
// .dropdown-main > .dropdown-mission-setting (header) + .box-content-mission-setting.collapse
export function FormSection({
  panelId,
  open,
  onToggle,
  onHeaderClick,
  title,
  statusId,
  statusI18n,
  valid,
  headerExtra,
  mainProps,
  before,
  children,
}: FormSectionProps) {
  const t = useT();
  return (
    <div className="dropdown-main" {...mainProps}>
      {before}
      <AccordionHeader open={open} target={panelId} onToggle={onToggle} onClick={onHeaderClick}>
        <div className="group-title-mission-setting">
          {title}
          <div className="group-mission-setting-status">
            {/* ORIGINAL: when the edit page loads, every section header shows "ข้อมูลไม่สมบูรณ์" even though the
                data is complete, and .group-mission-setting-status is grey, rgb(71, 71, 71). Here the text
                and the .valid colour follow the real state ("ข้อมูลสมบูรณ์" when complete). */}
            <span className={cx("mission-setting-status-title mission-page", valid && "valid")} data-i18n={statusI18n} id={statusId}>
              {valid ? t("missionPage.js.dataComplete", "ข้อมูลสมบูรณ์") : t(statusI18n, "ข้อมูลไม่สมบูรณ์")}
            </span>
            {headerExtra}
            <img src="/assets/images/mission/icon-arrow-down.png" width="32" height="32" className="icon-arrow-down" />
          </div>
        </div>
      </AccordionHeader>
      <Collapse open={open} className="box-content-mission-setting" id={panelId} data-bs-parent="#dropdownMainMissionSetting">
        <div className="group-content-mission-setting" id="rootScrollMission">
          <div className="group-item">{children}</div>
        </div>
      </Collapse>
    </div>
  );
}

// .label-title-bg > span.text-in-label
export function LabelTitle({ className, i18nKey, children }: { className?: string; i18nKey?: string; children: ReactNode }) {
  return (
    <div className={cx("label-title-bg", className)}>
      <span className={cx("text-in-label", i18nKey && "mission-page")} data-i18n={i18nKey}>
        {children}
      </span>
    </div>
  );
}

// .group-switch > .mission-switch-btn > input + span.switch-title
export function SwitchRow({
  id,
  checked,
  onChange,
  className = "switch-title mission-page",
  i18nKey,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  i18nKey?: string;
  children: ReactNode;
}) {
  return (
    <div className="group-switch">
      <div className="mission-switch-btn">
        <input className="mission-switch-check-input" type="checkbox" id={id} checked={checked} onChange={(event) => onChange(event.target.checked)} />
      </div>
      <span className={className} data-i18n={i18nKey}>
        {children}
      </span>
    </div>
  );
}
