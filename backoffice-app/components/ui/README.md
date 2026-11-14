# Shared UI primitives (`components/ui`)

React versions of the original back office widgets (legacy `helper.js`, `table.js`, `scriptmission.js`,
Bootstrap 5.2, select2 4.1, flatpickr 4.6.13, CKEditor 5 build, asColorPicker). Each one renders the
**original DOM and class names**, so the original CSS in `public/` styles it unchanged. Nothing here
saves data: confirm buttons only call your callbacks.

Import from the barrel: `import { FilterDropdown, Pagination, useCustomSweetAlert } from "@/components/ui";`
Everything except `icons.tsx`, `cx.ts` and `ckeditor-config.ts` is a client component, so use them from
your page's `"use client"` components. See them all live at **`/dev/components`** (mini-game CSS) and
**`/dev/components/mission`** (mission form CSS) while `npm run dev` runs.

---

## Contract for page agents

**Where your files go**

| What | Where |
| --- | --- |
| The page | the existing stub `app/(<group>)/<original URL>/page.tsx` (keep it a server component; put `export const metadata = { title: "…" }` there) |
| Page-only components | next to it, in `app/(<group>)/<original URL>/_components/*.tsx` (`_` = not a route) |
| Mock data / data functions | `lib/mock/<page>.ts` + `lib/api/<page>.ts` (scaffold pattern) |

Route groups (each is its own root layout = its own `<head>`; do not move pages between them):

| Group | URLs | `#layout-wrapper` class | Extra CSS after base.css |
| --- | --- | --- | --- |
| `(minigame-settings)` | `/`, `/promotion/mini-game-v2`, `/dev/components` | `""` | ckeditor styles, asColorPicker ×2, inline style A |
| `(minigame-reports)` | `/report/promotion/minigame`, `/promotion/minigame/history` | `""` | inline style B |
| `(mission-reports)` | `/promotion/minigame/minigame-period-deposit`, `/mission/report`, `/mission/report-mission` | `layout-mission-report` | IBM Plex, mission.css |
| `(mission-settings)` | `/mission` | `""` | IBM Plex, mission.css, ckeditor styles, inline style C |
| `(mission-form)` | `/mission/setting`, `/dev/components/mission` | `""` | asColorPicker.min.css, IBM Plex, mission.css, ckeditor styles, inline (C) |
| `(mission-redeem)` | `/mission/redeem-points` | `layout-mission-report` | IBM Plex, mission.css, ckeditor styles |
| `(mission-plain)` | `/mission/agent-setting`, `/mission/banner-setting` | `""` | IBM Plex, mission.css |

