"use client";
/* eslint-disable @next/next/no-img-element -- original markup: plain <img> */

import { useState, type ReactNode } from "react";
import { cx } from "@/components/ui";
import { useT } from "@/lib/i18n";
import {
  ALL_MONTH_DAYS,
  newReward,
  newTimeSlot,
  type MissionFormValues,
  type MissionRewardForm,
  type Option,
  type RoundType,
  type TimeSlotForm,
} from "@/lib/api/missions";
import { FlatpickrInput } from "./flatpickr-input";
import { useFormEvents, useShownErrors, type SectionStatus } from "./form-state";
import { DeleteButton, Feedback, WarningBox } from "./form-bits";
import { FormSection, LabelTitle, SwitchRow } from "./form-section";
import { RewardItem } from "./reward-item";
import { RadioCard } from "./section-basic";
import { timeSlotErrors } from "./validation";

const WEEKDAYS = [
  ["monday", "MON"],
  ["tuesday", "TUE"],
  ["wednesday", "WED"],
  ["thursday", "THU"],
  ["friday", "FRI"],
  ["saturday", "SAT"],
  ["sunday", "SUN"],
] as const;

// Example images of the "Pop Up" notification. Only the first URL was captured; the other six
// follow the same numbering (guess).
export const POPUP_EXAMPLES = Array.from({ length: 7 }, (_, i) => `https://cdn.lsmloyalty.com/images/mission/popup/${i + 1}.png`);
export const FLOATING_EXAMPLE = "https://cdn.lsmloyalty.com/images/mission/popup/floating.png";

type SectionDurationProps = {
  form: MissionFormValues;
  set: (patch: Partial<MissionFormValues>) => void;
  open: boolean;
  onToggle: () => void;
  status: SectionStatus;
  byTimeCard: boolean; // the "x เท่า" turnover card is shown (form-state.ts)
  onPreviewTime: () => void; // handleMissionTimeAndRewardInput(): the start / end inputs' oninput
  miniGames: Option[];
  promotions: Option[];
  onChooseIcon: (apply: (icon: string) => void) => void;
};

