"use client";

import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

// Bootstrap 5.2 tooltip as helper.js CustomTooltip.initBootstrap() sets it up for every
// [data-bs-toggle="tooltip"]: customClass "custom-tooltip", animation off (so no .fade),
// offset "0,4", placement bottom. Rendered as div.tooltip appended to <body>, positioned by
// Popper with inset/transform. The caller shows it on hover and hides it on leave.
type BsTooltipProps = { anchorRef: RefObject<HTMLElement | null>; open: boolean; children: ReactNode };

const OFFSET = 4; // offset: '0,4'

// Popper's roundOffsetsByDPR: positions snap to whole device pixels
const roundByDpr = (value: number) => Math.round(value * window.devicePixelRatio) / window.devicePixelRatio;

export function BsTooltip({ anchorRef, open, children }: BsTooltipProps) {
  const tipRef = useRef<HTMLDivElement>(null);
  const [id] = useState(() => "tooltip" + Math.floor(Math.random() * 1000000));
  const [position, setPosition] = useState({ x: 0, y: 0, arrow: 0 });

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const tip = tipRef.current;
    if (!open || !anchor || !tip) return;
    const a = anchor.getBoundingClientRect();
    const arrowWidth = tip.querySelector<HTMLElement>(".tooltip-arrow")?.getBoundingClientRect().width ?? 0;
    const width = tip.getBoundingClientRect().width;
    const center = a.left + a.width / 2;
    const x = roundByDpr(center - width / 2);
    setPosition({
      x: x + window.scrollX,
      y: roundByDpr(a.bottom + OFFSET) + window.scrollY,
      arrow: roundByDpr(center - arrowWidth / 2 - x),
    });
    // Bootstrap links the trigger to the tooltip while it is shown
    anchor.setAttribute("aria-describedby", id);
    return () => anchor.removeAttribute("aria-describedby");
  }, [open, anchorRef, id]);

  if (!open) return null;
  return createPortal(
    <div
      ref={tipRef}
      className="tooltip custom-tooltip bs-tooltip-auto show"
      role="tooltip"
      id={id}
      data-popper-placement="bottom"
      style={{ position: "absolute", inset: "0px auto auto 0px", margin: "0px", transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div className="tooltip-arrow" style={{ position: "absolute", left: "0px", transform: `translate(${position.arrow}px, 0px)` }}></div>
      <div className="tooltip-inner">{children}</div>
    </div>,
    document.body,
  );
}
