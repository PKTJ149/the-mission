"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img>, often without alt */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx, useCustomPopupAlert } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { MissionListItem, MissionStatus } from "@/lib/api/missions";

// /mission — header, the 4 stat boxes and the mission cards (server-rendered on the original;
// behaviour from legacy-js/scriptmission.js).
export function MissionList({ initialMissions }: { initialMissions: MissionListItem[] }) {
  const t = useT();
  const [missions, setMissions] = useState(initialMissions);
  // The original keeps two popup instances so the result popup can animate in while the confirm one animates out
  const [popupAlert, popupAlertHolder] = useCustomPopupAlert();
  const [popupAlertSecond, popupAlertSecondHolder] = useCustomPopupAlert();
  const scrollRef = useRef<HTMLDivElement>(null);

  const count = (status: MissionStatus) => missions.filter((m) => m.status === status).length;
  const update = (id: string, patch: Partial<MissionListItem>) =>
    setMissions((list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  // toggleMissionStatus(missionId, input)
  const toggleStatus = async (mission: MissionListItem, checked: boolean) => {
    const newStatus = checked ? "online" : "offline";
    const type = checked ? "on" : "off";
    update(mission.id, { enabled: checked });

    const result = await popupAlert.show({
      title: t("missionPage.js.confirm", "ยืนยัน") + newStatus + t("missionPage.js.confirmMsg", " การใช้งานภารกิจ หรือไม่?"),
      type,
      message: checked
        ? t("missionPage.js.missionStatusOnline", "เมื่อคุณยืนยันเปิดการใช้งานภารกิจ ระบบจะเปิดการใช้งานภารกิจทันที สมาชิกจะสามารถ ทำภารกิจได้อีกครั้ง")
        : t("missionPage.js.missionStatusOffline", "เมื่อคุณยืนยันปิดการใช้งานภารกิจ ระบบจะปิดการใช้งานภารกิจทันที สมาชิกจะไม่สามารถ ทำภารกิจได้ ชั่วคราว จนกว่าจะเปิดใช้งานอีกครั้ง"),
      needConfirmation: true,
    });
    if (result === "cancelled") {
      update(mission.id, { enabled: !checked });
      return;
    }

    // Mock of POST /mission/update-status — nothing is sent
    await popupAlertSecond.show({
      title: newStatus + t("missionPage.js.confirmMission", "การใช้งานภารกิจ สำเร็จ !"),
      type,
      // ORIGINAL BUG (kept on purpose, PK 15/11/2026): the original compares newStatus with 'ปิด' (never
      // true), so the result popup always shows the "online" text, also when switching off. The fix would be
      // to pick missionPage.js.missionStatusOfflineNew when newStatus is "offline".
      message: t("missionPage.js.missionStatusOnlineNew", "ระบบเปิดการใช้งานภารกิจแล้ว สมาชิกจะสามารถทำภารกิจได้อีกครั้ง"),
      needConfirmation: false,
    });
    // ORIGINAL: location.reload() — here the card and the counters update in place
    if (mission.status !== "expired") update(mission.id, { status: newStatus });
  };

  // toggleMissionDelete(missionId)
  const deleteMission = async (mission: MissionListItem) => {
    const result = await popupAlert.show({
      title: t("missionPage.js.confirmDelete", "ยืนยันลบภารกิจ หรือไม่?"),
      type: "delete",
      message: t(
        "missionPage.js.confirmDeleteMsg",
        "เมื่อคุณยืนยันลบภารกิจ ระบบจะทำให้การลบภารกิจ ออกจากระบบอย่างถาวร และไม่สามารถนำกลับมาได้อีก คุณยืนยันที่จะลบภารกิจนี้ หรือไม่ ?",
      ),
      needConfirmation: true,
    });
    if (result !== "confirmed") return;

    // Mock of POST /mission/delete-mission — nothing is sent
    await popupAlertSecond.show({
      title: t("missionPage.js.confirmDeletePass", "ยืนยันลบภารกิจ สำเร็จ !"),
      type: "delete",
      message: t("missionPage.js.confirmDeletePassMsg", "ระบบลบภารกิจนี้ออกจากระบบอย่างถาวร และไม่สามารถนำกลับมาได้อีก"),
      needConfirmation: false,
    });
    // ORIGINAL: location.reload()
    setMissions((list) => list.filter((m) => m.id !== mission.id));
  };

  // toggleMissionEdit(missionId). Expired cards: mission.css sets pointer-events:none on the edit button.
  const editMission = (mission: MissionListItem) => {
    if (mission.status === "expired") return;
    // Full page load like the original (the target page has another root layout)
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/mission/setting?missionId=${mission.id}&edit=1`);
  };

  // .main-content-mission turns vertical wheel scrolling into horizontal scrolling (x2 speed)
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    let scrollAmount = 0;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      scrollAmount += event.deltaY * 2;
      if (scrollTimer !== null) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        element.scrollLeft += scrollAmount;
        scrollAmount = 0;
        scrollTimer = null;
      }, 20);
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", onWheel);
      if (scrollTimer !== null) clearTimeout(scrollTimer);
    };
  }, []);

  const missionWord = <span className="mission-page" data-i18n="missionPage.mission">{t("missionPage.mission", "ภารกิจ")}</span>;

  return (
    <div className="page-content">
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
                <div className="group-title">
                  <h4 className="mb-0 mission-page" data-i18n="missionPage.title">
                    {t("missionPage.title", "ตั้งค่าภารกิจ")}
                  </h4>
                  <a className="mission-btn-outline btn-settings" href="/mission/agent-setting">
                    <img src="/assets/images/mission/icon-settings.png" alt="setting-mission" width="24" height="24" />
                  </a>
                </div>
                <div className="group-btn">
                  <a className="mission-btn-outline" href="/mission/banner-setting">
                    <img src="/assets/images/mission/image-upload.png" alt="upload-banner" width="24" height="24" />
                    <span className="mission-page" data-i18n="missionPage.buttonHeader1">
                      {t("missionPage.buttonHeader1", "อัพโหลดแบนเนอร์")}
                    </span>
                  </a>
                  <a className="mission-btn-outline" href="/mission/mission/history">
                    <img src="/assets/images/mission/icon-time-past.png" alt="history" width="24" height="24" />
                    <span className="mission-page" data-i18n="missionPage.buttonHeader2">
                      {t("missionPage.buttonHeader2", "ประวัติการแก้ไข")}
                    </span>
                  </a>
                  <a className="mission-btn" href="/mission/setting">
                    <img src="/assets/images/mission/icon-add-mission-btn.png" alt="create-mission" width="20" height="20" />
                    <span className="mission-page" data-i18n="missionPage.buttonHeader3">
                      {t("missionPage.buttonHeader3", "สร้างภารกิจ")}
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="mission-data-title">
              <img src="/assets/images/mission/icon-purpose.png" />
              <h4 className="mb-0 mission-page" data-i18n="missionPage.missionListHeader">
                {t("missionPage.missionListHeader", "รายชื่อภารกิจ")}
              </h4>
            </div>
            <div className="group-content-page">
              <div className="d-flex justify-content-between group-box-dashboard-mission">
                <StatBox icon={1} i18nKey="missionAllCount" label="จำนวนภารกิจทั้งหมด" textClassName="text">
                  {missions.length} {missionWord}
                </StatBox>
                <StatBox icon={2} i18nKey="missionOnlineCount" label="จำนวน Online ภารกิจ" textClassName="text text-teal">
                  {count("online")} {missionWord}
                </StatBox>
                <StatBox icon={3} i18nKey="missionExpireCount" label="จำนวนภารกิจ หมดอายุ" textClassName="text text-red">
                  {count("expired")} {missionWord}
                </StatBox>
                <StatBox icon={4} i18nKey="missionOfflineCount" label="จำนวน Offline ภารกิจ" textClassName="text text-gray">
                  {count("offline")} {missionWord}
                </StatBox>
              </div>
              <div className="main-content-mission" ref={scrollRef}>
                <div className="main-content-mission-inner">
                  {missions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onToggle={(checked) => toggleStatus(mission, checked)}
                      onEdit={() => editMission(mission)}
                      onDelete={() => deleteMission(mission)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {popupAlertHolder}
      {popupAlertSecondHolder}
    </div>
  );
}

function StatBox({
  icon,
  i18nKey,
  label,
  textClassName,
  children,
}: {
  icon: number;
  i18nKey: string;
  label: string;
  textClassName: string;
  children: ReactNode;
}) {
  const t = useT();
  return (
    <div className="custom-box">
      <div className="group-content-title">
        <img src={`/assets/images/mission/icon-mission-statement-${icon}.png`} />
        <h5 className="mission-page" data-i18n={`missionPage.${i18nKey}`}>
          {t(`missionPage.${i18nKey}`, label)}
        </h5>
      </div>
      <p className={textClassName}>{children}</p>
    </div>
  );
}

function RewardIcons({ icon, rewards }: { icon: string; rewards: string[] }) {
  return rewards.map((reward, index) => (
    <div key={index} className="mission-item-reward-icon">
      <img src={icon} />{" "}
      <span>{reward}</span>
    </div>
  ));
}

type MissionCardProps = {
  mission: MissionListItem;
  onToggle: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
};

function MissionCard({ mission, onToggle, onEdit, onDelete }: MissionCardProps) {
  const t = useT();
  return (
    <div className={cx("box-content-mission", mission.status !== "online" && mission.status)}>
      <div className="box-content-mission-header">
        <div className="group-header-mission">
          <img className="img-header-mission group-disable" src={mission.cover} />{" "}
          <div className="box-title-mission group-disable">
            <div className="box-title-mission-text">
              <span className="text-title-mission">{mission.name}</span>
              <span className="text-sub-mission">
                {mission.subCount}{" "}
                <span className="mission-page" data-i18n="missionPage.subMission">
                  {t("missionPage.subMission", "ภารกิจย่อย")}
                </span>
              </span>
            </div>
            <div className="box-title-mission-date">
              <img src="/assets/images/mission/icon-clock.png" />
              <span>{mission.dates}</span>
            </div>
          </div>{" "}
          <div className="box-mission-status">
            <span>{mission.status}</span>
          </div>
        </div>
      </div>
      <div className="box-content-mission-body">
        <div className="box-content-mission-body-header">
          <div className="group-header-mission-status-switch">
            <div className="mission-switch-btn">
              <input
                className="mission-switch-check-input"
                type="checkbox"
                checked={mission.enabled}
                onChange={(event) => onToggle(event.target.checked)}
              />
            </div>
            <span className="mission-page" data-i18n="missionPage.onOff">
              {t("missionPage.onOff", "เปิด/ปิด")}
            </span>
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
        <div className="group-mission-data">
          <div className="group-header-mission-body">
            <h5 className="mission-page" data-i18n="missionPage.missionReward">
              {t("missionPage.missionReward", "รางวัลเมื่อทำภารกิจย่อยสำเร็จ")}
            </h5>
          </div>
          <div className="group-header-mission-body-reward">
            <div className="mission-item-reward-group">
              <RewardIcons icon={mission.rewardIcon} rewards={mission.rewards} />
            </div>
          </div>
          <div className="group-header-mission-body">
            <h5 className="mission-page" data-i18n="missionPage.missionCondition">
              {t("missionPage.missionCondition", "เงื่อนไขภารกิจ")}
            </h5>
          </div>
          <div className="mission-body-condition">
            {/* Empty description: the original's <p> still holds one non-breaking space (4×32 px on staging) */}
            <p>{mission.condition || "\u00A0"}</p>
          </div>
          {mission.subMissions.map((sub) => (
            <SubMissionSummary key={sub.no} icon={mission.rewardIcon} sub={sub} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SubMissionSummary({ icon, sub }: { icon: string; sub: MissionListItem["subMissions"][number] }) {
  const t = useT();
  return (
    <>
      <div className="group-header-mission-body">
        <h5>
          <span className="mission-page" data-i18n="missionPage.subMissionNo">
            {t("missionPage.subMissionNo", "ภารกิจย่อยที่")}
          </span>{" "}
          {sub.no}
        </h5>
      </div>
      <div className="mission-body-detail-per-mission">
        <div className="mission-body-detail-per-mission-text">
          {sub.text}
          <br />
        </div>
        <div className="group-header-mission-body-reward">
          <div className="mission-item-reward-group">
            <div className="mission-item-reward">
              <RewardIcons icon={icon} rewards={sub.rewards} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
