"use client";

import { useLayoutEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "@/components/ui";

// Bootstrap 5.2 collapse (data-bs-toggle="collapse"), without Bootstrap's JS: the panel goes
// "collapse" → "collapsing" (height animates, .35s) → "collapse show", and back.
// The accordion part (data-bs-parent: one panel open at a time) is the parent's open state.
type CollapseProps = HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  className: string; // classes before "collapse", e.g. "box-content-mission-setting"
  children: ReactNode;
};

const DURATION = 350;

export function Collapse({ open, className, children, ...rest }: CollapseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shownOpen = useRef(open); // last state the panel was animated to
  const finalClassName = cx(className, "collapse", open && "show");

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    // Nothing to animate on mount (also skips React StrictMode's second mount run)
    if (shownOpen.current === open) return;
    shownOpen.current = open;
    if (open) {
      element.className = cx(className, "collapsing");
      element.style.height = "0px";
      void element.offsetHeight; // reflow, so the height change below animates
      element.style.height = `${element.scrollHeight}px`;
    } else {
      // React already removed "show"; put it back for a moment to measure the open height
      element.className = cx(className, "collapse", "show");
      element.style.height = `${element.getBoundingClientRect().height}px`;
      void element.offsetHeight; // reflow, so the height change below animates
      element.className = cx(className, "collapsing");
      element.style.height = "";
    }
    const timer = setTimeout(() => {
      element.className = finalClassName;
      element.style.height = "";
    }, DURATION);
    return () => clearTimeout(timer);
    // finalClassName follows open/className
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={ref} className={finalClassName} {...rest}>
      {children}
    </div>
  );
}

type AccordionHeaderProps = {
  open: boolean;
  target: string; // id of the panel (data-bs-target)
  onToggle: () => void;
  onClick?: () => void; // extra handler, e.g. the original validateMission4()
  children: ReactNode;
};

// The original header divs carry type="button" (not a valid div attribute in React's types)
const DIV_BUTTON_TYPE = { type: "button" } as object;

// .dropdown-mission-setting header row of a mission accordion section
export function AccordionHeader({ open, target, onToggle, onClick, children }: AccordionHeaderProps) {
  return (
    <div
      className={cx("dropdown-mission-setting", !open && "collapsed")}
      {...DIV_BUTTON_TYPE}
      data-bs-toggle="collapse"
      data-bs-target={`#${target}`}
      aria-expanded={open}
      aria-controls={target}
      onClick={() => {
        onClick?.();
        onToggle();
      }}
    >
      {children}
    </div>
  );
}
