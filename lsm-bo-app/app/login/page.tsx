import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { LoginPage } from "./_components/login-page";

export const metadata: Metadata = { title: "LSM-SYSTEM: เข้าสู่ระบบ" };

// Kanit 400–700 as --mg-font, the variable the promo banners use
const kanit = Kanit({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--mg-font",
  display: "swap",
});

// Our own login page (mockup, PK 16/11/2026): no shell, the promo banners auto-slide on the left,
// and "เข้าสู่ระบบ" goes straight to the dashboard without checking anything.
export default function Login() {
  return <LoginPage fontClassName={kanit.variable} />;
}
