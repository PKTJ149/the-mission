"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

// Step 5 "เงื่อนไขติดเทิร์น": markup = #SettingMinigameStep5 of create-lucky-wheel_step5-turnover_and_step6-summary.html

import { useT } from "@/lib/i18n";
import * as dom from "./wizard-dom";
import { raw, shownWhen, type StepProps } from "./wizard-types";

export function Step5Turnover({ step, nav }: StepProps) {
  const t = useT();
  return (
      <div className="canvas-box-body" id="SettingMinigameStep5" style={shownWhen(step === "5")}>
        <div className="tab-header">
          <div className="header-in-body active">
            <div className="tab-group">
              <span className="p1 fw-700" data-i18n="minigameSetting.settingMinigameStep4Header">{t("minigameSetting.settingMinigameStep4Header", "กำหนดเงื่อนไขการติดเทิร์น ถอนเงิน การหลุดโปร และเงื่อนไขพิเศษอื่น ๆ")}</span>
            </div>
          </div>
        </div>
        <div className="main-in-detail-body content-col-1">
          <div className="label-minigame">
            <span data-i18n="minigameSetting.settingMinigameTurnOver">{t("minigameSetting.settingMinigameTurnOver", "กำหนดเงื่อนไขการติด Turnover")}</span>
            <div className="switch">
              <div className="custom-switch switch-alone form-check form-switch">
                <input className="form-check-input" type="checkbox" id="minigameEnableConditionTurnover" data-value-id1="boxMinigameTurnoverRadioPoint" data-value-id2="boxMinigameTurnoverRadioBath" data-value-id="2" onClick={(e) => dom.changeStatusSwitchMinigameTurnover(e.currentTarget, "2-3-6")} />
              </div>
              <span className="color-emerald-title-1" data-i18n="minigameSetting.onAndOffSetting">{t("minigameSetting.onAndOffSetting", "เปิด / ปิด การใช้งาน")}</span>
            </div>
          </div>
          <div className="input-col-1-p switch-2-3-6">
            <div>
              <div className="text-start">
                <span className="p3" style={{ color: "rgb(173, 173, 173)" }}>
                  <span data-i18n="minigameSetting.settingMinigameTurnOverSubText">{t("minigameSetting.settingMinigameTurnOverSubText", "เมื่อสมาชิกรับโปรไปแล้ว สมาชิกจะต้องทำ Turnover ให้ได้ตามที่กำหนดให้ครบถึงจะสามารถทำการถอน")}</span>
                  <br />
                  <span data-i18n="minigameSetting.settingMinigameTurnOverSubText2">{t("minigameSetting.settingMinigameTurnOverSubText2", "เงินได้ตามปกติ")}</span>
                </span>
              </div>
              <div className="row mt-3">
                <div className="col-12 col-md-6 mb-3" {...raw({ type: "button" })} data-value-id1="boxMinigameTurnoverRadioPoint" data-value-id2="boxMinigameTurnoverRadioBath" data-value-id="1" onClick={(e) => dom.selectChangeMinigameBoxRadio(e.currentTarget)}>
                  <div className="custom-card h-100 box-minigame-click-select minigame-box-reset fistempty disabled" id="boxMinigameTurnoverRadioPoint">
                    <input id="minigameEnableWithdrawConditionMinTurnover" name="minigameConditionTurnoverRadioBox" className="box-radio" type="radio" hidden />
                    <div className="row flex-column justify-content-between h-100">
                      <div className="row pe-0">
                        <div className="col-3 mb-3">
                          <img src="/assets/images/minigame/3d-trade-icon.png" width="64" height="64" />
                        </div>
                        <div className="col-9 mb-3">
                          <div className="p2 fw-700" data-i18n="minigameSetting.settingMinigameTurnOverMin">{t("minigameSetting.settingMinigameTurnOverMin", "ต้องทำ Turnover ขั้นต่ำ x เท่า")}</div>
                          <span className="p3" data-i18n="minigameSetting.settingMinigameTurnOverExampleText" style={{ color: "rgb(173, 173, 173)" }}>{t("minigameSetting.settingMinigameTurnOverExampleText", "ตัวอย่าง : ลูกค้าฝาก 1,000 บาท รับโปร 200 เครดิต หากตั้งค่า ทำ เทิร์น 5 เท่า ลูกค้าจะต้องทำเทิร์น = (1,000 + 200) x 5 = 6,000 ถึงจะถอนเครดิตได้")}</span>
                        </div>
                      </div>
                      <div className="">
                        <div className="col-12 mb-2">
                          <div className="custom-input custom-float box-promotion-item-checkbox-radio" id="inputMinigameWithdrawConditionMinTurnover">
                            <div className="p2 fw-700 mb-2" data-i18n="minigameSetting.minigameTurnOverPoint" style={{ textAlign: "start" }}>{t("minigameSetting.minigameTurnOverPoint", "ค่า Turnover")}</div>
                            <div className="input-group minigame-box-reset disabled">
                              <input id="minigameWithdrawConditionMinTurnover" type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                              {" "}
                              <span className="input-group-text custom-color" data-i18n="minigameSetting.times" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.times", "เท่า")}</span>
                            </div>
                            <div className="invalid-feedback" id="error-minigameWithdrawConditionMinTurnover" data-i18n="minigameSetting.minigameTurnOverPointErrorText" style={{ display: "none" }}>{t("minigameSetting.minigameTurnOverPointErrorText", "กรุณากรอกค่า Turnover")}</div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="row">
                            <div className="p2 fw-700 mb-2" data-i18n="minigameSetting.minigameTurnOverSettingMinimum" style={{ textAlign: "start" }}>{t("minigameSetting.minigameTurnOverSettingMinimum", "ติดเทิร์นโอเวอร์ขั้นต่ำ")}</div>
                            <div className="col-6">
                              <div className="custom-input custom-float box-promotion-item-checkbox-radio" id="inputMinigameWithdrawConditionMinTurnoverMinCredit">
                                <div>
                                  <div className="input-group minigame-box-reset disabled" id="boxInputMinTurnoverMinCredit">
                                    <input id="minigameWithdrawConditionMinTurnoverMinCredit" type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                                    {" "}
                                    <span className="input-group-text custom-color" data-i18n="minigameSetting.baht" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.baht", "บาท")}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6 align-self-center">
                              <div className="form-check">
                                <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="disableMinTurnOverMinCredit" onChange={() => dom.changDisableMinTurnoverMinCredit()} />
                                {" "}
                                <label className="form-check-label d-flex flex-column" htmlFor="">
                                  <span className="p2 color-emerald-title-1" data-i18n="minigameSetting.minigameTurnOverNotSetting">{t("minigameSetting.minigameTurnOverNotSetting", "ไม่กำหนดขั้นต่ำ")}</span>
                                </label>
                              </div>
                            </div>
                            <div className="invalid-feedback" id="error-minigameWithdrawConditionMinTurnoverMinCredit" data-i18n="minigameSetting.minigameTurnOverPointErrorText" style={{ display: "none" }}>{t("minigameSetting.minigameTurnOverPointErrorText", "กรุณากรอกค่า Turnover")}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3" {...raw({ type: "button" })} data-value-id1="boxMinigameTurnoverRadioPoint" data-value-id2="boxMinigameTurnoverRadioBath" data-value-id="2" onClick={(e) => dom.selectChangeMinigameBoxRadio(e.currentTarget)}>
                  <div className="custom-card h-100 box-minigame-click-select minigame-box-reset disabled" id="boxMinigameTurnoverRadioBath">
                    <input id="minigameEnableWithdrawConditionMinTurnoverCredit" name="minigameConditionTurnoverRadioBox" className="box-radio" type="radio" hidden />
                    <div className="row flex-column justify-content-between h-100">
                      <div className="row pe-0">
                        <div className="col-3 mb-3">
                          <img src="/assets/images/minigame/3d-trade-icon.png" width="64" height="64" />
                        </div>
                        <div className="col-9 mb-3">
                          <div className="p2 fw-700" data-i18n="minigameSetting.settingMinigameTurnOverMinBaht">{t("minigameSetting.settingMinigameTurnOverMinBaht", "ต้องทำ Turnover ขั้นต่ำ x บาท")}</div>
                          <span className="p3" data-i18n="minigameSetting.settingMinigameTurnOverMinBahtExampleText" style={{ color: "rgb(173, 173, 173)" }}>{t("minigameSetting.settingMinigameTurnOverMinBahtExampleText", "ตัวอย่าง : ลูกค้าฝาก 1,000 บาท รับโปร 200 เครดิต หากตั้งค่า ทำ เทิร์น 10,000 บาท ลูกค้าจะต้องทำเทิร์นรวมให้ได้ = 10,000 เท่านั้น ถึงจะทำถอนเครดิตได้")}</span>
                        </div>
                      </div>
                      <div className="">
                        <div className="col-12">
                          <div className="custom-input custom-float box-promotion-item-checkbox-radio" id="inputMinigameWithdrawConditionMinTurnoverCredit">
                            <div className="p2 fw-700 mb-2" data-i18n="minigameSetting.minigameTurnOverPoint" style={{ textAlign: "start" }}>{t("minigameSetting.minigameTurnOverPoint", "ค่า Turnover")}</div>
                            <div className="input-group minigame-box-reset disabled">
                              <input id="minigameWithdrawConditionMinTurnoverCredit" type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                              {" "}
                              <span className="input-group-text custom-color" data-i18n="minigameSetting.baht" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.baht", "บาท")}</span>
                            </div>
                            <div className="invalid-feedback" id="error-minigameWithdrawConditionMinTurnoverCredit" data-i18n="minigameSetting.minigameTurnOverPointErrorText" style={{ display: "none" }}>{t("minigameSetting.minigameTurnOverPointErrorText", "กรุณากรอกค่า Turnover")}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-start">
                <span className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.minigameTurnOverTime">{t("minigameSetting.minigameTurnOverTime", "เวลาในการทำเทิร์นโอเวอร์")}</span>
              </div>
              <input id="boxTurnoverPeriodSettingRadio" name="boxTurnoverPeriodSettingRadioBox" className="box-radio" type="radio" hidden />
              <div className="row box-promotion-item-checkbox-radio" id="boxTurnoverPeriodSettingOffRadio">
                <div className="col-12 col-md-6 mb-3" {...raw({ type: "button" })}>
                  <div className="form-check minigame-reset disabled fistempty">
                    <input className="form-check-input me-2" type="radio" name="minigameTurnoverPeriodSettingRadio" id="minigameTurnoverPeriodSettingOffRadio" value="false" data-value1="inputMinigameTurnoverPeriodSettingOnRadio" data-value2="inputMinigameTurnoverPeriodSettingOffRadio" defaultChecked onChange={(e) => dom.changeMinigameradioinput(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameTurnoverPeriodSettingOffRadio">
                      <span className="p2 color-emerald-title-1" data-i18n="minigameSetting.minigameTurnOverTimeNotFix">{t("minigameSetting.minigameTurnOverTimeNotFix", "ไม่กำหนดเวลาในการทำเทิร์นโอเวอร์")}</span>
                      {" "}
                      <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.minigameTurnOverTimeNoTime">{t("minigameSetting.minigameTurnOverTimeNoTime", "สมาชิกสามารถทำเทิร์นโอเวอร์ได้โดยไม่มีเวลากำหนด")}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="row box-promotion-item-checkbox-radio" id="boxTurnoverPeriodSettingOnRadio">
                <div className="col-12 col-md-6 mb-3 mb-md-0" {...raw({ type: "button" })}>
                  <div className="form-check minigame-reset disabled fistempty">
                    <input className="form-check-input me-2" type="radio" name="minigameTurnoverPeriodSettingRadio" id="minigameTurnoverPeriodSettingOnRadio" value="true" data-value1="inputMinigameTurnoverPeriodSettingOffRadio" data-value2="inputMinigameTurnoverPeriodSettingOnRadio" onChange={(e) => dom.changeMinigameradioinput(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameTurnoverPeriodSettingOnRadio">
                      <span className="p2 color-emerald-title-1" data-i18n="minigameSetting.minigameTurnoverPeriodFix">{t("minigameSetting.minigameTurnoverPeriodFix", "กำหนดระยะเวลาในการทำเทิร์นโอเวอร์")}</span>
                      {" "}
                      <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.minigameTurnoverPeriodCondition">{t("minigameSetting.minigameTurnoverPeriodCondition", "สมาชิกมีระยะเวลาในการทำเทิร์นโอเวอร์ หากทำไม่ทันตามเวลาที่กำหนด สมาชิกจะต้องติดต่อเจ้าหน้าที่เพื่อให้ดำเนินการให้")}</span>
                    </label>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameTurnoverPeriodSettingOffRadio">
                    <div className="input-group">
                      <input id="inputMinigameTurnOverHours" type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                      {" "}
                      <span className="input-group-text custom-color" data-i18n="minigameSetting.hours" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.hours", "ชั่วโมง")}</span>
                    </div>
                    <div className="invalid-feedback" id="error-minigameTurnoverPeriodSetting" data-i18n="minigameSetting.minigameTurnoverPeriodErrorText" style={{ display: "none" }}>{t("minigameSetting.minigameTurnoverPeriodErrorText", "กรุณากรอกเวลาในการทำเทิร์นโอเวอร์")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="label-minigame d-none">
            <span data-i18n="minigameSetting.withdrawnCondition">{t("minigameSetting.withdrawnCondition", "กำหนดเงื่อนไขการถอนเงิน")}</span>
            <div className="switch">
              <div className="custom-switch switch-alone form-check form-switch">
                <input className="form-check-input" type="checkbox" id="minigameEnableWithdrawCondition" value="minigameEnableWithdrawCondition" onClick={(e) => dom.changeStatusSwitch(e.currentTarget, "2-3-7")} />
              </div>
              <span className="color-emerald-title-1" data-i18n="minigameSetting.onAndOffSetting">{t("minigameSetting.onAndOffSetting", "เปิด / ปิด การใช้งาน")}</span>
            </div>
          </div>
          <div className="input-col-1-p switch-2-3-7 d-none">
            <div>
              <div className="row box-promotion-item-checkbox-radio" id="boxPromotionWithdrawMinBalance">
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-check minigame-reset disabled fistempty">
                    <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableCreditRemain" data-value="inputMinigameCreditRemain" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableCreditRemain">
                      <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.withdrawnCondition1">{t("minigameSetting.withdrawnCondition1", "กำหนดยอดเครดิตคงเหลือขั้นต่ำ x บาท")}</div>
                      <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.withdrawnCondition2">{t("minigameSetting.withdrawnCondition2", "เมื่อถอนแล้วจะต้องเหลือเครดิตที่ยอดคงเหลือไม่น้อยกว่า x บาท ถึงจะทำการถอนเครดิตได้")}</span>
                    </label>
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameCreditRemain">
                    <div className="input-group">
                      <input id="minigameCreditRemain" type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                      {" "}
                      <span className="input-group-text custom-color" style={{ borderRadius: "0px 8px 8px 0px" }}>บาท</span>
                    </div>
                    <div className="invalid-feedback" id="error-minigameCreditRemain" data-i18n="minigameSetting.withdrawnConditionErrorText" style={{ display: "none" }}>{t("minigameSetting.withdrawnConditionErrorText", "กรุณากรอกกำหนดยอดเครดิตคงเหลือขั้นต่ำ x บาท")}</div>
                  </div>
                </div>
              </div>
              <div className="row box-promotion-item-checkbox-radio" id="boxPromotionWithdrawMaxBalance">
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-check minigame-reset disabled fistempty">
                    <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableMaxWithdraw" data-value="inputMinigameMaxWithdraw" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableMaxWithdraw">
                      <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.withdrawnCondition3">{t("minigameSetting.withdrawnCondition3", "จำกัดการถอนสูงสุดไม่เกินจำนวนที่กำหนด")}</div>
                      <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.withdrawnCondition4">{t("minigameSetting.withdrawnCondition4", "ลูกค้าสามารถถอนเครดิตได้สูงสุดไม่เกิน x บาท ในแต่ละครั้งที่ทำการถอนเครดิต")}</span>
                    </label>
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameMaxWithdraw">
                    <div className="input-group">
                      <input id="minigameMaxWithdraw" type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                      {" "}
                      <span className="input-group-text custom-color" style={{ borderRadius: "0px 8px 8px 0px" }}>บาท</span>
                    </div>
                    <div className="invalid-feedback" id="error-maxWithdraw" data-i18n="minigameSetting.withdrawnConditionErrorText2" style={{ display: "none" }}>{t("minigameSetting.withdrawnConditionErrorText2", "กรุณากรอกจำกัดการถอนสูงสุดไม่เกินจำนวนที่กำหนด")}</div>
                  </div>
                </div>
              </div>
              <div className="row box-promotion-item-checkbox-radio" id="boxPromotionWithdrawAllBalance">
                <div className="col-12 col-md-6 mb-3">
                  <div className="form-check minigame-reset disabled fistempty">
                    <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameEnableDeductCreditAll" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableDeductCreditAll">
                      <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.withdrawnCondition5">{t("minigameSetting.withdrawnCondition5", "หักเครดิตที่เหลือทั้งหมดเมื่อทำการถอน")}</div>
                      <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.withdrawnCondition6">{t("minigameSetting.withdrawnCondition6", "เมื่อถอนเงินออกจากกระเป๋าแล้ว มีเศษคงเหลือในกระเป๋าระบบจะทำการหักทั้งหมดออกให้เป็น 0")}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="row box-promotion-item-checkbox-radio" id="boxPromotionWithdrawNoAutoBalance">
                <div className="col-12 col-md-6">
                  <div className="form-check minigame-reset disabled fistempty">
                    <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="minigameDisableAutoWithdraw" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameDisableAutoWithdraw">
                      <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.withdrawnCondition7">{t("minigameSetting.withdrawnCondition7", "ไม่อนุญาตให้ถอนอัตโนมัติ เมื่อสมาชิกรับโปรโมชั่น")}</div>
                      <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.withdrawnCondition8">{t("minigameSetting.withdrawnCondition8", "ปิดการถอนอัตโนมัติเมื่อสมาชิกรับโปรโมชั่นใด ๆ")}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="label-minigame d-none">
            <span data-i18n="minigameSetting.turnOverFinishCondition">{t("minigameSetting.turnOverFinishCondition", "กำหนดเงื่อนไขการปลดเทิร์น (หลุดโปร)")}</span>
            <div className="switch">
              <div className="custom-switch switch-alone form-check form-switch">
                <input className="form-check-input" type="checkbox" id="minigameEnableCreditToClearTurnover" onClick={(e) => dom.changeStatusSwitch(e.currentTarget, "2-3-8")} />
              </div>
              <span className="color-emerald-title-1" data-i18n="minigameSetting.onAndOffSetting">{t("minigameSetting.onAndOffSetting", "เปิด / ปิด การใช้งาน")}</span>
            </div>
          </div>
          <div className="input-col-1-p switch-2-3-8 d-none">
            <div>
              <div className="row box-promotion-item-checkbox-radio" id="boxPromotionUnlockTurnRadioBath">
                <div className="col-12 col-md-6 mb-3" {...raw({ type: "button" })}>
                  <div className="form-check minigame-reset disabled fistempty">
                    <input className="form-check-input me-2" type="radio" name="minigameCreditToClearTurnoverRadio" id="minigameEnableMaxRemainCreditToClearTurnover" data-value1="inputMinigameMaxRemainCreditToClearTurnover" data-value2="inputMinigameMaxRemainCreditToClearTurnoverPercentage" onChange={(e) => dom.changeMinigameradioinput(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableMaxRemainCreditToClearTurnover">
                      <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.turnOverFinishCondition1">{t("minigameSetting.turnOverFinishCondition1", "ปลดเทิร์นเมื่อเครดิตคงเหลือน้อยกว่า x บาท")}</div>
                      <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.turnOverFinishCondition2">{t("minigameSetting.turnOverFinishCondition2", "ระบบจะปลดเทิร์นเมื่อเครดิตเหลือน้อยกว่า x บาท")}</span>
                    </label>
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameMaxRemainCreditToClearTurnover">
                    <div className="input-group">
                      <input id="minigameMaxRemainCreditToClearTurnover" type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                      {" "}
                      <span className="input-group-text custom-color" style={{ borderRadius: "0px 8px 8px 0px" }}>บาท</span>
                    </div>
                    <div className="invalid-feedback" id="error-minigameMaxRemainCreditToClearTurnover" data-i18n="minigameSetting.turnOverFinishConditionErrorText" style={{ display: "none" }}>{t("minigameSetting.turnOverFinishConditionErrorText", "รกรุณากรอกปลดเทิร์นเมื่อเครดิตคงเหลือน้อยกว่า x บาท")}</div>
                  </div>
                </div>
              </div>
              <div className="row box-promotion-item-checkbox-radio" id="boxPromotionUnlockTurnRadioPercentage">
                <div className="col-12 col-md-6 mb-3 mb-md-0" {...raw({ type: "button" })}>
                  <div className="form-check minigame-reset disabled fistempty">
                    <input className="form-check-input me-2" type="radio" name="minigameCreditToClearTurnoverRadio" id="minigameEnableMaxRemainCreditToClearTurnoverPercentage" data-value1="inputMinigameMaxRemainCreditToClearTurnoverPercentage" data-value2="inputMinigameMaxRemainCreditToClearTurnover" onChange={(e) => dom.changeMinigameradioinput(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableMaxRemainCreditToClearTurnoverPercentage">
                      <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.turnOverFinishCondition3">{t("minigameSetting.turnOverFinishCondition3", "ปลดเทิร์นเมื่อเครดิตคงเหลือน้อยกว่า x%")}</div>
                      <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.turnOverFinishCondition4">{t("minigameSetting.turnOverFinishCondition4", "ระบบจะปลดเทิร์น เมื่อลูกค้าฝากเงิน ณ ตอนที่มีเครดิต คงเหลือน้อยกว่า x% (คิดจาก โบนัส + ยอดฝาก)")}</span>
                    </label>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="custom-input custom-input-disabled custom-float minigame-checkbox-reset disabled" id="inputMinigameMaxRemainCreditToClearTurnoverPercentage">
                    <div className="input-group">
                      <input id="minigameMaxRemainCreditToClearTurnoverPercentage" type="text" className="form-control" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                      {" "}
                      <span className="input-group-text custom-color" style={{ borderRadius: "0px 8px 8px 0px" }}>%</span>
                    </div>
                    <div className="invalid-feedback" id="error-minigameMaxRemainCreditToClearTurnoverPercentage" data-i18n="minigameSetting.turnOverFinishConditionErrorText2" style={{ display: "none" }}>{t("minigameSetting.turnOverFinishConditionErrorText2", "กรุณากรอกปลดเทิร์นเมื่อเครดิตคงเหลือน้อยกว่า x%")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="label-minigame d-none">
            <span data-i18n="minigameSetting.addCreditCondition">{t("minigameSetting.addCreditCondition", "กำหนดเงื่อนไขการเพิ่มทุน")}</span>
            <div className="switch">
              <div className="custom-switch switch-alone form-check form-switch">
                <input className="form-check-input" type="checkbox" id="minigameEnableIncreaseTurnOver" onClick={(e) => dom.changeStatusSwitch(e.currentTarget, "2-3-9")} />
              </div>
              <span className="color-emerald-title-1" data-i18n="minigameSetting.onAndOffSetting">{t("minigameSetting.onAndOffSetting", "เปิด / ปิด การใช้งาน")}</span>
            </div>
          </div>
          <div className="input-col-1-p switch-2-3-9 d-none">
            <div>
              <div className="row box-promotion-item-checkbox-radio d-none" id="boxPromotionAddCostRadioInactive">
                <div className="col-12 col-md-6 mb-2" {...raw({ type: "button" })}>
                  <div className="form-check minigame-reset disabled fistempty">
                    <input className="form-check-input me-2 active" type="radio" name="minigameIncreaseTurnOverRadio" id="minigameEnableTurnOverDepositOff" data-value-id1="boxMinigameAddCostActiveRadioPoint" data-value-id2="boxMinigameAddCostActiveRadioBath" data-value-other="minigameEnableTurnOverDepositOn" defaultChecked onClick={(e) => dom.changeMinigameCountdownRadio(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableTurnOverDepositOff">
                      <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.addCreditCondition1">{t("minigameSetting.addCreditCondition1", "ไม่กำหนด Turnover จากยอดฝากใหม่")}</div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="row box-promotion-item-checkbox-radio" id="boxPromotionAddCostRadioActive">
                <div className="col-12 col-md-6 mb-2 mb-md-0" {...raw({ type: "button" })}>
                  <div className="form-check minigame-reset disabled fistempty">
                    <input className="form-check-input me-2 active" type="radio" name="minigameIncreaseTurnOverRadio" id="minigameEnableTurnOverDepositOn" data-value-id1="boxMinigameAddCostActiveRadioPoint" data-value-id2="boxMinigameAddCostActiveRadioBath" data-value-id="2" data-value-other="minigameEnableTurnOverDepositOff" onClick={(e) => dom.changeMinigameCountdownRadio(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableTurnOverDepositOn">
                      <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.addCreditCondition2">{t("minigameSetting.addCreditCondition2", "กำหนด Turnover จากยอดฝากใหม่")}</div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3 box-promotion-item-checkbox-radio" id="boxMinigameAddCostRadioActiveInactive">
              <div className="col-12 col-md-6 mb-3" {...raw({ type: "button" })} data-value-id1="boxMinigameAddCostActiveRadioPoint" data-value-id2="boxMinigameAddCostActiveRadioBath" data-value-id="1" onClick={(e) => dom.selectChangeMinigameBoxRadio(e.currentTarget)}>
                <div className="custom-card h-100 box-minigame-click-select minigame-box-reset disabled" id="boxMinigameAddCostActiveRadioPoint">
                  <input id="minigameEnableMinTurnover" name="minigameIncreaseTurnOverRadioBox" className="box-radio active" type="radio" hidden defaultChecked />
                  <div className="row flex-column justify-content-between h-100">
                    <div className="row pe-0">
                      <div className="col-3 mb-3">
                        <img src="/assets/images/minigame/3d-trade-icon.png" width="64" height="64" />
                      </div>
                      <div className="col-9 mb-3">
                        <div className="p2 fw-700" data-i18n="minigameSetting.settingMinigameTurnOverMin">{t("minigameSetting.settingMinigameTurnOverMin", "ต้องทำ Turnover ขั้นต่ำ x เท่า")}</div>
                        <span className="p3" data-i18n="minigameSetting.settingMinigameTurnOverExampleText" style={{ color: "rgb(173, 173, 173)" }}>{t("minigameSetting.settingMinigameTurnOverExampleText", "ตัวอย่าง : ลูกค้าฝาก 1,000 บาท รับโปร 200 เครดิต หากตั้งค่า ทำ เทิร์น 5 เท่า ลูกค้าจะต้องทำเทิร์น = (1,000 + 200) x 5 = 6,000 ถึงจะถอนเครดิตได้")}</span>
                      </div>
                    </div>
                    <div className="">
                      <div className="col-12">
                        <div className="custom-input custom-float" id="inputMinigameMinTurnover">
                          <div className="p2 fw-700 mb-2" data-i18n="minigameSetting.minigameTurnOverPoint">{t("minigameSetting.minigameTurnOverPoint", "ค่า Turnover")}</div>
                          <div className="input-group minigame-box-reset disabled">
                            <input id="minigameMinTurnover" type="text" className="form-control validatezero active" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                            {" "}
                            <span className="input-group-text custom-color" style={{ borderRadius: "0px 8px 8px 0px" }}>เท่า</span>
                          </div>
                          <div className="invalid-feedback text-center" id="error-minigameMinTurnover" data-i18n="minigameSetting.minigameTurnOverPointErrorText" style={{ display: "none" }}>{t("minigameSetting.minigameTurnOverPointErrorText", "กรุณากรอกค่า Turnover")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3" {...raw({ type: "button" })} data-value-id1="boxMinigameAddCostActiveRadioPoint" data-value-id2="boxMinigameAddCostActiveRadioBath" data-value-id="2" onClick={(e) => dom.selectChangeMinigameBoxRadio(e.currentTarget)}>
                <div className="custom-card h-100 box-minigame-click-select minigame-box-reset disabled" id="boxMinigameAddCostActiveRadioBath">
                  <input id="minigameEnableMinTurnoverCredit" name="minigameIncreaseTurnOverRadioBox" className="box-radio active" type="radio" hidden />
                  <div className="row flex-column justify-content-between h-100">
                    <div className="row pe-0">
                      <div className="col-3 mb-3">
                        <img src="/assets/images/minigame/3d-trade-icon.png" width="64" height="64" />
                      </div>
                      <div className="col-9 mb-3">
                        <div className="p2 fw-700" data-i18n="minigameSetting.settingMinigameTurnOverMin">{t("minigameSetting.settingMinigameTurnOverMin", "ต้องทำ Turnover ขั้นต่ำ x เท่า")}</div>
                        <span className="p3" data-i18n="minigameSetting.settingMinigameTurnOverExampleText" style={{ color: "rgb(173, 173, 173)" }}>{t("minigameSetting.settingMinigameTurnOverExampleText", "ตัวอย่าง : ลูกค้าฝาก 1,000 บาท รับโปร 200 เครดิต หากตั้งค่า ทำ เทิร์น 5 เท่า ลูกค้าจะต้องทำเทิร์น = (1,000 + 200) x 5 = 6,000 ถึงจะถอนเครดิตได้")}</span>
                      </div>
                    </div>
                    <div className="">
                      <div className="col-12">
                        <div className="custom-input custom-float" id="inputMinigameminTurnoverCredit">
                          <div className="p2 fw-700 mb-2" data-i18n="minigameSetting.minigameTurnOverPoint">{t("minigameSetting.minigameTurnOverPoint", "ค่า Turnover")}</div>
                          <div className="input-group minigame-box-reset disabled">
                            <input id="minigameminTurnoverCredit" type="text" className="form-control active" placeholder="0" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                            {" "}
                            <span className="input-group-text custom-color" data-i18n="minigameSetting.baht" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.baht", "บาท")}</span>
                          </div>
                          <div className="invalid-feedback" id="error-minigameminTurnoverCredit" data-i18n="minigameSetting.minigameTurnOverPointErrorText" style={{ display: "none" }}>{t("minigameSetting.minigameTurnOverPointErrorText", "กรุณากรอกค่า Turnover")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="group-btn-minigame-setting ms-0 me-0" id="groupBtnSettingMinigame5">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <button id="buttonNextPromotionStepfinal5" className="btn btn-outline-warning" data-type="next" data-i18n="minigameSetting.summarizeAndSave" style={nav.summaryButtonStyle} onClick={() => nav.toSummary("5")}>{t("minigameSetting.summarizeAndSave", "ไปหน้าสรุป")}</button>
            </div>
            <div>
              <button className="btn system-btn btn-outline btn-rounded" data-type="previous" data-i18n="minigameSetting.back" style={{ width: "168px" }} onClick={() => nav.go("5", "4")}>{t("minigameSetting.back", "ขั้นตอนก่อนหน้า")}</button>
              {" "}
              <button className="btn system-btn btn-rounded ms-2" data-type="next" data-i18n="minigameSetting.next" style={{ width: "168px" }} onClick={() => nav.go("5", "6")}>{t("minigameSetting.next", "ถัดไป")}</button>
            </div>
          </div>
        </div>
      </div>
  );
}
