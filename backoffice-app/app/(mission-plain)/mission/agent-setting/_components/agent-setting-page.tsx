"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img>, often without alt */

import { useState } from "react";
import { useCustomPopupAlert } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { DEFAULT_AGENT_ICON, type MissionAgentSetting } from "@/lib/api/missions";
// Bootstrap-style collapse shared with the mission form
import { AccordionHeader, Collapse } from "@/app/(mission-form)/mission/setting/_components/collapse";

// /mission/agent-setting — script /js/scriptmission-agent-setting.js was not captured.
// Switches, icon preview and reset are client-side; save shows the missionPage.js.*Agent* feedback only.
export function AgentSettingPage({ initialAgents }: { initialAgents: MissionAgentSetting[] }) {
  const t = useT();
  const [agents, setAgents] = useState(initialAgents);
  const [open, setOpen] = useState(true);
  const [popupAlert, popupAlertHolder] = useCustomPopupAlert();
  const [popupAlertSecond, popupAlertSecondHolder] = useCustomPopupAlert();

  const on = agents.filter((a) => a.enabled).length;
  const update = (index: number, patch: Partial<MissionAgentSetting>) =>
    setAgents((list) => list.map((a, i) => (i === index ? { ...a, ...patch } : a)));

  // saveMissionAgent() — local only
  const save = async () => {
    const result = await popupAlert.show({
      title: t("missionPage.js.confirmAgent", "ยืนยันบันทึกการตั่งค่า Agent หรือไม่ ?"),
      type: "edit",
      message: t("missionPage.js.confirmAgentMsg", "การบันทึกการตั่งค่า Agent ส่งผลต่อภารกิจของสมาชิกที่ยังทำไม่สำเร็จ"),
      needConfirmation: true,
    });
    if (result !== "confirmed") return;
    await popupAlertSecond.show({
      title: t("missionPage.js.agentPass", "บันทึกการตั่งค่า Agent สำเร็จ !"),
      type: "success",
      message: t("missionPage.js.agentPassMsg", "ระบบได้ทำการตั่งค่า Agent ตามการตั้งค่าของคุณ เรียบร้อยแล้ว"),
      needConfirmation: false,
    });
  };

  return (
    <div className="page-content mission-agent-setting">
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
                  <h4 className="mb-0 mission-page" data-i18n="missionAgentPage.missionSetting">
                    {t("missionAgentPage.missionSetting", "ตั้งค่าภารกิจ")}
                  </h4>
                  <div className="group-title-header-path">
                    <img src="/assets/images/mission/icon-mission.png" width="24" height="24" />
                    <span className="mission-page" data-i18n="missionAgentPage.missionListName">
                      {t("missionAgentPage.missionListName", "รายชื่อภารกิจ")}
                    </span>
                    &gt;{" "}
                    <span className="text-teal-green mission-page" data-i18n="missionAgentPage.agentSetting">
                      {t("missionAgentPage.agentSetting", "ตั้งค่าการจัดการ Agent")}
                    </span>
                  </div>
                </div>
                <div className="group-btn">
                  <a className="mission-btn-outline" href="/mission/mission/history">
                    <img src="/assets/images/mission/icon-time-past.png" alt="history" width="24" height="24" />
                    <span className="mission-page" data-i18n="missionAgentPage.history">
                      {t("missionAgentPage.history", "ประวัติการแก้ไข")}
                    </span>
                  </a>
                  <a className="mission-btn" href="/mission/setting">
                    <img src="/assets/images/mission/icon-add-mission-btn.png" alt="สร้างภารกิจ" width="20" height="20" />
                    <span className="mission-page" data-i18n="missionAgentPage.createMission">
                      {t("missionAgentPage.createMission", "สร้างภารกิจ")}
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="group-content-page">
              <div className="main-content-setting-mission" id="dropdownMainMissionSetting">
                <div className="dropdown-main">
                  {/* ORIGINAL: onclick="validateMission1()" — not defined on this page (harmless error) */}
                  <AccordionHeader open={open} target="openDropdownMissionSetting1" onToggle={() => setOpen(!open)}>
                    <div className="group-title-mission-setting">
                      <span className="title-mission-setting mission-page" data-i18n="missionAgentPage.agentSetting">
                        {t("missionAgentPage.agentSetting", "ตั้งค่าการจัดการ Agent")}
                      </span>
                      <div className="group-mission-setting-status-control">
                        <div className="group-status-control">
                          <span className="mission-setting-status-count-on-title mission-page" id="missionAgentStatusOn">
                            เปิดใช้งาน {on} Agents
                          </span>
                          <span className="mission-setting-status-count-off-title mission-page" id="missionAgentStatusOff">
                            ปิดใช้งาน {agents.length - on} Agents
                          </span>
                        </div>
                        <img src="/assets/images/mission/icon-arrow-down.png" width="32" height="32" className="icon-arrow-down" />
                      </div>
                    </div>
                  </AccordionHeader>
                  <Collapse open={open} className="box-content-mission-setting" id="openDropdownMissionSetting1" data-bs-parent="#dropdownMainMissionSetting">
                    <div className="group-content-mission-setting-agent" id="rootScrollMission">
                      <div className="label-title">
                        <span className="text-in-label mission-page" data-i18n="missionAgentPage.missionSettingWhenFinished">
                          {t("missionAgentPage.missionSettingWhenFinished", "ตั้งค่าการเสร็จสิ้นภารกิจ")}
                        </span>
                        <span className="sub-title-text mission-page" data-i18n="missionAgentPage.missionSettingWhenFinishedText">
                          {t(
                            "missionAgentPage.missionSettingWhenFinishedText",
                            "เมื่อเปิดการใช้งานแต่ละ Agent ใบหวยนี้จะแสดงให้เห็นได้ที่หน้าเล่นของ Agent นั้น ๆ และสมากชิกใช้งานได้ตามปกติ",
                          )}
                        </span>
                      </div>
                      <div className="group-mission-agent-box" id="missionAgentBox">
                        {agents.map((agent, index) => (
                          <AgentItem key={agent.tenantId} agent={agent} no={index + 1} onChange={(patch) => update(index, patch)} />
                        ))}
                      </div>
                    </div>
                  </Collapse>
                </div>
                <div className="group-btn-mission-setting-footer">
                  <a className="mission-btn-outline" href="/mission">
                    <img src="/assets/images/mission/icon-cancel-save.png" alt="cancel" width="20" height="20" />
                    <span className="mission-page" data-i18n="missionAgentPage.cancel">
                      {t("missionAgentPage.cancel", "ยกเลิก")}
                    </span>
                  </a>
                  <button className="mission-btn" id="btnSaveMission" onClick={save}>
                    <img src="/assets/images/mission/icon-confirm-save.png" alt="confirm" width="20" height="20" />
                    <span className="mission-page" data-i18n="missionAgentPage.confirm">
                      {t("missionAgentPage.confirm", "ยืนยันการสร้างภารกิจ")}
                    </span>
                  </button>
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

// One agent card (cloned from template#missionAgentItemTemplate on the original)
function AgentItem({ agent, no, onChange }: { agent: MissionAgentSetting; no: number; onChange: (patch: Partial<MissionAgentSetting>) => void }) {
  const t = useT();
  return (
    <div className="group-mission-agent-item" data-agent={no} id={`missionAgentItem-${no}`}>
      <input type="hidden" id={`missionAgentTenantId-${no}`} value={agent.tenantId} />
      <div className="group-switch">
        <div className="mission-switch-btn">
          <input
            className="mission-switch-check-input"
            type="checkbox"
            id={`missionAgentStatus-${no}`}
            checked={agent.enabled}
            onChange={(event) => onChange({ enabled: event.target.checked })}
          />
        </div>
        <span className="switch-title1" id={`missionAgentNumber-${no}`}>
          Agent {no} :{" "}
        </span>
        <span className="switch-title2 mission-page" id={`missionAgentName-${no}`}>
          {agent.name}
        </span>
      </div>
      <span className="box-text mission-page" data-i18n="missionAgentPage.agentIconSetting">
        {t("missionAgentPage.agentIconSetting", "กำหนดรูป icon เมนูที่หน้าเล่นสำหรับ Agent นี้")}
      </span>
      <div className="group-preview-agent-icon">
        <div className="box-preview-agent-icon">
          <img src={agent.icon} alt="icon Agent" width="50" height="50" className={`inputFileIconAgent-${no}`} />
        </div>
        <div className="box-preview-agent-text">
          <span className="text-label-bold-agent mission-page" data-i18n="missionAgentPage.agentIconText">
            {t("missionAgentPage.agentIconText", "อัพโหลดไอคอนเมนูหน้าเล่น")}
          </span>
          <span className="text-p3-regular text-example mission-page" data-i18n="missionAgentPage.agentIconRec">
            {t("missionAgentPage.agentIconRec", "ขนาดไอคอนที่แนะนำ : 128px x 128px และนามสกุลไฟล์ png, jpg และ gif เท่านั้น")}
          </span>
        </div>
        <div className="group-btn-agent-icon">
          {/* resetImageIconAgent('N'): back to the default icon */}
          <span
            className="change-color-mission-link mission-page"
            data-i18n="missionAgentPage.resetDefault"
            id={`resetImageIconAgent-${no}`}
            onClick={() => onChange({ icon: DEFAULT_AGENT_ICON })}
          >
            {t("missionAgentPage.resetDefault", "คืนค่าเริ่มต้น")}
          </span>
          <label className="mission-btn-outline" htmlFor={`inputFileIconAgent-${no}`}>
            {/* handleFileMission(event): local preview only, nothing is uploaded */}
            <input
              type="file"
              id={`inputFileIconAgent-${no}`}
              className="d-none"
              name={`inputFileIconAgent-${no}`}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onChange({ icon: URL.createObjectURL(file) });
                event.target.value = "";
              }}
            />
            <img src="/assets/images/mission/image-upload.png" alt="add icon" width="20" height="20" />
            <span className="mission-page" data-i18n="missionAgentPage.uploadImage">
              {t("missionAgentPage.uploadImage", "อัพโหลดรูป")}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
