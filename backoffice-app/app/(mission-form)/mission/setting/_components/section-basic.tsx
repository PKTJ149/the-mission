"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img>, often without alt */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ColorPicker, cx, MINIGAME_EDITOR_CONFIG, RichTextEditor } from "@/components/ui";
import { useT } from "@/lib/i18n";
import {
  DEFAULT_COLOR_BG,
  DEFAULT_COLOR_TEXT,
  newMemberType,
  type Lang,
  type MemberTypeForm,
  type MissionFormValues,
  type Option,
} from "@/lib/api/missions";
import { FlatpickrInput } from "./flatpickr-input";
import { EnglishPillFlag, TagalogPillFlag } from "./lang-flags";
import { DeleteButton, Feedback, previewFile, WarningBox } from "./form-bits";
import { FormSection, LabelTitle } from "./form-section";
import { FilterSelect, WrapperDropdown } from "./mission-dropdowns";
import { memberTypeErrors } from "./validation";

// The mission form's CKEditor config was not captured: same as the mini-game one minus its placeholder
export const MISSION_EDITOR_CONFIG = { removePlugins: MINIGAME_EDITOR_CONFIG.removePlugins, style: MINIGAME_EDITOR_CONFIG.style };

type SectionBasicProps = {
  form: MissionFormValues;
  set: (patch: Partial<MissionFormValues>) => void;
  open: boolean;
  onToggle: () => void;
  valid: boolean;
  agents: Option[];
  memberGroups: Option[];
  previewDate: string;
  onChooseCover: () => void; // showPopupImageStyle()
};

