"use client";

import { createContext, useContext } from "react";
import type { MemberTypeForm, MissionFormValues, MissionRewardForm, SubConditionForm, SubMissionForm, TimeSlotForm } from "@/lib/api/missions";
import { conditionErrors, isBasicValid, isDurationValid, isFinishValid, isSubMissionValid, rewardErrors, timeSlotErrors } from "./validation";

// The original form (scriptmission-setting.js) is imperative: the section header status, and some
// error texts, only change when one of its validateMission1/2/4 / validateSubMission functions runs
// (on an "input" event inside the section, a dropdown pick, the section 4 header click), and
// toggleTranslate() — run by every addTemplate…() — re-applies each .mission-page element's
// data-i18n text. This file keeps that "last shown" state next to the form values.

// "js": the text the last validation wrote; "i18n": the element's data-i18n text (after toggleTranslate)
export type StatusText = "i18n" | "js";
export type SectionStatus = { valid: boolean; text: StatusText };

// What validateMission1 last showed for one "ประเภทสมาชิก" row
export type MemberTypeShown = { type: boolean; group: boolean; age: boolean; register: boolean; ageFill: boolean; registerFill: boolean };
export const NO_MEMBER_ERRORS: MemberTypeShown = { type: false, group: false, age: false, register: false, ageFill: false, registerFill: false };

export type FormState = {
  form: MissionFormValues;
  statuses: Record<string, SectionStatus>; // "basic" | "duration" | "finish" | "sub-<id>"
  memberShown: Record<number, MemberTypeShown>; // by member type row id
  previewName: string; // #displayMissionName (changeMissionName: the last typed name, any language)
  previewTime: string; // #displayMissionTimeAndReward
  localized: number; // how many times toggleTranslate() ran since the page loaded
  fresh: number[]; // ids of rows added by an "เพิ่ม…" button that their section's validation has not seen yet
  unlocalized: number[]; // ids of rows added since the last toggleTranslate() (addTemplateRewardMission runs none)
  rowShown: Record<number, Record<string, boolean>>; // error flags of time / reward / condition rows, as last validated
  byTimeCard: boolean; // section 2 "x เท่า" turnover card: validateMission2 shows it while a reward is เครดิต
};

export type FormAction =
  | { type: "patch"; patch: Partial<MissionFormValues> }
  | { type: "sub"; index: number; sub: SubMissionForm }
  | { type: "validate"; key: string }
  | { type: "localize" }
  | { type: "previewName"; value: string }
  | { type: "previewTime" }
  | { type: "fresh"; id: number; unlocalized?: boolean }
  | { type: "load"; form: MissionFormValues };

// Default text of the preview card's date line (create page)
export const DEFAULT_PREVIEW_TIME = "1/10/2024 00:00 - 7/10/2024 23:59";

export const subKey = (sub: SubMissionForm) => `sub-${sub.id}`;

function isValidFor(key: string, form: MissionFormValues) {
  if (key === "basic") return isBasicValid(form);
  if (key === "duration") return isDurationValid(form);
  if (key === "finish") return isFinishValid(form);
  const sub = form.subMissions.find((s) => subKey(s) === key);
  return sub ? isSubMissionValid(sub) : false;
}

// The repeated rows a section's validate function walks through
function rowIdsOf(key: string, form: MissionFormValues) {
  if (key === "duration") return [...form.timeSlots, ...form.rewards].map((row) => row.id);
  const sub = form.subMissions.find((s) => subKey(s) === key);
  return sub ? [...sub.conditions, ...sub.rewards].map((row) => row.id) : [];
}

// Each validate function only touches the error elements on the path of the row's current type, so an
// error of another type stays as it was (e.g. "กรุณาเลือกมินิเกมส์" sits outside the hidden mini-game group)
const REWARD_KEYS: Record<string, string[]> = {
  credit: ["credit"],
  "mini-game-chance": ["miniGame", "miniGameCount"],
  "promotion-chance": ["promotion"],
  point: ["point"],
  reward: ["name"],
};
const CONDITION_KEYS: Record<string, string[]> = {
  deposit: ["depositType", "depositAmount", "depositAccumulated", "depositEvery"],
  "turn-over": ["turnOver"],
  login: ["login"],
  affiliate: ["affiliateType", "affiliateInput"],
  point: ["point"],
};

function merge(before: Record<string, boolean> | undefined, now: Record<string, boolean>, keys: string[]) {
  const next = { ...(before ?? now) };
  for (const key of keys) next[key] = now[key];
  return next;
}

function validateRows(key: string, form: MissionFormValues, before: Record<number, Record<string, boolean>>) {
  const shown = { ...before };
  const reward = (row: MissionRewardForm, everyKey = false) => {
    const now = rewardErrors(row);
    shown[row.id] = everyKey ? now : merge(before[row.id], now, ["type", ...(row.type ? REWARD_KEYS[row.type] : [])]);
  };
  const condition = (row: SubConditionForm) => {
    const now = conditionErrors(row);
    shown[row.id] = merge(before[row.id], now, ["type", ...(row.type ? CONDITION_KEYS[row.type] : [])]);
  };
  const slot = (row: TimeSlotForm) => {
    shown[row.id] = timeSlotErrors(row, form.roundType, form.roundDayType);
  };
  if (key === "duration") {
    form.timeSlots.forEach(slot);
    if (form.rewardEnabled) form.rewards.forEach((row) => reward(row));
  }
  const sub = form.subMissions.find((s) => subKey(s) === key);
  if (sub) {
    sub.conditions.forEach(condition);
    // validateSubMission refreshes every reward error of the row
    if (sub.rewardEnabled) sub.rewards.forEach((row) => reward(row, true));
  }
  return shown;
}

