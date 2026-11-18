"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useState, type MouseEvent } from "react";
import { Badge } from "@/components/primevue/badge";
import "@/lib/allow-nested-li";
import { useMounted } from "@/lib/use-mounted";
import { MENU, openGroupFor, type MenuGroup, type MenuLink, type MenuSubGroup } from "@/lib/menu";
import { toggleStyleClass } from "@/lib/primevue/dom";
import { featuredActiveClass, featuredRowClass, MinigamesBadge, MinigamesIcon } from "./minigames-icon";

// layouts/Sidebar (data-v-6494a8d6) + layouts/MenuItem (data-v-193bc688).
const S = { "data-v-6494a8d6": "" };
const M = { "data-v-193bc688": "" };

const ITEM_CLASS =
  "flex no-underline align-items-center cursor-pointer hover:bg-green-50 border-round text-white hover:text-green-500 hover:border-green-500 hover:border-right-2 hover:p-ripple transition-duration-150 transition-colors p-ripple";
const ITEM_ACTIVE_CLASS = "bg-green-50 transition-duration-150 transition-colors text-green-500 border-green-500 border-right-2 p-ripple";
// Our featured "Minigames" row (see minigames-icon.module.css for its colour and animation)
const FEATURED_CLASS = "flex no-underline align-items-center cursor-pointer text-white p-ripple";
const GROUP_CLASS =
  "flex align-items-center cursor-pointer hover:bg-bluegray-900 border-round text-white hover:text-bluegray-50 transition-duration-150 transition-colors border-right-2 border-transparent p-ripple";
const SUBGROUP_CLASS = "flex align-items-center cursor-pointer p-3 border-round text-white transition-duration-150 transition-colors p-ripple";
const GROUP_LIST_CLASS = "list-none py-0 pl-3 pr-0 m-0 overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out";
const SUBGROUP_LIST_CLASS = "list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out";

// v-styleclass on every group header: slide the next <ul> open / closed
function toggleGroup(e: MouseEvent<HTMLElement>) {
  const list = e.currentTarget.nextElementSibling as HTMLElement | null;
  if (list) {
    toggleStyleClass(e.currentTarget, list, {
      enterClass: "hidden",
      enterActiveClass: "slidedown",
      leaveToClass: "hidden",
      leaveActiveClass: "slideup",
    });
  }
}

// The original writes these paddings with !important, which React's style prop cannot do,
// so they are set through cssText (same resulting style attribute).
const NORMAL_PADDING = "padding: 13px !important;";
const COLLAPSED_PADDING =
  "padding-left: 0px !important; padding-right: 13px !important; padding-top: 13px !important; padding-bottom: 13px !important;";

const trimSlash = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);

type ItemProps = {
  item: MenuLink;
  pathname: string;
  collapsed: boolean;
  // Items the original renders with an `isActive` attribute (it falls through as isactive="true")
  passIsActive?: boolean;
};

function MenuItem({ item, pathname, collapsed, passIsActive }: ItemProps) {
  // MenuItem.active: the current path starts with the item's route (so parents of sub-pages light up too)
  const active = trimSlash(pathname).startsWith(trimSlash(item.route));
  const exact = trimSlash(pathname) === trimSlash(item.route);
  const router = useRouter();
  // nuxt-link adds its router classes between the static and the active classes
  const linkClass = item.featured
    ? `${FEATURED_CLASS} ${featuredRowClass}${active ? ` ${featuredActiveClass}` : ""}`
    : active
      ? `${ITEM_CLASS}${exact ? " nuxt-link-exact-active" : ""} nuxt-link-active ${ITEM_ACTIVE_CLASS}`
      : ITEM_CLASS;
  const setPadding = (el: HTMLElement | null) => {
    if (el) el.style.cssText = collapsed ? COLLAPSED_PADDING : NORMAL_PADDING;
  };

  const content = item.featured ? (
    <>
      <MinigamesIcon />
      <span {...M} className="font-medium">
        {item.title}
      </span>
      <MinigamesBadge />
    </>
  ) : (
    <>
      <i {...M} className={`mr-2 ${item.icon}`} style={active ? { color: "rgb(53, 123, 56)" } : undefined}></i>{" "}
      <span {...M} className={active ? "font-medium text-green-700" : "font-medium"}>
        {item.title}
      </span>{" "}
    </>
  );
  // The featured row has its own background, so it skips the green hover/active classes
  const actionClass = item.featured ? `${FEATURED_CLASS} ${featuredRowClass}` : active ? `${ITEM_CLASS} ${ITEM_ACTIVE_CLASS}` : ITEM_CLASS;

  return (
    <li {...M} {...S} {...(passIsActive && collapsed ? { isactive: "true" } : {})}>
      {item.action ? (
        // ORIGINAL: runs an action instead of navigating (opens the bot-bank site, or asks the API
        // for the mini-game / SMS admin login URL and opens it in a new tab)
        <div {...M} {...{ to: item.route }} className={actionClass} ref={setPadding}>
          {content}
        </div>
      ) : item.route.endsWith("/") ? (
        // Next's <Link> would drop the trailing slash from href ("/agent/" → "/agent")
        <a
          {...M}
          href={item.route}
          aria-current={exact ? "page" : undefined}
          className={linkClass}
          ref={setPadding}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            router.push(item.route);
          }}
        >
          {content}
        </a>
      ) : (
        <Link
          {...M}
          href={item.route}
          aria-current={exact ? "page" : undefined}
          className={linkClass}
          ref={setPadding}
        >
          {content}
        </Link>
      )}
    </li>
  );
}

