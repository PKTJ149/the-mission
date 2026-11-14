"use client";
/* eslint-disable @next/next/no-img-element -- original markup: plain <img> */

import { useState } from "react";
import { SystemPopup, type useSystemPopup } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { GameCategory, GameProvider } from "@/lib/api/missions";

type GameTypePopupProps = {
  control: ReturnType<typeof useSystemPopup>;
  providers: GameProvider[];
  selected: string[]; // "<category>-<lsmGameId>" of the condition that opened the popup
  session: number; // increases every time the popup is opened
  onSave: (selected: string[]) => void;
};

// Menu buttons: id suffix, category key, icon number, i18n key, label
const MENU: { id: string; category: GameCategory; icon: number; alt: string; i18nKey: string; label: string }[] = [
  { id: "sport", category: "sport", icon: 1, alt: "sport", i18nKey: "sport", label: "กีฬา" },
  { id: "game", category: "game", icon: 2, alt: "games", i18nKey: "games", label: "เกมส์" },
  { id: "casino", category: "casino", icon: 3, alt: "casino", i18nKey: "casino", label: "คาสิโน" },
  { id: "lottery", category: "lotto", icon: 4, alt: "lotto", i18nKey: "lotto", label: "หวย" },
];

// #popup-game-type — "กำหนดประเภทเกมหรือค่ายเกมในการทำเทิร์นโอเวอร์", opened by chooseGameType(this)
// from a sub-mission condition "ทำเทิร์นโอเวอร์" with "กำหนดเฉพาะเกม" ticked.
export function GameTypePopup({ control, providers, selected, session, onSave }: GameTypePopupProps) {
  const t = useT();
  const [category, setCategory] = useState<string>("sport");
  const [checked, setChecked] = useState<string[]>(selected);
  const [seenSession, setSeenSession] = useState(session);

  // Each time the popup opens, start again from the selection of the condition that opened it
  if (seenSession !== session) {
    setSeenSession(session);
    setChecked(selected);
  }

  const keyOf = (provider: GameProvider) => `${provider.category}-${provider.lsmGameId}`;
  // "ค่ายเกมส์ทั้งหมด 61 ค่าย" counts providers once even when listed in two categories
  const uniqueCount = (list: string[]) => new Set(list.map((key) => key.split("-")[1])).size;
  const total = uniqueCount(providers.map(keyOf));

  const toggle = (key: string) => setChecked((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]));
  const toggleAll = (group: GameProvider[], on: boolean) => {
    const keys = group.map(keyOf);
    setChecked((list) => (on ? [...new Set([...list, ...keys])] : list.filter((k) => !keys.includes(k))));
  };

  return (
    <SystemPopup control={control} id="popup-game-type" className="choose-game-type">
      <div className="system-popup-content">
        <div className="system-popup-content-header">
          <h4 className="mission-page" data-i18n="missionPage.missionTurnOverCondition">
            {t("missionPage.missionTurnOverCondition", "กำหนดประเภทเกมหรือค่ายเกมในการทำเทิร์นโอเวอร์")}
          </h4>
        </div>
        <div className="system-popup-content-inner">
          <div className="box-main-type-game">
            <div className="box-main-type-game-item">
              <div className="box-main-type-game-item-menu">
                <div className="menu-header">
                  <span className="text-p2-bold mission-page" data-i18n="missionPage.missionGameCategory">
                    {t("missionPage.missionGameCategory", "ประเภทเกมส์")}
                  </span>
                </div>
                <div className="menu-body">
                  <span className="text-p2-bold mission-page" data-i18n="missionPage.missionGameCategoryChoose">
                    {t("missionPage.missionGameCategoryChoose", "เลือกประเภทเกมส์")}
                  </span>
                  {/* ORIGINAL: no "active" class is added to the chosen button */}
                  {MENU.map((item) => (
                    <button key={item.id} className="btn-mission-type-game" id={`btnGameType-${item.id}`} onClick={() => setCategory(item.id)}>
                      <img src={`/assets/images/mission/icon-game-type-${item.icon}.png`} alt={item.alt} width="20" height="20" />
                      <span className="text-p2-regular mission-page" data-i18n={`missionPage.${item.i18nKey}`}>
                        {t(`missionPage.${item.i18nKey}`, item.label)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="box-main-type-game-item-provider">
                <div className="provider-header">
                  <span className="text-p2-bold mission-page" data-i18n="missionPage.missionGameProvider">
                    {t("missionPage.missionGameProvider", "ค่ายเกมส์")}
                  </span>
                </div>
                <div className="provider-body">
                  <div className="group-provider-header">
                    <span className="text-p2-bold mission-page" data-i18n="missionPage.missionGameProviderChoose">
                      {t("missionPage.missionGameProviderChoose", "เลือกค่ายเกมที่ต้องการ")}
                    </span>
                    <span className="text-p2-regular">
                      <span className="mission-page" data-i18n="missionPage.missionAllGameProvider">
                        {t("missionPage.missionAllGameProvider", "ค่ายเกมส์ทั้งหมด")}
                      </span>{" "}
                      <span id="all-game-provider-count">{total}</span>{" "}
                      <span className="mission-page" data-i18n="missionPage.provider">
                        {t("missionPage.provider", "ค่าย")}
                      </span>
                    </span>
                  </div>
                  {MENU.map((item) => {
                    const group = providers.filter((p) => p.category === item.category);
                    const allOn = group.length > 0 && group.every((p) => checked.includes(keyOf(p)));
                    return (
                      <div
                        key={item.id}
                        className={`group-provider-body${category === item.id ? "" : " d-none"}`}
                        data-game-type={item.id}
                        id={`all-game-type-${item.id}`}
                      >
                        <div className="group-provider-item">
                          <div className="group-checkbox">
                            <input
                              type="checkbox"
                              className="form-check-input form-check-input-custom-mini-game game-provider-checker-input mt-0"
                              id={`game-provider-checkbox-${item.id}-all`}
                              name="game-provider-checkbox-all"
                              data-game-type-checkbox={item.category}
                              value="all"
                              checked={allOn}
                              onChange={(event) => toggleAll(group, event.target.checked)}
                            />
                            <label htmlFor={`game-provider-checkbox-${item.id}-all`} className="label-checkbox">
                              Select All
                            </label>
                          </div>
                        </div>
                        {/* Two empty divs follow "Select All" in the sport and game groups of the capture */}
                        {(item.id === "sport" || item.id === "game") && (
                          <>
                            <div></div>
                            <div></div>
                          </>
                        )}
                        {group.map((provider) => {
                          const id = `game-provider-checkbox-${item.id}-${provider.lsmGameId}`;
                          return (
                            <div key={id} className="group-provider-item">
                              <div className="group-checkbox">
                                <input
                                  type="checkbox"
                                  className="form-check-input form-check-input-custom-mini-game game-provider-checker-input mt-0"
                                  name="game-provider-checkbox"
                                  value={provider.lsmGameId}
                                  id={id}
                                  data-game-type-checkbox={item.category}
                                  data-payload={JSON.stringify(provider)}
                                  checked={checked.includes(keyOf(provider))}
                                  onChange={() => toggle(keyOf(provider))}
                                />
                                <label htmlFor={id} className="label-checkbox">
                                  {provider.name}
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="box-main-type-game-footer">
              <span className="text-p2-bold mission-page" data-i18n="missionPage.missionTurnOverCondition">
                {t("missionPage.missionTurnOverCondition", "กำหนดประเภทเกมหรือค่ายเกมในการทำเทิร์นโอเวอร์")}
              </span>
              <span className="text-p2-bold value-provider">
                <span id="all-game-provider-count-selected">{checked.length > 0 ? uniqueCount(checked) : "-"}</span>{" "}
                <span className="mission-page" data-i18n="missionPage.missionGameProvider">
                  {t("missionPage.missionGameProvider", "ค่ายเกมส์")}
                </span>
              </span>
            </div>
          </div>
          <div className="system-popup-btns confirm">
            <button className="mission-btn-outline system-popup-btn-cancel mission-page" data-i18n="missionPage.missionCancelButton" onClick={control.close}>
              {t("missionPage.missionCancelButton", "ยกเลิก")}
            </button>
            <button
              className="mission-btn system-popup-btn-confirm mission-page"
              data-i18n="missionPage.missionConfirmShortButton"
              onClick={() => {
                onSave(checked);
                control.close();
              }}
            >
              {t("missionPage.missionConfirmShortButton", "ยืนยัน")}
            </button>
          </div>
        </div>
      </div>
    </SystemPopup>
  );
}
