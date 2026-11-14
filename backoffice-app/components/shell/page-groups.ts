// Per-page <head> setup, copied from backoffice-reference/styles.md.
// Each route group under app/(...)/ is its own root layout and passes one of these keys to
// <BackOfficeDocument>. Different root layouts make Next do a full page load between groups,
// so a page never keeps another page's stylesheets (React never removes hoisted CSS).

export type HeadItem = { href: string } | { id: string; css: string };

// Inline :root block that sits between custom.min.css and base.css on every page
const LEGACY_ICON_VARS = `
    :root {
        --lsm-legacy-icon-next-bank: url("https://p88.blob.core.windows.net/images/default/icon-next-bank.png");
        --lsm-legacy-icon-forword-bank: url("https://p88.blob.core.windows.net/images/default/icon-forword-bank.png");
        --lsm-legacy-dash-board-title-v3: url("https://p88.blob.core.windows.net/images/default/dash-board-title-v3.webp");
    }
`;

// Bootstrap's own checkbox tick. Stands in for the line the capture tool withheld
// from the checked .form-check-input-custom-mini-game rule (styles.md, inline style A / C).
const CHECK_MARK = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e")`;

// Inline style A — /promotion/mini-game-v2
const STYLE_A = `
    .ck.ck-editor__main > .ck-editor__editable { border-color: #545454 !important; }
    input[type="radio"] { width: 24px; height: 24px; }
    .form-check-input-custom-mini-game { width: 20px; height: 20px; }
    .form-check-input.form-check-input-custom-mini-game:checked[type="checkbox"] {
        background: #50A198;
        background-image: ${CHECK_MARK};
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
`;

// Inline style B — mini-game report + history
const STYLE_B = `
    .main-content { height: 100vh; }
    .page-content { height: calc(100% - 72px - 1.5rem); padding-bottom: 0; box-sizing: content-box; }
`;

// Inline style C — /mission. Rules 2 and 4 were withheld by the capture tool;
// recovered as the same rules inline style A has (styles.md says so too).
const STYLE_C = `
    .ck.ck-editor__main > .ck-editor__editable { border-color: rgb(84, 84, 84) !important; }
    input[type="radio"] { width: 24px; height: 24px; }
    .form-check-input-custom-mini-game { width: 20px; height: 20px; }
    .form-check-input.form-check-input-custom-mini-game:checked[type="checkbox"] {
        background: #50A198;
        background-image: ${CHECK_MARK};
    }
`;

// Inline style D — /mission/mission/history (no IBM Plex, no mission.css)
const STYLE_D = `
    .main-content { height: 100vh; }
    .page-content { height: calc(100% - 72px - 1.5rem); padding-bottom: 0px; box-sizing: content-box; }
    .flex { display: flex; }
    .title-header { font-size: 16px; line-height: 26px; color: rgb(233, 233, 233); }
    .title-margin { margin-left: 24px; }
    .title-header img { width: 24px; height: 24px; }
    .title-header span { color: rgb(114, 220, 217); }
    .font-set { font-family: "Noto Sans Thai" !important; }
`;

const IBM_PLEX = { href: "/css/fonts/IBMPlexSansThai/IBM-Plex-Sans-Thai.css" };
const MISSION_CSS = { href: "/css/style/mission.css" };
const CKEDITOR_CSS = { href: "/lib/ckeditor5-default/styles.css" };
const COLOR_PICKER_CSS = { href: "/lib/as-color-picker/css/asColorPicker.min.css" };
const COLOR_PICKER_STYLE = { href: "/lib/as-color-picker/css/style.css" };

export const COMMON_HEAD: HeadItem[] = [
  { href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" },
  { href: "/assets/libs/swiper/swiper-bundle.min.css" },
  { href: "/assets/libs/jsvectormap/css/jsvectormap.min.css" },
  { href: "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" },
  { href: "/assets/css/bootstrap.min.css" },
  { href: "/assets/css/material.icons.min.css" },
  { href: "/assets/css/material.app.min.css" },
  { href: "/assets/css/custom.min.css" },
  { id: "legacy-icon-vars", css: LEGACY_ICON_VARS },
  { href: "/css/base.css" },
];

export type PageGroup = {
  // Extra <head> items after base.css, in the original order
  head: HeadItem[];
  // Class of #layout-wrapper ("" is rendered as class="" like the original)
  wrapperClassName: string;
  // Pages that load /lib/ckeditor5-default/build/ckeditor.js on page load. The script injects
  // its <style data-cke> at the end of <head>, which is where the original has it.
  ckeditor: boolean;
};

export const PAGE_GROUPS = {
  // /promotion/mini-game-v2 (and / which redirects there), /dev/components
  minigameSettings: {
    head: [CKEDITOR_CSS, COLOR_PICKER_CSS, COLOR_PICKER_STYLE, { id: "page-style-a", css: STYLE_A }],
    wrapperClassName: "",
    ckeditor: true,
  },
  // /report/promotion/minigame, /promotion/minigame/history
  minigameReports: {
    head: [{ id: "page-style-b", css: STYLE_B }],
    wrapperClassName: "",
    ckeditor: false,
  },
  // /promotion/minigame/minigame-period-deposit, /mission/report, /mission/report-mission
  missionReports: {
    head: [IBM_PLEX, MISSION_CSS],
    wrapperClassName: "layout-mission-report",
    ckeditor: false,
  },
  // /mission
  missionSettings: {
    head: [IBM_PLEX, MISSION_CSS, CKEDITOR_CSS, { id: "page-style-c", css: STYLE_C }],
    wrapperClassName: "",
    ckeditor: true,
  },
  // /mission/setting (create/edit form), /dev/components/mission.
  // Its 698-char inline style was not captured; styles.md says it is similar to C, so C is used.
  missionForm: {
    head: [COLOR_PICKER_CSS, IBM_PLEX, MISSION_CSS, CKEDITOR_CSS, { id: "page-style-mission-form", css: STYLE_C }],
    wrapperClassName: "",
    ckeditor: true,
  },
  // /mission/redeem-points
  missionRedeem: {
    head: [IBM_PLEX, MISSION_CSS, CKEDITOR_CSS],
    wrapperClassName: "layout-mission-report",
    ckeditor: true,
  },
  // /mission/agent-setting, /mission/banner-setting (round-2 captures, notes.md of each page)
  missionPlain: {
    head: [IBM_PLEX, MISSION_CSS],
    wrapperClassName: "",
    ckeditor: false,
  },
  // /mission/mission/history (round-2 capture; styles.md "Inline style D")
  missionHistory: {
    head: [{ id: "page-style-d", css: STYLE_D }],
    wrapperClassName: "",
    ckeditor: false,
  },
} satisfies Record<string, PageGroup>;

export type PageGroupKey = keyof typeof PAGE_GROUPS;
