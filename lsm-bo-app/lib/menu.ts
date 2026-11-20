// Sidebar menu exactly as the original shows it to this account (layouts/Sidebar setData(),
// after the permission filter). Routes are the original URLs.

export type MenuLink = {
  kind: "link";
  title: string;
  route: string;
  icon: string;
  // The original renders these as a <div to="…"> (not a link) that runs an action instead:
  // bot bank opens an external page, mini-game / SMS request a login URL from the API.
  action?: boolean;
  // Our own addition: shown with the animated Minigames icon, its own row colour and a NEW badge
  featured?: boolean;
};

// Second-level collapsible group inside "จัดการการเงิน" and "รายงาน"
export type MenuSubGroup = {
  kind: "subgroup";
  title: string;
  icon: string;
  items: MenuLink[];
};

export type MenuGroup = {
  kind: "group";
  key: string; // the original's group title, used to open the group on page load
  title: string;
  icon: string;
  // true for groups that mix links and sub-groups (the original's `submenu: true`)
  submenu: boolean;
  items: (MenuLink | MenuSubGroup)[];
};

export type MenuEntry = MenuLink | MenuGroup;

const link = (title: string, route: string, icon: string, action = false): MenuLink => ({
  kind: "link",
  title,
  route,
  icon: `pi ${icon}`,
  ...(action ? { action } : {}),
});

const subgroup = (title: string, icon: string, items: MenuLink[]): MenuSubGroup => ({
  kind: "subgroup",
  title,
  icon: `pi ${icon}`,
  items,
});