**What the shell already renders** (don't repeat it): `<html>`/`<head>` with every stylesheet in the
original order, `#layout-wrapper`, sidebar + collapse arrow + THA/ENG switcher, the two
`.vertical-overlay`s, `.main-content` with the Logout chip, `#back-to-top`, `#preloader`,
`#hiddenRole`, `.swal-backdrop`, the lord-icon script, and on CKEditor pages the CKEditor script.

**Your page renders** what `page.html` starts with: `<div className="page-content">…</div>`, followed
by the page-level hidden things that sit in `.main-content` on the original (modals, offcanvases, hidden inputs).

**Rules**

- Don't edit `app/(*)/layout.tsx`, `components/shell/*`, `components/ui/*`, `lib/i18n/*` or anything in
  `public/`. If a primitive is missing a feature, report it to the shell owner instead of forking it.
- Links to other back-office pages: plain `<a href="/mission">` (not `next/link`) — the original is a
  multi-page site and different groups need a full page load anyway.
- Text: `const t = useT(); t("minigameSetting.title", "ตั้งค่ามินิเกมส์")` — always pass the captured Thai
  as the fallback so the server HTML already shows Thai (the dictionary loads in the browser).
- Copy class names, ids, element order and `data-*` attributes from the capture. Inline style values
  were not captured; recover them from screenshots / `page.styles.json` / legacy JS.
- Dynamic routes (e.g. `/mission/report-mission-member-detail/[memberId]`) must export
  `generateStaticParams` — the sidebar reads `usePathname()` without a Suspense boundary.

---

## Dialogs

All overlays use a small **control** object from a hook (`open()/close()` or `show()/hide()`) plus a
component that renders the markup. Promise-based ones (`useCustomSweetAlert`, `useCustomPopupAlert`,
`useToast`) return `[api, holder]`: render `{holder}` once anywhere in your component.

### `useCustomSweetAlert()` → `[swal, swalHolder]`

Re-creates `CustomSweetAlert` (helper.js:3527): portals `div.system-swal > .swal-wrapper > .swal-content`
(`.swal-close`, `img.swal-banner`, `img.swal-avatar`, `.swal-inner` with `h4.swal-title`, `p.swal-text.p3`,
`.swal-custom`, `.swal-btns` with `.swal-btn-cancel.btn.system-btn.btn-a.btn-rounded` and
`.swal-btn-confirm.btn.system-btn.btn-rounded`) into `<body>`. Opens with the shared `.swal-backdrop`,
`animate__bounceIn` / `animate__bounceOut`, body scroll locked, closes on backdrop click.

`swal.open(options): Promise<{ dismiss, isConfirmed? }>` — `dismiss` is `"confirm" | "cancel" | "close" | "backdrop" | "timeout" | "closeImmediately"`.

| option | default | note |
| --- | --- | --- |
| `type` | `null` | `"saving" \| "success" \| "danger" \| "loading"` → `/assets/images/swal/banner-{type}.png` + `icon-{type}.png` |
| `title`, `text`, `customHtml` | — | ReactNode |
| `titleColor`, `textColor` | danger `#F64646`, success `#00C17C` | |
| `bannerSrc`, `avatarSrc` | — | override the type images |
| `showConfirmButton`, `showCancelButton` | `true` | one button only → centred |
| `confirmText`, `cancelText` | `"ยืนยัน"`, `"ยกเลิก"` | the "close only" alerts use `showConfirmButton: false, cancelText: "ปิดหน้าต่าง"` |
| `closeOnBackdrop` | `true` | |
| `timer` | `0` | ms |
| `onConfirm` | — | original `ajaxConfirm`: shows the loading body (lord-icon save-file.json + Thai text) while it runs; return `true` to keep it open |
| `loadingOnConfirm` | `true` | |

`swal.close()`, `swal.renderLoading()` also exist.

```tsx
const [swal, swalHolder] = useCustomSweetAlert();
const save = async () => {
  const { isConfirmed } = await swal.open({ type: "saving", title: "ยืนยันการสร้างข้อมูลมินิเกมส์หรือไม่ ?", text: "…",
    onConfirm: () => new Promise((r) => setTimeout(r, 1000)) }); // mock "saving"
  if (isConfirmed) await swal.open({ type: "success", title: "บันทึกการสร้างข้อมูลมินิเกมส์ สำเร็จ !", showConfirmButton: false, cancelText: "ปิดหน้าต่าง" });
};
return <>{/* page */}{swalHolder}</>;
```

### `useCustomModal()` + `<CustomModal>`

Re-creates `CustomModal` (helper.js:4081): `div.system-modal(.popup-wrapper.show) > .modal-wrapper > .modal-container(.animate__bounceIn) > .modal-close` + your children. Same backdrop/animation as the swal; only one popup is open at a time (opening another closes the previous one instantly, like the original `Popup`).

Props: `control` (from the hook), `id`, `wrapperClassName` (extra `.modal-wrapper` classes, e.g. `modal-wrapper-custom-width`), `children` = the captured banner/avatar `<img>`s and `.modal-inner`.
Hook options: `closeOnBackdrop` (default `true`), `onClosed(reason)`. Control: `open()`, `close()`, `isOpen`.

```tsx
const modal = useCustomModal();
<CustomModal control={modal} id="modalConfirmChangeStatus">
  <img draggable="false" className="modal-banner" src="/assets/images/swal/banner-saving.png" alt="" />
  <img id="changeStatusAvatar" draggable="false" className="modal-avatar" src="/assets/images/swal/status-chang.png" alt="" />
  <div className="modal-inner">… <button className="btn system-btn btn-a btn-rounded" onClick={() => modal.close()}>ยกเลิก</button></div>
</CustomModal>
```

### `useCustomPopupAlert()` → `[popupAlert, popupAlertHolder]` (mission pages)

Re-creates `CustomPopupAlert` (scriptmission.js:1): portals into `.main-content`
`div.system-popup-alert > .system-popup-alert-content > .system-popup-alert-content-header h4` +
`.system-popup-alert-content-inner` (`.system-popup-alert-content-inner-text` with
`img /assets/images/mission/system-popup-alert/icon-{type}.png` + `p`) + `.system-popup-alert-btns(.confirm)`
(`button.mission-btn-outline.system-popup-alert-btn-cancel` "Cancel", `button.mission-btn.system-popup-alert-btn-confirm` "Confirm"/"Edit"/"Close").
Show = classes `show animate-in` 10 ms after insert; hide = `animate-out`, removed after 800 ms.

`popupAlert.show({ title, type, message, needConfirmation?, loading?, loadingId? }): Promise<"confirmed" | "cancelled">`
(`type`: `on | off | delete | error | success | edit`). Difference from the original: Cancel **resolves** `"cancelled"` instead of rejecting.
With `loading: true` the Confirm click does not close it; call `popupAlert.hide(true)` when your mock work is done.

```tsx
const [popupAlert, popupAlertHolder] = useCustomPopupAlert();
const result = await popupAlert.show({ title: t("missionPage.js.confirmDelete"), type: "delete", message: t("missionPage.js.confirmDeleteMsg"), needConfirmation: true });
```

### `useSystemPopup()` + `<SystemPopup>` (mission `.system-popup`, e.g. `#redeemModal`)

Renders `div.system-popup.{className}` with your children (`.system-popup-content > header / inner / .system-popup-btns`, as captured).
Opening script was not captured: driven like CustomPopupAlert — `open()` sets `show animate-in`, `close()` sets `animate-out`.
Props: `control`, `id`, `className` (e.g. `"redeem-point-modal"`, `"choose-icon-style"`), `closeOnBackdrop` (default `false`).

```tsx
const redeem = useSystemPopup();
<button className="mission-btn" onClick={redeem.open}>แลกรางวัล</button>
<SystemPopup control={redeem} id="redeemModal" className="redeem-point-modal"><div id="redeemModalContent" className="system-popup-content">…</div></SystemPopup>
```

### `useOffcanvas()` + `<Offcanvas>` (Bootstrap 5.2 right panel)

Classes exactly like Bootstrap 5.2: `showing` → `show` (slide in .3s), `show hiding` → none (slide out);
`aria-modal="true" role="dialog"` while open; `<div class="offcanvas-backdrop fade show">` appended to
`<body>` (click closes unless `backdrop: "static"`); Escape closes; body scroll locked.
Props: `control`, `className` = the **full captured class list** (e.g. `"offcanvas offcanvas-end offcanvas-minigame-custom"` or `"offcanvas-minigame-custom offcanvas offcanvas-end"`), plus any attributes (`id`, `data-bs-focus="false"` …).
Hook options: `backdrop` (`true | false | "static"`), `keyboard`, `onShown`, `onHidden`. Control: `show()`, `hide()`, `isOpen`, `phase`.

```tsx
const panel = useOffcanvas();
<Offcanvas control={panel} id="offcanvasCreateManual" className="offcanvas-minigame-custom offcanvas offcanvas-end" data-bs-focus="false">
  <div className="offcanvas-header offcanvas-header-minigame"><h4 className="mb-0">…</h4><div className="flex-fill"></div>
    <div className="icon-close-offcanvas-minigame-custom" onClick={panel.hide}><OffcanvasCloseIcon /></div></div>
  <div className="offcanvas-body">…</div>
</Offcanvas>
```

### `useToast()` → `[toast, toastHolder]`

toastify-js is loaded by the original (plugins.js) but **no captured script uses it**. This renders
toastify's DOM (`div.toastify.on.toastify-right.toastify-top`, 15 px offsets) if you need one.
`toast({ text, duration = 3000, className, style })`.

---

## Filters, inputs, dropdowns

All dropdowns use `useFloatingDropdown` — a port of `CustomDropdown.calculate()`: the `.custom-dropdown`
is `position: fixed` (base.css) and gets `top/left/width/max-height` written on open, scroll and
resize; it gets the random `uuid-12345` + `show` classes while open; a mousedown outside closes it.
Positioning props shared by all of them (`FloatingOptions`): `placement` (`["bottom","left"]`),
`lockPlacement`, `auto`, `horizontal`, `stretch`, `offsetX`, `offsetY`, `offsetMargin` (5), `maxHeight`, `noMaxHeight`.

`DropdownItem = { value: string; label: ReactNode; chip?: string; type?: "all"; disabled?: boolean; className?: string }`

### `<FilterDropdown>` — "สถานะมินิเกมส์ : All" pill

`CustomFilter` + single `CustomDropdown`. Renders `button#{id}.custom-filter(.fill)(.active)` with
`.filter-icon`, `.filter-title`, `.filter-value`, `.filter-toggler(.toggled)`, `.filter-close`; then the
sibling `div#{dropdownId}.dropdown-wrapper > .custom-dropdown > .custom-dropdown-body > .custom-dropdown-item(.selected)`.
`.fill` (teal border + × visible) whenever a value is set; × clears it (`onChange(null)`).

Props: `id`, `dropdownId`, `icon` (svg from the capture, e.g. `<StatusFilterIcon />`), `title`, `titleClassName`,
`defaultText` (shown when empty; mini-game pages `"All"`, mission pages `t("missionReportPage.all","ทั้งหมด")`),
`valueClassName` (mission pages: `"mission-page"`), `items`, `value: string | null`, `onChange`,
`fakeValue(item)` (pill text for a selection; default `chip ?? label`), `wrapperClassName`, `wrapperStyle`, `disabled`, + FloatingOptions
(minigame-settings: `stretch` on status/agent, nothing on type/created-by).

```tsx
<div className="col-auto">
  <FilterDropdown id="filterStatus" dropdownId="dropdownStatus" icon={<StatusFilterIcon />}
    title={t("minigameSetting.filterStatus", "สถานะมินิเกมส์ :")} defaultText="All" stretch
    items={[{ value: "active", label: t("minigameSetting.filterStatusOn", "เปิดใช้งาน") }, { value: "inactive", label: t("minigameSetting.filterStatusOff", "ปิดใช้งาน") }]}
    value={status} onChange={setStatus} />
</div>
```

### `<DateRangeFilter>` — date pill with flatpickr

`div#{id}.custom-filter` containing `input#{inputId}.filter-flatpicker.flatpickr-input[readonly]` + the
pill spans (calendar icon by default). flatpickr **4.6.13** (npm, same as the original), English
locale, `{ enableTime: false, mode: "range", dateFormat: "d/m/Y" }`, calendar appended to `<body>`
(class `flatpickr-calendar rangeMode animate open arrowTop arrowLeft`) and styled by
`material.app.min.css` — flatpickr's own CSS is **not** loaded on purpose. Clicking the pill toggles it.
Like the original the pill never gets `.fill` (its × stays hidden).
Props: `id`, `inputId`, `title`, `titleClassName`, `valueClassName`, `icon`, `onChange(dates, text)` (text = `"01/11/2026 to 14/11/2026"`), `options` (extra flatpickr options).

```tsx
<DateRangeFilter id="filterDateSummary" inputId="datepickerDateSummary" title={t("missionReportPage.dateReport", "วันที่สรุป")} titleClassName="mission-page" onChange={(dates) => setRange(dates)} />
```

### `<SearchInput>`

`div.custom-input > input.form-control + .float-prepend > svg (magnifier) + svg.navigate-close (×, CSS shows it once there is text)`.
Uncontrolled like the original. Props: `id`, `placeholder`, `defaultValue`, `onChange(value)` (each key), `onSearch(value)` (Enter — table.js behaviour),
`clearId` (id of the ×, e.g. `"clearValuePromotionSearch"`), `clearable` (default `true`). The column around it is page markup:
`<div className="col-auto" style={{ flexBasis: "264px" }}>` (264px measured on mission-history at 1704px viewport; ~175px looks right at 1111px — check your screenshot).

### `<CustomDropdown>` — form dropdown (single / multiple)

`div.custom-input.dropdown-wrapper(.multiple)(.fill|.empty)(.custom-invalid) > .dropdown-toggler(.toggled) + .input-fake + .custom-dropdown([.custom-dropdown-search] + .custom-dropdown-body > .custom-dropdown-item)` + your `children` (e.g. `.invalid-feedback`).
Multiple mode shows chips `.multiple-item > a.multiple-close + span.multiple-text` and a `+N` chip when they don't fit (same width maths as the original).

Props: `id`, `className` (default `"custom-input dropdown-wrapper"`; add e.g. `require`), `items`, `multiple`, `value` (`string | null` or `string[]`), `onChange`,
`placeholder`, `fakeValue(item)`, `fakeClassName`, `search` (+ `searchPlaceholder`, filters by text — original `selfSearch`), `checkbox`,
`allItemLabel` (multiple: adds the `data-type="all"` item), `bodyless` (items directly in `.custom-dropdown`), `dropdownClassName`,
`itemAttributes(item)` (extra attributes per item), `disabled`, `invalid`, + FloatingOptions (anchor = `.input-fake`).

```tsx
<CustomDropdown id="customSelectAgentDropdown" className="custom-input dropdown-wrapper require" fakeClassName="multiple"
  placeholder="เลือก Agent" search auto stretch items={agents} value={agent} onChange={setAgent}>
  <div className="invalid-feedback" id="error-selectAgentDropdown">กรุณาเลือก Agent</div>
</CustomDropdown>
```

### `<GoogleDropdown>` — type-to-search customer picker

`CustomDropdown` theme "google": `div.custom-input.dropdown-wrapper.flex-grow-1.dropdown-google(.empty) > .dropdown-navigate > .navigate-item.navigate-reset (fa-times) + .dropdown-input-wrapper > input.dropdown-input.form-control + .custom-dropdown.dropdown-wrap > .custom-dropdown-body > .dropdown-body-scrollable (items or "ไม่พบข้อมูล" / "กำลังค้นหาข้อมูล" caption) + .observer-target`.
Picking an item makes the input read-only with the item text; the reset × clears it.
Props: `id`, `inputId`, `className`, `placeholder`, `value: DropdownItem | null`, `onChange`, `onSearch(keyword): Promise<DropdownItem[]>` (mock), `minimumCharacters`, `disabled`, `invalid`, `children`.

### `<Select2>` — select2 4.1.0-rc.0 look-alike (no jQuery)

Renders `select.form-select.select2.select2-hidden-accessible` + `span.select2.select2-container.select2-container--default(--below|--above)(--open)(--focus)` with
`.selection > .select2-selection.select2-selection--single > .select2-selection__rendered + .select2-selection__arrow > b`, and when open
portals `span.select2-container.select2-container--default.select2-container--open` (absolute, page coordinates) into `<body>` with
`.select2-dropdown.select2-dropdown--below` (`width:auto; min-width:<container>px; position:relative` = the original's `dropdownAutoWidth`),
the search box `.select2-search__field`, and `ul.select2-results__options > li.select2-results__option(--selectable)(--highlighted)` /
"No results found". Keyboard: arrows, Enter, Escape. Styled by the CDN select2.min.css + material.app.min.css.
Props: `id`, `options: { value, text, disabled? }[]`, `value`, `onChange`, `placeholder` (none on the captured ones), `width` (default `"100%"`), `disabled`, `selectClassName`.

### `<ToggleSwitch>`

`variant="minigame"` (default): `div.custom-switch.switch-alone.form-check.form-switch > input.form-check-input[type=checkbox]`;
`variant="mission"`: `div.mission-switch-btn > input.mission-switch-check-input`.
Props: `checked`, `onChange(checked)`, `inputClassName` (e.g. `"status-minigame-checkbox"`), `wrapperClassName`, any other input attribute (`id`, `value`, `disabled`).
Status toggles on cards must not save — show the confirm dialog and flip local state only.

---

## Tables

### `<Pagination>`

`.system-pagination` as captured: page-size dropdown `div.pagination-limit.custom-input.dropdown-wrapper.fill` (10/20/50/100, opens
upwards near the bottom), `div.pagination-display.p2` "แสดง **1 - 10** จาก **45** รายการ" (labels `rgb(233,233,233)`, numbers `rgb(80,161,152)`,
`global.table.*` keys), `.flex-fill`, `ul.pagination-list` with `li.paginate-nav.paginate-prev-all/prev`, `li.paginate-page(.active)[data-page]`,
`li.paginate-nav.paginate-next/next-all` (+ `disabled`). `data-offset` values follow the captures (empty table: prev `-20`, next `0`).
Page numbers shown: current−3 … current+3 (only page 1 was captured, so beyond that it is a guess).
Props: `total`, `offset`, `limit`, `onOffsetChange(offset)`, `onLimitChange(limit)` (also reset offset to 0 yourself), `limits`.
Place it inside the `.system-table` container after `.table-scrollable`, as in page.html.

### `<TableLoading>` / `<EmptyState>`

`<TableLoading show>` → `div.table-loading` (lord-icon msoeawqm loop, "กำลังค้นหาข้อมูล", "เรากำลังทำงานอย่างหนัก…"); hidden with `display:none` like table.js.
Props: `show`, `titleKey`/`textKey` (e.g. `"reportPromotionMinigame.waitingText"`, `"missionReportPage.findingDataText"` — omit on pages whose markup has plain Thai), `textClassName` (`"mission-page"`).
`<EmptyState>` → `div.table-jumbotron` (lord-icon nmgjlgnk hover, "ไม่พบข้อมูลที่ค้นหา" / "ลองเปลี่ยนเงื่อนไขการค้นหานะคะ"); props `titleKey`, `textKey` (default `missionReportPage.notFoundInfo*`), `textClassName` (default `"mission-page"`).
table.js shows the loader for at least 500 ms per request — do the same with your mock fetch if you want the identical feel.

---

## Rich text and colour

### `<RichTextEditor>` — the original CKEditor 5 build

Loads `/lib/ckeditor5-default/build/ckeditor.js` (downloaded unchanged from staging) with `next/script`
(id `ckeditor5-default`; on mini-game settings, /mission, /mission/setting and redeem-points the shell
already loads it at page load so its `<style data-cke>` lands last in `<head>` like the original) and
calls `CKSource.Editor.create(textarea, config)` — the toolbar and Thai UI come from the build itself.
Default `config` = `MINIGAME_EDITOR_CONFIG` (exact copy of scriptminigame.js: `removePlugins: ['Title']`,
placeholder "ระบุเงื่อนไขมินิเกมส์", style "เงาตัวอักษร"). The mission pages' configs were not captured.
Props: `id`, `className` (e.g. `"input-promotion-condition-th"`), `defaultValue` (HTML), `config`, `hidden` (TH/EN/TL tabs), `onChange(html)`, `onReady(editor)`, `dataAttributes`.
The textarea + editor UI sit in a `display:contents` wrapper (React must not own the nodes CKEditor inserts).

```tsx
<RichTextEditor id="minigameConditionHtml" className="input-promotion-condition-th" onChange={setConditionTh} />
<RichTextEditor id="minigameConditionHtml-en" className="display-none input-promotion-condition-en" dataAttributes={{ "data-condition-lang": "en" }} hidden={tab !== "en"} />
```

### `<ColorPicker>` — the original jQuery asColorPicker

**Choice:** the original picker (gradient mode: saturation, hue, alpha, hex, gradient markers, angle
wheel; LSM-modified plugin with `hidePaletteColor`) is ~2,700 lines of behaviour, so a React rewrite
would drift from the original. Instead this component loads jQuery 3.6.4 (same as the original) +
jquery-asColor 0.3.6 + jquery-asGradient 0.3.3 (CDN; their original path is unknown) + the original
`/lib/as-color-picker/jquery-asColorPicker.js` (downloaded unchanged), only on pages that render a
ColorPicker, and runs `$(input).asColorPicker({ hidePaletteColor: true, onChange })` on a plain input.
The plugin builds the original `.asColorPicker-wrap > input.asColorPicker-input + a.asColorPicker-clear + .asColorPicker-trigger > span`
and its dropdown in `<body>`, styled by asColorPicker.min.css + `/lib/as-color-picker/css/style.css`.
The host is a `<span style="display:contents">`; the plugin owns everything inside it.
Props: `className` (hook class, e.g. `"getColorBgMainColor"`), `defaultValue`, `mode` (default `"gradient"`), `onChange(value)`, `options`.
Only the asColorPicker groups load its CSS: `(minigame-settings)` (both files) and `(mission-form)` (min.css only).

```tsx
<div className="session-set-color-and-title">
  <h4 className="mb-0">{t("minigameSetting.presetMinigameSetBg", "สี พื้นหลังหน้าจอมินิเกมส์")}</h4>
  <ColorPicker className="getColorBgMainColor" defaultValue="rgba(0, 0, 0, 0.36)"
    onChange={(v) => document.documentElement.style.setProperty("--color-bg-main", v)} />
</div>
```

---

## Icons (`icons.tsx`, server-safe)

`CloseIcon32` (swal/modal ×), `OffcanvasCloseIcon`, `FilterTogglerIcon`, `FilterCloseIcon`, `CalendarFilterIcon`, `StatusFilterIcon`,
`SearchIcon`, `SearchClearIcon`, `DropdownTogglerIcon`, `DropdownSearchIcon`, `ChipCloseIcon`,
`PaginateFirstIcon` / `PaginatePrevIcon` / `PaginateNextIcon` / `PaginateLastIcon` — paths copied from the captures.
Page-specific icons (person filter icons, card icons …) stay in your page components, copied from page.html.

`cx(...classes)` joins class names and skips falsy values.
