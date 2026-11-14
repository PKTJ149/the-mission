"use client";

import { useState } from "react";
import { cx, MINIGAME_EDITOR_CONFIG, Offcanvas, OffcanvasCloseIcon, RichTextEditor, ToggleSwitch, useOffcanvas } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { saveRedeemConditions, type RedeemConditions, type RedeemLang } from "@/lib/api/mission-reports";
import { EnglishFlagIcon, TagalogFlagIcon } from "./redeem-icons";

// The redeem page's editor config was not captured: the mini-game one minus its
// "ระบุเงื่อนไขมินิเกมส์" placeholder (same build, same toolbar in the screenshot).
const REDEEM_EDITOR_CONFIG = { removePlugins: MINIGAME_EDITOR_CONFIG.removePlugins, style: MINIGAME_EDITOR_CONFIG.style };

// Inline width of the two footer buttons (not captured; 168px is what every other offcanvas footer uses
// and matches the screenshot)
const FOOTER_BUTTON_STYLE = { width: "168px" };

// CKEditor gives "<p>&nbsp;</p>"-style HTML when empty
const hasContent = (html: string) => html.replace(/<p>(&nbsp;|\s|<br[^>]*>)*<\/p>/g, "").trim().length > 0;

type RedeemConditionsOffcanvasProps = {
  control: ReturnType<typeof useOffcanvas>;
  initial: RedeemConditions;
  onSaved: () => void; // feedback popup
};

