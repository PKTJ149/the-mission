"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

// Step 1 "ระบุรายละเอียดมินิเกมส์": on/off switch, TH/EN/TL name + condition, Agent, play-page icon.
// Markup = captured create-lucky-wheel_step1.html.

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { CustomDropdown, RichTextEditor, type DropdownItem } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { checkMiniGameName, type Agent, type MiniGame } from "@/lib/api/mini-games";
import * as dom from "./wizard-dom";
import { TypeText } from "./wizard-texts";
import { shownWhen, type StepProps } from "./wizard-types";

type Lang = "th" | "en" | "tl";

// Default play-page icons (LEGACY_ASSET_BASE + "/images/default/…")
const DEFAULT_ICON = {
  "lucky-wheel": "https://p88.blob.core.windows.net/images/default/ic-wheel.png",
  "mini-game": "https://p88.blob.core.windows.net/images/default/mini-game.png",
};

function LangStatus({ set }: { set: boolean }) {
  const t = useT();
  return set ? (
    <span data-i18n="minigameSetting.settingSet">{t("minigameSetting.settingSet", "(ตั้งค่าแล้ว)")}</span>
  ) : (
    <span data-i18n="minigameSetting.settingNotSet">{t("minigameSetting.settingNotSet", "(ยังไม่กำหนด)")}</span>
  );
}

type Step1Props = StepProps & {
  agents: Agent[];
  agent: string | null;
  onAgentChange: (value: string | null) => void;
  games: MiniGame[]; // for the "name already used" check
  namePlaceholder: string | undefined;
  onValidate: () => void;
};

