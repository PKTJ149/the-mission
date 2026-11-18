"use client";

import { useRouter } from "next/navigation";
import { Fragment, type MouseEvent } from "react";
import { Badge } from "@/components/primevue/badge";
import { Button } from "@/components/primevue/button";
import type { ShellData } from "@/lib/api/shell";
import { hideTooltip, showTooltip, toggleStyleClass, type StyleClassOptions } from "@/lib/primevue/dom";

// layouts/Header (data-v-fe864a8e). Every element of the original carries the scoped attribute.
const V = { "data-v-fe864a8e": "" };

const ICON_LINK =
  "flex p-2 align-items-center hover:bg-bluegray-900 border-round text-bluegray-100 hover:text-bluegray-50 font-medium border-round cursor-pointer transition-colors transition-duration-150 lg:border-circle p-ripple";
const DROPDOWN: StyleClassOptions = {
  enterClass: "hidden",
  enterActiveClass: "scalein",
  leaveToClass: "hidden",
  leaveActiveClass: "fadeout",
  hideOnOutsideClick: true,
};

type BadgeSeverity = "success" | "info" | "warning" | "danger";

// One icon of the right-hand bar: icon + optional badge + hidden label, tooltip on hover.
// `route` is where the original's actionRoute() sends you.
type IconItem = {
  icon: string;
  label: string;
  count: number;
  severity: BadgeSeverity;
  route: string;
  labelClass?: string;
};

function tooltipHandlers(text: string, side: "top" | "bottom" = "top") {
  return {
    onMouseEnter: (e: MouseEvent<HTMLElement>) => showTooltip(e.currentTarget, text, side),
    onMouseLeave: (e: MouseEvent<HTMLElement>) => hideTooltip(e.currentTarget),
  };
}

function toggleNext(e: MouseEvent<HTMLElement>, options: StyleClassOptions) {
  const target = e.currentTarget.nextElementSibling as HTMLElement | null;
  if (target) toggleStyleClass(e.currentTarget, target, options);
}

type TopbarProps = { shell: ShellData; onToggleSidebar: () => void };

