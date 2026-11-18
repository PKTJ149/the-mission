# /dashboard — capture notes (16/11/2026)

Captured read-only from `https://bo-superx.merchant.mclsm.com/dashboard` (account `wbow@superx`, merchant `superx`),
viewport 1552 × 1829, DPR 1.

## Files
- `page.html` — `#__nuxt` outerHTML exactly as live (151,104 chars, SHA-256 `8e6b9dcf…a5c0af` verified), state:
  "โปรโมชั่น" group expanded by PK, every other group collapsed, sidebar expanded.
- `inputs.json` — input values (DOM properties, not attributes): both date pickers `16/11/2026`.
- `body-tail.json` — the only other `<body>` child: Google reCAPTCHA's hidden challenge container (not rebuilt).
- `providers.json` — the 24 payment-gateway cards parsed out of `page.html` (source of `lib/mock/dashboard.ts`).
- `../../assets/` — static files downloaded from the original (fonts, icons, images, `api/th.json`, `sound/cash-money.mp3`).

## Menu routes (sidebar, in order)
Links are `nuxt-link`s; items marked *action* are `<div to="…">` that run code instead of navigating.

| Group | Item | Route |
|---|---|---|
| — | กระดานแดชบอร์ด | /dashboard |
| — | ประกาศ | /announce |
| สมาชิก | ยืนยันสมาชิก · สมาชิก · กลุ่มสมาชิก · สมาชิกถูกแบน · รายงาน | /member/pending · /member/information · /member/group · /member/ban · /member/report |
| จัดการการเงิน › จัดการธนาคาร | จัดการธนาคาร · รายการเดินบัญชี · ฝาก · ถอน · จัดการบอทแบงค์ (*action*: opens bot-bank site in a new tab) | /financial/manage · /financial/transaction · /financial/deposit · /financial/withdraw · /financial/setting-bot-bank |
| จัดการการเงิน › เพย์เมนต์เกตเวย์ | โยกย้ายเงิน · ฝาก · ถอน | /financial/paymentgateway/inout · …/deposit · …/withdraw |
| จัดการการเงิน › จัดการ OneSlip | จัดการบัญชี · Transactions | /financial/oneslip/account · /financial/oneslip/transactions |
| จัดการการเงิน | รายการรวมถอน · รายการรวมฝาก · อนุมัติการถอนคืนเงิน · อนุมัติการถอนแนะนำเพื่อน · ตั้งค่าฝากเงินแมนนวล | /financial/summation-withdraw · /financial/summation-deposit · /financial/approve-rebet · /financial/approve-affiliate · /financial/setting-deposit-manual |
| โปรโมชั่น | ตั้งค่าโปรโมชั่น · ตั้งค่าโปรโมชั่นพิเศษ · ตั้งค่าโปรโมชั่นมินิเกม (*action*: asks the promotion API for a login URL, opens it) · รายการโปรโมชั่น | /promotion/setting · /promotion/specialset · /promotion/minigame · /promotion/transaction |
| พันธมิตร | ยืนยันพันธมิตร · จัดการส่วนแบ่งรายได้ · จัดการพันธมิตร · จัดการกระเป๋าพันธมิตร · รายงานพันธมิตรโดยรวม · รายงานรายได้พันธมิตร · ผูกสาย/ย้าย พันธมิตร | /partner/pending · /partner/commission · /partner/management · /partner/wallet · /partner/summary_report · /partner/income_report · /partner/move-member |
| รายงาน | ธุรกรรมโดยรวม · รายการเปิด/ปิดกะ · รายงานติดตามลูกค้า · แพ้ชนะตามผลิตภัณฑ์ · รายการฝาก-ถอน · รายการฝาก-ถอนรายเดือน | /report/transactions · /report/shift · /report/follow-customers · /report/winloseproduct · /report/deposit-withdraw · /report/depositwithdrawbymonth |
| รายงาน › แนะนำเพื่อน | 7 items | /report/payments-affiriate · /report/payment-affiriatestep · /affiliate-list · /report/affiliate · /affiliate-turn · /affiliate-lose · /affiliate-balance |
| รายงาน › รายงานการคืนเงิน | 6 items | /report/refunds-payment · /report/refund-paymentstep · /report/rebate · /rebate-turn · /rebate-lose · /report/total-rebate |
| รายงาน | รายงานโปรโมชั่น · รายงานเพย์เมนต์เกตเวย์ · สมาชิกใหม่ และ การฝาก รายเดือน · รายงานความเสี่ยง · การเลื่อนระดับสมาชิก · การเลื่อนกลุ่มสมาชิก | /report/promotion · /report/paymentgateway · /report/registerbymonth · /report/risk · /report/levelupbymonth · /report/move-membergroup |
| — | เอเย่นต์ | /agent/ |
| — | ส่งข้อความ (*action*: asks the API for the SMS admin login URL) | /sms |
| — | บันทึกกิจกรรม | /activity-log/ |
| การจัดการพนักงาน | การจัดการผู้ช่วย · จัดการสิทธิ์ | /merchant-staffs/staff-management · /merchant-staffs/manage-permissions |
| — | 2FA · คู่มือ · อื่น ๆ · ตั้งค่าระบบ | /twofactor/two-factor · /manual · /other · /systemsetting |

