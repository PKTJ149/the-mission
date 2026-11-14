"use client";

import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

// Bootstrap 5.2 tooltip (data-bs-toggle="tooltip", placement bottom) as the original renders it:
// div.tooltip.bs-tooltip-auto.fade.show[data-popper-placement=bottom] appended to <body>,
// positioned by Popper with inset/transform. The caller shows it on hover and hides it on leave.
type BsTooltipProps = { anchorRef: RefObject<HTMLElement | null>; open: boolean; children: ReactNode };

export function BsTooltip({ anchorRef, open, children }: BsTooltipProps) {
  const tipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, arrow: 0 });

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const tip = tipRef.current;
    if (!open || !anchor || !tip) return;
    const a = anchor.getBoundingClientRect();
    const arrow = tip.querySelector<HTMLElement>(".tooltip-arrow");
    const width = tip.offsetWidth;
    const x = Math.round(a.left + window.scrollX + a.width / 2 - width / 2);
    const y = Math.round(a.bottom + window.scrollY);
    setPosition({ x, y, arrow: Math.round(width / 2 - (arrow?.offsetWidth ?? 0) / 2) });
  }, [open, anchorRef]);

  if (!open) return null;
  return createPortal(
    <div
      ref={tipRef}
      className="tooltip bs-tooltip-auto fade show"
      role="tooltip"
      data-popper-placement="bottom"
      style={{ position: "absolute", inset: "0px auto auto 0px", margin: "0px", transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div className="tooltip-arrow" style={{ position: "absolute", left: "0px", transform: `translate(${position.arrow}px, 0px)` }}></div>
      <div className="tooltip-inner">{children}</div>
    </div>,
    document.body,
  );
}
