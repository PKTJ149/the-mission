import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-ibm-plex-thai",
  weight: ["400", "600", "700"],
  subsets: ["thai", "latin"],
});

export const metadata: Metadata = {
  title: "Wallet",
  description: "Mobile wallet screen",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#010101",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${ibmPlexSansThai.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
