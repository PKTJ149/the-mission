"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

// The original loads toastify-js (plugins.js) but no captured script calls it, so no page shows a
// toast. This re-creates toastify's DOM (.toastify.on.toastify-right.toastify-top, styled by
// material.app.min.css) in case a page needs one.

type ToastOptions = {
  text: ReactNode;
  duration?: number; // ms, default 3000
  className?: string; // e.g. "bg-success"
  style?: CSSProperties; // toastify "style" option, e.g. { background: "#F64646" }
};

type ToastItem = ToastOptions & { id: number; on: boolean };

const OFFSET = 15; // toastify default offset from the top edge and between toasts
const HEIGHT = 44; // one-line toast (12px padding + 20px line); toastify measures it, we assume it

// const [toast, toastHolder] = useToast();  render {toastHolder};  toast({ text: "…" });
export function useToast() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const nextId = useRef(1);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    setItems((list) => [...list, { ...options, id, on: false }]);
    // "on" is added right after insertion so the fade-in runs; removed after the duration, then the node 400 ms later
    setTimeout(() => setItems((list) => list.map((item) => (item.id === id ? { ...item, on: true } : item))), 10);
    setTimeout(() => setItems((list) => list.map((item) => (item.id === id ? { ...item, on: false } : item))), options.duration ?? 3000);
    setTimeout(() => setItems((list) => list.filter((item) => item.id !== id)), (options.duration ?? 3000) + 400);
  }, []);

  const holder = mounted
    ? createPortal(
        <>
          {items.map((item, index) => {
            const style = { ...item.style, transform: "translate(0px, 0px)", top: `${OFFSET + index * (HEIGHT + OFFSET)}px` };
            return (
              <div
                key={item.id}
                className={`toastify${item.on ? " on" : ""}${item.className ? " " + item.className : ""} toastify-right toastify-top`}
                style={style}
              >
                {item.text}
              </div>
            );
          })}
        </>,
        document.body,
      )
    : null;

  return [toast, holder] as const;
}
