"use client";

import { useT } from "@/lib/i18n";
import type { MiniGameType } from "@/lib/api/mini-games";

// Texts the original swaps per mini-game type (openminigameSetting / btnStepSettingMinigame,
// scriptminigame.js:3482 and 7353). Each entry = [i18n key, captured Thai].
type Entry = readonly [string, string];

const LUCKY_WHEEL = {
  createTitle: ["minigameSetting.luckyWheelCreate", "สร้างวงล้อนำโชค"],
  editTitle: ["minigameSetting.luckyWheelEdit", "แก้ไขข้อมูลวงล้อนำโชค"],
  detailTitle: ["minigameSetting.luckyWheelDetails", "รายละเอียดวงล้อนำโชค"],
  viewDetail1: ["minigameSetting.AllminigameDetails", "สรุปข้อมูลการตั้งค่าวงล้อนำโชค ของคุณ"],
  editButton: ["minigameSetting.luckyWheelEditDetails", "แก้ไขข้อมูลวงล้อนำโชค"],
  headDetail: ["minigameSetting.luckyWheelSummarizeDetails", "สรุปรายละเอียดมินิเกมส์ - วงล้อนำโชค"],
  headerAllDetail: ["minigameSetting.luckyWheelDetail", "รายละเอียดมินิเกมส์วงล้อ :"],
  nameDetail: ["minigameSetting.luckyWheelName", "ชื่อมินิเกมส์วงล้อ :"],
  statusDetail: ["minigameSetting.luckyWheelStatus", "สถานะมินิเกมส์วงล้อ :"],
  conditionDetail: ["minigameSetting.luckyWheelConditions", "เงื่อนไขมินิเกมส์วงล้อ :"],
  step1Detail: ["minigameSetting.luckyWheelTypeOther", "ระบุรายละเอียดมินิเกมส์ : วงล้อนำโชค"],
  step1Description: ["minigameSetting.luckyWheelSubTextSetting", "ระบุชื่อวงล้อนำโชคของคุณให้โดดเด่นดึงดูดสมาชิก พร้อมทั้งระบุเงื่อนไขที่ชัดเจนและเข้าใจง่าย"],
  headTap: ["minigameSetting.luckyWheelDetailText", "รายละเอียดวงล้อนำโชค"],
  labelName: ["minigameSetting.luckyWheelName", "ชื่อวงล้อนำโชค"],
  switch1: ["minigameSetting.luckyWheelOpenTestWhenDontHavePrivilage", "เปิดให้ทดลองหมุนวงล้อนำโชคได้ เมื่อไม่มีสิทธิ์"],
  switchTab1: ["minigameSetting.luckyWheelOpenSetting", "เปิด / ปิด การใช้งานวงล้อนำโชค"],
  "tabs2-1-1": ["minigameSetting.luckyWheelDateRangeActive", "ระยะเวลาวงล้อนำโชคและวันทำงาน"],
  "tabs2-1-2": ["minigameSetting.luckyWheelCountdown", "การนับถอยหลัง (Countdown) วันหมดอายุ"],
  "tabs2-1-3": ["minigameSetting.luckyWheelDateTimeAccess", "กำหนดระยะเวลาวงล้อนำโชค (อายุวงล้อ)"],
  "tabs2-1-4": ["minigameSetting.luckyWheelDateActive", "กำหนดวันทำงานของวงล้อนำโชค"],
  "tabs2-2-1": ["minigameSetting.luckyWheelCountdownSetting", "กำหนดการนับถอยหลังวันหมดอายุวงล้อ"],
  "tabs2-2-2": ["minigameSetting.luckyWheelCountdownWhenCreate", "นับถอยหลังทันทีที่สร้างวงล้อนำโชคสำเร็จ"],
  "tabs2-2-3": ["minigameSetting.luckyWheelCountdownText", "ระบบจะทำการนับเวลาถอยหลังทันทีที่คุณสร้างวงล้อนำโชคสำเร็จโดยจะนับถอยหลังเป็น วัน : ชั่วโมง : นาที"],
  "tabs2-2-4": ["minigameSetting.luckyWheelCountdownText2", "ระบบจะทำการนับเวลาถอยหลังทันทีเมื่อถึงวันและเวลาที่คุณ กำหนด โดนจะนับถอนหลังด้วยเวลาที่เหลืออยู่ของวงล้อนั้น"],
  "tabs2-3-1": ["minigameSetting.luckyWheelRightsSetting", "กำหนดการได้รับสิทธิ์ และตั้งค่ามินิเกมส์วงล้อนำโชค"],
  "tabs2-3-2": ["minigameSetting.luckyWheelHowToGetluckyWheel", "การได้รับสิทธิ์มินิเกมส์วงล้อนำโชค"],
  "tabs2-3-3": ["minigameSetting.luckyWheelEditAndSetting", "การปรับแต่งและตั้งค่าวงล้อนำโชค"],
} satisfies Record<string, Entry>;

