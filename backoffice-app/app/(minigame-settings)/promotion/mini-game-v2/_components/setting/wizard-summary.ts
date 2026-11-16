// Step 6 summary + the saved mini-game, both read from the wizard form like the original
// getMinigameDetail() (scriptminigame.js:5364) and createPromotion() did.

import type { Agent, MiniGame, MiniGameSlice, MiniGameSliceBonus, MiniGameType } from "@/lib/api/mini-games";
import { hide, show } from "./wizard-dom";

// The summary also shows the "limit" count of each slice (not part of the saved MiniGameSlice)
export type SummaryBonus = MiniGameSliceBonus & { gameName?: string };
export type SummarySlice = MiniGameSlice & { limitAmount: string; bonuses: SummaryBonus[] };
export type Summary = { slices: SummarySlice[]; times: { start: string; end: string }[]; fill: () => void };

const byId = (id: string) => document.getElementById(id);
const value = (id: string) => (byId(id) as HTMLInputElement | null)?.value ?? "";
const checked = (id: string) => !!(byId(id) as HTMLInputElement | null)?.checked;
const setText = (id: string, text: string) => {
  const el = byId(id);
  if (el) el.textContent = text;
};
const showWhen = (el: HTMLElement | null | undefined, on: boolean) => (on ? show(el) : hide(el));
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

function readSlices(count: number): SummarySlice[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const bonuses: SummaryBonus[] = [];
    document.querySelectorAll<HTMLElement>(`#customPromotionConditionTypeSection-${n} [data-time-promotion-condition-type]`).forEach((row) => {
      const m = row.dataset.timePromotionConditionType;
      const type = row.querySelector(".customPromotionBonusTypeDropdown-template .custom-dropdown-item.selected")?.getAttribute("data-value");
      if (!type) return;
      const game = row.querySelector<HTMLElement>(".customPromotionDepositBonusDropdown .custom-dropdown-item.selected");
      bonuses.push({
        type: type as MiniGameSliceBonus["type"],
        credit: value(`credit-${n}-${m}`) || "0",
        percent: value(`percent-${n}-${m}`),
        maxCredit: value(`percentMax-${n}-${m}`),
        gameId: game?.dataset.value,
        gameName: game?.textContent?.trim() ?? "",
        quota: value(`quota-${n}-${m}`),
      });
    });
    return {
      description: value(`minigameRewardDescription-${n}`),
      percentage: value(`minigameLuckyWheelRewardPercentage-${n}`) || "0",
      isUnlimited: !checked(`minigameLimitAmountBonus-${n}`),
      limitAmount: value(`minigameLimitAmount-${n}`),
      isAlert: checked(`minigameIsAlertOn-${n}`),
      bonuses,
    };
  });
}

const AMOUNT_TYPE: Record<string, string> = { "equal-deposit": "ฝากเท่ากับ", "min-deposit": "ฝากขั้นต่ำ", "max-deposit": "ฝากสูงสุด", "deposit-period": "ช่วงยอดฝาก" };

// "เงื่อนไขการได้รับสิทธิ์" text of the summary (scriptminigame.js:5980)
function conditionText(depositType: string, amountType: string) {
  const deposit = DEPOSIT_TYPE[depositType] ?? "";
  const amountText = AMOUNT_TYPE[amountType] ?? "";
  const [equal, min, max, from, to] = ["minigameAmountAutoDeposit", "minigameMinAmountAutoDeposit", "minigameMaxAmountAutoDeposit", "minigameAmountAutoDepositFrom", "minigameAmountAutoDepositTo"].map(value);
  const count = value("minigameDepositCount");
  const period = value("minigameDepositPeriod");
  const repeat = ` จำนวนครบ ${count} ครั้ง ภายใน ${period} วัน`;
  if (depositType === "deposit-once" && amountType === "equal-deposit") return `${deposit} ${amountText} ${equal} บาท`;
  if (depositType === "deposit-once" && amountType === "min-deposit") return `${deposit} ${amountText} ${min} บาท`;
  if (depositType === "deposit-once" && amountType === "max-deposit") return `${deposit} ${amountText} ${max} บาท`;
  if (depositType === "deposit-once" && amountType === "deposit-period") return `${deposit} ${amountText} ${from} - ${to} บาท`;
  if (depositType === "accumulated-deposit") return `${deposit} ครบ ${equal} ภายใน ${period} วัน`;
  if (depositType === "continuous-deposit" && amountType === "min-deposit") return `${deposit} ${amountText} ${min} บาท${repeat}`;
  if (depositType === "continuous-deposit" && amountType === "deposit-period") return `${deposit} ${amountText} ${from} - ${to} บาท${repeat}`;
  if (depositType === "continuous-deposit" && amountType === "equal-deposit") return `${deposit} ${amountText} ${equal} บาท${repeat}`;
  return "-";
}

