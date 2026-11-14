import type { CSSProperties } from "react";
import type { MiniGame, MiniGameType } from "@/lib/api/mini-games";
import type { WizardStep } from "./wizard-texts";

export type WizardAction = "create" | "edit" | "detail";

// What the step footers' buttons call (btnStepSettingMinigame & co. in the original)
export type WizardNav = {
  go: (current: string, next: string) => void;
  toSummary: (current: string) => void; // "ไปหน้าสรุป"
  backFromSummary: () => void;
  save: () => void; // "ยืนยันการสร้าง" / "ยืนยันการแก้ไข"
  edit: () => void; // "แก้ไขข้อมูล…" in detail mode
  summaryButtonStyle: CSSProperties; // "ไปหน้าสรุป" is only shown when editing
};

export type StepProps = {
  type: MiniGameType;
  action: WizardAction;
  step: WizardStep;
  nav: WizardNav;
  initial: MiniGame | null; // the mini-game being edited / viewed
};

// jQuery .show() / .hide() equivalent for elements React controls
export const shownWhen = (visible: boolean): CSSProperties | undefined => (visible ? undefined : { display: "none" });

// Non-standard attributes the original markup carries (providerid, mix, type on a div …)
export const raw = (attributes: Record<string, string>) => attributes;
