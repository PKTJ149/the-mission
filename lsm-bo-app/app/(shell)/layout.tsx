import { Suspense, type ReactNode } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { getShellData } from "@/lib/api/shell";

// Every page inside the back office: top bar + sidebar around the content.
// (/login lives outside this group, so it has no shell.)
export default async function ShellLayout({ children }: { children: ReactNode }) {
  const shell = await getShellData();

  return (
    // The shell reads the URL (active menu item), which is unknown while prerendering pages
    // outside the menu list; Suspense lets those render on request.
    <Suspense>
      <AppShell shell={shell}>{children}</AppShell>
    </Suspense>
  );
}
