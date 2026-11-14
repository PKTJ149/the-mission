"use client";

import { useCallback, useId, useRef, useState, useSyncExternalStore, type AnimationEvent, type MouseEvent } from "react";

// Port of the `Popup` singleton in helper.js, shared by CustomSweetAlert and CustomModal:
// one .swal-backdrop for the whole page, one popup open at a time (opening another closes
// the previous wrapper at once), body scroll locked while open, bounceIn / bounceOut on the content.

type Active = { id: string; forceClose: () => void };

let active: Active | null = null;
let backdrop = { show: false, visible: false };
let hideTimer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((notify) => notify());
}

function popupOpened(entry: Active) {
  if (active && active.id !== entry.id) active.forceClose();
  active = entry;
  clearTimeout(hideTimer);
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = "0";
  backdrop = { show: true, visible: true };
  emit();
}

function popupClosed(id: string) {
  if (active?.id !== id) return;
  active = null;
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  backdrop = { ...backdrop, show: false };
  emit();
  // The backdrop fades out, then goes display:none 700 ms later (closeBackdrop)
  hideTimer = setTimeout(() => {
    if (active) return;
    backdrop = { show: false, visible: false };
    emit();
  }, 700);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const SERVER_BACKDROP = { show: false, visible: false };

// <div class="swal-backdrop"> — rendered once by the shell at the end of <body>
export function SwalBackdrop() {
  const state = useSyncExternalStore(subscribe, () => backdrop, () => SERVER_BACKDROP);
  return <div className={state.show ? "swal-backdrop show" : "swal-backdrop"} style={state.visible ? undefined : { display: "none" }}></div>;
}

export type PopupDismiss = "close" | "backdrop" | "confirm" | "cancel" | "timeout" | "closeImmediately";

type Phase = "closed" | "in" | "open" | "out";

// State of one popup (a .system-swal or .system-modal). Returns the classes and handlers to spread.
export function usePopup(options: { closeOnBackdrop?: boolean; onClosed?: (reason: PopupDismiss) => void } = {}) {
  const id = useId();
  const [phase, setPhase] = useState<Phase>("closed");
  const [everOpened, setEverOpened] = useState(false);
  const reason = useRef<PopupDismiss>("close");
  const closeOnBackdrop = useRef(options.closeOnBackdrop ?? true);
  const onClosed = useRef(options.onClosed);
  const fallback = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const finish = useCallback(() => {
    clearTimeout(fallback.current);
    setPhase("closed");
    popupClosed(id);
    onClosed.current?.(reason.current);
  }, [id]);

  const open = useCallback(
    (openOptions: { closeOnBackdrop?: boolean; onClosed?: (reason: PopupDismiss) => void } = {}) => {
      closeOnBackdrop.current = openOptions.closeOnBackdrop ?? options.closeOnBackdrop ?? true;
      onClosed.current = openOptions.onClosed ?? options.onClosed;
      reason.current = "close";
      setEverOpened(true);
      setPhase("in");
      popupOpened({
        id,
        // Another popup opened: this one disappears without animation (Popup.openPopup force)
        forceClose: () => {
          setPhase("closed");
          onClosed.current?.("closeImmediately");
        },
      });
    },
    [id, options.closeOnBackdrop, options.onClosed],
  );

  const close = useCallback(
    (why: PopupDismiss = "close") => {
      reason.current = why;
      setPhase((current) => (current === "closed" ? current : "out"));
      // Safety net in case animationend never fires (e.g. reduced motion)
      clearTimeout(fallback.current);
      fallback.current = setTimeout(finish, 900);
    },
    [finish],
  );

  const onAnimationEnd = (event: AnimationEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (phase === "out") finish();
    else if (phase === "in") setPhase("open");
  };

  // Clicking the dark area: the wrapper itself is the target (.swal-wrapper has pointer-events:none)
  const onWrapperMouseDown = (event: MouseEvent<HTMLElement>) => {
    if (closeOnBackdrop.current && event.target === event.currentTarget && phase !== "closed") close("backdrop");
  };

  const shown = phase !== "closed";
  return {
    isOpen: shown,
    open,
    close,
    // classes for the outer .system-swal / .system-modal
    wrapperState: [everOpened ? "popup-wrapper" : "", shown ? "show" : ""].filter(Boolean).join(" "),
    // classes for .swal-content / .modal-container
    contentState: phase === "in" ? "animate__bounceIn" : phase === "out" ? "animate__bounceOut" : "",
    onAnimationEnd,
    onWrapperMouseDown,
  };
}

export type PopupControl = ReturnType<typeof usePopup>;
