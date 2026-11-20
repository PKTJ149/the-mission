"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

// Step 4 "กำหนดรูปแบบการแสดงผลมินิเกมส์":
//   4a mini-game display layout (mini-game only)   – create-mini-game-other_step4a_display-layout.html
//   4b wheel config + per-slice rewards             – create-lucky-wheel_step4b_wheel-config-8-slices.html
//                                                     (+ create-mini-game-other_step4b_reward-choice-1.html)
//   4c theme colours                                – create-lucky-wheel_step4c_theme-colours.html

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ColorPicker, CustomDropdown, type DropdownItem } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { getMiniGames, type MiniGameSlice, type MiniGameSliceBonus, type MiniGameType } from "@/lib/api/mini-games";
import * as dom from "./wizard-dom";
import { TypeText } from "./wizard-texts";
import { shownWhen, type StepProps } from "./wizard-types";

// showLabalLuckywheelImagePixel(count)
const IMAGE_HINT: Record<number, string> = {
  6: "ขนากรูป 220px x 220px สกุลไฟล์ .png. .jpg ",
  8: "ขนากรูป 150px x 196px สกุลไฟล์ .png. .jpg",
  10: "ขนากรูป 132px x 218px สกุลไฟล์ .png. .jpg",
};

const wheelUrl = (count: number) => `${dom.LEGACY_ASSET_BASE}/images/minigame/wheel-${count}/`;

// changeWheel(number): the preview wheel (#wheelShow1) and the test-spin wheel (#wheelShowTest)
export function WheelShow({ id, count, test }: { id: string; count: number; test?: boolean }) {
  const url = wheelUrl(count);
  return (
    <div className="wheel-wrapper" id={id}>
      <div className={test ? `custom-wheel wheel-${count} test-spin` : `custom-wheel wheel-${count}`} data-deg="0">
        <div className="wheel-item-all">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="wheel-item" style={{ "--item": String(i + 1) } as CSSProperties}>
              <div className="wheel-image">
                <img draggable="false" src={`${url}pie-${i + 1}.png`} className={`luckywheelWheel${i + 1}Src`} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="wheel-spin" onClick={test ? dom.spinWheel : undefined}>
        <img draggable="false" src={`${url}button.png`} className="luckywheelSpinBtnSrc" />
      </div>
      <div className="wheel-frame">
        <img draggable="false" src={`${url}frame.png`} className="luckywheelFrameSrc" />
      </div>
    </div>
  );
}

