// wizard-dom.ts — the wizard's "jQuery-style" behaviour, ported from scriptminigame.js / helper.js.
//
// Why this file exists:
// The wizard markup is the original server HTML: thousands of inputs whose enabled / active /
// disabled classes are switched through data-* links between them (a switch unlocks a box, a radio
// unlocks an input…). Re-modelling all of that as React state would drift from the original, so
// these functions do what the original jQuery did, on the same ids and classes, directly on the DOM.
//
// Who owns what:
// - React state is the source of truth for the wizard's structure: which step is shown, the
//   mini-game type, create / edit / detail mode, the slice count and every add/remove list
//   (time slots, bonus rows, deduct rows, providers). Never change those from here.
// - This file only flips classes / values inside markup React rendered with static className
//   strings, so React never overwrites these changes (and they reset when the wizard remounts).
//
// Function names match the original ones, so each can be looked up in scriptminigame.js.
// Accepted for now; a later clean-up could move these into React state one section at a time.

import type { KeyboardEvent } from "react";

const byId = (id: string) => document.getElementById(id);
const all = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(selector));
const input = (id: string) => byId(id) as HTMLInputElement | null;
const addClass = (el: Element | null | undefined, ...names: string[]) => el?.classList.add(...names);
const removeClass = (el: Element | null | undefined, ...names: string[]) => el?.classList.remove(...names);
export const show = (el: HTMLElement | null | undefined) => el && (el.style.display = "");
export const hide = (el: HTMLElement | null | undefined) => el && (el.style.display = "none");
// jQuery :visible
export const isVisible = (el: Element) => (el as HTMLElement).getClientRects().length > 0;

// --- helper.js -------------------------------------------------------------------------

const DEFAULT_KEYS = ["Shift", "Control", "Alt", "Backspace", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "Enter", "Tab"];
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const ACCEPT_KEYS: Record<string, string[]> = {
  numberPositive: [...DEFAULT_KEYS, ...DIGITS, "."],
  numberNegative: [...DEFAULT_KEYS, ...DIGITS, ".", "-"],
  integerPositive: [...DEFAULT_KEYS, ...DIGITS],
  integerNegative: [...DEFAULT_KEYS, ...DIGITS, "-"],
};

// Form.inputAcceptKey (helper.js:354): block keys that are not allowed for this kind of input
export function inputAcceptKey(event: KeyboardEvent<HTMLElement>, kind: string) {
  const keys = ACCEPT_KEYS[kind];
  if (keys && !keys.includes(event.key) && !event.ctrlKey) event.preventDefault();
}

