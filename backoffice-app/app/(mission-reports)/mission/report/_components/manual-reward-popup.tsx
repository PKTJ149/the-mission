"use client";
/* eslint-disable @next/next/no-img-element -- original markup: plain <img> icon */

import { useRef, useState, type ReactNode } from "react";
import { cx, GoogleDropdown, useSystemPopup, type DropdownItem } from "@/components/ui";
import { useFloatingDropdown } from "@/components/ui/use-floating-dropdown";
import { useT } from "@/lib/i18n";
import { addManualReward, searchMembers, type ManualMissionOption, type RewardReportRow } from "@/lib/api/mission-reports";

type PopupControl = ReturnType<typeof useSystemPopup>;

type ManualRewardPopupProps = {
  control: PopupControl;
  options: ManualMissionOption[];
  onSaved: () => void; // reload the table
};

// #openModalManual — "เพิ่มรางวัลให้สมาชิก (Manual)" (captured open: modals/add-reward-manual_openModalManual_open.html).
// A .system-popup-alert that lives in .main-content and opens with "show" like CustomPopupAlert.
// The page script was not captured, so validation and the result popup are reconstructed (see below).
export function ManualRewardPopup({ control, options, onSaved }: ManualRewardPopupProps) {
  const t = useT();
  const [customer, setCustomer] = useState<DropdownItem | null>(null);
  const [missionId, setMissionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState<RewardReportRow | null>(null);
  const result = useSystemPopup();

  const usernameError = t("missionReportPage.usernameErrorText", "ระบุยูซเซอร์เนม");
  const customerInvalid = submitted && !customer;
  const missionInvalid = submitted && !missionId;

  const reset = () => {
    setCustomer(null);
    setMissionId(null);
    setSubmitted(false);
  };

  const cancel = () => {
    control.close();
    reset();
  };

  const confirm = async () => {
    setSubmitted(true);
    if (!customer || !missionId) return;
    // Mock save: kept in memory only
    const row = await addManualReward({ memberId: customer.value, missionId });
    control.close();
    reset();
    setSaved(row);
    result.open();
    onSaved();
  };

  return (
    <>
      <div id="openModalManual" className={cx("system-popup-alert", control.state)}>
        <div className="system-popup-alert-content">
          <div className="system-popup-alert-content-header">
            <h4 className="mission-page">{t("missionReportPage.addRewardManualHeader", "เพิ่มรางวัลให้สมาชิก (Manual)")}</h4>
          </div>
          <div className="system-popup-alert-content-inner w-100">
            <div className="custom-input group-input w-100">
              <div className="d-flex align-items-center justify-content-between">
                <label className="form-label labal mission-page">{t("missionReportPage.username", "ยูสเซอร์เนม *")}</label>
              </div>
              <GoogleDropdown
                id="manualSelectCustomer"
                inputId="inputSelectCustomer"
                value={customer}
                onChange={setCustomer}
                onSearch={async (keyword) =>
                  (await searchMembers(keyword)).map((member) => ({ value: member.id, label: member.username }))
                }
                invalid={customerInvalid}
              >
                {/* Guess: the original's message for an empty username was not captured */}
                <div className="invalid-feedback">{customerInvalid ? usernameError : ""}</div>
              </GoogleDropdown>
            </div>
            <div className="custom-input group-input w-100">
              <div className="d-flex align-items-center justify-content-between">
                <label className="form-label labal mission-page">{t("missionReportPage.missionGiven", "ภารกิจที่จะให้รางวัล *")}</label>
              </div>
              <div className="custom-input custom-float pb-2">
                <MissionSelect options={options} value={missionId} onChange={setMissionId} invalid={missionInvalid}>
                  {/* ORIGINAL: the mission field's error reuses the username text and the id "error-selectAgentDropdown" */}
                  <div
                    className="invalid-feedback"
                    id="error-selectAgentDropdown"
                    style={{ display: missionInvalid ? "block" : "none" }}
                  >
                    {usernameError}
                  </div>
                </MissionSelect>
              </div>
              <div className="text-start invalid-feedback invalid-feedback-minigame-name"></div>
            </div>
            <div className="system-popup-alert-btns confirm">
              <button className="mission-btn-outline system-popup-alert-btn-cancel" onClick={cancel}>
                {t("missionReportPage.cancel", "ยกเลิก")}
              </button>
              <button className="mission-btn system-popup-alert-btn-confirm" onClick={confirm}>
                {t("missionReportPage.confirm", "ยืนยัน")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ManualRewardResult control={result} row={saved} />
    </>
  );
}

type MissionSelectProps = {
  options: ManualMissionOption[];
  value: string | null;
  onChange: (id: string) => void;
  invalid: boolean;
  children: ReactNode;
};

// #dropdownSelectMission: missions in bold, their sub-missions indented. Its toggler is an <img>,
// not the usual chevron, so it is built here instead of with the shared CustomDropdown.
function MissionSelect({ options, value, onChange, invalid, children }: MissionSelectProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fakeRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdown = useFloatingDropdown({
    anchorRef: fakeRef,
    dropdownRef,
    options: { stretch: true, auto: true },
    isOwnTarget: (target) => target.closest(".dropdown-toggler, .input-fake")?.parentElement === wrapperRef.current,
  });
  const selected = options.find((option) => option.id === value);

  return (
    <div
      ref={wrapperRef}
      className={cx("custom-dropdown-wrapper custom-input dropdown-wrapper", selected ? "fill" : "empty", invalid && "custom-invalid")}
      id="dropdownSelectMission"
    >
      <div className={cx("dropdown-toggler dropdown-toggler-mission", dropdown.show && "toggled")} onClick={dropdown.toggle}>
        <img src="/assets/images/mission/icon-arrow-down.png" width="24" height="24" alt="" />
      </div>
      <div ref={fakeRef} className="input-fake" onClick={dropdown.toggle}>
        {selected?.name}
      </div>
      <div ref={dropdownRef} className={cx("custom-dropdown", dropdown.stateClassName)}>
        <div className="custom-dropdown-body" id="mission-dropdown-body">
          {options.map((option) => (
            <div
              key={option.id}
              data-status={option.kind}
              data-value={option.id}
              data-chip={option.name}
              className={cx("custom-dropdown-item", option.kind === "mission" && "fw-700", option.id === value && "selected")}
              // Indent value not captured (guess)
              style={option.kind === "sub-mission" ? { paddingLeft: "24px" } : undefined}
              onClick={() => {
                onChange(option.id);
                dropdown.close();
              }}
            >
              {option.name}
            </div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

// "สรุปการเพิ่มรางวัลให้สมาชิก (Manual)" shown after a successful save. Only its texts exist
// (missionReportPage.rewardManualReport / addRewardMission / toMember / rewardGiven /
// manualReportSubText / close); the markup is a reconstruction in the same popup style.
function ManualRewardResult({ control, row }: { control: PopupControl; row: RewardReportRow | null }) {
  const t = useT();
  const rewards = row
    ? [
        { label: t("missionReportPage.credit", "เครดิต"), value: row.credit },
        { label: t("missionReportPage.miniGamePoints", "สิทธิ์มินิเกมส์"), value: row.minigameRights },
        { label: t("missionReportPage.promotionPoints", "สิทธิ์โปรโมชั่น"), value: row.promotionRights },
        { label: t("missionReportPage.points", "แต้มสะสม"), value: row.points },
        { label: t("missionReportPage.other", "อื่น ๆ"), value: row.other },
      ].filter((reward) => reward.value > 0)
    : [];

  return (
    <div className={cx("system-popup-alert", control.state)}>
      <div className="system-popup-alert-content">
        <div className="system-popup-alert-content-header">
          <h4 className="mission-page">{t("missionReportPage.rewardManualReport", "สรุปการเพิ่มรางวัลให้สมาชิก (Manual)")}</h4>
        </div>
        <div className="system-popup-alert-content-inner w-100">
          <p className="p1 mb-0">
            <span className="mission-page">{t("missionReportPage.addRewardMission", "คุณกำลังเพิ่มรางวัลภารกิจ")}</span>{" "}
            <b>{row?.missionText}</b> <span className="mission-page">{t("missionReportPage.toMember", "ให้กับสมาชิก")}</span>{" "}
            <b>{row ? row.memberName : ""}</b>
          </p>
          <div className="w-100">
            <p className="p1 fw-700 mb-0 mission-page">{t("missionReportPage.rewardGiven", "รางวัลที่ได้รับ")}</p>
            {rewards.length === 0 ? (
              // The rewards of each mission were not captured, so a mock entry has none
              <span className="redeem-point-reward-wrap">-</span>
            ) : (
              rewards.map((reward) => (
                <span key={reward.label} className="redeem-point-reward-wrap">
                  {reward.label} <b>{reward.value}</b>
                </span>
              ))
            )}
          </div>
          <p className="p3 text-tertiary mb-0 mission-page">
            {t(
              "missionReportPage.manualReportSubText",
              "ระบบได้ทำการโอนของราวงัลให้สมาชิกที่ท่านต้องการเรียบร้อย โดยเงื่อนไขของรางวัลนั้นเป็นไปตามที่ ตัวท่านได้กำหนดไว้ตามภารกิจที่ท่านเลือก",
            )}
          </p>
          <div className="system-popup-alert-btns">
            <button className="mission-btn system-popup-alert-btn-confirm" onClick={control.close}>
              {t("missionReportPage.close", "ปิดหน้าต่าง")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