export type TypeTextKey = keyof typeof LUCKY_WHEEL;

const MINI_GAME: Record<TypeTextKey, Entry> = {
  createTitle: ["minigameSetting.minigameCreate", "สร้างเกมส์อื่น ๆ"],
  editTitle: ["minigameSetting.minigameEdit", "แก้ไขข้อมูลเกมส์อื่น ๆ"],
  detailTitle: ["minigameSetting.minigameDetails", "รายละเอียดเกมส์อื่น ๆ"],
  viewDetail1: ["minigameSetting.AllminigameDetails", "สรุปข้อมูลการตั้งค่าเกมส์อื่นๆ ของคุณ"],
  editButton: ["minigameSetting.minigameEditDetails", "แก้ไขข้อมูลเกมส์อื่นๆ"],
  headDetail: ["minigameSetting.minigameSummarizeDetails", "สรุปรายละเอียดมินิเกมส์"],
  headerAllDetail: ["minigameSetting.minigameDetail", "รายละเอียดมินิเกมส์ :"],
  nameDetail: ["minigameSetting.minigameName", "ชื่อมินิเกมส์ :"],
  statusDetail: ["minigameSetting.minigameStatus", "สถานะมินิเกมส์ :"],
  conditionDetail: ["minigameSetting.minigameConditions", "เงื่อนไขมินิเกมส์: "],
  step1Detail: ["minigameSetting.minigameTypeOther", "ระบุรายละเอียดมินิเกมส์ : เกมส์อื่น ๆ"],
  step1Description: ["minigameSetting.minigameSubTextSetting", "ระบุชื่อเกมส์ของคุณให้โดดเด่นดึงดูดสมาชิก พร้อมทั้งระบุเงื่อนไขที่ชัดเจนและเข้าใจง่าย"],
  headTap: ["minigameSetting.minigameDetailText", "รายละเอียดเกมส์"],
  labelName: ["minigameSetting.minigameName", "ชื่อมินิเกมส์"],
  switch1: ["minigameSetting.minigameOpenTestWhenDontHavePrivilage", "เปิดให้ทดลองเล่นมินิเกมส์ได้ เมื่อไม่มีสิทธิ์"],
  switchTab1: ["minigameSetting.minigameOpenSetting", "เปิด / ปิด การใช้งานมินิเกมส์"],
  "tabs2-1-1": ["minigameSetting.minigameDateRangeActive", "ระยะเวลามินิเกมส์และวันทำงาน"],
  "tabs2-1-2": ["minigameSetting.minigameCountdown", "การนับถอยหลัง (Countdown) วันหมดอายุ"],
  "tabs2-1-3": ["minigameSetting.minigameDateTimeActive", "กำหนดระยะเวลามินิเกมส์ (อายุมินิเกมส์)"],
  "tabs2-1-4": ["minigameSetting.minigameDateActive", "กำหนดวันทำงานของมินิเกมส์"],
  "tabs2-2-1": ["minigameSetting.minigameCountdownSetting", "กำหนดการนับถอยหลังวันหมดอายุมินิเกมส์"],
  "tabs2-2-2": ["minigameSetting.minigameCountdownWhenCreate", "นับถอยหลังทันทีที่สร้างมินิเกมส์สำเร็จ"],
  "tabs2-2-3": ["minigameSetting.minigameCountdownText", "ระบบจะทำการนับเวลาถอยหลังทันทีที่คุณสร้างมินิเกมส์สำเร็จโดยจะนับถอยหลังเป็น วัน : ชั่วโมง : นาที"],
  "tabs2-2-4": ["minigameSetting.minigameCountdownText2", "ระบบจะทำการนับเวลาถอยหลังทันทีเมื่อถึงวันและเวลาที่คุณ กำหนด โดนจะนับถอนหลังด้วยเวลาที่เหลืออยู่ของมินิเกมส์นั้น"],
  "tabs2-3-1": ["minigameSetting.minigameRightsSetting", "กำหนดการได้รับสิทธิ์ และตั้งค่ามินิเกมส์"],
  "tabs2-3-2": ["minigameSetting.minigameHowToGetMinigame", "การได้รับสิทธิ์มินิเกมส์"],
  "tabs2-3-3": ["minigameSetting.minigameEditAndSetting", "การปรับแต่งและตั้งค่ามินิเกมส์"],
};

export function typeText(type: MiniGameType, key: TypeTextKey): Entry {
  return type === "mini-game" ? MINI_GAME[key] : LUCKY_WHEEL[key];
}

// The <span data-i18n="…">…</span> the original injects with .html() + .localize()
export function TypeText({ type, k }: { type: MiniGameType; k: TypeTextKey }) {
  const t = useT();
  const [key, fallback] = typeText(type, k);
  return <span data-i18n={key}>{t(key, fallback)}</span>;
}

// Stepper header per step (btnStepSettingMinigame). Step 4 is hard-coded Thai in the original.
export type WizardStep = "1" | "2-1" | "2-2" | "2-3" | "3" | "4" | "5" | "6";

