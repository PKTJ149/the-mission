"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

// #offcanvasMinigameSetting: the create / edit / detail wizard of a mini-game (openminigameSetting).
// One mount per opening (the page changes `session.key`), which resets every field like the
// original resetSettingPromotion() did.

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Offcanvas, useCustomSweetAlert, type useOffcanvas } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { Agent, MiniGame, MiniGameType } from "@/lib/api/mini-games";
import * as dom from "./wizard-dom";
import { collectMiniGame, collectSummary, type Summary } from "./wizard-summary";
import { HeaderText, stepHeader, typeText, type WizardStep } from "./wizard-texts";
import { shownWhen, type StepProps, type WizardAction, type WizardNav } from "./wizard-types";
import { Step1Detail } from "./step1-detail";
import { Step2Period } from "./step2-period";
import { Step3Rights } from "./step3-rights";
import { Step4Display } from "./step4-display";
import { Step5Turnover } from "./step5-turnover";
import { Step6Summary } from "./step6-summary";

export type SettingSession = { key: number; action: WizardAction; type: MiniGameType; game?: MiniGame };

type OffcanvasProps = {
  control: ReturnType<typeof useOffcanvas>;
  session: SettingSession | null;
  games: MiniGame[];
  agents: Agent[];
  onEdit: (game: MiniGame) => void;
  onSaved: (game: MiniGame, action: "create" | "edit") => void;
};

// The original keeps the (hidden) wizard markup in the page from the start
const INITIAL_SESSION: SettingSession = { key: 0, action: "create", type: "lucky-wheel" };

export function MinigameSettingOffcanvas({ control, session, games, agents, onEdit, onSaved }: OffcanvasProps) {
  const current = session ?? INITIAL_SESSION;
  return (
    <Offcanvas control={control} id="offcanvasMinigameSetting" className="offcanvas offcanvas-end offcanvas-minigame-custom" data-bs-focus="false">
      <SettingWizard key={current.key} session={current} games={games} agents={agents} onClose={control.hide} onEdit={onEdit} onSaved={onSaved} />
    </Offcanvas>
  );
}

type WizardProps = Omit<OffcanvasProps, "control" | "session"> & { session: SettingSession; onClose: () => void };