// The "Wheel N" upload labels around the preview (#wheelInputShow1)
function WheelInputs({ count }: { count: number }) {
  return (
    <div className="wheel-wrapper-out" id="wheelInputShow1">
      <div className={`custom-wheel-out wheel-${count}`}>
        {Array.from({ length: count }, (_, i) => {
          const n = i + 1;
          const pos = n === count / 2 || n === count ? " top-bottom" : "";
          return (
            <div key={i} className="wheel-item-out" style={{ "--item": String(n) } as CSSProperties}>
              <div className="wheel-image">
                <div className={`btn-text${pos}`} style={{ "--item": String(n) } as CSSProperties} onClick={() => dom.clickById(`luckywheelWheel${n}`)}>
                  <img src="/assets/images/minigame/add-img.png" width="16" height="16" />{" "}
                  <span>Wheel {n}</span>
                </div>
                <input id={`luckywheelWheel${n}`} type="file" className="d-none" data-error={`โปรดอัพโหลดรูป Wheel ${n}`} onChange={(e) => dom.handleUploadBlob(e)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type BonusRow = { key: number; type: MiniGameSliceBonus["type"] | null; credit?: string; percent?: string; maxCredit?: string; quota?: string; game?: string | null };
let nextBonusKey = 1;

// One "Wheel N" / "ตั้งค่ารางวัลตัวเลือกที่ N" section (#minigameWheelMain-N, addtemplateMinigameWheel)
function SliceSection({ n, type, slice, gameItems }: { n: number; type: MiniGameType; slice: MiniGameSlice | undefined; gameItems: DropdownItem[] }) {
  const t = useT();
  const [bonuses, setBonuses] = useState<BonusRow[]>(() =>
    slice?.bonuses.length ? slice.bonuses.map((b) => ({ key: nextBonusKey++, type: b.type, credit: b.credit, percent: b.percent, maxCredit: b.maxCredit, quota: b.quota, game: b.gameId ?? null })) : [{ key: nextBonusKey++, type: null }],
  );
  const bonusTypeItems: DropdownItem[] = [
    { value: "credit_fix", chip: "credit_fix", label: t("minigameSetting.creditDropdown", "เครดิต Fixed Rate") },
    { value: "credit_percentage", chip: "credit_percentage", label: t("minigameSetting.percentageDropdown", "เครดิต เป็น %") },
    { value: "mini-game", chip: "mini-game", label: t("minigameSetting.miniGameDropdown", "สิทธิ์มินิเกมส์") },
  ];
  const fakeLabel = (item: DropdownItem) => item.label;
  const setBonusType = (key: number, value: string | null) => setBonuses((list) => list.map((b) => (b.key === key ? { ...b, type: value as BonusRow["type"] } : b)));
  const setBonusGame = (key: number, value: string | null) => setBonuses((list) => list.map((b) => (b.key === key ? { ...b, game: value } : b)));
  const addBonus = () => setBonuses((list) => [...list, { key: nextBonusKey++, type: null }]);
  const actions = { deleteBonus: (key: number) => setBonuses((list) => list.filter((b) => b.key !== key)) };

  return (
    <div id={`minigameWheelMain-${n}`} className="custom-minigame-wheel-section" data-minigame-wheel={n}>
      <div className="px-4">
        <div className="label-minigame-custom-v2">
          <span id={`minigameSequence-${n}`}>
    {type === "mini-game" ? (
    <>
    <span className="reward-set-list-config" data-i18n="minigameSetting.settingRewardNo">{t("minigameSetting.settingRewardNo", "ตั้งค่ารางวัลตัวเลือกที่")}</span>
    {` ${n}`}
    </>
    ) : (
    `Wheel ${n}`
    )}
    </span>
        </div>
      </div>
      <div className="input-col-1-p">
        <div className="p-4">
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <div className="custom-input custom-float fistempty" id={`inputMinigameRewardDescription-${n}`}>
                <div className="text-start p2 color-emerald-title-1 fw-700 mb-2">
                  <span className="reward-description-text" data-i18n="minigameSetting.rewardDescription">{t("minigameSetting.rewardDescription", "คำอธิบายรางวัล")}</span>
                  {" "}
                  <span className="text-red-50">{" * "}</span>
                </div>
                <div className="input-group">
                  <input id={`minigameRewardDescription-${n}`} defaultValue={slice?.description} type="text" className="form-control" placeholder="description" />
                </div>
                <div className="invalid-feedback error-reward-description-text" id={`error-minigameRewardDescription-${n}`} data-i18n="minigameSetting.rewardDescriptionErrorText" >{t("minigameSetting.rewardDescriptionErrorText", "กรุณากรอกคำอธิบายรางวัล")}</div>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <div className="custom-input custom-float fistempty" id={`inputMinigameLuckyWheelRewardPercentage-${n}`}>
                <div className="text-start p2 color-emerald-title-1 fw-700 mb-2 reward-chance-text" data-i18n="minigameSetting.rewardRate">{t("minigameSetting.rewardRate", "โอกาสออก")}</div>
                <div className="input-group">
                  <input id={`minigameLuckyWheelRewardPercentage-${n}`} defaultValue={slice?.percentage} type="number" className="form-control" placeholder="0" min="0" max="100"  onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} onKeyUp={(e) => dom.enforceMinMax(e.currentTarget)} />
                  {" "}
                  <span className="input-group-text custom-color" style={{ borderRadius: "0px 8px 8px 0px" }} >%</span>
                </div>
                <div className="invalid-feedback error-reward-chance-text" id={`error-minigameLuckyWheelRewardPercentage-${n}`} data-i18n="minigameSetting.rewardRateErrorText" >{t("minigameSetting.rewardRateErrorText", "กรุณากรอกโอกาสออก")}</div>
              </div>
            </div>
          </div>
          <div className="row my-3">
            <div className="col-12 col-md-6">
              <div className="text-start p2 color-emerald-title-1 fw-700 mb-2 bonus-rate-text" data-i18n="minigameSetting.fixBonusRateHeader">{t("minigameSetting.fixBonusRateHeader", "การจำกัดจำนวนครั้งในการแจกโบนัส")}</div>
              <div className="row ms-0">
                <div className="form-check col d-flex align-items-center">
                  <input className="form-check-input me-2" type="radio" name={`minigameLimitAmountBonus-${n}`} id={`minigameNoLimitAmountBonus-${n}`} data-value={JSON.stringify([`inputMinigameLimitAmount-${n}`, `minigameIsAlert-${n}`])} data-disable={`minigameIsAlertOff-${n}`} defaultChecked value={`minigameNoLimitAmountBonus-${n}`} onChange={(e) => dom.getMinigameRadio(e.currentTarget, false)} />
                                <label className="form-check-label d-flex flex-column" htmlFor={`minigameNoLimitAmountBonus-${n}`}>
                    <div className="p2 color-emerald-title-1 bonus-rate-unlimited-text" data-i18n="minigameSetting.fixBonusRateUnlimit">{t("minigameSetting.fixBonusRateUnlimit", "ไม่จำกัดจำนวนแจก")}</div>
                  </label>
                </div>
                <div className="form-check col d-flex align-items-center">
                  <input className="form-check-input me-2" type="radio" name={`minigameLimitAmountBonus-${n}`} id={`minigameLimitAmountBonus-${n}`} data-value={JSON.stringify([`inputMinigameLimitAmount-${n}`, `minigameIsAlert-${n}`])} value={`minigameLimitAmountBonus-${n}`} onChange={(e) => dom.getMinigameRadio(e.currentTarget, true)} />
                  <label className="form-check-label d-flex flex-column" htmlFor={`minigameLimitAmountBonus-${n}`}>
                    <div className="p2 color-emerald-title-1 bonus-rate-limited-text" data-i18n="minigameSetting.fixBonusRatelimit">{t("minigameSetting.fixBonusRatelimit", "จำกัดจำนวนแจก")}</div>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <div className="text-start p2 color-emerald-title-1 fw-700 mb-2 bonus-notification-send" data-i18n="minigameSetting.rewardNotification">{t("minigameSetting.rewardNotification", "การแจ้งเตือนไปที่หน้ารวมมินิเกมส์เมื่อของรางวัลใกล้หมด")}</div>
              <div className="row ms-0 minigame-reset disabled fistempty" id={`minigameIsAlert-${n}`}>
                <div className="form-check col d-flex align-items-center">
                  <input className="form-check-input me-2" type="radio" name={`minigameIsAlert-${n}`} id={`minigameIsAlertOff-${n}`} data-value={JSON.stringify([`inputMinigameAlertAmount-${n}`])} value="minigameIsAlertOn" defaultChecked onChange={(e) => dom.getMinigameRadio(e.currentTarget, false)} />
                  <label className="form-check-label d-flex flex-column" htmlFor={`minigameIsAlertOff-${n}`}>
                    <div className="p2 color-emerald-title-1 bonus-no-notification" data-i18n="minigameSetting.rewardNoNotification">{t("minigameSetting.rewardNoNotification", "ไม่ต้องแจ้งเตือน")}</div>
                  </label>
                </div>
                <div className="form-check col d-flex align-items-center">
                  <input className="form-check-input me-2" type="radio" name={`minigameIsAlert-${n}`} id={`minigameIsAlertOn-${n}`} data-value={JSON.stringify([`inputMinigameAlertAmount-${n}`])} value="minigameIsAlertOn" onChange={(e) => dom.getMinigameRadio(e.currentTarget, true)} />
                  <label className="form-check-label d-flex flex-column" htmlFor={`minigameIsAlertOn-${n}`}>
                    <div className="p2 color-emerald-title-1 bonus-notification" data-i18n="minigameSetting.rewardWithNotification">{t("minigameSetting.rewardWithNotification", "แจ้งเตือน")}</div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="row my-3">
            <div className="col-12 col-md-6">
              <div className="custom-input custom-input-disabled custom-float minigame-reset fistempty disabled" id={`inputMinigameLimitAmount-${n}`}>
                <div className="text-start p2 color-emerald-title-1 fw-700 mb-2 bonus-setting-given-text" data-i18n="minigameSetting.rewardSettingNoMoreThan">{t("minigameSetting.rewardSettingNoMoreThan", "จำกัดจำนวนการแจกไม่เกิน x ครั้ง")}</div>
                <div className="input-group">
                  <input id={`minigameLimitAmount-${n}`} type="text" className="form-control validatezero" placeholder="0" data-group={`minigameLimit-${n}`} onInput={(e) => dom.setMaxValueInputAlert(e.currentTarget)} onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                  <span className="input-group-text custom-color text-count" data-i18n="minigameSetting.count" style={{ borderRadius: "0px 8px 8px 0px" }} >{t("minigameSetting.count", "ครั้ง")}</span>
                </div>
                <div className="invalid-feedback error-bonus-setting-given-text" id={`error-minigameLimitAmount-${n}`} data-i18n="minigameSetting.rewardSettingNoMoreThanErrorText" >{t("minigameSetting.rewardSettingNoMoreThanErrorText", "กรุณากรอกจำนวนการแจกไม่เกิน")}</div>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-3" id={`inputminigameIsAlert-${n}`}>
              <div className="custom-input custom-input-disabled custom-float minigame-reset fistempty disabled" id={`inputMinigameAlertAmount-${n}`}>
                <div className="text-start p2 color-emerald-title-1 fw-700 mb-2 bonus-setting-given-when-text" data-i18n="minigameSetting.notiWhenRewardToX">{t("minigameSetting.notiWhenRewardToX", "แจ้งเตือนเมื่อแจกรางวัลไปแล้ว x ครั้ง")}</div>
                <div className="input-group">
                  <input id={`minigameAlertAmount-${n}`} type="text" className="form-control validatezero" placeholder="0" data-group={`minigameLimit-${n}`} onInput={(e) => dom.setMaxValueInputAlert(e.currentTarget)} onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                  <span className="input-group-text custom-color text-count" data-i18n="minigameSetting.count" style={{ borderRadius: "0px 8px 8px 0px" }} >{t("minigameSetting.count", "ครั้ง")}</span>
                </div>
                <div className="invalid-feedback error-bonus-setting-given-when-text" id={`error-minigameAlertAmount-${n}`} data-i18n="minigameSetting.notiWhenRewardToXErrorText" >{t("minigameSetting.notiWhenRewardToXErrorText", "กรุณากรอกจำนวนการแจกรางวัลไม่เกิน")}</div>
              </div>
            </div>
          </div>
          <div className="col-12" id={`customPromotionConditionTypeSection-${n}`}>
    {bonuses.map((bonus, i) => {
    const m = i + 1;
    return (
            <div key={bonus.key} className="row mb-0" id={`promotion-condition-type-${n}-${m}`} data-time-promotion-condition-type={m} {...{ [`data-time-promotion-condition-type-${n}`]: String(m) }}>
              <input type="hidden" name={`minigameBonuseAnyGameId-${n}-${m}`} id={`minigameBonuseAnyGameId-${n}-${m}`} />
              {" "}
              <input type="hidden" name={`minigameBonuseName-${n}-${m}`} id={`minigameBonuseName-${n}-${m}`} />
              {" "}
              <input type="hidden" name={`minigameBonuseType-${n}-${m}`} id={`minigameBonuseType-${n}-${m}`} />
              <div className="col-12 col-md-6 mb-3">
                <div className="custom-input custom-float">
                  <div className="text-start p2 fw-700 mb-2 mini-game-bonus-type" id={`promotionConditionTypeText-${n}-${m}`} data-i18n="minigameSetting.bonusType">{t("minigameSetting.bonusType", "ประเภทโบนัส")}</div>
                  <CustomDropdown className="custom-input dropdown-wrapper require customPromotionBonusTypeDropdown-template" fakeClassName="multiple" placeholder="เลือกประเภทโบนัส" auto stretch items={bonusTypeItems} value={bonus.type} fakeValue={fakeLabel} onChange={(value) => setBonusType(bonus.key, value)}>
    <div className="invalid-feedback error-mini-game-bonus-type" id="error-promotionDepositTypeDropdown" data-i18n="minigameSetting.chooseDepositMethod" >{t("minigameSetting.chooseDepositMethod", "กรุณาเลือกประเภทการฝาก")}</div>
    </CustomDropdown>
                </div>
              </div>
              {/* Staging shows this empty half-width column for "สิทธิ์มินิเกมส์", which pushes the mini-game dropdown to the next line */}
              <div className={bonus.type === "mini-game" ? "col-12 col-md-6" : "col-12 col-md-6 d-none"} id={`showBoxPromotionDepositBonusDropdownSub-${n}-${m}`} />
              <div className={bonus.type === "mini-game" ? "col-12 col-md-6 mb-3" : "col-12 col-md-6 mb-3 d-none"} id={`showBoxPromotionDepositBonusDropdown-${n}-${m}`}>
                <div className="custom-input custom-float">
                  {/* Added rows (cloned in the original) rename this id to the same one as the bonus-type label above */}
                  <div className="text-start p2 fw-700 mb-2 mini-game-bonus-type" id={m === 1 ? "promotionConditionTypeText-template" : `promotionConditionTypeText-${n}-${m}`}>มินิเกมส์</div>
                  <CustomDropdown id={`inputPromotionDepositBonusDropdown-${n}-${m}`} className="custom-input dropdown-wrapper require customPromotionDepositBonusDropdown" fakeClassName="multiple" placeholder="เลือกมินิเกมส์" search auto stretch dropdownClassName="boxPromotionDepositBonusDropdown" items={gameItems} value={bonus.game ?? null} onChange={(value) => setBonusGame(bonus.key, value)}>
    <div className="invalid-feedback error-mini-game-bonus-type" id={`error-promotionDepositBonusDropdown-${n}-${m}`} data-i18n="minigameSetting.minigameDropdownErrorText" >{t("minigameSetting.minigameDropdownErrorText", "กรุณาเลือกมินิเกมส์")}</div>
    </CustomDropdown>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3 mb-md-0" id={`showBoxPromotionBonusFixed-${n}-${m}`} style={shownWhen(bonus.type === "credit_fix")} >
                <div className="text-start p2 fw-700 mb-2 mini-game-bonus-type" data-i18n="minigameSetting.creditCount">{t("minigameSetting.creditCount", "จำนวนเงิน")}</div>
                <div className="custom-input custom-input-group has-prepend box-promotion-item-checkbox-radio fistempty" id={`inputCredit-${n}-${m}`}>
                  <input id={`credit-${n}-${m}`} defaultValue={bonus.credit} type="text" className="form-control" placeholder="0.00"  onKeyDown={(e) => dom.inputAcceptKey(e, "numberPositive")} />
                  <div className="text-prepend">บาท</div>
                  <div className={`cursor-pointer checkShowDeletePromotionConditionType-${n} deleteTemplatePromotionConditionType-${n}-${m} order-3 ps-3 m-auto`} style={shownWhen(bonuses.length > 1)} onClick={() => actions.deleteBonus(bonus.key)} >
                    <img src="/assets/images/icon-minus.png" width="20" height="20" />
                  </div>
                  <div className="invalid-feedback error-mini-game-bonus-type" id={`error-credit-${n}-${m}`} data-i18n="minigameSetting.creditCountErrorText" >{t("minigameSetting.creditCountErrorText", "กรุณากรอกจำนวนเงิน")}</div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3 mb-md-0" id={`showBoxPromotionBonusPercentage-${n}-${m}`} style={shownWhen(bonus.type === "credit_percentage")} >
                <div className="row">
                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <div className="p2 fw-700 mb-2 mini-game-bonus-type" data-i18n="minigameSetting.creditCountPercent">{t("minigameSetting.creditCountPercent", "% คิดจากยอดฝาก")}</div>
                    <div className="custom-input custom-input-group has-prepend box-promotion-item-checkbox-radio fistempty" id={`inputPercent-${n}-${m}`}>
                      <input id={`percent-${n}-${m}`} defaultValue={bonus.percent} type="text" className="form-control" placeholder="0"  onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                      <div className="text-prepend">%</div>
                      <div className="invalid-feedback" id={`error-percent-${n}-${m}`} data-i18n="minigameSetting.creditCountPercentErrorText" >{t("minigameSetting.creditCountPercentErrorText", "กรุณากรอกจำนวนเปอร์เซ็น")}</div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <div className="p2 fw-700 mb-2" data-i18n="minigameSetting.creditNotHigherThan">{t("minigameSetting.creditNotHigherThan", "สูงไม่เกิน")}</div>
                    <div className="custom-input custom-input-group has-prepend box-promotion-item-checkbox-radio fistempty" id={`inputPercentMax-${n}-${m}`}>
                      <input id={`percentMax-${n}-${m}`} defaultValue={bonus.maxCredit} type="text" className="form-control" placeholder="0"  onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                      <div className="text-prepend text-baht" data-i18n="minigameSetting.baht">{t("minigameSetting.baht", "บาท")}</div>
                      <div className={`cursor-pointer checkShowDeletePromotionConditionType-${n} deleteTemplatePromotionConditionType-${n}-${m} order-3 ps-3 m-auto`} style={shownWhen(bonuses.length > 1)} onClick={() => actions.deleteBonus(bonus.key)} >
                        <img src="/assets/images/icon-minus.png" width="20" height="20" />
                      </div>
                      <div className="invalid-feedback error-mini-game-bonus-type" id={`error-percentMax-${n}-${m}`} data-i18n="minigameSetting.creditNotHigherThanErrorText" >{t("minigameSetting.creditNotHigherThanErrorText", "กรุณากรอกจำนวนสูงไม่เกิน")}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3 mb-md-0" id={`showBoxPromotionBonusPoint-${n}-${m}`} style={shownWhen(bonus.type === "point")} >
                <div className="text-start p2 fw-700 mb-2 mini-game-bonus-type" data-i18n="minigameSetting.pointCount">{t("minigameSetting.pointCount", "จำนวนแต้ม")}</div>
                <div className="custom-input custom-input-group has-prepend box-promotion-item-checkbox-radio fistempty" id={`inputPoint-${n}-${m}`}>
                  <input id={`point-${n}-${m}`} type="text" className="form-control" placeholder="0"  onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                  <div className="text-prepend">แต้ม</div>
                  <div className={`cursor-pointer checkShowDeletePromotionConditionType-${n} deleteTemplatePromotionConditionType-${n}-${m} order-3 ps-3 m-auto`} style={shownWhen(bonuses.length > 1)} onClick={() => actions.deleteBonus(bonus.key)} >
                    <img src="/assets/images/icon-minus.png" width="20" height="20" />
                  </div>
                  <div className="invalid-feedback error-mini-game-bonus-type" id={`error-point-${n}-${m}`} data-i18n="minigameSetting.pointCountErrorText" >{t("minigameSetting.pointCountErrorText", "กรุณากรอกจำนวนแต้ม")}</div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3 mb-md-0" id={`showBoxPromotionBonusMiniGameAndLottery-${n}-${m}`} style={shownWhen(bonus.type === "mini-game" || bonus.type === "lotto")} >
                <div className="text-start p2 fw-700 mb-2 mini-game-bonus-type" data-i18n="minigameSetting.rightsCount">{t("minigameSetting.rightsCount", "จำนวนสิทธิ์")}</div>
                <div className="custom-input custom-input-group has-prepend box-promotion-item-checkbox-radio fistempty" id={`inputQuota-${n}-${m}`}>
                  <input id={`quota-${n}-${m}`} defaultValue={bonus.quota} type="text" className="form-control" placeholder="0"  onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                  <div className="text-prepend">สิทธิ์</div>
                  <div className={`cursor-pointer checkShowDeletePromotionConditionType-${n} deleteTemplatePromotionConditionType-${n}-${m} order-3 ps-3 m-auto`} style={shownWhen(bonuses.length > 1)} onClick={() => actions.deleteBonus(bonus.key)} >
                    <img src="/assets/images/icon-minus.png" width="20" height="20" />
                  </div>
                  <div className="invalid-feedback error-mini-game-bonus-type" id={`error-quota-${n}-${m}`} data-i18n="minigameSetting.rightsCountErrorText" >{t("minigameSetting.rightsCountErrorText", "กรุณากรอกจำนวนสิทธิ์")}</div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3 mb-md-0" id={`showBoxPromotionBonusReward-${n}-${m}`} style={shownWhen(bonus.type === "reward")} >
                <div className="text-start p2 fw-700 mb-2 mini-game-bonus-type" data-i18n="minigameSetting.rewardName">{t("minigameSetting.rewardName", "ระบุชื่อของรางวัล")}</div>
                <div className="custom-input custom-float d-flex justify-content-between align-items-center fistempty" id={`inputRewardName-${n}-${m}`}>
                  <input id={`rewardName-${n}-${m}`} type="text" className="form-control" />
                  <div className={`cursor-pointer checkShowDeletePromotionConditionType-${n} deleteTemplatePromotionConditionType-${n}-${m} order-3 ps-3 m-auto`} style={shownWhen(bonuses.length > 1)} onClick={() => actions.deleteBonus(bonus.key)} >
                    <img src="/assets/images/icon-minus.png" width="20" height="20" />
                  </div>
                </div>
                <div className="invalid-feedback error-mini-game-bonus-type" id={`error-rewardName-${n}-${m}`} data-i18n="minigameSetting.rewardNameErrorText" >{t("minigameSetting.rewardNameErrorText", "กรุณากรอกชื่อของรางวัล")}</div>
              </div>
            </div>
    );
    })}
          </div>
          <button className="btn system-btn btn-outline btn-rounded btn-add-minigame" onClick={() => addBonus()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17316C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8078C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C21.9971 9.34871 20.9426 6.80684 19.0679 4.9321C17.1932 3.05736 14.6513 2.00287 12 2ZM12 20.3333C10.3518 20.3333 8.74066 19.8446 7.37025 18.9289C5.99984 18.0132 4.93174 16.7117 4.30101 15.189C3.67028 13.6663 3.50525 11.9908 3.82679 10.3742C4.14834 8.75774 4.94201 7.27288 6.10745 6.10744C7.27288 4.94201 8.75774 4.14833 10.3743 3.82679C11.9908 3.50525 13.6663 3.67027 15.189 4.301C16.7117 4.93173 18.0132 5.99984 18.9289 7.37025C19.8446 8.74066 20.3333 10.3518 20.3333 12C20.3309 14.2094 19.4522 16.3276 17.8899 17.8899C16.3276 19.4522 14.2094 20.3309 12 20.3333ZM16.1667 12C16.1667 12.221 16.0789 12.433 15.9226 12.5893C15.7663 12.7455 15.5543 12.8333 15.3333 12.8333H12.8333V15.3333C12.8333 15.5543 12.7455 15.7663 12.5893 15.9226C12.433 16.0789 12.221 16.1667 12 16.1667C11.779 16.1667 11.567 16.0789 11.4107 15.9226C11.2545 15.7663 11.1667 15.5543 11.1667 15.3333V12.8333H8.66667C8.44566 12.8333 8.23369 12.7455 8.07741 12.5893C7.92113 12.433 7.83334 12.221 7.83334 12C7.83334 11.779 7.92113 11.567 8.07741 11.4107C8.23369 11.2545 8.44566 11.1667 8.66667 11.1667H11.1667V8.66667C11.1667 8.44565 11.2545 8.23369 11.4107 8.07741C11.567 7.92113 11.779 7.83333 12 7.83333C12.221 7.83333 12.433 7.92113 12.5893 8.07741C12.7455 8.23369 12.8333 8.44565 12.8333 8.66667V11.1667H15.3333C15.5543 11.1667 15.7663 11.2545 15.9226 11.4107C16.0789 11.567 16.1667 11.779 16.1667 12Z" fill="#E9E9E9" />
            </svg>
            {" "}
            <span className="add-bonus-btn-text" data-i18n="minigameSetting.addBonus">{t("minigameSetting.addBonus", "เพิ่มโบนัส")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

type Step4Props = StepProps & { sliceCount: number; onSliceCountChange: (count: number) => void };

export function Step4Display({ type, step, nav, initial, sliceCount, onSliceCountChange }: Step4Props) {
  const t = useT();
  const mini = type === "mini-game";
  const rootRef = useRef<HTMLDivElement>(null);
  const [gameItems, setGameItems] = useState<DropdownItem[]>([]);
  // Staging items read "6 <span>ชิ้น</span>"
  const sliceItems: DropdownItem[] = ["6", "8", "10"].map((value) => ({ value, chip: value, label: <>{value} <span>{t("minigameSetting.piece", "ชิ้น")}</span></> }));

  useEffect(() => {
    // Original: GET /api/promotion/get-promotion-deposit-mini-game (mini-game coupons as a bonus)
    getMiniGames().then((list) => setGameItems(list.map((g) => ({ value: g.id, label: g.name }))));
  }, []);

  // 4a handlers (count 3/6/9, collapsible style sections, uploads, display-type radios)
  useEffect(() => {
    if (!rootRef.current) return;
    return dom.wireMiniGameLayout(rootRef.current, onSliceCountChange);
  }, [onSliceCountChange]);

  // Theme colours go back to the defaults when the wizard closes (resetSettingPromotion)
  useEffect(
    () => () => {
      const style = document.documentElement.style;
      Array.from(style)
        .filter((name) => name.startsWith("--color-"))
        .forEach((name) => style.removeProperty(name));
    },
    [],
  );

  // Inline sizes the original sets on the slice-count dropdown (127×32)
  useEffect(() => {
    const wrapper = document.getElementById("customNumberPartsLuckywheel");
    wrapper?.querySelector<HTMLElement>(".dropdown-toggler")?.style.setProperty("height", "32px");
    const fake = wrapper?.querySelector<HTMLElement>(".input-fake");
    fake?.style.setProperty("height", "32px");
    fake?.style.setProperty("width", "127px");
  }, []);

  // Staging's wizard pickers carry inline width / height / text-transform (92×32; the setter was not
  // captured). Applied here, once the plugin has built each picker, so the shared ColorPicker
  // (95×30 in the mission form) keeps its own size.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const size = () =>
      root.querySelectorAll<HTMLInputElement>("input.asColorPicker-input").forEach((el) => {
        if (el.style.width === "92px") return;
        el.style.width = "92px";
        el.style.height = "32px";
        el.style.textTransform = "uppercase";
      });
    size();
    const observer = new MutationObserver(size);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const setThemeColor = dom.setThemeColor;

  return (
    <>
    <div id="SettingMinigameStep4" className="" style={shownWhen(step === "4")} ref={rootRef}>
    {/* Not captured: the choice count read by scriptminigame.js (6 = the captured default .active box) */}
    <input type="hidden" id="hiddenCountImgMiniGame" defaultValue={mini ? String(sliceCount) : "6"} />
    <div className="canvas-box-body mb-5 settingImgMiniGameCustom" style={shownWhen(mini)}>
      <div className="tab-header">
        <div className="header-in-body active">
          <div className="tab-group">
            <span className="p1 fw-700" data-i18n="minigameSetting.presetMinigameTitle">{t("minigameSetting.presetMinigameTitle", "กำหนดรูปแบบการแสดงผลมินิเกมส์")}</span>
          </div>
        </div>
      </div>
      <div className="main-in-detail-body content-col-1">
        <div className="label-minigame">
          <span data-i18n="minigameSetting.presetMinigameLabelTitle">{t("minigameSetting.presetMinigameLabelTitle", "รูปแบบการแสดงผลมินิเกมส์")}</span>
        </div>
        <div className="body-setting-quantity-mini-game">
          <div className="title-setting-quantity-mini-game">
            <h4 data-i18n="minigameSetting.presetMinigameHeader1">{t("minigameSetting.presetMinigameHeader1", "กำหนดจำนวนตัวเลือกมินิเกมส์")}</h4>
            <h5 data-i18n="minigameSetting.presetMinigameHeader2">{t("minigameSetting.presetMinigameHeader2", "เลือกจำนวนตัวเลือกที่ต้องการให้แสดงผล")}</h5>
          </div>
          <div className="session-box-setting-quantity-mini-game">
            <div className="box-select-quantity box-select-quantity-3" data-count-mini-game="3">
              <img src="https://p88.blob.core.windows.net/images/default/select-quantity-1.png" alt="select-quantity-img" />
            </div>
            <div className="box-select-quantity box-select-quantity-6 active" data-count-mini-game="6">
              <img src="https://p88.blob.core.windows.net/images/default/select-quantity-2.png" alt="select-quantity-img" />
            </div>
            <div className="box-select-quantity box-select-quantity-9" data-count-mini-game="9">
              <img src="https://p88.blob.core.windows.net/images/default/select-quantity-3.png" alt="select-quantity-img" />
            </div>
          </div>
        </div>
        <div className="body-setting-img-select-mini-game-step-1">
          <div className="title-setting-img-select-mini-game-step-1">
            <h4>
              <span data-i18n="minigameSetting.presetMinigameStep1">{t("minigameSetting.presetMinigameStep1", "Step 1 : ตั้งค่ารูปตัวเลือก")}</span>
              <strong>*</strong>
            </h4>
          </div>
          <div className="session-box-drop-setting-img-mini-game-step-1">
            <div className="box-drop-custom-mini-game">
              <div className="btn-on-drop-header-mini-game header-drop" data-drop="not-drop">
                <h4 className="mb-0" data-i18n="minigameSetting.presetMinigameSetting">{t("minigameSetting.presetMinigameSetting", "กำหนดรูปแบบของรูปตัวเลือก")}</h4>
                <div className="btn-drop-and-up">
                  <i className="fa fa-angle-down" aria-hidden="true" />
                </div>
              </div>
              <div className="body-drop-custom-mini-game">
                <div className="session-select-radio-type-mini-game">
                  <div className="box-select-radio-type-mini-game">
                    <div className="title-select-radio-type-mini-game">
                      <div className="form-check col d-flex align-items-center">
                        <input className="form-check-input me-2" type="radio" id="isCheckDisplayImgBeforeAll" name="select-radio-type-1" data-type="1" defaultChecked />
                        <h4 className="txt-title-form-check-radio-type-mini-game mb-0" data-i18n="minigameSetting.presetMinigameSet1">{t("minigameSetting.presetMinigameSet1", "แสดงผลรูปเหมือนกันทั้งหมด")}</h4>
                      </div>
                    </div>
                    <div className="img-select-type-radio-mini-game">
                      <img src="https://p88.blob.core.windows.net/images/default/select-type-mini-game-1-1-1.png" alt="img-mini-game" />
                    </div>
                  </div>
                  <div className="box-select-radio-type-mini-game">
                    <div className="title-select-radio-type-mini-game">
                      <div className="form-check col d-flex align-items-center">
                        <input className="form-check-input me-2" type="radio" id="isCheckDisplayImgBeforeDifferent" name="select-radio-type-1" data-type="2" />
                        <h4 className="txt-title-form-check-radio-type-mini-game mb-0" data-i18n="minigameSetting.presetMinigameSet2">{t("minigameSetting.presetMinigameSet2", "แสดงผลรูปแตกต่างกันทั้งหมด")}</h4>
                      </div>
                    </div>
                    <div className="img-select-type-radio-mini-game">
                      <img src="https://p88.blob.core.windows.net/images/default/select-type-mini-game-2-1-1.png" alt="img-mini-game" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="box-drop-custom-mini-game">
              <div className="btn-on-drop-header-mini-game header-drop" data-drop="not-drop">
                <h4 className="mb-0" data-i18n="minigameSetting.presetMinigameSet2">{t("minigameSetting.presetMinigameSet2", "แสดงผลรูปแตกต่างกันทั้งหมด")}</h4>
                <div className="btn-drop-and-up">
                  <i className="fa fa-angle-down" aria-hidden="true" />
                </div>
              </div>
              <div className="body-drop-custom-mini-game">
                <div className="session-select-radio-type-mini-game">
                  <div className="box-select-radio-type-mini-game">
                    <div className="title-select-radio-type-mini-game">
                      <div className="form-check col d-flex align-items-center">
                        <input className="form-check-input me-2" type="radio" id="isCheckStep1DisplayImgSort" name="select-radio-type-2" data-type="1" defaultChecked />
                        <h4 className="txt-title-form-check-radio-type-mini-game mb-0" data-i18n="minigameSetting.presetMinigameSet2">{t("minigameSetting.presetMinigameSet2", "แสดงผลรูปแตกต่างกันทั้งหมด")}</h4>
                      </div>
                    </div>
                    <div className="img-select-type-radio-mini-game">
                      <img src="https://p88.blob.core.windows.net/images/default/select-type-mini-game-1-1-2.png" alt="img-mini-game" />
                    </div>
                  </div>
                  <div className="box-select-radio-type-mini-game">
                    <div className="title-select-radio-type-mini-game">
                      <div className="form-check col d-flex align-items-center">
                        <input className="form-check-input me-2" type="radio" id="isCheckStep1DisplayImgSortRandom" name="select-radio-type-2" data-type="2" />
                        <h4 className="txt-title-form-check-radio-type-mini-game mb-0" data-i18n="minigameSetting.presetMinigameSet2">{t("minigameSetting.presetMinigameSet2", "แสดงผลรูปแตกต่างกันทั้งหมด")}</h4>
                      </div>
                    </div>
                    <div className="img-select-type-radio-mini-game">
                      <img src="https://p88.blob.core.windows.net/images/default/select-type-mini-game-2-1-2.png" alt="img-mini-game" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="session-upload-img-step-1">
              <div className="title-upload-img-step-1">
                <h4 className="mb-0" data-i18n="minigameSetting.uploadImage">{t("minigameSetting.uploadImage", "อัพโหลดรูป")}</h4>
                <p className="txt-upload-img-step-1-grey-header mb-0" data-i18n="minigameSetting.presetMinigameRecommand">{t("minigameSetting.presetMinigameRecommand", "คำแนะนำ :")}</p>
                <p className="txt-upload-img-step-1-grey mb-0" data-i18n="minigameSetting.presetMinigameImageSize">{t("minigameSetting.presetMinigameImageSize", "รูปควรมีขนาด")}</p>
                <p className="txt-upload-img-step-1-yellow mb-0" data-i18n="minigameSetting.presetMinigameSet2">{t("minigameSetting.presetMinigameSet2", "แสดงผลรูปแตกต่างกันทั้งหมด")}</p>
                <p className="txt-upload-img-step-1-grey mb-0" data-i18n="minigameSetting.presetMinigameImageSet">{t("minigameSetting.presetMinigameImageSet", "และมีนามสกุล")}</p>
                <p className="txt-upload-img-step-1-yellow mb-0">png, gif, jpg</p>
              </div>
              <div className="session-box-upload-img">
                <div className="box-upload-img" id="boxUpLoadImgBefore1">
                  <div className="title-box-upload-img">
                    <h4>
                      <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                      {" 1 "}
                      <strong>*</strong>
                    </h4>
                  </div>
                  <div className="body-box-upload">
                    <div className="btn-close-img-mini-game btn-close-img-mini-game-step-1 btn-close-img-mini-game-step-1-box-1" data-box-no="1" style={{ display: "none" }}>
                      <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                    </div>
                    <img className="img-show-in-box-upload img-show-upload-mini-game-before-1" alt="img" style={{ display: "none" }} />
                    {" "}
                    <img className="img-default-box-upload-mini-game default-img-mini-game-before-1" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                    {" "}
                    <input type="hidden" id="imgBeforeMiniGame1" />
                  </div>
                  <label className="btn-box-upload" htmlFor="fileImageUploadBeforeMiniGame1">
                    <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                    {" "}
                    <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                    {" "}
                    <input type="file" id="fileImageUploadBeforeMiniGame1" style={{ display: "none" }} />
                  </label>
                </div>
                <div className="box-upload-img" id="boxUpLoadImgBefore2" style={{ display: "none" }}>
                  <div className="title-box-upload-img">
                    <h4>
                      <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                      {" 2 "}
                      <strong>*</strong>
                    </h4>
                  </div>
                  <div className="body-box-upload">
                    <div className="btn-close-img-mini-game btn-close-img-mini-game-step-1 btn-close-img-mini-game-step-1-box-2" data-box-no="2" style={{ display: "none" }}>
                      <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                    </div>
                    <img className="img-show-in-box-upload img-show-upload-mini-game-before-2" alt="img" style={{ display: "none" }} />
                    {" "}
                    <img className="img-default-box-upload-mini-game default-img-mini-game-before-2" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                    {" "}
                    <input type="hidden" id="imgBeforeMiniGame2" />
                  </div>
                  <label className="btn-box-upload" htmlFor="fileImageUploadBeforeMiniGame2">
                    <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                    {" "}
                    <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                    {" "}
                    <input type="file" id="fileImageUploadBeforeMiniGame2" style={{ display: "none" }} />
                  </label>
                </div>
                <div className="box-upload-img" id="boxUpLoadImgBefore3" style={{ display: "none" }}>
                  <div className="title-box-upload-img">
                    <h4>
                      <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                      {" 3 "}
                      <strong>*</strong>
                    </h4>
                  </div>
                  <div className="body-box-upload">
                    <div className="btn-close-img-mini-game btn-close-img-mini-game-step-1 btn-close-img-mini-game-step-1-box-3" data-box-no="3" style={{ display: "none" }}>
                      <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                    </div>
                    <img className="img-show-in-box-upload img-show-upload-mini-game-before-3" alt="img" style={{ display: "none" }} />
                    {" "}
                    <img className="img-default-box-upload-mini-game default-img-mini-game-before-3" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                    {" "}
                    <input type="hidden" id="imgBeforeMiniGame3" />
                  </div>
                  <label className="btn-box-upload" htmlFor="fileImageUploadBeforeMiniGame3">
                    <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                    {" "}
                    <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                    {" "}
                    <input type="file" id="fileImageUploadBeforeMiniGame3" style={{ display: "none" }} />
                  </label>
                </div>
                <div className="box-upload-img" id="boxUpLoadImgBefore4" style={{ display: "none" }}>
                  <div className="title-box-upload-img">
                    <h4>
                      <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                      {" 4 "}
                      <strong>*</strong>
                    </h4>
                  </div>
                  <div className="body-box-upload">
                    <div className="btn-close-img-mini-game btn-close-img-mini-game-step-1 btn-close-img-mini-game-step-1-box-4" data-box-no="4" style={{ display: "none" }}>
                      <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                    </div>
                    <img className="img-show-in-box-upload img-show-upload-mini-game-before-4" alt="img" style={{ display: "none" }} />
                    {" "}
                    <img className="img-default-box-upload-mini-game default-img-mini-game-before-4" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                    {" "}
                    <input type="hidden" id="imgBeforeMiniGame4" />
                  </div>
                  <label className="btn-box-upload" htmlFor="fileImageUploadBeforeMiniGame4">
                    <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                    {" "}
                    <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                    {" "}
                    <input type="file" id="fileImageUploadBeforeMiniGame4" style={{ display: "none" }} />
                  </label>
                </div>
                <div className="box-upload-img" id="boxUpLoadImgBefore5" style={{ display: "none" }}>
                  <div className="title-box-upload-img">
                    <h4>
                      <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                      {" 5 "}
                      <strong>*</strong>
                    </h4>
                  </div>
                  <div className="body-box-upload">
                    <div className="btn-close-img-mini-game btn-close-img-mini-game-step-1 btn-close-img-mini-game-step-1-box-5" data-box-no="5" style={{ display: "none" }}>
                      <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                    </div>
                    <img className="img-show-in-box-upload img-show-upload-mini-game-before-5" alt="img" style={{ display: "none" }} />
                    {" "}
                    <img className="img-default-box-upload-mini-game default-img-mini-game-before-5" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                    {" "}
                    <input type="hidden" id="imgBeforeMiniGame5" />
                  </div>
                  <label className="btn-box-upload" htmlFor="fileImageUploadBeforeMiniGame5">
                    <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                    {" "}
                    <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                    {" "}
                    <input type="file" id="fileImageUploadBeforeMiniGame5" style={{ display: "none" }} />
                  </label>
                </div>
                <div className="box-upload-img" id="boxUpLoadImgBefore6" style={{ display: "none" }}>
                  <div className="title-box-upload-img">
                    <h4>
                      <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                      {" 6 "}
                      <strong>*</strong>
                    </h4>
                  </div>
                  <div className="body-box-upload">
                    <div className="btn-close-img-mini-game btn-close-img-mini-game-step-1 btn-close-img-mini-game-step-1-box-6" data-box-no="6" style={{ display: "none" }}>
                      <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                    </div>
                    <img className="img-show-in-box-upload img-show-upload-mini-game-before-6" alt="img" style={{ display: "none" }} />
                    {" "}
                    <img className="img-default-box-upload-mini-game default-img-mini-game-before-6" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                    {" "}
                    <input type="hidden" id="imgBeforeMiniGame6" />
                  </div>
                  <label className="btn-box-upload" htmlFor="fileImageUploadBeforeMiniGame6">
                    <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                    {" "}
                    <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                    {" "}
                    <input type="file" id="fileImageUploadBeforeMiniGame6" style={{ display: "none" }} />
                  </label>
                </div>
                <div className="box-upload-img" id="boxUpLoadImgBefore7" style={{ display: "none" }}>
                  <div className="title-box-upload-img">
                    <h4>
                      <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                      {" 7 "}
                      <strong>*</strong>
                    </h4>
                  </div>
                  <div className="body-box-upload">
                    <div className="btn-close-img-mini-game btn-close-img-mini-game-step-1 btn-close-img-mini-game-step-1-box-7" data-box-no="7" style={{ display: "none" }}>
                      <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                    </div>
                    <img className="img-show-in-box-upload img-show-upload-mini-game-before-7" alt="img" style={{ display: "none" }} />
                    {" "}
                    <img className="img-default-box-upload-mini-game default-img-mini-game-before-7" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                    {" "}
                    <input type="hidden" id="imgBeforeMiniGame7" />
                  </div>
                  <label className="btn-box-upload" htmlFor="fileImageUploadBeforeMiniGame7">
                    <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                    {" "}
                    <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                    {" "}
                    <input type="file" id="fileImageUploadBeforeMiniGame7" style={{ display: "none" }} />
                  </label>
                </div>
                <div className="box-upload-img" id="boxUpLoadImgBefore8" style={{ display: "none" }}>
                  <div className="title-box-upload-img">
                    <h4>
                      <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                      {" 8 "}
                      <strong>*</strong>
                    </h4>
                  </div>
                  <div className="body-box-upload">
                    <div className="btn-close-img-mini-game btn-close-img-mini-game-step-1 btn-close-img-mini-game-step-1-box-8" data-box-no="8" style={{ display: "none" }}>
                      <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                    </div>
                    <img className="img-show-in-box-upload img-show-upload-mini-game-before-8" alt="img" style={{ display: "none" }} />
                    {" "}
                    <img className="img-default-box-upload-mini-game default-img-mini-game-before-8" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                    {" "}
                    <input type="hidden" id="imgBeforeMiniGame8" />
                  </div>
                  <label className="btn-box-upload" htmlFor="fileImageUploadBeforeMiniGame8">
                    <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                    {" "}
                    <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                    {" "}
                    <input type="file" id="fileImageUploadBeforeMiniGame8" style={{ display: "none" }} />
                  </label>
                </div>
                <div className="box-upload-img" id="boxUpLoadImgBefore9" style={{ display: "none" }}>
                  <div className="title-box-upload-img">
                    <h4>
                      <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                      {" 9 "}
                      <strong>*</strong>
                    </h4>
                  </div>
                  <div className="body-box-upload">
                    <div className="btn-close-img-mini-game btn-close-img-mini-game-step-1 btn-close-img-mini-game-step-1-box-9" data-box-no="9" style={{ display: "none" }}>
                      <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                    </div>
                    <img className="img-show-in-box-upload img-show-upload-mini-game-before-9" alt="img" style={{ display: "none" }} />
                    {" "}
                    <img className="img-default-box-upload-mini-game default-img-mini-game-before-9" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                    {" "}
                    <input type="hidden" id="imgBeforeMiniGame9" />
                  </div>
                  <label className="btn-box-upload" htmlFor="fileImageUploadBeforeMiniGame9">
                    <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                    {" "}
                    <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                    {" "}
                    <input type="file" id="fileImageUploadBeforeMiniGame9" style={{ display: "none" }} />
                  </label>
                </div>
              </div>
              <div className="session-error-img-require" style={{ display: "none" }}>
                <small className="txt-error-img-require" />
              </div>
            </div>
          </div>
        </div>
        <div className="body-setting-img-select-mini-game-step-2">
          <div className="title-setting-img-select-mini-game-step-2">
            <h4 data-i18n="minigameSetting.presetMinigameStep2">{t("minigameSetting.presetMinigameStep2", "Step 2 : ตั้งค่ารูปหลังถูกเลือก")}</h4>
            <div className="session-checkbox-step-2">
              <input className="form-check-input form-check-input-custom-mini-game mt-0 me-2" id="isCheckNextStep2" type="checkbox" />
              <h4 className="me-1 mb-0" data-i18n="minigameSetting.presetMinigameSkip">{t("minigameSetting.presetMinigameSkip", "ข้าม Step 2")}</h4>
              <p className="mb-0" data-i18n="minigameSetting.presetMinigameStepText">{t("minigameSetting.presetMinigameStepText", "(ระบบจะไม่แสดงผล Step 2 และจะข้ามไป Step 3 ให้โดยอัตโนมัติ)")}</p>
            </div>
          </div>
          <div className="box-drop-custom-mini-game">
            <div className="btn-on-drop-header-mini-game header-drop" data-drop="not-drop">
              <h4 className="mb-0" data-i18n="minigameSetting.presetMinigameSettingDisplay">{t("minigameSetting.presetMinigameSettingDisplay", "กำหนดรูปแบบของรูปหลังถูกเลือก")}</h4>
              <div className="btn-drop-and-up">
                <i className="fa fa-angle-down" aria-hidden="true" />
              </div>
            </div>
            <div className="body-drop-custom-mini-game">
              <div className="session-select-radio-type-mini-game">
                <div className="box-select-radio-type-mini-game">
                  <div className="title-select-radio-type-mini-game">
                    <div className="form-check col d-flex align-items-center">
                      <input className="form-check-input me-2" type="radio" id="isCheckDisplayImgAfterAll" name="select-radio-type-2-1" defaultChecked />
                      <h4 className="txt-title-form-check-radio-type-mini-game mb-0" data-i18n="minigameSetting.presetMinigameSet1">{t("minigameSetting.presetMinigameSet1", "แสดงผลรูปเหมือนกันทั้งหมด")}</h4>
                    </div>
                  </div>
                  <div className="img-select-type-radio-mini-game">
                    <img src="https://p88.blob.core.windows.net/images/default/select-type-mini-game-1-1-1.png" alt="img-mini-game" />
                  </div>
                </div>
                <div className="box-select-radio-type-mini-game">
                  <div className="title-select-radio-type-mini-game">
                    <div className="form-check col d-flex align-items-center">
                      <input className="form-check-input me-2" type="radio" id="isCheckDisplayImgAfterDifferent" name="select-radio-type-2-1" />
                      <h4 className="txt-title-form-check-radio-type-mini-game mb-0" data-i18n="minigameSetting.presetMinigameSet2">{t("minigameSetting.presetMinigameSet2", "แสดงผลรูปแตกต่างกันทั้งหมด")}</h4>
                    </div>
                  </div>
                  <div className="img-select-type-radio-mini-game">
                    <img src="https://p88.blob.core.windows.net/images/default/select-type-mini-game-2-1-1.png" alt="img-mini-game" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="box-drop-custom-mini-game">
            <div className="btn-on-drop-header-mini-game header-drop" data-drop="not-drop">
              <h4 className="mb-0" data-i18n="minigameSetting.presetMinigameSettingContinuously">{t("minigameSetting.presetMinigameSettingContinuously", "กำหนดการแสดงผล Step ต่อเนื่อง")}</h4>
              <div className="btn-drop-and-up">
                <i className="fa fa-angle-down" aria-hidden="true" />
              </div>
            </div>
            <div className="body-drop-custom-mini-game">
              <div className="session-select-radio-type-mini-game">
                <div className="box-select-radio-type-mini-game">
                  <div className="title-select-radio-type-mini-game">
                    <div className="form-check col d-flex align-items-center">
                      <input className="form-check-input me-2" type="radio" id="isCheckDisplayImgAfterSort" name="select-radio-type-display-1" defaultChecked />
                      <h4 className="txt-title-form-check-radio-type-mini-game mb-0" data-i18n="minigameSetting.presetMinigameSettingOrder">{t("minigameSetting.presetMinigameSettingOrder", "แสดงผลเรียงตามลำดับรูปตัวเลือก")}</h4>
                    </div>
                  </div>
                  <div className="img-select-type-radio-mini-game-after-select">
                    <img src="https://p88.blob.core.windows.net/images/default/img-step-2-type-display-2.png" alt="img-mini-game" />
                  </div>
                </div>
                <div className="box-select-radio-type-mini-game">
                  <div className="title-select-radio-type-mini-game">
                    <div className="form-check col d-flex align-items-center">
                      <input className="form-check-input me-2" type="radio" id="isCheckDisplayImgAfterSortRandom" name="select-radio-type-display-1" />
                      <h4 className="txt-title-form-check-radio-type-mini-game mb-0" data-i18n="minigameSetting.presetMinigameSettingRandom">{t("minigameSetting.presetMinigameSettingRandom", "แสดงผลแบบสุ่ม (Random)")}</h4>
                    </div>
                  </div>
                  <div className="img-select-type-radio-mini-game-after-select">
                    <img src="https://p88.blob.core.windows.net/images/default/img-step-2-type-display-1.png" alt="img-mini-game" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="session-upload-img-step-2">
            <div className="title-upload-img-step-2">
              <h4 className="mb-0" data-i18n="minigameSetting.uploadImage">{t("minigameSetting.uploadImage", "อัพโหลดรูป")}</h4>
              <p className="txt-upload-img-step-1-grey-header mb-0" data-i18n="minigameSetting.presetMinigameRecommand">{t("minigameSetting.presetMinigameRecommand", "คำแนะนำ :")}</p>
              <p className="txt-upload-img-step-1-grey mb-0" data-i18n="minigameSetting.presetMinigameImageSize">{t("minigameSetting.presetMinigameImageSize", "รูปควรมีขนาด")}</p>
              <p className="txt-upload-img-step-1-yellow mb-0" data-i18n="minigameSetting.presetMinigameSet2">{t("minigameSetting.presetMinigameSet2", "แสดงผลรูปแตกต่างกันทั้งหมด")}</p>
              <p className="txt-upload-img-step-1-grey mb-0" data-i18n="minigameSetting.presetMinigameImageSet">{t("minigameSetting.presetMinigameImageSet", "และมีนามสกุล")}</p>
              <p className="txt-upload-img-step-1-yellow mb-0">png, gif, jpg</p>
            </div>
            <div className="session-box-upload-img">
              <div className="box-upload-img" id="boxUpLoadImgAfter1">
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 1"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-2 btn-close-img-mini-game-step-2-box-1" data-box-no="1" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-after-1" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-after-1" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgAfterMiniGame1" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadAfterMiniGame1">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadAfterMiniGame1" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUpLoadImgAfter2" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 2"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-2 btn-close-img-mini-game-step-2-box-2" data-box-no="2" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-after-2" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-after-2" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgAfterMiniGame2" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadAfterMiniGame2">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                </label>
                {" "}
                <input type="file" id="fileImageUploadAfterMiniGame2" style={{ display: "none" }} />
              </div>
              <div className="box-upload-img" id="boxUpLoadImgAfter3" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 3"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-2 btn-close-img-mini-game-step-2-box-3" data-box-no="3" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-after-3" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-after-3" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgAfterMiniGame3" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadAfterMiniGame3">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadAfterMiniGame3" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUpLoadImgAfter4" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 4"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-2 btn-close-img-mini-game-step-2-box-4" data-box-no="4" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-after-4" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-after-4" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgAfterMiniGame4" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadAfterMiniGame4">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadAfterMiniGame4" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUpLoadImgAfter5" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 5"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-2 btn-close-img-mini-game-step-2-box-5" data-box-no="5" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-after-5" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-after-5" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgAfterMiniGame5" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadAfterMiniGame5">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadAfterMiniGame5" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUpLoadImgAfter6" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 6"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-2 btn-close-img-mini-game-step-2-box-6" data-box-no="6" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-after-6" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-after-6" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgAfterMiniGame6" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadAfterMiniGame6">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadAfterMiniGame6" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUpLoadImgAfter7" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 7"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-2 btn-close-img-mini-game-step-2-box-7" data-box-no="7" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-after-7" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-after-7" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgAfterMiniGame7" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadAfterMiniGame7">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadAfterMiniGame7" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUpLoadImgAfter8" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 8"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-2 btn-close-img-mini-game-step-2-box-8" data-box-no="8" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-after-8" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-after-8" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgAfterMiniGame8" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadAfterMiniGame8">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadAfterMiniGame8" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUpLoadImgAfter9" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 9"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-2 btn-close-img-mini-game-step-2-box-9" data-box-no="9" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-after-9" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-after-9" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgAfterMiniGame9" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadAfterMiniGame9">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadAfterMiniGame9" style={{ display: "none" }} />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="body-setting-img-select-mini-game-step-3">
          <div className="title-setting-img-select-mini-game-step-3">
            <h4 data-i18n="minigameSetting.presetMinigameStep3">{t("minigameSetting.presetMinigameStep3", "Step 3 : ตั้งค่ารูปประกาศผล")}</h4>
          </div>
          <div className="box-drop-custom-mini-game">
            <div className="btn-on-drop-header-mini-game header-drop" data-drop="not-drop">
              <h4 className="mb-0" data-i18n="minigameSetting.presetMinigameSettingDisplay">{t("minigameSetting.presetMinigameSettingDisplay", "กำหนดรูปแบบของรูปหลังถูกเลือก")}</h4>
              <div className="btn-drop-and-up">
                <i className="fa fa-angle-down" aria-hidden="true" />
              </div>
            </div>
            <div className="body-drop-custom-mini-game">
              <div className="session-select-radio-type-mini-game">
                <div className="box-select-radio-type-mini-game">
                  <div className="title-select-radio-type-mini-game">
                    <div className="form-check col d-flex align-items-center">
                      <input className="form-check-input me-2" type="radio" id="isCheckDisplayImgResultsAll" name="select-radio-type-3-1" defaultChecked />
                      <h4 className="txt-title-form-check-radio-type-mini-game mb-0" data-i18n="minigameSetting.presetMinigameSet1">{t("minigameSetting.presetMinigameSet1", "แสดงผลรูปเหมือนกันทั้งหมด")}</h4>
                    </div>
                  </div>
                  <div className="img-select-type-radio-mini-game">
                    <img src="https://p88.blob.core.windows.net/images/default/select-type-mini-game-1-1-1.png" alt="img-mini-game" />
                  </div>
                </div>
                <div className="box-select-radio-type-mini-game">
                  <div className="title-select-radio-type-mini-game">
                    <div className="form-check col d-flex align-items-center">
                      <input className="form-check-input me-2" type="radio" id="isCheckDisplayImgResultsDifferent" name="select-radio-type-3-1" />
                      <h4 className="txt-title-form-check-radio-type-mini-game mb-0" data-i18n="minigameSetting.presetMinigameSet2">{t("minigameSetting.presetMinigameSet2", "แสดงผลรูปแตกต่างกันทั้งหมด")}</h4>
                    </div>
                  </div>
                  <div className="img-select-type-radio-mini-game">
                    <img src="https://p88.blob.core.windows.net/images/default/select-type-mini-game-2-1-1.png" alt="img-mini-game" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="box-drop-custom-mini-game">
            <div className="btn-on-drop-header-mini-game header-drop" data-drop="not-drop">
              <h4 className="mb-0" data-i18n="minigameSetting.presetMinigameSettingContinuously">{t("minigameSetting.presetMinigameSettingContinuously", "กำหนดการแสดงผล Step ต่อเนื่อง")}</h4>
              <div className="btn-drop-and-up">
                <i className="fa fa-angle-down" aria-hidden="true" />
              </div>
            </div>
            <div className="body-drop-custom-mini-game">
              <div className="session-select-radio-type-mini-game">
                <div className="box-select-radio-type-mini-game">
                  <div className="title-select-radio-type-mini-game">
                    <div className="form-check col d-flex align-items-center">
                      <input className="form-check-input me-2" type="radio" id="isCheckDisplayImgResultsSort" name="select-radio-type-display-3-2" defaultChecked />
                      <h4 className="txt-title-form-check-radio-type-mini-game mb-0" data-i18n="minigameSetting.presetMinigameSettingOrder">{t("minigameSetting.presetMinigameSettingOrder", "แสดงผลเรียงตามลำดับรูปตัวเลือก")}</h4>
                    </div>
                  </div>
                  <div className="img-select-type-radio-mini-game-after-select">
                    <img src="https://p88.blob.core.windows.net/images/default/img-step-2-type-display-2.png" alt="img-mini-game" />
                  </div>
                </div>
                <div className="box-select-radio-type-mini-game">
                  <div className="title-select-radio-type-mini-game">
                    <div className="form-check col d-flex align-items-center">
                      <input className="form-check-input me-2" type="radio" id="isCheckDisplayImgResultsSortRandom" name="select-radio-type-display-3-2" />
                      <h4 className="txt-title-form-check-radio-type-mini-game mb-0" data-i18n="minigameSetting.presetMinigameSettingRandom">{t("minigameSetting.presetMinigameSettingRandom", "แสดงผลแบบสุ่ม (Random)")}</h4>
                    </div>
                  </div>
                  <div className="img-select-type-radio-mini-game-after-select">
                    <img src="https://p88.blob.core.windows.net/images/default/img-step-2-type-display-1.png" alt="img-mini-game" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="session-upload-img-step-3">
            <div className="title-upload-img-step-3">
              <h4 className="mb-0" data-i18n="minigameSetting.uploadImage">{t("minigameSetting.uploadImage", "อัพโหลดรูป")}</h4>
              <p className="txt-upload-img-step-1-grey-header mb-0" data-i18n="minigameSetting.presetMinigameRecommand">{t("minigameSetting.presetMinigameRecommand", "คำแนะนำ :")}</p>
              <p className="txt-upload-img-step-1-grey mb-0" data-i18n="minigameSetting.presetMinigameImageSize">{t("minigameSetting.presetMinigameImageSize", "รูปควรมีขนาด")}</p>
              <p className="txt-upload-img-step-1-yellow mb-0" data-i18n="minigameSetting.presetMinigameSet2">{t("minigameSetting.presetMinigameSet2", "แสดงผลรูปแตกต่างกันทั้งหมด")}</p>
              <p className="txt-upload-img-step-1-grey mb-0" data-i18n="minigameSetting.presetMinigameImageSet">{t("minigameSetting.presetMinigameImageSet", "และมีนามสกุล")}</p>
              <p className="txt-upload-img-step-1-yellow mb-0">png, gif, jpg</p>
            </div>
            <div className="session-box-upload-img">
              <div className="box-upload-img" id="boxUploadImgResults1">
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 1"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-3 btn-close-img-mini-game-step-3-box-1" data-box-no="1" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-results-1" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-results-1" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgResultsMiniGame1" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadResultsMiniGame1">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadResultsMiniGame1" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUploadImgResults2" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 2"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-3 btn-close-img-mini-game-step-3-box-2" data-box-no="2" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-results-2" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-results-2" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgResultsMiniGame2" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadResultsMiniGame2">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadResultsMiniGame2" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUploadImgResults3" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 3"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-3 btn-close-img-mini-game-step-3-box-3" data-box-no="3" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-results-3" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-results-3" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgResultsMiniGame3" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadResultsMiniGame3">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadResultsMiniGame3" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUploadImgResults4" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 4"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-3 btn-close-img-mini-game-step-3-box-4" data-box-no="4" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-results-4" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-results-4" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgResultsMiniGame4" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadResultsMiniGame4">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadResultsMiniGame4" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUploadImgResults5" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 5"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-3 btn-close-img-mini-game-step-3-box-5" data-box-no="5" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-results-5" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-results-5" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgResultsMiniGame5" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadResultsMiniGame5">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadResultsMiniGame5" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUploadImgResults6" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 6"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-3 btn-close-img-mini-game-step-3-box-6" data-box-no="6" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-results-6" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-results-6" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgResultsMiniGame6" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadResultsMiniGame6">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadResultsMiniGame6" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUploadImgResults7" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 7"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-3 btn-close-img-mini-game-step-3-box-7" data-box-no="7" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-results-7" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-results-7" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgResultsMiniGame7" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadResultsMiniGame7">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadResultsMiniGame7" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUploadImgResults8" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 8"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-3 btn-close-img-mini-game-step-3-box-8" data-box-no="8" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-results-8" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-results-8" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgResultsMiniGame8" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadResultsMiniGame8">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadResultsMiniGame8" style={{ display: "none" }} />
                </label>
              </div>
              <div className="box-upload-img" id="boxUploadImgResults9" style={{ display: "none" }}>
                <div className="title-box-upload-img">
                  <h4>
                    <span data-i18n="minigameSetting.order">{t("minigameSetting.order", "ลำดับ")}</span>
                    {" 9"}
                  </h4>
                </div>
                <div className="body-box-upload">
                  <div className="btn-close-img-mini-game btn-close-img-mini-game-step-3 btn-close-img-mini-game-step-3-box-9" data-box-no="9" style={{ display: "none" }}>
                    <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                  </div>
                  <img className="img-show-in-box-upload img-show-upload-mini-game-results-9" alt="img" style={{ display: "none" }} />
                  {" "}
                  <img className="img-default-box-upload-mini-game default-img-mini-game-results-9" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                  {" "}
                  <input type="hidden" id="imgResultsMiniGame9" />
                </div>
                <label className="btn-box-upload" htmlFor="fileImageUploadResultsMiniGame9">
                  <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                  {" "}
                  <span data-i18n="minigameSetting.upload">{t("minigameSetting.upload", "อัพโหลด")}</span>
                  {" "}
                  <input type="file" id="fileImageUploadResultsMiniGame9" style={{ display: "none" }} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="canvas-box-body-custom-mini-game">
      <div className="main-in-detail-body-custom content-col-1">
        <div>
          <div className="label-minigame luckyWheelShowLayout label-minigame-custom" style={shownWhen(!mini)}>
            <span id="textTabsStep2-3-3">
    <TypeText type={type} k="tabs2-3-3" />
            </span>
          </div>
          <div className="input-col-1-p position-relative luckyWheelShowLayout p-4" style={shownWhen(!mini)}>
            <div>
              <div className="text-start">
                <span className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.settingMinigameStep3SubText">{t("minigameSetting.settingMinigameStep3SubText", "กำหนดยอดฝากที่สมาชิกต้องทำเพื่อให้เข้าเงื่อนไขการได้สิทธิ์มินิเกมส์ จำนวน 1 สิทธิ์")}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p2 mb-2 fw-700">
                <span className="color-emerald-title-1" data-i18n="minigameSetting.settingLuckyWheel">{t("minigameSetting.settingLuckyWheel", "ตั้งค่าและตกแต่งมินิเกมส์ : วงล้อหรรษาลุ้น")}</span>
                <div className="d-flex align-items-center gap-2">
                  <span className="color-emerald-title-1" data-i18n="minigameSetting.luckyWheelSlice">{t("minigameSetting.luckyWheelSlice", "จำนวนชิ้นส่วน :")}</span>
                  <CustomDropdown id="customNumberPartsLuckywheel" fakeClassName="multiple p2 fw-700" items={sliceItems} value={String(sliceCount)} fakeValue={(item) => `${item.value} ชิ้น`} onChange={(value) => value && onSliceCountChange(Number(value))}>
    <div className="invalid-feedback" id="error-NumberPartsLuckywheel" data-i18n="minigameSetting.settingLuckyWheelErrorText" style={{ display: "none" }}>{t("minigameSetting.settingLuckyWheelErrorText", "กรุณาเลือกประเภทการฝาก")}</div>
    </CustomDropdown>
                </div>
              </div>
              <div className="justify-content-between align-items-center p2 fw-700 col-12">
                <div className="text-start p2 color-emerald-title-3 fw-700 mb-2">
                  <span data-i18n="minigameSetting.settingBonus">{t("minigameSetting.settingBonus", "การได้รับโบนัส")}</span>
                </div>
                <div className="row ms-0">
                  <div className="form-check col d-flex align-items-center">
                    <input className="form-check-input me-2" type="radio" name="turnOverBeforeOrAfterLuckyWheel" id="turnOverBeforeLuckyWheel" data-value="true" defaultChecked={initial?.detail.bonusTiming !== "after"} value="true" />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="turnOverBeforeLuckyWheel">
                      <span className="p2 color-emerald-title-1 pt-1" data-i18n="minigameSetting.settingGetBeforeTurnOver">{t("minigameSetting.settingGetBeforeTurnOver", "ได้รับก่อนทำเทิร์นโอเวอร์สำเร็จ")}</span>
                    </label>
                  </div>
                  <div className="form-check col d-flex align-items-center">
                    <input className="form-check-input me-2" type="radio" name="turnOverBeforeOrAfterLuckyWheel" id="turnOverAfterLuckyWheel" data-value="false" defaultChecked={initial?.detail.bonusTiming === "after"} value="false" />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="turnOverAfterLuckyWheel">
                      <span className="p2 color-emerald-title-1 pt-1" data-i18n="minigameSetting.settingGetAfterTurnOver">{t("minigameSetting.settingGetAfterTurnOver", "ได้รับหลังทำเทิร์นโอเวอร์สำเร็จ")}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-5 mb-3">
                  <div className="minigame-upload-field">
                    <div className="d-flex custom-input mb-3">
                      <div className="setting-minigame-upload-img" onClick={() => dom.clickById("luckywheelFrame")}>
                        <svg id="luckywheelFramePlaceholder" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
                          <path fillRule="evenodd" clipRule="evenodd" d="M11.8898 0.765625H5.26262C4.06973 0.765625 2.92608 1.23899 2.08253 2.08253C1.23899 2.92608 0.765625 4.06973 0.765625 5.26262V14.73C0.765625 15.9229 1.23899 17.0665 2.08253 17.9101C2.92608 18.7536 4.06973 19.227 5.26262 19.227H14.73C15.9229 19.227 17.0665 18.7536 17.9101 17.9101C18.7536 17.0665 19.227 15.9229 19.227 14.73C19.227 11.7515 19.227 8.10283 19.227 8.10283C19.227 7.71088 18.9089 7.39278 18.5169 7.39278C18.125 7.39278 17.8069 7.71088 17.8069 8.10283V14.73C17.8069 15.5461 17.4831 16.329 16.9056 16.9056C16.329 17.4831 15.5461 17.8069 14.73 17.8069H5.26262C4.44653 17.8069 3.66358 17.4831 3.08702 16.9056C2.50951 16.329 2.18573 15.5461 2.18573 14.73C2.18573 11.9115 2.18573 8.08105 2.18573 5.26262C2.18573 4.44653 2.50951 3.66358 3.08702 3.08702C3.66358 2.50951 4.44653 2.18573 5.26262 2.18573H11.8898C12.2817 2.18573 12.5998 1.86763 12.5998 1.47568C12.5998 1.08373 12.2817 0.765625 11.8898 0.765625Z" fill="#C8C8C8" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M18.9618 13.2265C18.9618 13.2265 17.0267 11.6795 15.6312 10.5633C14.55 9.69706 12.9794 9.83055 12.0592 10.8663C9.92523 13.2663 5.67912 18.0435 5.67912 18.0435C5.41877 18.336 5.44528 18.7857 5.73877 19.0461C6.03131 19.3064 6.48101 19.2799 6.74136 18.9864C6.74136 18.9864 10.9865 14.2102 13.1205 11.8092C13.5389 11.3387 14.2528 11.2781 14.7441 11.672L18.0738 14.3361C18.3805 14.5803 18.8274 14.5311 19.0726 14.2253C19.3169 13.9186 19.2676 13.4717 18.9618 13.2265Z" fill="#C8C8C8" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M10.9475 12.3111C10.9475 12.3111 8.43202 10.0248 6.8983 8.63024C5.97429 7.79048 4.58353 7.72421 3.58473 8.47403C2.48178 9.30053 1.04937 10.3751 1.04937 10.3751C0.736 10.6099 0.672569 11.0558 0.907359 11.3691C1.14215 11.6825 1.58806 11.7459 1.90143 11.5112C1.90143 11.5112 3.33384 10.4366 4.43679 9.61011C4.89028 9.26928 5.5227 9.29863 5.94305 9.68111L9.99129 13.362C10.2819 13.6252 10.7316 13.6044 10.9948 13.3147C11.258 13.024 11.2372 12.5743 10.9475 12.3111Z" fill="#C8C8C8" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M17.0126 0.97367C16.7352 0.696277 16.2855 0.696277 16.0081 0.97367L12.6614 4.32038C12.5279 4.45387 12.4531 4.6347 12.4531 4.8231V6.83112C12.4531 7.22307 12.7712 7.54118 13.1632 7.54118H15.1712C15.3596 7.54118 15.5404 7.46638 15.6739 7.3329L19.0206 3.98618C19.298 3.70879 19.298 3.25909 19.0206 2.9817L17.0126 0.97367ZM16.5108 2.47993L17.5144 3.48347L14.8777 6.12107H13.8732V5.11659L16.5108 2.47993Z" fill="#C8C8C8" />
                          <path d="M7.63104 6.2074C8.41534 6.2074 9.05115 5.57159 9.05115 4.78729C9.05115 4.00299 8.41534 3.36719 7.63104 3.36719C6.84674 3.36719 6.21094 4.00299 6.21094 4.78729C6.21094 5.57159 6.84674 6.2074 7.63104 6.2074Z" fill="#C8C8C8" />
                        </svg>
                        {" "}
                        <img className="luckywheelFrameSrc" src="https://p88.blob.core.windows.net/images/minigame/wheel-8/frame.png" />
                        <div className="setting-minigame-upload-img-button system-btn-a">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M7.19765 0.171875H3.01208C2.25868 0.171875 1.53637 0.470844 1.00361 1.00361C0.470844 1.53637 0.171875 2.25868 0.171875 3.01208V8.99147C0.171875 9.74487 0.470844 10.4672 1.00361 10.9999C1.53637 11.5327 2.25868 11.8317 3.01208 11.8317H8.99147C9.74487 11.8317 10.4672 11.5327 10.9999 10.9999C11.5327 10.4672 11.8317 9.74487 11.8317 8.99147C11.8317 7.11035 11.8317 4.8059 11.8317 4.8059C11.8317 4.55835 11.6308 4.35744 11.3832 4.35744C11.1357 4.35744 10.9348 4.55835 10.9348 4.8059V8.99147C10.9348 9.50689 10.7303 10.0014 10.3655 10.3655C10.0014 10.7303 9.50689 10.9348 8.99147 10.9348H3.01208C2.49666 10.9348 2.00216 10.7303 1.63802 10.3655C1.27328 10.0014 1.06878 9.50689 1.06878 8.99147C1.06878 7.2114 1.06878 4.79215 1.06878 3.01208C1.06878 2.49666 1.27328 2.00216 1.63802 1.63802C2.00216 1.27328 2.49666 1.06878 3.01208 1.06878H7.19765C7.4452 1.06878 7.64611 0.867875 7.64611 0.620329C7.64611 0.372782 7.4452 0.171875 7.19765 0.171875Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.6663 8.04272C11.6663 8.04272 10.4441 7.06569 9.56272 6.36072C8.87988 5.81361 7.8879 5.89792 7.3067 6.55206C5.95895 8.06783 3.27719 11.085 3.27719 11.085C3.11276 11.2698 3.1295 11.5538 3.31486 11.7182C3.49963 11.8827 3.78365 11.8659 3.94808 11.6806C3.94808 11.6806 6.62924 8.66398 7.97699 7.14761C8.24128 6.85043 8.69212 6.81216 9.00245 7.06091L11.1054 8.74351C11.2991 8.89777 11.5814 8.86668 11.7362 8.67355C11.8905 8.47981 11.8594 8.19759 11.6663 8.04272Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.60253 7.46337C6.60253 7.46337 5.01381 6.01935 4.04515 5.13859C3.46156 4.60822 2.58319 4.56636 1.95236 5.03993C1.25576 5.56193 0.351082 6.24059 0.351082 6.24059C0.153164 6.38888 0.113103 6.67051 0.261391 6.86842C0.40968 7.06634 0.691309 7.1064 0.889226 6.95811C0.889226 6.95811 1.79391 6.27945 2.49051 5.75745C2.77692 5.5422 3.17634 5.56073 3.44183 5.8023L5.99861 8.12708C6.18218 8.29331 6.4662 8.28016 6.63242 8.09719C6.79865 7.91362 6.7855 7.6296 6.60253 7.46337Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.4344 0.303272C10.2592 0.128076 9.97514 0.128076 9.79995 0.303272L7.68623 2.41698C7.60192 2.50129 7.55469 2.6155 7.55469 2.73449V4.00272C7.55469 4.25026 7.75559 4.45117 8.00314 4.45117H9.27137C9.39036 4.45117 9.50456 4.40393 9.58887 4.31962L11.7026 2.20591C11.8778 2.03072 11.8778 1.7467 11.7026 1.5715L10.4344 0.303272ZM10.1175 1.25459L10.7513 1.88841L9.08601 3.55426H8.4516V2.91985L10.1175 1.25459Z" />
                            <path d="M4.50628 3.60632C5.00163 3.60632 5.40319 3.20476 5.40319 2.70941C5.40319 2.21406 5.00163 1.8125 4.50628 1.8125C4.01093 1.8125 3.60938 2.21406 3.60938 2.70941C3.60938 3.20476 4.01093 3.60632 4.50628 3.60632Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ms-3 text-start">
                        <p className="p2 fw-700 mb-1 color-emerald-title-3" data-i18n="minigameSetting.uploadLuckyWheelBorderImage">{t("minigameSetting.uploadLuckyWheelBorderImage", "อัพโหลดรูปกรอบวงล้อ")}</p>
                        <p className="p4 fw-400 text-gray30 mb-0">
                          <b>
                            <span data-i18n="minigameSetting.uploadLuckyWheelBorderImageSize">{t("minigameSetting.uploadLuckyWheelBorderImageSize", "คำแนะนำ")}</span>
                          </b>
                          <span data-i18n="minigameSetting.uploadLuckyWheelBorderImageSize2">{t("minigameSetting.uploadLuckyWheelBorderImageSize2", ": ขนาดรูป 440 px x 440 px")}</span>
                          <br />
                          <span data-i18n="minigameSetting.uploadLuckyWheelBorderImageSize3">{t("minigameSetting.uploadLuckyWheelBorderImageSize3", "สกุล png, gif, jpg")}</span>
                        </p>
                        <div className="invalid-feedback" />
                      </div>
                      <input id="luckywheelFrame" type="file" className="d-none" data-error="โปรดอัพโหลดรูป กรอบวงล้อ (Please Upload Image)" onChange={(e) => dom.handleUploadBlob(e)} />
                    </div>
                    <div className="d-flex custom-input mb-3">
                      <div className="setting-minigame-upload-img" onClick={() => dom.clickById("luckywheelSpinBtn")}>
                        <svg id="luckywheelSpinBtnPlaceholder" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
                          <path fillRule="evenodd" clipRule="evenodd" d="M11.8898 0.765625H5.26262C4.06973 0.765625 2.92608 1.23899 2.08253 2.08253C1.23899 2.92608 0.765625 4.06973 0.765625 5.26262V14.73C0.765625 15.9229 1.23899 17.0665 2.08253 17.9101C2.92608 18.7536 4.06973 19.227 5.26262 19.227H14.73C15.9229 19.227 17.0665 18.7536 17.9101 17.9101C18.7536 17.0665 19.227 15.9229 19.227 14.73C19.227 11.7515 19.227 8.10283 19.227 8.10283C19.227 7.71088 18.9089 7.39278 18.5169 7.39278C18.125 7.39278 17.8069 7.71088 17.8069 8.10283V14.73C17.8069 15.5461 17.4831 16.329 16.9056 16.9056C16.329 17.4831 15.5461 17.8069 14.73 17.8069H5.26262C4.44653 17.8069 3.66358 17.4831 3.08702 16.9056C2.50951 16.329 2.18573 15.5461 2.18573 14.73C2.18573 11.9115 2.18573 8.08105 2.18573 5.26262C2.18573 4.44653 2.50951 3.66358 3.08702 3.08702C3.66358 2.50951 4.44653 2.18573 5.26262 2.18573H11.8898C12.2817 2.18573 12.5998 1.86763 12.5998 1.47568C12.5998 1.08373 12.2817 0.765625 11.8898 0.765625Z" fill="#C8C8C8" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M18.9618 13.2265C18.9618 13.2265 17.0267 11.6795 15.6312 10.5633C14.55 9.69706 12.9794 9.83055 12.0592 10.8663C9.92523 13.2663 5.67912 18.0435 5.67912 18.0435C5.41877 18.336 5.44528 18.7857 5.73877 19.0461C6.03131 19.3064 6.48101 19.2799 6.74136 18.9864C6.74136 18.9864 10.9865 14.2102 13.1205 11.8092C13.5389 11.3387 14.2528 11.2781 14.7441 11.672L18.0738 14.3361C18.3805 14.5803 18.8274 14.5311 19.0726 14.2253C19.3169 13.9186 19.2676 13.4717 18.9618 13.2265Z" fill="#C8C8C8" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M10.9475 12.3111C10.9475 12.3111 8.43202 10.0248 6.8983 8.63024C5.97429 7.79048 4.58353 7.72421 3.58473 8.47403C2.48178 9.30053 1.04937 10.3751 1.04937 10.3751C0.736 10.6099 0.672569 11.0558 0.907359 11.3691C1.14215 11.6825 1.58806 11.7459 1.90143 11.5112C1.90143 11.5112 3.33384 10.4366 4.43679 9.61011C4.89028 9.26928 5.5227 9.29863 5.94305 9.68111L9.99129 13.362C10.2819 13.6252 10.7316 13.6044 10.9948 13.3147C11.258 13.024 11.2372 12.5743 10.9475 12.3111Z" fill="#C8C8C8" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M17.0126 0.97367C16.7352 0.696277 16.2855 0.696277 16.0081 0.97367L12.6614 4.32038C12.5279 4.45387 12.4531 4.6347 12.4531 4.8231V6.83112C12.4531 7.22307 12.7712 7.54118 13.1632 7.54118H15.1712C15.3596 7.54118 15.5404 7.46638 15.6739 7.3329L19.0206 3.98618C19.298 3.70879 19.298 3.25909 19.0206 2.9817L17.0126 0.97367ZM16.5108 2.47993L17.5144 3.48347L14.8777 6.12107H13.8732V5.11659L16.5108 2.47993Z" fill="#C8C8C8" />
                          <path d="M7.63104 6.2074C8.41534 6.2074 9.05115 5.57159 9.05115 4.78729C9.05115 4.00299 8.41534 3.36719 7.63104 3.36719C6.84674 3.36719 6.21094 4.00299 6.21094 4.78729C6.21094 5.57159 6.84674 6.2074 7.63104 6.2074Z" fill="#C8C8C8" />
                        </svg>
                        {" "}
                        <img className="luckywheelSpinBtnSrc" src="https://p88.blob.core.windows.net/images/minigame/wheel-8/button.png" />
                        <div className="setting-minigame-upload-img-button system-btn-a">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M7.19765 0.171875H3.01208C2.25868 0.171875 1.53637 0.470844 1.00361 1.00361C0.470844 1.53637 0.171875 2.25868 0.171875 3.01208V8.99147C0.171875 9.74487 0.470844 10.4672 1.00361 10.9999C1.53637 11.5327 2.25868 11.8317 3.01208 11.8317H8.99147C9.74487 11.8317 10.4672 11.5327 10.9999 10.9999C11.5327 10.4672 11.8317 9.74487 11.8317 8.99147C11.8317 7.11035 11.8317 4.8059 11.8317 4.8059C11.8317 4.55835 11.6308 4.35744 11.3832 4.35744C11.1357 4.35744 10.9348 4.55835 10.9348 4.8059V8.99147C10.9348 9.50689 10.7303 10.0014 10.3655 10.3655C10.0014 10.7303 9.50689 10.9348 8.99147 10.9348H3.01208C2.49666 10.9348 2.00216 10.7303 1.63802 10.3655C1.27328 10.0014 1.06878 9.50689 1.06878 8.99147C1.06878 7.2114 1.06878 4.79215 1.06878 3.01208C1.06878 2.49666 1.27328 2.00216 1.63802 1.63802C2.00216 1.27328 2.49666 1.06878 3.01208 1.06878H7.19765C7.4452 1.06878 7.64611 0.867875 7.64611 0.620329C7.64611 0.372782 7.4452 0.171875 7.19765 0.171875Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.6663 8.04272C11.6663 8.04272 10.4441 7.06569 9.56272 6.36072C8.87988 5.81361 7.8879 5.89792 7.3067 6.55206C5.95895 8.06783 3.27719 11.085 3.27719 11.085C3.11276 11.2698 3.1295 11.5538 3.31486 11.7182C3.49963 11.8827 3.78365 11.8659 3.94808 11.6806C3.94808 11.6806 6.62924 8.66398 7.97699 7.14761C8.24128 6.85043 8.69212 6.81216 9.00245 7.06091L11.1054 8.74351C11.2991 8.89777 11.5814 8.86668 11.7362 8.67355C11.8905 8.47981 11.8594 8.19759 11.6663 8.04272Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.60253 7.46337C6.60253 7.46337 5.01381 6.01935 4.04515 5.13859C3.46156 4.60822 2.58319 4.56636 1.95236 5.03993C1.25576 5.56193 0.351082 6.24059 0.351082 6.24059C0.153164 6.38888 0.113103 6.67051 0.261391 6.86842C0.40968 7.06634 0.691309 7.1064 0.889226 6.95811C0.889226 6.95811 1.79391 6.27945 2.49051 5.75745C2.77692 5.5422 3.17634 5.56073 3.44183 5.8023L5.99861 8.12708C6.18218 8.29331 6.4662 8.28016 6.63242 8.09719C6.79865 7.91362 6.7855 7.6296 6.60253 7.46337Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.4344 0.303272C10.2592 0.128076 9.97514 0.128076 9.79995 0.303272L7.68623 2.41698C7.60192 2.50129 7.55469 2.6155 7.55469 2.73449V4.00272C7.55469 4.25026 7.75559 4.45117 8.00314 4.45117H9.27137C9.39036 4.45117 9.50456 4.40393 9.58887 4.31962L11.7026 2.20591C11.8778 2.03072 11.8778 1.7467 11.7026 1.5715L10.4344 0.303272ZM10.1175 1.25459L10.7513 1.88841L9.08601 3.55426H8.4516V2.91985L10.1175 1.25459Z" />
                            <path d="M4.50628 3.60632C5.00163 3.60632 5.40319 3.20476 5.40319 2.70941C5.40319 2.21406 5.00163 1.8125 4.50628 1.8125C4.01093 1.8125 3.60938 2.21406 3.60938 2.70941C3.60938 3.20476 4.01093 3.60632 4.50628 3.60632Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ms-3 text-start">
                        <p className="p2 fw-700 mb-1 color-emerald-title-3" data-i18n="minigameSetting.uploadLuckyWheelImageButton">{t("minigameSetting.uploadLuckyWheelImageButton", "อัพโหลดรูปปุ่มหมุนวงล้อ")}</p>
                        <p className="p4 fw-400 text-gray30 mb-0">
                          <b>
                            <span data-i18n="minigameSetting.uploadLuckyWheelImageButtonSize">{t("minigameSetting.uploadLuckyWheelImageButtonSize", "คำแนะนำ")}</span>
                          </b>
                          <span data-i18n="minigameSetting.uploadLuckyWheelImageButtonSize2">{t("minigameSetting.uploadLuckyWheelImageButtonSize2", ": ขนาดรูป 189 px x 189 px")}</span>
                          <br />
                          <span data-i18n="minigameSetting.uploadLuckyWheelImageButtonSize3">{t("minigameSetting.uploadLuckyWheelImageButtonSize3", "สกุล png, gif, jpg")}</span>
                        </p>
                        <div className="invalid-feedback" />
                      </div>
                      <input id="luckywheelSpinBtn" type="file" className="d-none" data-error="โปรดอัพโหลดรูป ปุ่มหมุนวงล้อ (Please Upload Image)" onChange={(e) => dom.handleUploadBlob(e)} />
                    </div>
                    <div className="d-flex custom-input mb-3">
                      <div className="setting-minigame-upload-img" onClick={() => dom.clickById("luckywheelGetReward")}>
                        <svg id="luckywheelGetRewardPlaceholder" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
                          <path fillRule="evenodd" clipRule="evenodd" d="M11.8898 0.765625H5.26262C4.06973 0.765625 2.92608 1.23899 2.08253 2.08253C1.23899 2.92608 0.765625 4.06973 0.765625 5.26262V14.73C0.765625 15.9229 1.23899 17.0665 2.08253 17.9101C2.92608 18.7536 4.06973 19.227 5.26262 19.227H14.73C15.9229 19.227 17.0665 18.7536 17.9101 17.9101C18.7536 17.0665 19.227 15.9229 19.227 14.73C19.227 11.7515 19.227 8.10283 19.227 8.10283C19.227 7.71088 18.9089 7.39278 18.5169 7.39278C18.125 7.39278 17.8069 7.71088 17.8069 8.10283V14.73C17.8069 15.5461 17.4831 16.329 16.9056 16.9056C16.329 17.4831 15.5461 17.8069 14.73 17.8069H5.26262C4.44653 17.8069 3.66358 17.4831 3.08702 16.9056C2.50951 16.329 2.18573 15.5461 2.18573 14.73C2.18573 11.9115 2.18573 8.08105 2.18573 5.26262C2.18573 4.44653 2.50951 3.66358 3.08702 3.08702C3.66358 2.50951 4.44653 2.18573 5.26262 2.18573H11.8898C12.2817 2.18573 12.5998 1.86763 12.5998 1.47568C12.5998 1.08373 12.2817 0.765625 11.8898 0.765625Z" fill="#C8C8C8" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M18.9618 13.2265C18.9618 13.2265 17.0267 11.6795 15.6312 10.5633C14.55 9.69706 12.9794 9.83055 12.0592 10.8663C9.92523 13.2663 5.67912 18.0435 5.67912 18.0435C5.41877 18.336 5.44528 18.7857 5.73877 19.0461C6.03131 19.3064 6.48101 19.2799 6.74136 18.9864C6.74136 18.9864 10.9865 14.2102 13.1205 11.8092C13.5389 11.3387 14.2528 11.2781 14.7441 11.672L18.0738 14.3361C18.3805 14.5803 18.8274 14.5311 19.0726 14.2253C19.3169 13.9186 19.2676 13.4717 18.9618 13.2265Z" fill="#C8C8C8" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M10.9475 12.3111C10.9475 12.3111 8.43202 10.0248 6.8983 8.63024C5.97429 7.79048 4.58353 7.72421 3.58473 8.47403C2.48178 9.30053 1.04937 10.3751 1.04937 10.3751C0.736 10.6099 0.672569 11.0558 0.907359 11.3691C1.14215 11.6825 1.58806 11.7459 1.90143 11.5112C1.90143 11.5112 3.33384 10.4366 4.43679 9.61011C4.89028 9.26928 5.5227 9.29863 5.94305 9.68111L9.99129 13.362C10.2819 13.6252 10.7316 13.6044 10.9948 13.3147C11.258 13.024 11.2372 12.5743 10.9475 12.3111Z" fill="#C8C8C8" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M17.0126 0.97367C16.7352 0.696277 16.2855 0.696277 16.0081 0.97367L12.6614 4.32038C12.5279 4.45387 12.4531 4.6347 12.4531 4.8231V6.83112C12.4531 7.22307 12.7712 7.54118 13.1632 7.54118H15.1712C15.3596 7.54118 15.5404 7.46638 15.6739 7.3329L19.0206 3.98618C19.298 3.70879 19.298 3.25909 19.0206 2.9817L17.0126 0.97367ZM16.5108 2.47993L17.5144 3.48347L14.8777 6.12107H13.8732V5.11659L16.5108 2.47993Z" fill="#C8C8C8" />
                          <path d="M7.63104 6.2074C8.41534 6.2074 9.05115 5.57159 9.05115 4.78729C9.05115 4.00299 8.41534 3.36719 7.63104 3.36719C6.84674 3.36719 6.21094 4.00299 6.21094 4.78729C6.21094 5.57159 6.84674 6.2074 7.63104 6.2074Z" fill="#C8C8C8" />
                        </svg>
                        {" "}
                        <img className="luckywheelGetRewardSrc" src="https://p88.blob.core.windows.net/images/minigame/wheel-8/popup.png" />
                        <div className="setting-minigame-upload-img-button system-btn-a">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M7.19765 0.171875H3.01208C2.25868 0.171875 1.53637 0.470844 1.00361 1.00361C0.470844 1.53637 0.171875 2.25868 0.171875 3.01208V8.99147C0.171875 9.74487 0.470844 10.4672 1.00361 10.9999C1.53637 11.5327 2.25868 11.8317 3.01208 11.8317H8.99147C9.74487 11.8317 10.4672 11.5327 10.9999 10.9999C11.5327 10.4672 11.8317 9.74487 11.8317 8.99147C11.8317 7.11035 11.8317 4.8059 11.8317 4.8059C11.8317 4.55835 11.6308 4.35744 11.3832 4.35744C11.1357 4.35744 10.9348 4.55835 10.9348 4.8059V8.99147C10.9348 9.50689 10.7303 10.0014 10.3655 10.3655C10.0014 10.7303 9.50689 10.9348 8.99147 10.9348H3.01208C2.49666 10.9348 2.00216 10.7303 1.63802 10.3655C1.27328 10.0014 1.06878 9.50689 1.06878 8.99147C1.06878 7.2114 1.06878 4.79215 1.06878 3.01208C1.06878 2.49666 1.27328 2.00216 1.63802 1.63802C2.00216 1.27328 2.49666 1.06878 3.01208 1.06878H7.19765C7.4452 1.06878 7.64611 0.867875 7.64611 0.620329C7.64611 0.372782 7.4452 0.171875 7.19765 0.171875Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.6663 8.04272C11.6663 8.04272 10.4441 7.06569 9.56272 6.36072C8.87988 5.81361 7.8879 5.89792 7.3067 6.55206C5.95895 8.06783 3.27719 11.085 3.27719 11.085C3.11276 11.2698 3.1295 11.5538 3.31486 11.7182C3.49963 11.8827 3.78365 11.8659 3.94808 11.6806C3.94808 11.6806 6.62924 8.66398 7.97699 7.14761C8.24128 6.85043 8.69212 6.81216 9.00245 7.06091L11.1054 8.74351C11.2991 8.89777 11.5814 8.86668 11.7362 8.67355C11.8905 8.47981 11.8594 8.19759 11.6663 8.04272Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.60253 7.46337C6.60253 7.46337 5.01381 6.01935 4.04515 5.13859C3.46156 4.60822 2.58319 4.56636 1.95236 5.03993C1.25576 5.56193 0.351082 6.24059 0.351082 6.24059C0.153164 6.38888 0.113103 6.67051 0.261391 6.86842C0.40968 7.06634 0.691309 7.1064 0.889226 6.95811C0.889226 6.95811 1.79391 6.27945 2.49051 5.75745C2.77692 5.5422 3.17634 5.56073 3.44183 5.8023L5.99861 8.12708C6.18218 8.29331 6.4662 8.28016 6.63242 8.09719C6.79865 7.91362 6.7855 7.6296 6.60253 7.46337Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.4344 0.303272C10.2592 0.128076 9.97514 0.128076 9.79995 0.303272L7.68623 2.41698C7.60192 2.50129 7.55469 2.6155 7.55469 2.73449V4.00272C7.55469 4.25026 7.75559 4.45117 8.00314 4.45117H9.27137C9.39036 4.45117 9.50456 4.40393 9.58887 4.31962L11.7026 2.20591C11.8778 2.03072 11.8778 1.7467 11.7026 1.5715L10.4344 0.303272ZM10.1175 1.25459L10.7513 1.88841L9.08601 3.55426H8.4516V2.91985L10.1175 1.25459Z" />
                            <path d="M4.50628 3.60632C5.00163 3.60632 5.40319 3.20476 5.40319 2.70941C5.40319 2.21406 5.00163 1.8125 4.50628 1.8125C4.01093 1.8125 3.60938 2.21406 3.60938 2.70941C3.60938 3.20476 4.01093 3.60632 4.50628 3.60632Z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ms-3 text-start">
                        <p className="p2 fw-700 mb-1 color-emerald-title-3" data-i18n="minigameSetting.uploadLuckyWheelImageAfterOpen">{t("minigameSetting.uploadLuckyWheelImageAfterOpen", "อัพโหลดรูปตอนได้รับรางวัล")}</p>
                        <p className="p4 fw-400 text-gray30 mb-3">
                          <b>
                            <span data-i18n="minigameSetting.uploadLuckyWheelImageAfterOpenSize">{t("minigameSetting.uploadLuckyWheelImageAfterOpenSize", "คำแนะนำ")}</span>
                          </b>
                          <span data-i18n="minigameSetting.uploadLuckyWheelImageAfterOpenSize2">{t("minigameSetting.uploadLuckyWheelImageAfterOpenSize2", ": รูปต้องเว้นพื้นที่สำรับคำ")}</span>
                          <br />
                          <span data-i18n="minigameSetting.uploadLuckyWheelImageAfterOpenSize3">{t("minigameSetting.uploadLuckyWheelImageAfterOpenSize3", "อธิบายของรางวัลไว้ตรงกลางของภาพ")}</span>
                          <br />
                          <span data-i18n="minigameSetting.uploadLuckyWheelImageAfterOpenSize4">{t("minigameSetting.uploadLuckyWheelImageAfterOpenSize4", "ที่ขนาด 200x200 px")}</span>
                          <br />
                          <span data-i18n="minigameSetting.uploadLuckyWheelImageAfterOpenSize5">{t("minigameSetting.uploadLuckyWheelImageAfterOpenSize5", " ขนาดรูปโดยรวมที่แนะนำคือ")}</span>
                          <br />
                          <span data-i18n="minigameSetting.uploadLuckyWheelImageAfterOpenSize6">{t("minigameSetting.uploadLuckyWheelImageAfterOpenSize6", "342 px x 240 px สกุล png, gif, jpg")}</span>
                        </p>
                        <div className="invalid-feedback" />
                      </div>
                      <input id="luckywheelGetReward" type="file" className="d-none" data-error="โปรดอัพโหลดรูป ตอนได้รับรางวัล (Please Upload Image)" onChange={(e) => dom.handleUploadBlob(e)} />
                    </div>
                  </div>
                  <div className="custom-input custom-float d-none">
                    <div className="text-start p2 color-emerald-title-1 fw-700 mb-2" data-i18n="minigameSetting.uploadLuckyWheelSound">{t("minigameSetting.uploadLuckyWheelSound", "เลือกเสียงประกอบวงล้อ")}</div>
                    <div id="customLuckywheelSoundEffectDropdown" className="custom-input dropdown-wrapper disabled fill">
                      <div className="dropdown-toggler">
                        <svg width="16" height="8" viewBox="0 0 16 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.37427 2.12485C2.37427 1.88497 2.46582 1.64497 2.64893 1.46216C3.01514 1.09595 3.6084 1.09595 3.97461 1.46216L7.99927 5.48813L12.0247 1.46216C12.3909 1.09595 12.9841 1.09595 13.3503 1.46216C13.7166 1.82837 13.7166 2.42163 13.3503 2.78784L8.66284 7.47534C8.29663 7.84155 7.70337 7.84155 7.33716 7.47534L2.64966 2.78784C2.46509 2.60474 2.37427 2.36479 2.37427 2.12485Z" />
                        </svg>
                      </div>
                      <div className="input-fake multiple">เสียงดนตรี 1</div>
                      <div className="custom-dropdown">
                        <div className="custom-dropdown-body">
                          <div data-value="/audios/spin-tick.mp3" data-chip="/audios/spin-tick.mp3" className="custom-dropdown-item selected" data-i18n="minigameSetting.luckyWheelSound1">{t("minigameSetting.luckyWheelSound1", "เสียงดนตรี 1")}</div>
                          <div data-value="/audios/spin-tick.mp3" data-chip="/audios/spin-tick.mp3" className="custom-dropdown-item selected" data-i18n="minigameSetting.luckyWheelSound2">{t("minigameSetting.luckyWheelSound2", "เสียงดนตรี 2")}</div>
                          <div data-value="/audios/spin-tick.mp3" data-chip="/audios/spin-tick.mp3" className="custom-dropdown-item selected" data-i18n="minigameSetting.luckyWheelSound3">{t("minigameSetting.luckyWheelSound3", "เสียงดนตรี 3")}</div>
                        </div>
                      </div>
                      <div className="invalid-feedback" id="error-LuckywheelSoundEffectDropdown" data-i18n="minigameSetting.uploadLuckyWheelSoundErrorText" style={{ display: "none" }}>{t("minigameSetting.uploadLuckyWheelSoundErrorText", "กรุณาเลือกเสียงประกอบวงล้อ")}</div>
                    </div>
                  </div>
                  <div className="my-3">
                    <button className="btn system-btn btn-rounded w-100" id="btnWindowTestLuckywheelSpin" onClick={() => dom.openLegacyOffcanvas("minigameTestLayout")} data-bs-focus="false" aria-modal="true" role="dialog" data-i18n="minigameSetting.testLuckyWheel">{t("minigameSetting.testLuckyWheel", "ทดลองหมุนวงล้อ")}</button>
                  </div>
                </div>
                <div className="d-flex col-7 mb-3 flex-column align-items-center justify-content-center">
                  <div className="d-flex w-100 mb-3 flex-column align-items-end justify-content-center mb-1">
                    <button className="btn system-btn btn-rounded btn-outline btn-default btnSetDefault disabled" data-bs-focus="false" aria-modal="true" role="dialog" data-i18n="minigameSetting.resetToDefault" onClick={() => dom.setDefaultImg(sliceCount)}>{t("minigameSetting.resetToDefault", "คืนค่าเริ่มต้น")}</button>
                  </div>
                  <div className="wheel-main">
                    <WheelShow id="wheelShow1" count={sliceCount} />
                    <WheelInputs count={sliceCount} />
                  </div>
                  <div className="mt-5 p4 text-gray30">
                    <div>
                      <span data-i18n="minigameSetting.pressIcon">{t("minigameSetting.pressIcon", "กดที่รูป icon")}</span>
                      <img src="/assets/images/minigame/add-img.png" width="16" height="16" />
                      <span data-i18n="minigameSetting.pressIcon2">{t("minigameSetting.pressIcon2", "หรือกดที่รูปชิ้นส่วนของวงล้อ เพื่อทำการอัพโหลดรูป")}</span>
                    </div>
                    <div className="mb-3">
                      <span className="fw-700">{"คำแนะนำ : "}</span>
                      <span id="showLabalLuckywheelImagePixel">{IMAGE_HINT[sliceCount] ?? IMAGE_HINT[8]}</span>
                    </div>
                    <a className="fw-700 txt-download-template color-emerald-title-3" href="/files/all_spin_template.zip" data-i18n="minigameSetting.downloadTemplateForLuckyWheel" target="_blank">{t("minigameSetting.downloadTemplateForLuckyWheel", "ดาวน์โหลด Template สำหรับทำรูปวงล้อ")}</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="minigame-test-layout justify-content-center align-items-center flex-column" tabIndex={-1} role="dialog" id="minigameTestLayout">
              <span className="p1 fw-700 mb-4" data-i18n="minigameSetting.testingOpenMinigame">{t("minigameSetting.testingOpenMinigame", "กำหนดเงื่อนไขการรับโบนัส")}</span>
              <div className="wheel-main">
                <WheelShow id="wheelShowTest" count={sliceCount} test />
              </div>
              <div className="wheel-display-reward-main" id="wheelDisplayRewardMain">
                <div className="position-relative">
                  <img draggable="false" src="https://p88.blob.core.windows.net/images/minigame/wheel-8/popup.png" className="luckywheelGetRewardSrc" />
                  <div id="wheelDisplayRewardText" className="position-absolute top-50 start-50 translate-middle wheel-display-reward-text">
                    <span data-i18n="minigameSetting.luckyWheelCongratsText1" style={{ color: "rgb(255, 255, 255)", fontFamily: "Kanit", fontSize: "18px", fontWeight: "600", textAlign: "center" }}>{t("minigameSetting.luckyWheelCongratsText1", "ยินดีด้วย !!!")}</span>
                    <p data-i18n="minigameSetting.luckyWheelCongratsText2" style={{ color: "rgb(255, 255, 255)", fontFamily: "Kanit", fontSize: "14px", fontWeight: "400", textAlign: "center" }}>{t("minigameSetting.luckyWheelCongratsText2", "คุณได้รางวัลเครคิด 1,500 เครดิต")}</p>
                    <span data-i18n="minigameSetting.luckyWheelCongratsText3" style={{ color: "rgb(236, 193, 123)", fontFamily: "Kanit", fontSize: "14px", fontWeight: "400", textAlign: "center" }}>{t("minigameSetting.luckyWheelCongratsText3", "กรุณติดต่อแอดมิน")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4">
            <div className="label-minigame minigameShowLayout label-minigame-custom-v2" style={shownWhen(mini)}>
              <span data-i18n="minigameSetting.minigameEditAndSetting">{t("minigameSetting.minigameEditAndSetting", "การปรับแต่งและตั้งค่ามินิเกมส์")}</span>
            </div>
          </div>
          <div className="input-col-1-p position-relative minigameShowLayout p-4" style={shownWhen(mini)}>
            <div>
              <div className="d-flex justify-content-between align-items-center p2 fw-700">
                <div className="d-none align-items-center gap-2">
                  <span className="color-emerald-title-1" data-i18n="minigameSetting.luckyWheelSlice">{t("minigameSetting.luckyWheelSlice", "จำนวนชิ้นส่วน :")}</span>
                  <div id="customNumberPartsMinigame" className="custom-input dropdown-wrapper fill">
                    <div className="dropdown-toggler" style={{ height: "32px" }}>
                      <svg width="16" height="8" viewBox="0 0 16 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.37427 2.12485C2.37427 1.88497 2.46582 1.64497 2.64893 1.46216C3.01514 1.09595 3.6084 1.09595 3.97461 1.46216L7.99927 5.48813L12.0247 1.46216C12.3909 1.09595 12.9841 1.09595 13.3503 1.46216C13.7166 1.82837 13.7166 2.42163 13.3503 2.78784L8.66284 7.47534C8.29663 7.84155 7.70337 7.84155 7.33716 7.47534L2.64966 2.78784C2.46509 2.60474 2.37427 2.36479 2.37427 2.12485Z" />
                      </svg>
                    </div>
                    <div className="input-fake multiple p2 fw-700" style={{ height: "32px", width: "127px" }}>6 ชิ้น</div>
                    <div className="custom-dropdown">
                      <div className="custom-dropdown-body">
                        <div data-value="3" data-chip="3" className="custom-dropdown-item">
                          {"3 "}
                          <span data-i18n="minigameSetting.piece">{t("minigameSetting.piece", "ชิ้น")}</span>
                        </div>
                        <div data-value="6" data-chip="6" className="custom-dropdown-item selected">
                          {"6 "}
                          <span data-i18n="minigameSetting.piece">{t("minigameSetting.piece", "ชิ้น")}</span>
                        </div>
                        <div data-value="9" data-chip="9" className="custom-dropdown-item">
                          {"9 "}
                          <span data-i18n="minigameSetting.piece">{t("minigameSetting.piece", "ชิ้น")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="invalid-feedback" id="error-customNumberPartsMinigame" data-i18n="minigameSetting.minigameSettingErrorText" style={{ display: "none" }}>{t("minigameSetting.minigameSettingErrorText", "กรุณาเลือกประเภทการฝาก")}</div>
                  </div>
                </div>
              </div>
              <div className="justify-content-between align-items-center p2 fw-700 col-12">
                <div className="row ms-0">
                  <div className="col">
                    <div className="form-check">
                      <input className="form-check-input me-2" type="radio" name="turnOverBeforeOrAfterMiniGame" id="turnOverBeforeMiniGame" data-value="true" defaultChecked value="true" />
                      {" "}
                      <label className="form-check-label d-flex flex-column" htmlFor="turnOverBeforeMiniGame">
                        <span className="p2 color-emerald-title-1 pt-1" data-i18n="minigameSetting.settingGetBeforeTurnOver">{t("minigameSetting.settingGetBeforeTurnOver", "ได้รับก่อนทำเทิร์นโอเวอร์สำเร็จ")}</span>
                        {" "}
                        <small className="txt-small-radio">
                          <span data-i18n="minigameSetting.getBeforeTurnOverSubText1">{t("minigameSetting.getBeforeTurnOverSubText1", "หลังจากเล่นมินิเกมส์ สมาชิกจะได้รับโบนัสทันที")}</span>
                          <br />
                          {" "}
                          <span data-i18n="minigameSetting.getBeforeTurnOverSubText2">{t("minigameSetting.getBeforeTurnOverSubText2", "แล้วค่อยไปทำเทิร์นโอเวอร์")}</span>
                        </small>
                      </label>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-check">
                      <input className="form-check-input me-2" type="radio" name="turnOverBeforeOrAfterMiniGame" id="turnOverAfterMiniGame" data-value="false" value="false" />
                      {" "}
                      <label className="form-check-label d-flex flex-column" htmlFor="turnOverAfterMiniGame">
                        <span className="p2 color-emerald-title-1 pt-1" data-i18n="minigameSetting.settingGetAfterTurnOver">{t("minigameSetting.settingGetAfterTurnOver", "ได้รับหลังทำเทิร์นโอเวอร์สำเร็จ")}</span>
                        {" "}
                        <small className="txt-small-radio">
                          <span data-i18n="minigameSetting.getAfterTurnOverSubText1">{t("minigameSetting.getAfterTurnOverSubText1", "หลังจากเล่นมินิเกมส์ สมาชิกจะจ้องทำเทิร์นโอเวอร์ให้สำเร็จก่อน")}</span>
                          <br />
                          {" "}
                          <span data-i18n="minigameSetting.getAfterTurnOverSubText2">{t("minigameSetting.getAfterTurnOverSubText2", "ถึงจะได้รับโบนัส")}</span>
                        </small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4 d-none">
                <div className="col-6 mb-3">
                  <div className="minigame-upload-field">
                    <div className="d-flex justify-content-center align-items-center p2 color-emerald-title-3 fw-700 mb-1  gap-1">
                      <span>อัพโหลดรูปก่อนเปิด</span>
                      <img src="/assets/images/minigame/add-img.png" width="24" height="24" />
                    </div>
                    <label className="position-relative cursor-pointer" htmlFor="imgMinigameReward" /* STYLE-MISSING height width */>
                      <div className="box-img1 h-100">
                        <img src="/assets/images/promotion/img-upload.png" className="img-fluid" id="imgMinigameRewardPlaceholder" style={{ display: "none", zIndex: "-99" }} />
                        <div className="box-img2">
                          <div className="d-flex align-items-center gap-3 h-100" id="eleMinigameReward">
                            <img src="https://p88.blob.core.windows.net/images/minigame/minigame-reward.png" className="box-img3 showImagePreviewPromotionDetail imgMinigameRewardMainSrc" />
                          </div>
                        </div>
                      </div>
                    </label>
                    {" "}
                    <input type="file" id="imgMinigameReward" className="d-none" data-error="โปรดอัพโหลดรูป อัพโหลดก่อนเปิด" onChange={(e) => dom.handleUploadBlob(e)} />
                    <div className="ms-3 text-center">
                      <p className="p4 fw-400 text-gray30 mb-2">
                        <b>
                          <span data-i18n="minigameSetting.minigameImageBeforeOpen">{t("minigameSetting.minigameImageBeforeOpen", "คำแนะนำ")}</span>
                        </b>
                        <span data-i18n="minigameSetting.minigameImageBeforeOpen2">{t("minigameSetting.minigameImageBeforeOpen2", ": ขนาดรูป 112px x 112px / สกุล png, gif, jpg")}</span>
                        <br />
                        <span data-i18n="minigameSetting.minigameImageBeforeOpen3">{t("minigameSetting.minigameImageBeforeOpen3", "โดยจะต้องเว้นพื้นที่ตรงกลางไว้ใส่คำอธิบายรางวัลด้วย")}</span>
                      </p>
                      <div className="invalid-feedback" />
                    </div>
                  </div>
                  <div className="custom-input custom-float">
                    <div className="text-start p2 color-emerald-title-1 fw-700 mb-2" data-i18n="minigameSetting.uploadMinigameSound">{t("minigameSetting.uploadMinigameSound", "เลือกเสียงประกอบวงล้อ")}</div>
                    <div id="customMinigameSoundEffectDropdown" className="custom-input dropdown-wrapper disabled fill">
                      <div className="dropdown-toggler">
                        <svg width="16" height="8" viewBox="0 0 16 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.37427 2.12485C2.37427 1.88497 2.46582 1.64497 2.64893 1.46216C3.01514 1.09595 3.6084 1.09595 3.97461 1.46216L7.99927 5.48813L12.0247 1.46216C12.3909 1.09595 12.9841 1.09595 13.3503 1.46216C13.7166 1.82837 13.7166 2.42163 13.3503 2.78784L8.66284 7.47534C8.29663 7.84155 7.70337 7.84155 7.33716 7.47534L2.64966 2.78784C2.46509 2.60474 2.37427 2.36479 2.37427 2.12485Z" />
                        </svg>
                      </div>
                      <div className="input-fake multiple">เสียงดนตรี 1</div>
                      <div className="custom-dropdown">
                        <div className="custom-dropdown-body">
                          <div data-value="1" data-chip="1" className="custom-dropdown-item selected" data-i18n="minigameSetting.minigameSound1">{t("minigameSetting.minigameSound1", "เสียงดนตรี 1")}</div>
                          <div data-value="2" data-chip="2" className="custom-dropdown-item" data-i18n="minigameSetting.minigameSound2">{t("minigameSetting.minigameSound2", "เสียงดนตรี 2")}</div>
                          <div data-value="3" data-chip="3" className="custom-dropdown-item" data-i18n="minigameSetting.minigameSound3">{t("minigameSetting.minigameSound3", "เสียงดนตรี 3")}</div>
                        </div>
                      </div>
                      <div className="invalid-feedback" id="error-customMinigameSoundEffectDropdown" data-i18n="minigameSetting.uploadMinigameSoundErrorText" style={{ display: "none" }}>{t("minigameSetting.uploadMinigameSoundErrorText", "กรุณาเลือกเสียงประกอบวงล้อ")}</div>
                    </div>
                  </div>
                  <div className="my-3">
                    <button className="btn system-btn btn-rounded w-100" id="btnWindowTestMinigame" onClick={() => dom.openLegacyOffcanvas("minigameTestLayout2")} data-bs-focus="false" aria-modal="true" role="dialog" data-i18n="minigameSetting.testMinigame">{t("minigameSetting.testMinigame", "ทดลองกดเปิด")}</button>
                  </div>
                </div>
                <div className="d-flex col-6 mb-3 flex-column align-items-center justify-content-space-between">
                  <div className="d-flex w-100 mb-3 flex-column align-items-end justify-content-center mb-1">
                    <button className="btn system-btn btn-rounded btn-outline btn-default btnSetDefault disabled" data-bs-focus="false" aria-modal="true" role="dialog" data-i18n="minigameSetting.resetToDefault" onClick={() => dom.setDefaultImg(sliceCount)}>{t("minigameSetting.resetToDefault", "คืนค่าเริ่มต้น")}</button>
                  </div>
                  <div>
                    <div className="d-flex justify-content-center align-items-center p2 color-emerald-title-3 fw-700 mb-1 gap-1">
                      <span data-i18n="minigameSetting.updatePopup">{t("minigameSetting.updatePopup", "อัพโหลดหลังเปิด (Pop up)")}</span>
                      <img src="/assets/images/minigame/add-img.png" width="24" height="24" />
                    </div>
                    <label className="position-relative cursor-pointer" htmlFor="imgMinigamePopup" /* STYLE-MISSING height width */>
                      <div className="box-img1 h-100">
                        <img src="/assets/images/promotion/img-upload.png" className="img-fluid" id="imgMinigamePopupPlaceholder" style={{ display: "none", zIndex: "-99" }} />
                        <div className="box-img2">
                          <div className="d-flex align-items-center gap-3 h-100">
                            <img src="https://p88.blob.core.windows.net/images/minigame/minigame-popup.png" className="box-img3 showImagePreviewPromotionDetail imgMinigamePopupSrc" />
                          </div>
                        </div>
                      </div>
                    </label>
                    {" "}
                    <input type="file" id="imgMinigamePopup" className="d-none" data-error="โปรดอัพโหลดรูป อัพโหลดหลังเปิด (Please upload Pop up impage.)" onChange={(e) => dom.handleUploadBlob(e)} />
                    <div className="ms-3 text-start">
                      <p className="p4 fw-400 text-gray30 mb-2">
                        <b>
                          <span data-i18n="minigameSetting.uploadPopup">{t("minigameSetting.uploadPopup", "คำแนะนำ")}</span>
                        </b>
                        <span data-i18n="minigameSetting.uploadPopup2">{t("minigameSetting.uploadPopup2", ": ขนาดรูป 342px x 240px / สกุล png, gif, jpg")}</span>
                        <br />
                        <span data-i18n="minigameSetting.uploadPopup3">{t("minigameSetting.uploadPopup3", "โดยจะต้องเว้นพื้นที่ตรงกลางไว้ใส่คำอธิบายรางวัลด้วย")}</span>
                      </p>
                      <div className="invalid-feedback" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="minigame-test-layout justify-content-center align-items-center flex-column" tabIndex={-1} role="dialog" id="minigameTestLayout">
              <span className="p1 fw-700 mb-4" data-i18n="minigameSetting.testingOpenMinigame">{t("minigameSetting.testingOpenMinigame", "กำหนดเงื่อนไขการรับโบนัส")}</span>
              <div className="wheel-main">
                <WheelShow id="wheelShow1" count={8} />
              </div>
              <div className="wheel-display-reward-main" id="wheelDisplayRewardMain">
                <div className="position-relative">
                  <img draggable="false" src="https://p88.blob.core.windows.net/images/minigame/wheel-8/popup.png" className="luckywheelGetRewardSrc" />
                  <div id="wheelDisplayRewardText" className="position-absolute top-50 start-50 translate-middle wheel-display-reward-text">
                    <span data-i18n="minigameSetting.luckyWheelCongratsText1" /* STYLE-MISSING font-family font-size font-weight text-align color */>{t("minigameSetting.luckyWheelCongratsText1", "ยินดีด้วย !!!")}</span>
                    <p data-i18n="minigameSetting.luckyWheelCongratsText2" /* STYLE-MISSING font-family font-size font-weight text-align color */>{t("minigameSetting.luckyWheelCongratsText2", "คุณได้รางวัลเครคิด 1,500 เครดิต")}</p>
                    <span data-i18n="minigameSetting.luckyWheelCongratsText3" /* STYLE-MISSING font-family font-size font-weight text-align color */>{t("minigameSetting.luckyWheelCongratsText3", "กรุณติดต่อแอดมิน")}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="minigame-test-layout justify-content-center align-items-center flex-column" tabIndex={-1} role="dialog" id="minigameTestLayout2">
              <span className="p1 fw-700 mb-4" data-i18n="minigameSetting.testingOpenMinigame">{t("minigameSetting.testingOpenMinigame", "กำหนดเงื่อนไขการรับโบนัส")}</span>
              <div className="minigame-main">
                <div className="minigame-wrapper">
                  <div className="custom-minigame minigame-6 test-spin" data-deg="0">
                    <div className="minigame-item-all" id="minigameShowTest">
                      <div className="card-item" id="item-wheel-1" style={{ "--item": "1" } as CSSProperties} onClick={() => dom.testMinigame()}>
                        <div className="card-image">
                          <img src="https://p88.blob.core.windows.net/images/minigame/minigame-reward.png" className="imgMinigameRewardSrc" />
                        </div>
                      </div>
                      {/* 9 choice cards in the original; this test layout is hidden (d-none) — only card 1 was captured */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="wheel-display-reward-main" id="minigameDisplayRewardMain">
                <div className="position-relative">
                  <img draggable="false" src="https://p88.blob.core.windows.net/images/minigame/minigame-popup.png" className="imgMinigamePopupSrc" />
                  <div id="wheelDisplayRewardText" className="position-absolute top-50 start-50 translate-middle wheel-display-reward-text">
                    <span data-i18n="minigameSetting.luckyWheelCongratsText1" /* STYLE-MISSING font-family font-size font-weight text-align color */>{t("minigameSetting.luckyWheelCongratsText1", "ยินดีด้วย !!!")}</span>
                    <p data-i18n="minigameSetting.luckyWheelCongratsText2" /* STYLE-MISSING font-family font-size font-weight text-align color */>{t("minigameSetting.luckyWheelCongratsText2", "คุณได้รางวัลเครคิด 1,500 เครดิต")}</p>
                    <span data-i18n="minigameSetting.luckyWheelCongratsText3" /* STYLE-MISSING font-family font-size font-weight text-align color */>{t("minigameSetting.luckyWheelCongratsText3", "กรุณติดต่อแอดมิน")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="custom-minigame-wheel-section" id="customMinigameWheelSection">
          {Array.from({ length: sliceCount }, (_, i) => (
          <SliceSection key={i} n={i + 1} type={type} slice={initial?.detail.slices[i]} gameItems={gameItems} />
          ))}
        </div>
      </div>
    </div>

    <div className="canvas-box-body-custom-mini-game">
      <div className="main-in-detail-body-custom content-col-1">
        <div className="label-minigame-custom">
          <span data-i18n="minigameSetting.displayPresetMinigame">{t("minigameSetting.displayPresetMinigame", "การแสดงผลภาพรวมมินิเกมส์")}</span>
        </div>
        <div className="title-set-color-mini-game">
          <h4 data-i18n="minigameSetting.displayPresetMinigameSetColor">{t("minigameSetting.displayPresetMinigameSetColor", "กำหนดสีสันในส่วนต่าง ๆ ของมินิเกมส์")}</h4>
          <p className="mb-0" data-i18n="minigameSetting.displayPresetMinigameSetColorText">{t("minigameSetting.displayPresetMinigameSetColorText", "คุณสามารถกำหนดสีสันในส่วนต่าง ๆ ของหน้าเล่นมินิเกมส์ได้อย่างอีกสระ เพื่อให้สีสันของเกมส์นั้นกลมกลืนไปกับ ธีมเว็บไซต์ของคุณ")}</p>
        </div>
        <div className="box-main-set-color-mini-game">
          <div className="title-main-set-color-mini-game">
            <h4 className="mb-0" data-i18n="minigameSetting.displayPresetMinigameSetting">{t("minigameSetting.displayPresetMinigameSetting", "ปรับสีหรือรูปภาพพื้นหลังหน้าจอ")}</h4>
            <h5 className="set-default-color mb-0" data-default-color-type="bg" data-i18n="minigameSetting.displayPresetMinigameReset">{t("minigameSetting.displayPresetMinigameReset", "คืนค่าเริ่มต้น")}</h5>
          </div>
          <div className="body-main-set-color-mini-game">
            <div className="session-set-bg-screen-main">
              <div className="w-50">
                <div className="title">
                  <h4 data-i18n="minigameSetting.displayPresetBackgroundSetting">{t("minigameSetting.displayPresetBackgroundSetting", "ปรับแต่งพื้นหลังมินิเกมส์ด้วยรูปของคุณ")}</h4>
                </div>
                <div className="box-session-upload-img-bg-mini-game">
                  <div className="set-bg-img">
                    <div className="box-set">
                      <div className="btn-close-img-bg-mobile-mini-game" style={{ display: "none" }}>
                        <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                      </div>
                      <img className="img-bg-mb-show-in-box-upload" alt="img" style={{ display: "none" }} />
                      {" "}
                      <img className="img-default-bg-mb-mini-game" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                      {" "}
                      <input type="hidden" id="imgBgMobileMiniGame" />
                    </div>
                    <div className="session-btn-upload-bg">
                      {/* ORIGINAL: labelled "การแสดงผลภาพรวมมินิเกมส์" (displayPresetMinigame). Renamed to what the field is, PK 20/11/2026 */}
                      <div className="title-btn-upload-bg" data-i18n="minigameSetting.displayPresetMobileBackground">{t("minigameSetting.displayPresetMobileBackground", "รูปพื้นหลังเวอร์ชั่น Mobile")}</div>
                      <label className="btn-upload-bg" htmlFor="fileImageUploadBgMobileMiniGame">
                        <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                        {" "}
                        <span data-i18n="minigameSetting.uploadImage">{t("minigameSetting.uploadImage", "อัพโหลดรูป")}</span>
                        {" "}
                        <input type="file" id="fileImageUploadBgMobileMiniGame" style={{ display: "none" }} />
                      </label>
                    </div>
                  </div>
                  <div className="footer-set-bg-direction">
                    <h4 className="txt-footer-set-bg-direction-header mb-0" data-i18n="minigameSetting.presetMinigameRecommand">{t("minigameSetting.presetMinigameRecommand", "คำแนะนำ :")}</h4>
                    <h4 className="txt-footer-set-bg-direction mb-0" data-i18n="minigameSetting.presetMinigameImageSize2">{t("minigameSetting.presetMinigameImageSize2", "ขนาดรูป")}</h4>
                    <h4 className="txt-footer-set-bg-direction-yellow mb-0">430px x 932px</h4>
                    <h4 className="txt-footer-set-bg-direction mb-0" data-i18n="minigameSetting.presetMinigameImageSet2">{t("minigameSetting.presetMinigameImageSet2", "/ สกุล")}</h4>
                    <h4 className="txt-footer-set-bg-direction-yellow mb-0">png, gif, jpg</h4>
                  </div>
                </div>
                <div className="box-session-upload-img-bg-mini-game">
                  <div className="set-bg-img">
                    <div className="box-set">
                      <div className="btn-close-img-bg-pc-mini-game" style={{ display: "none" }}>
                        <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                      </div>
                      <img className="img-bg-pc-show-in-box-upload" alt="img" style={{ display: "none" }} />
                      {" "}
                      <img className="img-default-bg-pc-mini-game" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                      {" "}
                      <input type="hidden" id="imgBgPcMiniGame" />
                    </div>
                    <div className="session-btn-upload-bg">
                      <div className="title-btn-upload-bg" data-i18n="minigameSetting.displayPresetDesktopBackground">{t("minigameSetting.displayPresetDesktopBackground", "รูปพื้นหลังเวอร์ชั่น Desktop")}</div>
                      <label className="btn-upload-bg" htmlFor="fileImageUploadBgPcMiniGame">
                        <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                        {" "}
                        <span data-i18n="minigameSetting.uploadImage">{t("minigameSetting.uploadImage", "อัพโหลดรูป")}</span>
                        {" "}
                        <input type="file" id="fileImageUploadBgPcMiniGame" style={{ display: "none" }} />
                      </label>
                    </div>
                  </div>
                  <div className="footer-set-bg-direction">
                    <h4 className="txt-footer-set-bg-direction-header mb-0" data-i18n="minigameSetting.presetMinigameRecommand">{t("minigameSetting.presetMinigameRecommand", "คำแนะนำ :")}</h4>
                    <h4 className="txt-footer-set-bg-direction mb-0" data-i18n="minigameSetting.presetMinigameImageSize2">{t("minigameSetting.presetMinigameImageSize2", "ขนาดรูป")}</h4>
                    <h4 className="txt-footer-set-bg-direction-yellow mb-0">1920px x 1080px</h4>
                    <h4 className="txt-footer-set-bg-direction mb-0" data-i18n="minigameSetting.presetMinigameImageSet2">{t("minigameSetting.presetMinigameImageSet2", "/ สกุล")}</h4>
                    <h4 className="txt-footer-set-bg-direction-yellow mb-0">png, gif, jpg</h4>
                  </div>
                </div>
              </div>
              <div className="w-50">
                <div className="title">
                  <h4 data-i18n="minigameSetting.presetMinigameImageSetColorSolid">{t("minigameSetting.presetMinigameImageSetColorSolid", "ปรับแต่งพื้นหลังมินิเกมส์ด้วย สี Solid")}</h4>
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.presetMinigameSetBg">{t("minigameSetting.presetMinigameSetBg", "สี พื้นหลังหน้าจอมินิเกมส์")}</h4>
                  <ColorPicker className="getColorBgMainColor" defaultValue="rgba(0, 0, 0, 0.36)" onChange={(value) => setThemeColor("getColorBgMainColor", value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box-main-set-color-mini-game">
          <div className="title-main-set-color-mini-game">
            {/* ORIGINAL: this box reused the titles of other boxes ("ปรับแต่งสีตัวอักษรและตัวเลข", "ปรับแต่งพื้นหลังมินิเกมส์ด้วยรูปของคุณ",
                "ปรับแต่งพื้นหลังมินิเกมส์ด้วย สี Solid", "สี พื้นหลังหน้าจอมินิเกมส์"). It saves miniGameScreen*ImageUrl + miniGameColorCode
                (--color-bg-in-box-mini-game), i.e. the box the game sits in, so it was renamed to say so, PK 20/11/2026 */}
            <h4 className="mb-0" data-i18n="minigameSetting.presetMinigameBoxSetting">{t("minigameSetting.presetMinigameBoxSetting", "ปรับสีหรือรูปภาพพื้นหลังกล่องมินิเกมส์")}</h4>
            <h5 className="set-default-color mb-0" data-default-color-type="bg-display" data-i18n="minigameSetting.displayPresetMinigameReset">{t("minigameSetting.displayPresetMinigameReset", "คืนค่าเริ่มต้น")}</h5>
          </div>
          <div className="body-main-set-color-mini-game">
            <div className="session-set-bg-screen-main">
              <div className="w-50">
                <div className="title">
                  <h4 data-i18n="minigameSetting.presetMinigameBoxImageSetting">{t("minigameSetting.presetMinigameBoxImageSetting", "ปรับแต่งพื้นหลังกล่องมินิเกมส์ด้วยรูปของคุณ")}</h4>
                </div>
                <div className="box-session-upload-img-bg-mini-game">
                  <div className="set-bg-img">
                    <div className="box-set">
                      <div className="btn-close-img-bg-mb-display-mini-game" style={{ display: "none" }}>
                        <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                      </div>
                      <img className="img-bg-mb-display-show-in-box-upload" alt="img" style={{ display: "none" }} />
                      {" "}
                      <img className="img-default-bg-mb-display-mini-game" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                      {" "}
                      <input type="hidden" id="imgBgMbDisplayMiniGame" />
                    </div>
                    <div className="session-btn-upload-bg">
                      <div className="title-btn-upload-bg" data-i18n="minigameSetting.displayPresetMobileBackground">{t("minigameSetting.displayPresetMobileBackground", "รูปพื้นหลังเวอร์ชั่น Mobile")}</div>
                      <label className="btn-upload-bg" htmlFor="fileImageUploadBgMobileDisplayMiniGame">
                        <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                        {" "}
                        <span data-i18n="minigameSetting.uploadImage">{t("minigameSetting.uploadImage", "อัพโหลดรูป")}</span>
                        {" "}
                        <input type="file" id="fileImageUploadBgMobileDisplayMiniGame" style={{ display: "none" }} />
                      </label>
                    </div>
                  </div>
                  <div className="footer-set-bg-direction">
                    <h4 className="txt-footer-set-bg-direction-header mb-0" data-i18n="minigameSetting.presetMinigameRecommand">{t("minigameSetting.presetMinigameRecommand", "คำแนะนำ :")}</h4>
                    <h4 className="txt-footer-set-bg-direction mb-0" data-i18n="minigameSetting.presetMinigameImageSize2">{t("minigameSetting.presetMinigameImageSize2", "ขนาดรูป")}</h4>
                    <h4 className="txt-footer-set-bg-direction-yellow mb-0">400 x 360px</h4>
                    <h4 className="txt-footer-set-bg-direction mb-0" data-i18n="minigameSetting.presetMinigameImageSet2">{t("minigameSetting.presetMinigameImageSet2", "/ สกุล")}</h4>
                    <h4 className="txt-footer-set-bg-direction-yellow mb-0">png, gif, jpg</h4>
                  </div>
                </div>
                <div className="box-session-upload-img-bg-mini-game">
                  <div className="set-bg-img">
                    <div className="box-set">
                      <div className="btn-close-img-bg-pc-display-mini-game" style={{ display: "none" }}>
                        <img className="w-100" src="https://p88.blob.core.windows.net/images/default/icon-btn-close-img-mini-game-custom.png" alt="img" />
                      </div>
                      <img className="img-bg-pc-display-show-in-box-upload" alt="img" style={{ display: "none" }} />
                      {" "}
                      <img className="img-default-bg-pc-display-mini-game" src="https://p88.blob.core.windows.net/images/default/icon-center-box-upload-mini-game.png" alt="img" />
                      {" "}
                      <input type="hidden" id="imgBgPcDisplayMiniGame" />
                    </div>
                    <div className="session-btn-upload-bg">
                      <div className="title-btn-upload-bg" data-i18n="minigameSetting.displayPresetDesktopBackground">{t("minigameSetting.displayPresetDesktopBackground", "รูปพื้นหลังเวอร์ชั่น Desktop")}</div>
                      <label className="btn-upload-bg" htmlFor="fileImageUploadBgPcDisplayMiniGame">
                        <img className="me-1" src="https://p88.blob.core.windows.net/images/default/icon-btn-upload-img-minigame.png" alt="img" />
                        {" "}
                        <span data-i18n="minigameSetting.uploadImage">{t("minigameSetting.uploadImage", "อัพโหลดรูป")}</span>
                        {" "}
                        <input type="file" id="fileImageUploadBgPcDisplayMiniGame" style={{ display: "none" }} />
                      </label>
                    </div>
                  </div>
                  <div className="footer-set-bg-direction">
                    <h4 className="txt-footer-set-bg-direction-header mb-0" data-i18n="minigameSetting.presetMinigameRecommand">{t("minigameSetting.presetMinigameRecommand", "คำแนะนำ :")}</h4>
                    <h4 className="txt-footer-set-bg-direction mb-0" data-i18n="minigameSetting.presetMinigameImageSize2">{t("minigameSetting.presetMinigameImageSize2", "ขนาดรูป")}</h4>
                    <h4 className="txt-footer-set-bg-direction-yellow mb-0">650 x 566px</h4>
                    <h4 className="txt-footer-set-bg-direction mb-0" data-i18n="minigameSetting.presetMinigameImageSet2">{t("minigameSetting.presetMinigameImageSet2", "/ สกุล")}</h4>
                    <h4 className="txt-footer-set-bg-direction-yellow mb-0">png, gif, jpg</h4>
                  </div>
                </div>
              </div>
              <div className="w-50">
                <div className="title">
                  <h4 data-i18n="minigameSetting.presetMinigameBoxColorSolid">{t("minigameSetting.presetMinigameBoxColorSolid", "ปรับแต่งพื้นหลังกล่องมินิเกมส์ด้วย สี Solid")}</h4>
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.presetMinigameBoxSetBg">{t("minigameSetting.presetMinigameBoxSetBg", "สี พื้นหลังกล่องมินิเกมส์")}</h4>
                  <ColorPicker className="getColorBgInBoxMiniGameColor" defaultValue="rgba(0, 0, 0, 0.36)" onChange={(value) => setThemeColor("getColorBgInBoxMiniGameColor", value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box-main-set-color-mini-game">
          <div className="title-main-set-color-mini-game">
            <h4 className="mb-0" data-i18n="minigameSetting.presetMinigameImageSetTextColorAndNo">{t("minigameSetting.presetMinigameImageSetTextColorAndNo", "ปรับแต่งสีตัวอักษรและตัวเลข")}</h4>
            <h5 className="set-default-color mb-0" data-default-color-type="color-group-1" data-i18n="minigameSetting.displayPresetMinigameReset">{t("minigameSetting.displayPresetMinigameReset", "คืนค่าเริ่มต้น")}</h5>
          </div>
          <div className="body-main-set-color-mini-game">
            <div className="session-set-bg-screen-main">
              <div className="w-50">
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.headerColor">{t("minigameSetting.headerColor", "สี Header หลัก")}</h4>
                  <ColorPicker className="getColorFontHeaderMainGroup1" defaultValue="#FFFFFF" onChange={(value) => setThemeColor("getColorFontHeaderMainGroup1", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.textColor">{t("minigameSetting.textColor", "สี ข้อความหลัก")}</h4>
                  <ColorPicker className="getColorFontMessageMainGroup1" defaultValue="#E9E9E9" onChange={(value) => setThemeColor("getColorFontMessageMainGroup1", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.highlightTextColor">{t("minigameSetting.highlightTextColor", "สี ข้อความไฮไลท์ 1")}</h4>
                  <ColorPicker className="getColorFontHighlightsGroup1" defaultValue="linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%)" onChange={(value) => setThemeColor("getColorFontHighlightsGroup1", value)} />
                </div>
              </div>
              <div className="w-50">
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.headerColor2">{t("minigameSetting.headerColor2", "สี Header รอง")}</h4>
                  <ColorPicker className="getColorFontHeaderSecondaryGroup1" defaultValue="#FFE666" onChange={(value) => setThemeColor("getColorFontHeaderSecondaryGroup1", value)} />
                </div>
                <div className="session-set-color-and-title">
                  {/* ORIGINAL: labelled "สี Header หลัก" (headerColor), a copy of the first picker. Saves textSecondaryMainColorCode, PK 20/11/2026 */}
                  <h4 className="mb-0" data-i18n="minigameSetting.textColor2">{t("minigameSetting.textColor2", "สี ข้อความรอง")}</h4>
                  <ColorPicker className="getColorFontMessageSecondaryGroup1" defaultValue="#AB8B4D" onChange={(value) => setThemeColor("getColorFontMessageSecondaryGroup1", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.textCountdownColor">{t("minigameSetting.textCountdownColor", "สี ข้อความนับถอยหลัง")}</h4>
                  <ColorPicker className="getColorFontCountDownGroup1" defaultValue="#EB3333" onChange={(value) => setThemeColor("getColorFontCountDownGroup1", value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box-main-set-color-mini-game">
          <div className="title-main-set-color-mini-game">
            {/* ORIGINAL: typo "ปรังแต่ง" in th.json; fixed there, PK 20/11/2026 */}
            <h4 className="mb-0" data-i18n="minigameSetting.textPopup">{t("minigameSetting.textPopup", "ปรับแต่งกรอบแสดงผล PopUp และ ปุ่มหลัก")}</h4>
            <h5 className="set-default-color mb-0" data-default-color-type="color-group-2" data-i18n="minigameSetting.displayPresetMinigameReset">{t("minigameSetting.displayPresetMinigameReset", "คืนค่าเริ่มต้น")}</h5>
          </div>
          <div className="body-main-set-color-mini-game">
            <div className="session-set-bg-screen-main">
              <div className="w-50">
                <div className="title color-main-operator">
                  <h4 className="mb-2" data-i18n="minigameSetting.mainButton">{t("minigameSetting.mainButton", "ปุ่มหลัก")}</h4>
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.backgroundColor">{t("minigameSetting.backgroundColor", "สี พื้นหลัง")}</h4>
                  <ColorPicker className="getColorBtnBgGroup2" defaultValue="linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%)" onChange={(value) => setThemeColor("getColorBtnBgGroup2", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.messageText">{t("minigameSetting.messageText", "สี ข้อความ")}</h4>
                  <ColorPicker className="getColorBtnMessageGroup2" defaultValue="#1E1E1E" onChange={(value) => setThemeColor("getColorBtnMessageGroup2", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.borderColor">{t("minigameSetting.borderColor", "สี เส้นกรอบ")}</h4>
                  <ColorPicker className="getColorBtnBorderGroup2" defaultValue="#000000" onChange={(value) => setThemeColor("getColorBtnBorderGroup2", value)} />
                </div>
              </div>
              <div className="w-50">
                <div className="title color-main-operator">
                  <h4 className="mb-2" data-i18n="minigameSetting.borderDisplay">{t("minigameSetting.borderDisplay", "กรอบแสดงผล PopUp")}</h4>
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.backgroundColor">{t("minigameSetting.backgroundColor", "สี พื้นหลัง")}</h4>
                  <ColorPicker className="getColorDisplayBgGroup2" defaultValue="#151515" onChange={(value) => setThemeColor("getColorDisplayBgGroup2", value)} />
                </div>
                <div className="session-set-color-and-title">
                  {/* ORIGINAL: labelled "สี พื้นหลัง" (backgroundColor), a copy of the picker above. Saves frameColorCode, PK 20/11/2026 */}
                  <h4 className="mb-0" data-i18n="minigameSetting.borderColor">{t("minigameSetting.borderColor", "สี เส้นกรอบ")}</h4>
                  <ColorPicker className="getColorDisplayBorderGroup2" defaultValue="linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%)" onChange={(value) => setThemeColor("getColorDisplayBorderGroup2", value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box-main-set-color-mini-game">
          <div className="title-main-set-color-mini-game">
            <h4 className="mb-0" data-i18n="minigameSetting.chartColor">{t("minigameSetting.chartColor", "ปรับแต่งสีตาราง")}</h4>
            <h5 className="set-default-color mb-0" data-default-color-type="color-group-3" data-i18n="minigameSetting.displayPresetMinigameReset">{t("minigameSetting.displayPresetMinigameReset", "คืนค่าเริ่มต้น")}</h5>
          </div>
          <div className="body-main-set-color-mini-game">
            <div className="session-set-bg-screen-main">
              <div className="w-50">
                {/* ORIGINAL: sub-title repeated the box title "ปรับแต่งสีตาราง" (chartColor). These pickers set the table header (Th), PK 20/11/2026 */}
                <div className="title color-main-operator">
                  <h4 className="mb-2" data-i18n="minigameSetting.chartHeader">{t("minigameSetting.chartHeader", "หัวตาราง")}</h4>
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.backgroundColor">{t("minigameSetting.backgroundColor", "สี พื้นหลัง")}</h4>
                  <ColorPicker className="getColorTableThBgGroup3" defaultValue="linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%)" onChange={(value) => setThemeColor("getColorTableThBgGroup3", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0">สี ข้อความ</h4>
                  <ColorPicker className="getColorTableThFontGroup3" defaultValue="#202020" onChange={(value) => setThemeColor("getColorTableThFontGroup3", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0">สี เส้นกรอบ</h4>
                  <ColorPicker className="getColorTableThBorderGroup3" defaultValue="linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%)" onChange={(value) => setThemeColor("getColorTableThBorderGroup3", value)} />
                </div>
                <div className="title color-main-operator">
                  <h4 className="my-2" data-i18n="minigameSetting.pagination">{t("minigameSetting.pagination", "การแบ่งหน้า (Pagination)")}</h4>
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0">สี เลขหน้า Inactive</h4>
                  <ColorPicker className="getColorPaginationFontInActiveGroup3" defaultValue="#E9E9E9" onChange={(value) => setThemeColor("getColorPaginationFontInActiveGroup3", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0">สี เลขหน้า Active</h4>
                  <ColorPicker className="getColorPaginationFontActiveGroup3" defaultValue="#000000" onChange={(value) => setThemeColor("getColorPaginationFontActiveGroup3", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0">สี พื้นหลังเลขหน้า Inactive</h4>
                  <ColorPicker className="getColorPaginationBgInActiveGroup3" defaultValue="transparent" onChange={(value) => setThemeColor("getColorPaginationBgInActiveGroup3", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0">สี พื้นหลังเลขหน้า Active</h4>
                  <ColorPicker className="getColorPaginationBgActiveGroup3" defaultValue="#FFE666" onChange={(value) => setThemeColor("getColorPaginationBgActiveGroup3", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0">สี ลูกศร Inactive</h4>
                  <ColorPicker className="getColorPaginationArrowInActiveGroup3" defaultValue="#A8A8A8" onChange={(value) => setThemeColor("getColorPaginationArrowInActiveGroup3", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0">สี ลูกศร Active</h4>
                  <ColorPicker className="getColorPaginationArrowActiveGroup3" defaultValue="#FFE666" onChange={(value) => setThemeColor("getColorPaginationArrowActiveGroup3", value)} />
                </div>
              </div>
              <div className="w-50">
                <div className="title color-main-operator">
                  <h4 className="mb-2" data-i18n="minigameSetting.chartDetails">{t("minigameSetting.chartDetails", "เนื้อหาตาราง")}</h4>
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0">
                    <span data-i18n="minigameSetting.backgroundColor">{t("minigameSetting.backgroundColor", "สี พื้นหลัง")}</span>
                    {" 1"}
                  </h4>
                  <ColorPicker className="getColorTableTdBg1Group3" defaultValue="#000000" onChange={(value) => setThemeColor("getColorTableTdBg1Group3", value)} />
                </div>
                {/* ORIGINAL: staging labels this picker and the next four "ปรับแต่งสีตาราง". Renamed to what each one saves
                    (tableTextBackgroundColorCode2, tableTextPrimaryColorCode, tableTextHighlightColorCode1/2, tableDivideColorCode),
                    using keys that already exist in the original th.json, PK 20/11/2026 */}
                <div className="session-set-color-and-title">
                  <h4 className="mb-0">
                    <span data-i18n="minigameSetting.backgroundColor">{t("minigameSetting.backgroundColor", "สี พื้นหลัง")}</span>
                    {" 2"}
                  </h4>
                  <ColorPicker className="getColorTableTdBg2Group3" defaultValue="#232121" onChange={(value) => setThemeColor("getColorTableTdBg2Group3", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.messageText">{t("minigameSetting.messageText", "สี ข้อความ")}</h4>
                  <ColorPicker className="getColorTableTdFontGroup3" defaultValue="#E9E9E9" onChange={(value) => setThemeColor("getColorTableTdFontGroup3", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.highlightTextColor">{t("minigameSetting.highlightTextColor", "สี ข้อความไฮไลท์ 1")}</h4>
                  <ColorPicker className="getColorTableTdFontHighlights1Group3" defaultValue="#F10000" onChange={(value) => setThemeColor("getColorTableTdFontHighlights1Group3", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0">
                    <span data-i18n="minigameSetting.highlightTextColor2">{t("minigameSetting.highlightTextColor2", "สี ข้อความไฮไลท์")}</span>
                    {" 2"}
                  </h4>
                  <ColorPicker className="getColorTableTdFontHighlights2Group3" defaultValue="#72DCD9" onChange={(value) => setThemeColor("getColorTableTdFontHighlights2Group3", value)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0" data-i18n="minigameSetting.chartBorderColor">{t("minigameSetting.chartBorderColor", "สี เส้นแบ่งตาราง")}</h4>
                  <ColorPicker className="getColorTableTdBorderGroup3" defaultValue="#E9E9E9" onChange={(value) => setThemeColor("getColorTableTdBorderGroup3", value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* #groupBtnSettingMinigame4 was not captured: rebuilt like the step 3 footer, as the last child of #SettingMinigameStep4 (staging) */}
    <div className="group-btn-minigame-setting ms-0 me-0 px-4" id="groupBtnSettingMinigame4">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <button id="buttonNextPromotionStepfinal4" className="btn btn-outline-warning" data-type="next" data-i18n="minigameSetting.summarizeAndSave" style={nav.summaryButtonStyle} onClick={() => nav.toSummary("4")}>{t("minigameSetting.summarizeAndSave", "ไปหน้าสรุป")}</button>
        </div>
        <div>
          <button className="btn system-btn btn-outline btn-rounded" data-type="previous" data-i18n="minigameSetting.back" style={{ width: "168px" }} onClick={() => nav.go("4", "3")}>{t("minigameSetting.back", "ขั้นตอนก่อนหน้า")}</button>{" "}
          <button className="btn system-btn btn-rounded ms-2" data-type="next" data-i18n="minigameSetting.next" style={{ width: "168px" }} onClick={() => nav.go("4", "5")}>{t("minigameSetting.next", "ถัดไป")}</button>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}