function SubGroup({ group, pathname, collapsed }: { group: MenuSubGroup; pathname: string; collapsed: boolean }) {
  return (
    <li {...S}>
      <div {...S}>
        <a {...S} className={SUBGROUP_CLASS} onClick={toggleGroup}>
          <i {...S} className={`mr-2 ${group.icon}`}></i>{" "}
          <span {...S} className="font-medium">
            {group.title}
          </span>{" "}
          <i {...S} className="pi pi-chevron-down ml-auto"></i>
        </a>{" "}
        <ul {...S} className={SUBGROUP_LIST_CLASS}>
          {group.items.map((item) => (
            <MenuItem key={item.route} item={item} pathname={pathname} collapsed={collapsed} />
          ))}
        </ul>
      </div>
    </li>
  );
}

type GroupProps = { group: MenuGroup; pathname: string; collapsed: boolean; open: boolean };

function Group({ group, pathname, collapsed, open }: GroupProps) {
  return (
    <li {...S}>
      <a {...S} className={`${GROUP_CLASS} ${collapsed ? "main-nemu" : "normal-menu"}`} onClick={toggleGroup}>
        <i {...S} className={`mr-2 ${group.icon}`}></i>{" "}
        <span {...S} className="font-medium">
          {group.title}
        </span>
        {"\n                 \n                "}
        {/* ORIGINAL: "จัดการการเงิน" shows a count badge when its own noti counters are > 0 (they were 0) */}{" "}
        <div {...S} className="ml-auto">
          <i {...S} className="pi pi-chevron-down ml-2"></i>
        </div>
      </a>{" "}
      <ul {...S} className={open ? GROUP_LIST_CLASS : `${GROUP_LIST_CLASS} hidden`}>
        {group.submenu && " "}
        {group.items.map((item) =>
          item.kind === "subgroup" ? (
            <SubGroup key={item.title} group={item} pathname={pathname} collapsed={collapsed} />
          ) : group.submenu ? (
            <li key={item.route} {...S}>
              <MenuItem item={item} pathname={pathname} collapsed={collapsed} passIsActive />
            </li>
          ) : (
            <MenuItem key={item.route} item={item} pathname={pathname} collapsed={collapsed} passIsActive />
          ),
        )}
        {!group.submenu && " "}
      </ul>{" "}
    </li>
  );
}

type SidebarProps = { merchantName: string; collapsed: boolean };

export function Sidebar({ merchantName, collapsed }: SidebarProps) {
  const pathname = usePathname();
  const mounted = useMounted();
  // Like the original's routeCheck(), only the page you land on decides which group starts open;
  // after that the groups keep whatever you toggled. The one exception (its $route watcher):
  // going to a /merchant-staffs/ page opens "การจัดการพนักงาน".
  const [openGroup, setOpenGroup] = useState(() => openGroupFor(pathname));
  if (pathname.startsWith("/merchant-staffs/") && openGroup !== "staffmanagement") setOpenGroup("staffmanagement");

  return (
    <div
      {...S}
      data-v-4a0b3382=""
      id="app-sidebar-12"
      className={`h-full background-sidebar lg:h-auto hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border md:w-auto py-6${collapsed ? " hide-menu" : ""}`}
      style={{ background: "linear-gradient(162deg, rgb(73, 73, 73), rgb(27, 27, 27))", zIndex: "99 !important" }}
    >
      <div {...S} className="flex flex-column h-full">
        <div {...S} className="overflow-y-auto">
          <ul {...S} className="list-none px-2 pb-2 pt-3 m-0" style={{ width: "240px" }}>
            <li {...S}>
              <ul {...S} className="list-none p-0 m-0 overflow-hidden title-nav">
                <li {...S} className="title-bar">
                  <h3 {...S} className="title-b">
                    {merchantName}
                  </h3>
                </li>
              </ul>{" "}
              <ul {...S} className="list-none p-0 m-0 overflow-hidden">
                {/* The original nests <li> directly in <li>. HTML parsing would "fix" that in
                    server-rendered markup, so the menu is rendered in the browser only. */}
                {mounted &&
                  MENU.map((entry) =>
                    entry.kind === "group" ? (
                      <Group
                        key={entry.key}
                        group={entry}
                        pathname={pathname}
                        collapsed={collapsed}
                        open={openGroup === entry.key}
                      />
                    ) : (
                      <Fragment key={entry.route}>
                        <li {...S}>
                          {"  "}
                          <MenuItem item={entry} pathname={pathname} collapsed={collapsed} />
                        </li>
                      </Fragment>
                    ),
                  )}
              </ul>
            </li>
          </ul>
        </div>
      </div>{" "}
      <div {...S} className="text-white">
        <small {...S}>
          <Badge scope="data-v-6494a8d6" className="mr-1" severity="danger" />{" "}
          <Badge scope="data-v-6494a8d6" className="mr-1" severity="warning" />{" "}
          <Badge scope="data-v-6494a8d6" className="mr-2" severity="success" />
          {"\n      V 1.0.0\n    "}
        </small>
      </div>
    </div>
  );
}
