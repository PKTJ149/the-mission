"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img>, often without alt */

import { useRef, useState } from "react";
import { cx, FilterCloseIcon, useCustomPopupAlert, useSystemPopup } from "@/components/ui";
import { useFloatingDropdown } from "@/components/ui/use-floating-dropdown";
import { useT } from "@/lib/i18n";
import {
  getMissionFormValues,
  newMissionForm,
  newSubMission,
  type GameProvider,
  type IconStyleGroup,
  type ImageStyleGroup,
  type MissionFormValues,
  type Option,
  type SubMissionForm,
} from "@/lib/api/missions";
import { Feedback } from "./form-bits";
import { FormSection, LabelTitle } from "./form-section";
import { GameTypePopup } from "./game-type-popup";
import { SectionBasic } from "./section-basic";
import { SectionDuration } from "./section-duration";
import { IconStylePopup, ImageStylePopup } from "./style-popups";
import { SubMissionSection } from "./sub-mission";
import { isBasicValid, isDurationValid, isFinishValid, isFormValid, isSubMissionValid } from "./validation";

export type MissionFormData = {
  agents: Option[];
  memberGroups: Option[];
  miniGames: Option[];
  promotions: Option[];
  copyMissions: Option[];
  imageStyles: ImageStyleGroup[];
  iconStyles: IconStyleGroup[];
  providers: GameProvider[];
};

type MissionFormProps = {
  data: MissionFormData;
  initial: MissionFormValues | null; // null = create
  missionId: string;
  edit: boolean;
};

