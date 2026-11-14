"use client";

// Step 3 "การได้รับสิทธิ์": deposit rules that give 1 right, approval / cancel options and the
// Balance / withdraw checks. Markup = captured create-lucky-wheel_step3_deposit-rights.html
// (the per-slice reward and bonus-type <template>s of that file are used by step 4 instead).

import { useState } from "react";
import { CustomDropdown, type DropdownItem } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { MiniGameDetail } from "@/lib/api/mini-games";
import * as dom from "./wizard-dom";
import { TypeText } from "./wizard-texts";
import { shownWhen, type StepProps } from "./wizard-types";

type DepositType = MiniGameDetail["depositType"];
type AmountType = MiniGameDetail["amountType"];
type AmountBox = "equal" | "min" | "max" | "range";

const BOX_OF: Record<AmountType, AmountBox> = { "equal-deposit": "equal", "min-deposit": "min", "max-deposit": "max", "deposit-period": "range" };

export function Step3Rights({ type, step, nav, initial }: StepProps) {
  const t = useT();
  const [depositType, setDepositType] = useState<DepositType | null>(initial?.detail.depositType ?? "deposit-once");
  const [amountType, setAmountType] = useState<AmountType | null>(initial?.detail.amountType ?? "min-deposit");

  const depositTypeItems: DropdownItem[] = [
    { value: "deposit-once", chip: "deposit-once", label: t("minigameSetting.depositOnce", "ฝากครั้งเดียว") },
    { value: "accumulated-deposit", chip: "accumulated-deposit", label: t("minigameSetting.accumulatedDeposit", "ฝากสะสม") },
    { value: "continuous-deposit", chip: "continuous-deposit", label: t("minigameSetting.continuousDeposit", "ฝากติดต่อกัน") },
  ];
  // .showOnlyBoxDepositOnce items (ฝากสูงสุด / ช่วงยอดฝาก) only for "ฝากครั้งเดียว"
  const amountTypeItems: DropdownItem[] = [
    { value: "equal-deposit", chip: "equal-deposit", label: t("minigameSetting.equalDeposit", "ฝากเท่ากับ") },
    { value: "min-deposit", chip: "min-deposit", label: t("minigameSetting.minDeposit", "ฝากขั้นต่ำ") },
    ...(depositType === "deposit-once"
      ? [
          { value: "max-deposit", chip: "max-deposit", label: t("minigameSetting.maxDeposit", "ฝากสูงสุด"), className: "showOnlyBoxDepositOnce" },
          { value: "deposit-period", chip: "deposit-period", label: t("minigameSetting.depositPeriod", "ช่วงยอดฝาก"), className: "showOnlyBoxDepositOnce" },
        ]
      : []),
  ];
  const fakeLabel = (item: DropdownItem) => item.label;

  // A new deposit type clears the amount type and shows the "จำนวนยอดฝาก" box
  const onDepositType = (value: string | null) => {
    setDepositType(value as DepositType | null);
    setAmountType(null);
  };
  const onAmountType = (value: string | null) => setAmountType(value as AmountType | null);
  const box: AmountBox = depositType === "accumulated-deposit" || !amountType ? "equal" : BOX_OF[amountType];

  return (
    <div className="canvas-box-body" id="SettingMinigameStep3" style={shownWhen(step === "3")}>
      <div className="tab-header">
        <div className="header-in-body active">
          <div className="tab-group">
            <span className="p1 fw-700" id="textTabsStep2-3-1">
    <TypeText type={type} k="tabs2-3-1" />
            </span>
          </div>
        </div>
      </div>
      <div className="main-in-detail-body content-col-1">
        <div className="label-minigame">
          <span id="textTabsStep2-3-2">
    <TypeText type={type} k="tabs2-3-2" />
          </span>
        </div>
        <div className="input-col-1-p setting-minigame-step-3-row-1">
          <div>
            <div className="text-start">
              <span className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.settingMinigameStep3SubText">{t("minigameSetting.settingMinigameStep3SubText", "กำหนดยอดฝากที่สมาชิกต้องทำเพื่อให้เข้าเงื่อนไขการได้สิทธิ์มินิเกมส์ จำนวน 1 สิทธิ์")}</span>
            </div>
            <div className="row my-3">
              <div className="col-12 col-md-6">
                <div className="custom-input custom-float">
                  <div className="text-start color-emerald-title-1 p2 fw-700 mb-2" data-i18n="minigameSetting.depositType">{t("minigameSetting.depositType", "ประเภทการฝาก")}</div>
                  <CustomDropdown id="customMinigameDepositTypeDropdown" fakeClassName="multiple" placeholder="เลือกประเภทการฝาก" auto stretch items={depositTypeItems} fakeValue={fakeLabel} value={depositType} onChange={onDepositType}>
    <input type="hidden" name="depositType" id="depositType" value={depositType ?? ""} readOnly />
    <div className="invalid-feedback" id="error-customMinigameDepositTypeDropdown" data-i18n="minigameSetting.depositTypeErrorText" style={{ display: "none" }}>{t("minigameSetting.depositTypeErrorText", "กรุณาเลือกประเภทการฝาก")}</div>
    </CustomDropdown>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-6 mb-3 mb-md-0" id="showBoxDepositOnceAndContinue" style={shownWhen(depositType !== "accumulated-deposit")}>
                <div className="custom-input custom-float">
                  <div className="text-start color-emerald-title-1 p2 fw-700 mb-2" data-i18n="minigameSetting.depositTransactionType">{t("minigameSetting.depositTransactionType", "ประเภทยอดฝาก")}</div>
                  <CustomDropdown id="customMinigameDepositAmountTypeDropdown" className="custom-input dropdown-wrapper require" fakeClassName="multiple" placeholder="เลือกประเภทยอดฝาก" auto stretch items={amountTypeItems} fakeValue={fakeLabel} value={amountType} onChange={onAmountType}>
    <div className="invalid-feedback" id="error-customMinigameDepositAmountTypeDropdown" data-i18n="minigameSetting.depositTransactionTypeErrorText" style={{ display: "none" }}>{t("minigameSetting.depositTransactionTypeErrorText", "กรุณาเลือกประเภทยอดฝาก")}</div>
    </CustomDropdown>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3" id="showBoxDepositTypeEqualAndCollect" style={shownWhen(box === "equal")}>
                <div className="custom-input custom-float fistempty" id="inputMinigameAmountAutoDeposit">
                  <div className="text-start p2 color-emerald-title-1 fw-700 mb-2" data-i18n="minigameSetting.depositTransactionCount">{t("minigameSetting.depositTransactionCount", "จำนวนยอดฝาก")}</div>
                  <div className="input-group">
                    <input id="minigameAmountAutoDeposit" type="text" className="form-control validatezero fistempty" placeholder="0.00" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.baht" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-minigameAmountAutoDeposit" data-i18n="minigameSetting.depositTransactionCountErrorText" style={{ display: "none" }}>{t("minigameSetting.depositTransactionCountErrorText", "กรุณากรอกจำนวนยอดฝาก")}</div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3" id="showBoxDepositTypeMin" style={shownWhen(box === "min")}>
                <div className="custom-input custom-float fistempty" id="inputMinigameMinAmountAutoDeposit">
                  <div className="text-start color-emerald-title-1 p2 fw-700 mb-2" data-i18n="minigameSetting.depositTransactionMin">{t("minigameSetting.depositTransactionMin", "จำนวนยอดฝากขั้นต่ำ")}</div>
                  <div className="input-group">
                    <input id="minigameMinAmountAutoDeposit" defaultValue={initial?.detail.minAmount} type="text" className="form-control validatezero fistempty" placeholder="0.00" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.baht" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-minigameMinAmountAutoDeposit" data-i18n="minigameSetting.depositTransactionMinErrorText" style={{ display: "none" }}>{t("minigameSetting.depositTransactionMinErrorText", "กรุณากรอกจำนวนยอดฝากขั้นต่ำ")}</div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3" id="showBoxDepositTypeMax" style={shownWhen(box === "max")}>
                <div className="custom-input custom-float fistempty" id="inputMinigameMaxAmountAutoDeposit">
                  <div className="text-start color-emerald-title-1 p2 fw-700 mb-2" data-i18n="minigameSetting.depositTransactionMax">{t("minigameSetting.depositTransactionMax", "")}</div>
                  <div className="input-group">
                    <input id="minigameMaxAmountAutoDeposit" type="text" className="form-control validatezero fistempty" placeholder="0.00" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.baht" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-minigameMaxAmountAutoDeposit" data-i18n="minigameSetting.depositTransactionMaxErrorText" style={{ display: "none" }}>{t("minigameSetting.depositTransactionMaxErrorText", "")}</div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3" id="showBoxDepositTypeRange" style={shownWhen(box === "range")}>
                <div className="custom-input custom-float fistempty" id="inputMinigameAmountAutoDepositRange">
                  <div className="text-start color-emerald-title-1 p2 fw-700 mb-2" data-i18n="minigameSetting.depositTransactionRange">{t("minigameSetting.depositTransactionRange", "")}</div>
                  <div className="input-group">
                    <input id="minigameAmountAutoDepositRange" type="text" className="form-control validatezero fistempty" placeholder="0.00" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                    {" "}
                    <span className="input-group-text custom-color" data-i18n="minigameSetting.baht" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                  <div className="invalid-feedback" id="error-minigameAmountAutoDepositRange" data-i18n="minigameSetting.depositTransactionRangeErrorText" style={{ display: "none" }}>{t("minigameSetting.depositTransactionRangeErrorText", "")}</div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3" id="showBoxDepositContinue" style={shownWhen(depositType === "continuous-deposit")}>
                <div className="custom-input custom-float fistempty" id="inputMinigameDepositCount">
                  <div className="text-start color-emerald-title-1 p2 fw-700 mb-2" data-i18n="minigameSetting.depositCount">{t("minigameSetting.depositCount", "")}</div>
                  <div className="input-group">
                    <input id="minigameDepositCount" type="text" className="form-control validatezero fistempty" placeholder="0.00" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                    {" "}
                    <span className="input-group-text custom-color"  style={{ borderRadius: "0px 8px 8px 0px" }}>ครั้ง</span>
                  </div>
                  <div className="invalid-feedback" id="error-minigameDepositCount" data-i18n="minigameSetting.depositCountErrorText" style={{ display: "none" }}>{t("minigameSetting.depositCountErrorText", "")}</div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3" id="showBoxDepositCollect" style={shownWhen(depositType === "accumulated-deposit")}>
                <div className="custom-input custom-float fistempty" id="inputMinigameDepositPeriod">
                  <div className="text-start color-emerald-title-1 p2 fw-700 mb-2" data-i18n="minigameSetting.dateRange">{t("minigameSetting.dateRange", "")}</div>
                  <div className="input-group">
                    <input id="minigameDepositPeriod" type="text" className="form-control validatezero fistempty" placeholder="0.00" onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                    {" "}
                    <span className="input-group-text custom-color"  style={{ borderRadius: "0px 8px 8px 0px" }}>วัน</span>
                  </div>
                  <div className="invalid-feedback" id="error-minigameDepositPeriod" data-i18n="minigameSetting.dateRangeErrorText" style={{ display: "none" }}>{t("minigameSetting.dateRangeErrorText", "")}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-12 mb-3">
                <div className="text-start">
                  <span className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.promotionMinigame">{t("minigameSetting.promotionMinigame", "กำหนดการอนุมัติรับสิทธิ์มินิเกมส์")}</span>
                  {" "}
                  <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.promotionMinigameSubText">{t("minigameSetting.promotionMinigameSubText", "(ในกรณีที่สมาชิกติดเทิร์นโอเวอร์โปรโมชั่นอยู่)")}</span>
                </div>
              </div>
              <div className="col-6 col-md-6" id="boxGetPromotionPerUserDay">
                <div className="col-12 col-md-12 mb-3">
                  <div className="form-check">
                    <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="isMemberPromotionSuccess" data-value="minigameEnableWhenTurnOverComplete" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableWhenTurnOverComplete">
                      <span className="p2 color-emerald-title-1" data-i18n="minigameSetting.getPromotionPerUserDay">{t("minigameSetting.getPromotionPerUserDay", "อนุมัติให้รับสิทธิ์มินิเกมส์เมื่อทำเทิร์นโอเวอร์สำเร็จ")}</span>
                      {" "}
                      <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.getPromotionPerUserDaySubText">{t("minigameSetting.getPromotionPerUserDaySubText", "สมาชิกจะสามารถรับสิทธิ์ได้ทันทีเมื่อทำเทิร์นโอเวอร์ที่ค้างจนสำเร็จ")}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-6" id="boxGetPromotionPerUserWeek">
                <div className="col-12 col-md-12 mb-3">
                  <div className="form-check">
                    <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="isMemberCanCancel" data-value="minigameEnableCancelPromotionForMiniGame" onClick={(e) => dom.changeMinigamecheckbox(e.currentTarget)} />
                    {" "}
                    <label className="form-check-label d-flex flex-column" htmlFor="minigameEnableCancelPromotionForMiniGame">
                      <span className="p2 color-emerald-title-1" data-i18n="minigameSetting.getPromotionPerUserWeek">{t("minigameSetting.getPromotionPerUserWeek", "อนุญาตให้สมาชิกยกเลิกโปรโมชั่นเพื่อรับสิทธิ์มินิเกมส์ได้")}</span>
                      {" "}
                      <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.getPromotionPerUserWeekSubText">{t("minigameSetting.getPromotionPerUserWeekSubText", "ให้สมาชิกยกเลิกโปรโมชั่นปัจจุบัน เพื่อรับสิทธิ์มินิเกมส์ได้")}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="input-col-1-p">
          <div className="text-start">
            <span className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.withdrawnSettingHeader">{t("minigameSetting.withdrawnSettingHeader", "ตั้งค่าตรวจสอบยอด Balance และ ยอดถอน เมื่อสมาชิกทำการถอนเงิน")}</span>
          </div>
          <div className="row my-3">
            <div className="col-12 col-md-6 mb-3">
              <div className="form-check">
                <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="enableCustomerCreditBalance" onClick={() => dom.enableCreditBalance()} />
                {" "}
                <label className="form-check-label d-flex flex-column" htmlFor="enableCustomerCreditBalance">
                  <div className="p2 color-emerald-title-1">
                    <span data-i18n="minigameSetting.withdrawnSetting">{t("minigameSetting.withdrawnSetting", "ตรวจสอบยอด Balance หลังจากทำการถอนเงิน หากมี ยอด Balance น้อยกว่า x บาท จะทำการหัก")}</span>
                    {" "}
                    <br />
                    <span data-i18n="minigameSetting.withdrawnSetting2">{t("minigameSetting.withdrawnSetting2", "สิทธิ์มินิเกมส์")}</span>
                  </div>
                  <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.withdrawnSettingSubText">{t("minigameSetting.withdrawnSettingSubText", "คำนวนยอด Balance หลังจากทำการหักจากยอดที่ถอนออกไป")}</span>
                </label>
              </div>
              <div className="custom-input custom-input-disabled custom-float mt-2">
                <div className="input-group">
                  <span className="input-group-text custom-color" data-i18n="minigameSetting.balanceLowerThan" style={{ borderRadius: "8px 0px 0px 8px" }}>{t("minigameSetting.balanceLowerThan", "Balance น้อยกว่า")}</span>
                  {" "}
                  <input id="customerCreditBalance" type="text" className="form-control" placeholder="0.0" disabled onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                  {" "}
                  <span className="input-group-text custom-color" data-i18n="minigameSetting.baht" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.baht", "บาท")}</span>
                </div>
              </div>
              <div className="col-12 col-md-12 mb-3 mb-md-0">
                <div className="text-start color-emerald-title-1 p2 fw-700 mb-2 mt-2" data-i18n="minigameSetting.deductMemberMinigame">{t("minigameSetting.deductMemberMinigame", "หักสิทธิ์มินิเกมส์สมาชิก")}</div>
                <div className="row">
                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <div className="custom-input custom-float" id="boxReduceQuota">
                      <div className="input-group">
                        <input id="reduceQuota" type="text" className="form-control" placeholder="0" disabled onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                        {" "}
                        <span className="input-group-text custom-color" data-i18n="minigameSetting.rights" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.rights", "สิทธิ์")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-3 mb-md-0" style={{ alignSelf: "center" }}>
                    <div className="form-check">
                      <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="enableReduceAllQuota" disabled />
                      {" "}
                      <label className="form-check-label d-flex flex-column" htmlFor="">
                        <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.deductAll">{t("minigameSetting.deductAll", "หักสิทธิ์ทั้งหมด")}</div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <div className="form-check">
                <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="enableCustomerCreditWithdraw" onClick={() => dom.enableCreditBalanceWithdraw()} />
                {" "}
                <label className="form-check-label d-flex flex-column" htmlFor="enableCustomerCreditWithdraw">
                  <div className="p2 color-emerald-title-1">
                    <span data-i18n="minigameSetting.enableCustomerCreditWithdraw">{t("minigameSetting.enableCustomerCreditWithdraw", "ตรวจสอบ ยอดถอน หลังจากทำการถอนเงิน หากมี ยอดถอน น้อยกว่า x บาท จะทำการหัก")}</span>
                    {" "}
                    <br />
                    {" "}
                    <span data-i18n="minigameSetting.enableCustomerCreditWithdraw2">{t("minigameSetting.enableCustomerCreditWithdraw2", "สิทธิ์มินิเกมส์")}</span>
                  </div>
                  <span className="p3 color-emerald-title-2" data-i18n="minigameSetting.enableCustomerCreditWithdrawSubText">{t("minigameSetting.enableCustomerCreditWithdrawSubText", "คำนวนยอด ถอน หลังจากทำการหักจากยอดที่ถอนออกไป")}</span>
                </label>
              </div>
              <div className="custom-input custom-float mt-2">
                <div className="input-group">
                  <span className="input-group-text custom-color" data-i18n="minigameSetting.withdrawnIsLower" style={{ borderRadius: "8px 0px 0px 8px" }}>{t("minigameSetting.withdrawnIsLower", "ยอดถอน น้อยกว่า")}</span>
                  {" "}
                  <input id="customerCreditWithdraw" type="text" className="form-control" placeholder="0.0" disabled onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                  {" "}
                  <span className="input-group-text custom-color" data-i18n="minigameSetting.baht" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.baht", "บาท")}</span>
                </div>
              </div>
              <div className="col-12 col-md-12 mb-3 mb-md-0">
                <div className="text-start color-emerald-title-1 p2 fw-700 mb-2 mt-2" data-i18n="minigameSetting.deductMemberMinigame">{t("minigameSetting.deductMemberMinigame", "หักสิทธิ์มินิเกมส์สมาชิก")}</div>
                <div className="row">
                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <div className="custom-input custom-float">
                      <div className="input-group">
                        <input id="reduceQuotaWithdraw" type="text" className="form-control" placeholder="0" disabled onKeyDown={(e) => dom.inputAcceptKey(e, "integerPositive")} />
                        {" "}
                        <span className="input-group-text custom-color" data-i18n="minigameSetting.rights" style={{ borderRadius: "0px 8px 8px 0px" }}>{t("minigameSetting.rights", "สิทธิ์")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-3 mb-md-0" style={{ alignSelf: "center" }}>
                    <div className="form-check">
                      <input className="form-check-input form-check-input-custom-mini-game me-2" type="checkbox" id="enableReduceAllQuotaWithdraw" disabled />
                      {" "}
                      <label className="form-check-label d-flex flex-column" htmlFor="">
                        <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.deductAll">{t("minigameSetting.deductAll", "หักสิทธิ์ทั้งหมด")}</div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {" dropped-->"}
      </div>
      <div className="group-btn-minigame-setting ms-0 me-0" id="groupBtnSettingMinigame3">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <button id="buttonNextPromotionStepfinal3" className="btn btn-outline-warning btn-clone" data-type="next" data-i18n="minigameSetting.summarizeAndSave" style={nav.summaryButtonStyle} onClick={() => nav.toSummary("3")}>{t("minigameSetting.summarizeAndSave", "ไปหน้าสรุป")}</button>
          </div>
          <div>
            <button className="btn system-btn btn-outline btn-rounded btn-clone" data-type="previous" data-i18n="minigameSetting.back" style={{ width: "168px" }} onClick={() => nav.go("3", "2-3")}>{t("minigameSetting.back", "ขั้นตอนก่อนหน้า")}</button>
            {" "}
            <button className="btn system-btn btn-rounded ms-2 btn-clone" data-type="next" data-i18n="minigameSetting.next" style={{ width: "168px" }} onClick={() => nav.go("3", "4")}>{t("minigameSetting.next", "ถัดไป")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
