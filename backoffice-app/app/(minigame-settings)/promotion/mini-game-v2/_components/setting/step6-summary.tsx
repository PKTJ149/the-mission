"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

// Step 6 summary ("Done") and the detail (eye) view. Markup = #SettingMinigameStep6 of
// create-lucky-wheel_step5-turnover_and_step6-summary.html; the values are written into it by
// collectSummary() (wizard-summary.ts) like the original getMinigameDetail(). The rewards list is
// rendered here from view-lucky-wheel_rewards-accordion_filled.html.

import { Fragment, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import type { MiniGameSliceBonus, MiniGameType } from "@/lib/api/mini-games";
import { WheelShow } from "./step4-display";
import type { Summary } from "./wizard-summary";
import { TypeText } from "./wizard-texts";
import { raw, shownWhen, type StepProps } from "./wizard-types";

// The picture at the top: a copy of the step 4 wheel preview, or the mini-game reward image
function SummaryPicture({ type, count }: { type: MiniGameType; count: number }) {
  if (type === "mini-game") {
    return (
      <div className="wheel-wrapper preview-minigame" id="showStepEnd">
        <img src="https://p88.blob.core.windows.net/images/minigame/minigame-reward.png" className="box-img3 showImagePreviewPromotionDetail imgMinigameRewardMainSrc" />
      </div>
    );
  }
  return <WheelShow id="showStepEnd" count={count} />;
}

function bonusTexts(bonus: MiniGameSliceBonus): [string, string] {
  switch (bonus.type) {
    case "credit_fix":
      return ["Credit Fixed Rate", `${bonus.credit} baht`];
    case "credit_percentage":
      return ["Credit Percentage (%)", ""];
    case "point":
      return ["Point", ""];
    case "mini-game":
      return ["Mini game coupon", ""];
    case "lotto":
      return ["Lotto coupon", ""];
    case "reward":
      return ["Prize", ""];
  }
}

// #showPartsLuckywheelluckyWheelRewards: one Bootstrap-collapse row per slice, the first one open
function RewardsAccordion({ summary }: { summary: Summary | null }) {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div id="showPartsLuckywheelluckyWheelRewards">
      {summary?.slices.map((slice, i) => (
        <Fragment key={i}>
          <div
            className={open === i ? "row dropdown-wheel-detail " : "row dropdown-wheel-detail collapsed"}
            {...raw({ type: "button" })}
            data-bs-toggle="collapse"
            data-bs-target={`#openDropdownWheelDetail${i}`}
            aria-expanded="true"
            aria-controls={`openDropdownWheelDetail${i}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="col-4 mb-1">
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div className="p2 color-emerald-title-1 fw-700">Wheel {i + 1} :</div>
                <div>
                  <svg width="16" height="8" viewBox="0 0 16 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.37427 2.12485C2.37427 1.88497 2.46582 1.64497 2.64893 1.46216C3.01514 1.09595 3.6084 1.09595 3.97461 1.46216L7.99927 5.48813L12.0247 1.46216C12.3909 1.09595 12.9841 1.09595 13.3503 1.46216C13.7166 1.82837 13.7166 2.42163 13.3503 2.78784L8.66284 7.47534C8.29663 7.84155 7.70337 7.84155 7.33716 7.47534L2.64966 2.78784C2.46509 2.60474 2.37427 2.36479 2.37427 2.12485Z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="col mb-1">
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div className="p2 color-emerald-title-1">
                  <span className="bonus-description-minigame-tr" data-i18n="minigameSetting.bonusDescriptionMinigame">{t("minigameSetting.bonusDescriptionMinigame", "คำอธิบายโบนัส")}</span>
                </div>
                <div className="p2 color-emerald-title-1">{slice.description}</div>
              </div>
              <div className={open === i ? "col collapse show" : "col collapse "} id={`openDropdownWheelDetail${i}`}>
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="p2 color-emerald-title-1">
                    <span className="bonus-given-to-member-tr" data-i18n="minigameSetting.bonusGivenToMember">{t("minigameSetting.bonusGivenToMember", "จำนวนแจกโบนัส")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1">{slice.isUnlimited ? "ไม่จำกัด (Infinite)" : "จำกัด (Limited)"}</div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="p2 color-emerald-title-1">
                    <span className="bonus-noti-when-expire-tr" data-i18n="minigameSetting.bonusNotiWhenExpire">{t("minigameSetting.bonusNotiWhenExpire", "แจ้งเตือนเมื่อใกล้หมด")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1">{slice.isAlert ? "แจ้งเตือน (Alert)" : "ไม่แจ้งเตือน (No Alert)"}</div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="p2 color-emerald-title-1">
                    <span className="bonus-chance-number-tr" data-i18n="minigameSetting.bonusChanceNumber">{t("minigameSetting.bonusChanceNumber", "โอกาสออก")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1">{slice.percentage}%</div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="p2 color-emerald-title-1 fw-700">
                    <span className="bonus-reward-tr" data-i18n="minigameSetting.bonusReward">{t("minigameSetting.bonusReward", "โบนัสที่แจก")}</span>
                  </div>
                </div>
                {slice.bonuses.map((bonus, x) => {
                  const [text1, text2] = bonusTexts(bonus);
                  return (
                    <div key={x} className="d-flex flex-wrap justify-content-between align-items-center">
                      <div className="p2 ms-3" style={{ color: "#919191" }}>
                        {text1}
                      </div>
                      <div className="p2" style={{ color: "#FFFFFF" }}>
                        {text2}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <hr style={{ margin: "0px -28px 8px -28px" }} />
        </Fragment>
      ))}
    </div>
  );
}

type Step6Props = StepProps & { summary: Summary | null; sliceCount: number };

export function Step6Summary({ type, action, step, nav, summary, sliceCount }: Step6Props) {
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const confirmText: readonly [string, string] = action === "edit" ? ["minigameSetting.minigameConfirmButton", "ยืนยันการแก้ไข"] : ["minigameSetting.minigameConfirmCreate", "ยืนยันการสร้าง"];
  return (
    <div className="canvas-box-body" id="SettingMinigameStep6" style={shownWhen(step === "6")} ref={rootRef}>
      <div className="tab-header">
        <div className="header-in-body active">
          <div className="tab-group justify-content-center">
            <span className="p1 fw-700" id="textHeadDetail">
    <TypeText type={type} k="headDetail" />
            </span>
          </div>
        </div>
      </div>
      <div className="main-in-detail-body content-col-1">
        <div className="input-col-1-p">
          <div className="d-flex align-items-center justify-content-center">
            <SummaryPicture type={type} count={sliceCount} />
          </div>
        </div>
        <div className="label-minigame" id="textHeaderAllDetail">
    <TypeText type={type} k="headerAllDetail" />
        </div>
        <div className="input-col-1-p">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" id="textStatusDetail">
    <TypeText type={type} k="statusDetail" />
    </div>
              </div>
              <div className="col mb-1">
                <div className="status-minigame minigame-on" id="showStatusDetail1" style={{ display: "none" }}>
                  <img src="/assets/images/minigame/switch-on.svg" style={{ display: "none" }} />
                  <span data-i18n="minigameSetting.filterStatusOn">{t("minigameSetting.filterStatusOn", "เปิดใช้งาน")}</span>
                </div>
                <div className="status-minigame minigame-off" id="showStatusDetail2">
                  <img src="/assets/images/minigame/switch-off.svg" />
                  <span data-i18n="minigameSetting.filterStatusOff">{t("minigameSetting.filterStatusOff", "ปิดใช้งาน")}</span>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" id="textNameDetail">
    <TypeText type={type} k="nameDetail" />
                </div>
              </div>
              <div className="col mb-1">
                <div className="p2 color-emerald-title-1" id="showName">ฝากประจำนับโปร ทุกวัน รับไม่เว้น ไม่เน้น รับไปเล้ย</div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" id="textConditionDetail">
    <TypeText type={type} k="conditionDetail" />
                </div>
              </div>
              <div className="col mb-1">
                <div className="show-condition-html color-emerald-title-1" id="showconditionHtml" />
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" id="textTestDetail">
                  <span data-i18n="minigameSetting.summaryAgentChoose">{t("minigameSetting.summaryAgentChoose", "Agent ที่เลือก :")}</span>
                </div>
              </div>
              <div className="col mb-1">
                <div className="d-flex flex-wrap align-items-center gap-2" id="showLimitAgentGroupActiveHtml">
                  <div className="text-center">
                    <span className="custom-badge bg-green-10">agent demo 1</span>
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.summaryDateHeader">{t("minigameSetting.summaryDateHeader", "ระยะเวลาโปรโมชั่นและวันทำงานของโปรโมชั่น")}</span>
        </div>
        <div className="input-col-1-p">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryPromotionPeriod">{t("minigameSetting.summaryPromotionPeriod", "ระยะเวลาโปรโมชั่น :")}</div>
              </div>
              <div className="col mb-1">
                <div className="p2 color-emerald-title-1" id="showStartDateEndDate">-</div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryDateActive">{t("minigameSetting.summaryDateActive", "วันทำงานของโปรโมชั่น :")}</div>
              </div>
              <div className="col mb-1">
                <div className="row mb-2">
                  <div className="col-12 col-lg-3">
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryActive" >{t("minigameSetting.summaryActive", "วันทำงาน :")}</div>
                  </div>
                  <div className="col-12 col-lg-9">
                    <div className="d-flex flex-wrap gap-2">
                      <div id="showEnableEveryday">
                        <div className="d-flex align-items-center gap-1">
                          <div className="box-list-date-promotion" style={{ background: "rgb(145, 145, 145)" }} />
                          <div className="p3 color-emerald-title-1" data-i18n="minigameSetting.allDate">{t("minigameSetting.allDate", "ทุกวัน")}</div>
                        </div>
                      </div>
    {/* collapsed in the capture: alternative texts, written by applySummary() */}
                    </div>
                  </div>
                </div>
                <div className="row color-emerald-title-1" id="showMinigameTime" />
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.summaryCountdownHeader">{t("minigameSetting.summaryCountdownHeader", "การรับเวลาถอยหลัง (Countdown) วันหมดอายุโปรโมชั่น")}</span>
        </div>
        <div className="input-col-1-p">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryStatus">{t("minigameSetting.summaryStatus", "สถานะ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="status-minigame minigame-on" id="showEnableCountDown1">
                  <img src="/assets/images/minigame/switch-on.svg" />
                  <span data-i18n="minigameSetting.filterStatusOn">{t("minigameSetting.filterStatusOn", "เปิดใช้งาน")}</span>
                </div>
                <div className="status-minigame minigame-off" id="showEnableCountDown2">
                  <img src="/assets/images/minigame/switch-off.svg" />
                  <span data-i18n="minigameSetting.filterStatusOff">{t("minigameSetting.filterStatusOff", "ปิดใช้งาน")}</span>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryCountdownType">{t("minigameSetting.summaryCountdownType", "รูปแบบการนับถอยหลัง :")}</div>
              </div>
              <div className="col mb-1">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="p2 color-emerald-title-1" id="showEnableCountDownCreated" data-i18n="minigameSetting.summaryCountdownType1">{t("minigameSetting.summaryCountdownType1", "นับถอยหลังทันทีที่สร้างวงล้อนำโชคสำเร็จ")}</div>
                  <div className="p2 color-emerald-title-1" id="showEnableCountDownSetTime" data-i18n="minigameSetting.summaryCountdownType2" style={{ display: "none" }}>{t("minigameSetting.summaryCountdownType2", "นับถอยหลังทันทีเมื่อถึงกำหนด")}</div>
                  <div className="p2 color-emerald-title-1" >
                    <span data-i18n="minigameSetting.summaryCountdownType3">{t("minigameSetting.summaryCountdownType3", "นับถอยหลังทันทีเมื่อเหลืออีก")}</span>
                    {" "}
                    <span id="showEnableRemainingDay">7</span>
                    {" "}
                    <span data-i18n="minigameSetting.day">{t("minigameSetting.day", "วัน")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" >
                    <span data-i18n="minigameSetting.summaryCountdownType3">{t("minigameSetting.summaryCountdownType3", "นับถอยหลังทันทีเมื่อเหลืออีก")}</span>
                    {" "}
                    <span id="showEnableRemainingDateTime" />
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row d-none">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryCountdownClock">{t("minigameSetting.summaryCountdownClock", "รูปแบบนาฬิกา Countdown :")}</div>
              </div>
              <div className="col mb-1" id="showCountDownColorCode" />
            </div>
            <hr className="d-none" style={{ margin: "0px -28px 8px -28px" }} />
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.summaryMemberAndCouponHeader">{t("minigameSetting.summaryMemberAndCouponHeader", "การจำกัดการรับสิทธิ์ของสมาชิก ระดับโปรโมชั่น")}</span>
        </div>
        <div className="input-col-1-p">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryStatus">{t("minigameSetting.summaryStatus", "สถานะ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="status-minigame minigame-on" id="showEnableMaxPromotion1">
                  <img src="/assets/images/minigame/switch-on.svg" />
                  <span data-i18n="minigameSetting.filterStatusOn">{t("minigameSetting.filterStatusOn", "เปิดใช้งาน")}</span>
                </div>
                <div className="status-minigame minigame-off" id="showEnableMaxPromotion2">
                  <img src="/assets/images/minigame/switch-off.svg" />
                  <span data-i18n="minigameSetting.filterStatusOff">{t("minigameSetting.filterStatusOff", "ปิดใช้งาน")}</span>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryCouponDeduct">{t("minigameSetting.summaryCouponDeduct", "การจำกัดสิทธิ์ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/minigame/icon-check-active.png" id="showEnableMaxCountPerDayActive" />
                    {" "}
                    <img src="/assets/images/minigame/icon-check-inactive.png" id="showEnableMaxCountPerDayInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryCouponPerDay">{t("minigameSetting.summaryCouponPerDay", "จำกัดสิทธิ์การรับ “ต่อวัน”")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1">
                    <span id="showMaxCountPerDayActive">20</span>
                    {" "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showMaxCountPerDayInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/minigame/icon-check-active.png" id="showEnableMaxCountPerWeekActive" />
                    {" "}
                    <img src="/assets/images/minigame/icon-check-inactive.png" id="showEnableMaxCountPerWeekInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryCouponPerWeek">{t("minigameSetting.summaryCouponPerWeek", "จำกัดสิทธิ์การรับ “ต่อสัปดาห์”")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1">
                    <span id="showMaxCountPerWeekActive">20</span>
                    {" "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showMaxCountPerWeekInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/minigame/icon-check-active.png" id="showEnableMaxCountPerMonthActive" />
                    {" "}
                    <img src="/assets/images/minigame/icon-check-inactive.png" id="showEnableMaxCountPerMonthInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryCouponPerMonth">{t("minigameSetting.summaryCouponPerMonth", "จำกัดสิทธิ์การรับ “ต่อเดือน”")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1">
                    <span id="showMaxCountPerMonthActive">20</span>
                    {" "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showMaxCountPerMonthInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/minigame/icon-check-active.png" id="showEnableMaxCountPerPromotionActive" />
                    {" "}
                    <img src="/assets/images/minigame/icon-check-inactive.png" id="showEnableMaxCountPerPromotionInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryCouponPerPromotion">{t("minigameSetting.summaryCouponPerPromotion", "จำกัดสิทธิ์การรับ “ตลอดอายุโปรโมชั่น”")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1">
                    <span id="showMaxCountPerPromotionActive">20</span>
                    {" "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showMaxCountPerPromotionInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.summaryCouponDeductPerMemberHeader">{t("minigameSetting.summaryCouponDeductPerMemberHeader", "การจำกัดการรับสิทธิ์ของสมาชิก รายคน")}</span>
        </div>
        <div className="input-col-1-p">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryStatus">{t("minigameSetting.summaryStatus", "สถานะ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="status-minigame minigame-on" id="showEnableMaxPromotionPerPersonActive">
                  <img src="/assets/images/minigame/switch-on.svg" />
                  <span data-i18n="minigameSetting.filterStatusOn">{t("minigameSetting.filterStatusOn", "เปิดใช้งาน")}</span>
                </div>
                <div className="status-minigame minigame-off" id="showEnableMaxPromotionPerPersonInactive">
                  <img src="/assets/images/minigame/switch-off.svg" />
                  <span data-i18n="minigameSetting.filterStatusOff">{t("minigameSetting.filterStatusOff", "ปิดใช้งาน")}</span>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryCouponDeduct">{t("minigameSetting.summaryCouponDeduct", "การจำกัดสิทธิ์ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/icon-check-active.png" id="showEnableMaxCountPerTimePerPersonActive" />
                    {" "}
                    <img src="/assets/images/icon-check-inactive.png" id="showEnableMaxCountPerTimePerPersonInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryCouponDeductPerCount">{t("minigameSetting.summaryCouponDeductPerCount", "จำกัดสิทธิ์การรับ “ต่อครั้ง”")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1">
                    <span id="showMaxCountPerTimePerPersonActive">20</span>
                    {" "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showMaxCountPerTimePerPersonInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/icon-check-active.png" id="showEnableMaxCountPerDayPerPersonActive" />
                    {" "}
                    <img src="/assets/images/icon-check-inactive.png" id="showEnableMaxCountPerDayPerPersonInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryCouponDeductPerDay">{t("minigameSetting.summaryCouponDeductPerDay", "")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1">
                    <span id="showMaxCountPerDayPerPersonActive">20</span>
                    {" "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showMaxCountPerDayPerPersonInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/icon-check-active.png" id="showEnableMaxCountPerWeekPerPersonActive" />
                    {" "}
                    <img src="/assets/images/icon-check-inactive.png" id="showEnableMaxCountPerWeekPerPersonInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryCouponDeductPerWeek">{t("minigameSetting.summaryCouponDeductPerWeek", "")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1">
                    <span id="showMaxCountPerWeekPerPersonActive">20</span>
                    {" "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showMaxCountPerWeekPerPersonInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/icon-check-active.png" id="showEnableMaxCountPerMonthPerPersonActive" />
                    {" "}
                    <img src="/assets/images/icon-check-inactive.png" id="showEnableMaxCountPerMonthPerPersonInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryCouponDeductPerMonth">{t("minigameSetting.summaryCouponDeductPerMonth", "")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1">
                    <span id="showMaxCountPerMonthPerPersonActive">20</span>
                    {" "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showMaxCountPerMonthPerPersonInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/icon-check-active.png" id="showEnableMaxCountPerPromotionPerPersonActive" />
                    {" "}
                    <img src="/assets/images/icon-check-inactive.png" id="showEnableMaxCountPerPromotionPerPersonInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryCouponDeductPerPromotion">{t("minigameSetting.summaryCouponDeductPerPromotion", "")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1">
                    <span id="showMaxCountPerPromotionPerPersonActive">20</span>
                    {" "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showMaxCountPerPromotionPerPersonInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.summaryCouponDeductPerGroupHeader">{t("minigameSetting.summaryCouponDeductPerGroupHeader", "การจำกัดการรับสิทธิ์ของกลุ่มลูกค้า")}</span>
        </div>
        <div className="input-col-1-p">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryStatus">{t("minigameSetting.summaryStatus", "สถานะ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="status-minigame minigame-on" id="showEnableLimitCustomerGroupActive">
                  <img src="/assets/images/minigame/switch-on.svg" />
                  <span data-i18n="minigameSetting.filterStatusOn">{t("minigameSetting.filterStatusOn", "เปิดใช้งาน")}</span>
                </div>
                <div className="status-minigame minigame-off" id="showEnableLimitCustomerGroupInactive">
                  <img src="/assets/images/minigame/switch-off.svg" />
                  <span data-i18n="minigameSetting.filterStatusOff">{t("minigameSetting.filterStatusOff", "ปิดใช้งาน")}</span>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryCouponGroupGet">{t("minigameSetting.summaryCouponGroupGet", "กลุ่มลูกค้าที่มีสิทธิ์ได้รับ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="p2 color-emerald-title-1" id="showLimitCustomerGroupInactive">-</div>
                  <div id="showLimitCustomerGroupActive" style={{ display: "none" }}>
                    <div className="p2 d-flex align-items-center flex-wrap gap-2" id="showLimitCustomerGroupActiveHtml">
                      <div className="px-3" style={{ background: "rgb(80, 161, 152)", borderRadius: "12px", color: "rgb(255, 255, 255)" }}>New Customer</div>
                      <div className="px-3" style={{ background: "rgb(80, 161, 152)", borderRadius: "12px", color: "rgb(255, 255, 255)" }}>Commander</div>
                      <div className="px-3" style={{ background: "rgb(80, 161, 152)", borderRadius: "12px", color: "rgb(255, 255, 255)" }}>VIP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.summaryResetCouponGroupGet">{t("minigameSetting.summaryResetCouponGroupGet", "การ Reset สิทธิ์การรับโปรโมชั่นของสมาชิก")}</span>
        </div>
        <div className="input-col-1-p">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryStatus">{t("minigameSetting.summaryStatus", "สถานะ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="status-minigame minigame-on" id="showEnableResetActive">
                  <img src="/assets/images/minigame/switch-on.svg" />
                  <span data-i18n="minigameSetting.filterStatusOn">{t("minigameSetting.filterStatusOn", "เปิดใช้งาน")}</span>
                </div>
                <div className="status-minigame minigame-off" id="showEnableResetInactive">
                  <img src="/assets/images/minigame/switch-off.svg" />
                  <span data-i18n="minigameSetting.filterStatusOff">{t("minigameSetting.filterStatusOff", "ปิดใช้งาน")}</span>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryResetCouponType">{t("minigameSetting.summaryResetCouponType", "รูปแบบการ reset สิทธิ์ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="p2 color-emerald-title-1" id="showEnableResetExpired" data-i18n="minigameSetting.summaryResetCouponType1">{t("minigameSetting.summaryResetCouponType1", "Reset สิทธิ์ ทันทีที่มินิเกมหมดอายุ")}</div>
    {/* collapsed in the capture: alternative texts, written by applySummary() */}
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.summaryDeductCouponMiniGameHeader">{t("minigameSetting.summaryDeductCouponMiniGameHeader", "การหักสิทธิ์ออกจากมินิเกมส์อื่น ๆ")}</span>
        </div>
        <div className="input-col-1-p">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryStatus">{t("minigameSetting.summaryStatus", "สถานะ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="status-minigame minigame-on" id="showMinigameEnableRemoveChance1">
                  <img src="/assets/images/minigame/switch-on.svg" />
                  <span data-i18n="minigameSetting.filterStatusOn">{t("minigameSetting.filterStatusOn", "เปิดใช้งาน")}</span>
                </div>
                <div className="status-minigame minigame-off" id="showMinigameEnableRemoveChance2">
                  <img src="/assets/images/minigame/switch-off.svg" />
                  <span data-i18n="minigameSetting.filterStatusOff">{t("minigameSetting.filterStatusOff", "ปิดใช้งาน")}</span>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryDeductCouponMiniGame">{t("minigameSetting.summaryDeductCouponMiniGame", "มินิเกมส์ที่หักสิทธิ์ :")}</div>
              </div>
              <div className="col color-emerald-title-1 mb-1" id="showMinigameEnableRemoveChance" />
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.summaryOtherDeductCouponMemberHeader">{t("minigameSetting.summaryOtherDeductCouponMemberHeader", "การจำกัดสิทธิ์อื่น ๆ ของสมาชิก")}</span>
        </div>
        <div className="input-col-1-p">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryStatus">{t("minigameSetting.summaryStatus", "สถานะ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="status-minigame minigame-on" id="showminigameEnableFixChance11">
                  <img src="/assets/images/minigame/switch-on.svg" />
                  <span data-i18n="minigameSetting.filterStatusOn">{t("minigameSetting.filterStatusOn", "เปิดใช้งาน")}</span>
                </div>
                <div className="status-minigame minigame-off" id="showminigameEnableFixChance12">
                  <img src="/assets/images/minigame/switch-off.svg" />
                  <span data-i18n="minigameSetting.filterStatusOff">{t("minigameSetting.filterStatusOff", "ปิดใช้งาน")}</span>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryCouponDeduct">{t("minigameSetting.summaryCouponDeduct", "การจำกัดสิทธิ์ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/icon-check-active.png" id="showEnableLimitPerGamePerDayActive" />
                    {" "}
                    <img src="/assets/images/icon-check-inactive.png" id="showEnableLimitPerGamePerDayInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryCouponDeductMemberPerDay">{t("minigameSetting.summaryCouponDeductMemberPerDay", "จำกัดการใช้สิทธิ์ของสมาชิกต่อมินิเกมส์ ต่อวัน")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1">
                    <span id="showLimitPerGamePerDayActive">20</span>
                    {" "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showLimitPerGamePerDayInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/icon-check-active.png" id="showEnableLimitPerPersonActive" />
                    {" "}
                    <img src="/assets/images/icon-check-inactive.png" id="showEnableLimitPerPersonInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryCouponDeductMemberPerPerson">{t("minigameSetting.summaryCouponDeductMemberPerPerson", "จำกัดการรับสิทธิ์สมาชิก หากมีสิทธิ์อยู่แล้ว x สิทธิ์")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1">
                    <span id="showLimitPerPersonActive">20</span>
                    {" "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showLimitPerPersonInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.summaryCoupon">{t("minigameSetting.summaryCoupon", "สิทธิ์")}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/icon-check-active.png" id="showEnableLimitBalanceActive" />
                    {" "}
                    <img src="/assets/images/icon-check-inactive.png" id="showEnableLimitBalanceInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryCouponDeductLimitBalance" >{t("minigameSetting.summaryCouponDeductLimitBalance", "จำกัดการรับสิทธิ์สมาชิกหากมียอดเครดิตที่ยอดคงเหลือ")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showLimitBalanceActive">
                    <span id="showLimitPerPersonActive">20</span>
                    {" "}
                    <span data-i18n="minigameSetting.baht">{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showLimitBalanceInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.baht">{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.summaryHowToGetCoupon">{t("minigameSetting.summaryHowToGetCoupon", "การได้รับสิทธิ์และเงื่อนไขการได้รับสิทธิ์")}</span>
        </div>
        <div className="input-col-1-p">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryHowToGetText">{t("minigameSetting.summaryHowToGetText", "เงื่อนไขการได้รับสิทธิ์ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="p2 color-emerald-title-1" id="showConditionGetBonus">-</div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryHowToGetText">{t("minigameSetting.summaryHowToGetText", "เงื่อนไขการได้รับสิทธิ์ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="p2 color-emerald-title-1">
                    <span id="showNumberPartsLuckywheelType">วงล้อ</span>
                    {" "}
                    <span id="showNumberPartsLuckywheel">ชิ้น</span>
                    {" "}
                    <span data-i18n="minigameSetting.piece">{t("minigameSetting.piece", "ชิ้น")}</span>
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <RewardsAccordion summary={summary} />
          </div>
        </div>
        <div className="label-minigame">
          <span data-i18n="minigameSetting.summaryTurnover">{t("minigameSetting.summaryTurnover", "เงื่อนไขการติด Turnover")}</span>
        </div>
        <div className="input-col-1-p">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryStatus">{t("minigameSetting.summaryStatus", "สถานะ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="status-minigame minigame-on" id="showEnableConditionTurnoverActive">
                  <img src="/assets/images/minigame/switch-on.svg" />
                  <span data-i18n="minigameSetting.filterStatusOn">{t("minigameSetting.filterStatusOn", "เปิดใช้งาน")}</span>
                </div>
                <div className="status-minigame minigame-off" id="showEnableConditionTurnoverInactive">
                  <img src="/assets/images/minigame/switch-off.svg" />
                  <span data-i18n="minigameSetting.filterStatusOff">{t("minigameSetting.filterStatusOff", "ปิดใช้งาน")}</span>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryTurnoverText">{t("minigameSetting.summaryTurnoverText", "รูปแบบการติด Turnover :")}</div>
              </div>
              <div className="col mb-1">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="p2 color-emerald-title-1" id="showEnableWithdrawConditionMinTurnover" data-i18n="minigameSetting.summaryTurnoverMinTurnoverTimes">{t("minigameSetting.summaryTurnoverMinTurnoverTimes", "ต้องทำ Turnover ขั้นต่ำ x เท่า")}</div>
                  <div className="p2 color-emerald-title-1" id="showWithdrawConditionMinTurnover">
                    <span id="showWithdrawConditionMinTurnoverText" />
                    {" "}
                    <span data-i18n="minigameSetting.times">{t("minigameSetting.times", "เท่า")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showEnableWithdrawConditionMinTurnoverCredit" style={{ display: "none" }}>
                    <span data-i18n="minigameSetting.summaryTurnoverMinRequire">{t("minigameSetting.summaryTurnoverMinRequire", "ต้องทำ Turnover ขั้นต่ำ")}</span>
                    {" "}
                    <span id="showEnableWithdrawConditionMinTurnoverCreditText" />
                    {" "}
                    <span data-i18n="minigameSetting.baht">{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" >
                    <span id="showWithdrawConditionMinTurnoverCredit" />
                    {" "}
                    <span data-i18n="minigameSetting.baht">{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
          </div>
        </div>
        <div className="label-minigame d-none">
          <span data-i18n="minigameSetting.summaryWithdrawRequirement">{t("minigameSetting.summaryWithdrawRequirement", "เงื่อนไขการถอน")}</span>
        </div>
        <div className="input-col-1-p d-none">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryStatus">{t("minigameSetting.summaryStatus", "สถานะ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="status-minigame minigame-on" id="showEnableWithdrawConditionActive">
                  <img src="/assets/images/minigame/switch-on.svg" />
                  <span data-i18n="minigameSetting.filterStatusOn">{t("minigameSetting.filterStatusOn", "เปิดใช้งาน")}</span>
                </div>
                <div className="status-minigame minigame-off" id="showEnableWithdrawConditionInactive">
                  <img src="/assets/images/minigame/switch-off.svg" />
                  <span data-i18n="minigameSetting.filterStatusOff">{t("minigameSetting.filterStatusOff", "ปิดใช้งาน")}</span>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryWithdrawRequirementText">{t("minigameSetting.summaryWithdrawRequirementText", "เงื่อนไขการถอน :")}</div>
              </div>
              <div className="col mb-1">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/icon-check-active.png" id="showEnableWithdrawConditionMinRemainCreditActive" />
                    {" "}
                    <img src="/assets/images/icon-check-inactive.png" id="showEnableWithdrawConditionMinRemainCreditInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryWithdrawRequireType1">{t("minigameSetting.summaryWithdrawRequireType1", "ยอดเครดิตคงเหลือขั้นต่ำ x บาท")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1">
                    <span id="showWithdrawConditionMinRemainCreditActive">100</span>
                    {" "}
                    <span data-i18n="minigameSetting.baht">{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showWithdrawConditionMinRemainCreditInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.baht">{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/icon-check-active.png" id="showEnableWithdrawConditionMaxWithdrawActive" />
                    {" "}
                    <img src="/assets/images/icon-check-inactive.png" id="showEnableWithdrawConditionMaxWithdrawInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryWithdrawRequireType2">{t("minigameSetting.summaryWithdrawRequireType2", "ถอนสูงสุดไม่เกินจำนวนที่กำหนด")}</div>
                  </div>
                  <div className="p2 color-emerald-title-1">
                    <span id="showWithdrawConditionMaxWithdrawActive">100</span>
                    {" "}
                    <span data-i18n="minigameSetting.baht">{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showWithdrawConditionMaxWithdrawInactive" style={{ display: "none" }}>
                    {"- "}
                    <span data-i18n="minigameSetting.baht">{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/icon-check-active.png" id="showEnableSetZeroCreditAfterWithdrawActive" />
                    {" "}
                    <img src="/assets/images/icon-check-inactive.png" id="showEnableSetZeroCreditAfterWithdrawInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryWithdrawRequireType3">{t("minigameSetting.summaryWithdrawRequireType3", "หักเครดิตที่เหลือทั้งหมดเมื่อทำการถอน")}</div>
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                  <div className="d-flex gap-2 align-items-center">
                    <img src="/assets/images/icon-check-active.png" id="showEnableCloseAutoWithdrawActive" />
                    {" "}
                    <img src="/assets/images/icon-check-inactive.png" id="showEnableCloseAutoWithdrawInactive" style={{ display: "none" }} />
                    <div className="p2 color-emerald-title-1" data-i18n="minigameSetting.summaryWithdrawRequireType4">{t("minigameSetting.summaryWithdrawRequireType4", "ไม่อนุญาตให้ถอนอัตโนมัติ เมื่อสมาชิกรับโปรโมชั่น")}</div>
                  </div>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
          </div>
        </div>
        <div className="label-minigame d-none">
          <span data-i18n="minigameSetting.summaryPromotionRequireFinHeader">{t("minigameSetting.summaryPromotionRequireFinHeader", "เงื่อนไขการหลุดโปร")}</span>
        </div>
        <div className="input-col-1-p d-none">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryStatus">{t("minigameSetting.summaryStatus", "สถานะ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="status-minigame minigame-on" id="showEnableCreditToClearTurnoverActive">
                  <img src="/assets/images/minigame/switch-on.svg" />
                  <span data-i18n="minigameSetting.filterStatusOn">{t("minigameSetting.filterStatusOn", "เปิดใช้งาน")}</span>
                </div>
                <div className="status-minigame minigame-off" id="showEnableCreditToClearTurnoverInactive">
                  <img src="/assets/images/minigame/switch-off.svg" />
                  <span data-i18n="minigameSetting.filterStatusOff">{t("minigameSetting.filterStatusOff", "ปิดใช้งาน")}</span>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryPromotionRequireFin">{t("minigameSetting.summaryPromotionRequireFin", "รูปแบบการหลุดโปร :")}</div>
              </div>
              <div className="col mb-1">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="p2 color-emerald-title-1" id="showEnableMaxRemainCreditToClearTurnover" data-i18n="minigameSetting.summaryPromotionRequireFinType1">{t("minigameSetting.summaryPromotionRequireFinType1", "ปลดเทิร์นเมื่อเครดิตคงเหลือน้อยกว่า x บาท")}</div>
                  <div className="p2 color-emerald-title-1" id="showMaxRemainCreditToClearTurnover">
                    <span id="showMaxRemainCreditToClearTurnover">100</span>
                    {" "}
                    <span data-i18n="minigameSetting.baht">{t("minigameSetting.baht", "บาท")}</span>
                  </div>
                  <div className="p2 color-emerald-title-1" id="showEnableMaxRemainCreditToClearTurnoverPercentage" data-i18n="minigameSetting.summaryPromotionRequireFinType2" style={{ display: "none" }}>{t("minigameSetting.summaryPromotionRequireFinType2", "ปลดเทิร์นเมื่อเครดิตคงเหลือน้อยกว่า x %")}</div>
                  <div className="p2 color-emerald-title-1" id="showMaxRemainCreditToClearTurnoverPercentage" style={{ display: "none" }}>100 %</div>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
          </div>
        </div>
        <div className="label-minigame d-none">
          <span data-i18n="minigameSetting.summaryAddCreditHeader">{t("minigameSetting.summaryAddCreditHeader", "เงื่อนไขการเพิ่มทุน")}</span>
        </div>
        <div className="input-col-1-p d-none">
          <div className="col-12 mb-2 text-start">
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryStatus">{t("minigameSetting.summaryStatus", "สถานะ :")}</div>
              </div>
              <div className="col mb-1">
                <div className="status-minigame minigame-on" id="showEnableIncreaseTurnOverActive">
                  <img src="/assets/images/minigame/switch-on.svg" />
                  <span data-i18n="minigameSetting.filterStatusOn">{t("minigameSetting.filterStatusOn", "เปิดใช้งาน")}</span>
                </div>
                <div className="status-minigame minigame-off" id="showEnableIncreaseTurnOverInactive">
                  <img src="/assets/images/minigame/switch-off.svg" />
                  <span data-i18n="minigameSetting.filterStatusOff">{t("minigameSetting.filterStatusOff", "ปิดใช้งาน")}</span>
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
            <div className="row">
              <div className="col-4 mb-1">
                <div className="p2 color-emerald-title-1 fw-700" data-i18n="minigameSetting.summaryAddCreditText">{t("minigameSetting.summaryAddCreditText", "รูปแบบการเพิ่มทุน :")}</div>
              </div>
              <div className="col mb-1">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="p2 color-emerald-title-1" id="showEnableMinTurnover" data-i18n="minigameSetting.summaryAddCreditType1" style={{ display: "none" }}>{t("minigameSetting.summaryAddCreditType1", "ต้องทำ Turnover ขั้นต่ำ x เท่า")}</div>
    {/* collapsed in the capture: alternative texts, written by applySummary() */}
                </div>
              </div>
            </div>
            <hr style={{ margin: "0px -28px 8px -28px" }} />
          </div>
        </div>
      </div>
      <div className="group-btn-minigame-setting ms-0 me-0" id="groupBtnSettingMinigame6" style={shownWhen(action !== "detail")}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <button id="buttonPreviousPromotionStepfinal" className="btn btn-outline-warning" data-i18n="minigameSetting.backToEditButton" style={nav.summaryButtonStyle} onClick={() => nav.backFromSummary()}>{t("minigameSetting.backToEditButton", "กลับไปแก้ไข")}</button>
          </div>
          <div>
            <button className="btn system-btn btn-outline btn-rounded" data-type="previous" data-i18n="minigameSetting.backButton" style={{ width: "168px" }} onClick={() => nav.go("6", "5")}>{t("minigameSetting.backButton", "ก่อนหน้า")}</button>
            {" "}
            <button className="btn system-btn btn-rounded ms-2" data-type="end" style={{ width: "168px" }} onClick={() => nav.save()}>
    <span data-i18n={confirmText[0]}>{t(confirmText[0], confirmText[1])}</span>
    </button>
          </div>
        </div>
      </div>
    </div>
  );
}
