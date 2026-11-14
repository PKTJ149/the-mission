import { useSyncExternalStore } from "react";

export const MOBILE_WIDTH = 430; // Figma mobile frame width

// Phones narrower than 430px scale the whole Figma layout down instead of cutting it off
function subscribeToResize(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

export function useMobileZoom() {
  return useSyncExternalStore(
    subscribeToResize,
    () => Math.min(1, document.documentElement.clientWidth / MOBILE_WIDTH),
    () => 1,
  );
}
