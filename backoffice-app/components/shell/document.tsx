import Script from "next/script";
import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import { SwalBackdrop } from "@/components/ui/popup";
import { CKEDITOR_SCRIPT_ID, CKEDITOR_SRC } from "@/components/ui/ckeditor-config";
import { AppShell } from "./app-shell";
import { COMMON_HEAD, PAGE_GROUPS, type HeadItem, type PageGroupKey } from "./page-groups";

// Plain <link>/<style> tags straight inside <head>, without React's `precedence`, so React keeps
// them in exactly this order (precedence would regroup and hoist them).
function HeadItems({ items }: { items: HeadItem[] }) {
  return items.map((item) =>
    "href" in item ? (
      <link key={item.href} rel="stylesheet" href={item.href} />
    ) : (
      <style key={item.id} dangerouslySetInnerHTML={{ __html: item.css }} />
    ),
  );
}

// The whole original document for one page group: <html> attributes, the stylesheet order,
// the shell, and the body-level extras (#back-to-top, #preloader, #hiddenRole, .swal-backdrop).
// Every app/(group)/layout.tsx is just <BackOfficeDocument group="…">{children}</BackOfficeDocument>.
export function BackOfficeDocument({ group, children }: { group: PageGroupKey; children: ReactNode }) {
  const page = PAGE_GROUPS[group];

  return (
    <html
      lang="en"
      data-layout="vertical"
      data-topbar="light"
      data-sidebar="dark"
      data-sidebar-size="lg"
      data-sidebar-image="none"
      data-preloader="disable"
    >
      <head>
        <meta content="Themesbrand" name="author" />
        {/* Same tab icon as the original (served from the original host, like content images) */}
        <link rel="shortcut icon" href="https://op.88ref.com/assets/images/favicon.ico" />
        <HeadItems items={[...COMMON_HEAD, ...page.head]} />
      </head>
      <body>
        <I18nProvider>
          <AppShell wrapperClassName={page.wrapperClassName}>{children}</AppShell>
        </I18nProvider>

        {/* Hidden by CSS like on the original (app.js, which would show it on scroll, is not loaded there) */}
        <button className="btn btn-danger btn-icon" id="back-to-top">
          <i className="ri-arrow-up-line"></i>
        </button>
        {/* Invisible because <html data-preloader="disable"> */}
        <div id="preloader">
          <div id="status">
            <div className="spinner-border text-primary avatar-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <input type="hidden" id="hiddenRole" />
        <SwalBackdrop />

        {/* <lord-icon> web component used by loading / empty states */}
        <Script src="/assets/js/pages/plugins/lord-icon-2.1.0.js" strategy="afterInteractive" />
        {page.ckeditor && <Script id={CKEDITOR_SCRIPT_ID} src={CKEDITOR_SRC} strategy="afterInteractive" />}
      </body>
    </html>
  );
}