// Section 2 — ตั้งค่าระยะเวลาภารกิจและของรางวัล
export function SectionDuration({ form, set, open, onToggle, status, byTimeCard, onPreviewTime, miniGames, promotions, onChooseIcon }: SectionDurationProps) {
  const t = useT();
  const events = useFormEvents();
  const setTime = (patch: Partial<MissionFormValues>) => {
    set(patch);
    onPreviewTime();
  };
  const startMissing = !form.startNow && (!form.startDate || !form.startTime);
  const endMissing = !form.noEnd && (!form.endDate || !form.endTime);
  const rewardShown = form.rewardEnabled ? "" : " d-none";

  const setSlot = (index: number, slot: TimeSlotForm) => set({ timeSlots: form.timeSlots.map((s, i) => (i === index ? slot : s)) });
  const setReward = (index: number, reward: MissionRewardForm) => set({ rewards: form.rewards.map((r, i) => (i === index ? reward : r)) });

  const roundButtons: [RoundType, string, string, string][] = [
    ["custom", "missionTimeAndRewardRadioTimeSetCustom", "missionPage.ownSetting", "กำหนดเอง"],
    ["daily", "missionTimeAndRewardRadioTimeSetDaily", "missionPage.everyDay", "ทุกวัน"],
    ["weekly", "missionTimeAndRewardRadioTimeSetWeekly", "missionPage.everyWeek", "ทุกสัปดาห์"],
    ["monthly", "missionTimeAndRewardRadioTimeSetMonthly", "missionPage.everyMonth", "ทุกเดือน"],
  ];

  return (
    <FormSection
      panelId="openDropdownMissionSetting2"
      open={open}
      onToggle={onToggle}
      status={status}
      validateKey="duration"
      statusId="missionTimeAndRewardStatusTitle"
      statusI18n="missionPage.settingMissionNotComplete"
      title={
        <span className="title-mission-setting mission-page" data-i18n="missionPage.missionDurationAndReward">
          {t("missionPage.missionDurationAndReward", "ตั้งค่าระยะเวลาภารกิจและของรางวัล")}
        </span>
      }
    >
      <div className="group-content-mission-setting-item">
        <LabelTitle i18nKey="missionPage.missionDuration">{t("missionPage.missionDuration", "ระยะเวลาเริ่มต้นและสิ้นสุดภารกิจ")}</LabelTitle>
        <DateTimeGroup
          labelKey="missionPage.missionDurationSettingStart"
          label={t("missionPage.missionDurationSettingStart", "กำหนดวันและเวลาเริ่มต้นภารกิจ")}
          checkboxId="missionTimeAndRewardCheckboxStartMission"
          checkboxKey="missionPage.missionDurationStart"
          checkboxLabel={t("missionPage.missionDurationStart", "เริ่มภารกิจทันทีที่สร้างเสร็จ")}
          checked={form.startNow}
          onCheck={(startNow) => set({ startNow })}
          idPrefix="missionTimeAndRewardInputStartMission"
          date={form.startDate}
          time={form.startTime}
          onDate={(startDate) => setTime({ startDate })}
          onTime={(startTime) => setTime({ startTime })}
          errorId="error-StartMissionDate-template"
          errorKey="missionPage.missionDurationErrorText1"
          error={startMissing}
          errorText={t("missionPage.missionDurationErrorText1", "กรุณาเลือกและกรอกข้อมูลวันที่เริ่มต้นภารกิจให้ครบถ้วน")}
        />
        <DateTimeGroup
          labelKey="missionPage.missionDurationSettingEnd"
          label={t("missionPage.missionDurationSettingEnd", "กำหนดวันและเวลาสิ้นสุดภารกิจ")}
          checkboxId="missionTimeAndRewardCheckboxNotEndMission"
          checkboxKey="missionPage.missionDurationInfinite"
          checkboxLabel={t("missionPage.missionDurationInfinite", "ภารกิจไม่มีวันสิ้นสุด")}
          checked={form.noEnd}
          onCheck={(noEnd) => set({ noEnd })}
          idPrefix="missionTimeAndRewardInputEndMission"
          date={form.endDate}
          time={form.endTime}
          onDate={(endDate) => setTime({ endDate })}
          onTime={(endTime) => setTime({ endTime })}
          errorId="error-EndMissionDate-template"
          errorKey="missionPage.missionDurationErrorText2"
          error={endMissing}
          errorText={t("missionPage.missionDurationErrorText2", "กรุณาเลือกและกรอกข้อมูลวันที่สิ้นสุดภารกิจให้ครบถ้วน")}
        />
        <LabelTitle i18nKey="missionPage.missionActiveTime">{t("missionPage.missionActiveTime", "รอบเวลาทำภารกิจ")}</LabelTitle>
        <p className="text-p3-regular mission-page" data-i18n="missionPage.missionActiveTimeSubText">
          {t(
            "missionPage.missionActiveTimeSubText",
            "กำหนดช่วงวันและเวลาที่สมาชิกสามารถทำภารกิจได้ โดยจะสามารถกำหนดให้อยู่ในช่วงระยะเวลาเริ่มต้น - สิ้นสุด ภารกิจเท่านั้น",
          )}
        </p>
        <div className="group-element-time-mission">
          <div className="group-btn-time-mission">
            {roundButtons.map(([value, id, key, label]) => (
              <label key={value} className={cx("mission-btn-outline btn-time-mission", form.roundType === value && "active")} htmlFor={id}>
                {/* The radio tag was withheld by the capture tool; hidden radio is a reconstruction */}
                <input
                  type="radio"
                  className="d-none"
                  name="missionTimeAndRewardRadioTimeSet"
                  id={id}
                  value={value}
                  checked={form.roundType === value}
                  // handleMissionTimeAndRewardRadioTimeSet: กำหนดเอง clicks "ระบุวัน (วันจันทร์ - อาทิตย์)" again
                  onChange={() => set(value === "custom" ? { roundType: value, roundDayType: "day-of-week" } : { roundType: value })}
                />
                <span className="mission-page" data-i18n={key}>
                  {t(key, label)}
                </span>
              </label>
            ))}
          </div>
          <div className={cx("group-select-time-mission", form.roundType !== "custom" && "d-none")}>
            <span className="text-p2-bold mission-page" data-i18n="missionPage.missionSelectDateType">
              {t("missionPage.missionSelectDateType", "เลือกรูปแบบวัน ที่ต้องการกำหนด")}
            </span>
            <div className="group-radio-time-mission">
              {(
                [
                  ["day-of-week", "MissionRoundTypeCustomDayOfWeek", "missionPage.missionSelectDateType1", "ระบุวัน (วันจันทร์ - อาทิตย์)"],
                  ["day-of-month", "MissionRoundTypeCustomDayOfMonth", "missionPage.missionSelectDateType2", "ระบุวันที่ (1 -31)"],
                ] as const
              ).map(([value, id, key, label]) => (
                <div key={value} className="group-radio custom-radio">
                  <input
                    type="radio"
                    name="MissionRoundTypeCustom"
                    id={id}
                    value={value}
                    checked={form.roundDayType === value}
                    onChange={() => set({ roundDayType: value })}
                  />
                  <span className="checkmark"></span>
                  <label className="mission-page" htmlFor={id} data-i18n={key}>
                    {t(key, label)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="group-box-time-mission" id="group-box-time-mission">
            {form.timeSlots.map((slot, index) => (
              <TimeSlotBox
                key={slot.id}
                slot={slot}
                no={index + 1}
                roundType={form.roundType}
                dayType={form.roundDayType}
                canDelete={form.timeSlots.length > 1}
                onChange={(next) => setSlot(index, next)}
                onDelete={() => set({ timeSlots: form.timeSlots.filter((_, i) => i !== index) })}
              />
            ))}
          </div>
          <div className="d-flex justify-content-center">
            {/* handleMissionTimeAndRewardRadioTimeSet: shown for กำหนดเอง and ทุกสัปดาห์ only; the empty wrapper
                stays (it still takes a 16px flex gap) */}
            <button
              className={cx("mission-btn-outline", form.roundType !== "custom" && form.roundType !== "weekly" && "d-none")}
              id="btnAddTemplateTimeMission"
              onClick={() => {
                const slot = newTimeSlot();
                set({ timeSlots: [...form.timeSlots, slot] });
                events.added(slot.id);
                events.localize();
              }}
            >
              <img src="/assets/images/mission/icon-add-mission-btn.png" alt="Add mission active time" width="20" height="20" />
              <span className="mission-page" data-i18n="missionPage.missionDurationAddActiveTime">
                {t("missionPage.missionDurationAddActiveTime", "เพิ่มรอบเวลาทำภารกิจ")}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="group-content-mission-setting-item">
        <LabelTitle i18nKey="missionPage.missionRewardCondition">
          {t("missionPage.missionRewardCondition", "กำหนดเงื่อนไขการได้รับของรางวัล")}
        </LabelTitle>
        <SwitchRow
          id="missionTimeAndRewardSwitchRewardMission"
          checked={form.rewardEnabled}
          onChange={(rewardEnabled) => set({ rewardEnabled })}
          i18nKey="missionPage.missionRewardOnOff"
        >
          {t("missionPage.missionRewardOnOff", "เปิด / ปิดใช้งาน การให้ของรางวัลภารกิจ")}
        </SwitchRow>
        <WarningBox className="missionTimeAndRewardSwitchRewardMission" hidden={form.rewardEnabled}>
          <span className="text-warning-mission">
            <span className="mission-page" data-i18n="missionPage.missionRewardSubText1">
              {t("missionPage.missionRewardSubText1", "หากไม่เปิดใช้งานการให้ของรางวัล")}
            </span>
            <br />
            <span className="mission-page" data-i18n="missionPage.missionRewardSubText2">
              {t("missionPage.missionRewardSubText2", "หมายถึงภารกิจหลักจะไม่มีของรางวัล")}
            </span>
          </span>
        </WarningBox>
        <div className={`group-input-thin missionTimeAndRewardSwitchRewardMission2${rewardShown}`}>
          <label className="labal mission-page" data-i18n="missionPage.missionRewardGetWhenFinish">
            {t("missionPage.missionRewardGetWhenFinish", "กำหนดเงื่อนไขการรับของรางวัลเมื่อทำภารกิจสำเร็จ")}
          </label>
          <ReceiveTypeCards
            name="missionTimeAndRewardRadioMissionReward"
            ids={["missionTimeAndRewardRadioMissionRewardSelf", "missionTimeAndRewardRadioMissionRewardAuto"]}
            keys={[
              "missionPage.missionRewardGetWhenFinishType1",
              "missionPage.missionRewardGetWhenFinishType2",
              "missionPage.missionRewardGetWhenFinishType3",
              "missionPage.missionRewardGetWhenFinishType4",
            ]}
            withPageClass
            value={form.receiveType}
            onChange={(receiveType) => set({ receiveType })}
          />
        </div>
        <LabelTitle className={`missionTimeAndRewardSwitchRewardMission2${rewardShown}`} i18nKey="missionPage.missionRewardSettingGetWhenFinish">
          {t("missionPage.missionRewardSettingGetWhenFinish", "กำหนดของรางวัลเมื่อทำภารกิจสำเร็จ")}
        </LabelTitle>
        <div className={`group-box-reward missionTimeAndRewardSwitchRewardMission2${rewardShown}`} id="group-box-reward">
          {form.rewards.map((reward, index) => (
            <RewardItem
              key={reward.id}
              reward={reward}
              no={index + 1}
              canDelete={form.rewards.length > 1}
              miniGames={miniGames}
              promotions={promotions}
              onChange={(next) => setReward(index, next)}
              onDelete={() => set({ rewards: form.rewards.filter((_, i) => i !== index) })}
              onChooseIcon={() => onChooseIcon((icon) => setReward(index, { ...reward, icon }))}
            />
          ))}
        </div>
        <div className={`d-flex justify-content-center missionTimeAndRewardSwitchRewardMission2${rewardShown}`}>
          <button
            className="mission-btn-outline"
            onClick={() => {
              const reward = newReward();
              set({ rewards: [...form.rewards, reward] });
              events.added(reward.id, true);
            }}
          >
            <img src="/assets/images/mission/icon-add-mission-btn.png" alt="missionAddReward" width="20" height="20" />
            <span className="mission-page" data-i18n="missionPage.missionAddReward">
              {t("missionPage.missionAddReward", "เพิ่มของรางวัล")}
            </span>
          </button>
        </div>
      </div>

      <div className="group-content-mission-setting-item">
        <TurnoverAndAlert
          ids={{
            turnOverSwitch: "missionTimeAndRewardSwitchTurnover",
            byTime: "missionTurnOverTypeByTime",
            byTimeValue: "missionTurnOverTypeByTimeValue",
            byTimeError: "error-TurnoverByTime-template",
            byUnit: "missionTurnOverTypeByUnit",
            byUnitValue: "missionTurnOverTypeByUnitValue",
            byUnitError: "error-TurnoverByUnit-template",
            byUnitErrorKey: "missionPage.missionDurationErrorText6",
            alertSwitch: "missionTimeAndRewardSwitchAlertMission",
            alertPopup: "missionTimeAndRewardCheckboxAlertMissionPopup",
            alertPopupFor: "missionTimeAndRewardCheckboxAlertMissionPopup",
            alertFloating: "missionTimeAndRewardCheckboxAlertMissionFloatingActionButton",
            alertFloatingFor: "missionTimeAndRewardCheckboxAlertMissionFloatingActionButton",
          }}
          hooks={{ turnOver: "missionTimeAndRewardSwitchTurnover", alert: "missionTimeAndRewardSwitchAlertMission" }}
          main
          byTimeCard={byTimeCard}
          value={form}
          onChange={set}
        />
      </div>
    </FormSection>
  );
}

type DateTimeGroupProps = {
  labelKey: string;
  label: string;
  checkboxId: string;
  checkboxKey: string;
  checkboxLabel: string;
  checked: boolean;
  onCheck: (checked: boolean) => void;
  idPrefix: string;
  date: string;
  time: string;
  onDate: (value: string) => void;
  onTime: (value: string) => void;
  errorId: string;
  errorKey: string;
  error: boolean;
  errorText: string;
};

// Start / end of the mission: checkbox + date and time pickers
function DateTimeGroup(props: DateTimeGroupProps) {
  return (
    <div className="group-input group-input-gap">
      <label htmlFor="" className="labal">
        <span className="mission-page" data-i18n={props.labelKey}>
          {props.label}
        </span>{" "}
        <span className="text-required">*</span>
      </label>
      <div className="group-checkbox">
        <input
          type="checkbox"
          className="checkbox"
          id={props.checkboxId}
          checked={props.checked}
          onChange={(event) => props.onCheck(event.target.checked)}
        />
        <label htmlFor={props.checkboxId} className="label-checkbox mission-page" data-i18n={props.checkboxKey}>
          {props.checkboxLabel}
        </label>
      </div>
      <div className="custom-input group-date-time">
        <FlatpickrInput
          id={`${props.idPrefix}Date`}
          className="form-control custom-date-flatpickr flatpickr-input date-picker"
          kind="date"
          value={props.date}
          onChange={props.onDate}
          placeholder="Select date"
          disabled={props.checked}
        />
        <FlatpickrInput
          id={`${props.idPrefix}Time`}
          className="form-control custom-date-flatpickr flatpickr-input time-picker"
          kind="time"
          value={props.time}
          onChange={props.onTime}
          placeholder="Select time"
          disabled={props.checked}
        />
      </div>
      <Feedback id={props.errorId} show={props.error} i18nKey={props.errorKey}>
        {props.errorText}
      </Feedback>
    </div>
  );
}

type TimeSlotBoxProps = {
  slot: TimeSlotForm;
  no: number;
  roundType: RoundType;
  dayType: "day-of-week" | "day-of-month";
  canDelete: boolean;
  onChange: (slot: TimeSlotForm) => void;
  onDelete: () => void;
};

// "รอบเวลาทำภารกิจที่ N" (#time-mission-N)
function TimeSlotBox({ slot, no, roundType, dayType, canDelete, onChange, onDelete }: TimeSlotBoxProps) {
  const t = useT();
  const errors = useShownErrors(slot.id, timeSlotErrors(slot, roundType, dayType));
  const set = (patch: Partial<TimeSlotForm>) => onChange({ ...slot, ...patch });
  // handleMissionTimeAndRewardRadioTimeSet / handleMissionRoundTypeCustom
  const weekdays = roundType === "weekly" || (roundType === "custom" && dayType === "day-of-week");
  const specifyDate = roundType === "custom" && dayType === "day-of-month";
  const monthDays = roundType === "monthly";
  const toggleIn = (list: string[], value: string) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  // #display-time-mission-N: only the time inputs' oninput handlers rewrite it (a loaded mission keeps
  // "00:00 - 00:00")
  const [timeText, setTimeText] = useState("00:00 - 00:00");
  // handleMissionTimeAndRewardCheckboxAllDayMission() locks the time inputs; a loaded mission ticks the
  // box without it, so they stay editable
  const [timeLocked, setTimeLocked] = useState(false);

  return (
    <div className="box-time-mission" id={`time-mission-${no}`} data-time-mission={no}>
      <div className="box-time-mission-header">
        <div className="group-header-time-mission">
          <div className="text-p2-bold">
            <span className="mission-page" data-i18n="missionPage.missionActiveDateNo">
              {t("missionPage.missionActiveDateNo", "รอบเวลาทำภารกิจที่")}
            </span>{" "}
            {/* Captured id: every slot keeps the template's id here */}
            <span id="text-header-time-mission-template">{no}</span>
          </div>
          <DeleteButton className="group-btn-close-time-mission" show={canDelete} onClick={onDelete}>
            <span className="text-link color-red mission-page" data-i18n="missionPage.delete">
              {t("missionPage.delete", "ลบ")}
            </span>
          </DeleteButton>
        </div>
        <div className="group-text-time-mission">
          <span className="text-1">
            <span className="mission-page" data-i18n="missionPage.day">
              {t("missionPage.day", "วัน")}
            </span>{" "}
            {/* ORIGINAL BUG (kept on purpose, PK 15/11/2026): nothing in the original script writes this, so it
                always reads "-" whatever days are ticked. The fix would be to list the ticked days here. */}
            <span id={`display-day-mission-${no}`}>-</span>
          </span>
          <span className="text-2" id={`display-time-mission-${no}`}>
            {timeText}
          </span>
        </div>
      </div>
      <div className="box-time-mission-content">
        <div className="group-day-btn-time-mission">
          <div className={cx("group-btn-day-mission", !weekdays && "d-none")}>
            {WEEKDAYS.map(([value, label], index) => {
              const id = `checkboxDayMission-${no}-${index + 1}`;
              const checked = slot.days.includes(value);
              return (
                <label key={value} className={cx("mission-checkbox-label border-1", checked && "active")} htmlFor={id}>
                  <input
                    type="checkbox"
                    name={`checkboxDayMission-${no}`}
                    value={value}
                    id={id}
                    checked={checked}
                    onChange={() => set({ days: toggleIn(slot.days, value) })}
                  />
                  <div className="mission-checkbox-content">
                    <span className="text-p2-regular">{label}</span>
                  </div>
                </label>
              );
            })}
          </div>
          <div className={cx("group-btn-specify-date-mission", !specifyDate && "d-none")}>
            <div className="custom-input">
              <FlatpickrInput
                id={`missionTimeAndRewardInputSpecifyDateMission-${no}`}
                className="form-control custom-date-flatpickr flatpickr-input"
                kind="date"
                value={slot.specifyDate ?? ""}
                onChange={(value) => set({ specifyDate: value })}
                placeholder="dd/mm/yyyy"
              />
            </div>
          </div>
          <div className={cx("text-p2-bold label-title-month", !monthDays && "d-none", "mission-page")} data-i18n="missionPage.selectDate">
            {t("missionPage.selectDate", "เลือกวันที่")}
          </div>
          <div className={cx("group-btn-month-mission", !monthDays && "d-none")}>
            {ALL_MONTH_DAYS.map((day, index) => {
              // Captured ids are not slot-specific: checkboxMonthMission1 … checkboxMonthMission32
              const id = `checkboxMonthMission${index + 1}`;
              const checked = slot.monthDays.includes(day);
              return (
                <label key={day} className={cx("mission-checkbox-label border-1", day === "end" && "end-month", checked && "active")} htmlFor={id}>
                  <input
                    type="checkbox"
                    name={`checkboxMonthMission-${no}`}
                    value={day}
                    id={id}
                    checked={checked}
                    onChange={() => set({ monthDays: toggleIn(slot.monthDays, day) })}
                  />
                  <div className="mission-checkbox-content">
                    {day === "end" ? (
                      <span className="text-p2-regular mission-page" data-i18n="missionPage.missionLastDate">
                        {t("missionPage.missionLastDate", "วันสุดท้ายของเดือน")}
                      </span>
                    ) : (
                      <span className="text-p2-regular">{day}</span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
          <Feedback id={`error-TimeMissionSelectDay-${no}`} show={errors.day} i18nKey="missionPage.missionDurationErrorText3">
            {t("missionPage.missionDurationErrorText3", "กรุณาเลือกวันที่ทำภารกิจ")}
          </Feedback>
          <div className="group-input-time-mission">
            <div className="custom-input group-date-time">
              <FlatpickrInput
                id={`missionTimeAndRewardInputStartTimeMission-${no}`}
                className="form-control custom-date-flatpickr flatpickr-input"
                kind="time"
                value={slot.start}
                onChange={(start) => {
                  set({ start });
                  setTimeText((text) => `${start} - ${text.split(" - ")[1]}`);
                }}
                placeholder="00 : 00"
                disabled={timeLocked}
              />
              <span>-</span>
              <FlatpickrInput
                id={`missionTimeAndRewardInputEndTimeMission-${no}`}
                className="form-control custom-date-flatpickr flatpickr-input"
                kind="time"
                value={slot.end}
                onChange={(end) => {
                  set({ end });
                  setTimeText((text) => `${text.split(" - ")[0]} - ${end}`);
                }}
                placeholder="00 : 00"
                disabled={timeLocked}
              />
            </div>
            <div className="group-checkbox">
              <input
                type="checkbox"
                className="checkbox"
                id={`missionTimeAndRewardCheckboxAllDayMission-${no}`}
                checked={slot.allDay}
                onChange={(event) => {
                  set({ allDay: event.target.checked });
                  setTimeLocked(event.target.checked);
                }}
              />
              <label htmlFor={`missionTimeAndRewardCheckboxAllDayMission-${no}`} className="label-checkbox mission-page" data-i18n="missionPage.allDay">
                {t("missionPage.allDay", "ทั้งวัน")}
              </label>
            </div>
          </div>
          <Feedback id={`error-TimeMission-${no}`} show={errors.time} i18nKey="missionPage.missionDurationErrorText4">
            {t("missionPage.missionDurationErrorText4", "กรุณาเลือกรอบเวลาทำภารกิจ")}
          </Feedback>
        </div>
        <div className="group-checkbox group-checkbox-reset-mission">
          <input
            type="checkbox"
            className="checkbox"
            id={`missionTimeAndRewardCheckboxResetMission-${no}`}
            checked={slot.reset}
            onChange={(event) => set({ reset: event.target.checked })}
          />
          <label htmlFor={`missionTimeAndRewardCheckboxResetMission-${no}`} className="label-checkbox text-p2-regular">
            <span className="mission-page" data-i18n="missionPage.missionDurationTimeSubText1">
              {t(
                "missionPage.missionDurationTimeSubText1",
                "เมื่อครบรอบการทำภารกิจ ให้ Reset ภารกิจทั้งหมดใหม่ โดยไม่สนใจว่าสมาชิกจะทำภารกิจเสร็จหรือไม่",
              )}
            </span>{" "}
            <p className="text-p3-regular text-example mb-0 mission-page" data-i18n="missionPage.missionDurationTimeSubText2">
              {t(
                "missionPage.missionDurationTimeSubText2",
                "ตัวอย่าง : หากกำหนดรอบการทำภารกิจ คือ วันจันทร์​ 12:00 - 18:00 เมื่อเวลาเกิน 18:00 ไปแล้วจะถือว่าจบรอบ ภารกิจจะถูก reset ใหม่ทันที โดยสมาชิกที่ยังทำไม่เสร็จ จะต้องเริ่มทำใหม่เมื่อถึงวันจันทร์หน้า (รอบต่อไป)",
              )}
            </p>
          </label>
        </div>
      </div>
    </div>
  );
}

type ReceiveTypeCardsProps = {
  name: string;
  ids: [string, string];
  keys: [string, string, string, string]; // title/subtitle keys of the self and auto cards
  withPageClass?: boolean; // section 2 texts carry .mission-page, sub-mission ones do not
  value: "manual" | "auto";
  onChange: (value: "manual" | "auto") => void;
};

// "สมาชิกรับรางวัลเอง" / "ระบบให้รางวัลโดยอัตโนมัติ (Auto)" radio cards
export function ReceiveTypeCards({ name, ids, keys, withPageClass, value, onChange }: ReceiveTypeCardsProps) {
  const t = useT();
  const key = (k: string) => (withPageClass ? k : "");
  return (
    <div className="group-btn-mission-format">
      <RadioCard
        name={name}
        id={ids[0]}
        value="manual"
        checked={value === "manual"}
        onCheck={() => onChange("manual")}
        icon="/assets/images/mission/icon-mission-reward-self.png"
        title={[key(keys[0]), t(keys[0], "สมาชิกรับรางวัลเอง")]}
        subtitle={[key(keys[1]), t(keys[1], "เมื่อทำภารกิจสำเร็จ สมาชิกจะสามารถกดรับได้ด้วยตนเอง")]}
      />
      <RadioCard
        name={name}
        id={ids[1]}
        value="auto"
        checked={value === "auto"}
        onCheck={() => onChange("auto")}
        icon="/assets/images/mission/icon-mission-reward-auto.png"
        title={[key(keys[2]), t(keys[2], "ระบบให้รางวัลโดยอัตโนมัติ (Auto)")]}
        subtitle={[key(keys[3]), t(keys[3], "เมื่อสมาชิกทำภารกิจสำเร็จแล้ว ระบบจะให้รางวัลโดยอัตโนมัติ")]}
      />
    </div>
  );
}

type TurnoverAlertValue = Pick<
  MissionFormValues,
  "turnOverEnabled" | "turnOverValue" | "alertEnabled" | "alertPopup" | "alertFloating" | "turnOverType" | "turnOverTimeValue"
>;

type TurnoverAndAlertProps = {
  ids: {
    turnOverSwitch: string;
    byTime: string;
    byTimeValue: string;
    byTimeError: string;
    byUnit: string;
    byUnitValue: string;
    byUnitError: string;
    byUnitErrorKey: string;
    alertSwitch: string;
    alertPopup: string;
    alertPopupFor: string;
    alertFloating: string;
    alertFloatingFor: string;
  };
  hooks: { turnOver: string; alert: string }; // classes toggled by the switches ("…2" = shown when on)
  main?: boolean; // section 2 markup (texts carry .mission-page) vs sub-mission markup
  byTimeCard?: boolean; // section 2: the "x เท่า" card is shown
  value: TurnoverAlertValue;
  onChange: (patch: Partial<TurnoverAlertValue>) => void;
};

// "กำหนดการติดเทิร์นโอเวอร์" + "รูปแบบการแจ้งเตือนภารกิจ" column (section 2 and every sub-mission)
export function TurnoverAndAlert({ ids, hooks, main, byTimeCard, value, onChange }: TurnoverAndAlertProps) {
  const t = useT();
  const pageClass = main ? "mission-page" : undefined;
  const text = (key: string, fallback: string, className?: string): ReactNode => (
    <span className={cx(className, pageClass)} data-i18n={key}>
      {t(key, fallback)}
    </span>
  );
  const byTime = value.turnOverType === "by-time";
  const turnOverMissing = value.turnOverEnabled && !byTime && !(Number(value.turnOverValue) > 0);
  const byTimeMissing = value.turnOverEnabled && byTime && !(Number(value.turnOverTimeValue ?? "") > 0);

  return (
    <>
      <div className="label-title-bg">{text("missionPage.missionRewardTurnOver", "กำหนดการติดเทิร์นโอเวอร์ (Turnover)", "text-in-label")}</div>
      <SwitchRow
        id={ids.turnOverSwitch}
        checked={value.turnOverEnabled}
        onChange={(turnOverEnabled) => onChange({ turnOverEnabled })}
        className={cx("switch-title", pageClass)}
        i18nKey="missionPage.missionRewardTurnOverOnOff"
      >
        {t("missionPage.missionRewardTurnOverOnOff", "เปิด / ปิดใช้งาน การติดเทิร์นโอเวอร์")}
      </SwitchRow>
      <WarningBox className={hooks.turnOver} hidden={value.turnOverEnabled}>
        {main ? (
          <span className="text-warning-mission">
            {text("missionPage.missionRewardWarningText1", "หากไม่เปิดใช้งานการติดเทิร์นโอเวอร์")}
            <br />{" "}
            {text("missionPage.missionRewardWarningText2", "ของรางวัลทุกชิ้นที่ให้สมาชิกจะไม่มี")}
            <br />{" "}
            {text("missionPage.missionRewardWarningText3", "การติดเทริ์น")}
          </span>
        ) : (
          // Sub-mission version: plain Thai text, typo "ของอรางวัล" as on staging; the two spans point at
          // keys missing from the locale files, so they stay empty
          <span className="text-warning-mission">
            หากไม่เปิดใช้งานการติดเทิร์นโอเวอร์
            <br />
            <span data-i18n="missionPage.missionRewardWarningText2"></span>
            ของอรางวัลทุกชิ้นที่ให้สมาชิกจะไม่มี
            <br />
            <span data-i18n="missionPage.missionRewardWarningText3"></span>
            การติดเทริ์น
          </span>
        )}
      </WarningBox>
      <div className={cx("group-card-select", `${hooks.turnOver}2`, !value.turnOverEnabled && "d-none")}>
        {/* "x เท่า" card: section 2 shows it while a reward is เครดิต (validateMission2); hidden in sub-missions */}
        <label className={cx("card-select-item", !byTimeCard && "d-none", byTime && "active")} htmlFor={ids.byTime}>
          <input
            type="radio"
            className="d-none"
            name={`${ids.byTime}-type`}
            id={ids.byTime}
            disabled={!main}
            checked={byTime}
            onChange={() => onChange({ turnOverType: "by-time" })}
          />
          <div className="group-card-content">
            <div className="card-icon">
              <img src="/assets/images/mission/icon-turnover-min.png" alt={main ? "" : "-"} width="32" height="32" />
            </div>
            <div className="card-select-detail">
              {text("missionPage.missionTurnOverText", "ทำเทิร์นโอเวอร์ ขั้นต่ำ x เท่า", "text-p2-regular")}
              {text(
                "missionPage.missionTurnOverSubText",
                "ตัวอย่าง : ลูกค้ารับโปร 200 เครดิต หากตั้งค่า ทำ เทิร์น 5 เท่า ลูกค้าจะต้องทำเทิร์น = 200 x 5 = 1,000 ถึงจะถอนเครดิตได้",
                "text-p3-regular text-example",
              )}
              <div className={cx("custom-input group-input group-input-card", !byTime && "disabled")}>
                <div className="input-outer input-outer-card">
                  <div className="input-outer-card-suffix start">{text("missionPage.doTurnOver", "ทำเทิร์นโอเวอร์", "text-p2-regular")}</div>
                  <input
                    type="number"
                    className="input input-card"
                    placeholder=""
                    id={ids.byTimeValue}
                    disabled={!byTime}
                    value={value.turnOverTimeValue ?? ""}
                    onChange={(event) => onChange({ turnOverTimeValue: event.target.value })}
                  />
                  <div className="input-outer-card-suffix">{text("missionPage.times", "เท่า", "text-p2-regular")}</div>
                </div>
                <Feedback id={ids.byTimeError} show={byTimeMissing} i18nKey="missionPage.missionDurationErrorText5" className={cx("invalid-feedback", pageClass)}>
                  {t("missionPage.missionDurationErrorText5", "กรุณากรอกจำนวนเทิร์นโอเวอร์")}
                </Feedback>
              </div>
            </div>
          </div>
        </label>
        <label className={cx("card-select-item", !byTime && "active")} htmlFor={ids.byUnit}>
          <input
            type="radio"
            className="d-none"
            name={`${ids.byTime}-type`}
            id={ids.byUnit}
            checked={!byTime}
            onChange={() => onChange({ turnOverType: "by-unit" })}
          />
          <div className="group-card-content">
            <div className="card-icon">
              <img src="/assets/images/mission/icon-turnover-min.png" alt={main ? "" : "-"} width="32" height="32" />
            </div>
            <div className="card-select-detail">
              {main ? (
                text("missionPage.missionTurnOverText2", "ทำเทิร์นโอเวอร์ ขั้นต่ำ x บาท", "text-p2-regular")
              ) : (
                // the sub-mission template's own text (never re-localized there)
                <span className="text-p2-regular" data-i18n="missionPage.missionTurnOverText2">
                  ทำเทิร์นโอเวอร์ เท่ากับ x บาท
                </span>
              )}
              {text(
                "missionPage.missionTurnOverSubText2",
                "ตัวอย่าง : รับรางวัล 5 แต้ม หากตั้งค่า ทำ เทิร์นเท่ากับ 500 ลูกค้าจะต้องทำเทิร์น = 500 ถึงจะถอนเครดิตได้",
                "text-p3-regular text-example",
              )}
              <div className={cx("custom-input group-input group-input-card", byTime && "disabled")}>
                <div className="input-outer input-outer-card">
                  <div className="input-outer-card-suffix start">{text("missionPage.doTurnOver", "ทำเทิร์นโอเวอร์", "text-p2-regular")}</div>
                  <input
                    type="number"
                    className="input input-card"
                    placeholder=""
                    disabled={byTime}
                    id={ids.byUnitValue}
                    value={value.turnOverValue}
                    onChange={(event) => onChange({ turnOverValue: event.target.value })}
                  />
                  <div className="input-outer-card-suffix">{text("missionPage.baht", "บาท", "text-p2-regular")}</div>
                </div>
                <Feedback id={ids.byUnitError} show={turnOverMissing} i18nKey={ids.byUnitErrorKey} className={cx("invalid-feedback", pageClass)}>
                  {t(ids.byUnitErrorKey, "กรุณากรอกจำนวนเทิร์นโอเวอร์")}
                </Feedback>
              </div>
            </div>
          </div>
        </label>
      </div>
      <div className="label-title-bg">{text("missionPage.missionNotification", "รูปแบบการแจ้งเตือนภารกิจ", "text-in-label")}</div>
      <SwitchRow
        id={ids.alertSwitch}
        checked={value.alertEnabled}
        onChange={(alertEnabled) => onChange({ alertEnabled })}
        className={cx("switch-title", pageClass)}
        i18nKey="missionPage.missionNotificationOnOff"
      >
        {t("missionPage.missionNotificationOnOff", "เปิด / ปิดใช้งาน การแจ้งเตือนภารกิจ")}
      </SwitchRow>
      <WarningBox className={hooks.alert} hidden={value.alertEnabled}>
        <span className="text-warning-mission">
          {text("missionPage.missionNotificationSubText1", "เมื่อเปิดใช้งานการแจ้งเตือนภารกิจ")}
          <br />{" "}
          {text("missionPage.missionNotificationSubText2", "ระบบะจะแจ้งเตือกให้สมาชิกรู้เสมอ")}
        </span>
      </WarningBox>
      <div className={cx("group-alert-mission", `${hooks.alert}2`, !value.alertEnabled && "d-none")}>
        <div className="title-alert-mission">{text("missionPage.missionNotificationType", "เลือกกำหนดรูปแบบการแจ้งเตือนภารกิจ", "text-p2-bold")}</div>
        <div className="content-alert-mission-popup">
          <div className="group-checkbox">
            <input
              type="checkbox"
              className="checkbox"
              id={ids.alertPopup}
              checked={value.alertPopup}
              onChange={(event) => onChange({ alertPopup: event.target.checked })}
            />
            <div className="group-text-checkbox">
              <label htmlFor={ids.alertPopupFor} className={cx("label-checkbox", pageClass)} data-i18n="missionPage.missionNotificationStartUp">
                {t("missionPage.missionNotificationStartUp", "แจ้งเตือนเป็น Pop Up เมื่อเข้าสู่ระบบ")}
              </label>
              {text("missionPage.missionNotificationStartUpType1", "Pop up จะแสดงเพียงครั้งเดียวที่เข้าสู่ระบบสำเร็จ", "text-example")}
            </div>
          </div>
          <div className="preview-popup-mission">
            <div className="preview-popup-container">
              {POPUP_EXAMPLES.map((src, index) => (
                <img key={src} src={src} alt={`ex ${index + 1}`} />
              ))}
            </div>
          </div>
          {text("missionPage.missionNotificationEx", "ตัวอย่างการแจ้งเตือนภารกิจ", "preview-title")}
        </div>
        <div className="content-alert-mission-floating-action-button">
          <div className="group-checkbox">
            <input
              type="checkbox"
              className="checkbox"
              id={ids.alertFloating}
              checked={value.alertFloating}
              onChange={(event) => onChange({ alertFloating: event.target.checked })}
            />
            <div className="group-text-checkbox">
              <label htmlFor={ids.alertFloatingFor} className={cx("label-checkbox", pageClass)} data-i18n="missionPage.missionNotificationFloat">
                {t("missionPage.missionNotificationFloat", "แจ้งเตือนเป็น Floating Action Button บนหน้าจอ")}
              </label>
              {main ? (
                <span className="text-p3-regular text-example">
                  {text("missionPage.missionNotificationFloatSubText1", "ปุ่มจะแสดงลอยอยู่บนหน้าจอตลอดเวลาและสามารถเลื่อน")}
                  <br />{" "}
                  {text("missionPage.missionNotificationFloatSubText2", "หรือปิดปุ่มได้แต่จะกลับมาแสดงอีกครั้งเมื่อเข้าสู่ระบบใหม่")}
                </span>
              ) : (
                <>
                  {text("missionPage.missionNotificationFloatSubText1", "ปุ่มจะแสดงลอยอยู่บนหน้าจอตลอดเวลาและสามารถเลื่อน", "text-p3-regular text-example")}
                  <br />{" "}
                  {text("missionPage.missionNotificationFloatSubText2", "หรือปิดปุ่มได้แต่จะกลับมาแสดงอีกครั้งเมื่อเข้าสู่ระบบใหม่", "text-p3-regular text-example")}
                </>
              )}
            </div>
          </div>
          <div className="preview-popup-mission">
            <img src={FLOATING_EXAMPLE} alt={main ? "ตัวอย่างการแจ้งเตือน 1" : "ex-1"} />
          </div>
          {text("missionPage.missionNotificationFloatEx", "รูปตัวอย่างการแจ้งเตือนแบบ Floating Action Button", "preview-title")}
        </div>
      </div>
    </>
  );
}
