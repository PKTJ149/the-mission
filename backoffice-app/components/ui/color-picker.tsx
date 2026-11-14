"use client";

import { useEffect, useRef, useState } from "react";
import { loadScript } from "./load-script";

// The original colour picker is the jQuery asColorPicker plugin in "gradient" mode (28 of them in
// the mini-game wizard). Its dropdown (saturation / hue / alpha / hex / gradient markers / angle
// wheel) is ~2,700 lines of behaviour, so instead of re-writing it we run the ORIGINAL plugin file
// (downloaded to /lib/as-color-picker/jquery-asColorPicker.js — it has LSM edits such as
// hidePaletteColor) on a plain <input>, scoped to this component. jQuery is only loaded on pages
// that render a ColorPicker. The DOM it builds is the original one, so asColorPicker.min.css +
// /lib/as-color-picker/css/style.css (+ mission.css) style it unchanged.

const SCRIPTS = [
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js", // same jQuery as the original
  // asColorPicker's two dependencies (versions it was built for); their path on the original is unknown
  "https://cdn.jsdelivr.net/npm/jquery-asColor@0.3.6/dist/jquery-asColor.min.js",
  "https://cdn.jsdelivr.net/npm/jquery-asGradient@0.3.3/dist/jquery-asGradient.min.js",
  "/lib/as-color-picker/jquery-asColorPicker.js",
];

type PickerInstance = { $dropdown?: { remove: () => void }; destroy: () => void };
type JQueryLike = ((element: Element) => {
  asColorPicker: (options: Record<string, unknown> | string, ...args: unknown[]) => unknown;
  data: (key: string) => PickerInstance | undefined;
}) & { fn?: { asColorPicker?: unknown } };

async function loadPlugin(): Promise<JQueryLike> {
  for (const src of SCRIPTS) await loadScript(src);
  return (window as unknown as { jQuery: JQueryLike }).jQuery;
}

type ColorPickerProps = {
  className: string; // the page's hook class, e.g. "getColorBgMainColor"
  defaultValue: string; // e.g. "rgba(0, 0, 0, 0.36)" or "linear-gradient(270deg, …)"
  mode?: "simple" | "gradient" | "complex" | "palettes"; // captured inputs all use "gradient"
  onChange?: (value: string) => void;
  options?: Record<string, unknown>; // extra plugin options
};

function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

// Renders <input type="text" class="… asColorPicker-input" data-mode data-value> and lets the plugin
// wrap it in .asColorPicker-wrap with .asColorPicker-clear + .asColorPicker-trigger.
// The host <span> uses display:contents so it does not change the layout.
export function ColorPicker({ className, defaultValue, mode = "gradient", onChange, options }: ColorPickerProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const latest = useRef({ onChange, options });
  // Built once: later prop changes do not re-create the input (the plugin owns it)
  const [initialHtml] = useState(
    () =>
      `<input type="text" class="${escapeAttribute(className)}" data-mode="${mode}" data-value="${escapeAttribute(defaultValue)}" value="${escapeAttribute(defaultValue)}">`,
  );

  useEffect(() => {
    latest.current = { onChange, options };
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let instance: PickerInstance | undefined;

    loadPlugin().then(($) => {
      const input = host.querySelector("input");
      if (cancelled || !input) return;
      $(input).asColorPicker({
        hidePaletteColor: true,
        ...latest.current.options,
        onChange: (value: string) => latest.current.onChange?.(value),
      });
      instance = $(input).data("asColorPicker");
    });

    return () => {
      cancelled = true;
      try {
        instance?.destroy();
      } catch {
        // destroy() throws if the picker was never opened (no mask yet); remove its dropdown by hand
        instance?.$dropdown?.remove();
      }
      // Put back a fresh input so a re-mount (React StrictMode in dev) starts clean
      host.innerHTML = initialHtml;
    };
  }, [initialHtml]);

  // React fills the host once and then never touches it; the plugin owns what is inside.
  return <span ref={hostRef} style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: initialHtml }} />;
}
