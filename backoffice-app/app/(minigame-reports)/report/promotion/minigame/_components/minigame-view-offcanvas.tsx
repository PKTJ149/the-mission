"use client";

/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

import { Fragment, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Offcanvas, type useOffcanvas } from "@/components/ui";
import type { MinigameView, MinigameReward } from "@/lib/api/minigame-reports";
import { ChevronIcon } from "@/app/(minigame-reports)/_components/report-icons";
import { WheelImage } from "./detail-panel";

// #offcanvasMinigameSetting opened by the eye in the drill-down card (viewMinigameDetail()).
// The original offcanvas holds the whole create/edit wizard; in view mode only the header and
// #SettingMinigameStep5 (summary) are visible, so only those are rebuilt here. The same markup serves
// both kinds; a lucky wheel only changes a few labels and the image (8-slice wheel).
// Every pair of "on / off" elements is in the DOM with one of them display:none, like the original.

const HIDDEN: CSSProperties = { display: "none" };
const HR_STYLE: CSSProperties = { margin: "0px -28px 8px" };
const HEADER_STYLE: CSSProperties = { padding: "4rem 3rem 7.5rem" };
const ACCENT: CSSProperties = { color: "rgb(80, 161, 152)" };

// Colour dot of each work day (styles.json)
const DAYS = [
  { id: "showEnableSunday", name: "อาทิตย์", color: "rgb(255, 119, 119)" },
  { id: "showEnableMonday", name: "จันทร์", color: "rgb(255, 204, 23)" },
  { id: "showEnableTuesday", name: "อังคาร", color: "rgb(251, 199, 255)" },
  { id: "showEnableWednesday", name: "พุธ", color: "rgb(146, 196, 123)" },
  { id: "showEnableThursday", name: "พฤหัสบดี", color: "rgb(255, 168, 0)" },
  { id: "showEnableFriday", name: "ศุกร์", color: "rgb(119, 198, 255)" },
  { id: "showEnableSaturday", name: "เสาร์", color: "rgb(167, 99, 255)" },
];

function Hr() {
  return <hr style={HR_STYLE} />;
}

// .label-minigame title + .input-col-1-p body
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <div className="label-minigame">
        <span>{title}</span>
      </div>
      <div className="input-col-1-p">
        <div className="col-12 mb-2 text-start">{children}</div>
      </div>
    </>
  );
}

// "label :" on the left, value column on the right
function Row({ label, labelId, colId, children }: { label: string; labelId?: string; colId?: string; children?: ReactNode }) {
  return (
    <div className="row">
      <div className="col-4 mb-1">
        <div className="p2 color-emerald-title-1 fw-700" id={labelId}>
          {label}
        </div>
      </div>
      <div className="col mb-1" id={colId}>
        {children}
      </div>
    </div>
  );
}

function StatusPair({ onId, offId, on, hideOnIcon }: { onId: string; offId: string; on: boolean; hideOnIcon?: boolean }) {
  return (
    <>
      <div className="status-minigame minigame-on" id={onId} style={on ? undefined : HIDDEN}>
        <img src="/assets/images/minigame/switch-on.svg" style={hideOnIcon ? HIDDEN : undefined} />
        <span>เปิดใช้งาน</span>
      </div>
      <div className="status-minigame minigame-off" id={offId} style={on ? HIDDEN : undefined}>
        <img src="/assets/images/minigame/switch-off.svg" />
        <span>ปิดใช้งาน</span>
      </div>
    </>
  );
}

function StatusRow(props: { onId: string; offId: string; on: boolean }) {
  return (
    <Row label="สถานะ :">
      <StatusPair {...props} />
    </Row>
  );
}

type CheckProps = {
  id: string; // showEnable{id}Active / Inactive
  label: string;
  enabled: boolean;
  value?: string; // show{valueId ?? id}Active
  valueId?: string;
  inactiveValue?: string;
  iconPath?: string; // the promotion-level limits use /assets/images/minigame/, the others /assets/images/
  spaced?: boolean; // .mb-2
  labelStyle?: CSSProperties;
};

