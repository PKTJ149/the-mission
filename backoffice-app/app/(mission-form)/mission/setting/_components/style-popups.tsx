"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img>, often without alt */

import { Fragment, useState } from "react";
import { SystemPopup, type useSystemPopup } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { IconStyleGroup, ImageStyleGroup } from "@/lib/api/missions";
import { AccordionHeader, Collapse } from "./collapse";

type PopupControl = ReturnType<typeof useSystemPopup>;

function PopupHeader() {
  const t = useT();
  return (
    <div className="system-popup-content-header">
      <h4 className="mission-page" data-i18n="missionPage.bannerMissionGetHeader">
        {t("missionPage.bannerMissionGetHeader", "เลือกรูปภาพจากระบบ")}
      </h4>
    </div>
  );
}

function PopupButtons({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const t = useT();
  return (
    <div className="system-popup-btns confirm">
      <button className="mission-btn-outline system-popup-btn-cancel mission-page" data-i18n="missionPage.missionCancelButton" onClick={onCancel}>
        {t("missionPage.missionCancelButton", "ยกเลิก")}
      </button>
      <button className="mission-btn system-popup-btn-confirm mission-page" data-i18n="missionPage.missionConfirmShortButton" onClick={onConfirm}>
        {t("missionPage.missionConfirmShortButton", "ยืนยัน")}
      </button>
    </div>
  );
}

type ImageStylePopupProps = {
  control: PopupControl;
  groups: ImageStyleGroup[];
  current: string;
  onSave: (image: string) => void;
};

// #popup-image-style — "เลือกรูปจากระบบ" for the mission cover (showPopupImageStyle / saveImageStyle)
export function ImageStylePopup({ control, groups, current, onSave }: ImageStylePopupProps) {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  const [picked, setPicked] = useState(current);

  return (
    <SystemPopup control={control} id="popup-image-style">
      <div className="system-popup-content">
        <PopupHeader />
        <div className="system-popup-content-inner">
          <div className="system-popup-content-inner-text">
            <div className="choose-image-dropdown dropdown-main" id="accordionMissionSetting">
              {groups.map((group, index) => (
                <Fragment key={group.title}>
                  <AccordionHeader
                    open={open === index}
                    target={`openDropdownChooseImage${index + 1}`}
                    onToggle={() => setOpen(open === index ? null : index)}
                  >
                    <div className="group-title-mission-setting">
                      <span className="title-mission-setting">
                        <span className="mission-page" data-i18n="missionPage.imageCategoryMissionNo">
                          {t("missionPage.imageCategoryMissionNo", "รูปภาพหมวดที่")}
                        </span>{" "}
                        {group.title}
                      </span>
                      <div className="group-mission-setting-status">
                        <img src="/assets/images/mission/icon-arrow-down.png" width="32" height="32" />
                      </div>
                    </div>
                  </AccordionHeader>
                  <Collapse
                    open={open === index}
                    className="box-content-mission-setting"
                    id={`openDropdownChooseImage${index + 1}`}
                    data-bs-parent="#accordionMissionSetting"
                  >
                    <div className="group-content-mission-setting">
                      <div className="group-btn-choose-image-main" id={`group-btn-choose-image-${index + 1}`}>
                        {group.images.map((image, imageIndex) => (
                          <label key={image} className="image-radio">
                            <input
                              type="radio"
                              name="imageStyle"
                              value={image}
                              checked={picked === image}
                              onChange={() => setPicked(image)}
                            />{" "}
                            <div className="image-radio-content">
                              {/* Every captured cover image has alt "Style 1" */}
                              <img src={image} alt="Style 1" />
                              <div className="image-radio-label">
                                <div className="radio-circle"></div>
                                <span>Style {imageIndex + 1}</span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </Collapse>
                </Fragment>
              ))}
            </div>
          </div>
          <PopupButtons
            onCancel={control.close}
            onConfirm={() => {
              onSave(picked);
              control.close();
            }}
          />
        </div>
      </div>
    </SystemPopup>
  );
}

type IconStylePopupProps = {
  control: PopupControl;
  groups: IconStyleGroup[];
  onSave: (icon: string) => void; // sets the icon of the field that opened the popup (#iconSelectSection)
};

// #popup-icon-style — "เลือกรูปจากระบบ" for sub-mission and reward icons (showPopupIconStyle)
export function IconStylePopup({ control, groups, onSave }: IconStylePopupProps) {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <SystemPopup control={control} id="popup-icon-style" className="choose-icon-style">
      <div className="system-popup-content">
        <PopupHeader />
        <div className="system-popup-content-inner">
          <div className="system-popup-content-inner-text">
            <div className="choose-image-dropdown dropdown-main" id="accordionMissionSettingIcon">
              {groups.map((group, index) => {
                const target = `openDropdownChooseImage${group.target}`;
                return (
                  <Fragment key={group.target}>
                    <AccordionHeader open={open === index} target={target} onToggle={() => setOpen(open === index ? null : index)}>
                      <div className="group-title-mission-setting">
                        <span className="title-mission-setting mission-page" data-i18n={`missionPage.${group.i18nKey}`}>
                          {t(`missionPage.${group.i18nKey}`, group.title)}
                        </span>
                        <div className="group-mission-setting-status">
                          <img src="/assets/images/mission/icon-arrow-down.png" width="32" height="32" />
                        </div>
                      </div>
                    </AccordionHeader>
                    <Collapse open={open === index} className="box-content-mission-setting" id={target} data-bs-parent="#accordionMissionSettingIcon">
                      <div className="group-content-mission-setting">
                        <div className="group-btn-choose-image" id={`group-btn-choose-image-${group.target.toLowerCase()}`}>
                          {group.images.map((image) => (
                            <label key={image} className="image-radio icon-radio">
                              <input
                                type="radio"
                                name="imageStyleIcon"
                                value={image}
                                checked={picked === image}
                                onChange={() => setPicked(image)}
                              />{" "}
                              <div className="image-radio-content">
                                <img src={image} alt={`Style ${index + 1}`} />
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </Collapse>
                  </Fragment>
                );
              })}
            </div>
          </div>
          <PopupButtons
            onCancel={control.close}
            onConfirm={() => {
              if (picked) onSave(picked);
              control.close();
            }}
          />
        </div>
      </div>
    </SystemPopup>
  );
}
