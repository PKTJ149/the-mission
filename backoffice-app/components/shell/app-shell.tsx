"use client";

import { useState, type ReactNode } from "react";
import { RemoveNotificationModal } from "./remove-notification-modal";
import { Sidebar } from "./sidebar";

type AppShellProps = { wrapperClassName: string; children: ReactNode };

// #layout-wrapper > sidebar, overlays and .main-content (with the Logout chip) — shell.html.
// The collapse arrow adds "close-menu close-menu-js" to #layout-wrapper and flips the chevron.
// The original's handler was not captured (inline layout script); nothing shows it persisting
// the state, so it is not saved — every page load starts expanded, as in the capture.
export function AppShell({ wrapperClassName, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const className = collapsed ? [wrapperClassName, "close-menu close-menu-js"].filter(Boolean).join(" ") : wrapperClassName;

  return (
    <div id="layout-wrapper" className={className}>
      <RemoveNotificationModal />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />

      <div className="vertical-overlay"></div>
      <div className="vertical-overlay"></div>

      <div className="main-content">
        {/* Logout does nothing here (mock app); hidden by CSS on layout-mission-report pages */}
        <div className="btn-logout-custom-mini-game logout">
          <h4 className="mb-0">Logout</h4>
          <svg className="ms-2" width="24" height="24" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.69179 5.7824C7.69971 2.67308 12.2715 2.17071 15.7859 4.27046C16.2742 4.5622 16.4412 5.20786 16.1591 5.71259C15.8768 6.21733 15.2522 6.38999 14.764 6.09826C12.0299 4.46478 8.47361 4.8587 6.13591 7.2752C3.34442 10.1608 3.34442 14.8392 6.13591 17.7249C8.47361 20.1413 12.0299 20.5352 14.764 18.9017C15.2522 18.6101 15.8768 18.7826 16.1591 19.2874C16.4412 19.7922 16.2742 20.4378 15.7859 20.7295C12.2715 22.8293 7.69971 22.3269 4.69179 19.2176C1.10274 15.5076 1.10274 9.49242 4.69179 5.7824ZM17.6163 8.58689C18.0151 8.17466 18.6617 8.17466 19.0604 8.58689L20.9916 10.5832C21.1739 10.7716 21.3514 10.9549 21.4895 11.123C21.641 11.3076 21.804 11.5418 21.9001 11.8476C22.0333 12.2717 22.0333 12.7284 21.9001 13.1523C21.804 13.4582 21.641 13.6925 21.4895 13.877C21.3514 14.045 21.1739 14.2285 20.9916 14.4168L19.0604 16.4131C18.6617 16.8253 18.0151 16.8253 17.6163 16.4131C17.2176 16.0009 17.2176 15.3325 17.6163 14.9203L18.9366 13.5556H11.1903C10.6264 13.5556 10.1692 13.083 10.1692 12.5C10.1692 11.917 10.6264 11.4444 11.1903 11.4444H18.9366L17.6163 10.0797C17.2176 9.66747 17.2176 8.99911 17.6163 8.58689Z"
            />
          </svg>
        </div>

        {children}
      </div>
    </div>
  );
}