// Check / cross icon + label, and the value on the right
function Check({ id, label, enabled, value, valueId = id, inactiveValue = "- สิทธิ์", iconPath = "/assets/images/", spaced = true, labelStyle }: CheckProps) {
  return (
    <div className={`d-flex flex-wrap justify-content-between align-items-center${spaced ? " mb-2" : ""}`}>
      <div className="d-flex gap-2 align-items-center">
        <img src={`${iconPath}icon-check-active.png`} id={`showEnable${id}Active`} style={enabled ? undefined : HIDDEN} />
        <img src={`${iconPath}icon-check-inactive.png`} id={`showEnable${id}Inactive`} style={enabled ? HIDDEN : undefined} />
        <div className="p2 color-emerald-title-1" style={labelStyle}>
          {label}
        </div>
      </div>
      {value !== undefined && (
        <>
          <div className="p2 color-emerald-title-1" id={`show${valueId}Active`}>
            {value}
          </div>
          <div className="p2 color-emerald-title-1" id={`show${valueId}Inactive`} style={HIDDEN}>
            {inactiveValue}
          </div>
        </>
      )}
    </div>
  );
}

function Line({ label, value, valueStyle }: { label: string; value?: string; valueStyle?: CSSProperties }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center">
      <div className="p2 color-emerald-title-1">{label}</div>
      <div className="p2" style={valueStyle}>
        {value}
      </div>
    </div>
  );
}

type CollapsePhase = "shown" | "hidden" | "showing" | "hiding";
const COLLAPSE_CLASS: Record<CollapsePhase, string> = {
  shown: "col collapse show",
  hidden: "col collapse ",
  showing: "col collapsing",
  hiding: "col collapsing",
};

// "Minigame N :" row: Bootstrap collapse (data-bs-toggle="collapse"), first one open
function RewardRow({ index, reward, prefix }: { index: number; reward: MinigameReward; prefix: string }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<CollapsePhase>(index === 0 ? "shown" : "hidden");
  const [height, setHeight] = useState<string | undefined>();
  const [touched, setTouched] = useState(false); // Bootstrap adds .collapsed to the trigger only after a toggle
  const open = phase === "shown" || phase === "showing";

  // Same steps as Bootstrap's Collapse.show()/hide(): .collapsing animates height, then .collapse(.show)
  const toggle = () => {
    const body = bodyRef.current;
    if (!body || phase === "showing" || phase === "hiding") return;
    setTouched(true);
    if (phase === "shown") {
      setHeight(`${body.getBoundingClientRect().height}px`);
      setPhase("hiding");
      requestAnimationFrame(() => requestAnimationFrame(() => setHeight(undefined)));
    } else {
      setHeight("0px");
      setPhase("showing");
      requestAnimationFrame(() => requestAnimationFrame(() => setHeight(`${body.scrollHeight}px`)));
    }
  };

  const finish = () => {
    setPhase(phase === "showing" ? "shown" : "hidden");
    setHeight(undefined);
  };

  const id = `openDropdownWheelDetail${index}`;
  // <div type="button"> is in the original markup
  const buttonType = { type: "button" } as object;

  return (
    <div
      className={`row dropdown-wheel-detail${touched && !open ? " collapsed" : ""}`}
      {...buttonType}
      data-bs-toggle="collapse"
      data-bs-target={`#${id}`}
      aria-expanded={touched ? open : true}
      aria-controls={id}
      onClick={toggle}
    >
      <div className="col-4 mb-1">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="p2 color-emerald-title-1 fw-700">{`${prefix} ${index + 1} :`}</div>
          <div>
            <ChevronIcon />
          </div>
        </div>
      </div>
      <div className="col mb-1">
        <Line label="คำอธิบายโบนัส" value={reward.description} valueStyle={ACCENT} />
        <div
          ref={bodyRef}
          className={COLLAPSE_CLASS[phase]}
          id={id}
          style={height === undefined ? undefined : { height }}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget) finish();
          }}
        >
          <Line label="จำนวนแจกโบนัส" value={reward.quantity} valueStyle={ACCENT} />
          <Line label="แจ้งเตือนเมื่อใกล้หมด" value={reward.alert} valueStyle={ACCENT} />
          <Line label="โอกาสออก" value={reward.chance} valueStyle={ACCENT} />
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="p2 color-emerald-title-1 fw-700">โบนัสที่แจก</div>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="p2 color-emerald-title-1 ms-3">{reward.bonus}</div>
            <div className="p2 color-emerald-title-1">{reward.value}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CountdownClock() {
  const unit = (name: string) => (
    <div className={`card-unit ${name}`}>
      <div>
        <span>0</span>
      </div>
      <div>
        <span>0</span>
      </div>
    </div>
  );
  return (
    <div className="countdown-minigame style-1" style={{ width: "fit-content" }}>
      <div className="time">
        {unit("days")}:{unit("hours")}:{unit("minutes")}
      </div>
      <div className="text">
        <span>Days</span>
        <span></span>
        <span>Hours</span>
        <span></span>
        <span>Minutes</span>
      </div>
    </div>
  );
}