const byTimeCardFor = (form: MissionFormValues) => form.rewards.some((reward) => reward.type === "credit");

const positive = (value: string) => value.trim() !== "" && Number(value) !== 0;

// validateMission1's member type part: stops at the first row without a type; the rows after it keep
// what they showed before
function validateMemberTypes(rows: MemberTypeForm[], before: Record<number, MemberTypeShown>) {
  const shown = { ...before };
  for (const row of rows) {
    const current = { ...(shown[row.id] ?? NO_MEMBER_ERRORS) };
    if (row.type === null) {
      shown[row.id] = { ...current, type: true };
      break;
    }
    current.type = false;
    if (row.type === "member-group") current.group = row.groups.length === 0;
    if (row.type === "life-span") {
      current.age = !positive(row.ageValue);
      current.ageFill = !current.age;
    }
    if (row.type === "created-date") {
      // ORIGINAL BUG (kept on purpose, PK 15/11/2026): an empty date reads as null, so the error is shown
      // and then hidden again by the "=== '' || == 0" check right after it (and "fill" is added). The
      // section still counts as incomplete. The fix would be to test the date once, as an empty string.
      current.register = false;
      current.registerFill = true;
    }
    shown[row.id] = current;
  }
  return shown;
}

// State right after the page has loaded. Create: every header shows its data-i18n text, not valid.
// Edit: getMissionData() ran validateMission1/2/4 (and validateSubMission per sub-mission), then the
// sub-missions' toggleTranslate() put the data-i18n text back.
export function initFormState(initial: MissionFormValues | null, form: MissionFormValues): FormState {
  const statuses: Record<string, SectionStatus> = {};
  for (const key of ["basic", "duration", "finish", ...form.subMissions.map(subKey)]) {
    statuses[key] = { valid: initial ? isValidFor(key, form) : false, text: "i18n" };
  }
  return {
    form,
    statuses,
    memberShown: initial && form.memberRestrict ? validateMemberTypes(form.memberTypes, {}) : {},
    previewName: form.names.th,
    previewTime: initial?.displayTime ?? DEFAULT_PREVIEW_TIME,
    localized: 0,
    fresh: [],
    unlocalized: [],
    rowShown: {},
    byTimeCard: initial !== null && byTimeCardFor(form),
  };
}

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "patch":
      return { ...state, form: { ...state.form, ...action.patch } };
    case "sub":
      return {
        ...state,
        form: { ...state.form, subMissions: state.form.subMissions.map((s, i) => (i === action.index ? action.sub : s)) },
      };
    case "validate": {
      const valid = isValidFor(action.key, state.form);
      const statuses = { ...state.statuses, [action.key]: { valid, text: "js" as const } };
      const memberShown =
        action.key === "basic" && state.form.memberRestrict ? validateMemberTypes(state.form.memberTypes, state.memberShown) : state.memberShown;
      const seen = new Set(rowIdsOf(action.key, state.form));
      const rowShown = validateRows(action.key, state.form, state.rowShown);
      let { form, byTimeCard } = state;
      if (action.key === "duration") {
        byTimeCard = byTimeCardFor(form);
        // no เครดิต reward: the card is hidden and "x บาท" gets checked
        if (!byTimeCard && form.turnOverType === "by-time") form = { ...form, turnOverType: "by-unit" };
      }
      return { ...state, form, statuses, memberShown, rowShown, byTimeCard, fresh: state.fresh.filter((id) => !seen.has(id)) };
    }
    case "localize": {
      const statuses = Object.fromEntries(Object.entries(state.statuses).map(([key, s]) => [key, { ...s, text: "i18n" as const }]));
      // A sub-mission added since: validateSubMission(number, null, true) ran inside addTemplateSubMission
      for (const sub of state.form.subMissions) {
        if (!statuses[subKey(sub)]) statuses[subKey(sub)] = { valid: isSubMissionValid(sub), text: "i18n" };
      }
      return { ...state, statuses, localized: state.localized + 1, unlocalized: [] };
    }
    case "fresh":
      return {
        ...state,
        fresh: [...state.fresh, action.id],
        unlocalized: action.unlocalized ? [...state.unlocalized, action.id] : state.unlocalized,
      };
    case "previewName":
      return { ...state, previewName: action.value };
    case "previewTime": {
      // handleMissionTimeAndRewardInput()
      const { startDate, startTime, endDate, endTime } = state.form;
      return { ...state, previewTime: `${startDate} ${startTime} - ${endDate} ${endTime}` };
    }
    case "load":
      return initFormState(action.form, action.form);
  }
}

// Lets the sections report the original's validate / toggleTranslate moments
export type FormEvents = {
  validate: (key: string) => void;
  localize: () => void;
  localized: number; // see FormState.localized
  added: (id: number, unlocalized?: boolean) => void; // a row added by an "เพิ่ม…" button (errors hidden until validated)
  fresh: number[];
  unlocalized: number[];
  rowShown: Record<number, Record<string, boolean>>;
};

export const FormEventsContext = createContext<FormEvents>({
  validate: () => undefined,
  localize: () => undefined,
  localized: 0,
  added: () => undefined,
  fresh: [],
  unlocalized: [],
  rowShown: {},
});

export function useFormEvents() {
  return useContext(FormEventsContext);
}

// A row's error flags as the page shows them: none until its section has been validated since it was
// added, then what the last validation showed (rows never validated yet show the page-load state)
export function useShownErrors<T extends Record<string, boolean>>(id: number, errors: T): T {
  const { fresh, rowShown } = useFormEvents();
  if (fresh.includes(id)) return Object.fromEntries(Object.keys(errors).map((key) => [key, false])) as T;
  return (rowShown[id] as T | undefined) ?? errors;
}