export function Topbar({ shell, onToggleSidebar }: TopbarProps) {
  const router = useRouter();
  const b = shell.badges;

  const go = (route: string) => (e: MouseEvent<HTMLElement>) => {
    hideTooltip(e.currentTarget); // the original's tooltip also hides on click
    router.push(route);
  };

  const leftItems: IconItem[] = [
    { icon: "pi-users", label: "ยืนยันสมาชิก", count: b.member, severity: "success", route: "/member/pending" },
    { icon: "pi-upload", label: "ฝาก", count: b.deposit, severity: "info", route: "/financial/deposit" },
    { icon: "pi-download", label: "ถอน", count: b.withdraw, severity: "warning", route: "/financial/withdraw" },
    { icon: "pi-cloud-upload", label: "ฝากเพย์เมนท์เกตเวย์", count: b.depositPayment, severity: "info", route: "/financial/paymentgateway/deposit" },
    { icon: "pi-cloud-download", label: "ถอนเพย์เมนท์เกตเวย์", count: b.withdrawPayment, severity: "warning", route: "/financial/paymentgateway/withdraw" },
    { icon: "pi-arrows-v", label: "รายการรวมถอน", count: b.summationWithdrawPending, severity: "warning", route: "/financial/summation-withdraw", labelClass: "text-nav ml-2" },
    { icon: "pi-money-bill", label: "อนุมัติการถอนคืนเงิน", count: b.rebate, severity: "danger", route: "/financial/approve-rebet" },
    { icon: "pi-sitemap", label: "อนุมัติการถอนแนะนำเพื่อน", count: b.affiliate, severity: "danger", route: "/financial/approve-affiliate" },
    { icon: "pi-gift", label: "รายการโปรโมชั่น", count: b.promotion, severity: "danger", route: "/promotion/padding" },
    { icon: "pi-share-alt", label: "ยืนยันพันธมิตร", count: b.partner, severity: "danger", route: "/partner/pending" },
  ];

  const iconLink = (item: IconItem) => (
    <a key={item.icon} {...V} className={ICON_LINK} onClick={go(item.route)} {...tooltipHandlers(item.label)}>
      <i {...V} className={`pi ${item.icon} mr-2 p-text-white`}>
        {item.count > 0 && <Badge scope="data-v-fe864a8e" value={item.count} severity={item.severity} />}
      </i>{" "}
      <div {...V} className={item.labelClass ?? "text-nav"}>
        {item.label}
      </div>
    </a>
  );

  // Mobile-only hamburger (lg:hidden): slides the sidebar in, like the original's v-styleclass
  const onMobileMenu = (e: MouseEvent<HTMLElement>) => {
    const sidebar = document.getElementById("app-sidebar-12");
    if (sidebar) {
      toggleStyleClass(e.currentTarget, sidebar, {
        enterClass: "hidden",
        enterActiveClass: "fadeinleft",
        leaveToClass: "hidden",
        leaveActiveClass: "fadeoutleft",
        hideOnOutsideClick: true,
      });
    }
    onToggleSidebar();
  };

  return (
    <div
      {...V}
      data-v-4a0b3382=""
      style={{ position: "fixed", top: "0px", left: "0px", width: "100%", zIndex: 997 }}
    >
      <div
        {...V}
        className="surface-overlay pb-0 px-0 flex align-items-center justify-content-between border-bottom-1 relative lg:static surface-border shadow-orange-50"
        style={{ borderBottom: "0px solid !important", background: "linear-gradient(162deg, rgb(73, 73, 73), rgb(27, 27, 27))" }}
      >
        <a {...V} className="cursor-pointer block lg:hidden text-700 p-ripple text-white ml-3" onClick={onMobileMenu}>
          <i {...V} className="pi pi-bars text-3xl"></i>
        </a>{" "}
        <div {...V} className="text-center mt-1" style={{ width: "240px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> like the original */}
          <img {...V} src="/icon/Side-AUTO-FAST-TRACK.png" alt="" className="py-0" style={{ width: "180px" }} />
        </div>{" "}
        <div {...V} style={{ position: "absolute", left: "256px" }}>
          <div {...V} className="flex flex-row items-center" style={{ alignItems: "center" }}>
            <Button scope="data-v-fe864a8e" className="text-sm btn-toggle" icon="pi pi-align-justify" onClick={onToggleSidebar} />{" "}
            <div {...V} className="title-bar">
              <h3 {...V} className="title-b">
                {shell.merchantName}
              </h3>
            </div>{" "}
            {/* ORIGINAL: switches this session to the new back office design (never used here) */}
            <Button
              scope="data-v-fe864a8e"
              className="p-button-sm p-button-outlined p-button-secondary ml-3 btn-switch-version"
              icon="pi pi-sync"
              label="design ใหม่"
            />
          </div>
        </div>{" "}
        <a
          {...V}
          className="cursor-pointer block lg:hidden text-700 p-ripple mr-3 text-white"
          onClick={(e) => toggleNext(e, { enterClass: "hidden", leaveToClass: "hidden", hideOnOutsideClick: true })}
        >
          <i {...V} className="pi pi-ellipsis-v text-3x1"></i>
        </a>{" "}
        <ul
          {...V}
          className="list-none p-0 lg:p-0 m-0 lg:align-items-center select-none flex-column lg:flex-row absolute hidden lg:flex lg:static surface-overlay right-0 top-100 z-1 shadow-2 lg:shadow-none"
          style={{ background: "rgb(43, 43, 43) !important" }}
        >
          {" "}
          {leftItems.map((item) => (
            <Fragment key={item.icon}>
              {iconLink(item)}{" "}
            </Fragment>
          ))}
          <LanguagePicker />{" "}
          <li data-v-6e88f1b4="" {...V} className="lg:mr-1">
            {/* ORIGINAL: opens the "ดาวน์โหลด" panel of recent deposit exports */}
            <a data-v-6e88f1b4="" className={ICON_LINK} {...tooltipHandlers("ดาวน์โหลด", "bottom")}>
              <i data-v-6e88f1b4="" className="pi pi-file-export p-text-white"></i>
            </a>{" "}
          </li>{" "}
          {iconLink({ icon: "pi-bell", label: "แจ้งเตือน", count: b.notification, severity: "danger", route: "/notification" })}{" "}
          {/* ORIGINAL: opens the P2P pending-transfer panel */}
          <a
            {...V}
            className="flex p-2 align-items-center hover:bg-bluegray-900 border-round text-bluegray-100 hover:text-bluegray-50 font-medium cursor-pointer transition-colors transition-duration-150 p-ripple"
            {...tooltipHandlers("P2P")}
          >
            <span {...V} className="p2p-badge font-bold">
              {"P2P\n                    "}
              {b.p2p > 0 && <Badge scope="data-v-fe864a8e" value={b.p2p} severity="danger" />}
            </span>
          </a>{" "}
          {iconLink({
            icon: "pi-exclamation-triangle",
            label: "แจ้งเตือนพิเศษ",
            count: b.specialNotification,
            severity: "danger",
            route: "/notification-spacial",
          })}{" "}
          <UserMenu shell={shell} />
        </ul>
      </div>
    </div>
  );
}

const LANGUAGES = [
  { code: "th", label: "TH" },
  { code: "en", label: "EN" },
  { code: "php", label: "PHP" },
];

// TH / EN / PHP dropdown. Only Thai exists in this rebuild.
function LanguagePicker() {
  return (
    <li {...V} className="lg:mr-3">
      <a
        {...V}
        className="flex align-items-center hover:bg-bluegray-900 border-round text-bluegray-100 hover:text-bluegray-50 font-medium border-round cursor-pointer p-ripple"
        style={{ padding: "4px", background: "linear-gradient(162deg, rgb(255, 255, 255), rgb(207, 201, 201))", color: "black !important" }}
        onClick={(e) => toggleNext(e, DROPDOWN)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- same <img> as the original */}
        <img {...V} src="/icon/th.png" className="mr-0" style={{ width: "22px" }} />{" "}
        <span {...V} className="lg:ml-1">
          TH
        </span>{" "}
        <i {...V} className="pi pi-angle-down ml-auto"></i>
      </a>{" "}
      <ul
        {...V}
        className="list-none py-0 px-0 m-0 mt-0 lg:px-0 lg:py-0 border-round shadow-0 lg:shadow-2 lg:border-1 border-50 lg:absolute surface-overlay hidden origin-top w-full lg:w-5rem cursor-pointer"
      >
        {LANGUAGES.map((lang, i) => (
          <Fragment key={lang.code}>
            {i > 0 && " "}
            <li {...V} className="pb-2 text-center">
            {/* ORIGINAL: ChangeLang() reloads the i18n file and stores the choice */}
            <a {...V} className="cursor-pointer inline-flex align-items-center justify-content-center text-white border-2 text-600 transition-colors p-ripple w-full">
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- same <img> as the original */}
              <img {...V} src={`/icon/${lang.code}.png`} className="mr-0" style={{ width: "22px" }} />{" "}
              <span {...V} className="cursor-pointer text-600 white-space-nowrap ml-1">
                {lang.label}
              </span>
            </a>
            </li>
          </Fragment>
        ))}
      </ul>
    </li>
  );
}

// User name dropdown: profile, change password, logout.
function UserMenu({ shell }: { shell: ShellData }) {
  const router = useRouter();

  return (
    <li {...V} className="lg:mr-1">
      <a {...V} className={ICON_LINK} onClick={(e) => toggleNext(e, DROPDOWN)}>
        <i {...V} className="pi pi-users mr-2"></i>{" "}
        <span {...V}>{shell.username}</span>{" "}
        <i {...V} className="pi pi-angle-down ml-auto lg:ml-3"></i>
      </a>{" "}
      <ul
        {...V}
        className="list-none py-1 px-2 md:py-3 md:px-6 m-0 lg:px-0 mt-2 lg:py-0 border-round shadow-0 lg:shadow-2 lg:border-1 border-50 lg:absolute surface-overlay hidden origin-top cursor-pointer"
        style={{ width: "200px", left: "initial", right: "10px" }}
      >
        <li {...V} className="p-2 text-center">
          <div {...V} className="md:flex justify-content-between">
            <div {...V} className="md:flex-auto">
              <div {...V} className="avatar avatar-xl online">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img {...V} src="/images/user.png" alt="LSM Auto Fast Track" style={{ width: "45px" }} />
              </div>
            </div>{" "}
            <div {...V} className="md:flex-auto text-center">
              <div {...V} className="flex-1 font-light">
                {shell.displayName}
              </div>{" "}
              <div {...V} className="flex-1">
                {shell.username}
              </div>
            </div>
          </div>
        </li>{" "}
        <li {...V} className="p-1 pl-2 h-menu" onClick={() => router.push("/profile")}>
          <i {...V} className="pi pi-users pr-1" style={{ fontSize: "20px" }}></i>{" "}
          <span {...V} className="cursor-pointer white-space-nowrap">
            ข้อมูลส่วนตัว
          </span>
        </li>{" "}
        <li {...V} className="p-2 pl-2 h-menu" onClick={() => router.push("/change-password")}>
          <i {...V} className="pi pi-key pr-1" style={{ fontSize: "20px" }}></i>{" "}
          <span {...V} className="cursor-pointer white-space-nowrap">
            เปลี่ยนรหัสผ่าน
          </span>
        </li>{" "}
        {/* ORIGINAL: logs out and goes to /login */}
        <li {...V} className="p-3 user-footer text-center foot-menu">
          <i {...V} className="pi pi-sign-out pr-1" style={{ fontSize: "20px" }}></i>{" "}
          <span {...V} className="cursor-pointer white-space-nowrap">
            ออกจากระบบ
          </span>
        </li>
      </ul>
    </li>
  );
}
