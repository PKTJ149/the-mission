"use client";

import { useCallback, useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type TransitionEvent } from "react";
import { createPortal } from "react-dom";
import { cx } from "./cx";

// Bootstrap 5.2 offcanvas (bootstrap.bundle.min.js on the original), re-done in React:
// .showing → .show while it slides in, .show.hiding → nothing while it slides out,
// <div class="offcanvas-backdrop fade show"> appended to <body>, body scroll locked.

type Phase = "hidden" | "showing" | "shown" | "hiding";
type BackdropPhase = "none" | "mounted" | "show";

type OffcanvasOptions = {
  backdrop?: boolean | "static"; // default true; "static" = clicking the backdrop does nothing
  keyboard?: boolean; // Escape closes, default true
  onShown?: () => void;
  onHidden?: () => void;
};

const TRANSITION_MS = 300; // .offcanvas transition: transform .3s
const BACKDROP_MS = 150; // .fade transition: opacity .15s

function lockBodyScroll() {
  const width = Math.abs(window.innerWidth - document.documentElement.clientWidth);
  document.body.style.overflow = "hidden";
  if (width > 0) document.body.style.paddingRight = `${width}px`;
}

function unlockBodyScroll() {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}

// const offcanvas = useOffcanvas();  offcanvas.show();  offcanvas.hide();
export function useOffcanvas(options: OffcanvasOptions = {}) {
  const [phase, setPhaseState] = useState<Phase>("hidden");
  const [backdrop, setBackdrop] = useState<BackdropPhase>("none");
  const phaseRef = useRef<Phase>("hidden");
  const latest = useRef(options);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    latest.current = options;
  });

  const setPhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  // Called when the slide transition ends (or by the timer if transitionend never comes)
  const finish = useCallback(
    (from: Phase) => {
      if (phaseRef.current !== from) return;
      clearTimeout(timer.current);
      if (from === "showing") {
        setPhase("shown");
        latest.current.onShown?.();
      } else {
        setPhase("hidden");
        unlockBodyScroll();
        latest.current.onHidden?.();
      }
    },
    [setPhase],
  );

  const show = useCallback(() => {
    if (phaseRef.current === "showing" || phaseRef.current === "shown") return;
    lockBodyScroll();
    setPhase("showing");
    if (latest.current.backdrop !== false) {
      setBackdrop("mounted");
      // add .show on the next frame so the fade runs (Bootstrap reflows in between)
      requestAnimationFrame(() => setBackdrop("show"));
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => finish("showing"), TRANSITION_MS + 5);
  }, [finish, setPhase]);

  const hide = useCallback(() => {
    if (phaseRef.current !== "showing" && phaseRef.current !== "shown") return;
    setPhase("hiding");
    setBackdrop((current) => (current === "none" ? current : "mounted"));
    setTimeout(() => setBackdrop((current) => (current === "mounted" ? "none" : current)), BACKDROP_MS);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => finish("hiding"), TRANSITION_MS + 5);
  }, [finish, setPhase]);

  // Escape closes (Bootstrap "keyboard" option). Bootstrap listens on the offcanvas element itself,
  // so it only works while focus is inside it (on the original, focus stays on the button that
  // opened it until the user clicks a field). <Offcanvas> calls this from that element's keydown.
  const onEscapeKey = useCallback(() => {
    if (latest.current.keyboard !== false) hide();
  }, [hide]);

  const onTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (phase === "showing" || phase === "hiding") finish(phase);
  };

  const onBackdropClick = () => {
    if (latest.current.backdrop === "static") return;
    hide();
  };

  return { phase, isOpen: phase === "showing" || phase === "shown", show, hide, backdrop, onTransitionEnd, onBackdropClick, onEscapeKey };
}

export type OffcanvasControl = ReturnType<typeof useOffcanvas>;

type OffcanvasProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  control: OffcanvasControl;
  // Full static class list as captured, e.g. "offcanvas offcanvas-end offcanvas-minigame-custom"
  className: string;
  children: ReactNode;
  [dataAttribute: `data-${string}`]: string | undefined;
};

const STATE_CLASS: Record<Phase, string> = { hidden: "", showing: "showing", shown: "show", hiding: "show hiding" };

export function Offcanvas({ control, className, children, ...rest }: OffcanvasProps) {
  // Bootstrap sets aria-modal/role when showing starts and removes them once hidden
  const open = control.phase !== "hidden";
  const ref = useRef<HTMLDivElement>(null);
  const { onEscapeKey } = control;
  // Bootstrap 5.2 appends the backdrop to the offcanvas's parent (.main-content on every page), not <body>
  const [backdropRoot, setBackdropRoot] = useState<HTMLElement | null>(null);
  const setElement = useCallback((element: HTMLDivElement | null) => {
    ref.current = element;
    setBackdropRoot(element?.parentElement ?? null);
  }, []);

  // A native listener (not React's onKeyDown): keys typed in dropdowns that render into <body>
  // (select2, flatpickr…) must not count as "inside", exactly like on the original DOM.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscapeKey();
    };
    element.addEventListener("keydown", onKey);
    return () => element.removeEventListener("keydown", onKey);
  }, [onEscapeKey]);

  return (
    <>
      {/* No tabindex: the original offcanvases have none, so a click on empty space inside does not
          focus the panel (and Escape then does not close it). Pass tabIndex if one ever needs it. */}
      <div
        ref={setElement}
        {...rest}
        className={cx(className, STATE_CLASS[control.phase])}
        aria-modal={open ? true : undefined}
        role={open ? "dialog" : undefined}
        onTransitionEnd={control.onTransitionEnd}
      >
        {children}
      </div>
      {control.backdrop !== "none" &&
        createPortal(
          <div
            className={control.backdrop === "show" ? "offcanvas-backdrop fade show" : "offcanvas-backdrop fade"}
            onClick={control.onBackdropClick}
          ></div>,
          backdropRoot ?? document.body,
        )}
    </>
  );
}
