# mission-agent-setting — /mission/agent-setting (ตั้งค่าการจัดการ Agent)

Reached from the gear button (`a.mission-btn-outline.btn-settings`, icon `/assets/images/mission/icon-settings.png`) in the /mission header.
Layout: `#layout-wrapper` class `""`; `.page-content.mission-agent-setting`. Common CSS + IBM-Plex-Sans-Thai.css + mission.css (no inline page style).
Page script: `/js/scriptmission-agent-setting.js` (+ list.js, list.pagination.js) — NOT in `legacy-js/` (not downloaded, per round-2 rules).

## Structure
- Header: title "ตั้งค่าภารกิจ" + breadcrumb (`icon-mission.png` รายชื่อภารกิจ > **ตั้งค่าการจัดการ Agent** in teal); buttons ประวัติการแก้ไข (→ /mission/mission/history) and สร้างภารกิจ (→ /mission/setting). No banner/gear buttons here.
- One collapsible section (`#dropdownMainMissionSetting` → `.dropdown-mission-setting` header with Bootstrap `data-bs-toggle="collapse"` → `#openDropdownMissionSetting1.collapse.show`). Header shows on/off counts (`#missionAgentStatusOn` teal, `#missionAgentStatusOff` red) + `icon-arrow-down.png` (rotates). The header's `onclick="validateMission1()"` refers to a function that is not defined on this page (harmless error).
- Agent cards are cloned by JS from `template#missionAgentItemTemplate` into `#missionAgentBox` (2-column grid). Each: on/off switch `#missionAgentStatus-N` (`.mission-switch-check-input`), "Agent N : " + teal agent name, icon preview box (50×50 img, default `https://cdn.lsmloyalty.com/images/mission/icon/Vector.png`), upload label → hidden file input `#inputFileIconAgent-N` (`handleFileMission(event)`), yellow underlined link "คืนค่าเริ่มต้น" (`resetImageIconAgent('N')`, restores default icon client-side).
- Footer: ยกเลิก (→ /mission), ยืนยันการสร้างภารกิจ `#btnSaveMission` (`saveMissionAgent()`).

## Interactive elements (what they do)
- Section header click: collapse/expand (screenshots 02/03).
- Switch: toggles agent enabled state in the form (not clicked — toggles forbidden). Counts update client-side.
- Upload / reset: change the preview icon (not clicked — file upload forbidden; reset not clicked).
- Save: posts the agent settings (not clicked).

## Network (observed on load)
- GET /mission/get-mission-agent-setting (fills the agent cards)
- /api/agent/get-credit-agent, /sms/get-credit (shell, same as other pages)
- Save endpoint unknown (not clicked; script not downloaded).