// Labels that the page script switches by game type
const TYPE_TEXT = {
  "mini-game": {
    header: "รายละเอียดมินิเกมส์",
    status: "สถานะมินิเกมส์ : ",
    name: "ชื่อมินิเกมส์ : ",
    condition: "เงื่อนไขมินิเกมส์ : ",
    reward: "Minigame",
  },
  "lucky-wheel": {
    header: "รายละเอียดมินิเกมส์วงล้อ",
    status: "สถานะมินิเกมส์วงล้อ : ",
    name: "ชื่อมินิเกมส์วงล้อ : ",
    condition: "เงื่อนไขมินิเกมส์วงล้อ : ",
    reward: "Wheel",
  },
};

function Summary({ view, wheelViewed }: { view: MinigameView; wheelViewed: boolean }) {
  const text = TYPE_TEXT[view.type];
  // ORIGINAL BUG (kept on purpose, PK 15/11/2026): #showStepEnd starts as "wheel-wrapper"; a mini-game
  // view adds "preview-minigame", a lucky-wheel view removes both classes and nothing adds "wheel-wrapper"
  // back. So once a wheel was viewed, the mini-game image sits 31px higher. The fix would be to reset
  // the class to "wheel-wrapper preview-minigame" for a mini-game.
  const miniGameClass = wheelViewed ? "preview-minigame" : "wheel-wrapper preview-minigame";
  return (
    <div className="canvas-box-body" id="SettingMinigameStep5">
      <div className="tab-header">
        <div className="header-in-body active">
          <div className="tab-group justify-content-center">
            <span className="p1 fw-700" id="textHeadDetail">
              {view.tabTitle}
            </span>
          </div>
        </div>
      </div>
      <div className="main-in-detail-body content-col-1">
        <div className="input-col-1-p">
          <div className="d-flex align-items-center justify-content-center">
            {view.wheelArt ? (
              // Lucky wheel: the page script replaces #showStepEnd's class and content with the wheel
              <div className="" id="showStepEnd">
                <div>
                  <WheelImage art={view.wheelArt} spin={view.image} className="wheel-wrapper" />
                </div>
              </div>
            ) : (
              <div className={miniGameClass} id="showStepEnd">
                <img src={view.image} className="box-img3 showImagePreviewPromotionDetail imgMinigameRewardSrc" />
              </div>
            )}
          </div>
        </div>

        <div className="label-minigame" id="textHeaderAllDetail">
          {text.header}
        </div>
        <div className="input-col-1-p">
          <div className="col-12 mb-2 text-start">
            <Row label={text.status} labelId="textStatusDetail">
              {/* ORIGINAL: the switch icon of the "on" badge is display:none in view mode */}
              <StatusPair onId="showStatusDetail1" offId="showStatusDetail2" on={view.statusOn} hideOnIcon />
            </Row>
            <Hr />
            <Row label={text.name} labelId="textNameDetail">
              <div className="p2 color-emerald-title-1" id="showName">
                {view.name}
              </div>
            </Row>
            <Hr />
            <Row label={text.condition} labelId="textConditionDetail">
              <div className="show-condition-html color-emerald-title-1" id="showconditionHtml" dangerouslySetInnerHTML={{ __html: view.conditionHtml }}></div>
            </Row>
            <Hr />
            <Hr />
            <Row label="Agent ที่เลือก :" labelId="textTestDetail">
              <div className="d-flex flex-wrap align-items-center gap-2" id="showLimitAgentGroupActiveHtml">
                {view.agents.map((agent) => (
                  <div key={agent} className="text-center">
                    <span className="custom-badge bg-green-10">{agent}</span>
                  </div>
                ))}
              </div>
            </Row>
            <Hr />
          </div>
        </div>

        <Section title="ระยะเวลาโปรโมชั่นและวันทำงานของโปรโมชั่น">
          <Row label="ระยะเวลาโปรโมชั่น :">
            <div className="p2" id="showStartDateEndDate">
              {view.period}
            </div>
          </Row>
          <Hr />
          <Row label="วันทำงานของโปรโมชั่น :">
            <div className="row mb-2">
              <div className="col-12 col-lg-3">
                <div className="p2 color-emerald-title-1" style={{ width: "120px" }}>
                  วันทำงาน :
                </div>
              </div>
              <div className="col-12 col-lg-9">
                <div className="d-flex flex-wrap gap-2">
                  <div id="showEnableEveryday">
                    <div className="d-flex align-items-center gap-1">
                      <div className="box-list-date-promotion" style={{ background: "rgb(145, 145, 145)" }}></div>
                      <div className="p3 color-emerald-title-1">ทุกวัน</div>
                    </div>
                  </div>
                  {DAYS.map((day) => (
                    <div key={day.id} id={day.id} style={HIDDEN}>
                      <div className="d-flex align-items-center gap-1">
                        <div className="box-list-date-promotion" style={{ background: day.color }}></div>
                        <div className="p3 color-emerald-title-1">{day.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="row" id="showMinigameTime"></div>
          </Row>
          <Hr />
        </Section>

        <Section title="การรับเวลาถอยหลัง (Countdown) วันหมดอายุโปรโมชั่น">
          <StatusRow onId="showEnableCountDown1" offId="showEnableCountDown2" on={view.countdownOn} />
          <Hr />
          <Row label="รูปแบบการนับถอยหลัง :">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <div className="p2 color-emerald-title-1" id="showEnableCountDownCreated">
                นับถอยหลังทันทีที่สร้างวงล้อนำโชคสำเร็จ
              </div>
              <div className="p2 color-emerald-title-1" id="showEnableCountDownSetTime" style={HIDDEN}>
                นับถอยหลังทันทีเมื่อถึงกำหนด
              </div>
              <div className="p2 color-emerald-title-1" id="showEnableRemainingDay" style={{ ...ACCENT, ...HIDDEN }}>
                นับถอยหลังทันทีเมื่อเหลืออีก 7 วัน
              </div>
              <div className="p2 color-emerald-title-1" id="showEnableRemainingDateTime" style={ACCENT}>
                นับถอยหลังทันทีเมื่อถึงวันที่ -
              </div>
            </div>
          </Row>
          <Hr />
          <Row label="รูปแบบนาฬิกา Countdown :" colId="showCountDownColorCode">
            <CountdownClock />
          </Row>
          <Hr />
        </Section>

        <Section title="การจำกัดการรับสิทธิ์ของสมาชิก ระดับโปรโมชั่น">
          <StatusRow onId="showEnableMaxPromotion1" offId="showEnableMaxPromotion2" on={view.promotionLimit.on} />
          <Hr />
          <Row label="การจำกัดสิทธิ์ :">
            {[
              { id: "MaxCountPerDay", label: "จำกัดสิทธิ์การรับ “ต่อวัน”", value: view.promotionLimit.perDay },
              { id: "MaxCountPerWeek", label: "จำกัดสิทธิ์การรับ “ต่อสัปดาห์”", value: view.promotionLimit.perWeek },
              { id: "MaxCountPerMonth", label: "จำกัดสิทธิ์การรับ “ต่อเดือน”", value: view.promotionLimit.perMonth },
              { id: "MaxCountPerPromotion", label: "จำกัดสิทธิ์การรับ “ตลอดอายุโปรโมชั่น”", value: view.promotionLimit.perPromotion },
            ].map((item) => (
              <Check key={item.id} {...item} enabled={view.promotionLimit.on} iconPath="/assets/images/minigame/" />
            ))}
          </Row>
          <Hr />
        </Section>

        <Section title="การจำกัดการรับสิทธิ์ของสมาชิก รายคน">
          <StatusRow onId="showEnableMaxPromotionPerPersonActive" offId="showEnableMaxPromotionPerPersonInactive" on={view.personLimit.on} />
          <Hr />
          <Row label="การจำกัดสิทธิ์ :">
            {[
              { id: "MaxCountPerTimePerPerson", label: "จำกัดสิทธิ์การรับ “ต่อครั้ง”", value: view.personLimit.perTime },
              { id: "MaxCountPerDayPerPerson", label: "จำกัดสิทธิ์การรับ “ต่อวัน”", value: view.personLimit.perDay },
              { id: "MaxCountPerWeekPerPerson", label: "จำกัดสิทธิ์การรับ “ต่อสัปดาห์”", value: view.personLimit.perWeek },
              { id: "MaxCountPerMonthPerPerson", label: "จำกัดสิทธิ์การรับ “ต่อเดือน”", value: view.personLimit.perMonth },
              { id: "MaxCountPerPerson", label: "จำกัดสิทธิ์การรับ “ตลอดอายุโปรโมชั่น”", value: view.personLimit.perPromotion },
            ].map((item) => (
              <Check key={item.id} {...item} enabled={view.personLimit.on} />
            ))}
          </Row>
          <Hr />
        </Section>

        <Section title="การจำกัดการรับสิทธิ์ของกลุ่มลูกค้า">
          <StatusRow onId="showEnableLimitCustomerGroupActive" offId="showEnableLimitCustomerGroupInactive" on={view.customerGroupLimitOn} />
          <Hr />
          <Row label="กลุ่มลูกค้าที่มีสิทธิ์ได้รับ :">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <div className="p2 color-emerald-title-1" id="showLimitCustomerGroupInactive">
                -
              </div>
              <div id="showLimitCustomerGroupActive" style={HIDDEN}>
                <div className="p2 d-flex align-items-center flex-wrap gap-2" id="showLimitCustomerGroupActiveHtml"></div>
              </div>
            </div>
          </Row>
          <Hr />
        </Section>

        <Section title="การ Reset สิทธิ์การรับโปรโมชั่นของสมาชิก">
          <StatusRow onId="showEnableResetActive" offId="showEnableResetInactive" on={view.resetOn} />
          <Hr />
          <Row label="รูปแบบการ reset สิทธิ์ :">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <div className="p2 color-emerald-title-1" id="showEnableResetExpired">
                Reset สิทธิ์ ทันทีที่มินิเกมหมดอายุ
              </div>
              <div className="p2 color-emerald-title-1" id="showEnableResetTime" style={HIDDEN}>
                Reset สิทธิ์ แบบกำหนดเป็นเวลาใดเวลาหนึ่ง
              </div>
              <div className="p2 color-emerald-title-1" id="showEnableResetDateTime" style={HIDDEN}>
                Reset สิทธิ์ แบบกำหนดเป็น วัน / ชั่วโมง / นาที
              </div>
              <div className="p2 color-emerald-title-1" id="showResetTimeBkk" style={HIDDEN}></div>
              <div className="p2 color-emerald-title-1" id="showResetDayHourMinute" style={HIDDEN}>
                7 วัน 21 ชั่วโมง 35 นาที
              </div>
            </div>
          </Row>
          <Hr />
        </Section>

        <Section title="การหักสิทธิ์ออกจากมินิเกมส์อื่น ๆ">
          <StatusRow onId="showMinigameEnableRemoveChance1" offId="showMinigameEnableRemoveChance2" on={view.removeChanceOn} />
          <Hr />
          <Row label="มินิเกมส์ที่หักสิทธิ์ :" colId="showMinigameEnableRemoveChance" />
          <Hr />
        </Section>

        <Section title="การจำกัดสิทธิ์อื่น ๆ ของสมาชิก">
          <StatusRow onId="showminigameEnableFixChance11" offId="showminigameEnableFixChance12" on={view.otherLimit.on} />
          <Hr />
          <Row label="การจำกัดสิทธิ์ :">
            <Check id="LimitPerGamePerDay" label="จำกัดการใช้สิทธิ์ของสมาชิกต่อมินิเกมส์ ต่อวัน" value={view.otherLimit.perGamePerDay} enabled={view.otherLimit.on} spaced={false} />
            <Check id="LimitPerPerson" label="จำกัดการรับสิทธิ์สมาชิก หากมีสิทธิ์อยู่แล้ว x สิทธิ์" value={view.otherLimit.ifHasRights} enabled={view.otherLimit.on} spaced={false} />
            <Check
              id="LimitBalance"
              label="จำกัดการรับสิทธิ์สมาชิกหากมียอดเครดิตที่ยอดคงเหลือ"
              value={view.otherLimit.balance}
              enabled={view.otherLimit.on}
              spaced={false}
              labelStyle={{ textOverflow: "ellipsis" }}
            />
          </Row>
          <Hr />
        </Section>

        <Section title="การได้รับสิทธิ์และเงื่อนไขการได้รับสิทธิ์">
          <Row label="เงื่อนไขการได้รับสิทธิ์ :">
            <div className="p2 color-emerald-title-1" id="showConditionGetBonus">
              {view.conditionGetBonus}
            </div>
          </Row>
          <Hr />
          <Row label="จำนวนวงล้อ :">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <div className="p2 color-emerald-title-1" id="showNumberPartsLuckywheel">
                {view.numberOfParts}
              </div>
            </div>
          </Row>
          <Hr />
          <div id="showPartsLuckywheelluckyWheelRewards">
            {view.rewards.map((reward, index) => (
              <Fragment key={index}>
                <RewardRow index={index} reward={reward} prefix={text.reward} />
                <Hr />
              </Fragment>
            ))}
          </div>
        </Section>

        <Section title="เงื่อนไขการติด Turnover">
          <StatusRow onId="showEnableConditionTurnoverActive" offId="showEnableConditionTurnoverInactive" on={view.turnover.on} />
          <Hr />
          <Row label="รูปแบบการติด Turnover :">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <div className="p2 color-emerald-title-1" id="showEnableWithdrawConditionMinTurnover" style={HIDDEN}>
                ต้องทำ Turnover ขั้นต่ำ x เท่า
              </div>
              <div className="p2 color-emerald-title-1" id="showWithdrawConditionMinTurnover" style={HIDDEN}>
                10 เท่า
              </div>
              <div className="p2 color-emerald-title-1" id="showEnableWithdrawConditionMinTurnoverCredit">
                {view.turnover.value}
              </div>
              <div className="p2 color-emerald-title-1" id="showWithdrawConditionMinTurnoverCredit" style={HIDDEN}>
                100 บาท
              </div>
            </div>
          </Row>
          <Hr />
        </Section>

        <Section title="เงื่อนไขการถอน">
          <StatusRow onId="showEnableWithdrawConditionActive" offId="showEnableWithdrawConditionInactive" on={view.withdraw.on} />
          <Hr />
          <Row label="เงื่อนไขการถอน :">
            <Check id="WithdrawConditionMinRemainCredit" label="ยอดเครดิตคงเหลือขั้นต่ำ x บาท" value={view.withdraw.minRemainCredit} inactiveValue="- บาท" enabled={view.withdraw.on} />
            <Check id="WithdrawConditionMaxWithdraw" label="ถอนสูงสุดไม่เกินจำนวนที่กำหนด" value={view.withdraw.maxWithdraw} inactiveValue="- บาท" enabled={view.withdraw.on} />
            <Check id="SetZeroCreditAfterWithdraw" label="หักเครดิตที่เหลือทั้งหมดเมื่อทำการถอน" enabled={view.withdraw.on} />
            <Check id="CloseAutoWithdraw" label="ไม่อนุญาตให้ถอนอัตโนมัติ เมื่อสมาชิกรับโปรโมชั่น" enabled={view.withdraw.on} />
          </Row>
          <Hr />
        </Section>

        <Section title="เงื่อนไขการหลุดโปร">
          <StatusRow onId="showEnableCreditToClearTurnoverActive" offId="showEnableCreditToClearTurnoverInactive" on={view.clearTurnover.on} />
          <Hr />
          <Row label="รูปแบบการหลุดโปร :">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <div className="p2 color-emerald-title-1" id="showEnableMaxRemainCreditToClearTurnover" style={HIDDEN}>
                ปลดเทิร์นเมื่อเครดิตคงเหลือน้อยกว่า x บาท
              </div>
              <div className="p2 color-emerald-title-1" id="showMaxRemainCreditToClearTurnover" style={HIDDEN}>
                100 บาท
              </div>
              <div className="p2 color-emerald-title-1" id="showEnableMaxRemainCreditToClearTurnoverPercentage">
                ปลดเทิร์นเมื่อเครดิตคงเหลือน้อยกว่า x บาท
              </div>
              <div className="p2 color-emerald-title-1" id="showMaxRemainCreditToClearTurnoverPercentage">
                {view.clearTurnover.value}
              </div>
            </div>
          </Row>
          <Hr />
        </Section>

        <Section title="เงื่อนไขการเพิ่มทุน">
          <StatusRow onId="showEnableIncreaseTurnOverActive" offId="showEnableIncreaseTurnOverInactive" on={view.increaseTurnoverOn} />
          <Hr />
          <Row label="รูปแบบการเพิ่มทุน :">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <div className="p2 color-emerald-title-1" id="showEnableMinTurnover" style={HIDDEN}>
                ต้องทำ Turnover ขั้นต่ำ x เท่า
              </div>
              <div className="p2 color-emerald-title-1" id="showMinTurnover" style={HIDDEN}>
                10 เท่า
              </div>
              <div className="p2 color-emerald-title-1" id="showEnableMinTurnoverCredit" style={HIDDEN}>
                ต้องทำ Turnover ขั้นต่ำ x บาท
              </div>
              <div className="p2 color-emerald-title-1" id="showMinTurnoverCredit" style={HIDDEN}>
                100 บาท
              </div>
              <div className="p2 color-emerald-title-1" id="showEnableIncreaseTurnOver">
                ไม่กำหนด Turnover จากยอดฝากใหม่
              </div>
            </div>
          </Row>
          <Hr />
        </Section>
      </div>
    </div>
  );
}

type MinigameViewOffcanvasProps = {
  control: ReturnType<typeof useOffcanvas>;
  view: MinigameView | null;
  opening: number; // changes on every opening: the reward rows start again with only the first one open
  wheelViewed: boolean; // a lucky-wheel view was opened before on this page
};

export function MinigameViewOffcanvas({ control, view, opening, wheelViewed }: MinigameViewOffcanvasProps) {
  return (
    // Like every original offcanvas, no tabindex (the shared <Offcanvas> adds none): a click inside does
    // not focus it, so Escape only closes the panel while focus is on something focusable inside it
    <Offcanvas
      control={control}
      className="offcanvas offcanvas-end offcanvas-minigame-custom"
      id="offcanvasMinigameSetting"
      data-bs-focus="false"
    >
      <div className="offcanvas-header offcanvas-header-minigame border-bottom">
        <h4 className="mb-0" id="offcanvasMinigameDetailLabel">
          {view?.title}
        </h4>
        <div className="icon-close-offcanvas-minigame-custom" data-bs-dismiss="offcanvas" aria-label="Close" onClick={control.hide}>
          <i className="ri-close-line"></i>
        </div>
      </div>
      <div className="offcanvas-body position-relative p-0" id="rootScrollMinigame">
        <div className="box-header-step justify-content-start" style={HEADER_STYLE}>
          <div className="d-flex align-items-center gap-3">
            <div>
              <img src="/assets/images/promotion/img-details-promotion.png" width="72" height="72" />
            </div>
            <div id="promotionSummaryEdit">
              <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
                <div className="d-flex flex-column flex-lg-row gap-0 gap-lg-4">
                  <div>
                    <div className="p1 fw-700 text-white" id="offcanvasMinigameViewDetail1">
                      {view?.headerText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {view && <Summary key={opening} view={view} wheelViewed={wheelViewed} />}
      </div>
    </Offcanvas>
  );
}