// Section 1 — ตั้งค่าข้อมูลพื้นฐานภารกิจ
export function SectionBasic({ form, set, open, onToggle, valid, agents, memberGroups, previewDate, onChooseCover }: SectionBasicProps) {
  const t = useT();
  const [lang, setLang] = useState<Lang>("th");
  const [colorResets, setColorResets] = useState({ bg: 0, text: 0 });
  const nameMissing = form.names.th.trim() === "";
  const restricted = form.memberRestrict ? "" : " d-none";

  const setName = (code: Lang, value: string) => set({ names: { ...form.names, [code]: value } });
  const setMemberType = (index: number, item: MemberTypeForm) =>
    set({ memberTypes: form.memberTypes.map((m, i) => (i === index ? item : m)) });

  return (
    <FormSection
      panelId="openDropdownMissionSetting1"
      open={open}
      onToggle={onToggle}
      valid={valid}
      statusId="missionBasicStatusTitle"
      statusI18n="missionPage.dataNotComplete"
      title={
        <span className="title-mission-setting mission-page" data-i18n="missionPage.mbsHeader">
          {t("missionPage.mbsHeader", "ตั้งค่าข้อมูลพื้นฐานภารกิจ")}
        </span>
      }
    >
      <div className="group-content-mission-setting-item">
        <div className="group-switch">
          <div className="mission-switch-btn">
            <input
              className="mission-switch-check-input"
              type="checkbox"
              id="missionBasicMissionStatus"
              checked={form.status}
              onChange={(event) => set({ status: event.target.checked })}
            />
          </div>
          <span className="switch-title mission-page" data-i18n="missionPage.mbsOnOffMission">
            {t("missionPage.mbsOnOffMission", "เปิด/ปิดการใช้งานภารกิจ")}
          </span>
        </div>
        <div className="group-preview-mission">
          <div className="img-preview-mission">
            <img src={form.cover} className="img-preview-mission-cover missionBasicInputFileMission" />{" "}
            <div className="box-title-mission">
              <div className="box-title-mission-text">
                <span className="text-title-mission" id="displayMissionName">
                  {form.names.th}
                </span>
                <span id="displaySubMissionCount">{form.subMissions.length}</span>
                <span className="mission-page" data-i18n="missionPage.mbsSubMission">
                  {t("missionPage.mbsSubMission", "ภารกิจย่อย")}
                </span>
              </div>
              <div className="box-title-mission-date">
                <img src="/assets/images/mission/icon-clock.png" />
                <span id="displayMissionTimeAndReward">{previewDate}</span>
              </div>
            </div>
          </div>
          <span className="title-preview-mission mission-page" data-i18n="missionPage.mbsUploadImageEx">
            {t("missionPage.mbsUploadImageEx", "ตัวอย่างรูปภาพภารกิจ")}
          </span>
        </div>
        <div className="group-upload-mission">
          <span className="label-upload-mission mission-page" data-i18n="missionPage.mbsUploadImage">
            {t("missionPage.mbsUploadImage", "อัพโหลดรูปภาพภารกิจ")}
          </span>
          <div className="group-upload-and-select">
            <label className="mission-btn-outline btn-upload-mission" htmlFor="missionBasicInputFileMission">
              <input
                type="file"
                id="missionBasicInputFileMission"
                className="d-none"
                onChange={(event) => previewFile(event, (cover) => set({ cover }))}
              />
              <img src="/assets/images/mission/image-upload.png" width="16" height="16" />
              <span className="mission-page" data-i18n="missionPage.mbsUploadImage">
                {t("missionPage.mbsUploadImage", "อัพโหลดรูปภาพภารกิจ")}
              </span>
            </label>
            <span className="text-select-mission mission-page" data-i18n="missionPage.or">
              {t("missionPage.or", "หรือ")}
            </span>
            <span className="text-select-mission-link mission-page" data-i18n="missionPage.mbsSelectFromSyst" onClick={onChooseCover}>
              {t("missionPage.mbsSelectFromSyst", "เลือกรูปจากระบบ")}
            </span>
          </div>
          <div>
            <p className="text-mission-link-note mission-page" data-i18n="missionPage.uploadDescription2">
              {t("missionPage.uploadDescription2", "ขนาดรูปภาพที่แนะนำ : 312px x 390px และรูปภาพจะต้องเป็น นามสกุลไฟล์ png, jpg และ gif เท่านั้น")}
            </p>
            <p className="text-mission-link-note-advice">
              <span className="mission-page" data-i18n="missionPage.uploadDescription3">
                {t("missionPage.uploadDescription3", "คำแนะนำ:")}
              </span>{" "}
              <span className="mission-page" data-i18n="missionPage.uploadDescription4">
                {t("missionPage.uploadDescription4", "ควรเว้นช่วงด้านล่างอย่างน้อย 72px เพื่อให้สามารถอ่านรายละเอียดภารกิจได้ชัดเจน เหมือนรูปตัวอย่าง")}
              </span>
            </p>
          </div>
        </div>
        <div className="group-color-mission">
          <span className="label-color-mission mission-page" data-i18n="missionPage.mbsSelectMissionColor">
            {t("missionPage.mbsSelectMissionColor", "กำหนดสีประจำภารกิจ")}
          </span>
          <p className="text-color-mission mission-page" data-i18n="missionPage.mbsSelectMissionColorText">
            {t("missionPage.mbsSelectMissionColorText", "เมื่อกำหนดสีประจำภารกิจแล้วสีการแสดงผลต่าง ๆ ของภารกิจนี้จะเป็นสี ตามที่คุณกำหนด")}
          </p>
          <div className="group-change-color">
            <ColorField
              key={`bg-${colorResets.bg}`}
              label={t("missionPage.mbsSelectMissionColorSet", "สีพื้นหลัง / ลิงก์ / ปุ่ม")}
              i18nKey="missionPage.mbsSelectMissionColorSet"
              className="getColorBGAndLinkAndBTN"
              mode="gradient"
              value={form.colorBg}
              onChange={(colorBg) => set({ colorBg })}
              onReset={() => {
                set({ colorBg: DEFAULT_COLOR_BG });
                setColorResets((r) => ({ ...r, bg: r.bg + 1 }));
              }}
            />
            <ColorField
              key={`text-${colorResets.text}`}
              label={t("missionPage.mbsSelectMissionColorSet2", "สีตัวอักษรบนพื้นหลัง/ปุ่ม")}
              i18nKey="missionPage.mbsSelectMissionColorSet2"
              className="getColorTextAndBTN"
              mode="simple"
              value={form.colorText}
              uppercase
              onChange={(colorText) => set({ colorText })}
              onReset={() => {
                set({ colorText: DEFAULT_COLOR_TEXT });
                setColorResets((r) => ({ ...r, text: r.text + 1 }));
              }}
            />
          </div>
        </div>
      </div>

      <div className="group-content-mission-setting-item">
        <LabelTitle i18nKey="missionPage.mbsMissionInfo">{t("missionPage.mbsMissionInfo", "ข้อมูลพื้นฐานภารกิจ")}</LabelTitle>
        <div className="multi-language-body-mission">
          <div className="multi-language-header">
            <span className="text-white fw-700 mission-page" data-i18n="missionPage.langaugeSettingText1">
              {t("missionPage.langaugeSettingText1", "กำหนดรายละเอียดแต่ละภาษา")}
            </span>
            <span className="p3 mission-page" data-i18n="missionPage.langaugeSettingText2">
              {t("missionPage.langaugeSettingText2", " เมื่อกำหนดรายละเอียดให้ภาษาใดแล้ว ภาษานั้นจะสามารถเลือกให้เแสดงที่หน้าเล่นของสมาชิกได้")}
            </span>
          </div>
          <div className="multi-language-button-div">
            <button
              className={cx("btn multi-lang-button btn-lang-th", lang === "th" && "multi-lang-selected")}
              {...{ "lang-select-btn": "th" }}
              onClick={() => setLang("th")}
            >
              <span className="row">
                <span className="col-12">
                  <span className="mission-page" data-i18n="missionPage.langaugeDefault">
                    {t("missionPage.langaugeDefault", "ค่าเริ่มต้น (ไทย)")}
                  </span>
                </span>
                <span className="col-12">
                  <span className="p3 multi-setting-th multi-lang-status-t mission-page" data-i18n="missionPage.setting">
                    {t("missionPage.setting", "(ตั้งค่าแล้ว)")}
                  </span>
                </span>
              </span>
            </button>{" "}
            {/* {" "}: the original's whitespace between these inline-block buttons is a visible 4 px gap */}
            <LangButton code="en" label="EN;" flag={<EnglishPillFlag />} selected={lang === "en"} isSet={form.names.en.trim() !== ""} onSelect={setLang} />{" "}
            <LangButton code="tl" label="TL;" flag={<TagalogPillFlag />} selected={lang === "tl"} isSet={form.names.tl.trim() !== ""} onSelect={setLang} />
          </div>
        </div>
        <div className="group-input">
          <label htmlFor="" className="labal mission-page" data-i18n="missionPage.mbsMissionName">
            {t("missionPage.mbsMissionName", "ชื่อภารกิจ")}
          </label>
          <div className="input-outer">
            <input
              type="text"
              className={cx("input", lang !== "th" && "display-none")}
              placeholder=""
              id="missionBasicMissionName"
              data-name-lang="th"
              value={form.names.th}
              onChange={(event) => setName("th", event.target.value)}
              style={nameMissing ? { borderColor: "rgb(246, 70, 70)" } : undefined}
            />
            {(["en", "tl"] as const).map((code) => (
              <input
                key={code}
                type="text"
                className={cx("input", lang !== code && "display-none", `input-promotion-name-${code}`)}
                id={`missionBasicMissionName-${code}`}
                data-name-lang={code}
                value={form.names[code]}
                onChange={(event) => setName(code, event.target.value)}
              />
            ))}
          </div>
        </div>
        <div className="group-input-thin">
          <label htmlFor="" className="labal mission-page" data-i18n="missionPage.mbsMissionCondition">
            {t("missionPage.mbsMissionCondition", "เงื่อนไขภารกิจ")}
          </label>
          <div className="input-thin">
            {(["th", "en", "tl"] as const).map((code) => (
              <div key={code} className={`textarea-condition-${code}`} style={lang === code ? undefined : { display: "none" }}>
                <RichTextEditor
                  id={code === "th" ? "missionConditionHtml" : `missionConditionHtml-${code}`}
                  className={cx(code !== "th" && "display-none", `input-promotion-condition-${code}`)}
                  dataAttributes={{ "data-condition-lang": code }}
                  config={MISSION_EDITOR_CONFIG}
                  defaultValue={form.conditions[code]}
                  onChange={(html) => set({ conditions: { ...form.conditions, [code]: html } })}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="group-input-thin">
          <label htmlFor="" className="labal mission-page" data-i18n="missionPage.mbsMissionConditionType">
            {t("missionPage.mbsMissionConditionType", "รูปแบบการทำภารกิจ")}
          </label>
          <div className="group-btn-mission-format">
            <RadioCard
              name="missionBasicMissionFormat"
              id="missionBasicMissionFormat1"
              value="option1"
              checked={form.format === "option1"}
              onCheck={() => set({ format: "option1" })}
              icon="/assets/images/mission/icon-no-sort-mission.png"
              title={["missionPage.mbsMissionCondition11", t("missionPage.mbsMissionCondition11", "ไม่เรียงลำดับการทำภารกิจ")]}
              subtitle={["missionPage.mbsMissionCondition12", t("missionPage.mbsMissionCondition12", "สามารถทำภารกิจใดก่อนก็ได้")]}
            />
            <RadioCard
              name="missionBasicMissionFormat"
              id="missionBasicMissionFormat2"
              value="option2"
              checked={form.format === "option2"}
              onCheck={() => set({ format: "option2" })}
              icon="/assets/images/mission/icon-sort-mission.png"
              title={["missionPage.mbsMissionCondition21", t("missionPage.mbsMissionCondition21", "เรียงลำดับการทำภารกิจ")]}
              subtitle={["missionPage.mbsMissionCondition22", t("missionPage.mbsMissionCondition22", "ต้องทำภารกิจตามลำดับที่กำหนด")]}
            />
          </div>
        </div>
        <div className="group-btn-switch">
          <div className="mission-switch-btn">
            <input
              className="mission-switch-check-input"
              type="checkbox"
              id="missionBasicMissionShowTime"
              checked={form.showCountdown}
              onChange={(event) => set({ showCountdown: event.target.checked })}
            />
          </div>
          <div className="group-title-subtitle">
            <span className="title-label mission-page" data-i18n="missionPage.mbsOnOffCountdown">
              {t("missionPage.mbsOnOffCountdown", "เปิด / ปิด การแสดงผลการนับเวลาถอยหลังภารกิจ")}
            </span>
            <span className="subtitle-label mission-page" data-i18n="missionPage.mbsOnOffCountdownText">
              {t("missionPage.mbsOnOffCountdownText", "เมื่อปิดการแสดงผลสมาชิกจะไม่เห็นการนับเวลาถอยหลังของภารกิจนี้")}
            </span>
          </div>
        </div>
      </div>

      <div className="group-content-mission-setting-item">
        <LabelTitle i18nKey="missionPage.mbsMissionInfo">{t("missionPage.mbsMissionInfo", "ข้อมูลพื้นฐานภารกิจ")}</LabelTitle>
        <div className="custom-input group-input">
          <div className="d-flex align-items-center justify-content-between">
            <label className="form-label labal mission-page" data-i18n="missionPage.availableAgent">
              {t("missionPage.availableAgent", "Agent ที่ใช้ได้")}
            </label>
          </div>
          <div className="custom-input custom-float pb-2">
            <WrapperDropdown
              id="dropdownSelectMissionAgent"
              bodyId="agent-dropdown-body"
              multiple
              search
              items={agents}
              value={form.agents}
              onChange={(value) => set({ agents: value })}
              placeholder="Choose Agent"
              invalid={form.agents.length === 0}
            >
              <div className="invalid-feedback mission-page" id="error-selectAgentDropdown" data-i18n="missionPage.selectAgentError">
                {t("missionPage.selectAgentError", "กรุณาเลือก Agent")}
              </div>
            </WrapperDropdown>
          </div>
          <div className="text-start invalid-feedback invalid-feedback-minigame-name"></div>
        </div>
        <WarningBox>
          <span className="text-warning-mission">
            <span className="mission-page" data-i18n="missionPage.mbsWarningMissionText1">
              {t("missionPage.mbsWarningMissionText1", "หากไม่ได้เปิดใช้งานการกำหนดสิทธิ์")}
            </span>
            <br />{" "}
            <span className="mission-page" data-i18n="missionPage.mbsWarningMissionText2">
              {t("missionPage.mbsWarningMissionText2", "เฉพาะ Agent, Agent ทุกคนจะใช้ได้")}
            </span>
          </span>
        </WarningBox>
        <LabelTitle i18nKey="missionPage.mbsMissionLimitMember">
          {t("missionPage.mbsMissionLimitMember", "จำกัดสิทธิ์สมาชิกที่สามารถทำภารกิจได้")}
        </LabelTitle>
        <div className="group-btn-switch-label">
          <div className="mission-switch-btn">
            <input
              className="mission-switch-check-input"
              type="checkbox"
              id="missionBasicSwichEnableCustomerPrivilege"
              checked={form.memberRestrict}
              onChange={(event) => set({ memberRestrict: event.target.checked })}
            />
          </div>
          <div className="group-title-subtitle">
            <span className="title-label mission-page" data-i18n="missionPage.mbsOnOffMissionLimitMember">
              {t("missionPage.mbsOnOffMissionLimitMember", "เปิด / ปิดใช้งานการจำกัดสิทธิ์สมาชิก")}
            </span>
          </div>
        </div>
        <WarningBox className="missionBasicSwichEnableCustomerPrivilege" hidden={form.memberRestrict}>
          <span className="text-warning-mission">
            <span className="mission-page" data-i18n="missionPage.mbsWarningMissionText1">
              {t("missionPage.mbsWarningMissionText1", "หากไม่ได้เปิดใช้งานการกำหนดสิทธิ์")}
            </span>
            <br />{" "}
            <span className="mission-page" data-i18n="missionPage.mbsWarningMissionText3">
              {t("missionPage.mbsWarningMissionText3", "เฉพาะสมาชิก, สมาชิกทุกคนจะใช้ได้")}
            </span>
          </span>
        </WarningBox>
        <div className={`group-windows-limit-member missionBasicSwichEnableCustomerPrivilege2${restricted}`}>
          <label className="labal mission-page" data-i18n="missionPage.mbsOnOffMissionMemberCondition">
            {t("missionPage.mbsOnOffMissionMemberCondition", "กำหนดสิทธิ์ให้สมาชิกเงื่อนไขใดทำภารกิจได้")}
          </label>
          <div id="group-windows-limit-member-content" className="group-windows-limit-member-content">
            {form.memberTypes.map((item, index) => (
              <MemberTypeBox
                key={item.id}
                item={item}
                no={index + 1}
                hiddenClass={restricted}
                canDelete={form.memberTypes.length > 1}
                memberGroups={memberGroups}
                onChange={(next) => setMemberType(index, next)}
                onDelete={() => set({ memberTypes: form.memberTypes.filter((_, i) => i !== index) })}
              />
            ))}
          </div>
        </div>
        <div className={`d-flex justify-content-center missionBasicSwichEnableCustomerPrivilege2${restricted}`}>
          <button className="mission-btn-outline" onClick={() => set({ memberTypes: [...form.memberTypes, newMemberType()] })}>
            <img src="/assets/images/mission/icon-add-mission-btn.png" alt="mission-create" width="20" height="20" />
            <span className="mission-page" data-i18n="missionPage.mbsAddMemberType">
              {t("missionPage.mbsAddMemberType", "เพิ่มประเภทสมาชิก")}
            </span>
          </button>
        </div>
        <div className={`group-btn-switch-label align-items-start missionBasicSwichEnableCustomerPrivilege2${restricted}`}>
          <div className="mission-switch-btn mt-2">
            <input
              className="mission-switch-check-input"
              type="checkbox"
              id="missionBasicSwichEnableVisible"
              checked={form.restrictVisible}
              onChange={(event) => set({ restrictVisible: event.target.checked })}
            />
          </div>
          <div className="group-title-subtitle">
            <span className="title-label mission-page" data-i18n="missionPage.mbsOnOffRestrictedVisibility">
              {t("missionPage.mbsOnOffRestrictedVisibility", "เปิด / ปิดใช้งาน การจำกัดการมองเห็นภารกิจของสมาชิกที่ไม่มีสิทธิ์ทำภารกิจ")}
            </span>
            <span className="subtitle-label mission-page" data-i18n="missionPage.mbsRestrictedVisibilityText">
              {t(
                "missionPage.mbsRestrictedVisibilityText",
                "เมื่อเปิดใช้งานสมาชิกที่ไม่ได้ถูกกำหนดสิทธิ์ให้สามารถทำภารกิจนี้ได้จะไม่สามารถมองเห็นภารกิจนี้ที่หน้าเล่นของตัวเอง",
              )}
            </span>
          </div>
        </div>
      </div>
    </FormSection>
  );
}

type RadioCardProps = {
  name: string;
  id: string;
  value: string;
  checked: boolean;
  onCheck: () => void;
  icon: string;
  title: [string, string]; // [i18n key, text]; an empty key renders without .mission-page
  subtitle: [string, string];
};

// label.mission-radio-label(.active) with an icon, title and subtitle (changeRadio)
export function RadioCard({ name, id, value, checked, onCheck, icon, title, subtitle }: RadioCardProps) {
  return (
    <label className={cx("mission-radio-label", checked && "active")} htmlFor={id}>
      <input type="radio" name={name} value={value} id={id} checked={checked} onChange={onCheck} />
      <div className="mission-radio-content">
        <div className="mission-radio-icon">
          <img src={icon} />
        </div>
        <div className="mission-radio-text">
          <div className={cx("mission-radio-title", title[0] && "mission-page")} data-i18n={title[0] || undefined}>
            {title[1]}
          </div>
          <div className={cx("mission-radio-subtitle", subtitle[0] && "mission-page")} data-i18n={subtitle[0] || undefined}>
            {subtitle[1]}
          </div>
        </div>
      </div>
    </label>
  );
}

type ColorFieldProps = {
  label: string;
  i18nKey: string;
  className: string;
  mode: "gradient" | "simple";
  value: string;
  uppercase?: boolean;
  onChange: (value: string) => void;
  onReset: () => void; // resetColorMission('bg' | 'text')
};

// .change-color-item: asColorPicker + "คืนค่าเริ่มต้น". The page script sized the input 95×30 px.
function ColorField({ label, i18nKey, className, mode, value, uppercase, onChange, onReset }: ColorFieldProps) {
  const t = useT();
  const groupRef = useRef<HTMLDivElement>(null);
  const [initialValue] = useState(value);

  useEffect(() => {
    const input = groupRef.current?.querySelector<HTMLInputElement>(`input.${className}`);
    if (!input) return;
    input.style.width = "95px";
    input.style.height = "30px";
    if (uppercase) input.style.textTransform = "uppercase";
  });

  return (
    <div className="change-color-item">
      <span className="text-change-color mission-page" data-i18n={i18nKey}>
        {label}
      </span>
      <div className="group-btn" ref={groupRef}>
        <ColorPicker className={className} mode={mode} defaultValue={initialValue} onChange={onChange} />
        <span className="change-color-mission-link mission-page" data-i18n="missionPage.resetToDefault" onClick={onReset}>
          {t("missionPage.resetToDefault", "คืนค่าเริ่มต้น")}
        </span>
      </div>
    </div>
  );
}

type LangButtonProps = {
  code: Lang;
  label: string;
  flag: ReactNode;
  selected: boolean;
  isSet: boolean;
  onSelect: (code: Lang) => void;
};

// EN / TL pill of "กำหนดรายละเอียดแต่ละภาษา" (selectMultiLanguage)
function LangButton({ code, label, flag, selected, isSet, onSelect }: LangButtonProps) {
  const t = useT();
  const statusKey = isSet ? "missionPage.setting" : "missionPage.notSetting";
  return (
    <button className={cx("btn multi-lang-button", `btn-lang-${code}`, selected && "multi-lang-selected")} {...{ "lang-select-btn": code }} onClick={() => onSelect(code)}>
      <span className="row">
        <span className="col-4">{flag}</span>
        <span className="col-8">
          <span className="row">
            <span className="col-12">{label}</span>
            <span className={cx("col-12", `multi-setting-${code}`, isSet ? "multi-lang-status-t" : "multi-lang-status-f", "p3 mission-page")} data-i18n={statusKey}>
              {isSet ? t("missionPage.setting", "(ตั้งค่าแล้ว)") : t("missionPage.notSetting", "(ยังไม่กำหนด)")}
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

type MemberTypeBoxProps = {
  item: MemberTypeForm;
  no: number;
  hiddenClass: string;
  canDelete: boolean;
  memberGroups: Option[];
  onChange: (item: MemberTypeForm) => void;
  onDelete: () => void;
};

// "ประเภทสมาชิก N" (#type-member-N): member group / account age / register date
function MemberTypeBox({ item, no, hiddenClass, canDelete, memberGroups, onChange, onDelete }: MemberTypeBoxProps) {
  const t = useT();
  const errors = memberTypeErrors(item);
  const set = (patch: Partial<MemberTypeForm>) => onChange({ ...item, ...patch });
  const show = (type: MemberTypeForm["type"]) => (item.type === type ? "" : " d-none");

  return (
    <div className={`box-type-member missionBasicSwichEnableCustomerPrivilege2${hiddenClass}`} id={`type-member-${no}`} data-type-member={no}>
      <input type="hidden" name="typeMember-template" id={`typeMember-${no}`} value={item.type ?? ""} />
      <input type="hidden" name="groupMember-template" id={`groupMember-${no}`} value={item.groups.join(",")} />
      <input type="hidden" name="ageMemberTimeType-template" id={`ageMemberTimeType-${no}`} value={item.ageOperator} />
      <input type="hidden" name="ageMemberDateType-template" id={`ageMemberDateType-${no}`} value={item.ageUnit} />
      <div className="type-member-header d-flex justify-content-between align-items-center">
        <span className="mission-page" data-i18n="missionPage.mbsMemberType">
          {t("missionPage.mbsMemberType", "ประเภทสมาชิก")}
        </span>{" "}
        <span className="text-type-member">{no}</span>
        <DeleteButton show={canDelete} onClick={onDelete}>
          <span className="text-link color-red mission-page" data-i18n="missionPage.delete">
            {t("missionPage.delete", "ลบ")}
          </span>
        </DeleteButton>
      </div>
      <div className="type-member-item">
        <div className="group-input custom-input custom-float">
          <label className="labal mission-page" data-i18n="missionPage.mbsMemberType">
            {t("missionPage.mbsMemberType", "ประเภทสมาชิก")}
          </label>
          <WrapperDropdown
            className="dropdownSelectTypeMember require"
            dataValue={`inputTypeMember-${no}`}
            nested
            items={[
              { value: "member-group", label: t("missionPage.mbsMemberGroup", "กลุ่มสมาชิก"), i18nKey: "missionPage.mbsMemberGroup" },
              { value: "life-span", label: t("missionPage.mbsMembershipDuration", "อายุการใช้งานของสมาชิก"), i18nKey: "missionPage.mbsMembershipDuration" },
              { value: "created-date", label: t("missionPage.mbsOnRegisterDate", "วันที่สมัครของสมาชิก"), i18nKey: "missionPage.mbsOnRegisterDate" },
            ]}
            value={item.type}
            onChange={(type) => set({ type: type as MemberTypeForm["type"] })}
            placeholder="Select member type"
          >
            <Feedback
              id={`error-TypeMember-${no}`}
              show={errors.type}
              className="invalid-feedback text-p3-regular mission-page"
              i18nKey="missionPage.mbsMemberTypeError"
            >
              {t("missionPage.mbsMemberTypeError", "กรุณาเลือกประเภทสมาชิก")}
            </Feedback>
          </WrapperDropdown>
        </div>
        <div className={`groupGroupMember group-input custom-input custom-float${show("member-group")}`}>
          <label htmlFor="" className="labal mission-page" data-i18n="missionPage.mbsMemberGroup">
            {t("missionPage.mbsMemberGroup", "กลุ่มสมาชิก")}
          </label>
          <div className="custom-input custom-float pb-2">
            <WrapperDropdown
              className="dropdownSelectGroupMember"
              bodyId="agent-dropdown-body"
              multiple
              search
              items={memberGroups}
              value={item.groups}
              onChange={(groups) => set({ groups })}
              placeholder="Select member type"
            >
              <Feedback id={`error-GroupMember-${no}`} show={errors.group} i18nKey="missionPage.mbsMemberGroupError">
                {t("missionPage.mbsMemberGroupError", "กรุณาเลือกกลุ่มสมาชิก")}
              </Feedback>
            </WrapperDropdown>
          </div>
        </div>
        <div className={`groupAgeMember group-input custom-input custom-float${show("life-span")}`}>
          <label className="labal mission-page" data-i18n="missionPage.mbsMembershipDuration">
            {t("missionPage.mbsMembershipDuration", "อายุการใช้งานของสมาชิก")}
          </label>
          <div className="group-dropdown group-dropdown-age group-dropdown-age-input">
            <FilterSelect
              className="dropdownSelectAgeMemberTimeType"
              require
              buttonClassName="custom-filter-time"
              items={[
                { value: "from", label: t("missionPage.from", "ตั้งแต่"), i18nKey: "missionPage.from" },
                { value: "equal", label: t("missionPage.equal", "เท่ากับ"), i18nKey: "missionPage.equal" },
              ]}
              value={item.ageOperator}
              onChange={(ageOperator) => set({ ageOperator: ageOperator as MemberTypeForm["ageOperator"] })}
              placeholder=""
            />
            <div className="input-outer">
              <input
                type="text"
                className="input input-age-member-value"
                id={`inputAgeMemberValue-${no}`}
                placeholder="0"
                value={item.ageValue}
                onChange={(event) => set({ ageValue: event.target.value })}
              />
            </div>
            <FilterSelect
              className="dropdownSelectAgeMemberDateType"
              require
              buttonClassName="custom-filter-date"
              items={(["daily", "weekly", "monthly", "yearly"] as const).map((unit) => ({ value: unit, label: unit, chip: unit }))}
              value={item.ageUnit}
              onChange={(ageUnit) => set({ ageUnit: ageUnit as MemberTypeForm["ageUnit"] })}
              placeholder=""
            />
          </div>
          <Feedback id={`error-AgeMemberTimeType-${no}`} show={errors.age} i18nKey="missionPage.mbsMembershipError">
            {t("missionPage.mbsMembershipError", "กรุณาเลือกและกรอกข้อมูลอายุการใช้งานให้ครบถ้วน")}
          </Feedback>
        </div>
        <div className={`groupRegisterMember group-input custom-input custom-float${show("created-date")}`}>
          <label className="labal mission-page" data-i18n="missionPage.register">
            {t("missionPage.register", "สมัครสมาชิก")}
          </label>
          <div className="group-dropdown group-dropdown-age group-dropdown-register-input">
            <FilterSelect
              className="dropdownSelectRegisterMemberDateType"
              require
              buttonClassName="custom-filter-time"
              items={[
                { value: "on-date", label: t("missionPage.date", "วันที่"), i18nKey: "missionPage.date" },
                { value: "before-date", label: t("missionPage.beforeDate", "ก่อนวันที่"), i18nKey: "missionPage.beforeDate" },
                { value: "after-date", label: t("missionPage.afterDate", "หลังวันที่"), i18nKey: "missionPage.afterDate" },
                { value: "between-date", label: t("missionPage.betweenDate", "ระหว่างวันที่"), i18nKey: "missionPage.betweenDate" },
              ]}
              value={item.registerOperator}
              onChange={(registerOperator) => set({ registerOperator: registerOperator as MemberTypeForm["registerOperator"] })}
              placeholder=""
            />
            <div className="w-100">
              <div className="custom-input">
                <FlatpickrInput
                  id={`inputRegisterMemberValue-${no}`}
                  className="date-center-input form-control custom-date-flatpickr flatpickr-input"
                  kind="date"
                  value={item.registerDate}
                  onChange={(registerDate) => set({ registerDate })}
                  placeholder="choose date"
                />
              </div>
            </div>
          </div>
          <Feedback id={`error-RegisterMemberDateType-${no}`} show={errors.register} i18nKey="missionPage.registerDateError">
            {t("missionPage.registerDateError", "กรุณาเลือกและกรอกข้อมูลวันที่สมัครสมาชิกให้ครบถ้วน")}
          </Feedback>
        </div>
      </div>
    </div>
  );
}