type StepHeader = { title: string; detail: Entry | string; description: Entry | string; all: string; progress: string };

export function stepHeader(step: WizardStep, type: MiniGameType): StepHeader {
  const mini = type === "mini-game";
  switch (step) {
    case "1":
      return { title: "Step 1", detail: typeText(type, "step1Detail"), description: typeText(type, "step1Description"), all: "Step 1/5", progress: "20%" };
    case "2-1":
      return {
        title: "Step 2.1",
        detail: ["minigameSetting.minigameChooseActiveDay", "กำหนดระยะเวลาของเกมส์และวันทำงาน"],
        description: ["minigameSetting.createDateRangeActive", "สร้างวันเริ่ม - วันสิ้นสุด พร้อมทั้งกำหนดให้ทำงานตามวันและเวลาที่ต้องการได้ดั่งใจ"],
        all: "Step 2/5",
        progress: "40%",
      };
    case "2-2":
      return {
        title: "Step 2.2",
        detail: mini
          ? ["minigameSetting.minigameSettingCountdown", "ตั้งเวลานับถอยหลังวันหมดอายุมินิเกมส์ พร้อมการปรับแต่ง"]
          : ["minigameSetting.minigameSettingCountdown2", "ตั้งเวลานับถอยหลังวันหมดอายุวงล้อนำโชค พร้อมการปรับแต่ง"],
        description: ["minigameSetting.minigameStepSettingText", "กระตุ้นให้สมาชิกอยากฝากเพื่อที่จะรีบมาเล่นมินิเกมส์ที่พวกเขารักกันก่อนจะหมดอายุ"],
        all: "Step 2/5",
        progress: "40%",
      };
    case "2-3":
      return {
        title: "Step 2.3",
        detail: mini
          ? ["minigameSetting.minigameLimitRights", "จำกัดการรับสิทธิ์มินิเกมส์ และการ Reset สิทธิ์"]
          : ["minigameSetting.luckWheelLimitRights", "จำกัดการรับสิทธิ์วงล้อ และการ Reset สิทธิ์"],
        description: ["minigameSetting.minigameLimitText", "ป้องกันสิทธิ์เฟ้อ จัดการสิทธิ์ลำบาก ตั้งค่าเรื่องเหล่านี้เพียงครั้งเดียว จัดการให้คุณตลอดไป"],
        all: "Step 2/5",
        progress: "40%",
      };
    case "3":
      return {
        title: "Step 3",
        detail: mini
          ? ["minigameSetting.minigameRightsSetting", "กำหนดการได้รับสิทธิ์ และตั้งค่ามินิเกมส์"]
          : ["minigameSetting.luckyWheelRightsSetting", "กำหนดการได้รับสิทธิ์ และตั้งค่ามินิเกมส์วงล้อนำโชค"],
        description: mini
          ? ["minigameSetting.minigameRightsSettingText", "สร้างสรรมินิเกมส์ในแบบของคุณ​และรังสรรค์ของรางวัลที่หลากหลายได้ในคราวเดียวกัน"]
          : ["minigameSetting.luckyWheelRightsSettingText", "สร้างสรรวงล้อนำโชคในแบบของคุณ​และรังสรรค์ของรางวัลที่หลากหลายได้ในคราวเดียวกัน"],
        all: "Step 3/5",
        progress: "60%",
      };
    case "4":
      return { title: "Step 4", detail: "กำหนดรูปแบบการแสดงผลมินิเกมส์", description: "กำหนดรูปแบบการแสดงผล และของรางวัลสำหรับมินิเกมส์", all: "Step 4/5", progress: "80%" };
    case "5":
      return {
        title: "Step 5",
        detail: ["minigameSetting.minigameTurnoverSetting", "กำหนดเงื่อนไขติดเทิร์น การถอน การปลดเทิร์น และเงื่อนไขพิเศษอื่น ๆ"],
        description: ["minigameSetting.minigameTurnoverSettingText", "เพื่อให้มินิเกมส์ของคุณนั้นไม่ได้มากันง่ายเกินไปนัก ลองท้าทายความสามารถของสมาชิกกันหน่อย"],
        all: "Step 5/5",
        progress: "100%",
      };
    case "6":
      return {
        title: "Done",
        detail: ["minigameSetting.minigameSummarySetting", "สรุปข้อมูลการตั้งค่ามินิเกมส์ของคุณ"],
        description: ["minigameSetting.minigameSummarySettingText", "ตรวจทานกันก่อนจะสร้างจริง ๆ จะได้ไม่เสียเวลากันทีหลัง"],
        all: "Complete",
        progress: "100%",
      };
  }
}

// A step header text: i18n span when the original injects one, plain text for step 4
export function HeaderText({ value }: { value: Entry | string }) {
  const t = useT();
  if (typeof value === "string") return <>{value}</>;
  return <span data-i18n={value[0]}>{t(value[0], value[1])}</span>;
}