export const MENU: MenuEntry[] = [
  link("กระดานแดชบอร์ด", "/dashboard", "pi-server"),
  link("ประกาศ", "/announce", "pi-book"),
  {
    kind: "group",
    key: "member",
    title: "สมาชิก",
    icon: "pi pi-users",
    submenu: false,
    items: [
      link("ยืนยันสมาชิก", "/member/pending", "pi-check-square"),
      link("สมาชิก", "/member/information", "pi-id-card"),
      link("กลุ่มสมาชิก", "/member/group", "pi-users"),
      link("สมาชิกถูกแบน", "/member/ban", "pi-ban"),
      link("รายงาน", "/member/report", "pi-file"),
    ],
  },
  {
    kind: "group",
    key: "financial",
    title: "จัดการการเงิน",
    icon: "pi pi-dollar",
    submenu: true,
    items: [
      subgroup("จัดการธนาคาร", "pi-check-square", [
        link("จัดการธนาคาร", "/financial/manage", "pi-check-square"),
        link("รายการเดินบัญชี", "/financial/transaction", "pi-book"),
        link("ฝาก", "/financial/deposit", "pi-angle-double-down"),
        link("ถอน", "/financial/withdraw", "pi-angle-double-up"),
        link("จัดการบอทแบงค์", "/financial/setting-bot-bank", "pi-cog", true),
      ]),
      subgroup("เพย์เมนต์เกตเวย์", "pi-qrcode", [
        link("โยกย้ายเงิน", "/financial/paymentgateway/inout", "pi-arrow-right-arrow-left"),
        link("ฝาก", "/financial/paymentgateway/deposit", "pi-angle-double-down"),
        link("ถอน", "/financial/paymentgateway/withdraw", "pi-angle-double-up"),
      ]),
      subgroup("จัดการ OneSlip", "pi-receipt-slip", [
        link("จัดการบัญชี", "/financial/oneslip/account", "pi-id-card"),
        link("Transactions", "/financial/oneslip/transactions", "pi-list"),
      ]),
      link("รายการรวมถอน", "/financial/summation-withdraw", "pi-chart-line"),
      link("รายการรวมฝาก", "/financial/summation-deposit", "pi-wallet"),
      link("อนุมัติการถอนคืนเงิน", "/financial/approve-rebet", "pi-check"),
      link("อนุมัติการถอนแนะนำเพื่อน", "/financial/approve-affiliate", "pi-check-square"),
      link("ตั้งค่าฝากเงินแมนนวล", "/financial/setting-deposit-manual", "pi-cog"),
    ],
  },
  {
    kind: "group",
    key: "promotion",
    title: "โปรโมชั่น",
    icon: "pi pi-megaphone",
    submenu: false,
    items: [
      link("ตั้งค่าโปรโมชั่น", "/promotion/setting", "pi-cog"),
      link("ตั้งค่าโปรโมชั่นพิเศษ", "/promotion/specialset", "pi-cog"),
      link("รายการโปรโมชั่น", "/promotion/transaction", "pi-list"),
    ],
  },
  // CHANGED (PK, 16/11/2026): the original's "ตั้งค่าโปรโมชั่นมินิเกม" item inside โปรโมชั่น is now
  // its own top-level "Minigames" item, highlighted with an animated icon to draw clicks.
  // It links to our own Minigames sale page (promo for merchants who have not subscribed yet).
  // CHANGED (PK, 21-11-2026): now opens the new sale page with the video (/minigames-preview).
  // The older promo page still lives at /minigames.
  { ...link("Minigames", "/minigames-preview", "pi-cog"), featured: true },
  {
    kind: "group",
    key: "affiliate",
    title: "พันธมิตร",
    icon: "pi pi-sitemap",
    submenu: false,
    items: [
      link("ยืนยันพันธมิตร", "/partner/pending", "pi-check-square"),
      link("จัดการส่วนแบ่งรายได้", "/partner/commission", "pi-money-bill"),
      link("จัดการพันธมิตร", "/partner/management", "pi-cog"),
      link("จัดการกระเป๋าพันธมิตร", "/partner/wallet", "pi-money-bill"),
      link("รายงานพันธมิตรโดยรวม", "/partner/summary_report", "pi-list"),
      link("รายงานรายได้พันธมิตร", "/partner/income_report", "pi-file"),
      link("ผูกสาย/ย้าย พันธมิตร", "/partner/move-member", "pi-angle-double-right"),
    ],
  },
  {
    kind: "group",
    key: "report",
    title: "รายงาน",
    icon: "pi pi-file-edit",
    submenu: true,
    items: [
      link("ธุรกรรมโดยรวม", "/report/transactions", "pi-server"),
      link("รายการเปิด/ปิดกะ", "/report/shift", "pi-server"),
      link("รายงานติดตามลูกค้า", "/report/follow-customers", "pi-sitemap"),
      link("แพ้ชนะตามผลิตภัณฑ์", "/report/winloseproduct", "pi-list"),
      link("รายการฝาก-ถอน", "/report/deposit-withdraw", "pi-sort-alt"),
      link("รายการฝาก-ถอนรายเดือน", "/report/depositwithdrawbymonth", "pi-sort-alt"),
      subgroup("แนะนำเพื่อน", "pi-sitemap", [
        link("รายงานการจ่ายแนะนำเพื่อน", "/report/payments-affiriate", "pi-flag"),
        link("รายงานการจ่ายแนะนำเพื่อนสเต็ป", "/report/payment-affiriatestep", "pi-flag"),
        link("รายชื่อแนะนำเพื่อน", "/affiliate-list", "pi-sitemap"),
        link("รายงานแนะนำเพื่อน", "/report/affiliate", "pi-sitemap"),
        link("แนะนำเพื่อนสเต็ปยอดเทิร์นโอเวอร์", "/affiliate-turn", "pi-sitemap"),
        link("แนะนำเพื่อนสเต็ปยอดเสีย", "/affiliate-lose", "pi-sitemap"),
        link("รายงานรายได้จากแนะนำเพื่อน", "/affiliate-balance", "pi-credit-card"),
      ]),
      subgroup("รายงานการคืนเงิน", "pi-refresh", [
        link("รายงานการจ่ายเงินคืน", "/report/refunds-payment", "pi-flag"),
        link("รายงานการจ่ายเงินคืนสเต็ป", "/report/refund-paymentstep", "pi-flag-fill"),
        link("รายงานการคืนเงิน", "/report/rebate", "pi-align-center"),
        link("คืนเงินสเต็ปยอดเทิร์นโอเวอร์", "/rebate-turn", "pi-align-left"),
        link("คืนเงินสเต็ปยอดเสีย", "/rebate-lose", "pi-align-right"),
        link("รายงานเงินคืนทั้งหมด", "/report/total-rebate", "pi-undo"),
      ]),
      link("รายงานโปรโมชั่น", "/report/promotion", "pi-credit-card"),
      link("รายงานเพย์เมนต์เกตเวย์", "/report/paymentgateway", "pi-wallet"),
      link("สมาชิกใหม่ และ การฝาก รายเดือน", "/report/registerbymonth", "pi-users"),
      link("รายงานความเสี่ยง", "/report/risk", "pi-exclamation-triangle"),
      link("การเลื่อนระดับสมาชิก", "/report/levelupbymonth", "pi-sort-amount-up"),
      link("การเลื่อนกลุ่มสมาชิก", "/report/move-membergroup", "pi-sort-amount-up-alt"),
    ],
  },
  link("เอเย่นต์", "/agent/", "pi-user-edit"),
  link("ส่งข้อความ", "/sms", "pi-send", true),
  link("บันทึกกิจกรรม", "/activity-log/", "pi-history"),
  {
    kind: "group",
    key: "staffmanagement",
    title: "การจัดการพนักงาน",
    icon: "pi pi-users",
    submenu: false,
    items: [
      link("การจัดการผู้ช่วย", "/merchant-staffs/staff-management", "pi-users"),
      link("จัดการสิทธิ์", "/merchant-staffs/manage-permissions", "pi-users"),
    ],
  },
  link("2FA", "/twofactor/two-factor", "pi-user-edit"),
  link("คู่มือ", "/manual", "pi-book"),
  link("อื่น ๆ", "/other", "pi-book"),
  link("ตั้งค่าระบบ", "/systemsetting", "pi-cog"),
];

// layouts/Sidebar routeCheck(): the group that starts open for the page that was loaded.
// ("affiliate" checks "/affiliate/", which no partner route uses, so that group never auto-opens.)
export function openGroupFor(path: string) {
  if (path.startsWith("/member/")) return "member";
  if (path.startsWith("/financial/")) return "financial";
  if (path.startsWith("/promotion/")) return "promotion";
  if (path.startsWith("/affiliate/")) return "affiliate";
  if (path.startsWith("/report/")) return "report";
  if (path.startsWith("/member-ship/")) return "membership";
  if (path.startsWith("/merchant-staffs/")) return "staffmanagement";
  return "";
}

// Every page route in the menu (without the trailing slash Next.js strips), for the catch-all page.
export function allMenuRoutes(): string[] {
  const routes: string[] = [];
  const visit = (items: (MenuLink | MenuSubGroup | MenuGroup)[]) => {
    for (const item of items) {
      if (item.kind === "link") {
        if (!item.action) routes.push(item.route.replace(/\/$/, ""));
      } else visit(item.items);
    }
  };
  visit(MENU);
  return routes;
}
