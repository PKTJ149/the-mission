"use client";

import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Bootstrap 5.2 tooltips as helper.js CustomTooltip sets them up: customClass "custom-tooltip",
// animation off (so no .fade), hover trigger, offset "0,4", appended to <body>, positioned by Popper.
// Popper is not loaded here; the two placements these pages use are worked out by hand.

type Placement = "top" | "top-end";

type TooltipState = {
  target: HTMLElement;
  content: ReactNode;
  placement: Placement;
  className?: string; // extra customClass, e.g. "promotion-deposit-tooltip"
};

const OFFSET = 4; // offset: '0,4'
const ARROW_WIDTH = 12.8; // --vz-tooltip-arrow-width: .8rem
const BOX_STYLE: CSSProperties = { position: "absolute", inset: "0px auto auto 0px" };
const ARROW_STYLE: CSSProperties = { position: "absolute", left: "0px" };

function TooltipBox({ target, content, placement, className }: TooltipState) {
  const ref = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [id] = useState(() => "tooltip" + Math.floor(Math.random() * 1000000));

  // Popper writes the position straight onto the element; do the same before the browser paints
  useLayoutEffect(() => {
    const box = ref.current;
    const arrow = arrowRef.current;
    if (!box || !arrow) return;
    const anchor = target.getBoundingClientRect();
    const { width, height } = box.getBoundingClientRect();
    const left = placement === "top-end" ? anchor.right - width : anchor.left + anchor.width / 2 - width / 2;
    const top = anchor.top - height - OFFSET;
    // The arrow points at the middle of the target
    const arrowLeft = Math.min(Math.max(anchor.left + anchor.width / 2 - left - ARROW_WIDTH / 2, 0), width - ARROW_WIDTH);
    box.style.transform = `translate(${Math.round(left + window.scrollX)}px, ${Math.round(top + window.scrollY)}px)`;
    arrow.style.transform = `translate(${Math.round(arrowLeft)}px, 0px)`;
  }, [target, placement, content]);

  return createPortal(
    <div
      ref={ref}
      className={["tooltip custom-tooltip", className, "bs-tooltip-auto show"].filter(Boolean).join(" ")}
      role="tooltip"
      id={id}
      data-popper-placement={placement}
      style={BOX_STYLE}
    >
      <div ref={arrowRef} className="tooltip-arrow" style={ARROW_STYLE}></div>
      <div className="tooltip-inner">{content}</div>
    </div>,
    document.body,
  );
}

// const tooltip = useTooltip();
// <button onMouseEnter={(e) => tooltip.show(e.currentTarget, "รายละเอียด")} onMouseLeave={tooltip.hide}>
// … {tooltip.holder}
export function useTooltip() {
  const [state, setState] = useState<TooltipState | null>(null);

  const show = useCallback((target: HTMLElement, content: ReactNode, placement: Placement = "top", className?: string) => {
    setState({ target, content, placement, className });
  }, []);
  const hide = useCallback(() => setState(null), []);

  return { show, hide, holder: state ? <TooltipBox {...state} /> : null };
}