export function Step1Detail({ type, step, nav, initial, agents, agent, onAgentChange, games, namePlaceholder, onValidate }: Step1Props) {
  const t = useT();
  const conditions = useRef<Record<Lang, string>>({ th: initial?.detail.conditionTh ?? "", en: "", tl: "" });
  const [langSet, setLangSet] = useState<Record<Lang, boolean>>({ th: false, en: false, tl: false });
  const [agentTouched, setAgentTouched] = useState(false);
  const [iconUrl, setIconUrl] = useState(DEFAULT_ICON[type]);
  const nameTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const agentItems: DropdownItem[] = agents.map((item) => ({ value: item.value, label: item.label }));

  // checkMultiSetting(): a language counts as "set" once it has a name or a condition
  const checkMultiSetting = () => {
    const name = (lang: Lang) => (document.getElementById(lang === "th" ? "minigameName" : `minigameName-${lang}`) as HTMLInputElement | null)?.value ?? "";
    const filled = (lang: Lang) => name(lang).length > 0 || (conditions.current[lang].length > 0 && conditions.current[lang] !== "<p>&nbsp;</p>");
    setLangSet({ th: filled("th"), en: filled("en"), tl: filled("tl") });
  };

  // Edit mode opens with the loaded values already counted
  useEffect(checkMultiSetting, []);

  const setCondition = (lang: Lang, html: string) => {
    conditions.current[lang] = html;
    checkMultiSetting();
  };

  // checkMiniGameNameAvialable (debounced 500 ms): empty → messages; taken → "กรุณาเปลี่ยนชื่อ…"
  const onNameInput = (value: string) => {
    clearTimeout(nameTimer.current);
    nameTimer.current = setTimeout(async () => {
      const feedback = document.querySelector<HTMLElement>("#minigameName ~ .invalid-feedback-minigame-name");
      const free = value.length === 0 || value === initial?.name || (await checkMiniGameName(value, games));
      dom.validateStep1Feedback(!!agent);
      if (!free && feedback) {
        feedback.textContent = "กรุณาเปลี่ยนชื่อเนื่องจากมีชื่อนี้ในระบบอยู่แล้ว";
        feedback.style.display = "block";
      }
      onValidate();
      if (!free) document.querySelectorAll("#groupBtnSettingMinigame1 [data-type=\"next\"]").forEach((button) => button.classList.add("disabled"));
    }, 500);
  };

  useEffect(() => () => clearTimeout(nameTimer.current), []);

  const handleAgentChange = (value: string | null) => {
    setAgentTouched(true);
    onAgentChange(value);
  };

  // Original: uploads to uploadUrl and shows the returned URL. Here: a local preview only.
  const onIconChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) setIconUrl(URL.createObjectURL(file));
  };

  return (
    <div className="canvas-box-body" id="SettingMinigameStep1" style={shownWhen(step === "1")}>
      <div className="tab-header">
        <div className="header-in-body active">
          <div className="tab-group">
            <span className="fw-700" id="textHeadTap">
    <TypeText type={type} k="headTap" />
    </span>
            <div>
              <div className="custom-switch switch-alone form-check form-switch">
                <input className="form-check-input" type="checkbox" id="minigameStatus" value="active" defaultChecked={initial?.status === "active"} />
              </div>
              <span id="textSwitchTab1">
    <TypeText type={type} k="switchTab1" />
    </span>
            </div>
          </div>
        </div>
      </div>
      <div className="multi-language-body">
        <div className="multi-language-header">
          <span className="text-white fw-700" data-i18n="minigameSetting.luckyWheelDetailSubText">{t("minigameSetting.luckyWheelDetailSubText", "กำหนดรายละเอียดแต่ละภาษา")}</span>
          {" "}
          <span className="p3" data-i18n="minigameSetting.luckyWheelDetailSubText2">{t("minigameSetting.luckyWheelDetailSubText2", "เมื่อกำหนดรายละเอียดให้ภาษาใดแล้ว ภาษานั้นจะสามารถเลือกให้เแสดงที่หน้าเล่นของสมาชิกได้")}</span>
        </div>
        <div className="multi-language-button-div">
          <button className="btn multi-lang-button btn-lang-th multi-lang-selected" lang-select-btn="th" onClick={() => dom.selectMultiLanguage("th")}>
            <span className="row">
              <span className="col-12">
                <span className="" data-i18n="minigameSetting.languageSettingTh">{t("minigameSetting.languageSettingTh", "ค่าเริ่มต้น (ไทย)")}</span>
              </span>
              {" "}
              <span className="col-12">
                <span className={`p3 multi-setting-th multi-lang-status-${langSet.th ? "t" : "f"}`}>
    <LangStatus set={langSet.th} />
    </span>
              </span>
            </span>
          </button>
          {" "}
          <button className="btn multi-lang-button btn-lang-en" lang-select-btn="en" onClick={() => dom.selectMultiLanguage("en")}>
            <span className="row">
              <span className="col-4">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_4050_7238)" filter="url(#filter0_d_4050_7238)">
                    <path d="M27.0438 12C27.0438 12.6455 26.989 13.2825 26.8811 13.906C26.538 15.8883 25.661 17.7305 24.3213 19.261C24.1577 19.4485 23.9866 19.6313 23.809 19.809C23.6533 19.9646 23.494 20.115 23.3308 20.2599C21.7924 21.6291 19.9329 22.5258 17.9294 22.8769C17.2985 22.9876 16.6535 23.0438 16 23.0438C15.3625 23.0438 14.7335 22.9899 14.1175 22.8849C12.1141 22.5427 10.2522 21.6554 8.71005 20.296C8.53286 20.1399 8.35989 19.9777 8.19114 19.809C8.02661 19.6444 7.86771 19.4752 7.71489 19.3022C6.35458 17.7633 5.46536 15.9057 5.11896 13.906C5.01114 13.2825 4.9563 12.6455 4.9563 12C4.9563 11.3546 5.01114 10.7175 5.11896 10.0941C5.46489 8.09677 6.35271 6.24099 7.70974 4.70349C7.86396 4.52864 8.02474 4.35755 8.19114 4.19114C8.35802 4.02427 8.52911 3.86349 8.70442 3.70927C10.248 2.34708 12.1118 1.45786 14.1175 1.11521C14.7335 1.01021 15.3625 0.956299 16 0.956299C16.6535 0.956299 17.2985 1.01255 17.9294 1.12317C19.9249 1.47286 21.7783 2.36442 23.313 3.72427C23.4822 3.87427 23.6477 4.02989 23.809 4.19114C23.981 4.36317 24.1465 4.53942 24.3054 4.72036C25.654 6.25458 26.5366 8.1038 26.8811 10.0941C26.989 10.7175 27.0438 11.3546 27.0438 12Z" fill="#0153B5" />
                    <path d="M26.6763 14.8435H21.213L24.9115 18.526C24.58 18.9769 24.2121 19.4058 23.809 19.809C23.4283 20.1896 23.0247 20.5393 22.601 20.8561L18.8669 17.1376V22.6697C17.943 22.9168 16.9811 23.0438 16 23.0438C15.0354 23.0438 14.0894 22.921 13.18 22.6824V17.1563L9.44317 20.889C9.00349 20.5632 8.58489 20.2027 8.19114 19.809C7.80114 19.419 7.44396 19.0051 7.12099 18.5701L10.8527 14.8435H5.3238C5.08146 13.9271 4.9563 12.9732 4.9563 12C4.9563 11.0269 5.08146 10.073 5.3238 9.15661H10.8532L7.11677 5.43567C7.44067 4.9988 7.79927 4.58302 8.19114 4.19114C8.58302 3.79927 8.99927 3.44021 9.43661 3.11583L13.18 6.8438V1.31771C14.0894 1.07911 15.0354 0.956299 16 0.956299C16.9811 0.956299 17.943 1.08333 18.8669 1.33036V6.83958L22.5818 3.12942C23.0126 3.45052 23.4227 3.80489 23.809 4.19114C24.2065 4.58864 24.5693 5.01052 24.8969 5.45442L21.1901 9.15661H26.6763C26.9186 10.073 27.0438 11.0269 27.0438 12C27.0438 12.9732 26.9186 13.9271 26.6763 14.8435Z" fill="#EFEFEF" />
                    <path d="M13.18 14.8435V15.8316L8.71005 20.296C8.53286 20.1399 8.35989 19.9777 8.19114 19.809C8.02661 19.6444 7.86771 19.4752 7.71489 19.3022L12.1793 14.8435H13.18ZM23.809 4.19114C23.6477 4.02989 23.4822 3.87427 23.313 3.72427L18.8669 8.16427V9.15661H19.8635L24.3054 4.72036C24.1465 4.53942 23.981 4.36317 23.809 4.19114ZM8.70442 3.70927C8.52911 3.86349 8.35802 4.02427 8.19114 4.19114C8.02474 4.35755 7.86396 4.52864 7.70974 4.70349L12.1816 9.15661H13.18V8.16614L8.70442 3.70927ZM19.8851 14.8435H18.8669V15.8143L23.3308 20.2599C23.494 20.115 23.6533 19.9646 23.809 19.809C23.9866 19.6313 24.1577 19.4485 24.3213 19.261L19.8851 14.8435ZM26.8811 10.0941H17.9294V1.12317C17.2985 1.01255 16.6535 0.956299 16 0.956299C15.3625 0.956299 14.7335 1.01021 14.1175 1.11521V10.0941H5.11896C5.01114 10.7175 4.9563 11.3546 4.9563 12C4.9563 12.6455 5.01114 13.2825 5.11896 13.906H14.1175V22.8849C14.7335 22.9899 15.3625 23.0438 16 23.0438C16.6535 23.0438 17.2985 22.9876 17.9294 22.8769V13.906H26.8811C26.989 13.2825 27.0438 12.6455 27.0438 12C27.0438 11.3546 26.989 10.7175 26.8811 10.0941Z" fill="#D90028" />
                    <path opacity="0.13" d="M27.0438 12C27.0438 14.9499 25.8949 17.723 23.8089 19.809C21.723 21.8949 18.9499 23.0438 16 23.0438C13.7491 23.0438 11.6013 22.3749 9.78345 21.1313C11.6491 21.9436 13.7069 22.2305 15.7736 21.9446C18.738 21.5344 21.3649 19.9941 23.1709 17.6082C24.9766 15.2218 25.7453 12.2752 25.3352 9.31129C24.9761 6.72051 23.755 4.38754 21.8599 2.63489C22.5578 3.07317 23.2117 3.59395 23.8089 4.19114C25.8949 6.27708 27.0438 9.0502 27.0438 12Z" fill="#160204" />
                    <path opacity="0.25" d="M21.2496 2.27817C19.2832 1.71099 17.1925 1.6838 15.1624 2.22052C12.2032 3.00333 9.7263 4.89146 8.18692 7.53708C6.64802 10.1832 6.2313 13.2699 7.01411 16.2291C7.49177 18.0357 8.38145 19.6622 9.60442 21.0061C9.10567 20.6508 8.63317 20.251 8.19114 19.809C6.10521 17.723 4.9563 14.9499 4.9563 12C4.9563 9.05021 6.10521 6.27708 8.19114 4.19114C10.2771 2.10521 13.0502 0.956299 16 0.956299C17.8633 0.956299 19.6558 1.41474 21.2496 2.27817Z" fill="white" />
                  </g>
                  <defs>
                    <filter id="filter0_d_4050_7238" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="2" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4050_7238" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4050_7238" result="shape" />
                    </filter>
                    <clipPath id="clip0_4050_7238">
                      <rect width="24" height="24" fill="white" transform="translate(4)" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              {" "}
              <span className="col-8">
                <span className="row">
                  <span className="col-12 multi-lang-text-en" data-i18n="minigameSetting.languageSettingen">{t("minigameSetting.languageSettingen", "อังกฤษ")}</span>
                  {" "}
                  <span className={`col-12 multi-setting-en multi-lang-status-${langSet.en ? "t" : "f"} p3`}>
    <LangStatus set={langSet.en} />
    </span>
                </span>
              </span>
            </span>
          </button>
          {" "}
          <button className="btn multi-lang-button btn-lang-tl" lang-select-btn="tl" onClick={() => dom.selectMultiLanguage("tl")}>
            <span className="row">
              <span className="col-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_4050_7344)">
                    <path d="M23.0436 12.0001C23.0436 14.9499 21.8949 17.7232 19.809 19.809C17.7232 21.8949 14.9499 23.0436 12.0001 23.0436C9.05022 23.0436 6.27695 21.8949 4.19111 19.809C2.10526 17.7232 0.956543 14.9499 0.956543 12.0001C0.956543 9.05022 2.10526 6.27695 4.19111 4.19111C6.27695 2.10526 9.05022 0.956543 12.0001 0.956543C14.9499 0.956543 17.7232 2.10526 19.809 4.19111C21.8949 6.27695 23.0436 9.05022 23.0436 12.0001Z" fill="#EFEFEF" />
                    <path d="M23.0438 12C23.0438 14.9499 21.8949 17.723 19.8089 19.809C17.723 21.8949 14.9499 23.0438 12 23.0438C9.05017 23.0438 6.27704 21.8949 4.1911 19.809C4.11892 19.7368 4.04813 19.6641 3.97876 19.5905L12.5405 12L3.97876 4.40958C4.04813 4.33599 4.11892 4.26333 4.1911 4.19114C6.27704 2.10521 9.05017 0.956299 12 0.956299C14.9499 0.956299 17.723 2.10521 19.8089 4.19114C21.8949 6.27708 23.0438 9.05021 23.0438 12Z" fill="#D80027" />
                    <path d="M23.0438 12H12.5405L3.97876 4.40958C4.04813 4.33599 4.11892 4.26333 4.1911 4.19114C6.27704 2.10521 9.05017 0.956299 12 0.956299C14.9499 0.956299 17.723 2.10521 19.8089 4.19114C21.8949 6.27708 23.0438 9.05021 23.0438 12Z" fill="#0052B4" />
                    <path opacity="0.13" d="M23.0438 12C23.0438 14.9499 21.8949 17.723 19.8089 19.809C17.723 21.8949 14.9499 23.0438 12 23.0438C9.74907 23.0438 7.60126 22.3749 5.78345 21.1313C7.64907 21.9436 9.70688 22.2305 11.7736 21.9446C14.738 21.5344 17.3649 19.9941 19.1709 17.6082C20.9766 15.2218 21.7453 12.2752 21.3352 9.31129C20.9761 6.72051 19.755 4.38754 17.8599 2.63489C18.5578 3.07317 19.2117 3.59395 19.8089 4.19114C21.8949 6.27708 23.0438 9.0502 23.0438 12Z" fill="#160204" />
                    <path opacity="0.25" d="M17.2496 2.27817C15.2832 1.71099 13.1925 1.6838 11.1624 2.22052C8.20317 3.00333 5.7263 4.89146 4.18692 7.53708C2.64802 10.1832 2.2313 13.2699 3.01411 16.2291C3.49177 18.0357 4.38145 19.6622 5.60442 21.0061C5.10567 20.6508 4.63317 20.251 4.19114 19.809C2.10521 17.723 0.956299 14.9499 0.956299 12C0.956299 9.05021 2.10521 6.27708 4.19114 4.19114C6.27708 2.10521 9.05021 0.956299 12 0.956299C13.8633 0.956299 15.6558 1.41474 17.2496 2.27817Z" fill="white" />
                    <path d="M8.21568 12C8.21568 13.2182 7.22488 14.2093 6.00702 14.2093C4.78921 14.2093 3.79846 13.2182 3.79846 12C3.79846 10.7818 4.78921 9.79077 6.00702 9.79077C7.22488 9.79077 8.21568 10.7818 8.21568 12Z" fill="#FFDA44" />
                  </g>
                  <defs>
                    <clipPath id="clip0_4050_7344">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              {" "}
              <span className="col-8">
                <span className="row">
                  <span className="col-12 multi-lang-text-tl" data-i18n="minigameSetting.languageSettingtl">{t("minigameSetting.languageSettingtl", "ตากาล๊อก")}</span>
                  {" "}
                  <span className={`col-12 multi-setting-tl multi-lang-status-${langSet.tl ? "t" : "f"} p3`}>
    <LangStatus set={langSet.tl} />
    </span>
                </span>
              </span>
            </span>
          </button>
        </div>
      </div>
      <div className="main-in-detail-body content-col-2">
        <div className="body-content-left max-w-368">
          <div className="custom-input mb-3">
            <div className="d-flex align-items-center justify-content-between minigame-name-label">
              <label className="form-label">
                <span className="textLabelName" data-i18n="minigameSetting.luckyWheelNameTxt">{t("minigameSetting.luckyWheelNameTxt", "ชื่อวงล้อนำโชค")}</span>
                {" "}
                <span className="text-red-50">*</span>
              </label>
            </div>
            <input type="text" className="form-control input-promotion-name-th" id="minigameName" placeholder={namePlaceholder} data-name-lang="th" data-step-now="1" defaultValue={initial?.name} onInput={(e) => onNameInput(e.currentTarget.value)} onKeyUp={checkMultiSetting} />
            <div className="d-flex align-items-center justify-content-between minigame-name-label-en display-none">
              <label className="form-label">
                <span className="textLabelName" data-i18n="minigameSetting.luckyWheelNameTxt">{t("minigameSetting.luckyWheelNameTxt", "ชื่อวงล้อนำโชค")}</span>
              </label>
            </div>
            <input type="text" className="form-control display-none input-promotion-name-en" id="minigameName-en" data-i18n="minigameSetting.[placeholder]phLuckyWheelNameInput" data-name-lang="en" data-step-now="1" onKeyUp={() => checkMultiSetting()} />
            <div className="d-flex align-items-center justify-content-between minigame-name-label-tl display-none">
              <label className="form-label">
                <span className="textLabelName" data-i18n="minigameSetting.luckyWheelNameTxt">{t("minigameSetting.luckyWheelNameTxt", "ชื่อวงล้อนำโชค")}</span>
              </label>
            </div>
            <input type="text" className="form-control display-none input-promotion-name-tl" id="minigameName-tl" data-i18n="minigameSetting.[placeholder]phLuckyWheelNameInput" data-name-lang="tl" data-step-now="1" onKeyUp={() => checkMultiSetting()} />
            <div className="text-start invalid-feedback invalid-feedback-minigame-name" />
          </div>
          <div className="custom-input">
            <div className="d-flex align-items-center justify-content-between">
              <label className="form-label" data-i18n="minigameSetting.promotionCondition">{t("minigameSetting.promotionCondition", "เงื่อนไขโปรโมชั่น")}</label>
            </div>
          </div>
          <div className="textarea-condition-th">
            <RichTextEditor id="minigameConditionHtml" className="input-promotion-condition-th" defaultValue={initial?.detail.conditionTh} onChange={(html) => setCondition("th", html)} />
          </div>
          <div className="textarea-condition-en" style={{ display: "none" }}>
            <RichTextEditor id="minigameConditionHtml-en" className="display-none input-promotion-condition-en" dataAttributes={{ "data-condition-lang": "en" }} onChange={(html) => setCondition("en", html)} />
          </div>
          <div className="textarea-condition-tl" style={{ display: "none" }}>
            <RichTextEditor id="minigameConditionHtml-tl" className="display-none input-promotion-condition-tl" dataAttributes={{ "data-condition-lang": "tl" }} onChange={(html) => setCondition("tl", html)} />
          </div>
        </div>
        <div className="body-content-right" style={{ maxWidth: "390px" }}>
          <div className="custom-input mb-3">
            <div className="d-flex align-items-center justify-content-between">
              <label className="form-label">
                <span data-i18n="minigameSetting.chooseAgent">{t("minigameSetting.chooseAgent", "เลือก Agent")}</span>
                {" "}
                <span className="text-red-50">*</span>
              </label>
            </div>
            <div className="custom-input custom-float pb-2">
              <CustomDropdown
      id="customSelectAgentDropdown"
      className="custom-input dropdown-wrapper require"
      fakeClassName="multiple"
      placeholder="เลือก Agent"
      search
      auto
      stretch
      offsetY={72}
      offsetMargin={72}
      items={agentItems}
      value={agent}
      invalid={agentTouched && !agent}
      onChange={handleAgentChange}
    >
    <div className="invalid-feedback" id="error-selectAgentDropdown" data-i18n="minigameSetting.plsChooseAgent" style={{ display: "none" }}>{t("minigameSetting.plsChooseAgent", "กรุณาเลือก Agent")}</div>
    </CustomDropdown>
            </div>
            <div className="text-start invalid-feedback invalid-feedback-minigame-name" />
          </div>
          <div className="col-12">
            <div className="d-flex align-items-center gap-4">
              <label className="" htmlFor="fileImageIconImage">
                <div className="box-icon-upload-bg img-mock-image-icon">
                  <img className="box-icon-upload-default showImagePreviewImageIcon" src={iconUrl} />
                  {" "}
                  <img className="box-icon-upload-small" src="/assets/images/icon-upload-small.png" />
                </div>
                <img className="img-upload-image-icon-show" style={{ display: "none" }} />
                {" "}
                <input type="hidden" id="imageIconUrl" value={iconUrl} readOnly />
              </label>
              {" "}
              <input type="file" id="fileImageIconImage" style={{ display: "none" }} onChange={onIconChange} />
              <div className="d-flex flex-column align-items-start gap-1">
                <span className="p2 fw-700 text-start" data-i18n="minigameSetting.imageIcon" style={{ color: "rgb(80, 161, 152)" }}>{t("minigameSetting.imageIcon", "อัพโหลดรูป ICON หน้าเล่น")}</span>
                {" "}
                <small className="p3 text-start" data-i18n="minigameSetting.imageUploadText" style={{ color: "rgb(130, 130, 130)" }}>{t("minigameSetting.imageUploadText", "คำแนะนำ : ขนาดรูป 76 px x 65 px<br />สกุล png,gif,jpg")}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="group-btn-minigame-setting" id="groupBtnSettingMinigame1">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <button data-i18n="minigameSetting.summarizeAndSave" id="buttonNextPromotionStepfinal1" className="btn btn-outline-warning disabled" data-type="next" style={nav.summaryButtonStyle} onClick={() => nav.toSummary("1")}>{t("minigameSetting.summarizeAndSave", "ไปหน้าสรุป")}</button>
          </div>
          <div>
            <button data-i18n="minigameSetting.back" className="btn system-btn btn-outline btn-rounded" data-type="previous" disabled style={{ width: "168px" }} >{t("minigameSetting.back", "ขั้นตอนก่อนหน้า")}</button>
            {" "}
            <button data-i18n="minigameSetting.next" className="btn system-btn btn-rounded ms-2 disabled" data-type="next" style={{ width: "168px" }} onClick={() => nav.go("1", "2-1")}>{t("minigameSetting.next", "ถัดไป")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
