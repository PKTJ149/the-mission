# Stylesheets & document attributes (captured 2026-11-14, staging superx)

All pages share the same `<html>` attributes and an attribute-less `<body>`:

```html
<html lang="en" data-layout="vertical" data-topbar="light" data-sidebar="dark" data-sidebar-size="lg" data-sidebar-image="none" data-preloader="disable">
<body>
```
`#layout-wrapper` class: `""` on mini-game pages and /mission; **`layout-mission-report`** on mission-report-member, mission-report-mission, mission-redeem-points and minigame-deposit-check. Collapsed sidebar adds `close-menu close-menu-js` (see shell/).
Query strings (`?v=…` cache busters) were removed from all captured URLs.

## Common head order (every page)
1. https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css
2. /assets/libs/swiper/swiper-bundle.min.css
3. /assets/libs/jsvectormap/css/jsvectormap.min.css
4. https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css
5. /assets/css/bootstrap.min.css
6. /assets/css/material.icons.min.css
7. /assets/css/material.app.min.css
8. /assets/css/custom.min.css
9. inline `<style>` (375 chars):
```css
:root {
    --lsm-legacy-icon-next-bank: url("https://p88.blob.core.windows.net/images/default/icon-next-bank.png");
    --lsm-legacy-icon-forword-bank: url("https://p88.blob.core.windows.net/images/default/icon-forword-bank.png");
    --lsm-legacy-dash-board-title-v3: url("https://p88.blob.core.windows.net/images/default/dash-board-title-v3.webp");
}
```
10. /css/base.css

## Page-specific (appended after base.css, in this order)
| Page | Extra stylesheets after base.css |
|---|---|
| minigame-settings `/promotion/mini-game-v2` (also `/`) | /lib/ckeditor5-default/styles.css, /lib/as-color-picker/css/asColorPicker.min.css, /lib/as-color-picker/css/style.css, inline style A (2570 chars, below), inline CKEditor runtime style (190,803 chars, `data-cke="true"`) |
| minigame-report `/report/promotion/minigame` | inline style B (217 chars) |
| minigame-history `/promotion/minigame/history` | inline style B (217 chars) |
| minigame-deposit-check `/promotion/minigame/minigame-period-deposit` | /css/fonts/IBMPlexSansThai/IBM-Plex-Sans-Thai.css, /css/style/mission.css |
| mission-settings `/mission` | IBM-Plex-Sans-Thai.css, /css/style/mission.css, /lib/ckeditor5-default/styles.css, inline style C (818 chars), CKEditor runtime style |
| mission create/edit `/mission/setting` | /lib/as-color-picker/css/asColorPicker.min.css, IBM-Plex-Sans-Thai.css, mission.css, /lib/ckeditor5-default/styles.css, inline (698 chars, not captured — similar to C), CKEditor runtime style |
| mission-report-member `/mission/report` | IBM-Plex-Sans-Thai.css, mission.css |
| mission-report-mission `/mission/report-mission` | IBM-Plex-Sans-Thai.css, mission.css |
| mission-redeem-points `/mission/redeem-points` | IBM-Plex-Sans-Thai.css, mission.css, /lib/ckeditor5-default/styles.css, CKEditor runtime style |

The CKEditor runtime `<style data-cke="true">` is injected by `/lib/ckeditor5-default/build/ckeditor.js` at runtime — do not copy it; load ckeditor.js and it will appear (it was not transferred, 190 KB).

### Inline style A (minigame-settings)
```css
.ck.ck-editor__main > .ck-editor__editable { border-color: #545454 !important; }
input[type="radio"] { width: 24px; height: 24px; }
.form-check-input-custom-mini-game { width: 20px; height: 20px; }
.form-check-input.form-check-input-custom-mini-game:checked[type="checkbox"] {
    background: #50A198;
    /* ONE LINE WITHHELD by the browser tool output filter here — almost certainly a
       background-image: url("data:image/svg+xml,…") check-mark. Recover from the legacy view or use Bootstrap's default check SVG. */
}
:root {
    --color-bg-main: rgba(0, 0, 0, 0.36);
    --color-bg-in-box-mini-game: rgba(0, 0, 0, 0.36);
    --color-font-header-main-group-1: #FFFFFF;
    --color-font-header-secondary-group-1: #FFE666;
    --color-font-message-main-group-1: #E9E9E9;
    --color-font-message-secondary-group-1: #AB8B4D;
    --color-font-highlights-group-1: linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%);
    --color-font-count-down-group-1: #EB3333;
    --color-btn-bg-group-2: linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%);
    --color-btn-message-group-2: #1E1E1E;
    --color-btn-border-group-2: #000000;
    --color-display-bg-group-2: #151515;
    --color-display-border-group-2: linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%);
    --color-table-th-bg-group-3: linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%);
    --color-table-th-font-group-3: #202020;
    --color-table-th-border-group-3: linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%);
    --color-pagination-font-active-group-3: #000000;
    --color-pagination-font-in-active-group-3: #E9E9E9;
    --color-pagination-bg-active-group-3: #FFE666;
    --color-pagination-bg-in-active-group-3: transparent;
    --color-pagination-arrow-active-group-3: #FFE666;
    --color-pagination-arrow-in-active-group-3: #A8A8A8;
    --color-table-td-bg-1-group-3: #000000;
    --color-table-td-bg-2-group-3: #FFFFFF;
    --color-table-td-font-group-3: #E9E9E9;
    --color-table-td-font-highlights-1-group-3: #F10000;
    --color-table-td-font-highlights-2-group-3: #72DCD9;
    --color-table-td-border-group-3: #E9E9E9;
}
```

