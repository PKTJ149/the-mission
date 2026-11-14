"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img>, often without alt */

import { useState } from "react";
import { cx, useCustomPopupAlert } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { NEW_BANNER_IMAGE, type MissionBanner, type Option } from "@/lib/api/missions";
// Same mission-style dropdown as the create form (img arrow toggler, .dropdown-toggler-mission)
import { WrapperDropdown } from "@/app/(mission-form)/mission/setting/_components/mission-dropdowns";

type Card = MissionBanner & {
  editing: boolean; // without .banner-disable
  saved: MissionBanner | null; // last confirmed values (null = never saved)
};

type BannerSettingPageProps = {
  initialBanners: MissionBanner[];
  menuOptions: Option[];
  initialAutoSlide: boolean;
};

// /mission/banner-setting — script /js/scriptmission-banner-setting.js was not captured; behaviour
// follows notes.md (edit / cancel / add are client-side). Nothing is uploaded or saved.
export function BannerSettingPage({ initialBanners, menuOptions, initialAutoSlide }: BannerSettingPageProps) {
  const t = useT();
  const [cards, setCards] = useState<Card[]>(() => initialBanners.map((b) => ({ ...b, editing: false, saved: b })));
  const [autoSlide, setAutoSlide] = useState(initialAutoSlide);
  const [menuErrors, setMenuErrors] = useState<number[]>([]);
  const [dragged, setDragged] = useState<number | null>(null);
  const [popupAlert, popupAlertHolder] = useCustomPopupAlert();

  const update = (id: number, patch: Partial<Card>) => setCards((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  // addTemplateBannerMissionBtn(): a new card N+1 on top, already in edit mode
  const addBanner = () => {
    const id = Math.max(0, ...cards.map((c) => c.id)) + 1;
    const banner: MissionBanner = { id, image: NEW_BANNER_IMAGE, showOnMissionPage: false, linkType: null, menu: null, url: "" };
    setCards((list) => [{ ...banner, editing: true, saved: null }, ...list]);
  };

  // cancelBannerMission(N): back to the read-only state (and the last confirmed values)
  const cancel = (card: Card) => {
    setMenuErrors((list) => list.filter((id) => id !== card.id));
    update(card.id, { ...(card.saved ?? {}), editing: false });
  };

  // saveBannerMission(N) — local only
  const save = async (card: Card) => {
    if (card.linkType === "menu" && !card.menu) {
      setMenuErrors((list) => [...list, card.id]);
      return;
    }
    setMenuErrors((list) => list.filter((id) => id !== card.id));
    const { id, image, showOnMissionPage, linkType, menu, url } = card;
    update(card.id, { editing: false, saved: { id, image, showOnMissionPage, linkType, menu, url } });
    await popupAlert.show({
      title: t("missionPage.js.uploadPass", "บันทึกสำเร็จ"),
      type: "success",
      message: t("missionPage.js.uploadPassMsg", "ระบบได้ทำการบันทึกเรียบร้อย"),
      needConfirmation: false,
    });
  };

  // deleteTemplateBannerMission(N)
  const remove = async (card: Card) => {
    const result = await popupAlert.show({
      title: t("missionPage.js.confirmDelete2", "ยืนยันลบแบนเนอร์ หรือไม่?"),
      type: "delete",
      message: t(
        "missionPage.js.confirmDeleteMsg2",
        "เมื่อคุณยืนยันลบแบนเนอร์ ระบบจะทำให้การลบแบนเนอร์ ออกจากระบบอย่างถาวร และไม่สามารถนำกลับมาได้อีก คุณยืนยันที่จะลบแบนเนอร์นี้ หรือไม่ ?",
      ),
      needConfirmation: true,
    });
    if (result === "confirmed") setCards((list) => list.filter((c) => c.id !== card.id));
  };

  // Drag-reorder of the cards (the original saves the new order; here it is local)
  const drop = (targetId: number) => {
    if (dragged === null || dragged === targetId) return;
    setCards((list) => {
      const from = list.findIndex((c) => c.id === dragged);
      const to = list.findIndex((c) => c.id === targetId);
      const next = [...list];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDragged(null);
  };

  return (
    <div className="page-content mission-banner-setting">
      <div className="container-fluid full-container">
        <svg width="0" height="0" viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="filter-gradient" x1="7.91113" y1="0.666748" x2="7.91113" y2="17.3334" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#50A198"></stop>
              <stop offset="1" stopColor="#FEDB6B"></stop>
            </linearGradient>
          </defs>
        </svg>
        <div className="inner-container full-flex">
          <div className="custom-card full-card full-flex">
            <div className="title-header-custom-mission">
              <div className="group-btn-title">
                <div className="group-title-header">
                  <h4 className="mb-0 mission-page" data-i18n="missionPage.missionBannerSetting">
                    {t("missionPage.missionBannerSetting", "ตั้งค่าแบนเนอร์ภารกิจ")}
                  </h4>
                  <div className="group-title-header-path">
                    <img src="/assets/images/mission/icon-mission.png" width="24" height="24" />
                    <span>
                      <span className="mission-page" data-i18n="missionPage.missionListHeader">
                        {t("missionPage.missionListHeader", "รายชื่อภารกิจ")}
                      </span>{" "}
                      &gt;{" "}
                      <span className="text-teal-green">
                        <span className="mission-page" data-i18n="missionPage.missionBannerSetting">
                          {t("missionPage.missionBannerSetting", "ตั้งค่าแบนเนอร์ภารกิจ")}
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="title-header-custom-mission">
              <div className="group-btn-title">
                <div className="group-title-header-second">
                  <div className="icon-title">
                    <img src="/assets/images/mission/icon-mission.png" width="32" height="32" />
                  </div>
                  <h4 className="mb-0 mission-page" data-i18n="missionPage.missionBannerSetting">
                    {t("missionPage.missionBannerSetting", "ตั้งค่าแบนเนอร์ภารกิจ")}
                  </h4>
                </div>
                <div className="group-btn">
                  <div className="group-switch">
                    <div className="mission-switch-btn">
                      {/* changeAutoSlideBannerMission(): saved immediately on the original; local only here */}
                      <input
                        className="mission-switch-check-input"
                        type="checkbox"
                        id="enableMissionAutoSlide"
                        checked={autoSlide}
                        onChange={(event) => setAutoSlide(event.target.checked)}
                      />
                    </div>
                    <span className="mission-page" data-i18n="missionPage.bannerSlideAuto">
                      {t("missionPage.bannerSlideAuto", "สไลด์ออร์โต้")}
                    </span>
                  </div>
                  <button className="mission-btn" onClick={addBanner}>
                    <img src="/assets/images/mission/icon-add-mission-btn.png" alt="addSlideBanner" width="20" height="20" />
                    <span className="mission-page" data-i18n="missionPage.addBannerSlide">
                      {t("missionPage.addBannerSlide", "เพิ่มรูปแบนเนอร์")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="group-content-page">
              <div id="divMinigameTable" className="content-banner-mission">
                <div id="customBannerMissionDraggable" className="main-banner-mission">
                  {cards.map((card) => (
                    <BannerCard
                      key={card.id}
                      card={card}
                      menuOptions={menuOptions}
                      menuError={menuErrors.includes(card.id)}
                      onChange={(patch) => update(card.id, patch)}
                      onEdit={() => update(card.id, { editing: true })}
                      onDelete={() => remove(card)}
                      onCancel={() => cancel(card)}
                      onSave={() => save(card)}
                      onDragStart={() => setDragged(card.id)}
                      onDrop={() => drop(card.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {popupAlertHolder}
    </div>
  );
}

type BannerCardProps = {
  card: Card;
  menuOptions: Option[];
  menuError: boolean;
  onChange: (patch: Partial<Card>) => void;
  onEdit: () => void;
  onDelete: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDragStart: () => void;
  onDrop: () => void;
};

// .menu-item.card-banner-mission (#banner-mission-N); .banner-disable = read-only
function BannerCard({ card, menuOptions, menuError, onChange, onEdit, onDelete, onCancel, onSave, onDragStart, onDrop }: BannerCardProps) {
  const t = useT();
  const n = card.id;

  return (
    <div
      className={cx("menu-item card-banner-mission", !card.editing && "banner-disable")}
      draggable="true"
      id={`banner-mission-${n}`}
      data-banner={n}
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
    >
      <input type="hidden" name="missionBannerId" id={`missionBannerId-${n}`} />
      <input type="hidden" name="sequence" id={`sequence-${n}`} value={card.saved ? "1" : undefined} />
      <div className="banner-mission-menu-dragger">
        <img src="/assets/images/minigame/dragger-icon.svg" />
      </div>
      <div className="banner-mission-menu-content">
        <div className="group-banner-mission-menu-content-title">
          <div className="banner-mission-menu-content-title">
            <span className="mission-page" data-i18n="missionPage.bannerNo">
              {t("missionPage.bannerNo", "รูปแบนเนอร์")}
            </span>{" "}
            <span className="text-banner-mission-menu-content-title">{n}</span>
          </div>
          <div className="group-header-mission-status-btn">
            <div className="group-header-mission-status-btn-edit" onClick={onEdit}>
              <img width="24" height="24" src="/assets/images/mission/icon-file.png" />
            </div>
            <div className="group-header-mission-status-btn-delete" onClick={onDelete}>
              <img width="24" height="24" src="/assets/images/mission/icon-trash.png" />
            </div>
          </div>
        </div>
        <div className="banner-mission-menu-content-main">
          <div className="banner-mission-menu-content-main-image">
            <img className={`inputBannerMission-${n}`} src={card.image} alt="banner 1" />
          </div>
          <div className="banner-mission-menu-content-main-upload">
            <div className="group-btn-upload-banner">
              <span className="mission-page" data-i18n="missionPage.uploadBannerNo">
                {t("missionPage.uploadBannerNo", "อัพโหลดรูปแบนเนอร์")}
              </span>{" "}
              <span className="label-upload-banner">{n}</span>{" "}
              <label className="mission-btn-outline w-100" htmlFor={`inputBannerMission-${n}`}>
                {/* handleFileMission(event): local preview only, nothing is uploaded */}
                <input
                  type="file"
                  id={`inputBannerMission-${n}`}
                  className="d-none"
                  name="inputFileIconBanner-template"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) onChange({ image: URL.createObjectURL(file) });
                    event.target.value = "";
                  }}
                />
                <img src="/assets/images/mission/image-upload.png" alt="upload" width="20" height="20" />
                <span className="mission-page" data-i18n="missionPage.uploadImage">
                  {t("missionPage.uploadImage", "อัพโหลดรูป")}
                </span>
              </label>
            </div>
            <p className="text-mission-link-note mission-page" data-i18n="missionPage.uploadImageText">
              {t("missionPage.uploadImageText", "ขนาดรูปภาพที่แนะนำ : 574px x 286px สกุลไฟล์ png, jpg และ gif เท่านั้น")}
            </p>
            <div className="group-checkbox mt-2">
              <input
                type="checkbox"
                className="form-check-input check-banner-mission mt-0"
                id={`checkbox-banner-mission-${n}`}
                checked={card.showOnMissionPage}
                onChange={(event) => onChange({ showOnMissionPage: event.target.checked })}
              />
              <label htmlFor={`checkbox-banner-mission-${n}`} className="label-checkbox-banner-mission mission-page" data-i18n="missionPage.bannerShowSetting">
                {t("missionPage.bannerShowSetting", "แสดงแบนเนอร์ที่หน้ารวมภารกิจ")}
              </label>
            </div>
          </div>
          <div className="banner-mission-menu-content-main-url">
            <div className="group-btn-banner-mission-custom-url">
              <span className="text-p2-bold label-banner-mission-custom-url mission-page" data-i18n="missionPage.bannerSettingLink">
                {t("missionPage.bannerSettingLink", "กำหนดลิ้งค์แบนเนอร์ (ระบุหรือไม่ก็ได้)")}
              </span>
              <div className="group-input-banner-mission-custom-url">
                <div className="group-radio custom-radio">
                  <input
                    type="radio"
                    name={`radio-banner-mission-custom-url-${n}`}
                    id={`radio-banner-mission-custom-url1-${n}`}
                    value="0"
                    checked={card.linkType === "menu"}
                    onChange={() => onChange({ linkType: "menu" })}
                  />
                  <span className="checkmark"></span>
                  <label
                    htmlFor={`radio-banner-mission-custom-url1-${n}`}
                    className="text-p2-regular label-banner-mission-custom-url mission-page"
                    data-i18n="missionPage.bannerMenuInMission"
                  >
                    {t("missionPage.bannerMenuInMission", "เมนูภายในภารกิจ")}
                  </label>
                </div>
                <div className="custom-input custom-float input-group-dropdown">
                  <WrapperDropdown
                    className="dropdownSelectMenuMission"
                    items={menuOptions}
                    value={card.menu}
                    onChange={(menu) => onChange({ menu })}
                    placeholder={t("missionPage.js.selectMenuMsg", "เลือกเมนูในเว็บ")}
                  >
                    <div
                      className="invalid-feedback"
                      id={`error-selectMenuMissionDropdown-${n}`}
                      data-i18n="missionPage.bannerSettingErrorText1"
                      style={{ display: menuError ? "block" : "none" }}
                    >
                      {t("missionPage.bannerSettingErrorText1", "กรุณาเลือกเมนูในเว็บ")}
                    </div>
                  </WrapperDropdown>
                </div>
              </div>
              <div className="group-input-banner-mission-custom-url">
                <div className="group-radio custom-radio">
                  <input
                    type="radio"
                    name={`radio-banner-mission-custom-url-${n}`}
                    id={`radio-banner-mission-custom-url2-${n}`}
                    value="1"
                    checked={card.linkType === "url"}
                    onChange={() => onChange({ linkType: "url" })}
                  />
                  <span className="checkmark"></span>
                  <label
                    htmlFor={`radio-banner-mission-custom-url2-${n}`}
                    className="text-p2-regular label-banner-mission-custom-url mission-page"
                    data-i18n="missionPage.urlSetting"
                  >
                    {t("missionPage.urlSetting", "กำหนด URL")}
                  </label>
                </div>
                <div className="custom-input custom-float input-group-dropdown group-input">
                  <div className="input-outer">
                    <input
                      type="text"
                      className="input"
                      placeholder="ระบุ URL"
                      id={`missionBannerCustomUrl-${n}`}
                      data-name-lang="th"
                      value={card.url}
                      onChange={(event) => onChange({ url: event.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="group-btn-banner-mission-footer">
              <button className="mission-btn-outline btn-cancel-banner-mission" onClick={onCancel}>
                <span className="mission-page" data-i18n="missionPage.missionCancelButton">
                  {t("missionPage.missionCancelButton", "ยกเลิก")}
                </span>
              </button>
              <button className="mission-btn btn-save-banner-mission" onClick={onSave}>
                <span className="mission-page" data-i18n="missionPage.missionConfirmShortButton">
                  {t("missionPage.missionConfirmShortButton", "ยืนยัน")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