Top bar targets (from `actionRoute()` in `_nuxt/b9d0547.js`): ยืนยันสมาชิก /member/pending, ฝาก /financial/deposit,
ถอน /financial/withdraw, ฝาก/ถอนเพย์เมนท์เกตเวย์ /financial/paymentgateway/{deposit,withdraw}, รายการรวมถอน
/financial/summation-withdraw, อนุมัติการถอนคืนเงิน /financial/approve-rebet, อนุมัติการถอนแนะนำเพื่อน
/financial/approve-affiliate, รายการโปรโมชั่น (gift) /promotion/padding, ยืนยันพันธมิตร /partner/pending,
แจ้งเตือน /notification, แจ้งเตือนพิเศษ /notification-spacial, user menu: ข้อมูลส่วนตัว /profile, เปลี่ยนรหัสผ่าน
/change-password. `/` redirects to `/dashboard` (pages/index `created()`).

## Interactive parts (how they behave)
- Sidebar groups: PrimeVue `v-styleclass` on the header `<a>`, target `@next` `<ul>`: removes / adds `hidden` around the
  `slidedown` (.45 s) / `slideup` CSS animations; slidedown leaves `style=""` on the `<ul>`. Only the page you land on
  decides which group starts open (`routeCheck()`: /member/, /financial/, /promotion/, /affiliate/ (never matches),
  /report/, /merchant-staffs/); going to a /merchant-staffs/ page later opens that group.
- Active item: `$route.path.startsWith(route)` → item classes `nuxt-link-exact-active nuxt-link-active bg-green-50 … `,
  icon `color: rgb(53, 123, 56)`, label `text-green-700`, `aria-current="page"` when exact.
- Hamburger (`btn-toggle`, top bar): toggles the `btn_menu` store. Sidebar gets `hide-menu` (width 0; CSS
  `#app-sidebar-12:hover` widens it to 241 px), group headers `normal-menu` → `main-nemu`, every item padding
  `13px` → `13px 13px 13px 0px` (all `!important`), and items inside groups get the fall-through attribute
  `isactive="true"`. The content does **not** move (white strip on the left). Not persisted.
- Top bar icons: PrimeVue `v-tooltip.top` (flips to bottom: no room above), appended to `<body>`:
  `<div id="pv_id_N_tooltip" class="p-tooltip p-component p-tooltip-bottom" style="display; left; top; opacity; z-index">`,
  fades in over 250 ms. The download icon uses `.bottom`. Labels = the hidden `.text-nav` texts; P2P → "P2P",
  download → "ดาวน์โหลด".
- Language and user dropdowns: `v-styleclass` `@next`, `scalein` / `fadeout`, hide on outside click (not opened on the
  original — on the never-click list; behaviour taken from the bundle).
- Date pickers: PrimeVue Calendar (`dateFormat dd/mm/yy`), opens on focus, panel inside the wrapper `<span>`
  (`role="dialog" class="p-datepicker p-component" pv_id_7` / `pv_id_8`, `style="z-index: 1008; transform-origin:
  center top; top: 29px; left: 0px;"`), `p-connected-overlay` enter/leave transitions, other-month days `p-disabled`,
  today `p-datepicker-today` + `p-highlight` + `tabindex="0"`. Closed with Escape (leave transition ~0.1 s).
  Month/year views exist in the bundle (title buttons) but were not opened on the original.
- ค้นหา / รายงานวันนี้ reload the report (never clicked). เพิ่มค่าใช้จ่าย opens the expense dialog, One2Coin
  "ดูรายเอเยนต์" opens the agent-balance dialog, the support button opens the chat (not clicked).
- No `.p-ink` ripple elements appear (ripple is off).

## Live / dynamic values
- Top bar badges: ยืนยันสมาชิก 243, ถอน 3, รายการรวมถอน 3, อนุมัติการถอนคืนเงิน 1, อนุมัติการถอนแนะนำเพื่อน 1,
  รายการโปรโมชั่น 12 (others 0 → no badge). Polled / pushed by websockets.
- Support button: "ซัพพอร์ตตอบแล้ว 246 ข้อความ", badge 246; `sw-ring` pulses forever (CSS animation).
- Dates: both pickers default to today; the report is for that range.
- Every number on the page (totals, members, expenses, profit, 24 gateway balances, fees, limits, open/closed state).
- z-index / `pv_id_N` counters depend on how many overlays were opened before.
