"use client";
/* eslint-disable @next/next/no-img-element -- original markup: plain <img> */

import { useT } from "@/lib/i18n";
import type { MissionRewardForm, Option, RewardType } from "@/lib/api/missions";
import { DeleteButton, Feedback, previewFile } from "./form-bits";
import { FilterSelect, type MissionDropdownItem } from "./mission-dropdowns";
import { useFormEvents, useShownErrors } from "./form-state";
import { rewardErrors } from "./validation";

type RewardItemProps = {
  reward: MissionRewardForm;
  no: number; // position, 1-based
  subNo?: number; // sub-mission number when the reward belongs to a sub-mission
  canDelete: boolean;
  miniGames: Option[];
  promotions: Option[];
  onChange: (reward: MissionRewardForm) => void;
  onDelete: () => void;
  onChooseIcon: () => void; // showPopupIconStyle(...)
};

// One "ของรางวัล N" box (#time-reward-N in section 2, #sub-reward-template in a sub-mission)
export function RewardItem({ reward, no, subNo, canDelete, miniGames, promotions, onChange, onDelete, onChooseIcon }: RewardItemProps) {
  const t = useT();
  const shownErrors = useShownErrors(reward.id, rewardErrors(reward));
  // ORIGINAL BUG (kept on purpose, PK 15/11/2026): every sub-mission reward row is cloned with the id
  // "sub-reward-template", and validateSubMission only reaches the first one, so rows 2+ never show an
  // error (they still count as incomplete). The fix would be to give each row its own id.
  const errors = subNo !== undefined && no > 1 ? Object.fromEntries(Object.keys(shownErrors).map((k) => [k, false])) as typeof shownErrors : shownErrors;
  // A row from addTemplateRewardMission() keeps the dropdowns' own JS texts until the next toggleTranslate()
  const unlocalized = useFormEvents().unlocalized.includes(reward.id);
  const set = (patch: Partial<MissionRewardForm>) => onChange({ ...reward, ...patch });
  const sub = subNo !== undefined;
  // Ids: "N" in section 2, "S-N" in sub-mission S; error ids get a "SubReward" suffix in sub-missions
  const n = sub ? `${subNo}-${no}` : String(no);
  const errorId = (name: string) => (sub ? `error-${name}SubReward-${n}` : `error-${name}-${n}`);
  const fileId = sub ? `inputFileIconSubReward-${n}` : `inputFileReward-${n}`;

  const typeItems: MissionDropdownItem[] = [
    { value: "credit", label: t("missionPage.credit", "เครดิต"), i18nKey: "missionPage.credit" },
    { value: "mini-game-chance", label: t("missionPage.miniGamePoints", "สิทธิ์มินิเกมส์"), i18nKey: "missionPage.miniGamePoints" },
    { value: "promotion-chance", label: t("missionPage.promotionPoints", "สิทธิ์โปรโมชั่น"), i18nKey: "missionPage.promotionPoints" },
    { value: "point", label: t("missionPage.points", "แต้มสะสม"), i18nKey: "missionPage.points" },
    { value: "reward", label: t("missionPage.reward", "ของรางวัล"), i18nKey: "missionPage.reward" },
  ];
  const hidden = (type: RewardType) => (reward.type === type ? "" : " d-none");

  return (
    <div
      className="box-time-mission box-time-reward"
      id={sub ? "sub-reward-template" : `time-reward-${n}`}
      {...(sub ? { "data-sub-reward-id": no, "data-sub-reward": no } : { "data-reward-mission": no })}
    >
      <div className="box-time-mission-header">
        <div className="group-header-time-mission">
          <div className="text-p2-bold">
            <span className="mission-page" data-i18n="missionPage.reward">
              {t("missionPage.reward", "ของรางวัล")}
            </span>{" "}
            <span id={sub ? `text-header-sub-reward-${n}` : `text-header-reward-${n}`}>{no}</span>
          </div>
          <DeleteButton show={canDelete} onClick={onDelete}>
            <span className="text-link color-red mission-page" data-i18n="missionPage.delete">
              {t("missionPage.delete", "ลบ")}
            </span>
          </DeleteButton>
        </div>
      </div>
      <div className="box-time-mission-content">
        <div className="two-column">
          <div className="box-preview-reward-icon">
            <img
              src={reward.icon}
              alt="reward"
              width="50"
              height="50"
              id={sub ? `display-${fileId}` : undefined}
              className={fileId}
            />
          </div>
          <div className="box-preview-reward-text">
            <span className="text-p2-bold mission-page" data-i18n="missionPage.uploadRewardIcon">
              {t("missionPage.uploadRewardIcon", "อัพโหลดรูปไอคอนของรางวัล")}
            </span>
            <label className="mission-btn-outline" htmlFor={fileId}>
              <input
                type="file"
                id={fileId}
                className="d-none"
                name={fileId}
                onChange={(event) => previewFile(event, (icon) => set({ icon }))}
              />
              <img src="/assets/images/mission/image-upload.png" alt={sub ? "เพิ่มรูปไอคอน" : "add-icon"} width="20" height="20" />
              <span className="mission-page" data-i18n="missionPage.uploadImage">
                {t("missionPage.uploadImage", "อัพโหลดรูป")}
              </span>
            </label>
            <span className="text-example text-p2-regular-i">
              <span className="mission-page" data-i18n="missionPage.or">
                {t("missionPage.or", "หรือ")}
              </span>{" "}
              <span
                className={`text-link ${sub ? "popup-select-icon-style-sub-reward" : "popup-select-icon-style-reward"} mission-page`}
                data-i18n="missionPage.missionSubImageSystem"
                onClick={onChooseIcon}
              >
                {t("missionPage.missionSubImageSystem", "เลือกรูปจากระบบ")}
              </span>
            </span>
            <span className="text-p3-regular text-example mission-page" data-i18n="missionPage.uploadDescription">
              {t("missionPage.uploadDescription", "ขนาดรูปภาพที่แนะนำ : 128px x 128px และรูปภาพจะต้องเป็นนามสกุลไฟล์ png, jpg และ gif เท่านั้น")}
            </span>
          </div>
        </div>
        <div className="group-input custom-input custom-float">
          <label htmlFor="" className="labal mission-page" data-i18n="missionPage.rewardType">
            {t("missionPage.rewardType", "ประเภทของรางวัล")}
          </label>
          <FilterSelect
            className="dropdownSelectTypeReward"
            require
            items={typeItems}
            value={reward.type}
            onChange={(type) => set({ type: type as RewardType })}
            placeholder={unlocalized ? "Select reward type" : t("missionPage.selectRewardType", "เลือกประเภทของรางวัล")}
            placeholderI18n="missionPage.selectRewardType"
          >
            <Feedback id={errorId("RewardMissionType")} show={errors.type} i18nKey="missionPage.selectRewardTypeError">
              {t("missionPage.selectRewardTypeError", "กรุณาเลือกประเภทของรางวัล")}
            </Feedback>
          </FilterSelect>
        </div>
        <div className={`groupCredit group-input custom-input custom-float${hidden("credit")}`}>
          <label htmlFor="" className="labal mission-page" data-i18n="missionPage.fixRateCredit">
            {t("missionPage.fixRateCredit", "จำนวนเครดิต Fix Rate")}
          </label>
          <div className="group-dropdown-label group-dropdown-input-dropdown">
            <div className="input-outer">
              <input
                type="number"
                className="input left"
                id={`inputCreditFixRateValue-${n}`}
                placeholder="0"
                value={reward.credit}
                onChange={(event) => set({ credit: event.target.value })}
              />
            </div>
            <UnitSelect className="dropdownSelectCreditFixRate" value="bath" i18nKey="missionPage.baht" label={t("missionPage.baht", "บาท")} />
          </div>
          <Feedback id={errorId("CreditFixRate")} show={errors.credit} i18nKey="missionPage.fixRateCreditError">
            {t("missionPage.fixRateCreditError", "กรุณากรอกจำนวนเครดิต Fix Rate")}
          </Feedback>
        </div>
        <div className={`groupMinigame group-input-two-col${hidden("mini-game-chance")}`}>
          <div className="group-input custom-input custom-float">
            <label htmlFor="" className="labal mission-page" data-i18n="missionPage.miniGame">
              {t("missionPage.miniGame", "มินิเกมส์")}
            </label>
            <FilterSelect
              className="dropdownSelectMinigame"
              require
              items={miniGames}
              value={reward.miniGameId}
              onChange={(miniGameId) => set({ miniGameId })}
              // Section 2: the list loader replaces the translated placeholder with this English one;
              // sub-mission rows keep the translated text
              placeholder={sub ? t("missionPage.selectMiniGame", "เลือกมินิเกมส์") : "Select mini game"}
              placeholderI18n="missionPage.selectMiniGame"
            />
          </div>
          <div className="group-input custom-input custom-float">
            <label htmlFor="" className="labal mission-page" data-i18n="missionPage.rightsCount">
              {t("missionPage.rightsCount", "จำนวนสิทธิ์")}
            </label>
            <div className="group-dropdown-label group-dropdown-input-dropdown">
              <div className="input-outer">
                <input
                  type="number"
                  className="input left"
                  id={`inputAuthorityMinigame-${n}`}
                  placeholder="0"
                  value={reward.miniGameCount}
                  onChange={(event) => set({ miniGameCount: event.target.value })}
                />
              </div>
              <UnitSelect
                className="dropdownSelectAuthority"
                value="authority"
                i18nKey="missionPage.rights"
                // the dropdown's own text "สิทธิ์" until toggleTranslate() (section 2 row 1 is translated at load)
                label={unlocalized || sub ? "สิทธิ์" : t("missionPage.rights", "จำนวนสิทธิ์")}
              />
            </div>
          </div>
        </div>
        {/* validate…: no game picked -> "กรุณาเลือกมินิเกมส์"; picked but no amount -> the count text */}
        <Feedback id={errorId("Minigame")} show={errors.miniGame || errors.miniGameCount} i18nKey="missionPage.miniGameError">
          {errors.miniGameCount
            ? t("missionPage.js.errorSelectMinigameCount", "กรุณากรอกจำนวนครั้งที่เล่นมินิเกมส์")
            : t("missionPage.miniGameError", "กรุณาเลือกมินิเกมส์")}
        </Feedback>
        <div className={`groupPromotion group-input custom-input custom-float${hidden("promotion-chance")}`}>
          <label htmlFor="" className="labal mission-page" data-i18n="missionPage.promotion">
            {t("missionPage.promotion", "โปรโมชั่น")}
          </label>
          <FilterSelect
            className="dropdownSelectPromotion"
            require
            items={promotions}
            value={reward.promotionId}
            onChange={(promotionId) => set({ promotionId })}
            placeholder={unlocalized ? "Select promotion" : t("missionPage.selectPromotion", "เลือกโปรโมชั่น")}
            placeholderI18n="missionPage.selectPromotion"
          >
            <Feedback id={errorId("Promotion")} show={errors.promotion} i18nKey="missionPage.selectPromotionError">
              {t("missionPage.selectPromotionError", "กรุณาเลือกโปรโมชั่น")}
            </Feedback>
          </FilterSelect>
        </div>
        <div className={`groupPoint group-input custom-input custom-float${hidden("point")}`}>
          <label htmlFor="" className="labal mission-page" data-i18n="missionPage.pointCount">
            {t("missionPage.pointCount", "จำนวนแต้ม")}
          </label>
          <div className="group-dropdown-label group-dropdown-input-dropdown">
            <div className="input-outer">
              <input
                type="number"
                className="input left"
                id={`inputPointValue-${n}`}
                placeholder="0"
                value={reward.point}
                onChange={(event) => set({ point: event.target.value })}
              />
            </div>
            <UnitSelect className="dropdownSelectPoint" value="point" i18nKey="missionPage.point2" label={t("missionPage.point2", "แต้ม")} />
          </div>
          <Feedback id={errorId("Point")} show={errors.point} i18nKey="missionPage.pointError">
            {t("missionPage.pointError", "กรุณากรอกจำนวนแต้ม")}
          </Feedback>
        </div>
        <div className={`groupNameReward group-input custom-input custom-float${hidden("reward")}`}>
          <label htmlFor="" className="labal mission-page" data-i18n="missionPage.rewardName">
            {t("missionPage.rewardName", "ชื่อของรางวัล")}
          </label>
          <div className="group-dropdown-label">
            <div className="input-outer">
              <input
                type="text"
                className="input"
                id={`inputNameReward-${n}`}
                placeholder="reward name"
                value={reward.name}
                onChange={(event) => set({ name: event.target.value })}
              />
            </div>
          </div>
          <Feedback id={errorId("NameReward")} show={errors.name} i18nKey="missionPage.rewardNameError">
            {t("missionPage.rewardNameError", "กรุณากรอกชื่อของรางวัล")}
          </Feedback>
        </div>
      </div>
    </div>
  );
}

// Unit dropdowns with a single, pre-selected item ("บาท", "จำนวนสิทธิ์", "แต้ม", "ครั้ง")
export function UnitSelect({ className, value, i18nKey, label }: { className: string; value: string; i18nKey: string; label: string }) {
  return (
    <FilterSelect
      className={className}
      buttonClassName="right"
      selectedI18n
      items={[{ value, label, i18nKey }]}
      value={value}
      onChange={() => undefined}
      placeholder={label}
    />
  );
}
