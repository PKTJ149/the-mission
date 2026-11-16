"use client";

import { cx } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { ConditionType, SubConditionForm } from "@/lib/api/missions";
import { DeleteButton, Feedback } from "./form-bits";
import { FilterSelect, StaticFilter, type MissionDropdownItem } from "./mission-dropdowns";
import { UnitSelect } from "./reward-item";
import { useShownErrors } from "./form-state";
import { affiliateUsesValue, conditionErrors } from "./validation";

type SubConditionBoxProps = {
  condition: SubConditionForm;
  subNo: number;
  no: number;
  canDelete: boolean;
  onChange: (condition: SubConditionForm) => void;
  onDelete: () => void;
  onChooseGameType: () => void; // chooseGameType(this) → #popup-game-type
};

// One condition of a sub-mission ("เงื่อนไข": deposit / turnover / login / affiliate / points)
export function SubConditionBox({ condition, subNo, no, canDelete, onChange, onDelete, onChooseGameType }: SubConditionBoxProps) {
  const t = useT();
  const errors = useShownErrors(condition.id, conditionErrors(condition));
  // ORIGINAL BUG (kept on purpose, PK 15/11/2026): these error elements keep the template's "-template" id,
  // so validateSubMission (which looks them up by row number) never shows them; the condition still counts
  // as incomplete. The fix would be to rename the ids when the row is cloned.
  const templateIdErrorShown = false;
  const set = (patch: Partial<SubConditionForm>) => onChange({ ...condition, ...patch });
  const n = `${subNo}-${no}`;
  const { type, depositType } = condition;
  const hide = (shown: boolean) => (shown ? "" : " d-none");
  const item = (value: string, key: string, label: string): MissionDropdownItem => ({ value, label: t(`missionPage.${key}`, label), i18nKey: `missionPage.${key}` });

  const depositWithCount = type === "deposit" && ["equal", "more-than", "minimum"].includes(depositType ?? "");
  const consecutiveTurn = condition.turnOverType === "consecutive";
  // Before an affiliate type is picked both inputs show, as captured
  const affiliateValue = condition.affiliateType !== null && affiliateUsesValue(condition.affiliateType);
  const affiliatePeople = condition.affiliateType !== null && !affiliateValue;

  return (
    <div className="box-dropdown-main" id="sub-condition-template" data-sub-condition-id={no} data-sub-condition={no}>
      <div className="box-dropdown-main-header">
        <div className="group-header-sub-condition">
          <span className="text-type-member">
            {/* data-i18n points at a key missing from the locale files: the span stays empty */}
            <span className="mission-page" data-i18n="missionPage.missionSettingNo"></span>
            {"\u00a0"}
            <span id={`text-header-sub-condition-${n}`}>{no}</span>
          </span>
          <DeleteButton show={canDelete} onClick={onDelete}>
            <span className="text-link color-red mission-page" data-i18n="missionPage.delete">
              {t("missionPage.delete", "ลบ")}
            </span>
          </DeleteButton>
        </div>
      </div>
      <div className="box-dropdown-main-item">
        <div className="group-input custom-input custom-float">
          <label className="labal mission-page" data-i18n="missionPage.condition">
            {t("missionPage.condition", "เงื่อนไข")}
          </label>
          <FilterSelect
            className="dropdownSelectSubCondition"
            require
            items={[
              item("deposit", "deposit", "การฝาก"),
              item("turn-over", "turnover", "ทำเทิร์นโอเวอร์"),
              item("login", "login", "Login (เช็คอิน)"),
              item("affiliate", "affiliate", "การแนะนำเพื่อน"),
              item("point", "point", "สะสมแต้ม"),
            ]}
            value={type}
            onChange={(value) => set({ type: value as ConditionType })}
            placeholder={t("missionPage.selectCondition", "เลือกเงื่อนไข")}
            placeholderI18n="missionPage.selectCondition"
          >
            <Feedback id={`error-SubMissionCondition-${n}`} show={errors.type} i18nKey="missionPage.selectCondition2">
              {t("missionPage.selectCondition2", "กรุณาเลือกเงื่อนไข")}
            </Feedback>
          </FilterSelect>
        </div>

        <div className={`groupDeposit group-input custom-input custom-float${hide(type === "deposit")}`}>
          <label htmlFor="" className="labal mission-page" data-i18n="missionPage.depositType">
            {t("missionPage.depositType", "ประเภทการฝาก")}
          </label>
          <FilterSelect
            className="dropdownSelectTypeDeposit"
            require
            items={[
              item("equal", "depositEqual", "ฝากเท่ากับ"),
              item("more-than", "depositMoreThan", "ฝากมากกว่า"),
              item("minimum", "depositMinimum", "ฝากขั้นต่ำ"),
              item("accumulated", "depositAccumulated", "ฝากสะสม"),
              item("every-deposit", "depositEveryDeposit", "ทุก ๆ ยอดฝาก"),
            ]}
            value={depositType}
            onChange={(value) => set({ depositType: value })}
            placeholder={t("missionPage.selectDepositType", "เลือกประเภทการฝาก")}
            placeholderI18n="missionPage.selectDepositType"
          >
            <Feedback id={`error-DepositConditionSub-${n}`} show={errors.depositType} i18nKey="missionPage.selectDepositTypeError">
              {t("missionPage.selectDepositTypeError", "กรุณาเลือกประเภทการฝาก")}
            </Feedback>
          </FilterSelect>
        </div>
        <div className={`groupDeposit-Deposit group-input-two-col${hide(depositWithCount)}`}>
          <div className="group-input custom-input custom-float">
            <label className="labal mission-page" data-i18n="missionPage.deposit2">
              {t("missionPage.deposit2", "ยอดฝาก")}
            </label>
            <div className="group-dropdown-label">
              <div className="input-outer">
                <NumberInput id={`inputDepositAmount-${n}`} className="input left" value={condition.depositAmount} onChange={(depositAmount) => set({ depositAmount })} />
              </div>
              <UnitSelect className="dropdownSelectUnitDeposit" value="bath" i18nKey="missionPage.baht" label={t("missionPage.baht", "บาท")} />
            </div>
          </div>
          <div className="group-input custom-input custom-float">
            <label className="labal mission-page" data-i18n="missionPage.count2">
              {t("missionPage.count2", "จำนวนครั้ง")}
            </label>
            <div className="group-dropdown-label">
              <div className="input-outer">
                <NumberInput id={`inputDepositTime-${n}`} className="input left" value={condition.depositCount} onChange={(depositCount) => set({ depositCount })} />
              </div>
              <UnitSelect className="dropdownSelectTypeAmount" value="count" i18nKey="missionPage.count" label={t("missionPage.count", "ครั้ง")} />
            </div>
          </div>
        </div>
        <Feedback id={`error-DepositAmountDepositTime-${n}`} show={errors.depositAmount} i18nKey="missionPage.selectDepositTypeError2">
          {t("missionPage.selectDepositTypeError2", "กรุณากรอกยอดฝาก และ จำนวนครั้ง")}
        </Feedback>
        <div className={`groupDepositAccumulated group-input-two-col${hide(type === "deposit" && depositType === "accumulated")}`}>
          <div className="group-input custom-input custom-float">
            <label htmlFor="" className="labal mission-page" data-i18n="missionPage.deposit2">
              {t("missionPage.deposit2", "ยอดฝาก")}
            </label>
            <div className="group-dropdown-label">
              <FilterSelect
                className="dropdownSelectAccumulated"
                noState
                buttonClassName="left"
                items={[item("", "accumulate", "สะสมครบ")]}
                value={null}
                onChange={() => undefined}
                placeholder={t("missionPage.accumulate", "สะสมครบ")}
                placeholderI18n="missionPage.accumulate"
              />
              <div className="input-outer">
                <NumberInput
                  id={`inputDepositAccumulated-${n}`}
                  className="input center"
                  value={condition.depositAccumulated}
                  onChange={(depositAccumulated) => set({ depositAccumulated })}
                />
              </div>
              <StaticFilter side="right">
                <div className="input-fake single">บาท</div>
              </StaticFilter>
            </div>
            <Feedback id={`error-DepositAccumulated-${n}`} show={errors.depositAccumulated} i18nKey="missionPage.accumulateError">
              {t("missionPage.accumulateError", "กรุณากรอกยอดฝากสะสม")}
            </Feedback>
          </div>
        </div>
        <div className={`groupDepositEveryDeposit group-input-two-col${hide(type === "deposit" && depositType === "every-deposit")}`}>
          <div className="group-input custom-input custom-float">
            <label htmlFor="" className="labal mission-page" data-i18n="missionPage.deposit2">
              {t("missionPage.deposit2", "ยอดฝาก")}
            </label>
            <div className="group-dropdown-label">
              <div className="input-outer">
                <NumberInput id={`inputDepositEveryDeposit-${n}`} className="input left" value={condition.depositEvery} onChange={(depositEvery) => set({ depositEvery })} />
              </div>
              <StaticFilter side="right">
                <div className="input-fake single mission-page" data-i18n="missionPage.baht">
                  {t("missionPage.baht", "บาท")}
                </div>
              </StaticFilter>
            </div>
            {/* Captured live text of this error (the template says "กรุณากรอกยอดฝากทุก ๆ x บาท") */}
            <Feedback id={`error-DepositEveryDeposit-${n}`} show={errors.depositEvery} i18nKey="missionPage.selectDepositType">
              {t("missionPage.selectDepositType", "เลือกประเภทการฝาก")}
            </Feedback>
          </div>
        </div>

        <div className={`groupTurnOver group-input-two-col${hide(type === "turn-over")}`}>
          <div className="group-input custom-input custom-float">
            <label className="labal mission-page" data-i18n="missionPage.turnoverTypeCondition">
              {t("missionPage.turnoverTypeCondition", "ประเภทการทำเทิร์นโอเวอร์")}
            </label>
            <div className="group-dropdown-label">
              <FilterSelect
                className="dropdownSelectTurnOverType"
                require
                buttonClassName="left"
                items={[
                  item("equal", "turnoverConditionEqual", "ทำเทิร์นเท่ากับ"),
                  item("more-than", "turnoverConditionMoreThan", "ทำเทิร์นมากกว่า"),
                  item("minimum", "turnoverConditionMinimum", "ทำเทิร์นขั้นต่ำ"),
                  item("consecutive", "turnoverConditionConsecutive", "ทำเทิร์นติดต่อกัน"),
                  item("every", "turnoverConditionEvery", "ทุก ๆ ยอดเทิร์น"),
                  item("accumulated", "turnoverConditionAccumulated", "ทำเทิร์นสะสม"),
                ]}
                value={condition.turnOverType}
                onChange={(turnOverType) => set({ turnOverType })}
                placeholder=""
              />
              <div className="input-outer">
                <NumberInput
                  id={`inputTurnOverAmount-${n}`}
                  className={cx("input center inputTurnOverAmount", consecutiveTurn && "d-none")}
                  value={condition.turnOverAmount}
                  onChange={(turnOverAmount) => set({ turnOverAmount })}
                />
                <NumberInput
                  id={`inputTurnOverTime-${n}`}
                  className={cx("input center inputTurnOverTime", !consecutiveTurn && "d-none")}
                  value={condition.turnOverTime}
                  onChange={(turnOverTime) => set({ turnOverTime })}
                />
              </div>
              <StaticFilter side="right">
                <div className={cx("input-fake single inputTurnOverAmount mission-page", consecutiveTurn && "d-none")} data-i18n="missionPage.baht">
                  {t("missionPage.baht", "บาท")}
                </div>
                <div className={cx("input-fake single inputTurnOverTime mission-page", !consecutiveTurn && "d-none")} data-i18n="missionPage.count">
                  {t("missionPage.count", "ครั้ง")}
                </div>
              </StaticFilter>
            </div>
            <Feedback id="error-TurnOverTypeSubCondition-template" show={templateIdErrorShown && errors.turnOver} i18nKey="missionPage.turnoverTypeConditionError">
              {t("missionPage.turnoverTypeConditionError", "กรุณากรอกยอดทำเทิร์นโอเวอร์")}
            </Feedback>
          </div>
        </div>
        <div className={`groupTurnOverInput group-input-3${hide(type === "turn-over")}`}>
          <div className="group-checkbox">
            <input
              type="checkbox"
              className="form-check-input form-check-input-custom-mini-game game-provider-checker-input checkbox-mission-2 mt-0"
              id={`isCustomBrandGame-${n}`}
              checked={condition.customBrandGame}
              onChange={(event) => set({ customBrandGame: event.target.checked })}
            />
            <div className="group-title-subtitle">
              <label htmlFor={`isCustomBrandGame-${n}`} className="label-checkbox title-label text-p2-bold mission-page" data-i18n="missionPage.turnoverConditionOnlyGame">
                {t("missionPage.turnoverConditionOnlyGame", "กำหนดเฉพาะเกมที่ทำเทิร์นโอเวอร์ได้")}
              </label>
              <span className="subtitle-label mission-page" data-i18n="missionPage.turnoverConditionOnlyGameText">
                {t("missionPage.turnoverConditionOnlyGameText", "หากไม่กำหนดจะสามารถทำเทิร์นโอเวอร์ ได้กับทุกประเภทเกม และ ทุกค่ายเกม ")}
              </span>
            </div>
          </div>
          <input type="hidden" id={`subMissionConditionBrandGames-${n}`} value={condition.brandGames.join(",")} />
          <button
            className="mission-btn-outline custom-btn-outline-sub-mission"
            onClick={onChooseGameType}
            id={`btnChooseGameType-${n}`}
            data-textnumber={n}
            disabled={!condition.customBrandGame}
          >
            <span className="text-p3-bold mission-page" data-i18n="missionPage.customSetting">
              {t("missionPage.customSetting", "กำหนดเอง")}
            </span>
          </button>
        </div>

        <div className={`groupLogin group-input-two-col${hide(type === "login")}`}>
          <div className="group-input custom-input custom-float">
            <label className="labal">Login</label>
            <div className="group-dropdown-label">
              <FilterSelect
                className="dropdownSelectLoginType"
                require
                buttonClassName="left"
                items={[item("total", "loginCount", "Login ครบ"), item("consecutive", "loginSteak", "Login ติดต่อกัน")]}
                value={condition.loginType}
                onChange={(loginType) => set({ loginType: loginType as SubConditionForm["loginType"] })}
                placeholder=""
              />
              <div className="input-outer">
                <NumberInput id={`inputLoginAmount-${n}`} className="input center" value={condition.loginAmount} onChange={(loginAmount) => set({ loginAmount })} />
              </div>
              <StaticFilter side="right">
                <div className="input-fake single mission-page" data-i18n="missionPage.day">
                  {t("missionPage.day", "วัน")}
                </div>
              </StaticFilter>
            </div>
            <Feedback id="error-LoginTypeSubCondition-template" show={templateIdErrorShown && errors.login} i18nKey="missionPage.dayInputError">
              {t("missionPage.dayInputError", "กรุณากรอกจำนวนวัน")}
            </Feedback>
          </div>
        </div>

        <div className={`groupAffiliate group-input custom-input custom-float${hide(type === "affiliate")}`}>
          <label htmlFor="" className="labal mission-page" data-i18n="missionPage.affiliateType">
            {t("missionPage.affiliateType", "ประเภทการแนะนำเพื่อน")}
          </label>
          <FilterSelect
            className="dropdownSelectAffiliateType"
            require
            items={[
              item("equal", "affiliateType1", "จำนวนเพื่อนที่แนะนำเท่ากับ x คน"),
              item("more-than", "affiliateType2", "จำนวนเพื่อนที่แนะนำมากกว่า x คน"),
              item("minimum", "affiliateType3", "จำนวนเพื่อนที่แนะนำขั้นต่ำ x คน"),
              item("refer-and-deposit", "affiliateType4", "จำนวนเพื่อนที่แนะนำแล้วฝาก x คน"),
              item("total-deposit", "affiliateType5", "ยอดฝากรวมของเพื่อนที่แนะนำเท่ากับ x บาท"),
              item("deposit-per-x", "affiliateType6", "ยอดฝากของเพื่อนที่แนะนำทุก ๆ x บาท"),
            ]}
            value={condition.affiliateType}
            onChange={(affiliateType) => set({ affiliateType })}
            placeholder={t("missionPage.selectAffiliateType", "เลือกประเภทการแนะนำเพื่อน")}
            placeholderI18n="missionPage.selectAffiliateType"
          >
            <Feedback id="error-AffiliateTypeSubCondition-template" show={templateIdErrorShown && errors.affiliateType} i18nKey="missionPage.affiliateTypeError">
              {t("missionPage.affiliateTypeError", "กรุณาเลือกประเภทการแนะนำเพื่อน")}
            </Feedback>
          </FilterSelect>
        </div>
        <div className={`groupAffiliateInput group-input-two-col${hide(type === "affiliate" && condition.affiliateType !== null)}`}>
          <div className="group-input custom-input custom-float">
            <div className="group-dropdown-label">
              <StaticFilter side="left">
                <div className="input-fake single mission-page" data-i18n="missionPage.numberOfAffiliate">
                  {t("missionPage.numberOfAffiliate", "จำนวนเพื่อนแนะนำ")}
                </div>
              </StaticFilter>
              <div className="input-outer">
                <input
                  type="text"
                  className={cx("input center inputAffiliatePeopleAmount", affiliateValue && "d-none")}
                  id={`inputAffiliatePeopleAmount-${n}`}
                  placeholder="0"
                  value={condition.affiliatePeople}
                  onChange={(event) => set({ affiliatePeople: event.target.value })}
                />
                <input
                  type="text"
                  className={cx("input center inputAffiliateValue", affiliatePeople && "d-none")}
                  id={`inputAffiliateValue-${n}`}
                  placeholder="0"
                  value={condition.affiliateValue}
                  onChange={(event) => set({ affiliateValue: event.target.value })}
                />
              </div>
              <StaticFilter side="right">
                <div className={cx("input-fake single inputAffiliatePeopleAmount mission-page", affiliateValue && "d-none")} data-i18n="missionPage.member">
                  {t("missionPage.member", "คน")}
                </div>
                <div className={cx("input-fake single inputAffiliateValue mission-page", affiliatePeople && "d-none")} data-i18n="missionPage.baht">
                  {t("missionPage.baht", "บาท")}
                </div>
              </StaticFilter>
            </div>
          </div>
        </div>
        <Feedback id="error-InputAffiliateTypeSubCondition-template" show={templateIdErrorShown && errors.affiliateInput} i18nKey="missionPage.numberOfAffiliateError">
          {t("missionPage.numberOfAffiliateError", "กรุณากรอกจำนวนแนะนำเพื่อน")}
        </Feedback>

        <div className={`groupPoint group-input-two-col${hide(type === "point")}`}>
          <div className="group-input custom-input custom-float">
            <label className="labal mission-page" data-i18n="missionPage.point">
              {t("missionPage.point", "สะสมแต้ม")}
            </label>
            <div className="group-dropdown-label">
              <StaticFilter side="left">
                <div className="input-fake single mission-page" data-i18n="missionPage.complete">
                  {t("missionPage.complete", "ครบ")}
                </div>
              </StaticFilter>
              <div className="input-outer">
                <NumberInput id={`inputPointAmount-${n}`} className="input center" value={condition.pointAmount} onChange={(pointAmount) => set({ pointAmount })} />
              </div>
              <StaticFilter side="right">
                <div className="input-fake single mission-page" data-i18n="missionPage.point">
                  {t("missionPage.point", "สะสมแต้ม")}
                </div>
              </StaticFilter>
            </div>
            <Feedback id="error-PointAmountSubCondition-template" show={templateIdErrorShown && errors.point} i18nKey="missionPage.pointError">
              {t("missionPage.pointError", "กรุณากรอกจำนวนแต้ม")}
            </Feedback>
          </div>
        </div>

        {/* Present (always hidden) in the original condition markup; no condition type shows it */}
        <div className="groupRegisterMember group-input custom-input custom-float d-none">
          <label className="labal mission-page" data-i18n="missionPage.register">
            {t("missionPage.register", "สมัครสมาชิก")}
          </label>
          <div className="group-dropdown-age">
            <FilterSelect
              className="dropdownSelectRegisterMemberDateType"
              require
              noState
              buttonClassName="custom-filter-time"
              items={[
                item("from", "date", "วันที่"),
                item("before", "beforeDate", "ก่อนวันที่"),
                item("after", "afterDate", "หลังวันที่"),
                item("between", "betweenDate", "ระหว่างวันที่"),
              ]}
              value={null}
              onChange={() => undefined}
              placeholder=""
            >
              <Feedback id="error-RegisterMemberDateType-template" show={false} i18nKey="missionPage.registerError">
                {t("missionPage.registerError", "กรุณาเลือกสมัครสมาชิก")}
              </Feedback>
            </FilterSelect>
            <div className="">
              <div className="custom-input">
                <input
                  type="text"
                  className="form-control custom-date-flatpickr flatpickr-input"
                  id="inputRegisterMemberValue-template"
                  data-provider="flatpickr"
                  data-date-format="d/m/Y"
                  placeholder="select date"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberInput({ id, className, value, onChange }: { id: string; className: string; value: string; onChange: (value: string) => void }) {
  return <input type="number" className={className} id={id} placeholder="0" value={value} onChange={(event) => onChange(event.target.value)} />;
}
