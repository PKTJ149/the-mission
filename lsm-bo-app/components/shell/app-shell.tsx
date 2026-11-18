"use client";

import { useState, type ReactNode } from "react";
import type { ShellData } from "@/lib/api/shell";
import { Sidebar } from "./sidebar";
import { SupportWidget } from "./support-widget";
import { Topbar } from "./topbar";

// layouts/default (data-v-4a0b3382): fixed top bar, sidebar, content column, support button.
// The hamburger (btn-toggle) collapses the sidebar to 0 px; it widens again on hover (CSS).
// Like the original's btn_menu store it is not saved, so every page load starts expanded.
export function AppShell({ shell, children }: { shell: ShellData; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((value) => !value);

  return (
    <div data-v-4a0b3382="" className="min-h-screen flex flex-column surface-ground">
      <Topbar shell={shell} onToggleSidebar={toggle} />{" "}
      <div data-v-4a0b3382="" className="flex relative lg:static p-0 flex-auto">
        <Sidebar merchantName={shell.merchantName} collapsed={collapsed} />{" "}
        <div data-v-4a0b3382="" className="flex flex-column flex-auto">
          <div data-v-4a0b3382="" className="flex-auto lg:m-3 p-2 pt-6">
            {/* Empty PrimeVue toast containers (groups "bc" and "notification") */}
            <div data-v-4a0b3382="" className="p-toast p-component p-toast-top-right" style={{ zIndex: 1000 }}>
              <div></div>
            </div>{" "}
            <div data-v-4a0b3382="" className="p-toast p-component p-toast-top-right" style={{ zIndex: 1001 }}>
              <div></div>
            </div>{" "}
            <div data-v-4a0b3382="" className="style-content mt-2">
              {" "}
              <div data-v-4a0b3382="">{children}</div>
            </div>
          </div>
        </div>{" "}
      </div>{" "}
      <SupportWidget repliedCount={shell.supportRepliedCount} />{" "}
    </div>
  );
}
