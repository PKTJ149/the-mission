import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "LSM-SYSTEM:",
  formatDetection: { telephone: false },
  icons: { icon: "/01-icon-MC-.ico" },
};

// The original's 75 <style> tags, recovered unchanged, in document order (00 … 74).
const STYLESHEETS = Array.from({ length: 75 }, (_, i) => `/lsm-css/${String(i).padStart(2, "0")}.css`);

// Same document as the original Nuxt SPA: <html lang="en" translate="no">, #__nuxt > #__layout > layout.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" translate="no">
      <head>
        {/* Plain <link> tags without `precedence`, so React keeps them in exactly this order */}
        {STYLESHEETS.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body className="">
        <div id="__nuxt">
          {/* app/(shell)/layout.tsx adds the top bar + sidebar; /login has none */}
          <div id="__layout">{children}</div>
        </div>
      </body>
    </html>
  );
}
