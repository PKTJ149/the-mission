// Step 6 summary + the saved mini-game, both read from the wizard form like the original
// getMinigameDetail() (scriptminigame.js:5364) and createPromotion() did.

import type { Agent, MiniGame, MiniGameSlice, MiniGameSliceBonus, MiniGameType } from "@/lib/api/mini-games";
import { hide, show } from "./wizard-dom";

export type Summary = { slices: MiniGameSlice[] };

const byId = (id: string) => document.getElementById(id);
const value = (id: string) => (byId(id) as HTMLInputElement | null)?.value ?? "";
const checked = (id: string) => !!(byId(id) as HTMLInputElement | null)?.checked;
const setText = (id: string, text: string) => {
  const el = byId(id);
  if (el) el.textContent = text;
};
// Pairs like #showEnableMaxPromotion1 / 2 or …Active / …Inactive: show exactly one
const pick = (onId: string, offId: string, on: boolean) => {
  const [onEl, offEl] = [byId(onId), byId(offId)];
  if (on) {
    show(onEl);
    hide(offEl);
  } else {
    hide(onEl);
    show(offEl);
  }
};

const DEPOSIT_TYPE: Record<string, string> = { "deposit-once": "ฝากครั้งเดียว", "accumulated-deposit": "ฝากสะสม", "continuous-deposit": "ฝากติดต่อกัน" };
const DAY_NAMES: Record<string, string> = {
  enableSunday: "อาทิตย์",
  enableMonday: "จันทร์",
  enableTuesday: "อังคาร",
  enableWednesday: "พุธ",
  enableThursday: "พฤหัสบดี",
  enableFriday: "ศุกร์",
  enableSaturday: "เสาร์",
};

function readSlices(count: number): MiniGameSlice[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const bonuses: MiniGameSliceBonus[] = [];
    document.querySelectorAll<HTMLElement>(`#customPromotionConditionTypeSection-${n} [data-time-promotion-condition-type]`).forEach((row) => {
      const m = row.dataset.timePromotionConditionType;
      const type = row.querySelector(".customPromotionBonusTypeDropdown-template .custom-dropdown-item.selected")?.getAttribute("data-value");
      if (type) bonuses.push({ type: type as MiniGameSliceBonus["type"], credit: value(`credit-${n}-${m}`) || "0" });
    });
    return {
      description: value(`minigameRewardDescription-${n}`),
      percentage: value(`minigameLuckyWheelRewardPercentage-${n}`) || "0",
      isUnlimited: !checked(`minigameLimitAmountBonus-${n}`),
      isAlert: checked(`minigameIsAlertOn-${n}`),
      bonuses,
    };
  });
}