// /mission/setting — create / edit mission. Nothing is sent: "save" only shows the original feedback
// and goes back to /mission.
export function MissionForm({ data, initial, missionId, edit }: MissionFormProps) {
  const t = useT();
  const [form, setForm] = useState<MissionFormValues>(() => initial ?? newMissionForm());
  // Bumped when a whole new set of values is loaded (copy), so editors and pickers start again
  const [version, setVersion] = useState(0);
  const [openPanel, setOpenPanel] = useState<string | null>("basic");
  const [popupAlert, popupAlertHolder] = useCustomPopupAlert();
  const [popupAlertSecond, popupAlertSecondHolder] = useCustomPopupAlert();

  const imagePopup = useSystemPopup();
  const iconPopup = useSystemPopup();
  const gamePopup = useSystemPopup();
  const iconTarget = useRef<(icon: string) => void>(() => undefined);
  const gameTarget = useRef<(selected: string[]) => void>(() => undefined);
  const [gameSelection, setGameSelection] = useState<{ selected: string[]; session: number }>({ selected: [], session: 0 });

  const set = (patch: Partial<MissionFormValues>) => setForm((current) => ({ ...current, ...patch }));
  const toggle = (panel: string) => () => setOpenPanel((current) => (current === panel ? null : panel));
  const setSub = (index: number, sub: SubMissionForm) =>
    setForm((current) => ({ ...current, subMissions: current.subMissions.map((s, i) => (i === index ? sub : s)) }));

  const chooseIcon = (apply: (icon: string) => void) => {
    iconTarget.current = apply;
    iconPopup.open();
  };
  const chooseGameType = (selected: string[], apply: (selected: string[]) => void) => {
    gameTarget.current = apply;
    setGameSelection((current) => ({ selected, session: current.session + 1 }));
    gamePopup.open();
  };

  // saveMission()
  const save = async () => {
    if (!isFormValid(form)) {
      await popupAlert.show({
        title: t("missionPage.js.error2", "ทำรายการไม่สำเร็จ !"),
        type: "error",
        message: t("missionPage.js.errorMsg3", "กรุณาตรวจสอบข้อมูลภารกิจของคุณ"),
        needConfirmation: false,
      });
      return;
    }
    if (edit) {
      const result = await popupAlert.show({
        title: t("missionPage.js.missionEditConfirm", "ยืนยันบันทึกการแก้ไขภารกิจ หรือไม่ ?"),
        type: "edit",
        message: t(
          "missionPage.js.missionMsg2",
          "การบันทึกการแก้ไขภารกิจนี้ไม่ส่งผลต่อ ภารกิจของสมาชิกที่ยังทำไม่สำเร็จ เมื่อบันทึกแล้วสมาชิกยังสามารถทำภารกิจต่อไปได้ โดยไม่ต้องเริ่มทำภารกิจใหม่",
        ),
        needConfirmation: true,
      });
      if (result !== "confirmed") return;
    }
    // Mock save — nothing is sent
    await popupAlertSecond.show({
      title: edit
        ? t("missionPage.js.missionEditPass", "บันทึกการแก้ไขภารกิจ สำเร็จ !")
        : t("missionPage.js.missionCreatePass", "บันทึกการสร้างภารกิจ สำเร็จ !"),
      type: "success",
      message: edit
        ? t("missionPage.js.missionEditPassMsg", "ระบบได้ทำการแก้ไขภารกิจ ตามการตั้งค่าของคุณ เรียบร้อยแล้ว")
        : t("missionPage.js.missionCreatePassMsg", "ระบบได้ทำการสร้างภารกิจ ตามการตั้งค่าของคุณ เรียบร้อยแล้ว"),
      needConfirmation: false,
    });
    // Full page load like the original (the target page has another root layout)
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/mission");
  };

  // "ยินยันคัดลอก": load the chosen mission's settings into the form
  const copyFrom = async (id: string) => {
    const values = await getMissionFormValues(id);
    if (!values) return;
    setForm(values);
    setVersion((v) => v + 1);
  };

  return (
    <div className="page-content">
      <div className="container-fluid full-container">
        <svg width="0" height="0" viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="filter-gradient" x1="7.91113" y1="0.666748" x2="7.91113" y2="17.3334" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#50A198"></stop>
              <stop offset="1" stopColor="#FEDB6B"></stop>
            </linearGradient>
          </defs>
        </svg>
        <div className="inner-container full-flex">
          <div className="custom-card full-card full-flex">
            <div className="title-header-custom-mission">
              <div className="group-title-header">
                <h4 className="mb-0 mission-page" data-i18n="missionPage.title">
                  {t("missionPage.title", "ตั้งค่าภารกิจ")}
                </h4>
                <div className="group-title-header-path">
                  <img src="/assets/images/mission/icon-mission.png" width="24" height="24" />
                  <span>
                    <span className="mission-page" data-i18n="missionPage.missionListHeader">
                      {t("missionPage.missionListHeader", "รายชื่อภารกิจ")}
                    </span>{" "}
                    &gt;{" "}
                    {/* ORIGINAL: the edit page also reads "สร้างภารกิจ" */}
                    <span className="text-teal-green mission-page" data-i18n="missionPage.createMission">
                      {t("missionPage.createMission", "สร้างภารกิจ")}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <CopyMissionPicker missions={data.copyMissions} onCopy={copyFrom} />
            <div className="group-content-page">
              <div className="main-content-setting-mission" id="dropdownMainMissionSetting" key={version}>
                <SectionBasic
                  form={form}
                  set={set}
                  open={openPanel === "basic"}
                  onToggle={toggle("basic")}
                  valid={isBasicValid(form)}
                  agents={data.agents}
                  memberGroups={data.memberGroups}
                  previewDate={previewDate(form)}
                  onChooseCover={imagePopup.open}
                />
                <SectionDuration
                  form={form}
                  set={set}
                  open={openPanel === "duration"}
                  onToggle={toggle("duration")}
                  valid={isDurationValid(form)}
                  miniGames={data.miniGames}
                  promotions={data.promotions}
                  onChooseIcon={chooseIcon}
                />
                <div className="group-box-sub-mission" id="group-box-sub-mission">
                  {form.subMissions.map((sub, index) => (
                    <SubMissionSection
                      key={sub.id}
                      sub={sub}
                      no={index + 1}
                      canDelete={form.subMissions.length > 1}
                      open={openPanel === `sub-${sub.id}`}
                      onToggle={toggle(`sub-${sub.id}`)}
                      valid={isSubMissionValid(sub)}
                      miniGames={data.miniGames}
                      promotions={data.promotions}
                      onChange={(next) => setSub(index, next)}
                      onDelete={() => set({ subMissions: form.subMissions.filter((_, i) => i !== index) })}
                      onChooseIcon={chooseIcon}
                      onChooseGameType={chooseGameType}
                    />
                  ))}
                </div>
                <div className="d-flex justify-content-start">
                  <button className="mission-btn" onClick={() => set({ subMissions: [...form.subMissions, newSubMission()] })}>
                    <img src="/assets/images/mission/icon-add-mission-btn.png" alt="create-mission" width="20" height="20" />
                    <span className="mission-page" data-i18n="missionPage.createSubMission">
                      {t("missionPage.createSubMission", "เพิ่มภารกิจย่อย")}
                    </span>
                  </button>
                </div>
                <SectionFinish form={form} set={set} open={openPanel === "finish"} onToggle={toggle("finish")} />
                <div className="group-btn-mission-setting-footer">
                  <a className="mission-btn-outline" href="/mission">
                    <img src="/assets/images/mission/icon-cancel-save.png" alt="cancel" width="20" height="20" />
                    <span className="mission-page" data-i18n="missionPage.missionCancelButton">
                      {t("missionPage.missionCancelButton", "ยกเลิก")}
                    </span>
                  </a>
                  {/* ORIGINAL: still "ยืนยันการสร้างภารกิจ" on the edit page */}
                  <button className="mission-btn" id="btnSaveMission" onClick={save}>
                    <img src="/assets/images/mission/icon-confirm-save.png" alt="confirm" width="20" height="20" />
                    <span className="mission-page" data-i18n="missionPage.missionConfirmButton">
                      {t("missionPage.missionConfirmButton", "ยืนยันการสร้างภารกิจ")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ImageStylePopup control={imagePopup} groups={data.imageStyles} current={form.cover} onSave={(cover) => set({ cover })} />
      <IconStylePopup control={iconPopup} groups={data.iconStyles} onSave={(icon) => iconTarget.current(icon)} />
      <GameTypePopup
        control={gamePopup}
        providers={data.providers}
        selected={gameSelection.selected}
        session={gameSelection.session}
        onSave={(selected) => gameTarget.current(selected)}
      />
      <input type="hidden" id="allSubMissionCount" value={form.subMissions.length} />
      <input type="hidden" id="editMission" value={edit ? "true" : "false"} />
      <input type="hidden" id="missionId" value={missionId} />
      <input type="hidden" id="iconSelectSection" value="" />
      {popupAlertHolder}
      {popupAlertSecondHolder}
    </div>
  );
}

// Text of the preview card's date line (#displayMissionTimeAndReward). The original's formatting code
// was not captured: the default text and the edit value ("15/10/2026 11:46 / เป็นต้นไป") are.
function previewDate(form: MissionFormValues) {
  const hasStart = form.startDate !== "" || form.startNow;
  const hasEnd = form.endDate !== "" || form.noEnd;
  if (!hasStart && !hasEnd) return "1/10/2024 00:00 - 7/10/2024 23:59";
  const start = form.startDate ? `${form.startDate} ${form.startTime}`.trim() : "-";
  const end = form.noEnd ? "เป็นต้นไป" : form.endDate ? `${form.endDate} ${form.endTime}`.trim() : "-";
  return `${start} / ${end}`;
}

// "คัดลอกการตั้งค่าจากภารกิจอื่น": #selectMissionCopy pill + #dropdownSelectMissionCopy + ยินยันคัดลอก
function CopyMissionPicker({ missions, onCopy }: { missions: Option[]; onCopy: (id: string) => void }) {
  const t = useT();
  const [value, setValue] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdown = useFloatingDropdown({
    anchorRef: buttonRef,
    dropdownRef,
    options: { stretch: true },
    isOwnTarget: (target) => target.closest("#selectMissionCopy") !== null,
  });
  const picked = missions.find((m) => m.value === value);

  return (
    <div className="mission-copy-setting-group">
      <span className="mission-copy-setting-title mission-page" data-i18n="missionPage.missionCopySetting">
        {t("missionPage.missionCopySetting", "คัดลอกการตั้งค่าจากภารกิจอื่น")}
      </span>
      <div className="col-auto">
        <button id="selectMissionCopy" ref={buttonRef} className={cx("custom-filter", picked && "fill", dropdown.show && "active")} onClick={dropdown.toggle}>
          <div className={cx("input-fake single", !picked && "mission-page")} data-i18n={picked ? undefined : "missionPage.missionChoose"}>
            {picked ? picked.label : t("missionPage.missionChoose", "เลือกภารกิจ")}
          </div>
          <span className="filter-value"></span>
          <span className={cx("filter-toggler", dropdown.show && "toggled")}>
            <img src="/assets/images/mission/icon-arrow-down.png" width="24" height="24" />
          </span>
          <span
            className="filter-close"
            onClick={(event) => {
              event.stopPropagation();
              setValue(null);
            }}
          >
            <FilterCloseIcon />
          </span>
        </button>
        <div id="dropdownSelectMissionCopy" className="dropdown-wrapper">
          <div ref={dropdownRef} className={cx("custom-dropdown", dropdown.stateClassName)}>
            <div className="custom-dropdown-body">
              {missions.map((mission) => (
                <div
                  key={mission.value}
                  className={cx("custom-dropdown-item", mission.value === value && "selected")}
                  data-value={mission.value}
                  onClick={() => {
                    setValue(mission.value);
                    dropdown.close();
                  }}
                >
                  {mission.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button className="mission-btn" disabled={!picked} id="btnCopyMission" onClick={() => value && onCopy(value)}>
        <span className="mission-page" data-i18n="missionPage.missionConfirmCopy">
          {t("missionPage.missionConfirmCopy", "ยินยันคัดลอก")}
        </span>
      </button>
    </div>
  );
}

type SectionFinishProps = {
  form: MissionFormValues;
  set: (patch: Partial<MissionFormValues>) => void;
  open: boolean;
  onToggle: () => void;
};

// Section 4 — ตั้งค่าการเสร็จสิ้นภารกิจ
function SectionFinish({ form, set, open, onToggle }: SectionFinishProps) {
  const t = useT();
  const someMissing = form.completeType === "some" && !(Number(form.completeValue) > 0);
  return (
    <FormSection
      panelId="openDropdownMissionSetting4"
      open={open}
      onToggle={onToggle}
      valid={isFinishValid(form)}
      statusId="missionEndStatusTitle"
      statusI18n="missionPage.settingMissionNotComplete"
      title={
        <span className="title-mission-setting mission-page" data-i18n="missionPage.settingMissionFinished">
          {t("missionPage.settingMissionFinished", "ตั้งค่าการเสร็จสิ้นภารกิจ")}
        </span>
      }
    >
      <div className="group-content-mission-setting-item">
        <LabelTitle i18nKey="missionPage.settingMissionFinished">{t("missionPage.settingMissionFinished", "ตั้งค่าการเสร็จสิ้นภารกิจ")}</LabelTitle>
        <div className="group-mission-start">
          <span className="text-p2-bold mission-page" data-i18n="missionPage.settingMissionFinish1">
            {t("missionPage.settingMissionFinish1", "ต้องทำสำเร็จครบทุกภารกิจ")}
          </span>
          <div className="group-radio-mission-start">
            {(
              [
                ["all", "complete-mission-all", "missionPage.settingMissionFinish2", "กำหนดให้การทำภารกิจเสร็จสิ้นได้ต่อเมื่อ"],
                ["some", "complete-mission-some", "missionPage.settingMissionFinish3", "ทำสำเร็จเพียงบางภารกิจ"],
              ] as const
            ).map(([value, id, key, label]) => (
              <div key={value} className="group-radio custom-radio">
                <input
                  type="radio"
                  name="complete-mission"
                  id={id}
                  value={value}
                  checked={form.completeType === value}
                  onChange={() => set({ completeType: value })}
                />
                <span className="checkmark"></span>
                <label htmlFor={id} className="text-p2-regular mission-page" data-i18n={key}>
                  {t(key, label)}
                </label>
              </div>
            ))}
          </div>
          <div className="custom-input group-input group-input-card">
            <div className="input-outer input-outer-card">
              <div className="input-outer-card-suffix start">
                <span className="text-p2-regular mission-page" data-i18n="missionPage.settingMissionDone">
                  {t("missionPage.settingMissionDone", "ทำภารกิจสำเร็จ")}
                </span>
              </div>
              <input
                type="number"
                className="input input-card"
                placeholder="0"
                id="complete-mission-some-value"
                value={form.completeValue}
                onChange={(event) => set({ completeValue: event.target.value })}
              />
              <div className="input-outer-card-suffix">
                <span className="text-p2-regular mission-page" data-i18n="missionPage.mission">
                  {t("missionPage.mission", "ภารกิจ")}
                </span>
              </div>
            </div>
            <Feedback id="error-CompleteMission-some-value" show={someMissing} i18nKey="missionPage.settingMissionErrorText1">
              {t("missionPage.settingMissionErrorText1", "กรุณากรอกจำนวนภารกิจที่ทำสำเร็จ")}
            </Feedback>
          </div>
        </div>
      </div>
      <div className="group-content-mission-setting-item">
        <LabelTitle i18nKey="missionPage.missionResetCondition">
          {t("missionPage.missionResetCondition", "Reset ภารกิจย่อย กรณีที่ทำภารกิจเสร็จก่อน")}
        </LabelTitle>
        <div className="group-switch">
          <div className="mission-switch-btn">
            <input
              className="mission-switch-check-input"
              type="checkbox"
              id="mission-some-reset"
              checked={form.resetSubMission}
              onChange={(event) => set({ resetSubMission: event.target.checked })}
            />
          </div>
          <span className="switch-title text-p2-regular">
            <span className="mission-page" data-i18n="missionPage.missionResetConditionText1">
              {t("missionPage.missionResetConditionText1", "เปิด / ปิดใช้งาน การ Reset ภารกิจย่อย")}
            </span>
            <br />
            <span className="mission-page" data-i18n="missionPage.missionResetConditionText2">
              {t("missionPage.missionResetConditionText2", "กรณีที่ทำภารกิจเสร็จก่อน")}
            </span>
          </span>
        </div>
      </div>
      <div className="group-content-mission-setting-item"></div>
    </FormSection>
  );
}
