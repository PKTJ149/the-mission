import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false while rendering on the server and during hydration, true afterwards.
// Used for markup that must not be server-rendered (see the sidebar).
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

// "Now" as of the first time the browser asked, or null on the server. Pages default their date
// pickers to it, like the original's `new Date()` in data(); it stays the same object afterwards.
let today: Date | null = null;
const readToday = () => (today ??= new Date());

export function useToday() {
  return useSyncExternalStore(subscribe, readToday, () => null);
}