// Fills the step 6 blocks (ids of the captured summary markup) and returns what React renders itself
export function collectSummary(type: MiniGameType, agents: Agent[], agentId: string | null, sliceCount: number): Summary {
  pick("showStatusDetail1", "showStatusDetail2", checked("minigameStatus"));
  setText("showName", value("minigameName"));
  const condition = byId("showconditionHtml");
  // CKEditor may still be starting in detail mode: fall back to the loaded HTML in the textarea
  if (condition) condition.innerHTML = document.querySelector("#minigameConditionHtml + .ck-editor .ck-content")?.innerHTML ?? value("minigameConditionHtml");
  const agentBox = byId("showLimitAgentGroupActiveHtml");
  const agentName = agents.find((agent) => agent.value === agentId)?.label;
  if (agentBox) agentBox.innerHTML = agentName ? `<div class="text-center"><span class="custom-badge bg-green-10">${agentName}</span></div>` : "<span>-</span>";

  // Duration and working days
  setText("showStartDateEndDate", byId("showStartDateEndDateSelect")?.textContent ?? "-");
  const selectedDays = Array.from(document.querySelectorAll<HTMLElement>(".box-promotion-select-day:not(.no-select)")).map((el) => DAY_NAMES[el.id]);
  const dayText = byId("showEnableEveryday")?.querySelector(".p3");
  if (dayText) dayText.textContent = selectedDays.length === 7 ? "ทุกวัน" : selectedDays.join(", ") || "-";
  const times = byId("showMinigameTime");
  if (times) {
    times.innerHTML = Array.from(document.querySelectorAll<HTMLElement>("[data-time-minigame]"))
      .map((slot, i) => `<div class="col-4">เวลาทำงานที่ ${i + 1} :</div><div class="col">${value(`minigameCustomStartTime-${i + 1}`)} - ${value(`minigameCustomEndTime-${i + 1}`)}</div>`)
      .join("");
  }

  // Countdown
  pick("showEnableCountDown1", "showEnableCountDown2", checked("changeMinigameEnableCountDown"));
  pick("showEnableCountDownCreated", "showEnableCountDownSetTime", checked("minigameEnableCountDownCreated"));

  // Limits per promotion / per member
  pick("showEnableMaxPromotion1", "showEnableMaxPromotion2", checked("minigameEnableMaxPromotion"));
  pick("showEnableMaxPromotionPerPersonActive", "showEnableMaxPromotionPerPersonInactive", checked("minigameEnableMaxPromotionPerPerson"));
  for (const stem of ["MaxCountPerDay", "MaxCountPerWeek", "MaxCountPerMonth", "MaxCountPerPromotion", "MaxCountPerTimePerPerson", "MaxCountPerDayPerPerson", "MaxCountPerWeekPerPerson", "MaxCountPerMonthPerPerson", "MaxCountPerPromotionPerPerson"]) {
    pick(`showEnable${stem}Active`, `showEnable${stem}Inactive`, checked(`minigameEnable${stem}`));
    setText(`show${stem}Active`, value(`minigame${stem}`) || "0");
  }
  for (const stem of ["LimitPerGamePerDay", "LimitPerPerson", "LimitBalance"]) {
    pick(`showEnable${stem}Active`, `showEnable${stem}Inactive`, checked(`minigameEnable${stem}`));
    setText(`show${stem}Active`, value(`minigame${stem}`) || "0");
  }

  // Customer groups, reset, deduct from other games, other limits
  pick("showEnableLimitCustomerGroupActive", "showEnableLimitCustomerGroupInactive", checked("enableLimitCustomerGroup"));
  pick("showEnableResetActive", "showEnableResetInactive", checked("minigameEnableReset"));
  setText(
    "showEnableResetExpired",
    checked("minigameEnableResetTime") ? "Reset สิทธิ์ แบบกำหนดเป็นเวลาใดเวลาหนึ่ง" : checked("minigameEnableResetDateTime") ? "Reset สิทธิ์ แบบกำหนดเป็น วัน / ชั่วโมง / นาที" : "Reset สิทธิ์ ทันทีที่มินิเกมหมดอายุ",
  );
  pick("showMinigameEnableRemoveChance1", "showMinigameEnableRemoveChance2", checked("minigameEnableRemoveChance"));
  pick("showminigameEnableFixChance11", "showminigameEnableFixChance12", checked("minigameEnableFixChance"));

  // How the right is earned
  const depositType = value("depositType");
  const amountType = document.querySelector("#customMinigameDepositAmountTypeDropdown .input-fake")?.textContent ?? "";
  const amount = value("minigameMinAmountAutoDeposit") || value("minigameAmountAutoDeposit") || value("minigameMaxAmountAutoDeposit") || value("minigameAmountAutoDepositRange");
  setText("showConditionGetBonus", depositType ? `${DEPOSIT_TYPE[depositType] ?? ""} ${depositType === "accumulated-deposit" ? "" : amountType} ${amount || 0} บาท`.replace(/\s+/g, " ") : "-");
  setText("showNumberPartsLuckywheelType", type === "mini-game" ? "Mini Game" : "Lucky Wheel");
  setText("showNumberPartsLuckywheel", String(sliceCount));

  // Turnover
  pick("showEnableConditionTurnoverActive", "showEnableConditionTurnoverInactive", checked("minigameEnableConditionTurnover"));

  return { slices: readSlices(sliceCount) };
}

const pad = (n: number) => String(n).padStart(2, "0");
const now = () => {
  const d = new Date();
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// The card that appears in the list after "ยืนยัน" (create-v2 / update-v2 are not called)
export function collectMiniGame(type: MiniGameType, initial: MiniGame | null, agentId: string | null, sliceCount: number): MiniGame {
  const slices = readSlices(sliceCount);
  const wheelUrl = `https://p88.blob.core.windows.net/images/minigame/wheel-${sliceCount}`;
  const stamp = now();
  return {
    id: initial?.id ?? `new-${Date.now()}`,
    name: value("minigameName"),
    type,
    status: checked("minigameStatus") ? "active" : "inactive",
    agentIds: agentId ? [agentId] : [],
    createdBy: initial?.createdBy ?? "superx",
    updatedBy: "superx",
    createdAt: initial?.createdAt ?? stamp,
    updatedAt: stamp,
    wheel:
      type === "lucky-wheel"
        ? initial?.wheel && initial.wheel.slices.length === sliceCount
          ? initial.wheel
          : { slices: Array.from({ length: sliceCount }, (_, i) => `${wheelUrl}/pie-${i + 1}.png`), spin: `${wheelUrl}/button.png`, frame: `${wheelUrl}/frame.png` }
        : null,
    cover: type === "mini-game" ? (initial?.cover ?? (value("imgBeforeMiniGame1") || "https://p88.blob.core.windows.net/images/minigame/minigame-reward.png")) : null,
    bonusCounts: Array.from({ length: sliceCount }, (_, i) => initial?.bonusCounts[i] ?? { index: i + 1, givenOut: 0, isUnlimited: slices[i]?.isUnlimited ?? true, limitAmount: 0 }),
    detail: {
      ...(initial?.detail ?? { minAmount: "", times: [] }),
      conditionTh: document.querySelector("#minigameConditionHtml + .ck-editor .ck-content")?.innerHTML ?? initial?.detail.conditionTh ?? "",
      depositType: (value("depositType") || "deposit-once") as MiniGame["detail"]["depositType"],
      amountType: initial?.detail.amountType ?? "min-deposit",
      minAmount: value("minigameMinAmountAutoDeposit"),
      bonusTiming: checked("turnOverAfterLuckyWheel") ? "after" : "before",
      times: Array.from(document.querySelectorAll("[data-time-minigame]"), (_, i) => ({ start: value(`minigameCustomStartTime-${i + 1}`), end: value(`minigameCustomEndTime-${i + 1}`) })),
      slices,
    },
  };
}
