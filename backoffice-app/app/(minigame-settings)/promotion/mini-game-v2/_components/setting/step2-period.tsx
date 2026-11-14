"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

// Step 2 (three tabs): 2-1 duration & working days, 2-2 countdown, 2-3 limits / reset / game providers.
// Markup = captured create-lucky-wheel_step2_all-tabs.html; parts the capture tool collapsed or
// withheld (day buttons, countdown choices, per-member rows, provider list) are rebuilt and marked.

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Instance } from "flatpickr/dist/types/instance";
import { CustomDropdown, cx, type DropdownItem } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { getCustomerGroups, getGameProviders, getMiniGames, type GameProvider } from "@/lib/api/mini-games";
import * as dom from "./wizard-dom";
import { TypeText } from "./wizard-texts";
import { raw, shownWhen, type StepProps } from "./wizard-types";

type TimeSlot = { key: number; start: string; end: string };
const isAllDay = (slot: TimeSlot | undefined) => !!slot && slot.start === "00:00" && slot.end === "23:59";

const DAYS = [
  ["sunday", "อา", "enableSunday"],
  ["monday", "จ", "enableMonday"],
  ["tuesday", "อ", "enableTuesday"],
  ["wednesday", "พ", "enableWednesday"],
  ["thursday", "พฤ", "enableThursday"],
  ["friday", "ศ", "enableFriday"],
  ["saturday", "ส", "enableSaturday"],
] as const;
type Day = (typeof DAYS)[number][0];
const WEEKDAYS: Day[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const WEEKEND: Day[] = ["saturday", "sunday"];

// "กำหนดวันทำงาน" buttons (changePromotionSelectDay / Weekday / Weekend / Everyday).
// The capture tool withheld these buttons' attributes: ids come from scriptminigame.js, classes
// from base.css (.box-promotion-select-day, .btn-custom-day-N, button.everyday) — a reconstruction.
// The original updates the preset highlight before toggling the day (one click late); here it
// always matches the selected days.
function WorkDays() {
  const [days, setDays] = useState<Record<Day, boolean>>({ sunday: true, monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true });
  const only = (set: Day[]) => DAYS.every(([day]) => days[day] === set.includes(day));
  const weekday = only(WEEKDAYS);
  const weekend = only(WEEKEND);
  const everyday = DAYS.every(([day]) => days[day]);
  const pick = (set: Day[], active: boolean) => setDays(Object.fromEntries(DAYS.map(([day]) => [day, !active && set.includes(day)])) as Record<Day, boolean>);

  return (
    <>
      <div className="days">
        {DAYS.map(([day, label, id]) => (
          <button key={day} id={id} className={cx("btn system-btn btn-rounded box-promotion-select-day", !days[day] && "no-select")} onClick={() => setDays({ ...days, [day]: !days[day] })}>
            {label}
          </button>
        ))}
      </div>
      <div className="input-days">
        <button id="boxPromotionSelectWeekday" className={cx("btn system-btn btn-rounded btn-custom-day-1", !weekday && "no-select")} onClick={() => pick(WEEKDAYS, weekday)}>
          วันปกติ (weekday)
        </button>{" "}
        <button id="boxPromotionSelectWeekend" className={cx("btn system-btn btn-rounded btn-custom-day-2", !weekend && "no-select")} onClick={() => pick(WEEKEND, weekend)}>
          วันสุดสัปดาห์ (weekend)
        </button>
      </div>
      <button id="boxPromotionSelectEveryday" className={cx("btn system-btn btn-rounded everyday btn-custom-day-3", !everyday && "no-select")} onClick={() => pick(DAYS.map(([day]) => day), everyday)}>
        ทุกวัน จันทร์ - อาทิตย์ (everyday)
      </button>
    </>
  );
}

// Countdown choice 2 + its two boxes. The capture collapsed these siblings; rebuilt from the
// screenshot, the ids scriptminigame.js reads and the inline styles recovered for them.
function CountdownChoices({ type }: { type: StepProps["type"] }) {
  const t = useT();
  const selectBox = (e: MouseEvent<HTMLDivElement>) => dom.selectChangeMinigameBoxRadio(e.currentTarget);
  return (
    <>
      <div className="col-12">
        <div className="form-check minigame-reset disabled fistempty">
          <input
            className="form-check-input me-2"
            type="radio"
            name="minigameCountdownRadio"
            id="minigameEnableCountDownSetTime"
            data-value-id="2"
            data-value-id1="boxMinigameCountdownRadioDays"
            data-value-id2="boxMinigameCountdownRadioDaterange"
            onClick={(e) => dom.changeMinigameCountdownRadio(e.currentTarget)}
          />{" "}
          <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableCountDownSetTime">
            <div className="p2" style={{ color: "rgb(233, 233, 233)" }}>
              <span data-i18n="minigameSetting.countdownNow">{t("minigameSetting.countdownNow", "นับถอยหลังทันทีเมื่อถึงกำหนด")}</span>
            </div>
            <span className="p3" id="textTabsStep2-2-4" style={{ color: "rgb(130, 130, 130)" }}>
              <TypeText type={type} k="tabs2-2-4" />
            </span>
          </label>
        </div>
      </div>
      <div className="col-12">
        <div className="row">
          <div className="col-6">
            <div className="box-minigame-click-select minigame-box-reset disabled" id="boxMinigameCountdownRadioDays" data-value-id="1" data-value-id1="boxMinigameCountdownRadioDays" data-value-id2="boxMinigameCountdownRadioDaterange" onClick={selectBox}>
              <input className="form-check-input box-radio d-none" type="radio" name="minigameCountdownBoxRadio" id="minigameEnableRemainingDay" />
              <div className="row">
                <div className="row">
                  {/* The box icon (screenshot: a clock illustration) was not captured and its file name is
                      unknown; the column is kept empty instead of pointing at a wrong path */}
                  <div className="col-3"></div>
                  <div className="col-9">
                    <div className="p2 fw-700" data-i18n="minigameSetting.countdownWhenXDay">{t("minigameSetting.countdownWhenXDay", "นับถอยหลังทันเมื่อเหลือ x วัน")}</div>
                    <span className="p3" data-i18n="minigameSetting.countdownWhenXDaySubText" style={{ color: "rgb(173, 173, 173)" }}>
                      {t("minigameSetting.countdownWhenXDaySubText", "ระบบจะนับถอยหลังทันทีที่วันหมด อายุโปรเหลือเท่าที่คุณกำหนด")}
                    </span>
                  </div>
                </div>
                <div className="custom-input custom-float" id="inputMinigameCountdownRemainingDay">
                  <div className="p3 text-center mb-2" data-i18n="minigameSetting.countdownWhen">{t("minigameSetting.countdownWhen", "นับถอยหลังทันทีเมื่อเหลืออีก...")}</div>
                  <div className="input-group">
                    <input id="minigameCountdownRemainingDay" type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                    <span className="input-group-text custom-color" style={{ borderRadius: "0px 8px 8px 0px" }}>วัน</span>
                  </div>
                  <div className="invalid-feedback" id="error-promotionCountdownAmount" style={{ display: "none" }}>กรุณากรอกจำนวนวัน</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="box-minigame-click-select minigame-box-reset disabled" id="boxMinigameCountdownRadioDaterange" data-value-id="2" data-value-id1="boxMinigameCountdownRadioDays" data-value-id2="boxMinigameCountdownRadioDaterange" onClick={selectBox}>
              <input className="form-check-input box-radio d-none" type="radio" name="minigameCountdownBoxRadio" id="minigameEnableRemainingDateTime" />
              <div className="row">
                <div className="row">
                  {/* The box icon (screenshot: a clock illustration) was not captured and its file name is
                      unknown; the column is kept empty instead of pointing at a wrong path */}
                  <div className="col-3"></div>
                  <div className="col-9">
                    <div className="p2 fw-700" data-i18n="minigameSetting.countdownWithSpecificDate">{t("minigameSetting.countdownWithSpecificDate", "นับถอยหลังทันทีเมื่อถึงวัน และเวลาที่กำหนด")}</div>
                    <span className="p3" data-i18n="minigameSetting.settingDateAndSetCountdown" style={{ color: "rgb(173, 173, 173)" }}>
                      {t("minigameSetting.settingDateAndSetCountdown", "กำหนดวันและเวลาให้นับถอยหลัง")}
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <div className="custom-input">
                    <input type="text" className="form-control custom-date-flatpickr flatpickr-input" id="minigameCountdownRemainingDateBkk" data-provider="datepickr" placeholder={t("minigameSetting.phDateInput", "วัน/เดือน/ปี")} readOnly />
                  </div>
                  <div className="custom-input">
                    <input type="text" className="form-control custom-date-flatpickr flatpickr-input" id="minigameCountdownRemainingTimeBkk" data-provider="timepickr" placeholder={t("minigameSetting.phTimeInput", "เลือกเวลา")} readOnly />
                  </div>
                </div>
                <div className="invalid-feedback" id="error-promotionCountdownDate" style={{ display: "none" }}>กรุณาเลือกวันที่</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

let nextKey = 1;

export function Step2Period({ type, step, nav, initial }: StepProps) {
  const t = useT();
  const [times, setTimes] = useState<TimeSlot[]>(() => (initial?.detail.times ?? [{ start: "00:00", end: "23:59" }]).map((slot) => ({ ...slot, key: nextKey++ })));
  const [groupsOn, setGroupsOn] = useState(false);
  const [groups, setGroups] = useState<string[]>([]);
  const [groupItems, setGroupItems] = useState<DropdownItem[]>([]);
  const [chanceOn, setChanceOn] = useState(false);
  const [chances, setChances] = useState<{ key: number; game: string | null }[]>([{ key: nextKey++, game: null }]);
  const [gameItems, setGameItems] = useState<DropdownItem[]>([]);
  const [providers, setProviders] = useState<GameProvider[]>([]);
  const pickers = useRef(new Map<string, Instance>());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCustomerGroups().then((list) => setGroupItems(list.map((g) => ({ value: g.value, chip: g.label, label: g.label }))));
    getGameProviders().then(setProviders);
    // Original: GET /api/promotion/get-promotion-deposit-mini-game (the other mini-games)
    getMiniGames().then((list) => setGameItems(list.map((g) => ({ value: g.id, label: g.name }))));
  }, []);

  // flatpickr on every date / time input of the step (scriptminigame.js initialises them on load
  // and on each added time slot)
  useEffect(() => {
    let alive = true;
    import("flatpickr").then(({ default: flatpickr }) => {
      if (!alive || !rootRef.current) return;
      for (const el of Array.from(rootRef.current.querySelectorAll<HTMLInputElement>("input.custom-date-flatpickr"))) {
        if (pickers.current.has(el.id)) continue;
        const time = el.dataset.provider === "timepickr" || /Time/.test(el.id);
        const picker = flatpickr(el, {
          ...(time ? { enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true } : { dateFormat: "d/m/Y" }),
          onChange: (_, text) => {
            if (el.id === "startDateSettingMinigameFromInput") pickers.current.get("endDateSettingMinigameFromInput")?.set("minDate", text);
            const slot = el.id.match(/^minigameCustom(Start|End)Time-(\d+)$/);
            if (slot) setTimes((list) => list.map((s, i) => (i + 1 === Number(slot[2]) ? { ...s, [slot[1] === "Start" ? "start" : "end"]: text } : s)));
            dom.changeFormatStartDateEndDateSelect();
            el.dispatchEvent(new Event("input", { bubbles: true }));
          },
        });
        pickers.current.set(el.id, picker as Instance);
      }
    });
    return () => {
      alive = false;
    };
  }, [times.length]);

  useEffect(() => {
    const map = pickers.current;
    return () => {
      map.forEach((picker) => picker.destroy());
      map.clear();
    };
  }, []);

  const actions = {
    addTemplateMinigameDatetime: () => setTimes((list) => [...list, { key: nextKey++, start: "", end: "" }]),
    deleteTemplateMinigameDatetime: (n: number) => {
      pickers.current.forEach((picker, id) => id.endsWith(`-${n}`) && /^minigameCustom/.test(id) && picker.destroy());
      pickers.current.forEach((_, id) => /^minigameCustom/.test(id) && pickers.current.delete(id));
      setTimes((list) => list.filter((_, i) => i + 1 !== n));
    },
    changeMinigameSelectTimeAllDay: (n: number) => {
      pickers.current.get(`minigameCustomStartTime-${n}`)?.setDate("00:00");
      pickers.current.get(`minigameCustomEndTime-${n}`)?.setDate("23:59");
      dom.changeMinigameSelectTimeAllDay(n);
      setTimes((list) => list.map((s, i) => (i + 1 === n ? { ...s, start: "00:00", end: "23:59" } : s)));
    },
    addTemplateMinigameRemoveChance: () => setChances((list) => [...list, { key: nextKey++, game: null }]),
    deleteTemplateMinigamePrivilege: (key: number) => setChances((list) => list.filter((row) => row.key !== key)),
  };

  // The chosen mini-game unlocks the "จำนวนสิทธิ์" input next to it (dropdown data-value link)
  const pickChanceGame = (key: number, game: string | null, n: number) => {
    setChances((list) => list.map((row) => (row.key === key ? { ...row, game } : row)));
    document.getElementById(`inputMinigameChanceAmount-${n}`)?.classList.toggle("disabled", !game);
  };

  return (
    <div className="canvas-box-body" id="SettingMinigameStep2" style={shownWhen(step.startsWith("2-"))} ref={rootRef}>
      <div className="tab-header">
        <div className={step === "2-1" || !step.startsWith("2-") ? "header-in-body tabs active" : "header-in-body tabs"} id="SettingMinigameTabsStep2-1">
          <span className="p1 fw-700" id="textTabsStep2-1-1">
    <TypeText type={type} k="tabs2-1-1" />
          </span>
        </div>
        <div className={step === "2-2" ? "header-in-body tabs active" : "header-in-body tabs"} id="SettingMinigameTabsStep2-2">
          <span className="p1 fw-700" id="textTabsStep2-1-2">
    <TypeText type={type} k="tabs2-1-2" />
          </span>
        </div>
        <div className={step === "2-3" ? "header-in-body tabs active" : "header-in-body tabs"} id="SettingMinigameTabsStep2-3">
          <span className="p1 fw-700" data-i18n="minigameSetting.subHeaderMinigame23">{t("minigameSetting.subHeaderMinigame23", "การจำกัดสิทธิ์การรับโปรโมชั่น")}</span>
        </div>
      </div>
      <div className="main-in-detail-body content-col-1" id="SettingMinigameStep2-1" style={shownWhen(step === "2-1")}>
        <div className="label-minigame">
          <span id="textTabsStep2-1-3">
    <TypeText type={type} k="tabs2-1-3" />
          </span>
          <div className="select-date">
            <label className="mb-0" data-i18n="minigameSetting.choose">{t("minigameSetting.choose", "คุณเลือก :")}</label>
            <span id="showStartDateEndDateSelect">-</span>
          </div>
          <div className="switch">
            <div className="custom-switch switch-alone form-check form-switch">
              <input className="form-check-input" type="checkbox" id="minigameEnableStartEndDate" onChange={(e) => dom.changeStatusSwitch(e.currentTarget, "2-2-1-1")} />
              {" "}
              <input type="hidden" name="enableStartEndDate" id="enableStartEndDate" defaultValue="false" />
            </div>
          </div>
        </div>
        <div className="input-col-2 switch-2-2-1-1">
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <label className="form-label" data-i18n="minigameSetting.startDate">{t("minigameSetting.startDate", "วันที่เริ่มต้น")}</label>
            </div>
            <div className="custom-input mb-3">
              <input type="text" className="form-control custom-date-flatpickr flatpickr-input" data-i18n="[placeholder]minigameSetting.phDateInputFull" placeholder={t("minigameSetting.phDateInputFull", "เลือก วัน/เดือน/ปี")} id="startDateSettingMinigameFromInput" data-provider="flatpickr" data-date-format="d/m/Y" defaultValue="" disabled readOnly />
              <div className="float-prepend">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.0911 2.36023H11.5938V1.85677C11.5938 1.56911 11.3607 1.33594 11.0732 1.33594C10.7857 1.33594 10.5526 1.56911 10.5526 1.85677V2.36023H5.44478V1.85677C5.44478 1.56911 5.21171 1.33594 4.92418 1.33594C4.63665 1.33594 4.40358 1.56911 4.40358 1.85677V2.36023H3.90628C2.48683 2.36023 1.33203 3.51555 1.33203 4.9356V12.0939C1.33203 13.514 2.48683 14.6693 3.90628 14.6693H12.0911C13.5106 14.6693 14.6654 13.514 14.6654 12.0939V4.9356C14.6654 3.51555 13.5106 2.36023 12.0911 2.36023ZM3.90628 3.4019H4.40358V4.41753C4.40358 4.70518 4.63665 4.93836 4.92418 4.93836C5.21171 4.93836 5.44478 4.70518 5.44478 4.41753V3.4019H10.5526V4.41753C10.5526 4.70518 10.7857 4.93836 11.0732 4.93836C11.3607 4.93836 11.5938 4.70518 11.5938 4.41753V3.4019H12.0911C12.9364 3.4019 13.6242 4.08992 13.6242 4.9356V5.43315H2.37323V4.9356C2.37323 4.08992 3.06095 3.4019 3.90628 3.4019ZM12.0911 13.6276H3.90628C3.06095 13.6276 2.37323 12.9396 2.37323 12.0939V6.47482H13.6242V12.0939C13.6242 12.9396 12.9364 13.6276 12.0911 13.6276ZM5.95672 8.52344C5.95672 8.81109 5.72364 9.04427 5.43612 9.04427H4.41227C4.12475 9.04427 3.89167 8.81109 3.89167 8.52344C3.89167 8.23578 4.12475 8.0026 4.41227 8.0026H5.43612C5.72362 8.0026 5.95672 8.23578 5.95672 8.52344ZM12.1057 8.52344C12.1057 8.81109 11.8727 9.04427 11.5851 9.04427H10.5613C10.2738 9.04427 10.0407 8.81109 10.0407 8.52344C10.0407 8.23578 10.2738 8.0026 10.5613 8.0026H11.5851C11.8726 8.0026 12.1057 8.23578 12.1057 8.52344ZM9.02826 8.52344C9.02826 8.81109 8.79519 9.04427 8.50766 9.04427H7.48382C7.19629 9.04427 6.96322 8.81109 6.96322 8.52344C6.96322 8.23578 7.19629 8.0026 7.48382 8.0026H8.50766C8.79517 8.0026 9.02826 8.23578 9.02826 8.52344ZM5.95672 11.5964C5.95672 11.884 5.72364 12.1172 5.43612 12.1172H4.41227C4.12475 12.1172 3.89167 11.884 3.89167 11.5964C3.89167 11.3087 4.12475 11.0755 4.41227 11.0755H5.43612C5.72362 11.0755 5.95672 11.3087 5.95672 11.5964ZM12.1057 11.5964C12.1057 11.884 11.8727 12.1172 11.5851 12.1172H10.5613C10.2738 12.1172 10.0407 11.884 10.0407 11.5964C10.0407 11.3087 10.2738 11.0755 10.5613 11.0755H11.5851C11.8726 11.0755 12.1057 11.3087 12.1057 11.5964ZM9.02826 11.5964C9.02826 11.884 8.79519 12.1172 8.50766 12.1172H7.48382C7.19629 12.1172 6.96322 11.884 6.96322 11.5964C6.96322 11.3087 7.19629 11.0755 7.48382 11.0755H8.50766C8.79517 11.0755 9.02826 11.3087 9.02826 11.5964Z" fill="#5E5E5E" />
                </svg>
                {" "}
                <svg className="navigate-close" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={(e) => dom.clearValue(e.currentTarget)}>
                  <path d="M12.4495 3.55038C12.3104 3.41135 12.1218 3.33325 11.9252 3.33325C11.7285 3.33325 11.5399 3.41135 11.4009 3.55038L7.99992 6.95131L4.59899 3.55038C4.45992 3.41135 4.27133 3.33325 4.07468 3.33325C3.87804 3.33325 3.68945 3.41135 3.55038 3.55038C3.41135 3.68945 3.33325 3.87804 3.33325 4.07468C3.33325 4.27133 3.41135 4.45992 3.55038 4.59899L6.95131 7.99992L3.55038 11.4009C3.41135 11.5399 3.33325 11.7285 3.33325 11.9252C3.33325 12.1218 3.41135 12.3104 3.55038 12.4495C3.68945 12.5885 3.87804 12.6666 4.07468 12.6666C4.27133 12.6666 4.45992 12.5885 4.59899 12.4495L7.99992 9.04853L11.4009 12.4495C11.5399 12.5885 11.7285 12.6666 11.9252 12.6666C12.1218 12.6666 12.3104 12.5885 12.4495 12.4495C12.5885 12.3104 12.6666 12.1218 12.6666 11.9252C12.6666 11.7285 12.5885 11.5399 12.4495 11.4009L9.04853 7.99992L12.4495 4.59899C12.5885 4.45992 12.6666 4.27133 12.6666 4.07468C12.6666 3.87804 12.5885 3.68945 12.4495 3.55038Z" />
                </svg>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <label className="form-label" data-i18n="minigameSetting.endDate">{t("minigameSetting.endDate", "วันที่สิ้นสุด")}</label>
            </div>
            <div className="custom-input mb-3">
              <input type="text" className="form-control custom-date-flatpickr flatpickr-input" data-i18n="[placeholder]minigameSetting.phDateInputFull" placeholder={t("minigameSetting.phDateInputFull", "เลือก วัน/เดือน/ปี")} id="endDateSettingMinigameFromInput" data-provider="flatpickr" data-date-format="d/m/Y" defaultValue="" disabled readOnly />
              <div className="float-prepend">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.0911 2.36023H11.5938V1.85677C11.5938 1.56911 11.3607 1.33594 11.0732 1.33594C10.7857 1.33594 10.5526 1.56911 10.5526 1.85677V2.36023H5.44478V1.85677C5.44478 1.56911 5.21171 1.33594 4.92418 1.33594C4.63665 1.33594 4.40358 1.56911 4.40358 1.85677V2.36023H3.90628C2.48683 2.36023 1.33203 3.51555 1.33203 4.9356V12.0939C1.33203 13.514 2.48683 14.6693 3.90628 14.6693H12.0911C13.5106 14.6693 14.6654 13.514 14.6654 12.0939V4.9356C14.6654 3.51555 13.5106 2.36023 12.0911 2.36023ZM3.90628 3.4019H4.40358V4.41753C4.40358 4.70518 4.63665 4.93836 4.92418 4.93836C5.21171 4.93836 5.44478 4.70518 5.44478 4.41753V3.4019H10.5526V4.41753C10.5526 4.70518 10.7857 4.93836 11.0732 4.93836C11.3607 4.93836 11.5938 4.70518 11.5938 4.41753V3.4019H12.0911C12.9364 3.4019 13.6242 4.08992 13.6242 4.9356V5.43315H2.37323V4.9356C2.37323 4.08992 3.06095 3.4019 3.90628 3.4019ZM12.0911 13.6276H3.90628C3.06095 13.6276 2.37323 12.9396 2.37323 12.0939V6.47482H13.6242V12.0939C13.6242 12.9396 12.9364 13.6276 12.0911 13.6276ZM5.95672 8.52344C5.95672 8.81109 5.72364 9.04427 5.43612 9.04427H4.41227C4.12475 9.04427 3.89167 8.81109 3.89167 8.52344C3.89167 8.23578 4.12475 8.0026 4.41227 8.0026H5.43612C5.72362 8.0026 5.95672 8.23578 5.95672 8.52344ZM12.1057 8.52344C12.1057 8.81109 11.8727 9.04427 11.5851 9.04427H10.5613C10.2738 9.04427 10.0407 8.81109 10.0407 8.52344C10.0407 8.23578 10.2738 8.0026 10.5613 8.0026H11.5851C11.8726 8.0026 12.1057 8.23578 12.1057 8.52344ZM9.02826 8.52344C9.02826 8.81109 8.79519 9.04427 8.50766 9.04427H7.48382C7.19629 9.04427 6.96322 8.81109 6.96322 8.52344C6.96322 8.23578 7.19629 8.0026 7.48382 8.0026H8.50766C8.79517 8.0026 9.02826 8.23578 9.02826 8.52344ZM5.95672 11.5964C5.95672 11.884 5.72364 12.1172 5.43612 12.1172H4.41227C4.12475 12.1172 3.89167 11.884 3.89167 11.5964C3.89167 11.3087 4.12475 11.0755 4.41227 11.0755H5.43612C5.72362 11.0755 5.95672 11.3087 5.95672 11.5964ZM12.1057 11.5964C12.1057 11.884 11.8727 12.1172 11.5851 12.1172H10.5613C10.2738 12.1172 10.0407 11.884 10.0407 11.5964C10.0407 11.3087 10.2738 11.0755 10.5613 11.0755H11.5851C11.8726 11.0755 12.1057 11.3087 12.1057 11.5964ZM9.02826 11.5964C9.02826 11.884 8.79519 12.1172 8.50766 12.1172H7.48382C7.19629 12.1172 6.96322 11.884 6.96322 11.5964C6.96322 11.3087 7.19629 11.0755 7.48382 11.0755H8.50766C8.79517 11.0755 9.02826 11.3087 9.02826 11.5964Z" fill="#5E5E5E" />
                </svg>
                {" "}
                <svg className="navigate-close" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={(e) => dom.clearValue(e.currentTarget)}>
                  <path d="M12.4495 3.55038C12.3104 3.41135 12.1218 3.33325 11.9252 3.33325C11.7285 3.33325 11.5399 3.41135 11.4009 3.55038L7.99992 6.95131L4.59899 3.55038C4.45992 3.41135 4.27133 3.33325 4.07468 3.33325C3.87804 3.33325 3.68945 3.41135 3.55038 3.55038C3.41135 3.68945 3.33325 3.87804 3.33325 4.07468C3.33325 4.27133 3.41135 4.45992 3.55038 4.59899L6.95131 7.99992L3.55038 11.4009C3.41135 11.5399 3.33325 11.7285 3.33325 11.9252C3.33325 12.1218 3.41135 12.3104 3.55038 12.4495C3.68945 12.5885 3.87804 12.6666 4.07468 12.6666C4.27133 12.6666 4.45992 12.5885 4.59899 12.4495L7.99992 9.04853L11.4009 12.4495C11.5399 12.5885 11.7285 12.6666 11.9252 12.6666C12.1218 12.6666 12.3104 12.5885 12.4495 12.4495C12.5885 12.3104 12.6666 12.1218 12.6666 11.9252C12.6666 11.7285 12.5885 11.5399 12.4495 11.4009L9.04853 7.99992L12.4495 4.59899C12.5885 4.45992 12.6666 4.27133 12.6666 4.07468C12.6666 3.87804 12.5885 3.68945 12.4495 3.55038Z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <label className="form-label" data-i18n="minigameSetting.startTime">{t("minigameSetting.startTime", "เวลาเริ่มต้น")}</label>
            </div>
            <div className="custom-input mb-3">
              <input type="text" className="form-control custom-date-flatpickr flatpickr-input" data-i18n="[placeholder]minigameSetting.phStartTime" placeholder={t("minigameSetting.phStartTime", "เลือกเวลาเริ่มต้น")} id="startTimeSettingMinigameInput" data-provider="timepickr" data-date-format="H:i" data-no-calendar="true" data-enable-time="true" data-time_24hr="true" defaultValue="" readOnly disabled />
              <div className="float-prepend">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.51886 4.92969V8.0026C8.51886 8.14076 8.46399 8.27323 8.36632 8.37089L6.31789 10.4195C6.1145 10.6229 5.78476 10.6229 5.5814 10.4195C5.37801 10.2161 5.37801 9.88633 5.5814 9.68297L7.47729 7.78685V4.92969C7.47729 4.64203 7.71044 4.40885 7.99807 4.40885C8.2857 4.40885 8.51886 4.64203 8.51886 4.92969ZM14.1293 11.5266L13.6147 11.8237C13.6493 12.0145 13.6473 12.1962 13.6147 12.376L14.1293 12.6731C14.3784 12.8169 14.4637 13.1355 14.3199 13.3846C14.1756 13.6345 13.8567 13.7185 13.6085 13.5752L13.0932 13.2777C12.9532 13.3966 12.7919 13.4911 12.6157 13.5544V14.1484C12.6157 14.4361 12.3825 14.6693 12.0949 14.6693C11.8073 14.6693 11.5741 14.4361 11.5741 14.1484V13.5544C11.3979 13.4911 11.2366 13.3966 11.0965 13.2777L10.5813 13.5752C10.3334 13.7184 10.0144 13.6348 9.8699 13.3846C9.72609 13.1355 9.81142 12.8169 10.0605 12.6731L10.5751 12.376C10.5405 12.1851 10.5425 12.0035 10.5751 11.8237L10.0605 11.5266C9.81142 11.3828 9.72609 11.0642 9.8699 10.8151C10.0137 10.566 10.3322 10.4806 10.5813 10.6245L11.0965 10.922C11.2366 10.8031 11.3979 10.7085 11.5741 10.6453V10.0512C11.5741 9.76357 11.8072 9.53039 12.0949 9.53039C12.3825 9.53039 12.6157 9.76357 12.6157 10.0512V10.6453C12.7918 10.7085 12.9532 10.8031 13.0932 10.922L13.6085 10.6245C13.8575 10.4807 14.176 10.566 14.3198 10.8151C14.4637 11.0642 14.3784 11.3827 14.1293 11.5266ZM12.0949 12.6033C12.3725 12.6033 12.5983 12.3774 12.5983 12.0998C12.5983 11.8222 12.3725 11.5964 12.0949 11.5964C11.8173 11.5964 11.5915 11.8222 11.5915 12.0998C11.5915 12.3774 11.8173 12.6033 12.0949 12.6033ZM7.99807 1.33594C4.31397 1.33594 1.33203 4.3176 1.33203 8.0026C1.33203 11.6871 4.31344 14.6693 7.99807 14.6693C8.2857 14.6693 8.51886 14.4361 8.51886 14.1484C8.51886 13.8608 8.2857 13.6276 7.99807 13.6276C4.88961 13.6276 2.3736 11.1118 2.3736 8.0026C2.3736 4.89383 4.88912 2.3776 7.99807 2.3776C11.4671 2.3776 14.1232 5.48984 13.5443 8.9407C13.4967 9.2244 13.6881 9.49294 13.9717 9.54055C14.2555 9.58797 14.5239 9.39677 14.5715 9.11307C15.2534 5.04844 12.1334 1.33594 7.99807 1.33594Z" fill="#5E5E5E" />
                </svg>
                {" "}
                <svg className="navigate-close" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={(e) => dom.clearValue(e.currentTarget)}>
                  <path d="M12.4495 3.55038C12.3104 3.41135 12.1218 3.33325 11.9252 3.33325C11.7285 3.33325 11.5399 3.41135 11.4009 3.55038L7.99992 6.95131L4.59899 3.55038C4.45992 3.41135 4.27133 3.33325 4.07468 3.33325C3.87804 3.33325 3.68945 3.41135 3.55038 3.55038C3.41135 3.68945 3.33325 3.87804 3.33325 4.07468C3.33325 4.27133 3.41135 4.45992 3.55038 4.59899L6.95131 7.99992L3.55038 11.4009C3.41135 11.5399 3.33325 11.7285 3.33325 11.9252C3.33325 12.1218 3.41135 12.3104 3.55038 12.4495C3.68945 12.5885 3.87804 12.6666 4.07468 12.6666C4.27133 12.6666 4.45992 12.5885 4.59899 12.4495L7.99992 9.04853L11.4009 12.4495C11.5399 12.5885 11.7285 12.6666 11.9252 12.6666C12.1218 12.6666 12.3104 12.5885 12.4495 12.4495C12.5885 12.3104 12.6666 12.1218 12.6666 11.9252C12.6666 11.7285 12.5885 11.5399 12.4495 11.4009L9.04853 7.99992L12.4495 4.59899C12.5885 4.45992 12.6666 4.27133 12.6666 4.07468C12.6666 3.87804 12.5885 3.68945 12.4495 3.55038Z" />
                </svg>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <label className="form-label" data-i18n="minigameSetting.endTime">{t("minigameSetting.endTime", "เวลาสิ้นสุด")}</label>
            </div>
            <div className="custom-input mb-3">
              <input type="text" className="form-control custom-date-flatpickr flatpickr-input" data-i18n="[placeholder]minigameSetting.phEndTime" placeholder={t("minigameSetting.phEndTime", "เลือกเวลาสิ้นสุด")} id="endTimeSettingMinigameInput" data-provider="timepickr" data-date-format="H:i" data-no-calendar="true" data-enable-time="true" data-time_24hr="true" defaultValue="" readOnly disabled />
              <div className="float-prepend">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.51886 4.92969V8.0026C8.51886 8.14076 8.46399 8.27323 8.36632 8.37089L6.31789 10.4195C6.1145 10.6229 5.78476 10.6229 5.5814 10.4195C5.37801 10.2161 5.37801 9.88633 5.5814 9.68297L7.47729 7.78685V4.92969C7.47729 4.64203 7.71044 4.40885 7.99807 4.40885C8.2857 4.40885 8.51886 4.64203 8.51886 4.92969ZM14.1293 11.5266L13.6147 11.8237C13.6493 12.0145 13.6473 12.1962 13.6147 12.376L14.1293 12.6731C14.3784 12.8169 14.4637 13.1355 14.3199 13.3846C14.1756 13.6345 13.8567 13.7185 13.6085 13.5752L13.0932 13.2777C12.9532 13.3966 12.7919 13.4911 12.6157 13.5544V14.1484C12.6157 14.4361 12.3825 14.6693 12.0949 14.6693C11.8073 14.6693 11.5741 14.4361 11.5741 14.1484V13.5544C11.3979 13.4911 11.2366 13.3966 11.0965 13.2777L10.5813 13.5752C10.3334 13.7184 10.0144 13.6348 9.8699 13.3846C9.72609 13.1355 9.81142 12.8169 10.0605 12.6731L10.5751 12.376C10.5405 12.1851 10.5425 12.0035 10.5751 11.8237L10.0605 11.5266C9.81142 11.3828 9.72609 11.0642 9.8699 10.8151C10.0137 10.566 10.3322 10.4806 10.5813 10.6245L11.0965 10.922C11.2366 10.8031 11.3979 10.7085 11.5741 10.6453V10.0512C11.5741 9.76357 11.8072 9.53039 12.0949 9.53039C12.3825 9.53039 12.6157 9.76357 12.6157 10.0512V10.6453C12.7918 10.7085 12.9532 10.8031 13.0932 10.922L13.6085 10.6245C13.8575 10.4807 14.176 10.566 14.3198 10.8151C14.4637 11.0642 14.3784 11.3827 14.1293 11.5266ZM12.0949 12.6033C12.3725 12.6033 12.5983 12.3774 12.5983 12.0998C12.5983 11.8222 12.3725 11.5964 12.0949 11.5964C11.8173 11.5964 11.5915 11.8222 11.5915 12.0998C11.5915 12.3774 11.8173 12.6033 12.0949 12.6033ZM7.99807 1.33594C4.31397 1.33594 1.33203 4.3176 1.33203 8.0026C1.33203 11.6871 4.31344 14.6693 7.99807 14.6693C8.2857 14.6693 8.51886 14.4361 8.51886 14.1484C8.51886 13.8608 8.2857 13.6276 7.99807 13.6276C4.88961 13.6276 2.3736 11.1118 2.3736 8.0026C2.3736 4.89383 4.88912 2.3776 7.99807 2.3776C11.4671 2.3776 14.1232 5.48984 13.5443 8.9407C13.4967 9.2244 13.6881 9.49294 13.9717 9.54055C14.2555 9.58797 14.5239 9.39677 14.5715 9.11307C15.2534 5.04844 12.1334 1.33594 7.99807 1.33594Z" fill="#5E5E5E" />
                </svg>
                {" "}
                <svg className="navigate-close" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={(e) => dom.clearValue(e.currentTarget)}>
                  <path d="M12.4495 3.55038C12.3104 3.41135 12.1218 3.33325 11.9252 3.33325C11.7285 3.33325 11.5399 3.41135 11.4009 3.55038L7.99992 6.95131L4.59899 3.55038C4.45992 3.41135 4.27133 3.33325 4.07468 3.33325C3.87804 3.33325 3.68945 3.41135 3.55038 3.55038C3.41135 3.68945 3.33325 3.87804 3.33325 4.07468C3.33325 4.27133 3.41135 4.45992 3.55038 4.59899L6.95131 7.99992L3.55038 11.4009C3.41135 11.5399 3.33325 11.7285 3.33325 11.9252C3.33325 12.1218 3.41135 12.3104 3.55038 12.4495C3.68945 12.5885 3.87804 12.6666 4.07468 12.6666C4.27133 12.6666 4.45992 12.5885 4.59899 12.4495L7.99992 9.04853L11.4009 12.4495C11.5399 12.5885 11.7285 12.6666 11.9252 12.6666C12.1218 12.6666 12.3104 12.5885 12.4495 12.4495C12.5885 12.3104 12.6666 12.1218 12.6666 11.9252C12.6666 11.7285 12.5885 11.5399 12.4495 11.4009L9.04853 7.99992L12.4495 4.59899C12.5885 4.45992 12.6666 4.27133 12.6666 4.07468C12.6666 3.87804 12.5885 3.68945 12.4495 3.55038Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="label-minigame">
          <span id="textTabsStep2-1-4">
    <TypeText type={type} k="tabs2-1-4" />
          </span>
        </div>
        <div className="input-col-1">
          <div className="box-everyday-minigame-working">
            <div className="header">
              <span className="fw-700" data-i18n="minigameSetting.activeDays">{t("minigameSetting.activeDays", "วันทำงานที่")}</span>
              <span id="promotionStartEndDateTextHeader" data-i18n="minigameSetting.activeDaysSubText">{t("minigameSetting.activeDaysSubText", "ทุกวัน จันทร์ - อาทิตย์, เวลา 00:00 - 23:59")}</span>
            </div>
            <div className="content">
              <div className="date">
                <label className="form-label mb-0 text-start" data-i18n="minigameSetting.datetimeActiveDay">{t("minigameSetting.datetimeActiveDay", "กำหนดวันทำงาน")}</label>
                <WorkDays />
              </div>
              <div className="time">
                <div id="time-set-add" className="time-set-new">
    {times.map((slot, i) => {
    const n = i + 1;
    return (
                  <div key={slot.key} className="time-set-new" data-time-minigame={n}>
                    <div className="time-set-add" id="minigameDatetimeMain-template">
                      <label className="form-label mb-0 text-start fw-700" id={`minigameDatetimeText-${n}`} data-i18n="minigameSetting.dateTimeOne">{n === 1 ? t("minigameSetting.dateTimeOne", "เวลาที่ 1") : `เวลาที่ ${n}`}</label>
                      <div className="input-time-from-to">
                        <div className="custom-input">
                          <input type="text" className="form-control custom-date-flatpickr flatpickr-input" id={`minigameCustomStartTime-${n}`} data-provider="timepickr" data-date-format="H:i" data-no-calendar="true" data-enable-time="true" data-time_24hr="true" defaultValue={slot.start} readOnly placeholder="" />
                          <div className="float-prepend">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.51886 4.92969V8.0026C8.51886 8.14076 8.46399 8.27323 8.36632 8.37089L6.31789 10.4195C6.1145 10.6229 5.78476 10.6229 5.5814 10.4195C5.37801 10.2161 5.37801 9.88633 5.5814 9.68297L7.47729 7.78685V4.92969C7.47729 4.64203 7.71044 4.40885 7.99807 4.40885C8.2857 4.40885 8.51886 4.64203 8.51886 4.92969ZM14.1293 11.5266L13.6147 11.8237C13.6493 12.0145 13.6473 12.1962 13.6147 12.376L14.1293 12.6731C14.3784 12.8169 14.4637 13.1355 14.3199 13.3846C14.1756 13.6345 13.8567 13.7185 13.6085 13.5752L13.0932 13.2777C12.9532 13.3966 12.7919 13.4911 12.6157 13.5544V14.1484C12.6157 14.4361 12.3825 14.6693 12.0949 14.6693C11.8073 14.6693 11.5741 14.4361 11.5741 14.1484V13.5544C11.3979 13.4911 11.2366 13.3966 11.0965 13.2777L10.5813 13.5752C10.3334 13.7184 10.0144 13.6348 9.8699 13.3846C9.72609 13.1355 9.81142 12.8169 10.0605 12.6731L10.5751 12.376C10.5405 12.1851 10.5425 12.0035 10.5751 11.8237L10.0605 11.5266C9.81142 11.3828 9.72609 11.0642 9.8699 10.8151C10.0137 10.566 10.3322 10.4806 10.5813 10.6245L11.0965 10.922C11.2366 10.8031 11.3979 10.7085 11.5741 10.6453V10.0512C11.5741 9.76357 11.8072 9.53039 12.0949 9.53039C12.3825 9.53039 12.6157 9.76357 12.6157 10.0512V10.6453C12.7918 10.7085 12.9532 10.8031 13.0932 10.922L13.6085 10.6245C13.8575 10.4807 14.176 10.566 14.3198 10.8151C14.4637 11.0642 14.3784 11.3827 14.1293 11.5266ZM12.0949 12.6033C12.3725 12.6033 12.5983 12.3774 12.5983 12.0998C12.5983 11.8222 12.3725 11.5964 12.0949 11.5964C11.8173 11.5964 11.5915 11.8222 11.5915 12.0998C11.5915 12.3774 11.8173 12.6033 12.0949 12.6033ZM7.99807 1.33594C4.31397 1.33594 1.33203 4.3176 1.33203 8.0026C1.33203 11.6871 4.31344 14.6693 7.99807 14.6693C8.2857 14.6693 8.51886 14.4361 8.51886 14.1484C8.51886 13.8608 8.2857 13.6276 7.99807 13.6276C4.88961 13.6276 2.3736 11.1118 2.3736 8.0026C2.3736 4.89383 4.88912 2.3776 7.99807 2.3776C11.4671 2.3776 14.1232 5.48984 13.5443 8.9407C13.4967 9.2244 13.6881 9.49294 13.9717 9.54055C14.2555 9.58797 14.5239 9.39677 14.5715 9.11307C15.2534 5.04844 12.1334 1.33594 7.99807 1.33594Z" fill="#5E5E5E" />
                            </svg>
                            {" "}
                            <svg className="navigate-close" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={(e) => dom.clearValue(e.currentTarget)}>
                              <path d="M12.4495 3.55038C12.3104 3.41135 12.1218 3.33325 11.9252 3.33325C11.7285 3.33325 11.5399 3.41135 11.4009 3.55038L7.99992 6.95131L4.59899 3.55038C4.45992 3.41135 4.27133 3.33325 4.07468 3.33325C3.87804 3.33325 3.68945 3.41135 3.55038 3.55038C3.41135 3.68945 3.33325 3.87804 3.33325 4.07468C3.33325 4.27133 3.41135 4.45992 3.55038 4.59899L6.95131 7.99992L3.55038 11.4009C3.41135 11.5399 3.33325 11.7285 3.33325 11.9252C3.33325 12.1218 3.41135 12.3104 3.55038 12.4495C3.68945 12.5885 3.87804 12.6666 4.07468 12.6666C4.27133 12.6666 4.45992 12.5885 4.59899 12.4495L7.99992 9.04853L11.4009 12.4495C11.5399 12.5885 11.7285 12.6666 11.9252 12.6666C12.1218 12.6666 12.3104 12.5885 12.4495 12.4495C12.5885 12.3104 12.6666 12.1218 12.6666 11.9252C12.6666 11.7285 12.5885 11.5399 12.4495 11.4009L9.04853 7.99992L12.4495 4.59899C12.5885 4.45992 12.6666 4.27133 12.6666 4.07468C12.6666 3.87804 12.5885 3.68945 12.4495 3.55038Z" />
                            </svg>
                          </div>
                        </div>
                        <span>-</span>
                        <div className="custom-input">
                          <input type="text" className="form-control custom-date-flatpickr flatpickr-input" id={`minigameCustomEndTime-${n}`} data-provider="timepickr" data-date-format="H:i" data-no-calendar="true" data-enable-time="true" data-time_24hr="true" defaultValue={slot.end} readOnly placeholder="" />
                          <div className="float-prepend">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.51886 4.92969V8.0026C8.51886 8.14076 8.46399 8.27323 8.36632 8.37089L6.31789 10.4195C6.1145 10.6229 5.78476 10.6229 5.5814 10.4195C5.37801 10.2161 5.37801 9.88633 5.5814 9.68297L7.47729 7.78685V4.92969C7.47729 4.64203 7.71044 4.40885 7.99807 4.40885C8.2857 4.40885 8.51886 4.64203 8.51886 4.92969ZM14.1293 11.5266L13.6147 11.8237C13.6493 12.0145 13.6473 12.1962 13.6147 12.376L14.1293 12.6731C14.3784 12.8169 14.4637 13.1355 14.3199 13.3846C14.1756 13.6345 13.8567 13.7185 13.6085 13.5752L13.0932 13.2777C12.9532 13.3966 12.7919 13.4911 12.6157 13.5544V14.1484C12.6157 14.4361 12.3825 14.6693 12.0949 14.6693C11.8073 14.6693 11.5741 14.4361 11.5741 14.1484V13.5544C11.3979 13.4911 11.2366 13.3966 11.0965 13.2777L10.5813 13.5752C10.3334 13.7184 10.0144 13.6348 9.8699 13.3846C9.72609 13.1355 9.81142 12.8169 10.0605 12.6731L10.5751 12.376C10.5405 12.1851 10.5425 12.0035 10.5751 11.8237L10.0605 11.5266C9.81142 11.3828 9.72609 11.0642 9.8699 10.8151C10.0137 10.566 10.3322 10.4806 10.5813 10.6245L11.0965 10.922C11.2366 10.8031 11.3979 10.7085 11.5741 10.6453V10.0512C11.5741 9.76357 11.8072 9.53039 12.0949 9.53039C12.3825 9.53039 12.6157 9.76357 12.6157 10.0512V10.6453C12.7918 10.7085 12.9532 10.8031 13.0932 10.922L13.6085 10.6245C13.8575 10.4807 14.176 10.566 14.3198 10.8151C14.4637 11.0642 14.3784 11.3827 14.1293 11.5266ZM12.0949 12.6033C12.3725 12.6033 12.5983 12.3774 12.5983 12.0998C12.5983 11.8222 12.3725 11.5964 12.0949 11.5964C11.8173 11.5964 11.5915 11.8222 11.5915 12.0998C11.5915 12.3774 11.8173 12.6033 12.0949 12.6033ZM7.99807 1.33594C4.31397 1.33594 1.33203 4.3176 1.33203 8.0026C1.33203 11.6871 4.31344 14.6693 7.99807 14.6693C8.2857 14.6693 8.51886 14.4361 8.51886 14.1484C8.51886 13.8608 8.2857 13.6276 7.99807 13.6276C4.88961 13.6276 2.3736 11.1118 2.3736 8.0026C2.3736 4.89383 4.88912 2.3776 7.99807 2.3776C11.4671 2.3776 14.1232 5.48984 13.5443 8.9407C13.4967 9.2244 13.6881 9.49294 13.9717 9.54055C14.2555 9.58797 14.5239 9.39677 14.5715 9.11307C15.2534 5.04844 12.1334 1.33594 7.99807 1.33594Z" fill="#5E5E5E" />
                            </svg>
                            {" "}
                            <svg className="navigate-close" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={(e) => dom.clearValue(e.currentTarget)}>
                              <path d="M12.4495 3.55038C12.3104 3.41135 12.1218 3.33325 11.9252 3.33325C11.7285 3.33325 11.5399 3.41135 11.4009 3.55038L7.99992 6.95131L4.59899 3.55038C4.45992 3.41135 4.27133 3.33325 4.07468 3.33325C3.87804 3.33325 3.68945 3.41135 3.55038 3.55038C3.41135 3.68945 3.33325 3.87804 3.33325 4.07468C3.33325 4.27133 3.41135 4.45992 3.55038 4.59899L6.95131 7.99992L3.55038 11.4009C3.41135 11.5399 3.33325 11.7285 3.33325 11.9252C3.33325 12.1218 3.41135 12.3104 3.55038 12.4495C3.68945 12.5885 3.87804 12.6666 4.07468 12.6666C4.27133 12.6666 4.45992 12.5885 4.59899 12.4495L7.99992 9.04853L11.4009 12.4495C11.5399 12.5885 11.7285 12.6666 11.9252 12.6666C12.1218 12.6666 12.3104 12.5885 12.4495 12.4495C12.5885 12.3104 12.6666 12.1218 12.6666 11.9252C12.6666 11.7285 12.5885 11.5399 12.4495 11.4009L9.04853 7.99992L12.4495 4.59899C12.5885 4.45992 12.6666 4.27133 12.6666 4.07468C12.6666 3.87804 12.5885 3.68945 12.4495 3.55038Z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div id={`minigameDeleteMinigameDatetime-${n}`} className="checkShowDeleteMinigameDatetime" style={shownWhen(times.length > 1)} onClick={() => actions.deleteTemplateMinigameDatetime(n)}>
                        <img src="/assets/images/minigame/delete.svg" width="24" height="24" />
                      </div>
                    </div>
                    <div className="btn-allday">
                      <button className={isAllDay(slot) ? "btn system-btn btn-rounded w-100" : "btn system-btn btn-rounded w-100 no-select"} data-i18n="minigameSetting.allDay" id={`boxMinigameSelectAllDay-${n}`} onClick={() => actions.changeMinigameSelectTimeAllDay(n)}>{t("minigameSetting.allDay", "")}</button>
                    </div>
                  </div>
    );
    })}
                </div>
                <div className={isAllDay(times[times.length - 1]) ? "add-set cursor-pointer disabled" : "add-set cursor-pointer"} id="checkAddTemplateMinigameDatetime" onClick={() => actions.addTemplateMinigameDatetime()}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17316C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8078C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C21.9971 9.34871 20.9426 6.80684 19.0679 4.9321C17.1932 3.05736 14.6513 2.00287 12 2ZM12 20.3333C10.3518 20.3333 8.74066 19.8446 7.37025 18.9289C5.99984 18.0132 4.93174 16.7117 4.30101 15.189C3.67028 13.6663 3.50525 11.9908 3.82679 10.3742C4.14834 8.75774 4.94201 7.27288 6.10745 6.10744C7.27288 4.94201 8.75774 4.14833 10.3743 3.82679C11.9908 3.50525 13.6663 3.67027 15.189 4.301C16.7117 4.93173 18.0132 5.99984 18.9289 7.37025C19.8446 8.74066 20.3333 10.3518 20.3333 12C20.3309 14.2094 19.4522 16.3276 17.8899 17.8899C16.3276 19.4522 14.2094 20.3309 12 20.3333ZM16.1667 12C16.1667 12.221 16.0789 12.433 15.9226 12.5893C15.7663 12.7455 15.5543 12.8333 15.3333 12.8333H12.8333V15.3333C12.8333 15.5543 12.7455 15.7663 12.5893 15.9226C12.433 16.0789 12.221 16.1667 12 16.1667C11.779 16.1667 11.567 16.0789 11.4107 15.9226C11.2545 15.7663 11.1667 15.5543 11.1667 15.3333V12.8333H8.66667C8.44566 12.8333 8.23369 12.7455 8.07741 12.5893C7.92113 12.433 7.83334 12.221 7.83334 12C7.83334 11.779 7.92113 11.567 8.07741 11.4107C8.23369 11.2545 8.44566 11.1667 8.66667 11.1667H11.1667V8.66667C11.1667 8.44565 11.2545 8.23369 11.4107 8.07741C11.567 7.92113 11.779 7.83333 12 7.83333C12.221 7.83333 12.433 7.92113 12.5893 8.07741C12.7455 8.23369 12.8333 8.44565 12.8333 8.66667V11.1667H15.3333C15.5543 11.1667 15.7663 11.2545 15.9226 11.4107C16.0789 11.567 16.1667 11.779 16.1667 12Z" fill="#50A198" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="d-none" style={{ margin: "16px 24px 0px 24px" }}>
            <div className="form-check">
              <input className="form-check-input me-2" type="checkbox" id="enableHiddenTime" value="false" onClick={() => dom.changeEnableHiddenTime()} />
              {" "}
              <label className="form-check-label d-flex flex-column" htmlFor="enableHiddenTime">
                <span className="p2" data-i18n="minigameSetting.minigameDateSubText" style={{ color: "rgb(233, 233, 233)" }}>{t("minigameSetting.minigameDateSubText", "ไม่ต้องแสดงผลระยะเวลาโปรโมชั่น และวันทำงาน ที่หน้าเล่น")}</span>
              </label>
            </div>
          </div>
        </div>
        <div className="group-btn-minigame-setting">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <button data-i18n="minigameSetting.summarizeAndSave" id="buttonNextPromotionStepfinal21" className="btn btn-outline-warning" data-type="next" style={nav.summaryButtonStyle} onClick={() => nav.toSummary("2-1")}>{t("minigameSetting.summarizeAndSave", "ไปหน้าสรุป")}</button>
            </div>
            <div>
              <button data-i18n="minigameSetting.back" className="btn system-btn btn-outline btn-rounded" data-type="previous" style={{ width: "168px" }} onClick={() => nav.go("2-1", "1")}>{t("minigameSetting.back", "ขั้นตอนก่อนหน้า")}</button>
              {" "}
              <button data-i18n="minigameSetting.next" className="btn system-btn btn-rounded ms-2" data-type="next" style={{ width: "168px" }} onClick={() => nav.go("2-1", "2-2")}>{t("minigameSetting.next", "ถัดไป")}</button>
            </div>
          </div>
        </div>
      </div>
      {/* TEMPLATE #templateMinigameDatetime omitted */}
      <div className="main-in-detail-body content-col-1" id="SettingMinigameStep2-2" style={shownWhen(step === "2-2")}>
        <div className="label-minigame">
          <span id="textTabsStep2-2-1">
    <TypeText type={type} k="tabs2-2-1" />
          </span>
          <div className="switch">
            <div className="custom-switch switch-alone form-check form-switch">
              <input className="form-check-input" type="checkbox" id="changeMinigameEnableCountDown" onInput={(e) => dom.changeStatusSwitch(e.currentTarget, "2-2-1")} />
            </div>
            <span className="color-emerald-title-1" data-i18n="minigameSetting.onAndOffSetting">{t("minigameSetting.onAndOffSetting", "เปิด / ปิด การใช้งาน")}</span>
          </div>
        </div>
        <div className="input-col-2 switch-2-2-1">
          <div className="col-12">
            <div className="form-check minigame-reset disabled fistempty">
              <input className="form-check-input me-2" type="radio" name="minigameCountdownRadio" id="minigameEnableCountDownCreated" data-value-id="1" data-value-id1="boxMinigameCountdownRadioDays" data-value-id2="boxMinigameCountdownRadioDaterange" defaultChecked onClick={(e) => dom.changeMinigameCountdownRadio(e.currentTarget)} />
              {" "}
              <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableCountDownCreated">
                <div className="p2" id="textTabsStep2-2-2" style={{ color: "rgb(233, 233, 233)" }}>
    <TypeText type={type} k="tabs2-2-2" />
                </div>
                <span className="p3" id="textTabsStep2-2-3" style={{ color: "rgb(130, 130, 130)" }}>
    <TypeText type={type} k="tabs2-2-3" />
                </span>
              </label>
            </div>
          </div>
          <CountdownChoices type={type} />
        </div>
        <div className="label-minigame d-none">
          <span data-i18n="minigameSetting.settingCountdownHeader">{t("minigameSetting.settingCountdownHeader", "ปรับแต่งการแสดงผลเวลานับถอยหลัง")}</span>
        </div>
        <div className="input-col-2-60-100 d-none">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <label className="form-label" data-i18n="minigameSetting.chooseColor">{t("minigameSetting.chooseColor", "เลือกสีที่ต้องการ")}</label>
            </div>
            <div className="row pe-0">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="col-6 mb-3">
                          <div className="d-flex flex-column justify-content-between align-items-center gap-1" onClick={(e) => dom.cilckStylecountdown(e.currentTarget)}>
                            <div className={`countdown-minigame style-${n}`}>
                              <div className="time">
                                <div className="card-unit days">
                                  <div>
                                    <span>0</span>
                                  </div>
                                  <div>
                                    <span>0</span>
                                  </div>
                                </div>
                                {" : "}
                                <div className="card-unit hours">
                                  <div>
                                    <span>0</span>
                                  </div>
                                  <div>
                                    <span>0</span>
                                  </div>
                                </div>
                                {" : "}
                                <div className="card-unit minutes">
                                  <div>
                                    <span>0</span>
                                  </div>
                                  <div>
                                    <span>0</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text">
                                <span>Days</span>
              <span />
              <span>Hours</span>
              <span />
              <span>Minutes</span>
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-3 my-2">
                              <div className="form-check box-color-promotion-a">
                                <input className="form-check-input" type="radio" name="minigameCountDownColorCodeRadio" id={`minigameCountDownColorCode-${n}`} value={n} defaultChecked={n === 1} />
                              </div>
                              <div className="position-relative box-minigame-ex-color">
                                <div className={`box-color-minigame-b style-${n}-1`} />
                                <div className={`box-color-minigame-b style-${n}-2`} />
                              </div>
                            </div>
                          </div>
                        </div>
              ))}
            </div>
          </div>
          <div className="col-12">
            <div className="p2 fw-700 text-center mb-1" data-i18n="minigameSetting.previewColor" style={{ color: "rgb(173, 173, 173)" }}>{t("minigameSetting.previewColor", "ตัวอย่างการแสดงผลตามสีที่คุณเลือก")}</div>
            <div style={{ height: "530px", overflowX: "hidden", overflowY: "hidden", width: "260px" }} />
          </div>
        </div>
      </div>
      <div className="group-btn-minigame-setting ms-0 me-0" id="groupBtnSettingMinigame2-2" style={shownWhen(step === "2-2")}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <button data-i18n="minigameSetting.summarizeAndSave" id="buttonNextPromotionStepfinal22" className="btn btn-outline-warning" data-type="next" style={nav.summaryButtonStyle} onClick={() => nav.toSummary("2-2")}>{t("minigameSetting.summarizeAndSave", "ไปหน้าสรุป")}</button>
          </div>
          <div>
            <button data-i18n="minigameSetting.back" className="btn system-btn btn-outline btn-rounded" data-type="previous" style={{ width: "168px" }} onClick={() => nav.go("2-2", "2-1")}>{t("minigameSetting.back", "ขั้นตอนก่อนหน้า")}</button>
            {" "}
            <button data-i18n="minigameSetting.next" className="btn system-btn btn-rounded ms-2" data-type="next" style={{ width: "168px" }} onClick={() => nav.go("2-2", "2-3")}>{t("minigameSetting.next", "ถัดไป")}</button>
          </div>
        </div>
      </div>
      <div className="main-in-detail-body content-col-1" id="SettingMinigameStep2-3" style={shownWhen(step === "2-3")}>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.minigameLimitMember">{t("minigameSetting.minigameLimitMember", "จำกัดการรับสิทธิ์ของสมาชิกทั้งระบบ ต่อมินิเกมส์")}</span>
          <div className="switch">
            <div className="custom-switch switch-alone form-check form-switch">
              <input className="form-check-input" type="checkbox" id="minigameEnableMaxPromotion" onClick={(e) => dom.changeStatusSwitch(e.currentTarget, "2-3-1")} />
            </div>
            <span className="color-emerald-title-1" data-i18n="minigameSetting.onAndOffSetting">{t("minigameSetting.onAndOffSetting", "เปิด / ปิด การใช้งาน")}</span>
          </div>
        </div>
        <div className="input-col-1-p switch-2-3-1">
          <div>
            <div className="row box-promotion-item-checkbox-radio" id="boxGetPromotionPerPromotionDay">
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableMaxCountPerDay" data-value="inputMinigameMaxCountPerDay" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableMaxCountPerDay">
                    <div className="p2 color-emerald-title-1">
                      <span data-i18n="minigameSetting.limitMinigame">{t("minigameSetting.limitMinigame", "จำกัดการรับสิทธิ์เล่นมินิเกมส์")}</span>
                      <span className="highlight" data-i18n="minigameSetting.perDay">{t("minigameSetting.perDay", "“ต่อวัน”")}</span>
                    </div>
                    <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.limitMinigameSubText">{t("minigameSetting.limitMinigameSubText", "ระบบจะ “ไม่ให้สิทธิ์อีกในวันนี้” ถ้าหากยอดรวมการรับสิทธิ์ของสมาชิกทั้งระบบนั้นเท่ากับ x ครั้ง")}</span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameMaxCountPerDay">
                  <div className="input-group">
                    <input id="minigameMaxCountPerDay" type="text" className="form-control" placeholder="0" data-group="MaxPromotion" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} onInput={(e) => dom.setMaxValueInput(e.currentTarget)} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.rightsPerDay" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.rightsPerDay", "สิทธิ์ / วัน")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-getPromotionPerPromotionDay" data-i18n="minigameSetting.limitMinigameErrorText" style={{ display: "none" }}>{t("minigameSetting.limitMinigameErrorText", "กรุณากรอกจำกัดการรับสิทธิ์เล่นมินิเกมส์ “ต่อวัน”")}</div>
                </div>
              </div>
            </div>
            <div className="row box-promotion-item-checkbox-radio" id="boxGetPromotionPerPromotionWeek">
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableMaxCountPerWeek" data-value="inputMinigameMaxCountPerWeek" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableMaxCountPerWeek">
                    <div className="p2 color-emerald-title-1">
                      <span data-i18n="minigameSetting.limitMinigame">{t("minigameSetting.limitMinigame", "จำกัดการรับสิทธิ์เล่นมินิเกมส์")}</span>
                      <span className="highlight" data-i18n="minigameSetting.perWeek">{t("minigameSetting.perWeek", "“ต่อสัปดาห์”")}</span>
                    </div>
                    <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.limitMinigameSubText2">{t("minigameSetting.limitMinigameSubText2", "ระบบจะ “ไม่ให้สิทธิ์อีกในสัปดาห์นี้” ถ้าหากยอดรวมการรับสิทธิ์ ของสมาชิกทั้งระบบนั้นเท่ากับ x ครั้ง")}</span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameMaxCountPerWeek">
                  <div className="input-group">
                    <input id="minigameMaxCountPerWeek" type="text" className="form-control" placeholder="0" data-group="MaxPromotion" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} onInput={(e) => dom.setMaxValueInput(e.currentTarget)} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.rightsPerWeek" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.rightsPerWeek", "สิทธิ์ / สัปดาห์")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-getPromotionPerPromotionWeek" data-i18n="minigameSetting.limitMinigameErrorText2" style={{ display: "none" }}>{t("minigameSetting.limitMinigameErrorText2", "กรุณากรอกจำกัดการรับสิทธิ์เล่นมินิเกมส์ “ต่อสัปดาห์”")}</div>
                </div>
              </div>
            </div>
            <div className="row box-promotion-item-checkbox-radio" id="boxGetPromotionPerPromotionMonth">
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableMaxCountPerMonth" data-value="inputMinigameMaxCountPerMonth" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableMaxCountPerMonth">
                    <div className="p2 color-emerald-title-1">
                      <span data-i18n="minigameSetting.limitMinigame">{t("minigameSetting.limitMinigame", "จำกัดการรับสิทธิ์เล่นมินิเกมส์")}</span>
                      <span className="highlight" data-i18n="minigameSetting.perMonth">{t("minigameSetting.perMonth", "“ต่อเดือน”")}</span>
                    </div>
                    <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.limitMinigameSubText3">{t("minigameSetting.limitMinigameSubText3", "ระบบจะ “ไม่ให้สิทธิ์อีกในเดือนนี้” ถ้าหากยอดรวมการรับสิทธิ์ ของสมาชิกทั้งระบบนั้นเท่ากับ x ครั้ง")}</span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameMaxCountPerMonth">
                  <div className="input-group">
                    <input id="minigameMaxCountPerMonth" type="text" className="form-control" placeholder="0" data-group="MaxPromotion" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} onInput={(e) => dom.setMaxValueInput(e.currentTarget)} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.rightsPerMonth" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.rightsPerMonth", "สิทธิ์ / เดือน")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-getPromotionPerPromotionMonth" data-i18n="minigameSetting.limitMinigameErrorText3" style={{ display: "none" }}>{t("minigameSetting.limitMinigameErrorText3", "กรุณากรอกจำกัดการรับสิทธิ์เล่นมินิเกมส์ “ต่อเดือน”")}</div>
                </div>
              </div>
            </div>
            <div className="row box-promotion-item-checkbox-radio" id="boxGetPromotionPerPromotionAll">
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableMaxCountPerPromotion" data-value="inputMinigameMaxCountPerPromotion" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableMaxCountPerPromotion">
                    <div className="p2 color-emerald-title-1">
                      <span data-i18n="minigameSetting.limitMinigame">{t("minigameSetting.limitMinigame", "จำกัดการรับสิทธิ์เล่นมินิเกมส์")}</span>
                      <span className="highlight" data-i18n="minigameSetting.perPromotionDuration">{t("minigameSetting.perPromotionDuration", "“ตลอดอายุโปรโมชั่น”")}</span>
                    </div>
                    <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.limitMinigameSubText4">{t("minigameSetting.limitMinigameSubText4", "ระบบจะ “ไม่ให้สิทธิ์อีกต่อไป” ถ้าหากยอดรวมการรับสิทธิ์ ของสมาชิกทั้งระบบนั้นเท่ากับ x ครั้ง")}</span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameMaxCountPerPromotion">
                  <div className="input-group">
                    <input id="minigameMaxCountPerPromotion" type="text" className="form-control" placeholder="0" data-group="MaxPromotion" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} onInput={(e) => dom.setMaxValueInput(e.currentTarget)} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.rightsPerAll" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.rightsPerAll", "สิทธิ์ / ตลอดอายุโปร")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-getPromotionPerPromotionAll" data-i18n="minigameSetting.limitMinigameErrorText4" style={{ display: "none" }}>{t("minigameSetting.limitMinigameErrorText4", "กรุณากรอกจำกัดการรับสิทธิ์เล่นมินิเกมส์ “ตลอดอายุโปรโมชั่น”")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.limitMinigamePerMember">{t("minigameSetting.limitMinigamePerMember", "จำกัดการรับสิทธิ์ของสมาชิก รายคน")}</span>
          <div className="switch">
            <div className="custom-switch switch-alone form-check form-switch">
              <input className="form-check-input" type="checkbox" id="minigameEnableMaxPromotionPerPerson" onClick={(e) => dom.changeStatusSwitch(e.currentTarget, "2-3-2")} />
            </div>
            <span className="color-emerald-title-1" data-i18n="minigameSetting.onAndOffSetting">{t("minigameSetting.onAndOffSetting", "เปิด / ปิด การใช้งาน")}</span>
          </div>
        </div>
        <div className="input-col-1-p switch-2-3-2">
          <div>
            <div className="row box-promotion-item-checkbox-radio" id="boxGetPromotionPerUserTime">
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableMaxCountPerTimePerPerson" data-value="inputMinigameMaxCountPerTimePerPerson" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableMaxCountPerTimePerPerson">
                    <div className="p2 color-emerald-title-1">
                      <span data-i18n="minigameSetting.limitMinigame">{t("minigameSetting.limitMinigame", "จำกัดการรับสิทธิ์เล่นมินิเกมส์")}</span>
                      <span data-i18n="minigameSetting.perEach" className="highlight">{t("minigameSetting.perEach", "“ต่อครั้ง”")}</span>
                    </div>
                    <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.limitMinigamePerMemberSubText">{t("minigameSetting.limitMinigamePerMemberSubText", "ระบบจะ “ให้สิทธิ์มินิเกมส์กับสมาชิกไม่เกิน x สิทธิ์ต่อครั้ง” แม้ว่าสมาชิกทำการฝากเข้ามามากกว่าสิทธิ์ที่ได้รับ")}</span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameMaxCountPerTimePerPerson">
                  <div className="input-group">
                    <input id="minigameMaxCountPerTimePerPerson" type="text" className="form-control" placeholder="0" data-group="MinigamePerTimePerPerson" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                    {" "}
                    <span className="input-group-text custom-color" style={{ borderRadius: "0px 8px 8px 0px" }}>สิทธิ์ / ครั้ง</span>
                  </div>
                  <div className="invalid-feedback" id="error-getPromotionPerUserTime" data-i18n="minigameSetting.limitMinigamePerMemberErrorText" style={{ display: "none" }}>{t("minigameSetting.limitMinigamePerMemberErrorText", "กรุณากรอกจำกัดการรับสิทธิ์เล่นมินิเกมส์ “ต่อครั้ง” และค่าต้องมากกว่า 0")}</div>
                </div>
              </div>
            </div>
                    <div className="row box-promotion-item-checkbox-radio" id="boxGetPromotionPerUserDay">
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableMaxCountPerDayPerPerson" data-value="inputMinigameMaxCountPerDayPerPerson" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableMaxCountPerDayPerPerson">
                    <div className="p2 color-emerald-title-1">
                      <span data-i18n="minigameSetting.limitMinigame">{t("minigameSetting.limitMinigame", "จำกัดการรับสิทธิ์เล่นมินิเกมส์")}</span>
                      {" "}
                      <span className="highlight" data-i18n="minigameSetting.perDay">{t("minigameSetting.perDay", "“ต่อวัน”")}</span>
                    </div>
                    <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.limitMinigamePerMemberSubText2">{t("minigameSetting.limitMinigamePerMemberSubText2", "ระบบจะ “ไม่ให้สิทธิ์อีกในวันนี้” ถ้าหากยอดรวมการรับสิทธิ์ของ สมาชิกคนนั้นเท่ากับ x สิทธิ์ ต่อวัน")}</span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameMaxCountPerDayPerPerson">
                  <div className="input-group">
                    <input id="minigameMaxCountPerDayPerPerson" type="text" className="form-control" placeholder="0" data-group="MinigamePerDayPerPerson" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} onInput={(e) => dom.setMaxValueInput(e.currentTarget)} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.rightsPerDay" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.rightsPerDay", "สิทธิ์ / วัน")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-getPromotionPerUserDay" data-i18n="minigameSetting.limitMinigameErrorText" style={{ display: "none" }}>{t("minigameSetting.limitMinigameErrorText", "กรุณากรอกจำกัดการรับสิทธิ์เล่นมินิเกมส์ “ต่อวัน”")}</div>
                </div>
              </div>
            </div>
            <div className="row box-promotion-item-checkbox-radio" id="boxGetPromotionPerUserWeek">
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableMaxCountPerWeekPerPerson" data-value="inputMinigameMaxCountPerWeekPerPerson" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableMaxCountPerWeekPerPerson">
                    <div className="p2 color-emerald-title-1">
                      <span data-i18n="minigameSetting.limitMinigame">{t("minigameSetting.limitMinigame", "จำกัดการรับสิทธิ์เล่นมินิเกมส์")}</span>
                      {" "}
                      <span className="highlight" data-i18n="minigameSetting.perWeek">{t("minigameSetting.perWeek", "“ต่อสัปดาห์”")}</span>
                    </div>
                    <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.limitMinigamePerMemberSubText3">{t("minigameSetting.limitMinigamePerMemberSubText3", "")}</span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameMaxCountPerWeekPerPerson">
                  <div className="input-group">
                    <input id="minigameMaxCountPerWeekPerPerson" type="text" className="form-control" placeholder="0" data-group="MinigamePerWeekPerPerson" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} onInput={(e) => dom.setMaxValueInput(e.currentTarget)} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.rightsPerWeek" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.rightsPerWeek", "สิทธิ์ / สัปดาห์")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-getPromotionPerUserWeek" data-i18n="minigameSetting.limitMinigameErrorText2" style={{ display: "none" }}>{t("minigameSetting.limitMinigameErrorText2", "")}</div>
                </div>
              </div>
            </div>
            <div className="row box-promotion-item-checkbox-radio" id="boxGetPromotionPerUserMonth">
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableMaxCountPerMonthPerPerson" data-value="inputMinigameMaxCountPerMonthPerPerson" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableMaxCountPerMonthPerPerson">
                    <div className="p2 color-emerald-title-1">
                      <span data-i18n="minigameSetting.limitMinigame">{t("minigameSetting.limitMinigame", "จำกัดการรับสิทธิ์เล่นมินิเกมส์")}</span>
                      {" "}
                      <span className="highlight" data-i18n="minigameSetting.perMonth">{t("minigameSetting.perMonth", "“ต่อเดือน”")}</span>
                    </div>
                    <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.limitMinigamePerMemberSubText4">{t("minigameSetting.limitMinigamePerMemberSubText4", "")}</span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameMaxCountPerMonthPerPerson">
                  <div className="input-group">
                    <input id="minigameMaxCountPerMonthPerPerson" type="text" className="form-control" placeholder="0" data-group="MinigamePerMonthPerPerson" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} onInput={(e) => dom.setMaxValueInput(e.currentTarget)} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.rightsPerMonth" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.rightsPerMonth", "สิทธิ์ / เดือน")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-getPromotionPerUserMonth" data-i18n="minigameSetting.limitMinigameErrorText3" style={{ display: "none" }}>{t("minigameSetting.limitMinigameErrorText3", "")}</div>
                </div>
              </div>
            </div>
            <div className="row box-promotion-item-checkbox-radio" id="boxGetPromotionPerUserAll">
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableMaxCountPerPromotionPerPerson" data-value="inputMinigameMaxCountPerPromotionPerPerson" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableMaxCountPerPromotionPerPerson">
                    <div className="p2 color-emerald-title-1">
                      <span data-i18n="minigameSetting.limitMinigame">{t("minigameSetting.limitMinigame", "จำกัดการรับสิทธิ์เล่นมินิเกมส์")}</span>
                      {" "}
                      <span className="highlight" data-i18n="minigameSetting.perPromotionDuration">{t("minigameSetting.perPromotionDuration", "“ตลอดอายุโปรโมชั่น”")}</span>
                    </div>
                    <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.limitMinigamePerMemberSubText5">{t("minigameSetting.limitMinigamePerMemberSubText5", "")}</span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameMaxCountPerPromotionPerPerson">
                  <div className="input-group">
                    <input id="minigameMaxCountPerPromotionPerPerson" type="text" className="form-control" placeholder="0" data-group="MinigamePerPromotionPerPerson" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} onInput={(e) => dom.setMaxValueInput(e.currentTarget)} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.rightsPerAll" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.rightsPerAll", "สิทธิ์ / ตลอดอายุโปร")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-getPromotionPerUserAll" data-i18n="minigameSetting.limitMinigameErrorText4" style={{ display: "none" }}>{t("minigameSetting.limitMinigameErrorText4", "")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.limitMinigameCustomerGroup">{t("minigameSetting.limitMinigameCustomerGroup", "กำหนดกลุ่มลูกค้าที่มีสิทธิ์รับโปรโมชั่นนี้")}</span>
          <div className="switch">
            <div className="custom-switch switch-alone form-check form-switch">
              <input className="form-check-input" type="checkbox" id="enableLimitCustomerGroup" value="enableLimitCustomerGroup" onClick={(e) => {
    setGroupsOn(e.currentTarget.checked);
    dom.changeStatusSwitch(e.currentTarget, "2-3-10");
    }} />
            </div>
            <span className="color-emerald-title-1" data-i18n="minigameSetting.onAndOffSetting">{t("minigameSetting.onAndOffSetting", "เปิด / ปิด การใช้งาน")}</span>
          </div>
        </div>
        <div className="input-col-1-p switch-2-3-10">
          <div>
            <div className="row box-promotion-item-checkbox-radio" id="boxEnableLimitCustomerGroup">
              <div className="col-12 mb-3">
                <div className="custom-input custom-float">
                  <div className="p2 fw-700 mb-2 text-start color-emerald-title-1" data-i18n="minigameSetting.chooseCustomerGroup">{t("minigameSetting.chooseCustomerGroup", "กลุ่มลูกค้าที่มีสิทธิ์ได้รับ")}</div>
                  <CustomDropdown
      multiple
      id="customLimitCustomerGroupDropdown"
      className={groupsOn ? "boxEnableLimitCustomerGroup custom-input dropdown-wrapper minigame-reset require fistempty" : "boxEnableLimitCustomerGroup custom-input dropdown-wrapper minigame-reset require disabled fistempty"}
      fakeClassName="multiple"
      placeholder="เลือกเลือกกลุ่มลูกค้าที่มีสิทธิ์ได้รับ"
      disabled={!groupsOn}
      items={groupItems}
      value={groups}
      onChange={setGroups}
    >
    <input type="hidden" name="limitCustomerGroup" id="limitCustomerGroup" value={groups.join(",")} readOnly />
    <div className="invalid-feedback" id="error-limitCustomerGroupDropdown" data-i18n="minigameSetting.chooseCustomerGroupErrorText" style={{ display: "none" }}>{t("minigameSetting.chooseCustomerGroupErrorText", "กรุณาเลือกกลุ่มลูกค้าที่มีสิทธิ์ได้รับ")}</div>
    </CustomDropdown>
                </div>
              </div>
              <div className="col-12 col-md-12 mb-3">
                <div className="form-check boxEnableLimitCustomerGroupShow minigame-reset disabled fistempty">
                  <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="enableLimitCustomerGroupShow" />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="enableLimitCustomerGroupShow">
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.limitCustomerToSeeMinigame">{t("minigameSetting.limitCustomerToSeeMinigame", "กำหนดให้กลุ่มลูกค้าอื่น ไม่สามารถเห็นมินิเกมส์นี้ได้")}</div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.minigameResetDurationHeader">{t("minigameSetting.minigameResetDurationHeader", "กำหนดการ Reset สิทธิ์มินิเกมส์ของสมาชิก")}</span>
          <div className="switch">
            <div className="custom-switch switch-alone form-check form-switch">
              <input className="form-check-input" type="checkbox" id="minigameEnableReset" value="enableReset" onClick={(e) => dom.changeStatusSwitch(e.currentTarget, "2-3-3")} />
            </div>
            <span className="color-emerald-title-1" data-i18n="minigameSetting.onAndOffSetting">{t("minigameSetting.onAndOffSetting", "เปิด / ปิด การใช้งาน")}</span>
          </div>
        </div>
        <div className="input-col-1-p switch-2-3-3">
          <div>
            <div className="row box-promotion-item-checkbox-radio" id="boxResetGetPromotionRadioNow">
              <div className="col-12 col-md-6 mb-3" {...raw({ type: "button" })}>
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input me-2" type="radio" name="minigameEnableResetRadio" id="minigameEnableResetExpired" value="minigameEnableResetExpired" defaultChecked onChange={(e) => dom.resetGetMinigameRadio(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableResetExpired">
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.resetWhenExpire">{t("minigameSetting.resetWhenExpire", "Reset สิทธิ์ ทันทีที่มินิเกมหมดอายุ")}</div>
                    <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.resetWhenExpireSubText">{t("minigameSetting.resetWhenExpireSubText", "สมาชิกที่มีสิทธิ์มินิเกมส์วงล้อจะมีเวลาในการใช้สิทธิ์ได้จน กว่าวงล้อนำโชคนั้น ๆ จะหมดอายุ")}</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="row box-promotion-item-checkbox-radio" id="boxResetGetPromotionRadioTime">
              <div className="row">
                <div className="col-12 col-md-6 mb-3" {...raw({ type: "button" })}>
                  <div className="form-check minigame-reset disabled fistempty">
                    <input className="form-check-input me-2" type="radio" name="minigameEnableResetRadio" id="minigameEnableResetTime" data-value="inputMinigameResetTimeBkk" value="minigameEnableResetTime" onChange={(e) => dom.resetGetMinigameRadio(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableResetTime">
                      <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.resetTime">{t("minigameSetting.resetTime", "Reset สิทธิ์ แบบกำหนดเป็นเวลาใดเวลาหนึ่ง")}</div>
                      <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.resetTimeSubText">{t("minigameSetting.resetTimeSubText", "กำหนดเวลา Reset สิทธิ์ ได้ตั้งแต่ 00:00 - 23:59 เวลาใดเวลาหนึ่ง โดยเมื่อถึงเวลาที่กำหนดแล้วในแต่ละวัน สมาชิกยังไม่กด รับ ก็จะถูก Reset สิทธิ์ทันที")}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6 col-md-5 mb-3 ms-4">
                  <div className="custom-input custom-float minigame-checkbox-reset disabled" id="inputMinigameResetTimeBkk">
                    <div className="text-start p2 fw-700 mb-2 color-emerald-title-1" data-i18n="minigameSetting.resetDurationTime">{t("minigameSetting.resetDurationTime", "กำหนดเวลา Reset")}</div>
                    <div className="custom-input custom-float">
                      <input type="text" className="form-control custom-date-flatpickr flatpickr-input" id="minigameResetTimeBkk" data-provider="timepickr" data-date-format="H:i" data-no-calendar="true" data-enable-time="true" data-time_24hr="true" defaultValue="" readOnly placeholder="00:00" />
                      <div className="float-prepend">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.51886 4.92969V8.0026C8.51886 8.14076 8.46399 8.27323 8.36632 8.37089L6.31789 10.4195C6.1145 10.6229 5.78476 10.6229 5.5814 10.4195C5.37801 10.2161 5.37801 9.88633 5.5814 9.68297L7.47729 7.78685V4.92969C7.47729 4.64203 7.71044 4.40885 7.99807 4.40885C8.2857 4.40885 8.51886 4.64203 8.51886 4.92969ZM14.1293 11.5266L13.6147 11.8237C13.6493 12.0145 13.6473 12.1962 13.6147 12.376L14.1293 12.6731C14.3784 12.8169 14.4637 13.1355 14.3199 13.3846C14.1756 13.6345 13.8567 13.7185 13.6085 13.5752L13.0932 13.2777C12.9532 13.3966 12.7919 13.4911 12.6157 13.5544V14.1484C12.6157 14.4361 12.3825 14.6693 12.0949 14.6693C11.8073 14.6693 11.5741 14.4361 11.5741 14.1484V13.5544C11.3979 13.4911 11.2366 13.3966 11.0965 13.2777L10.5813 13.5752C10.3334 13.7184 10.0144 13.6348 9.8699 13.3846C9.72609 13.1355 9.81142 12.8169 10.0605 12.6731L10.5751 12.376C10.5405 12.1851 10.5425 12.0035 10.5751 11.8237L10.0605 11.5266C9.81142 11.3828 9.72609 11.0642 9.8699 10.8151C10.0137 10.566 10.3322 10.4806 10.5813 10.6245L11.0965 10.922C11.2366 10.8031 11.3979 10.7085 11.5741 10.6453V10.0512C11.5741 9.76357 11.8072 9.53039 12.0949 9.53039C12.3825 9.53039 12.6157 9.76357 12.6157 10.0512V10.6453C12.7918 10.7085 12.9532 10.8031 13.0932 10.922L13.6085 10.6245C13.8575 10.4807 14.176 10.566 14.3198 10.8151C14.4637 11.0642 14.3784 11.3827 14.1293 11.5266ZM12.0949 12.6033C12.3725 12.6033 12.5983 12.3774 12.5983 12.0998C12.5983 11.8222 12.3725 11.5964 12.0949 11.5964C11.8173 11.5964 11.5915 11.8222 11.5915 12.0998C11.5915 12.3774 11.8173 12.6033 12.0949 12.6033ZM7.99807 1.33594C4.31397 1.33594 1.33203 4.3176 1.33203 8.0026C1.33203 11.6871 4.31344 14.6693 7.99807 14.6693C8.2857 14.6693 8.51886 14.4361 8.51886 14.1484C8.51886 13.8608 8.2857 13.6276 7.99807 13.6276C4.88961 13.6276 2.3736 11.1118 2.3736 8.0026C2.3736 4.89383 4.88912 2.3776 7.99807 2.3776C11.4671 2.3776 14.1232 5.48984 13.5443 8.9407C13.4967 9.2244 13.6881 9.49294 13.9717 9.54055C14.2555 9.58797 14.5239 9.39677 14.5715 9.11307C15.2534 5.04844 12.1334 1.33594 7.99807 1.33594Z" fill="#5E5E5E" />
                        </svg>
                        {" "}
                        <svg className="navigate-close" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" onClick={(e) => dom.clearValue(e.currentTarget)}>
                          <path d="M12.4495 3.55038C12.3104 3.41135 12.1218 3.33325 11.9252 3.33325C11.7285 3.33325 11.5399 3.41135 11.4009 3.55038L7.99992 6.95131L4.59899 3.55038C4.45992 3.41135 4.27133 3.33325 4.07468 3.33325C3.87804 3.33325 3.68945 3.41135 3.55038 3.55038C3.41135 3.68945 3.33325 3.87804 3.33325 4.07468C3.33325 4.27133 3.41135 4.45992 3.55038 4.59899L6.95131 7.99992L3.55038 11.4009C3.41135 11.5399 3.33325 11.7285 3.33325 11.9252C3.33325 12.1218 3.41135 12.3104 3.55038 12.4495C3.68945 12.5885 3.87804 12.6666 4.07468 12.6666C4.27133 12.6666 4.45992 12.5885 4.59899 12.4495L7.99992 9.04853L11.4009 12.4495C11.5399 12.5885 11.7285 12.6666 11.9252 12.6666C12.1218 12.6666 12.3104 12.5885 12.4495 12.4495C12.5885 12.3104 12.6666 12.1218 12.6666 11.9252C12.6666 11.7285 12.5885 11.5399 12.4495 11.4009L9.04853 7.99992L12.4495 4.59899C12.5885 4.45992 12.6666 4.27133 12.6666 4.07468C12.6666 3.87804 12.5885 3.68945 12.4495 3.55038Z" />
                        </svg>
                      </div>
                      <div className="invalid-feedback" id="error-promotionCountdownTime" data-i18n="minigameSetting.resetDurationTimeErrorText" style={{ display: "none" }}>{t("minigameSetting.resetDurationTimeErrorText", "กรุณาเลือกเวลา")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row box-promotion-item-checkbox-radio" id="boxResetGetPromotionRadioRange">
              <div className="row">
                <div className="col-12 col-md-6 mb-3" {...raw({ type: "button" })}>
                  <div className="form-check minigame-reset disabled fistempty">
                    <input className="form-check-input me-2" type="radio" name="minigameEnableResetRadio" id="minigameEnableResetDateTime" data-value="inputResetGetMinigameRangeResetRadio" value="minigameEnableResetDateTime" onChange={(e) => dom.resetGetMinigameRadio(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableResetDateTime">
                      <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.resetWithDateTime">{t("minigameSetting.resetWithDateTime", "Reset สิทธิ์ แบบกำหนดเป็น วัน : ชั่วโมง : นาที")}</div>
                      <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.resetWithDateTimeSubText">{t("minigameSetting.resetWithDateTimeSubText", "กำหนดการ Reset สิทธิ์เป็นวัน : ชั่วโมง : นาที โดยที่ระบบจะ เริ่มนับเวลาทันทีที่สมาชิกได้รับสิทธิ์มินิเกม และเมื่อถึง เวลาที่กำหมด สมาชิกยังไม่ใช้สิทธิ์ ก็จะถูก Reset สิทธิ์ทันที")}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mb-3 ms-4">
                  <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputResetGetMinigameRangeResetRadio">
                    <div className="text-start p2 fw-700 mb-2 color-emerald-title-1" data-i18n="minigameSetting.resetDurationTime">{t("minigameSetting.resetDurationTime", "กำหนดเวลา Reset")}</div>
                    <div className="input-group">
                      <input id="minigameResetDay" type="number" className="form-control" placeholder="0" data-type="day" style={{ borderRadius: "8px 0px 0px 8px" }} onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} onInput={(e) => dom.setMaxValueDateTime(e.currentTarget)} />
                      {" "}
                      <span className="input-group-text custom-color">วัน</span>
                      {" "}
                      <input id="minigameResetHour" type="number" className="form-control" placeholder="0" {...raw({ mix: "24" })} data-type="hour" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} onInput={(e) => dom.setMaxValueDateTime(e.currentTarget)} />
                      {" "}
                      <span className="input-group-text custom-color py-0">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <div className="p2 fw-700" data-i18n="minigameSetting.hours">{t("minigameSetting.hours", "ชั่วโมง")}</div>
                          <div className="p3 fw-700" data-i18n="minigameSetting.timesHours" style={{ marginTop: "-6px" }}>{t("minigameSetting.timesHours", "ระบุ : 0 - 23 ชม.")}</div>
                        </div>
                      </span>
                      {" "}
                      <input id="minigameResetMinute" type="number" className="form-control" placeholder="0" {...raw({ mix: "60" })} data-type="minute" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} onInput={(e) => dom.setMaxValueDateTime(e.currentTarget)} />
                      {" "}
                      <span className="input-group-text custom-color py-0" style={{ borderRadius: "0px 8px 8px 0px" }}>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <div className="p2 fw-700" data-i18n="minigameSetting.minutes">{t("minigameSetting.minutes", "นาที")}</div>
                          <div className="p3 fw-700" data-i18n="minigameSetting.timesMinutes" style={{ marginTop: "-6px" }}>{t("minigameSetting.timesMinutes", "ระบุ : 0 - 59 นาที")}</div>
                        </div>
                      </span>
                    </div>
                    <div className="invalid-feedback" id="error-resetGetPromotionAmountRange" data-i18n="minigameSetting.resetTimeInput" style={{ display: "none" }}>{t("minigameSetting.resetTimeInput", "กรุณากรอกกำหนดเวลา Reset")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.rightsSettingHeader">{t("minigameSetting.rightsSettingHeader", "กำหนดการหักสิทธิ์ออกจากมินิเกมส์อื่น ๆ")}</span>
          <div className="switch">
            <div className="custom-switch switch-alone form-check form-switch">
              <input className="form-check-input" type="checkbox" id="minigameEnableRemoveChance" onClick={(e) => {
    setChanceOn(e.currentTarget.checked);
    dom.changeStatusSwitch(e.currentTarget, "2-3-4");
    }} />
            </div>
            <span className="color-emerald-title-1" data-i18n="minigameSetting.onAndOffSetting">{t("minigameSetting.onAndOffSetting", "เปิด / ปิด การใช้งาน")}</span>
          </div>
        </div>
        <div className="input-col-1-p switch-2-3-4">
          <div>
            <div className="text-start" style={{ width: "432px" }}>
              <span className="p3" data-i18n="minigameSetting.rightsSettingSubHeaderText" style={{ color: "rgb(173, 173, 173)" }}>{t("minigameSetting.rightsSettingSubHeaderText", "กำหนดการหักสิทธิ์ออกจากมินิเกมส์อื่น ๆ เมื่อสมาชิกใช้สิทธิ์ที่ไม่มีการระบุมินิเกมส์ที่ต้อง ใช้โดยเฉพาะ เพื่อไม่ให้สิทธิ์เฟ้อ และสามารถควบคุมให้การใช้สิทธิ์เป็นตามความต้องการ ของคุณ การกำหนดค่าส่วนนี้จำเป็นต้องมีการคำนวนที่แม่นยำ เพื่อไม่ให้เกิดความ คลาดเคลื่อนในการใช้งาน")}</span>
            </div>
            <div className="text-start p2 fw-700 mb-2 color-emerald-title-1" data-i18n="minigameSetting.rightsSettingSubText">{t("minigameSetting.rightsSettingSubText", "ระบุจำนวนสิทธิ์ที่จะหักออกจากมินิเกมส์อื่น ๆ เมื่อสมาชิกใช้สิทธิ์เล่นมินิเกมส์นี้ 1 สิทธิ์")}</div>
            <div className="row" id="customMinigameRemoveChanceSection">
    {chances.map((row, i) => {
    const n = i + 1;
    return (
              <div key={row.key} className="row session-mini-game-privilege" id={`minigame-remove-chance-${n}`} data-minigame-remove-chance={n}>
                <div className="col-12 col-md-6 mb-3">
                  <input type="hidden" name="minigameRemoveChance-template" id={`minigameIsLuckyWheel-${n}`} />
                  {" "}
                  <input type="hidden" name="minigameRemoveChance-template" id={`minigameIsMiniGame-${n}`} />
                  {" "}
                  <input type="hidden" name="minigameRemoveChance-template" id={`minigameAnyGameId-${n}`} />
                  {" "}
                  <input type="hidden" name="minigameGameName-template" id={`minigameGameName-${n}`} />
                  <div className="custom-input custom-float">
                    <div className="text-start p2 fw-700 mb-2 color-emerald-title-1">มินิเกมส์</div>
                    <CustomDropdown
      className={chanceOn ? "custom-input dropdown-wrapper customMinigameRemoveChanceDropdown minigame-reset fistempty" : "custom-input dropdown-wrapper customMinigameRemoveChanceDropdown minigame-reset disabled fistempty"}
      fakeClassName="multiple"
      placeholder="เลือกมินิเกมส์"
      search
      auto
      stretch
      offsetY={72}
      offsetMargin={72}
      dropdownClassName="boxPromotionDepositBonusDropdown"
      disabled={!chanceOn}
      items={gameItems}
      value={row.game}
      onChange={(game) => pickChanceGame(row.key, game, n)}
    >
    <div className="invalid-feedback" id={`error-MinigameRemoveChance-${n}`} data-i18n="minigameSetting.chooseDepositMethod" style={{ display: "none" }}>{t("minigameSetting.chooseDepositMethod", "กรุณาเลือกประเภทการฝาก")}</div>
    </CustomDropdown>
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <div className="custom-input custom-input-disabled custom-float box-promotion-item-checkbox-radio minigame-checkbox-reset disabled" id={`inputMinigameChanceAmount-${n}`}>
                    <div className="text-start p2 fw-700 mb-2 color-emerald-title-1" data-i18n="minigameSetting.rights">{t("minigameSetting.rights", "จำนวนสิทธิ์")}</div>
                    <div className="input-group">
                      <input id={`minigameChanceAmount-${n}`} type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                      {" "}
                      <span className="input-group-text custom-color" data-i18n="minigameSetting.rights" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.rights", "สิทธิ์")}</span>
                    </div>
                    <div className="invalid-feedback" id={`error-minigameChanceAmount-${n}`} data-i18n="minigameSetting.rightsInputPerDay" style={{ display: "none" }}>{t("minigameSetting.rightsInputPerDay", "กรุณากรอกจำกัดสิทธิ์การรับโปรโมชั่น “ต่อวัน”")}</div>
                  </div>
                </div>
                <div className="btn-remove-chance-privilege" id={`btnRemoveChancePriviege-${n}`} data-remove-number={n} style={shownWhen(chances.length > 1)} onClick={() => actions.deleteTemplateMinigamePrivilege(row.key)}>
                  <img src="/assets/images/minigame/delete.svg" width="24" height="24" />
                </div>
              </div>
    );
    })}
            </div>
            {/* TEMPLATE #templateMinigameRemoveChance omitted */}
            <div className="w-100 text-start minigame-reset disabled fistempty">
              <button className="btn system-btn btn-outline btn-rounded btn-add-minigame" onClick={() => actions.addTemplateMinigameRemoveChance()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17316C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8078C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C21.9971 9.34871 20.9426 6.80684 19.0679 4.9321C17.1932 3.05736 14.6513 2.00287 12 2ZM12 20.3333C10.3518 20.3333 8.74066 19.8446 7.37025 18.9289C5.99984 18.0132 4.93174 16.7117 4.30101 15.189C3.67028 13.6663 3.50525 11.9908 3.82679 10.3742C4.14834 8.75774 4.94201 7.27288 6.10745 6.10744C7.27288 4.94201 8.75774 4.14833 10.3743 3.82679C11.9908 3.50525 13.6663 3.67027 15.189 4.301C16.7117 4.93173 18.0132 5.99984 18.9289 7.37025C19.8446 8.74066 20.3333 10.3518 20.3333 12C20.3309 14.2094 19.4522 16.3276 17.8899 17.8899C16.3276 19.4522 14.2094 20.3309 12 20.3333ZM16.1667 12C16.1667 12.221 16.0789 12.433 15.9226 12.5893C15.7663 12.7455 15.5543 12.8333 15.3333 12.8333H12.8333V15.3333C12.8333 15.5543 12.7455 15.7663 12.5893 15.9226C12.433 16.0789 12.221 16.1667 12 16.1667C11.779 16.1667 11.567 16.0789 11.4107 15.9226C11.2545 15.7663 11.1667 15.5543 11.1667 15.3333V12.8333H8.66667C8.44566 12.8333 8.23369 12.7455 8.07741 12.5893C7.92113 12.433 7.83334 12.221 7.83334 12C7.83334 11.779 7.92113 11.567 8.07741 11.4107C8.23369 11.2545 8.44566 11.1667 8.66667 11.1667H11.1667V8.66667C11.1667 8.44565 11.2545 8.23369 11.4107 8.07741C11.567 7.92113 11.779 7.83333 12 7.83333C12.221 7.83333 12.433 7.92113 12.5893 8.07741C12.7455 8.23369 12.8333 8.44565 12.8333 8.66667V11.1667H15.3333C15.5543 11.1667 15.7663 11.2545 15.9226 11.4107C16.0789 11.567 16.1667 11.779 16.1667 12Z" fill="#E9E9E9" />
                </svg>
                {" "}
                <span data-i18n="minigameSetting.addMinigameToDeductRights">{t("minigameSetting.addMinigameToDeductRights", "เพิ่มมินิเกมส์ที่ต้องการหักสิทธิ์")}</span>
              </button>
            </div>
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.editRightsPerGameCategory">{t("minigameSetting.editRightsPerGameCategory", "กำหนดการใช้สิทธิ์เฉพาะค่ายเกมส์")}</span>
          <div className="switch">
            <div className="custom-switch switch-alone form-check form-switch">
              <input className="form-check-input" type="checkbox" id="minigameEnableGameProvider" onClick={(e) => dom.changeStatusSwitch(e.currentTarget, "2-3-7")} />
            </div>
            <span className="color-emerald-title-1" data-i18n="minigameSetting.onAndOffSetting">{t("minigameSetting.onAndOffSetting", "เปิด / ปิด การใช้งาน")}</span>
          </div>
        </div>
        <div className="input-col-1-p switch-2-3-7">
          <div>
            <div className="text-start p2 fw-700 mt-2 mb-2 color-emerald-title-1" data-i18n="minigameSetting.editGameCategoryForRights">{t("minigameSetting.editGameCategoryForRights", "กำหนดเลือกค่ายเกมส์ หรือ เกมส์ ที่คุณต้องให้คิดโปรโมชั่น")}</div>
            <div className="text-start mb-4">
              <span className="p3 minigame-reset disabled fistempty" data-i18n="minigameSetting.editGameCategoryForRightsSubText" style={{ color: "rgb(235, 51, 51)" }}>{t("minigameSetting.editGameCategoryForRightsSubText", "*ค่ายเกมส์เหล่านี้จะไม่สามารถเลือกนำมาคิดโปรโมชั่นได้ : Spadegaming, SimplePlay, Sky Wind, Big Gaming and Pretty Gaming")}</span>
            </div>
            <div className="row">
              <table className="minigame-reset disabled fistempty" style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <th className="table-round-g-header w-select-provider" data-i18n="minigameSetting.typeGame">{t("minigameSetting.typeGame", "ประเภทเกมส์")}</th>
                    <th className="table-round-g-header" data-i18n="minigameSetting.categoryGame">{t("minigameSetting.categoryGame", "ค่ายเกมส์")}</th>
                  </tr>
                  <tr className="table-sub-header">
                    <td>
                      <div className="row">
                        <div className="col-12 p2 fw-700 mt-2 mb-2 color-emerald-title-1" data-i18n="minigameSetting.chooseTypeGame">{t("minigameSetting.chooseTypeGame", "เลือกประเภทเกมส์")}</div>
                        <div className="col-12">
                          <input type="hidden" id="hiddenGameProviderButtonStatus" defaultValue="#SPORT#" />
                          <div className="div-button-sport mb-2">
                            <div className="inactive-game-button-1 minigame-reset disabled fistempty display-none" onClick={() => dom.onSelectGameProvider("1", "active")}>
                              {/* capture gap: game-category icon (large inline svg) not captured */}
                              {" "}
                              <span className="pl-5" data-i18n="minigameSetting.sport">{t("minigameSetting.sport", "กีฬา")}</span>
                            </div>
                            <div className="active-game-button-1 minigame-reset disabled fistempty" onClick={() => dom.onSelectGameProvider("1", "active")}>
                              {/* capture gap: game-category icon (large inline svg) not captured */}
                              {" "}
                              <span className="pl-5" data-i18n="minigameSetting.sport">{t("minigameSetting.sport", "กีฬา")}</span>
                            </div>
                            <div className="disabled-game-button-1 minigame-reset display-none disabled fistempty">
                              {/* capture gap: game-category icon (large inline svg) not captured */}
                              {" "}
                              <span className="pl-5" data-i18n="minigameSetting.sport">{t("minigameSetting.sport", "กีฬา")}</span>
                            </div>
                          </div>
                          <div className="div-button-games mb-2">
                            <div className="inactive-game-button-2 minigame-reset disabled fistempty" onClick={() => dom.onSelectGameProvider("2", "active")}>
                              {/* capture gap: game-category icon (large inline svg) not captured */}
                              {" "}
                              <span className="pl-5" data-i18n="minigameSetting.games">{t("minigameSetting.games", "เกมส์")}</span>
                            </div>
                            <div className="active-game-button-2 minigame-reset display-none disabled fistempty" onClick={() => dom.onSelectGameProvider("2", "active")}>
                              {/* capture gap: game-category icon (large inline svg) not captured */}
                              {" "}
                              <span className="pl-5" data-i18n="minigameSetting.games">{t("minigameSetting.games", "เกมส์")}</span>
                            </div>
                            <div className="disabled-game-button-2 minigame-reset display-none disabled fistempty">
                              {/* capture gap: game-category icon (large inline svg) not captured */}
                              {" "}
                              <span className="pl-5" data-i18n="minigameSetting.games">{t("minigameSetting.games", "เกมส์")}</span>
                            </div>
                          </div>
                          <div className="div-button-casino mb-2">
                            <div className="inactive-game-button-3" onClick={() => dom.onSelectGameProvider("3", "active")}>
                              {/* capture gap: game-category icon (large inline svg) not captured */}
                              {" "}
                              <span className="pl-5" data-i18n="minigameSetting.casino">{t("minigameSetting.casino", "คาสิโน")}</span>
                            </div>
                            <div className="active-game-button-3 minigame-reset display-none disabled fistempty" onClick={() => dom.onSelectGameProvider("3", "active")}>
                              {/* capture gap: game-category icon (large inline svg) not captured */}
                              {" "}
                              <span className="pl-5" data-i18n="minigameSetting.casino">{t("minigameSetting.casino", "คาสิโน")}</span>
                            </div>
                            <div className="disabled-game-button-3 minigame-reset display-none disabled fistempty">
                              {/* capture gap: game-category icon (large inline svg) not captured */}
                              {" "}
                              <span className="pl-5" data-i18n="minigameSetting.casino">{t("minigameSetting.casino", "คาสิโน")}</span>
                            </div>
                          </div>
                          <div className="div-button-lotto mb-2">
                            <div className="inactive-game-button-4 minigame-reset disabled fistempty" onClick={() => dom.onSelectGameProvider("4", "active")}>
                              {/* capture gap: game-category icon (large inline svg) not captured */}
                              {" "}
                              <span className="pl-5" data-i18n="minigameSetting.lotto">{t("minigameSetting.lotto", "หวย")}</span>
                            </div>
                            <div className="active-game-button-4 minigame-reset display-none disabled fistempty" onClick={() => dom.onSelectGameProvider("4", "active")}>
                              {/* capture gap: game-category icon (large inline svg) not captured */}
                              {" "}
                              <span className="pl-5" data-i18n="minigameSetting.lotto">{t("minigameSetting.lotto", "หวย")}</span>
                            </div>
                            <div className="disabled-game-button-4 minigame-reset display-none disabled fistempty">
                              {/* capture gap: game-category icon (large inline svg) not captured */}
                              {" "}
                              <span className="pl-5" data-i18n="minigameSetting.lotto">{t("minigameSetting.lotto", "หวย")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td valign="top">
                      <div className="row mt-2">
                        <div className="col-12 mb-2 pr20px">
                          <div className="row">
                            <div className="col-8 text-left">
                              <span className="p2 fw-700 mt-2 mb-2 color-emerald-title-1" data-i18n="minigameSetting.chooseCategoryTypeGame">{t("minigameSetting.chooseCategoryTypeGame", "เลือกค่ายเกมที่ต้องการ")}</span>
                            </div>
                            <div className="col-4 text-right">
                              <span className="game-provider-count-text">
                                <span data-i18n="minigameSetting.allCategory">{t("minigameSetting.allCategory", "ค่ายเกมทั้งหมด")}</span>
                                {" "}
                                <span className="provider-count-display">0</span>
                                {" "}
                                <span data-i18n="minigameSetting.categoryText">{t("minigameSetting.categoryText", "ค่าย")}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="games-checker col-12 col-md-12 mb-3">
                            <div className="form-check minigame-reset disabled fistempty" id="selectAllGameProviderSport">
                              <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="selectAllDisplayGameProviderSport" onClick={() => dom.selectAllDisplayGameProvider("sport")} />
                              {" "}
                              <label className="form-check-label d-flex flex-column" htmlFor="selectAllDisplayGameProviderSport">
                                <span className="p2 color-emerald-title-1" data-i18n="minigameSetting.chooseAll">{t("minigameSetting.chooseAll", "เลือกทั้งหมด")}</span>
                              </label>
                            </div>
                            <div className="form-check minigame-reset disabled fistempty" id="selectAllGameProviderGame" style={{ display: "none" }}>
                              <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="selectAllDisplayGameProviderGame" defaultChecked onClick={() => dom.selectAllDisplayGameProvider("game")} />
                              {" "}
                              <label className="form-check-label d-flex flex-column" htmlFor="selectAllDisplayGameProviderGame">
                                <span className="p2 color-emerald-title-1" data-i18n="minigameSetting.chooseAll">{t("minigameSetting.chooseAll", "เลือกทั้งหมด")}</span>
                              </label>
                            </div>
                            <div className="form-check minigame-reset disabled fistempty" id="selectAllGameProviderCasino" style={{ display: "none" }}>
                              <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="selectAllDisplayGameProviderCasino" defaultChecked onClick={() => dom.selectAllDisplayGameProvider("casino")} />
                              {" "}
                              <label className="form-check-label d-flex flex-column" htmlFor="selectAllDisplayGameProviderCasino">
                                <span className="p2 color-emerald-title-1" data-i18n="minigameSetting.chooseAll">{t("minigameSetting.chooseAll", "เลือกทั้งหมด")}</span>
                              </label>
                            </div>
                            <div className="form-check minigame-reset disabled fistempty" id="selectAllGameProviderLotto" style={{ display: "none" }}>
                              <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="selectAllDisplayGameProviderLotto" defaultChecked onClick={() => dom.selectAllDisplayGameProvider("lotto")} />
                              {" "}
                              <label className="form-check-label d-flex flex-column" htmlFor="selectAllDisplayGameProviderLotto">
                                <span className="p2 color-emerald-title-1" data-i18n="minigameSetting.chooseAll">{t("minigameSetting.chooseAll", "เลือกทั้งหมด")}</span>
                              </label>
                            </div>
                          </div>
                          <div className="col-12 col-md-12">
                            <div className="games-display-check-list row m-0">
                              {providers.map((p) => (
                              <div key={`${p.id}-${p.category}`} className={p.category === "sport" ? "form-check minigame-reset game-provider-checker-div col-4 col-md-4 mb-2 game-provider-input-shown" : "form-check minigame-reset game-provider-checker-div game-provider-input-hide col-4 col-md-4 mb-2 display-none"} is-category-sport={String(p.category === "sport")} is-category-game={String(p.category === "game")} is-category-casino={String(p.category === "casino")} is-category-lotto={String(p.category === "lotto")}>
                                <input className="form-check-input form-check-input-custom-mini-game me-2 game-provider-checker-input" type="checkbox" onChange={dom.countingGameProviderSelected} {...raw({ providerid: "15" })} {...raw({ providercode: "ab" })} name="ALLBET" {...raw({ category: "casino" })} id="prov-game-15" />
                                {" "}
                                <label className="form-check-label d-flex flex-column" htmlFor={`prov-game-${p.id}`}>
                                  <span className="p2 color-emerald-title-1">{`${p.name} `}</span>
                                </label>
                              </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="table-round-g-footer" data-i18n="minigameSetting.numberOfGameCategory">{t("minigameSetting.numberOfGameCategory", "จำนวนค่ายเกมส์ที่เลือก")}</td>
                    <td className="table-round-g-footer text-right pr20px">
                      <span className="pr-10px provider-selected-count-display">0</span>
                      <span data-i18n="minigameSetting.gameCategory">{t("minigameSetting.gameCategory", "ค่ายเกมส์")}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.rightsForMemberHeader">{t("minigameSetting.rightsForMemberHeader", "กำหนดการจำกัดสิทธิ์อื่น ๆ ของสมาชิก")}</span>
          <div className="switch">
            <div className="custom-switch switch-alone form-check form-switch">
              <input className="form-check-input" type="checkbox" id="minigameEnableFixChance" value="minigameEnableFixChance" onClick={(e) => dom.changeStatusSwitch(e.currentTarget, "2-3-5")} />
            </div>
            <span className="color-emerald-title-1" data-i18n="minigameSetting.onAndOffSetting">{t("minigameSetting.onAndOffSetting", "เปิด / ปิด การใช้งาน")}</span>
          </div>
        </div>
        <div className="input-col-1-p switch-2-3-5">
          <div>
            <div className="row box-promotion-item-checkbox-radio" id="boxGetPromotionPerUserDay">
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableLimitPerGamePerDay" data-value="inputMinigameLimitPerGamePerDay" value="enableLimitPerGamePerDay" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableLimitPerGamePerDay">
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.minigameLimitPerGamePerDay">{t("minigameSetting.minigameLimitPerGamePerDay", "กำหนดลิมิตการใช้สิทธิ์ของสมาชิก ต่อมินิเกมส์ ต่อวัน")}</div>
                    <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.minigameLimitPerGamePerDaySubText">{t("minigameSetting.minigameLimitPerGamePerDaySubText", "สมาชิกจะใช้สิทธิ์เล่นมินิเกมส์ได้เพียง x สิทธิ์ ต่อ 1 มินิเกมส์ ต่อวัน")}</span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameLimitPerGamePerDay">
                  <div className="input-group">
                    <input id="minigameLimitPerGamePerDay" type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.rightsPerMinigame" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.rightsPerMinigame", "สิทธิ์ ต่อมินิเกมส์")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-limitPerGamePerDay" data-i18n="minigameSetting.rightsPerMinigameErrorText" style={{ display: "none" }}>{t("minigameSetting.rightsPerMinigameErrorText", "กรุณากรอกจำกัดสิทธิ์การรับโปรโมชั่น “ต่อวัน”")}</div>
                </div>
              </div>
            </div>
            <div className="row box-promotion-item-checkbox-radio" id="boxGetPromotionPerUserWeek">
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableLimitPerPerson" data-value="inputMinigameLimitPerPerson" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableLimitPerPerson">
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.getPromotionPerUserWeek2">{t("minigameSetting.getPromotionPerUserWeek2", "จำกัดการรับสิทธิ์ของสมาชิก หากสมาชิกมีสิทธิ์อยู่แล้ว จำนวน x สิทธิ์ (รับได้สูงสุดไม่เกิน x สิทธิ์)")}</div>
                    <span className="p3 color-emerald-title-2">
                      <div className="mb-2" data-i18n="minigameSetting.getPromotionPerUserWeekText">{t("minigameSetting.getPromotionPerUserWeekText", "1. หากสมาชิกมีสิทธิ์มินิเกมส์ที่ยังไม่ได้ใช้ตามจำนวนที่กำหนด ระบบจะไม่ให้สิทธิ์มินิเกมส์แก่สมาชิกคนนั้นอีก")}</div>
                      <div data-i18n="minigameSetting.getPromotionPerUserWeekSubText2">{t("minigameSetting.getPromotionPerUserWeekSubText2", "2. หากสมาชิกผ่านเงื่อนไขของโปร และได้สิทธิ์มากกว่าสิทธิ์ รับได้ ระบบจะแจกให้เท่ากับจำนวนสิทธิ์ที่รับได้เท่านั้น")}</div>
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameLimitPerPerson">
                  <div className="input-group">
                    <input id="minigameLimitPerPerson" type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.rights" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.rights", "สิทธิ์")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-limitPerPerson" data-i18n="minigameSetting.getPromotionPerUserWeekErrorText" style={{ display: "none" }}>{t("minigameSetting.getPromotionPerUserWeekErrorText", "กรุณากรอกจำกัดสิทธิ์การรับโปรโมชั่น “ต่อสัปดาห์”")}</div>
                </div>
              </div>
            </div>
            <div className="row box-promotion-item-checkbox-radio" id="boxGetPromotionPerUserMonth">
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableLimitBalance" data-value="inputMinigameLimitBalance" value="" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableLimitBalance">
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.getPromotionPerUserMonth">{t("minigameSetting.getPromotionPerUserMonth", "ไม่ให้สิทธิ์เมื่อยอดเครดิตคงเหลือในกระเป๋ามากกว่าที่กำหนด")}</div>
                    <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.getPromotionPerUserMonthText">{t("minigameSetting.getPromotionPerUserMonthText", "เลือกทั้ทุกครั้งก่อนฝากจะทำการเชคยอดเครดิตคงเหลือในกระเป๋าทุกครั้ง หากมีเครดิตมากกว่าที่กำหนดไว้ สมาชิกคนนั้นจะไม่ได้รับสิทธิ์มินิเกมส์จากการฝากรอบ นั้น ๆ เช่น เงินเครดิตตอนก่อนรับโปร ห้ามเกินกระเป๋า 100 บาท ถ้ามีเกิน 100 แล้ว จะไม่ได้สิทธิเพิ่มอีกเงื่อนไขการเช็คคือ ต้องเช็คเครดิตก่อนฝากเสมอ จะไม่นับกระเป๋าตอนรวมเครดิตแล้ว")}</span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameLimitBalance">
                  <div className="input-group">
                    <input id="minigameLimitBalance" type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.baht" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-limitBalance" data-i18n="minigameSetting.getPromotionPerUserMonthErrorText" style={{ display: "none" }}>{t("minigameSetting.getPromotionPerUserMonthErrorText", "กรุณากรอกจำกัดสิทธิ์การรับโปรโมชั่น “ต่อเดือน”")}</div>
                </div>
              </div>
            </div>
            <div className="row box-promotion-item-checkbox-radio d-none" id="boxEnableCreditBalance">
              <div className="col-12 col-md-6 mb-3">
                <div className="form-check minigame-reset disabled fistempty">
                  <input className="form-check-input me-2" type="checkbox" id="enableCreditBalance" data-value="inputCreditBalance" value="" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                  {" "}
                  <label className="form-check-label d-flex flex-column" htmlFor="enableCreditBalance">
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.enableCreditBalanceText">{t("minigameSetting.enableCreditBalanceText", "ไม่ไห้สมาชิกใช้สิทธิ์เล่น หากยอด Balance ไม่ถึงตามที่กำหนด")}</div>
                    <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.enableCreditBalanceSubText">{t("minigameSetting.enableCreditBalanceSubText", "สมาชิกจะไม่สามารถเล่นมินิเกมส์ได้ หากยอด Balance ไม่ถึงตามที่กำหนด")}</span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputCreditBalance">
                  <div className="input-group">
                    <input id="creditBalance" type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                    {" "}
                    <span className="input-group-text custom-color" style={{ borderRadius: "0px 8px 8px 0px" }}>บาท</span>
                  </div>
                  <div className="invalid-feedback" id="error-creditBalance" data-i18n="minigameSetting.enableCreditBalanceErrorText" style={{ display: "none" }}>{t("minigameSetting.enableCreditBalanceErrorText", "กรุณากรอกยอด Balance")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="group-btn-minigame-setting ms-0 me-0" id="groupBtnSettingMinigame2-3" style={shownWhen(step === "2-3")}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <button id="buttonNextPromotionStepfinal23" className="btn btn-outline-warning" data-type="next" data-i18n="minigameSetting.summarizeAndSave" style={nav.summaryButtonStyle} onClick={() => nav.toSummary("2-3")}>{t("minigameSetting.summarizeAndSave", "ไปหน้าสรุป")}</button>
          </div>
          <div>
            <button className="btn system-btn btn-outline btn-rounded" data-type="previous" data-i18n="minigameSetting.back" style={{ width: "168px" }} onClick={() => nav.go("2-3", "2-2")}>{t("minigameSetting.back", "ขั้นตอนก่อนหน้า")}</button>
            {" "}
            <button className="btn system-btn btn-rounded ms-2 checkBtn2-3" data-type="next" data-i18n="minigameSetting.next" style={{ width: "168px" }} onClick={() => nav.go("2-3", "3")}>{t("minigameSetting.next", "ถัดไป")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