// Fills the step 6 blocks (ids of the captured summary markup) and returns what React renders itself
export function collectSummary(type: MiniGameType, agents: Agent[], agentId: string | null, sliceCount: number): Summary {
  // Writes the values into the step 6 markup. Step6Summary calls it in a layout effect after each
  // render with a new summary, so the writes always land on the DOM React has just committed
  // (filling right here, before setSummary re-rendered, left the detail view on the placeholders).
  const fill = () => {
    pick("showStatusDetail1", "showStatusDetail2", checked("minigameStatus"));
    setText("showName", value("minigameName"));
    const condition = byId("showconditionHtml");
    // $('#showconditionHtml').html(conditionHtml.getData()) — an empty editor gives "<p>&nbsp;</p>".
    // CKEditor may still be starting in detail mode: fall back to the loaded HTML in the textarea.
    const editable = document.querySelector("#minigameConditionHtml + .ck-editor .ck-editor__editable") as (Element & { ckeditorInstance?: { getData: () => string } }) | null;
    if (condition) condition.innerHTML = editable?.ckeditorInstance?.getData() ?? value("minigameConditionHtml");
    const agentBox = byId("showLimitAgentGroupActiveHtml");
    const agentName = agents.find((agent) => agent.value === agentId)?.label;
    if (agentBox) agentBox.innerHTML = agentName ? `<div class="text-center"><span class="custom-badge bg-green-10">${agentName}</span></div>` : "<span>-</span>";

    // Duration and working days
    setText("showStartDateEndDate", byId("showStartDateEndDateSelect")?.textContent ?? "-");
    const selectedDays = Array.from(document.querySelectorAll<HTMLElement>(".box-promotion-select-day:not(.no-select)")).map((el) => DAY_NAMES[el.id]);
    const dayText = byId("showEnableEveryday")?.querySelector(".p3");
    if (dayText) dayText.textContent = selectedDays.length === 7 ? "ทุกวัน" : selectedDays.join(", ") || "-";

    // Countdown
    pick("showEnableCountDown1", "showEnableCountDown2", checked("changeMinigameEnableCountDown"));
    // Only the chosen countdown option is listed
    const created = checked("minigameEnableCountDownCreated");
    showWhen(byId("showEnableCountDownCreated"), created);
    showWhen(byId("showEnableCountDownSetTime"), !created);
    // ORIGINAL BUG (kept on purpose, PK 15/11/2026): the legacy JS only toggles the inner spans, so the two
    // "นับถอยหลังทันทีเมื่อเหลืออีก…" lines stay hidden (their parent div is display:none). The fix would be
    // to show the parent of the chosen one.
    showWhen(byId("showEnableRemainingDay"), checked("minigameEnableRemainingDay"));
    showWhen(byId("showEnableRemainingDateTime"), !checked("minigameEnableRemainingDay"));
    setText("showEnableRemainingDay", value("minigameCountdownRemainingDay") || "0");
    setText("showEnableRemainingDateTime", `${value("minigameCountdownRemainingDateBkk")} ${value("minigameCountdownRemainingTimeBkk")}`.trim());

    // Limits per promotion / per member
    pick("showEnableMaxPromotion1", "showEnableMaxPromotion2", checked("minigameEnableMaxPromotion"));
    pick("showEnableMaxPromotionPerPersonActive", "showEnableMaxPromotionPerPersonInactive", checked("minigameEnableMaxPromotionPerPerson"));
    // Value cells: the number <span> (…Active) or the "-" cell (…Inactive). The unit text next to the number
    // span stays visible either way, so an empty limit reads "สิทธิ์ … - สิทธิ์" like on staging.
    const valueCell = (stem: string, text: string) => {
      const v = value(`minigame${stem}`);
      pick(`show${stem}Active`, `show${stem}Inactive`, v !== "");
      if (v !== "") setText(`show${stem}Active`, text.replace("{v}", v));
    };
    for (const stem of ["MaxCountPerDay", "MaxCountPerWeek", "MaxCountPerMonth", "MaxCountPerPromotion", "MaxCountPerTimePerPerson", "MaxCountPerDayPerPerson", "MaxCountPerWeekPerPerson", "MaxCountPerMonthPerPerson", "MaxCountPerPerson", "LimitPerGamePerDay", "LimitPerPerson", "LimitBalance"]) {
      pick(`showEnable${stem}Active`, `showEnable${stem}Inactive`, checked(`minigameEnable${stem}`));
      // Staging replaces the balance cell's spans with plain text ("100 บาท")
      valueCell(stem, stem === "LimitBalance" ? "{v} บาท" : "{v}");
    }

    // Customer groups, reset, deduct from other games, other limits
    pick("showEnableLimitCustomerGroupActive", "showEnableLimitCustomerGroupInactive", checked("enableLimitCustomerGroup"));
    pick("showEnableResetActive", "showEnableResetInactive", checked("minigameEnableReset"));
    setText(
      "showEnableResetExpired",
      checked("minigameEnableResetTime") ? "Reset สิทธิ์ แบบกำหนดเป็นเวลาใดเวลาหนึ่ง" : checked("minigameEnableResetDateTime") ? "Reset สิทธิ์ แบบกำหนดเป็น วัน / ชั่วโมง / นาที" : "Reset สิทธิ์ ทันทีที่มินิเกมหมดอายุ",
    );
    pick("showMinigameEnableRemoveChance1", "showMinigameEnableRemoveChance2", checked("minigameEnableRemoveChance"));
    // One line per deduction row of step 2.3 (getTemplateMinigameRemoveChance), switch on or off
    const removeChance = byId("showMinigameEnableRemoveChance");
    if (removeChance) {
      removeChance.innerHTML = Array.from(document.querySelectorAll<HTMLInputElement>('[id^="minigameChanceAmount-"]'))
        .map((amount) => {
          const n = amount.id.split("-").pop();
          const kind = value(`minigameIsLuckyWheel-${n}`) === "true" ? "Lucky wheel" : "Mini Game";
          return `<div class="d-flex flex-wrap justify-content-between align-items-center"><div class="p2">${kind} - ${value(`minigameGameName-${n}`)}</div><div class="p2">${amount.value || "-"} Coupon</div></div>`;
        })
        .join("");
    }
    pick("showminigameEnableFixChance11", "showminigameEnableFixChance12", checked("minigameEnableFixChance"));

    // How the right is earned
    const depositType = value("depositType");
    const amountType = document.querySelector<HTMLElement>("#customMinigameDepositAmountTypeDropdown .custom-dropdown-item.selected")?.dataset.value ?? "";
    setText("showConditionGetBonus", conditionText(depositType, amountType));
    setText("showNumberPartsLuckywheelType", type === "mini-game" ? "Mini Game " : "Lucky Wheel ");
    setText("showNumberPartsLuckywheel", String(sliceCount));

    // Turnover
    pick("showEnableConditionTurnoverActive", "showEnableConditionTurnoverInactive", checked("minigameEnableConditionTurnover"));
    // "x เท่า" when that box is chosen, else "ต้องทำ Turnover ขั้นต่ำ n บาท"
    const timesVariant = checked("minigameEnableWithdrawConditionMinTurnover");
    showWhen(byId("showEnableWithdrawConditionMinTurnover"), timesVariant);
    showWhen(byId("showWithdrawConditionMinTurnover"), timesVariant);
    showWhen(byId("showEnableWithdrawConditionMinTurnoverCredit"), !timesVariant);
    hide(byId("showWithdrawConditionMinTurnoverCredit")?.parentElement);
    setText("showWithdrawConditionMinTurnoverText", value("minigameWithdrawConditionMinTurnover") || "0");
    setText("showEnableWithdrawConditionMinTurnoverCreditText", value("minigameWithdrawConditionMinTurnoverCredit") || "0");
  };
  const times = Array.from(document.querySelectorAll("[data-time-minigame]"), (_, i) => ({ start: value(`minigameCustomStartTime-${i + 1}`), end: value(`minigameCustomEndTime-${i + 1}`) }));
  return { slices: readSlices(sliceCount), times, fill };
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
