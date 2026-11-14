import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BackOfficeDocument } from "@/components/shell/document";

// The only <title> captured (shell.html); other pages set theirs with `export const metadata`
export const metadata: Metadata = { title: "ตั้งค่ามินิเกมส์" };

// Root layout for /promotion/mini-game-v2 (+ / and /dev/components).
// Each route group is its own root layout so it can carry the original page's own <head>.
export default function Layout({ children }: { children: ReactNode }) {
  return <BackOfficeDocument group="minigameSettings">{children}</BackOfficeDocument>;
}
