"use client";
/* eslint-disable @next/next/no-img-element -- original markup: plain <img> */

import { cx, RichTextEditor } from "@/components/ui";
import { useT } from "@/lib/i18n";
import {
  newReward,
  newSubCondition,
  type MissionRewardForm,
  type Option,
  type SubConditionForm,
  type SubMissionForm,
} from "@/lib/api/missions";
import { DeleteButton, Feedback, previewFile } from "./form-bits";
import { FormSection } from "./form-section";
import { RewardItem } from "./reward-item";
import { MISSION_EDITOR_CONFIG } from "./section-basic";
import { ReceiveTypeCards, TurnoverAndAlert } from "./section-duration";
import { SubConditionBox } from "./sub-condition";

type SubMissionSectionProps = {
  sub: SubMissionForm;
  no: number;
  canDelete: boolean;
  open: boolean;
  onToggle: () => void;
  valid: boolean;
  miniGames: Option[];
  promotions: Option[];
  onChange: (sub: SubMissionForm) => void;
  onDelete: () => void;
  onChooseIcon: (apply: (icon: string) => void) => void;
  onChooseGameType: (selected: string[], apply: (selected: string[]) => void) => void;
};

// Section 3 — "ตั้งค่าภารกิจย่อยที่ N" (#time-sub-mission-N, one per sub-mission)
export function SubMissionSection({
  sub,
  no,
  canDelete,
  open,
  onToggle,
  valid,
  miniGames,
  promotions,
  onChange,
  onDelete,
  onChooseIcon,
  onChooseGameType,
}: SubMissionSectionProps) {
  const t = useT();
  const set = (patch: Partial<SubMissionForm>) => onChange({ ...sub, ...patch });
  const setCondition = (index: number, condition: SubConditionForm) =>
    set({ conditions: sub.conditions.map((c, i) => (i === index ? condition : c)) });
  const setReward = (index: number, reward: MissionRewardForm) => set({ rewards: sub.rewards.map((r, i) => (i === index ? reward : r)) });
  const receiveHook = `enableSubMissionReceive-${no}2`;
  const rewardShown = sub.rewardEnabled ? "" : " d-none";
  const nameMissing = sub.name.trim() === "";
  const limitMissing = sub.limitReward === "yes" && !(Number(sub.limitValue) > 0);

  return (
    <FormSection
      panelId={`openDropdownMissionSettingSub-${no}`}
      open={open}
      onToggle={onToggle}
      valid={valid}
      statusId={`missionTitle-${no}`}
      statusI18n="missionPage.dataNotComplete"
      mainProps={{ id: `time-sub-mission-${no}`, "data-sub-mission": no, "data-sub-mission-id": no }}
      before={<input type="hidden" id={`subMissionId-${no}`} />}
      title={
        <span className="title-mission-setting">
          <span className="mission-page" data-i18n="missionPage.missionSubNo">
            {t("missionPage.missionSubNo", "ตั้งค่าภารกิจย่อยที่")}
          </span>{" "}
          <span id={`text-header-sub-mission-${no}`}>{no}</span>
        </span>
      }
      headerExtra={
        <DeleteButton
          show={canDelete}
          size={24}
          onClick={() => {
            onDelete();
          }}
        >
          <span className="text-link color-red mission-page" data-i18n="missionPage.missionSubDelete">
            {t("missionPage.missionSubDelete", "ลบภารกิจย่อย")}
          </span>
        </DeleteButton>
      }
    >
      <div className="group-content-mission-setting-item">
        <div className="label-title-bg">
          <span className="text-in-label">
            <span data-i18n="missionPage.missionSubSettingNo">{t("missionPage.missionSubSettingNo", "ตั้งค่าการแสดงผลภารกิจย่อยที่")}</span>{" "}
            <span id={`text-header-sub-mission-label-${no}`}>{no}</span>
          </span>
        </div>
        <div className="two-column-upload-image">
          <div className="box-preview-reward-icon">
            <img src={sub.icon} id={`display-inputFileSubMission-${no}`} alt="reward" width="50" height="50" className={`inputFileSubMission-${no}`} />
          </div>
          <div className="box-preview-reward-text">
            <span className="text-p2-bold">
              <span className="mission-page" data-i18n="missionPage.missionSubImageNo">
                {t("missionPage.missionSubImageNo", "อัพโหลดรูปภาพภารกิจย่อยที่")}
              </span>{" "}
              <span id={`text-header-sub-mission-upload-image-${no}`}>{no}</span>
            </span>
            <label className="mission-btn-outline" htmlFor={`inputFileSubMission-${no}`}>
              <input
                type="file"
                id={`inputFileSubMission-${no}`}
                className="d-none"
                name={`inputFileSubMission-${no}`}
                onChange={(event) => previewFile(event, (icon) => set({ icon }))}
              />
              <img src="/assets/images/mission/image-upload.png" alt="icon-image" width="20" height="20" />
              <span className="mission-page" data-i18n="missionPage.missionUpload">
                {t("missionPage.missionUpload", "อัพโหลดรูป")}
              </span>
            </label>
            <span className="text-example text-p2-regular-i">
              <span className="mission-page" data-i18n="missionPage.or">
                {t("missionPage.or", "หรือ")}
              </span>{" "}
              <span
                className="text-link popup-select-icon-style-sub mission-page"
                data-i18n="missionPage.missionSubImageSystem"
                onClick={() => onChooseIcon((icon) => set({ icon }))}
              >
                {t("missionPage.missionSubImageSystem", "เลือกรูปจากระบบ")}
              </span>
            </span>
            <span className="text-p3-regular text-example mission-page" data-i18n="missionPage.uploadDescription">
              {t("missionPage.uploadDescription", "ขนาดรูปภาพที่แนะนำ : 128px x 128px และรูปภาพจะต้องเป็นนามสกุลไฟล์ png, jpg และ gif เท่านั้น")}
            </span>
          </div>
        </div>
        <div className="group-input">
          <label htmlFor="" className="labal">
            <span data-i18n="missionPage.missionSubName">{t("missionPage.missionSubName", "ชื่อภารกิจย่อย")}</span>{" "}
            <span id={`text-header-sub-mission-name-${no}`}>{no}</span>
          </label>
          <div className="input-outer">
            <input
              type="text"
              className="input"
              placeholder="name"
              id={`inputNameSubReward-${no}`}
              value={sub.name}
              onChange={(event) => set({ name: event.target.value })}
            />
          </div>
          <Feedback id={`error-NameRewardSub-${no}`} show={nameMissing} className="invalid-feedback" i18nKey="missionPage.missionSubNameError">
            {t("missionPage.missionSubNameError", "กรุณากรอกชื่อของรางวัล")}
          </Feedback>
        </div>
        <div className="group-input-thin">
          <label htmlFor="" className="labal">
            <span data-i18n="missionPage.missionSubDescription">{t("missionPage.missionSubDescription", "คำอธิบายภารกิจย่อยที่")}</span>{" "}
            <span id={`text-header-sub-mission-description-${no}`}>{no}</span>
          </label>
          <div className="input-thin">
            <RichTextEditor
              id={`missionSubConditionHtml-${no}`}
              config={MISSION_EDITOR_CONFIG}
              defaultValue={sub.description}
              onChange={(description) => set({ description })}
            />
          </div>
        </div>
        <div className="label-title-bg">
          <span className="text-in-label">
            <span data-i18n="missionPage.missionSubCondition">{t("missionPage.missionSubCondition", "ตั้งค่าเงื่อนไขการทำภารกิจย่อย")}</span>{" "}
            <span id={`text-header-sub-mission-condition-${no}`}>{no}</span>
          </span>
        </div>
        <div className="box-sub-condition" id={`sub-condition-html-${no}`}>
          {sub.conditions.map((condition, index) => (
            <SubConditionBox
              key={condition.id}
              condition={condition}
              subNo={no}
              no={index + 1}
              canDelete={sub.conditions.length > 1}
              onChange={(next) => setCondition(index, next)}
              onDelete={() => set({ conditions: sub.conditions.filter((_, i) => i !== index) })}
              onChooseGameType={() =>
                onChooseGameType(condition.brandGames, (brandGames) => setCondition(index, { ...condition, brandGames }))
              }
            />
          ))}
        </div>
        <div className="d-flex justify-content-start">
          <button
            className="mission-btn-outline"
            id={`btn-add-sub-condition-${no}`}
            data-sub-main-id={no}
            onClick={() => set({ conditions: [...sub.conditions, newSubCondition()] })}
          >
            <img src="/assets/images/mission/icon-add-mission-btn.png" alt="add-reward" width="20" height="20" />
            <span data-i18n="missionPage.missionSubAddCondition">{t("missionPage.missionSubAddCondition", "เพิ่มเงื่อนไข")}</span>
          </button>
        </div>
      </div>

      <div className="group-content-mission-setting-item">
        <div className="label-title-bg">
          <span className="text-in-label" data-i18n="missionPage.missionSubConditionReward">
            {t("missionPage.missionSubConditionReward", "กำหนดเงื่อนไขการได้รับของรางวัล")}
          </span>
        </div>
        <div className="group-switch">
          <div className="mission-switch-btn">
            <input
              className="mission-switch-check-input"
              type="checkbox"
              id={`enableSubMissionReceive-${no}`}
              checked={sub.rewardEnabled}
              onChange={(event) => set({ rewardEnabled: event.target.checked })}
            />
          </div>
          <span className="switch-title" data-i18n="missionPage.missionSubOnOffReward">
            {t("missionPage.missionSubOnOffReward", "เปิด / ปิดใช้งาน การให้ของรางวัลภารกิจ")}
          </span>
        </div>
        <div className={`group-input-thin ${receiveHook}${rewardShown}`}>
          <label className="labal" data-i18n="missionPage.missionSubRewardDone">
            {t("missionPage.missionSubRewardDone", "กำหนดเงื่อนไขการรับของรางวัลเมื่อทำภารกิจสำเร็จ")}
          </label>
          <ReceiveTypeCards
            name={`MissionReceiveType-${no}`}
            ids={[`missionRewardSelf-${no}`, `missionRewardAuto-${no}`]}
            keys={["missionPage.missionSubRewardC1", "missionPage.missionSubRewardC11", "missionPage.missionSubRewardC2", "missionPage.missionSubRewardC22"]}
            value={sub.receiveType}
            onChange={(receiveType) => set({ receiveType })}
          />
        </div>
        <div className={`reward-sub-reset-mission ${receiveHook}${rewardShown}`}>
          <div className="switch-and-sub">
            <div className="mission-switch-btn">
              <input
                className="mission-switch-check-input"
                type="checkbox"
                id={`enableResetSuccess-${no}`}
                checked={sub.resetEnabled}
                onChange={(event) => set({ resetEnabled: event.target.checked })}
              />
            </div>
            <div className="group-text-switch">
              <span className="switch-title text-p2-regular" data-i18n="missionPage.missionSubTextS1">
                {t("missionPage.missionSubTextS1", "อนุญาตให้ Reset รางวัล ภารกิจทันทีที่ทำสำเร็จ")}
              </span>
              <span className="text-p3-regular text-example" data-i18n="missionPage.missionSubTextS2">
                {t("missionPage.missionSubTextS2", "สมาชิกจะสามารถทำภารกิจได้อีกครั้งและเมื่อภารกิจสำเร็จ")}
              </span>
              <br />
              <span className="text-p3-regular text-example" data-i18n="missionPage.missionSubTextS3">
                {t("missionPage.missionSubTextS3", "ก็จะสามารถรับของรางวัลได้อีกรอบ")}
              </span>
              <div className={cx("group-sub", `enableResetSuccess-${no}`, !sub.resetEnabled && "d-none")}>
                {(
                  [
                    ["no", "reset-reward-no", "missionPage.missionSubTextS4", "ไม่จำกัดจำนวนรางวัลสูงสุดที่สมาชิกรับได้"],
                    ["yes", "reset-reward-yes", "missionPage.missionSubTextS5", "จำกัดจำนวนรางวัลสูงสุดที่รับได้"],
                  ] as const
                ).map(([value, idBase, key, label]) => (
                  <div key={value} className="group-radio custom-radio">
                    <input
                      type="radio"
                      name={`limitReward-${no}`}
                      value={value}
                      id={`${idBase}-${no}`}
                      checked={sub.limitReward === value}
                      onChange={() => set({ limitReward: value })}
                    />
                    <span className="checkmark"></span>
                    <label htmlFor={`${idBase}-${no}`} data-i18n={key} className="text-p2-regular color-sub">
                      {t(key, label)}
                    </label>
                  </div>
                ))}
                <div className={cx("custom-input group-input group-input-card", sub.limitReward !== "yes" && "disabled")}>
                  <div className="input-outer input-outer-card">
                    <div className="input-outer-card-suffix start">
                      <span className="text-p2-regular" data-i18n="missionPage.missionSubTextS6">
                        {t("missionPage.missionSubTextS6", "รับได้สูงสุดไม่เกิน")}
                      </span>
                    </div>
                    <input
                      type="text"
                      className="input input-card"
                      id={`limitReward-${no}`}
                      placeholder="0"
                      disabled={sub.limitReward !== "yes"}
                      value={sub.limitValue}
                      onChange={(event) => set({ limitValue: event.target.value })}
                    />
                    <div className="input-outer-card-suffix">
                      <span className="text-p2-regular" data-i18n="missionPage.count">
                        {t("missionPage.count", "ครั้ง")}
                      </span>
                    </div>
                  </div>
                  <Feedback id={`error-LimitRewardSub-${no}`} show={limitMissing} className="invalid-feedback" i18nKey="missionPage.missionSubTextError">
                    {t("missionPage.missionSubTextError", "กรุณากรอกจำนวนรางวัลที่สามารถรับได้")}
                  </Feedback>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`label-title-bg ${receiveHook}${rewardShown}`}>
          <span className="text-in-label" data-i18n="missionPage.missionSubReward">
            {t("missionPage.missionSubReward", "กำหนดของรางวัลเมื่อทำภารกิจสำเร็จ")}
          </span>
        </div>
        <div className={`box-sub-reward ${receiveHook}${rewardShown}`} id={`sub-reward-html-${no}`}>
          {sub.rewards.map((reward, index) => (
            <RewardItem
              key={reward.id}
              reward={reward}
              no={index + 1}
              subNo={no}
              canDelete={sub.rewards.length > 1}
              miniGames={miniGames}
              promotions={promotions}
              onChange={(next) => setReward(index, next)}
              onDelete={() => set({ rewards: sub.rewards.filter((_, i) => i !== index) })}
              onChooseIcon={() => onChooseIcon((icon) => setReward(index, { ...reward, icon }))}
            />
          ))}
        </div>
        <div className={`d-flex justify-content-center ${receiveHook}${rewardShown}`}>
          <button
            className="mission-btn-outline"
            id={`btn-add-sub-reward-${no}`}
            data-sub-main-id={no}
            onClick={() => set({ rewards: [...sub.rewards, newReward()] })}
          >
            <img src="/assets/images/mission/icon-add-mission-btn.png" alt="add-reward" width="20" height="20" />
            <span data-i18n="missionPage.missionAddReward">{t("missionPage.missionAddReward", "เพิ่มของรางวัล")}</span>
          </button>
        </div>
      </div>

      <div className="group-content-mission-setting-item">
        <TurnoverAndAlert
          ids={{
            turnOverSwitch: `enableTurnOver-${no}`,
            byTime: `missionTurnOverTypeByTime-${no}`,
            byTimeValue: `turnOverByTimeValue-${no}`,
            byTimeError: `error-TurnoverByTimeSub-${no}`,
            byUnit: `missionTurnOverTypeByUnit-${no}`,
            byUnitValue: `turnOverByTimeUnit-${no}`,
            byUnitError: `error-TurnoverByUnitSub-${no}`,
            byUnitErrorKey: "missionPage.missionDurationErrorText5",
            alertSwitch: `enableMissionAlert-${no}`,
            alertPopup: `isAlertLogin-${no}`,
            alertPopupFor: "isAlertLogin-template",
            alertFloating: `isAlertFloating-${no}`,
            alertFloatingFor: "isAlertFloating-template",
          }}
          hooks={{ turnOver: "enableTurnOver", alert: "enableMissionAlert" }}
          value={sub}
          onChange={set}
        />
      </div>
    </FormSection>
  );
}
