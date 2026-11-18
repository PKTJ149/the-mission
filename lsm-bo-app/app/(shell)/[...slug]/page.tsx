import type { Metadata } from "next";
import { allMenuRoutes } from "@/lib/menu";

export const metadata: Metadata = { title: "LSM-SYSTEM:" };

// Pages the top bar and user menu link to, on top of the sidebar menu.
const OTHER_ROUTES = ["/notification", "/notification-spacial", "/promotion/padding", "/profile", "/change-password"];

// Prerender every known original URL (the shell reads the URL to highlight the menu item).
export function generateStaticParams() {
  return [...allMenuRoutes(), ...OTHER_ROUTES]
    // Pages that have their own route folder
    .filter((route) => route !== "/dashboard" && route !== "/minigames")
    .map((route) => ({ slug: route.slice(1).split("/") }));
}

// Every page that is not rebuilt yet: the shell with its menu item highlighted and an empty
// content area. Any other URL gets the same empty shell.
export default function NotBuiltPage() {
  return null;
}