// CustomInput.clearValue (helper.js:752): the × inside a .custom-input empties its input
export function clearValue(navigate: Element) {
  const field = navigate.closest(".custom-input")?.querySelector("input");
  if (field) {
    field.value = "";
    field.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

// `luckywheelWheel1.click()` etc.: open the hidden file input of an upload slot
export function clickById(id: string) {
  byId(id)?.click();
}

// --- step 1 ---------------------------------------------------------------------------

export function selectMultiLanguage(lang: "th" | "en" | "tl") {
  for (const code of ["th", "en", "tl"] as const) {
    const on = code === lang;
    all(`.btn-lang-${code}`).forEach((el) => el.classList.toggle("multi-lang-selected", on));
    byId(code === "th" ? "minigameName" : `minigameName-${code}`)?.classList.toggle("display-none", !on);
    all(code === "th" ? ".minigame-name-label" : `.minigame-name-label-${code}`).forEach((el) => el.classList.toggle("display-none", !on));
    all(`.textarea-condition-${code}`).forEach((el) => (on ? show(el) : hide(el)));
  }
}

// --- step 2: switches, radios and checkboxes linked by data-* ids ----------------------

export function changeEnableStartEndDateStatus() {
  const flag = input("enableStartEndDate");
  if (!flag) return;
  const enable = flag.value !== "true";
  flag.value = String(enable);
  for (const id of ["startDateSettingMinigameFromInput", "startTimeSettingMinigameInput", "endDateSettingMinigameFromInput", "endTimeSettingMinigameInput", "enableHiddenTime"]) {
    const el = input(id);
    if (el) el.disabled = !enable;
  }
}

// changeStatusSwitch (scriptminigame.js:3200): a section switch enables/disables everything in .switch-{step}
export function changeStatusSwitch(elementSwitch: HTMLElement, step: string, action: string = "create") {
  if (step === "2-2-1-1") changeEnableStartEndDateStatus();
  const section = document.querySelector(`.switch-${step}`);
  if (!section) return;
  const on = (elementSwitch as HTMLInputElement).checked;
  if (on && action !== "create") all("div > .box-radio:checked", section).forEach((radio) => addClass(radio.parentElement, "active"));

  for (const el of all<HTMLInputElement>("input", section)) {
    const { valueId, valueId1, valueId2, value } = el.dataset;
    if (on) {
      removeClass(el, "active");
      if (el.checked) {
        if (valueId && valueId1 && valueId2) {
          removeClass(byId(valueId1), "disabled");
          removeClass(byId(valueId2), "disabled");
        } else if (value) removeClass(byId(value), "disabled");
      }
    } else {
      if (valueId1 && valueId2) {
        for (const id of [valueId1, valueId2]) {
          addClass(byId(id), "disabled");
          removeClass(byId(id), "active");
        }
      } else {
        if (value) addClass(byId(value), "disabled");
        if (el.id) removeClass(el.closest(".box-minigame-click-select.minigame-box-reset"), "active");
      }
      addClass(el, "active");
    }
  }
  all(".minigame-reset", section).forEach((el) => el.classList.toggle("disabled", !on));
  for (const dropdown of all(".dropdown-wrapper", section)) {
    const target = dropdown.dataset.value ? byId(dropdown.dataset.value) : null;
    if (!target) continue;
    target.classList.toggle("disabled", !on || dropdown.classList.contains("empty"));
  }
}

// Activates the first box of a radio pair (original: calls the parent's inline onclick)
function selectFirstBox(radio: HTMLElement | null) {
  const box = radio?.parentElement;
  if (box?.dataset.valueId) selectChangeMinigameBoxRadio(box);
}

export function changeMinigameCountdownRadio(radio: HTMLElement) {
  const el = radio as HTMLInputElement;
  if (!el.checked) return;
  const e1 = byId(el.dataset.valueId1 ?? "");
  const e2 = byId(el.dataset.valueId2 ?? "");
  if (el.dataset.valueId === "2") {
    removeClass(e1, "disabled");
    removeClass(e2, "disabled");
    selectFirstBox(e1?.querySelector<HTMLElement>(".box-radio") ?? null);
  } else {
    for (const box of [e1, e2]) {
      addClass(box, "disabled");
      removeClass(box, "active");
    }
  }
}

export function changeMinigamecheckbox(checkbox: HTMLElement) {
  const el = checkbox as HTMLInputElement;
  byId(el.dataset.value ?? "")?.classList.toggle("disabled", !el.checked);
}

export function changeMinigameradioinput(radio: HTMLElement) {
  const el = radio as HTMLInputElement;
  byId(el.dataset.value1 ?? "")?.classList.toggle("disabled", !el.checked);
  byId(el.dataset.value2 ?? "")?.classList.toggle("disabled", el.checked);
}

export function getMinigameRadio(radio: HTMLElement, condition: boolean) {
  const el = radio as HTMLInputElement;
  const ids: string[] = JSON.parse(decodeURIComponent(el.dataset.value ?? "[]"));
  ids.forEach((id) => byId(id)?.classList.toggle("disabled", !condition));
  if (!condition && el.dataset.disable) {
    const other = input(el.dataset.disable);
    if (other) {
      other.checked = true;
      other.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
}

export function resetGetMinigameRadio(radio: HTMLElement) {
  const el = radio as HTMLInputElement;
  const target = byId(el.dataset.value ?? "");
  if (el.checked && el.value === "minigameEnableResetTime") {
    removeClass(target, "disabled");
    addClass(byId("inputResetGetMinigameRangeResetRadio"), "disabled");
  } else if (el.checked && el.value === "minigameEnableResetDateTime") {
    removeClass(target, "disabled");
    addClass(byId("inputMinigameResetTimeBkk"), "disabled");
  } else {
    addClass(byId("inputResetGetMinigameRangeResetRadio"), "disabled");
    addClass(byId("inputMinigameResetTimeBkk"), "disabled");
  }
}

// One of two selectable boxes (.box-minigame-click-select) linked by data-value-id1/2
export function selectChangeMinigameBoxRadio(box: HTMLElement) {
  const first = byId(box.dataset.valueId1 ?? "");
  const second = byId(box.dataset.valueId2 ?? "");
  const pick = (el: HTMLElement | null, on: boolean) => {
    if (!el || el.classList.contains("disabled")) return;
    el.classList.toggle("active", on);
    const radio = el.querySelector<HTMLInputElement>(".box-radio");
    if (radio) radio.checked = on;
  };
  pick(first, box.dataset.valueId === "1");
  pick(second, box.dataset.valueId !== "1");
}

export function changeEnableHiddenTime() {
  const el = input("enableHiddenTime");
  if (el) el.value = el.value === "true" ? "false" : "true";
}

export function changeMinigameSelectTimeAllDay(id: number) {
  const start = input(`minigameCustomStartTime-${id}`);
  const end = input(`minigameCustomEndTime-${id}`);
  if (start) start.value = "00:00";
  if (end) end.value = "23:59";
}

const intOf = (el: Element | undefined) => parseInt((el as HTMLInputElement | undefined)?.value ?? "");

// setMaxValueInput: a limit can't be bigger than the next (longer period) limit of its group
export function setMaxValueInput(el: HTMLElement) {
  const self = el as HTMLInputElement;
  const group = all<HTMLInputElement>(`[data-group=${self.dataset.group}]`);
  const index = group.indexOf(self);
  for (let i = index; i >= 0; i--) {
    if (intOf(group[i]) < intOf(group[i - 1]) && intOf(group[i - 1]) !== 0) group[index].value = group[i - 1].value;
  }
  for (let i = index; i < group.length; i++) {
    if (intOf(group[i]) > intOf(group[i + 1]) && intOf(group[i + 1]) !== 0) group[index].value = group[i + 1].value;
  }
  if (self.dataset.group === "MinigamePerDayPerPerson") {
    const max = all<HTMLInputElement>("[data-group=MaxPromotion]")[index];
    if (parseInt(self.value) > intOf(max) && intOf(max) !== 0) self.value = max.value;
  }
}

export function setMaxValueDateTime(el: HTMLElement) {
  const self = el as HTMLInputElement;
  if (self.dataset.type === "hour" && parseInt(self.value) > 24) self.value = "24";
  else if (self.dataset.type === "minute" && parseInt(self.value) > 60) self.value = "60";
}

export function setMaxValueInputAlert(el: HTMLElement) {
  const group = all<HTMLInputElement>(`[data-group=${(el as HTMLInputElement).dataset.group}]`);
  for (let i = group.length - 1; i > 0; i--) {
    if (intOf(group[i]) > intOf(group[i - 1])) group[i].value = group[i - 1].value;
  }
}

export function enforceMinMax(el: HTMLElement) {
  const self = el as HTMLInputElement;
  if (self.value === "") return;
  if (parseInt(self.value) < parseInt(self.min)) self.value = self.min;
  if (parseInt(self.value) > parseInt(self.max)) self.value = self.max;
}

// Countdown style cards: clicking a card checks its radio
export function cilckStylecountdown(card: HTMLElement) {
  const radio = card.querySelector("input");
  if (radio) radio.checked = true;
}

// "คุณเลือก : …" next to the duration switch (changeFormatStartDateEndDateSelect)
export function changeFormatStartDateEndDateSelect() {
  const v = (id: string) => input(id)?.value ?? "";
  const [startDate, endDate, startTime, endTime] = [
    v("startDateSettingMinigameFromInput"),
    v("endDateSettingMinigameFromInput"),
    v("startTimeSettingMinigameInput"),
    v("endTimeSettingMinigameInput"),
  ];
  const text = startDate && endDate && startTime && endTime ? `${startDate} ${startTime} - ${endDate} ${endTime}` : "-";
  const target = byId("showStartDateEndDateSelect");
  if (target) target.textContent = text;
}

// --- step 2-3: game providers ----------------------------------------------------------

const CATEGORY_BY_BUTTON: Record<string, { key: string; name: string; tag: string }> = {
  "1": { key: "sport", name: "Sport", tag: "#SPORT#" },
  "2": { key: "game", name: "Game", tag: "#GAME#" },
  "3": { key: "casino", name: "Casino", tag: "#CASINO#" },
  "4": { key: "lotto", name: "Lotto", tag: "#LOTTO#" },
};

export function onSelectGameProvider(button: string, status: "active" | "inactive") {
  const hidden = input("hiddenGameProviderButtonStatus");
  let value = hidden?.value ?? "";
  for (const n of ["1", "2", "3", "4"]) {
    all(`.inactive-game-button-${n}`).forEach((el) => removeClass(el, "display-none"));
    all(`.active-game-button-${n}`).forEach((el) => addClass(el, "display-none"));
    hide(byId(`selectAllGameProvider${CATEGORY_BY_BUTTON[n].name}`));
  }
  const category = CATEGORY_BY_BUTTON[button];
  if (category) {
    show(byId(`selectAllGameProvider${category.name}`));
    value = value.replace(category.tag, "");
    const active = status === "active";
    all(`.active-game-button-${button}`).forEach((el) => el.classList.toggle("display-none", !active));
    all(`.inactive-game-button-${button}`).forEach((el) => el.classList.toggle("display-none", active));
    if (active) value += category.tag;
    const inputs = all<HTMLInputElement>(`[is-category-${category.key}="true"] .game-provider-checker-input`);
    const selectAll = input(`selectAllDisplayGameProvider${category.name}`);
    if (selectAll) selectAll.checked = inputs.filter((el) => el.checked).length >= inputs.length;
  }
  if (hidden) hidden.value = value;
  setGameProviderByTypeSelected(button);
}

function setGameProviderByTypeSelected(button: string) {
  for (const [n, { key }] of Object.entries(CATEGORY_BY_BUTTON)) {
    const on = n === button;
    for (const el of all(`[is-category-${key}="true"]`)) {
      el.classList.toggle("display-none", !on);
      el.classList.toggle("game-provider-input-hide", !on);
      el.classList.toggle("game-provider-input-shown", on);
    }
  }
}

export function selectAllDisplayGameProvider(type: "sport" | "game" | "casino" | "lotto") {
  const name = type[0].toUpperCase() + type.slice(1);
  const checked = input(`selectAllDisplayGameProvider${name}`)?.checked ?? false;
  all<HTMLInputElement>(`[is-category-${type}="true"] .game-provider-checker-input`).forEach((el) => (el.checked = checked));
  countingGameProviderSelected();
}

export function countingGameProviderSelected() {
  const count = all(".game-provider-checker-input:checked").length;
  all(".provider-selected-count-display").forEach((el) => (el.textContent = String(count)));
}

// --- step 3 / 5 -----------------------------------------------------------------------

function setDisabled(ids: string[], disabled: boolean) {
  ids.forEach((id) => {
    const el = input(id);
    if (el) el.disabled = disabled;
  });
}

export function enableCreditBalance() {
  setDisabled(["enableReduceAllQuota", "reduceQuota", "customerCreditBalance"], !input("enableCustomerCreditBalance")?.checked);
}

export function enableCreditBalanceWithdraw() {
  setDisabled(["enableReduceAllQuotaWithdraw", "customerCreditWithdraw", "reduceQuotaWithdraw"], !input("enableCustomerCreditWithdraw")?.checked);
}

export function changDisableMinTurnoverMinCredit() {
  const amount = input("minigameWithdrawConditionMinTurnoverMinCredit");
  if (!amount) return;
  const value = input("disableMinTurnOverMinCredit")?.checked ?? false;
  amount.disabled = value;
  if (value && amount.value === "") {
    amount.value = "0";
    hide(byId("error-minigameWithdrawConditionMinTurnoverMinCredit"));
  }
}

// --- uploads (no upload: local preview only) -------------------------------------------

const blobs = new Map<string, string>();

// handleUploadBlob (scriptminigame.js:2697): preview in `.{inputId}Src`, hide `#{inputId}Placeholder`
export function handleUploadBlob(event: { currentTarget: HTMLInputElement }) {
  const field = event.currentTarget;
  const id = field.id;
  const previews = all<HTMLImageElement>(`.${id}Src`);
  const placeholder = byId(`${id}Placeholder`);
  all(".btnSetDefault").forEach((el) => removeClass(el, "disabled"));
  const file = field.files?.[0];
  if (file) {
    const old = blobs.get(id);
    if (old) URL.revokeObjectURL(old);
    const url = URL.createObjectURL(file);
    blobs.set(id, url);
    previews.forEach((img) => {
      img.src = url;
      show(img);
    });
    hide(placeholder);
  } else {
    previews.forEach((img) => {
      img.removeAttribute("src");
      hide(img);
    });
    show(placeholder);
  }
}

// --- step validation (validateStep, scriptminigame.js:3876) -----------------------------

const val = (el: Element | null | undefined) => (el as HTMLInputElement | null | undefined)?.value ?? "";
const empty = (value: string) => value === "" || value == null;

// Step 1 field check (validateStep(f)): shows the name / Agent messages
export function validateStep1Feedback(agentSelected: boolean) {
  const name = input("minigameName");
  const feedback = name?.parentElement?.querySelector<HTMLElement>(".invalid-feedback");
  if (feedback) {
    if (name && !empty(name.value)) {
      hide(feedback);
      feedback.textContent = "";
    } else {
      show(feedback);
      feedback.textContent = "กรุณากรอกชื่อมินิเกมส์";
    }
  }
  const agentError = byId("error-selectAgentDropdown");
  if (agentError) {
    if (agentSelected) {
      hide(agentError);
      agentError.textContent = "";
    } else {
      agentError.style.display = "block";
      agentError.textContent = "กรุณากรอกชื่อเลือก Agent";
    }
  }
}

function closestReset(el: Element, selector: string) {
  return el.closest(selector);
}

// Validates the visible inputs of the current step and enables / disables its "next" buttons.
// Returns whether the step is valid.
export function validateStep(step: string): boolean {
  const results: boolean[] = [];
  const stepRoot = byId(`SettingMinigameStep${step}`);
  const inputs = stepRoot ? all<HTMLInputElement>("input", stepRoot).filter(isVisible) : [];

  switch (step) {
    case "2-2":
      if (input("changeMinigameEnableCountDown")?.checked) {
        let ok = false;
        const chosen = all<HTMLInputElement>(".switch-2-2-1 input:checked:not(.active)[data-value-id1]")[0];
        if (chosen?.dataset.valueId) {
          const box1 = byId(chosen.dataset.valueId1 ?? "");
          const box2 = byId(chosen.dataset.valueId2 ?? "");
          if (box1?.querySelector<HTMLInputElement>("input.box-radio")?.checked) {
            if (val(box1.querySelector('input[type="text"]'))) {
              ok = true;
              hide(box1.querySelector<HTMLElement>(".invalid-feedback"));
            }
          } else if (box2?.querySelector<HTMLInputElement>("input.box-radio")?.checked) {
            const texts = all<HTMLInputElement>('input[type="text"]', box2);
            const feedbacks = all(".invalid-feedback", box2);
            ok = texts.length > 0;
            for (let i = 0; i < texts.length; i++) {
              if (texts[i].value) hide(feedbacks[i]);
              else {
                ok = false;
                break;
              }
            }
          }
        }
        if (input("minigameEnableCountDownCreated")?.checked) ok = true;
        results.push(ok);
      }
      break;
    case "2-3": {
      const perTime = parseInt(val(byId("minigameMaxCountPerTimePerPerson")));
      const perTimeOn = input("minigameEnableMaxPromotionPerPerson")?.checked && input("minigameEnableMaxCountPerTimePerPerson")?.checked;
      const perTimeBad = perTimeOn && (isNaN(perTime) || perTime === 0);
      all(".checkBtn2-3").forEach((el) => el.classList.toggle("disabled", !!perTimeBad));
      byId("inputMinigameMaxCountPerTimePerPerson")?.classList.toggle("custom-invalid", !!perTimeBad);
      byId("minigameMaxCountPerTimePerPerson")?.classList.toggle("is-invalid", !!perTimeBad);
      const perTimeError = byId("error-getPromotionPerUserTime");
      if (perTimeBad) show(perTimeError);
      else hide(perTimeError);
      if (perTimeBad) results.push(false);

      const groups = byId("customLimitCustomerGroupDropdown");
      if (input("enableLimitCustomerGroup")?.checked) {
        if (groups?.classList.contains("empty")) results.push(false);
      } else {
        removeClass(groups, "custom-invalid");
        hide(byId("error-limitCustomerGroupDropdown"));
      }
      break;
    }
    case "3":
      if (all(".require.empty").some(isVisible)) results.push(false);
      for (const el of all<HTMLInputElement>('input[type="text"].validatezero').filter(isVisible)) {
        const wrapper = el.closest(".custom-input");
        const locked = closestReset(el, ".custom-input.minigame-reset")?.classList.contains("disabled");
        const feedback = wrapper?.querySelector<HTMLElement>(".invalid-feedback");
        const bad = empty(el.value) || parseInt(el.value) <= 0;
        if (!locked && !wrapper?.classList.contains("fistempty")) {
          if (bad) {
            results.push(false);
            show(feedback);
          } else hide(feedback);
        } else if (!bad) {
          el.closest(".custom-input.fistempty")?.classList.remove("fistempty");
        } else if (!locked && wrapper?.classList.contains("fistempty")) {
          results.push(false);
        } else hide(feedback);
      }
      break;
    case "4":
      for (const el of all<HTMLInputElement>('.custom-minigame-wheel-section input[type="text"]').filter(isVisible)) {
        if (el.classList.contains("input-search")) continue;
        const wrapper = el.closest(".custom-input");
        const locked = closestReset(el, ".custom-input.minigame-reset")?.classList.contains("disabled");
        const feedback = wrapper?.querySelector<HTMLElement>(".invalid-feedback");
        if (!locked && !wrapper?.classList.contains("fistempty")) {
          if (empty(el.value)) {
            results.push(false);
            show(feedback);
          } else hide(feedback);
        } else if (!empty(el.value)) {
          el.closest(".custom-input.fistempty")?.classList.remove("fistempty");
        } else if (!locked && wrapper?.classList.contains("fistempty")) {
          results.push(false);
        } else hide(feedback);
      }
      break;
    case "5": {
      if (input("minigameEnableIncreaseTurnOver")?.checked) {
        if (input("minigameEnableTurnOverDepositOff")?.checked || input("minigameEnableTurnOverDepositOn")?.checked) {
          const field = input("minigameEnableMinTurnover")?.checked ? input("minigameMinTurnover") : input("minigameEnableMinTurnoverCredit")?.checked ? input("minigameminTurnoverCredit") : null;
          if (field?.closest(".box-minigame-click-select.minigame-box-reset")?.classList.contains("active") && empty(field.value)) results.push(false);
        } else results.push(false);
      }
      for (const el of all<HTMLInputElement>('input[type="text"].validatezero').filter(isVisible)) {
        const box = el.closest(".box-minigame-click-select.minigame-box-reset");
        const feedback = el.closest(".box-minigame-click-select")?.querySelector<HTMLElement>(".invalid-feedback");
        const live = box && !box.classList.contains("disabled") && box.classList.contains("active");
        const bad = empty(el.value) || parseInt(el.value) <= 0;
        if (live && !box.classList.contains("fistempty")) {
          if (bad) {
            results.push(false);
            show(feedback);
          } else hide(feedback);
        } else if (!bad) {
          box?.classList.remove("fistempty");
        } else if (live && box.classList.contains("fistempty")) {
          results.push(false);
        } else hide(feedback);
      }
      if (input("minigameEnableWithdrawConditionMinTurnover")?.checked) {
        if (empty(val(byId("minigameWithdrawConditionMinTurnover")))) results.push(false);
        const minCredit = byId("minigameWithdrawConditionMinTurnoverMinCredit");
        const error = byId("error-minigameWithdrawConditionMinTurnoverMinCredit");
        if (empty(val(minCredit))) {
          results.push(false);
          show(error);
        } else hide(error);
      } else if (input("minigameEnableWithdrawConditionMinTurnoverCredit")?.checked) {
        if (empty(val(byId("minigameWithdrawConditionMinTurnoverCredit")))) results.push(false);
      }
      break;
    }
  }

  // Generic pass over the visible inputs of the step (end of validateStep)
  for (const el of inputs) {
    if (el.id === "minigameName") {
      results.push(!empty(el.value));
      continue;
    }
    const section = el.closest(
      ".minigame-reset:not(.disabled,.box-minigame-click-select), .minigame-box-reset:not(.disabled,.box-minigame-click-select), .minigame-checkbox-reset:not(.disabled,.box-minigame-click-select)",
    );
    if (section && section.querySelector('[type="text"]') && empty(el.value)) results.push(false);
    if (el.closest(".minigame-reset.empty:not(.disabled)")) results.push(false);
    const required = el.closest(".require.empty");
    if (required && isVisible(required)) results.push(false);
  }
  // Step 1: the Agent dropdown has no <input>; the original catches it through `.require.empty`
  if (step === "1" && byId("customSelectAgentDropdown")?.classList.contains("empty")) results.push(false);

  const valid = results.every(Boolean);
  all(`#groupBtnSettingMinigame${step} [data-type="next"]`).forEach((button) => button.classList.toggle("disabled", !valid));
  return valid;
}


// --- step 4 ---------------------------------------------------------------------------

export const LEGACY_ASSET_BASE = "https://p88.blob.core.windows.net";

// `$(el).offcanvas("show")` on the test layouts: .show + a Bootstrap backdrop that closes them
export function openLegacyOffcanvas(id: string) {
  const el = byId(id);
  if (!el) return;
  el.classList.add("show");
  const backdrop = document.createElement("div");
  backdrop.className = "offcanvas-backdrop fade show";
  backdrop.addEventListener("click", () => {
    el.classList.remove("show");
    all(".wheel-display-reward-main.show").forEach((reward) => reward.classList.remove("show"));
    backdrop.remove();
  });
  document.body.appendChild(backdrop);
}

let wheelDeg = 0;

// spinWheel(): 10 turns in 6 s, then the reward popup (always slice 1, like the original demo)
export function spinWheel() {
  const wheel = document.querySelector<HTMLElement>(".wheel-wrapper .custom-wheel.test-spin");
  if (!wheel) return;
  wheelDeg += 360 * 10;
  wheel.style.transition = "all 6s ease-out";
  wheel.style.transform = `rotate(${wheelDeg}deg)`;
  setTimeout(() => byId("wheelDisplayRewardMain")?.classList.add("show"), 6000);
}

export function testMinigame() {
  setTimeout(() => byId("minigameDisplayRewardMain")?.classList.add("show"), 1000);
}

// "คืนค่าเริ่มต้น": back to the default wheel images of the chosen slice count
export function setDefaultImg(count: number) {
  const url = `${LEGACY_ASSET_BASE}/images/minigame/wheel-${count}/`;
  const set = (selector: string, src: string) =>
    all<HTMLImageElement>(selector).forEach((img) => {
      img.src = src;
      show(img);
    });
  set(".luckywheelSpinBtnSrc", `${url}button.png`);
  set(".luckywheelFrameSrc", `${url}frame.png`);
  set(".luckywheelGetRewardSrc", `${url}popup.png`);
  for (let i = 1; i <= count; i++) set(`.luckywheelWheel${i}Src`, `${url}pie-${i}.png`);
  set(".imgMinigameRewardMainSrc, .imgMinigameRewardSrc", `${LEGACY_ASSET_BASE}/images/minigame/minigame-reward.png`);
  set(".imgMinigamePopupSrc", `${LEGACY_ASSET_BASE}/images/minigame/minigame-popup.png`);
  ["luckywheelSpinBtnPlaceholder", "luckywheelFramePlaceholder", "luckywheelGetRewardPlaceholder", "imgMinigameRewardPlaceholder", "imgMinigamePopupPlaceholder"].forEach((id) => hide(byId(id)));
  all(".btnSetDefault").forEach((el) => addClass(el, "disabled"));
}

// Theme colour pickers write the CSS variables of the play-page preview (changeColor…Input)
export function setThemeColor(pickerClass: string, value: string) {
  const name = pickerClass
    .replace(/^getColor/, "")
    .replace(/^BgMainColor$/, "BgMain")
    .replace(/^BgInBoxMiniGameColor$/, "BgInBoxMiniGame")
    .replace(/([a-z])([A-Z0-9])/g, "$1-$2")
    .replace(/(\d)([A-Z])/g, "$1-$2")
    .toLowerCase();
  document.documentElement.style.setProperty(`--color-${name}`, value);
}

const STEPS = [
  { key: "Before", input: "imgBeforeMiniGame", box: "boxUpLoadImgBefore", allRadio: "isCheckDisplayImgBeforeAll", img: "before", step: 1 },
  { key: "After", input: "imgAfterMiniGame", box: "boxUpLoadImgAfter", allRadio: "isCheckDisplayImgAfterAll", img: "after", step: 2 },
  { key: "Results", input: "imgResultsMiniGame", box: "boxUploadImgResults", allRadio: "isCheckDisplayImgResultsAll", img: "results", step: 3 },
] as const;

// hideImgBeforeDisplayTypeStep1/2/3: one slot when "เหมือนกันทั้งหมด", else one per choice
function updateUploadSlots(count: number) {
  for (const s of STEPS) {
    const same = input(s.allRadio)?.checked;
    for (let i = 1; i <= 9; i++) {
      const box = byId(`${s.box}${i}`);
      if (same ? i === 1 : i <= count) show(box);
      else hide(box);
    }
  }
}

// Step 4a (mini-game display layout): every handler the original binds with jQuery on load
export function wireMiniGameLayout(root: HTMLElement, onCount: (count: number) => void) {
  const onClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const quantity = target.closest<HTMLElement>(".box-select-quantity");
    if (quantity) {
      all(".box-select-quantity", root).forEach((el) => removeClass(el, "active"));
      addClass(quantity, "active");
      const count = Number(quantity.dataset.countMiniGame ?? "3");
      const hidden = input("hiddenCountImgMiniGame");
      if (hidden) hidden.value = String(count);
      onCount(count);
      updateUploadSlots(count);
      return;
    }
    const dropHeader = target.closest<HTMLElement>(".btn-on-drop-header-mini-game");
    if (dropHeader) {
      const open = dropHeader.dataset.drop !== "drop";
      dropHeader.dataset.drop = open ? "drop" : "not-drop";
      dropHeader.classList.toggle("drop", open);
      return;
    }
    const close = target.closest<HTMLElement>(".btn-close-img-mini-game");
    if (close) {
      const s = STEPS.find((step) => close.classList.contains(`btn-close-img-mini-game-step-${step.step}`));
      const n = close.dataset.boxNo;
      if (!s || !n) return;
      const hiddenInput = input(`${s.input}${n}`);
      if (hiddenInput) hiddenInput.value = "";
      all<HTMLImageElement>(`.img-show-upload-mini-game-${s.img}-${n}`).forEach((img) => {
        img.src = "";
        hide(img);
      });
      hide(close);
      all(`.default-img-mini-game-${s.img}-${n}`).forEach(show);
    }
  };
  const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (/^isCheckDisplayImg/.test(target.id)) {
      updateUploadSlots(Number(input("hiddenCountImgMiniGame")?.value || "3"));
      return;
    }
    const match = target.id.match(/^fileImageUpload(Before|After|Results)MiniGame(\d)$/);
    const file = target.files?.[0];
    if (!match || !file) return;
    // Original: uploads to uploadUrl (directory "mini-game-image"). Here: a local preview.
    const s = STEPS.find((step) => step.key === match[1])!;
    const n = match[2];
    const url = URL.createObjectURL(file);
    const hiddenInput = input(`${s.input}${n}`);
    if (hiddenInput) hiddenInput.value = url;
    all<HTMLImageElement>(`.img-show-upload-mini-game-${s.img}-${n}`).forEach((img) => {
      img.src = url;
      show(img);
    });
    all(`.default-img-mini-game-${s.img}-${n}`).forEach(hide);
    all(`.btn-close-img-mini-game-step-${s.step}-box-${n}`).forEach(show);
    const error = document.querySelector<HTMLElement>(".session-error-img-require");
    hide(error);
  };
  root.addEventListener("click", onClick);
  root.addEventListener("change", onChange);
  updateUploadSlots(Number(input("hiddenCountImgMiniGame")?.value || "3"));
  return () => {
    root.removeEventListener("click", onClick);
    root.removeEventListener("change", onChange);
  };
}

// Step 4 → 5 for mini-games: every visible "Step 1" choice image is required
export function miniGameImagesComplete(): boolean {
  const count = Number(input("hiddenCountImgMiniGame")?.value || "3");
  const same = input("isCheckDisplayImgBeforeAll")?.checked;
  const missing = Array.from({ length: same ? 1 : count }, (_, i) => input(`imgBeforeMiniGame${i + 1}`)).some((el) => !el?.value);
  const box = document.querySelector<HTMLElement>(".session-error-img-require");
  const text = document.querySelector<HTMLElement>(".txt-error-img-require");
  if (missing) {
    show(box);
    if (text) text.textContent = "รบกวนอัพโหลดรูป ให้ครบถ้วน";
  } else {
    hide(box);
    if (text) text.textContent = "";
  }
  return !missing;
}
