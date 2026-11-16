"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
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
  skid?: number; // first number of data-tooltip-offset, e.g. "10,4"
};

// A tooltip whose button was replaced while it was showing (see useTooltip().orphan)
type Orphan = {
  key: number;
  id: string;
  content: ReactNode;
  placement: Placement;
  className?: string;
  transform: string; // Popper's last position
  arrowTransform: string;
  detached: boolean; // Popper updated it after its button was gone
};

const OFFSET = 4; // offset: '0,4'
const ARROW_WIDTH = 12.8; // --vz-tooltip-arrow-width: .8rem
// Popper's inline style: "top" is anchored to the bottom-left of the containing block, "top-end" to its bottom-right
const BOX_STYLE: CSSProperties = { position: "absolute", inset: "auto auto 0px 0px", margin: "0px" };
const END_BOX_STYLE: CSSProperties = { position: "absolute", inset: "auto 0px 0px auto", margin: "0px" };
const ARROW_STYLE: CSSProperties = { position: "absolute", left: "0px" };

const boxClass = (className?: string) => ["tooltip custom-tooltip", className, "bs-tooltip-auto show"].filter(Boolean).join(" ");

function TooltipBox({ target, content, placement, className, skid = 0, boxRef }: TooltipState & { boxRef: RefObject<HTMLDivElement | null> }) {
  const ref = boxRef;
  const arrowRef = useRef<HTMLDivElement>(null);
  const [id] = useState(() => "tooltip" + Math.floor(Math.random() * 1000000));

  // Popper writes the position straight onto the element; do the same before the browser paints
  useLayoutEffect(() => {
    const box = ref.current;
    const arrow = arrowRef.current;
    if (!box || !arrow) return;
    const anchor = target.getBoundingClientRect();
    // Untransformed box = bottom-left corner of the containing block (what Popper measures against)
    box.style.transform = "none";
    const base = box.getBoundingClientRect();
    const { width } = base;
    const end = placement === "top-end";
    const left = (end ? anchor.right - width : anchor.left + anchor.width / 2 - width / 2) + skid;
    // Popper rounds offsets to device pixels (roundOffsetsByDPR)
    const dpr = window.devicePixelRatio || 1;
    const round = (value: number) => Math.round(value * dpr) / dpr;
    // The arrow points at the middle of the target
    const arrowLeft = Math.min(Math.max(anchor.left + anchor.width / 2 - left - ARROW_WIDTH / 2, 0), width - ARROW_WIDTH);
    const x = end ? left + width - base.right : left - base.left;
    box.style.transform = `translate3d(${round(x)}px, ${round(anchor.top - OFFSET - base.bottom)}px, 0px)`;
    arrow.style.transform = `translate3d(${round(arrowLeft)}px, 0px, 0px)`;
  }, [target, placement, content, skid, ref]);

  return createPortal(
    <div
      ref={ref}
      className={boxClass(className)}
      role="tooltip"
      id={id}
      data-popper-placement={placement}
      style={placement === "top-end" ? END_BOX_STYLE : BOX_STYLE}
    >
      <div ref={arrowRef} className="tooltip-arrow" style={ARROW_STYLE}></div>
      <div className="tooltip-inner">{content}</div>
    </div>,
    document.body,
  );
}

// Where Popper puts an orphaned tooltip on its next update: the reference is detached (all-zero
// rect), so "top" has no room, it flips to "right" and is pushed back inside the viewport.
const DETACHED_STYLE: CSSProperties = { position: "absolute", inset: "0px auto auto 0px", margin: "0px", transform: "translate3d(4px, 0px, 0px)" };
const DETACHED_ARROW_STYLE: CSSProperties = { position: "absolute", transform: "translate3d(0px, 0px, 0px)", top: "0px" };

function OrphanBox({ orphan }: { orphan: Orphan }) {
  const { detached } = orphan;
  return createPortal(
    <div
      className={boxClass(orphan.className)}
      role="tooltip"
      id={orphan.id}
      data-popper-placement={detached ? "right" : orphan.placement}
      style={detached ? DETACHED_STYLE : { ...(orphan.placement === "top-end" ? END_BOX_STYLE : BOX_STYLE), transform: orphan.transform }}
    >
      <div className="tooltip-arrow" style={detached ? DETACHED_ARROW_STYLE : { ...ARROW_STYLE, transform: orphan.arrowTransform }}></div>
      <div className="tooltip-inner">{orphan.content}</div>
    </div>,
    document.body,
  );
}

// const tooltip = useTooltip();
// <button onMouseEnter={(e) => tooltip.show(e.currentTarget, "รายละเอียด")} onMouseLeave={tooltip.hide}>
// … {tooltip.holder}
export function useTooltip() {
  const [state, setState] = useState<TooltipState | null>(null);
  const [orphans, setOrphans] = useState<Orphan[]>([]);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const show = useCallback((target: HTMLElement, content: ReactNode, placement: Placement = "top", className?: string, skid = 0) => {
    setState({ target, content, placement, className, skid });
  }, []);
  const hide = useCallback(() => setState(null), []);

  const detachAll = useCallback(() => {
    setOrphans((list) => (list.every((item) => item.detached) ? list : list.map((item) => ({ ...item, detached: true }))));
  }, []);

  // ORIGINAL BUG (kept on purpose, PK 15/11/2026): the report page's own table script replaces the
  // rows without disposing their Bootstrap tooltips, so a tooltip that is showing at that moment
  // stays on screen for good, where it was. Its next Popper update (any scroll / resize, or at once
  // when the rows were replaced by clicking the tooltip's own button: Bootstrap's "focus" trigger
  // updates it after the button is gone) moves it to the top-left corner. The fix would be to dispose
  // the tooltips before replacing the rows (table.js does that), i.e. call hide() instead of orphan().
  const orphan = useCallback(() => {
    const box = boxRef.current;
    const current = stateRef.current;
    const active = document.activeElement;
    const moveNow = Boolean(current && active && current.target.contains(active));
    if (box && current) {
      const arrow = box.querySelector<HTMLElement>(".tooltip-arrow");
      const item: Orphan = {
        key: Date.now(),
        id: box.id,
        content: current.content,
        placement: current.placement,
        className: current.className,
        transform: box.style.transform,
        arrowTransform: arrow?.style.transform ?? "",
        detached: moveNow,
      };
      setOrphans((list) => [...list, item]);
      setState(null);
    }
  }, []);

  // Popper's scroll/resize listeners keep updating orphans (to the detached position)
  const hasOrphans = orphans.length > 0;
  useEffect(() => {
    if (!hasOrphans) return;
    window.addEventListener("scroll", detachAll, true);
    window.addEventListener("resize", detachAll);
    return () => {
      window.removeEventListener("scroll", detachAll, true);
      window.removeEventListener("resize", detachAll);
    };
  }, [hasOrphans, detachAll]);

  return {
    show,
    hide,
    orphan,
    holder: (
      <>
        {orphans.map((item) => (
          <OrphanBox key={item.key} orphan={item} />
        ))}
        {state ? <TooltipBox {...state} boxRef={boxRef} /> : null}
      </>
    ),
  };
}