function SettingWizard({ session, games, agents, onClose, onEdit, onSaved }: WizardProps) {
  const t = useT();
  const { action, type } = session;
  const initial = session.game ?? null;
  const [swal, swalHolder] = useCustomSweetAlert();
  const [step, setStep] = useState<WizardStep>(action === "detail" ? "6" : "1");
  const [agent, setAgent] = useState<string | null>(initial?.agentIds[0] ?? null);
  const [sliceCount, setSliceCount] = useState(initial?.detail.slices.length ?? (type === "mini-game" ? 6 : 8));
  const [namePlaceholder, setNamePlaceholder] = useState<string | undefined>(action === "edit" ? placeholderOf(type) : undefined);
  const [summary, setSummary] = useState<Summary | null>(null);
  const summaryReturn = useRef<WizardStep>("1");
  const bodyRef = useRef<HTMLDivElement>(null);

  const validate = () => dom.validateStep(step);

  // validateStep() after every change inside the wizard (the original binds it to each input)
  const onBodyChange = () => requestAnimationFrame(validate);

  // Validate the step that just opened; detail mode builds the summary from the loaded form
  useEffect(() => {
    dom.validateStep(step);
    if (step === "6") requestAnimationFrame(() => setSummary(collectSummary(type, agents, agent, sliceCount)));
    bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the step changes
  }, [step]);

  const go = (current: string, next: string) => {
    // Mini-game: step 4 → 5 needs every choice image of "Step 1" (scriptminigame.js:3504)
    if (next === "5" && type === "mini-game" && !dom.miniGameImagesComplete()) {
      bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (next === "1") setNamePlaceholder(placeholderOf(type));
    setStep(next as WizardStep);
  };

  const nav: WizardNav = {
    go,
    toSummary: (current) => {
      summaryReturn.current = current as WizardStep;
      go(current, "6");
    },
    backFromSummary: () => go("6", summaryReturn.current),
    save: async () => {
      const { isConfirmed } = await swal.open(
        action === "create"
          ? {
              type: "saving",
              title: "ยืนยันการสร้างข้อมูลมินิเกมส์หรือไม่ ?",
              text: "ระบบจะทำการบันทึกข้อมูลที่คุณได้ทำการสร้างใหม่ทันทีที่คุณกด “ยืนยัน” หากยังไม่แน่ใจว่าข้อมูลที่ สร้างนั้นถูกต้องหรือไม่ให้ กด “ยกเลิก” แล้วกลับไปตรวจสอบข้อมูลอีกครั้งให้แน่ใจ ก่อนจะทำการยืนยันบันทึก การแก้ไขข้อมูลนี้ แต่ไม่ต้องกังวัลไป คุณยังสามารถกลับมาแก้ไขข้อมูลได้ตลอดเวลา",
              onConfirm: () => new Promise((resolve) => setTimeout(resolve, 1000)),
            }
          : {
              type: "saving",
              title: "ยืนยันการแก้ไขข้อมูลมินิเกมส์หรือไม่?",
              text: "ระบบจะทำการเปลี่ยนแปลงข้อมูลที่คุณได้ทำการแก้ไขไว้ล่าสุดทันทีที่คุณกด “ยืนยัน” หากยังไม่แน่ใจว่าข้อมูลที่ แก้ไขนั้นถูกต้องหรือไม่ให้ กด “ยกเลิก” แล้วกลับไปตรวจสอบข้อมูลอีกครั้งให้แน่ใจ ก่อนจะทำการยืนยันบันทึก การแก้ไขข้อมูลนี้ แต่ไม่ต้องกังวัลไป คุณยังสามารถกลับมาแก้ไขข้อมูลได้ตลอดเวลา",
              onConfirm: () => new Promise((resolve) => setTimeout(resolve, 1000)),
            },
      );
      // ORIGINAL: POST /api/promotion/{lucky-wheel|mini-game}/create-v2 or PUT …/update-v2. Nothing is sent.
      if (isConfirmed) onSaved(collectMiniGame(type, initial, agent, sliceCount), action === "edit" ? "edit" : "create");
    },
    edit: () => initial && onEdit(initial),
    summaryButtonStyle: { display: action === "create" ? "none" : undefined, width: "168px" },
  };

  const stepProps: StepProps = { type, action, step, nav, initial };
  const header = stepHeader(step, type);
  const title = typeText(type, action === "create" ? "createTitle" : action === "edit" ? "editTitle" : "detailTitle");
  const detail = action === "detail";
  const showDetail = shownWhen(detail);
  const showEdit = shownWhen(!detail);
  const progressStyle: CSSProperties = { width: header.progress };

  return (
    <>
      <div className="offcanvas-header offcanvas-header-minigame">
        <h4 className="mb-0" id="offcanvasMinigameDetailLabel">
          <span data-i18n={title[0]}>{t(title[0], title[1])}</span>
        </h4>
        <div className="icon-close-offcanvas-minigame-custom" data-bs-dismiss="offcanvas" aria-label="Close" onClick={onClose}>
          <i className="ri-close-line"></i>
        </div>
      </div>
      <div className="offcanvas-body position-relative p-0" id="rootScrollMinigame" ref={bodyRef} onInput={onBodyChange} onChange={onBodyChange} onClick={onBodyChange}>
        <div className="session-title-minigame">
          <img src="/assets/images/minigame/edit-icon.png" width="72" height="72" />
          <div className="canvas-box-step w-100">
            <div className="show-detail" style={showDetail}>
              <div className="d-flex flex-row align-items-center gap-2">
                <div className="d-flex flex-row gap-0">
                  <div>
                    <div className="p1 fw-700 text-white show-detail" id="offcanvasMinigameViewDetail1" style={showDetail}>
                      <HeaderText value={typeText(type, "viewDetail1")} />
                    </div>
                    {/* Colour not captured ("Sensitive key"); the screenshot shows the grey p3 text */}
                    <span className="p3" style={{ color: "rgb(173, 173, 173)" }}>
                      คุณสามารถเปิด / ปิดการใช้งานส่วนต่าง ๆ ได้จากหน้านี้หรือ กดแก้ไข เพื่อทำการแก้ไขรายละเอียดอื่น ๆ ได้ตามที่คุณต้องการ
                    </span>
                  </div>
                </div>
                <div className="text-end">
                  <button className="btn system-btn btn-orange btn-rounded px-1" id="btnEditMinigameDetail" data-type="" style={{ fontSize: "12px", width: "168px" }} onClick={nav.edit}>
                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.3333 10.0027C15.8725 10.0027 15.5 10.376 15.5 10.8359V17.5027C15.5 17.9618 15.1266 18.3359 14.6667 18.3359H3C2.53995 18.3359 2.16672 17.9618 2.16672 17.5027V5.83594C2.16672 5.3768 2.53995 5.00266 3 5.00266H9.66672C10.1275 5.00266 10.5 4.62927 10.5 4.16937C10.5 3.70932 10.1275 3.33594 9.66672 3.33594H3C1.62167 3.33594 0.5 4.45761 0.5 5.83594V17.5027C0.5 18.881 1.62167 20.0027 3 20.0027H14.6667C16.045 20.0027 17.1667 18.881 17.1667 17.5027V10.8359C17.1667 10.3751 16.7941 10.0027 16.3333 10.0027Z" fill="white" />
                        <path d="M8.31295 9.24176C8.25466 9.30005 8.21545 9.37421 8.19882 9.45416L7.60967 12.4009C7.58221 12.5375 7.62554 12.6783 7.72381 12.7775C7.803 12.8567 7.90966 12.8991 8.01891 12.8991C8.04546 12.8991 8.07308 12.8967 8.10055 12.8909L11.0464 12.3018C11.128 12.285 11.2022 12.2459 11.2597 12.1875L17.8531 5.59415L14.9072 2.64844L8.31295 9.24176Z" fill="white" />
                        <path d="M19.8901 0.609398C19.0778 -0.203133 17.756 -0.203133 16.9443 0.609398L15.791 1.76266L18.7369 4.70852L19.8901 3.55511C20.2835 3.16265 20.5002 2.63927 20.5002 2.08263C20.5002 1.52599 20.2835 1.00262 19.8901 0.609398Z" fill="white" />
                      </svg>{" "}
                    <span id="textBtnEdit">
                      <HeaderText value={typeText(type, "editButton")} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="top-title-minigame show-edit show-create" style={showEdit}>
              <span id="textTitleStepSettingMinigame">{header.title}</span>
              <div>
                <span className="title-minigame-detail" id="textDetailStepSettingMinigame" style={{ fontSize: "15px" }}>
                  <HeaderText value={header.detail} />
                </span>{" "}
                <span className="description-minigame-detail" id="textdescriptionStepSettingMinigame" style={{ fontSize: "11px" }}>
                  <HeaderText value={header.description} />
                </span>
              </div>
            </div>
            <div className="progress-setting-minigame progress-moved-setting-minigame show-edit show-create" style={showEdit}>
              <div className="progress-bar" id="progressStepSettingMinigame" style={progressStyle}></div>
              <span className="progress-step" id="textStepAllSettingMinigame">
                {header.all}
              </span>
            </div>
          </div>
        </div>
        <Step1Detail
          {...stepProps}
          agents={agents}
          agent={agent}
          onAgentChange={(value) => {
            setAgent(value);
            // Original onSelect: validateStep("minigameName") → messages + Next state
            requestAnimationFrame(() => {
              dom.validateStep1Feedback(!!value);
              dom.validateStep("1");
            });
          }}
          games={games}
          namePlaceholder={namePlaceholder}
          onValidate={validate}
        />
        <Step2Period {...stepProps} />
        <Step3Rights {...stepProps} />
        <Step4Display {...stepProps} sliceCount={sliceCount} onSliceCountChange={setSliceCount} />
        <Step5Turnover {...stepProps} />
        <Step6Summary {...stepProps} summary={summary} sliceCount={sliceCount} />
      </div>
      {swalHolder}
    </>
  );
}

function placeholderOf(type: MiniGameType) {
  return type === "mini-game" ? "ระบุชื่อมินิเกมส์" : "ระบุชื่อวงล้อนำโชค";
}