// #offcanvasRedeemConditions — "เงื่อนไขการแลกของรางวัล" (captured open in
// modals/redeem-conditions_offcanvasRedeemConditions_open.html). Saves only to memory.
export function RedeemConditionsOffcanvas({ control, initial, onSaved }: RedeemConditionsOffcanvasProps) {
  const t = useT();
  const [enabled, setEnabled] = useState(initial.enabled);
  const [lang, setLang] = useState<RedeemLang>("th");
  const [html, setHtml] = useState({ th: initial.th, en: initial.en, tl: initial.tl });
  const [configured, setConfigured] = useState(initial.configured);
  // Re-mounts the editors on cancel so they show the saved text again
  const [editorKey, setEditorKey] = useState(0);
  const [saved, setSaved] = useState(initial);

  const edit = (code: RedeemLang, value: string) => {
    setHtml((current) => ({ ...current, [code]: value }));
    setConfigured((current) => ({ ...current, [code]: hasContent(value) }));
  };

  // cancelRedeemCondition(): close and drop unsaved changes (the reset itself is a guess)
  const cancel = () => {
    control.hide();
    setEnabled(saved.enabled);
    setHtml({ th: saved.th, en: saved.en, tl: saved.tl });
    setConfigured(saved.configured);
    setLang("th");
    setEditorKey((key) => key + 1);
  };

  // recordRedeemCondition()
  const record = async () => {
    const next: RedeemConditions = { enabled, ...html, configured };
    await saveRedeemConditions(next);
    setSaved(next);
    control.hide();
    onSaved();
  };

  const status = (code: RedeemLang, className: string) =>
    configured[code] ? (
      <span className={cx(className, "multi-lang-status-t mission-page")}>{t("missionPointsPage.set", "(ตั้งค่าแล้ว)")}</span>
    ) : (
      <span className={cx(className, "multi-lang-status-f mission-page")}>{t("missionPointsPage.notSet", "(ยังไม่กำหนด)")}</span>
    );

  return (
    <Offcanvas control={control} id="offcanvasRedeemConditions" className="offcanvas-minigame-custom offcanvas offcanvas-end" data-bs-focus="false">
      <div className="offcanvas-header offcanvas-header-minigame">
        <h4 className="mb-0 mission-page">{t("missionPointsPage.exchangeCondition", "เงื่อนไขการแลกของรางวัล")}</h4>
        <div className="flex-fill"></div>
        <div className="icon-close-offcanvas-minigame-custom" onClick={cancel}>
          <OffcanvasCloseIcon />
        </div>
      </div>
      <div className="offcanvas-body">
        <div className="redeem-point-condition-card">
          <div className="redeem-point-condition-head">
            <p className="p1 fw-700 mb-0 mission-page">{t("missionPointsPage.exchangeConditionSetting", "กำหนดเงื่อนไขการแลกของรางวัล")}</p>
            <div className="flex-fill"></div>
            <ToggleSwitch
              variant="mission"
              wrapperClassName="mission-switch-btn me-2"
              id="enablePointExchange"
              checked={enabled}
              onChange={setEnabled}
            />
            <p className="p1 fw-700 mb-0 mission-page">{t("missionPointsPage.activeDeactiveSet", "เปิด / ปิด การใช้งาน")}</p>
          </div>
          <div className="redeem-point-condition-body">
            <div className="row gx-4">
              <div className="col-6">
                <p className="p1 fw-700 mb-2 mission-page">{t("missionPointsPage.langaugeSetting", "กำหนดรายละเอียดแต่ละภาษา")}</p>
                <p className="p3 text-tertiary mb-10">
                  <span className="mission-page">{t("missionPointsPage.langaugeSettingText1", "เมื่อกำหนดรายละเอียดให้ภาษาใดแล้ว")}</span>
                  <br />
                  <span className="mission-page">
                    {t("missionPointsPage.langaugeSettingText2", "ภาษานั้นจะสามารถเลือกให้เแสดงที่หน้าเล่นของสมาชิกได้")}
                  </span>
                </p>
                <div className="multi-language-button-div">
                  <button
                    className={cx("btn multi-lang-button btn-lang-th", lang === "th" && "multi-lang-selected")}
                    lang-select-btn="th"
                    onClick={() => setLang("th")}
                  >
                    <span className="row">
                      <span className="col-12">
                        <span className="mission-page">{t("missionPointsPage.langaugeDefault", "ค่าเริ่มต้น (ไทย)")}</span>
                      </span>
                      <span className="col-12">{status("th", "p3 multi-setting-th")}</span>
                    </span>
                  </button>
                  <button
                    className={cx("btn multi-lang-button btn-lang-en", lang === "en" && "multi-lang-selected")}
                    lang-select-btn="en"
                    onClick={() => setLang("en")}
                  >
                    <span className="row">
                      <span className="col-4">
                        <EnglishFlagIcon />
                      </span>
                      <span className="col-8">
                        <span className="row">
                          <span className="col-12">EN;</span>
                          {status("en", "col-12 multi-setting-en p3")}
                        </span>
                      </span>
                    </span>
                  </button>
                  <button
                    className={cx("btn multi-lang-button btn-lang-tl", lang === "tl" && "multi-lang-selected")}
                    lang-select-btn="tl"
                    onClick={() => setLang("tl")}
                  >
                    <span className="row">
                      <span className="col-4">
                        <TagalogFlagIcon />
                      </span>
                      <span className="col-8">
                        <span className="row">
                          <span className="col-12">TL;</span>
                          {status("tl", "col-12 multi-setting-tl p3")}
                        </span>
                      </span>
                    </span>
                  </button>
                </div>
              </div>
              <div className="col-6">
                <div className="redeem-point-condition-editor group-input-thin">
                  <p className="p2 mb-0 mission-page">{t("missionPointsPage.rewardCondition", "เงื่อนไขการแลกรางวัล")}</p>
                  <div className="input-thin" key={editorKey}>
                    {(["th", "en", "tl"] as const).map((code) => (
                      <div key={code} className={cx(`textarea-condition-${code}`, lang !== code && "d-none")}>
                        <RichTextEditor
                          id={code === "th" ? "redeemCondition" : `redeemCondition-${code}`}
                          className={`redeem-editor input-promotion-condition-${code}`}
                          dataAttributes={{ "data-condition-lang": code }}
                          config={REDEEM_EDITOR_CONFIG}
                          defaultValue={html[code]}
                          onChange={(value) => edit(code, value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-end">
          <button className="btn system-btn btn-a btn-rounded" style={FOOTER_BUTTON_STYLE} onClick={cancel}>
            {t("missionPointsPage.cancel", "ยกเลิก")}
          </button>
          <button id="buttonRecordRedeemCondition" className="btn system-btn btn-rounded ms-2" style={FOOTER_BUTTON_STYLE} onClick={record}>
            {t("missionPointsPage.save", "บันทึก")}
          </button>
        </div>
      </div>
    </Offcanvas>
  );
}
