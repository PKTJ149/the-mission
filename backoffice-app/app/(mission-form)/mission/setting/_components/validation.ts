import type {
  MemberTypeForm,
  MissionFormValues,
  MissionRewardForm,
  RoundType,
  SubConditionForm,
  SubMissionForm,
  TimeSlotForm,
} from "@/lib/api/missions";

// Validation rules of /mission/setting, after the original validateMission1 / 2 / 4 and
// validateSubMission (staging /js/scriptmission-setting.js, read 15/11/2026). These give the live result;
// form-state.ts keeps what the page last showed (the original only updates errors when it validates).

const filled = (value: string) => value.trim() !== "";
const positive = (value: string) => filled(value) && Number(value) > 0;

export function memberTypeErrors(item: MemberTypeForm) {
  return {
    type: item.type === null,
    group: item.type === "member-group" && item.groups.length === 0,
    age: item.type === "life-span" && !positive(item.ageValue),
    register: item.type === "created-date" && !filled(item.registerDate),
  };
}

// validateMission2. ORIGINAL BUG (kept on purpose, PK 15/11/2026): ทุกสัปดาห์ checks the specific date,
// not the ticked weekdays, when "ระบุวันที่ (1 -31)" was picked under กำหนดเอง before (the radio stays
// checked while hidden). The fix would be to check the weekdays for ทุกสัปดาห์.
export function timeSlotErrors(slot: TimeSlotForm, roundType: RoundType, dayType: "day-of-week" | "day-of-month") {
  let day = false;
  if (roundType === "custom" || roundType === "weekly") {
    day = dayType === "day-of-month" ? !filled(slot.specifyDate ?? "") : slot.days.length === 0;
  } else if (roundType === "monthly") {
    day = slot.monthDays.length === 0;
  }
  return {
    day,
    time: !slot.allDay && (!filled(slot.start) || !filled(slot.end)),
  };
}

export function rewardErrors(reward: MissionRewardForm) {
  return {
    type: reward.type === null,
    credit: reward.type === "credit" && !positive(reward.credit),
    miniGame: reward.type === "mini-game-chance" && reward.miniGameId === null,
    miniGameCount: reward.type === "mini-game-chance" && reward.miniGameId !== null && !positive(reward.miniGameCount),
    // ORIGINAL BUG (kept on purpose, PK 15/11/2026): with no promotion picked the error is shown and then
    // hidden again by the "=== ''" check right after it, so it never appears (the row still counts as
    // incomplete). The fix would be to test the empty value once.
    promotion: false,
    point: reward.type === "point" && !positive(reward.point),
    name: reward.type === "reward" && !filled(reward.name),
  };
}

export function conditionErrors(condition: SubConditionForm) {
  const { type, depositType } = condition;
  return {
    type: type === null,
    depositType: type === "deposit" && depositType === null,
    depositAmount:
      type === "deposit" &&
      ["equal", "more-than", "minimum"].includes(depositType ?? "") &&
      (!positive(condition.depositAmount) || !positive(condition.depositCount)),
    depositAccumulated: type === "deposit" && depositType === "accumulated" && !positive(condition.depositAccumulated),
    depositEvery: type === "deposit" && depositType === "every-deposit" && !positive(condition.depositEvery),
    turnOver:
      type === "turn-over" &&
      !positive(condition.turnOverType === "consecutive" ? condition.turnOverTime : condition.turnOverAmount),
    login: type === "login" && !positive(condition.loginAmount),
    affiliateType: type === "affiliate" && condition.affiliateType === null,
    affiliateInput:
      type === "affiliate" &&
      condition.affiliateType !== null &&
      !positive(affiliateUsesValue(condition.affiliateType) ? condition.affiliateValue : condition.affiliatePeople),
    point: type === "point" && !positive(condition.pointAmount),
  };
}

// Affiliate types counted in baht instead of people
export function affiliateUsesValue(type: string) {
  return type === "total-deposit" || type === "deposit-per-x";
}

const none = (errors: Record<string, boolean>) => Object.values(errors).every((error) => !error);

// A reward row as the validate functions count it (the promotion is checked although its error never shows)
const rewardValid = (reward: MissionRewardForm) =>
  none(rewardErrors(reward)) && !(reward.type === "promotion-chance" && reward.promotionId === null);

export function isBasicValid(form: MissionFormValues) {
  if (!filled(form.names.th) || form.agents.length === 0) return false;
  return !form.memberRestrict || form.memberTypes.every((item) => none(memberTypeErrors(item)));
}

export function isDurationValid(form: MissionFormValues) {
  if (!form.startNow && (!filled(form.startDate) || !filled(form.startTime))) return false;
  if (!form.noEnd && (!filled(form.endDate) || !filled(form.endTime))) return false;
  if (!form.timeSlots.every((slot) => none(timeSlotErrors(slot, form.roundType, form.roundDayType)))) return false;
  if (form.rewardEnabled && !form.rewards.every(rewardValid)) return false;
  if (!form.turnOverEnabled) return true;
  return form.turnOverType === "by-time" ? positive(form.turnOverTimeValue ?? "") : positive(form.turnOverValue);
}

export function isSubMissionValid(sub: SubMissionForm) {
  if (!filled(sub.name)) return false;
  if (!sub.conditions.every((condition) => none(conditionErrors(condition)))) return false;
  if (sub.rewardEnabled) {
    if (sub.resetEnabled && sub.limitReward === "yes" && !positive(sub.limitValue)) return false;
    if (!sub.rewards.every(rewardValid)) return false;
  }
  return !sub.turnOverEnabled || positive(sub.turnOverValue);
}

export function isFinishValid(form: MissionFormValues) {
  if (form.completeType === null) return false;
  return form.completeType === "all" || positive(form.completeValue);
}

export function isFormValid(form: MissionFormValues) {
  return isBasicValid(form) && isDurationValid(form) && form.subMissions.every(isSubMissionValid) && isFinishValid(form);
}
