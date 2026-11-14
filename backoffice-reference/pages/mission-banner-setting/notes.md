# mission-banner-setting — /mission/banner-setting (ตั้งค่าแบนเนอร์ภารกิจ)

Reached from "อัพโหลดแบนเนอร์" in the /mission header. `#layout-wrapper` class `""`; `.page-content.mission-banner-setting`. Common CSS + IBM-Plex-Sans-Thai.css + mission.css.
Page script `/js/scriptmission-banner-setting.js` (+ list.js, list.pagination.js) — NOT in `legacy-js/` (not downloaded).

## Structure
- Header row 1: title + breadcrumb (รายชื่อภารกิจ > ตั้งค่าแบนเนอร์ภารกิจ). No header buttons.
- Header row 2 (`.group-title-header-second`): 32px mission icon + "ตั้งค่าแบนเนอร์ภารกิจ"; right: switch `#enableMissionAutoSlide` "สไลด์ออร์โต้" (`changeAutoSlideBannerMission()` — saves immediately, NOT clicked) and `button.mission-btn` "เพิ่มรูปแบนเนอร์" (`addTemplateBannerMissionBtn()`).
- `#customBannerMissionDraggable.main-banner-mission`: draggable cards `.menu-item.card-banner-mission[data-banner=N]`; class `banner-disable` = read-only (inputs dimmed, confirm button grey). Each card: left drag handle strip (`.banner-mission-menu-dragger`, `/assets/images/minigame/dragger-icon.svg`), teal gradient title bar "รูปแบนเนอร์ N" with edit (yellow, `icon-file.png`) / delete (red, `icon-trash.png`) buttons; body = banner image (574×286 ratio) | upload column (label + file input, hint, checkbox "แสดงแบนเนอร์ที่หน้ารวมภารกิจ") | link column (2 radios: เมนูภายในภารกิจ → CustomDropdown `.dropdownSelectMenuMission`; กำหนด URL → text input) + footer ยกเลิก / ยืนยัน.

## Interactive elements
- Edit icon `editTemplateBannerMission(N)`: client-side only — removes `banner-disable` from the card (verified from function body: `removeClass('disable')`). Captured: `modals/banner-1_edit-mode_zoom.png`.
- Cancel `cancelBannerMission(N)`: client-side, re-adds `banner-disable`.
- Menu dropdown (CustomDropdown, single): options ทำภารกิจ / ประวัติรับรางวัล / แลกรางวัล / each active mission name (chip `mission-info`, value = mission id). Open state: `modals/banner-1_edit-mode_menu-dropdown-open.html` + `.jpg` + `.styles.json` (dropdown is positioned with inline top/left/width/max-height, toggler gets `.toggled`, list `.custom-dropdown.show`).
- "เพิ่มรูปแบนเนอร์": prepends a new card N+1 in edit mode with default image `https://cdn.lsmloyalty.com/images/mission/banner/default.png`, nothing selected, checkbox off, placeholder "เลือกเมนูในเว็บ" (`.dropdown-wrapper.empty`). No request sent until ยืนยัน. Captured: `modals/banner-new_after-add-button.html` + `.jpg`. Page was reloaded afterwards to discard it.
- NOT clicked: delete (`deleteTemplateBannerMission(N)`), ยืนยัน (`saveBannerMission(N)`), auto-slide switch, file inputs, drag-reorder.

## Network (observed)
- GET /mission/get-mission-banner-auto-slide
- GET /mission/get-mission-banner
- GET /mission/get-mission-banner-url (once per card dropdown init)
- /api/agent/get-credit-agent, /sms/get-credit (shell)
