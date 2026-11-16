"use client";
/* eslint-disable @next/next/no-img-element -- original markup: plain <img> icons */

import { useRef, useState, type ReactNode } from "react";
import { cx, GoogleDropdown, useSystemPopup, type DropdownItem } from "@/components/ui";
import { useFloatingDropdown } from "@/components/ui/use-floating-dropdown";
import { useT } from "@/lib/i18n";
import { addManualReward, searchCustomers, type Customer, type ManualMissionOption } from "@/lib/api/mission-reports";

type PopupControl = ReturnType<typeof useSystemPopup>;

type ManualRewardPopupProps = {
  control: PopupControl; // opens #openModalManual (the "Manual" button)
  options: ManualMissionOption[];
};

// The page script of /mission/report (read on staging 15/11/2026) drives three .system-popup-alert
// boxes that live in .main-content and only toggle the "show" class (no bounce animation):
// #openModalManual (form) → ยืนยัน → #openModalManualCheck (summary) → ยืนยัน → #openModalManualSuscess.
export function ManualRewardPopup({ control, options }: ManualRewardPopupProps) {
  const t = useT();
  const [customer, setCustomer] = useState<(DropdownItem & { customer: Customer }) | null>(null);
  const [mission, setMission] = useState<ManualMissionOption | null>(null);
  const [step, setStep] = useState<"form" | "check" | "success" | null>(null);

  // The form is opened by the parent's control; the other two boxes by this component
  const formOpen = control.isOpen && step !== "check" && step !== "success";

  // onBtnCancle(): hides the form and the summary. ORIGINAL: the picked values are kept.
  const cancel = () => {
    control.close();
    setStep(null);
  };

  // onBtnConfirm(): /mission/mission-manual-check, then the summary box.
  // ORIGINAL BUG (kept on purpose, PK 15/11/2026): there is no validation — with an empty field
  // getData() returns null, the script throws and nothing happens. The fix would be to show the
  // fields' invalid-feedback messages.
  const confirm = () => {
    if (!customer || !mission) return;
    setStep("check");
  };

  // onBtnConfirmCheck(): /mission/mission-manual-add (mock: kept in memory), then the success box.
  // ORIGINAL: the table is not reloaded afterwards.
  const confirmCheck = async () => {
    if (!customer || !mission) return;
    await addManualReward({ customer: customer.customer, missionId: mission.id });
    control.close();
    setStep("success");
  };

  // onBtnClose()
  const close = () => setStep(null);

  return (
    <>
      <div id="openModalManual" className={cx("system-popup-alert", formOpen && "show")}>
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
                onChange={(item) => setCustomer(item as typeof customer)}
                onSearch={async (keyword) =>
                  (await searchCustomers(keyword)).map((c) => ({ value: c.id, label: `${c.username} : ${c.name}`, customer: c }))
                }
                // minimumCharecterSearch: 3 in the page script
                minimumCharacters={3}
                unpositioned
              >
                <div className="invalid-feedback"></div>
              </GoogleDropdown>
            </div>
            <div className="custom-input group-input w-100">
              <div className="d-flex align-items-center justify-content-between">
                <label className="form-label labal mission-page">{t("missionReportPage.missionGiven", "ภารกิจที่จะให้รางวัล *")}</label>
              </div>
              <div className="custom-input custom-float pb-2">
                <MissionSelect options={options} value={mission} onChange={setMission}>
                  <div className="invalid-feedback" id="error-selectAgentDropdown" style={{ display: "none" }}>
                    {t("missionReportPage.usernameErrorText", "ระบุยูซเซอร์เนม")}
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

      <div id="openModalManualCheck" className={cx("system-popup-alert", step === "check" && "show")}>
        <div className="system-popup-alert-content">
          <div className="system-popup-alert-content-header">
            <h4 className="mission-page">{t("missionReportPage.rewardManualReport", "สรุปการเพิ่มรางวัลให้สมาชิก (Manual)")}</h4>
          </div>
          <div className="system-popup-alert-content-inner w-100">
            <div className="modal-check-text">
              <div className="fw-700">
                <div className="fw-700 mission-page" style={{ paddingBottom: "15px" }}>
                  {t("missionReportPage.addRewardMission", "คุณกำลังเพิ่มรางวัลภารกิจ")}
                </div>
                <div className="fw-700 mission-page" style={{ paddingBottom: "15px" }}>
                  {t("missionReportPage.toMember", "ให้กับสมาชิก")}
                </div>
                <div className="fw-700 mission-page" style={{ paddingBottom: "15px" }}>
                  {t("missionReportPage.rewardGiven", "รางวัลที่ได้รับ")}
                </div>
              </div>
              <div className="fw-400">
                {/* Server values (result.data.name / .username) were not seen: picked mission name and username (guess) */}
                <div style={{ color: "#72DCD9", paddingBottom: "15px" }} id="missionName">
                  {step === "check" ? mission?.name : " "}
                </div>
                <div style={{ color: "#72DCD9", paddingBottom: "15px" }} id="username">
                  {step === "check" ? customer?.customer.username : " "}
                </div>
                {/* One .rewards (24px icon + text) per reward; the missions offered here have none on staging */}
                <div id="reward" className="modal-icon-reward"> </div>
              </div>
            </div>
            <div className="system-popup-alert-btns confirm">
              <button className="mission-btn-outline system-popup-alert-btn-cancel mission-page" onClick={cancel}>
                {t("missionReportPage.cancel", "ยกเลิก")}
              </button>
              <button className="mission-btn system-popup-alert-btn-confirm-check mission-page" onClick={confirmCheck}>
                {t("missionReportPage.confirm", "ยืนยัน")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="openModalManualSuscess" className={cx("system-popup-alert", step === "success" && "show")}>
        <div className="system-popup-alert-content">
          <div className="system-popup-alert-content-header">
            <h4 className="mission-page">{t("missionReportPage.rewardManualReport", "สรุปการเพิ่มรางวัลให้สมาชิก (Manual)")}</h4>
          </div>
          <div className="system-popup-alert-content-inner w-100">
            <div className="system-popup-alert-content-inner-text">
              <img src="/assets/images/mission/system-popup-alert/icon-vector.png" alt="" />
              <p className="mission-page">
                {t(
                  "missionReportPage.manualReportSubText",
                  "ระบบได้ทำการโอนของราวงัลให้สมาชิกที่ท่านต้องการเรียบร้อย โดยเงื่อนไขของรางวัลนั้นเป็นไปตามที่ ตัวท่านได้กำหนดไว้ตามภารกิจที่ท่านเลือก",
                )}
              </p>
            </div>
            <div className="system-popup-alert-btns confirm">
              <button className="mission-btn system-popup-alert-btn-close mission-page" onClick={close}>
                {t("missionReportPage.close", "ปิดหน้าต่าง")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type MissionSelectProps = {
  options: ManualMissionOption[];
  value: ManualMissionOption | null;
  onChange: (option: ManualMissionOption) => void;
  children: ReactNode;
};

// No anchor = the floating hook never positions the list
const NO_ANCHOR = { current: null };

// #dropdownSelectMission: missions in bold, their sub-missions indented. Its toggler is an <img>,
// not the usual chevron, so it is built here instead of with the shared CustomDropdown.
// ORIGINAL BUG (kept on purpose, PK 15/11/2026): the page passes root: '#openModalManual' (a string),
// so CustomDropdown.calculate() throws and the list is never positioned: it keeps "inset: auto" and
// its natural width under the field. The fix would be to pass the element.
function MissionSelect({ options, value, onChange, children }: MissionSelectProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdown = useFloatingDropdown({
    anchorRef: NO_ANCHOR,
    dropdownRef,
    isOwnTarget: (target) => target.closest(".dropdown-toggler, .input-fake")?.parentElement === wrapperRef.current,
  });

  return (
    <div
      ref={wrapperRef}
      className={cx("custom-dropdown-wrapper custom-input dropdown-wrapper", value ? "fill" : "empty")}
      id="dropdownSelectMission"
    >
      <div className={cx("dropdown-toggler dropdown-toggler-mission", dropdown.show && "toggled")} onClick={dropdown.toggle}>
        <img src="/assets/images/mission/icon-arrow-down.png" width="24" height="24" alt="" />
      </div>
      <div className="input-fake" onClick={dropdown.toggle}>
        {value?.name}
      </div>
      <div ref={dropdownRef} className={cx("custom-dropdown", dropdown.stateClassName)} style={{ inset: "auto" }}>
        <div className="custom-dropdown-body" id="mission-dropdown-body">
          {options.map((option) => (
            <div
              key={option.id}
              data-status={option.kind}
              data-value={option.id}
              data-chip={option.name}
              className={cx("custom-dropdown-item", option.kind === "mission" && "fw-700", option.id === value?.id && "selected")}
              style={option.kind === "sub-mission" ? { paddingLeft: "2rem" } : undefined}
              onClick={() => {
                onChange(option);
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
