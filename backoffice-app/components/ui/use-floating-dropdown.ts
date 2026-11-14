"use client";

import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";

// The original CustomDropdown (legacy-js/helper.js) keeps .custom-dropdown position:fixed
// and writes top/left/width/max-height onto it whenever it opens, scrolls or resizes.
// This file is a straight port of that, so dropdowns land on exactly the same pixels.

export type Placement = "top" | "left" | "right" | "bottom" | "center";

export type FloatingOptions = {
  placement?: [Placement, Placement]; // default ["bottom", "left"]
  lockPlacement?: [Placement, Placement];
  auto?: boolean; // flip to the side with more room (like the original "auto")
  horizontal?: boolean;
  stretch?: boolean; // dropdown width = anchor width
  offsetX?: number;
  offsetY?: number;
  offsetMargin?: number; // gap between anchor and dropdown, default 5
  maxHeight?: number;
  noMaxHeight?: boolean;
};

const PLACEMENTS: Placement[] = ["top", "left", "right", "bottom", "center"];

// Port of CustomDropdown.calculate()
export function positionDropdown(dropdown: HTMLElement, anchor: HTMLElement, options: FloatingOptions = {}) {
  const wh = window.innerHeight;
  const ww = window.innerWidth;
  let placementA: Placement = options.placement ? options.placement[0] : "bottom";
  let placementB: Placement = options.placement ? options.placement[1] : "left";

  if (options.lockPlacement) {
    const [pA, pB] = options.lockPlacement;
    if (PLACEMENTS.includes(pA)) placementA = pA;
    if (PLACEMENTS.includes(pB)) placementB = pB;
  }

  dropdown.style.inset = "auto";
  dropdown.style.width = "";
  dropdown.style.maxHeight = "";

  const rect = anchor.getBoundingClientRect();
  const box = dropdown.getBoundingClientRect();
  const offsetMargin = options.offsetMargin ?? 5;
  const offsetX = options.offsetX ?? 0;
  const offsetY = options.offsetY ?? 0;

  let bh = box.height;
  let bw = box.width;
  const { x: rx, y: ry, width: rw, height: rh } = rect;

  if (options.stretch) bw = rw;

  if (options.auto) {
    const rcx = rx + rw / 2;
    const rcy = ry + rh / 2;
    const cx = ww / 2;
    const cy = wh / 2;

    if (options.horizontal || placementA === "left" || placementA === "right") {
      placementA = rcx > cx ? "left" : "right";
      placementB = rcy <= cy ? "top" : "bottom";
    } else if (placementA === "top" || placementA === "bottom") {
      placementA = rcy > cy ? "top" : "bottom";
      placementB = rcx <= cx ? "left" : "right";
    }
  }

  if (!options.noMaxHeight) {
    let safeMax: number | null = null;
    if (placementA === "top") safeMax = options.maxHeight || wh - (wh - ry + offsetMargin + 20);
    if (placementA === "bottom") safeMax = options.maxHeight || wh - (ry + rh + offsetMargin + 20);

    if (safeMax !== null) {
      if (bh > safeMax) bh = safeMax;
      dropdown.style.maxHeight = safeMax + "px";
    }
  }

  const horizontal = () => {
    if (placementB === "top") dropdown.style.top = ry + offsetY + "px";
    if (placementB === "bottom") dropdown.style.top = ry - (bh - rh) + offsetY + "px";
    if (placementB === "center") dropdown.style.top = ry - (bh - rh) / 2 + offsetY + "px";
  };

  const vertical = () => {
    if (placementB === "left") {
      dropdown.style.left = rx + offsetX + "px";
      if (options.stretch) dropdown.style.width = rw + "px";
    }
    if (placementB === "right") {
      dropdown.style.left = rx + (rw - bw) + offsetX + "px";
      if (options.stretch) dropdown.style.width = rw + "px";
    }
    if (placementB === "center") dropdown.style.left = rx + (rw - bw) / 2 + offsetX + "px";
  };

  if (placementA === "top") {
    dropdown.style.top = ry - bh - offsetMargin + offsetY + "px";
    vertical();
  } else if (placementA === "left") {
    dropdown.style.left = rx - bw - offsetMargin + offsetX + "px";
    horizontal();
  } else if (placementA === "right") {
    dropdown.style.left = rx + rw + offsetMargin + offsetX + "px";
    horizontal();
  } else if (placementA === "bottom") {
    dropdown.style.top = ry + rh + offsetMargin + offsetY + "px";
    vertical();
  }
}

type UseFloatingDropdownArgs = {
  anchorRef: RefObject<HTMLElement | null>;
  dropdownRef: RefObject<HTMLElement | null>;
  options?: FloatingOptions;
  disabled?: boolean;
  // Clicks on these elements must not close the dropdown (they toggle it themselves)
  isOwnTarget?: (target: Element) => boolean;
  // Element whose scrolling re-positions the dropdown (original default: document)
  scrollRoot?: () => EventTarget | null;
};

export function useFloatingDropdown({
  anchorRef,
  dropdownRef,
  options,
  disabled,
  isOwnTarget,
  scrollRoot,
}: UseFloatingDropdownArgs) {
  const [show, setShow] = useState(false);
  const [uuid, setUuid] = useState<string | null>(null);
  const latest = useRef({ options, isOwnTarget, scrollRoot });

  useLayoutEffect(() => {
    latest.current = { options, isOwnTarget, scrollRoot };
  });

  const open = useCallback(() => {
    if (disabled) return;
    // Same random "uuid-12345" class the original adds while open (used for outside-click checks)
    setUuid("uuid-" + String(Math.floor(Math.random() * 100000)).padStart(5, "0"));
    setShow(true);
  }, [disabled]);

  const close = useCallback(() => {
    setShow(false);
    setUuid(null);
  }, []);

  const toggle = useCallback(() => {
    if (show) close();
    else open();
  }, [show, open, close]);

  useLayoutEffect(() => {
    if (!show) return;
    const calculate = () => {
      if (dropdownRef.current && anchorRef.current) {
        positionDropdown(dropdownRef.current, anchorRef.current, latest.current.options);
      }
    };
    const dismiss = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target || !target.closest) return;
      if (uuid && target.closest("." + uuid)) return;
      if (latest.current.isOwnTarget?.(target)) return;
      close();
    };

    calculate();
    const root = latest.current.scrollRoot?.() ?? document;
    root.addEventListener("scroll", calculate);
    window.addEventListener("mousedown", dismiss);
    window.addEventListener("resize", calculate);
    return () => {
      root.removeEventListener("scroll", calculate);
      window.removeEventListener("mousedown", dismiss);
      window.removeEventListener("resize", calculate);
    };
  }, [show, uuid, anchorRef, dropdownRef, close]);

  // Class list the original ends up with: "custom-dropdown uuid-12345 show"
  const stateClassName = [uuid, show ? "show" : ""].filter(Boolean).join(" ");

  return { show, uuid, open, close, toggle, stateClassName };
}