### Inline style B (minigame-report, minigame-history)
```css
.main-content { height: 100vh; }
.page-content { height: calc(100% - 72px - 1.5rem); padding-bottom: 0; box-sizing: content-box; }
```

### Inline style C (/mission) — 4 rules (CSSOM order)
```css
.ck.ck-editor__main > .ck-editor__editable { border-color: rgb(84, 84, 84) !important; }
/* rule 2 withheld by tool filter (probably input[type="radio"]{width:24px;height:24px}) */
.form-check-input-custom-mini-game { width: 20px; height: 20px; }
/* rule 4 withheld by tool filter (checked custom checkbox: background #50A198 + check-mark background-image) */
```

## Fonts / other assets loaded (from network log)
NotoSansThai Regular/Medium/SemiBold/Bold .ttf, NotoSerifThai Regular/Medium/Bold .ttf (/assets/fonts/…), remixicon.woff2, IBM Plex Sans Thai woff2 400/500/600/700 (/css/fonts/IBMPlexSansThai/), /assets/images/bg-minigame-oper.png, /assets/images/sidebar/img-1..4.jpg, menu icons /assets/images/menu/*.svg, logo /assets/images/menu/logo-dark.png.
Scripts (order on /mission/redeem-points): /assets/js/layout.js (head), bootstrap.bundle.min.js, simplebar.min.js, waves.min.js, feather.min.js, lord-icon-2.1.0.js, plugins.js, prism.js, /js/base.js, /js/operator.js, /js/helper.js, i18next(+http backend, language detector, jquery-i18next), /js/i18n.js, sweetalert2.min.js, /js/table.js, ckeditor.js, /js/scriptmission.js, choices.min.js, flatpickr.min.js.

## Round 2 pages (stylesheet order after the common 10)
| Page | `#layout-wrapper` class | Extra stylesheets after base.css | Page scripts (after the common set) |
|---|---|---|---|
| mission-agent-setting `/mission/agent-setting` | `""` | /css/fonts/IBMPlexSansThai/IBM-Plex-Sans-Thai.css, /css/style/mission.css | list.min.js, list.pagination.min.js, /js/scriptmission-agent-setting.js (+3 small inline) |
| mission-banner-setting `/mission/banner-setting` | `""` | IBM-Plex-Sans-Thai.css, mission.css | list.min.js, list.pagination.min.js, /js/scriptmission-banner-setting.js |
| mission-history `/mission/mission/history` | `""` | **inline style D (703 chars, below) only — no mission.css, no IBM Plex** | /lib/cleave.js/cleave.min.js, /js/table.js, /js/moment.js (+ inline page logic) |
| mission-report-member-detail `/mission/report-mission-member-detail/<n>` | `layout-mission-report` | IBM-Plex-Sans-Thai.css, mission.css | sweetalert2.min.js, /js/table.js |
| mission-report-mission-detail-by-mission / by-reward / by-member | `layout-mission-report` | IBM-Plex-Sans-Thai.css, mission.css | sweetalert2.min.js, /js/table.js |
| minigame-report-detail (same URL as minigame-report) | `""` | inline style B | as minigame-report |
Common scripts on all round-2 pages (in order): layout.js (head), jquery 3.6.4 (cdnjs), bootstrap.bundle, simplebar, waves, feather, lord-icon-2.1.0, plugins.js, toastify-js (jsdelivr), choices.min.js, flatpickr.min.js, prism.js, select2 4.1.0-rc.0, /js/base.js, /js/operator.js, /js/helper.js, i18next (+http backend, language detector, jquery-i18next), /js/i18n.js.

### Inline style D (mission-history) — CSSOM order
```css
.main-content { height: 100vh; }
.page-content { height: calc(100% - 72px - 1.5rem); padding-bottom: 0px; box-sizing: content-box; }
.flex { display: flex; }
.title-header { font-size: 16px; line-height: 26px; color: rgb(233, 233, 233); }
.title-margin { margin-left: 24px; }
.title-header img { width: 24px; height: 24px; }
.title-header span { color: rgb(114, 220, 217); }
.font-set { font-family: "Noto Sans Thai" !important; }
```
Per-element inline style VALUES for the key files are now in `*.styles.json` next to each HTML file (see INVENTORY "Round 2").
