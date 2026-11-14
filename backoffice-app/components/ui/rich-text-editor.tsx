"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { CKEDITOR_SCRIPT_ID, CKEDITOR_SRC, MINIGAME_EDITOR_CONFIG } from "./ckeditor-config";

// The original's custom CKEditor 5 build exposes window.CKSource.Editor with its own toolbar and
// Thai UI built in, and injects its <style data-cke> into <head> when the script runs.

type CkEditor = {
  getData: () => string;
  setData: (html: string) => void;
  destroy: () => Promise<unknown>;
  model: { document: { on: (event: string, callback: () => void) => void } };
};
type CkSource = { Editor: { create: (element: HTMLElement, config: Record<string, unknown>) => Promise<CkEditor> } };

function getCkSource() {
  return (window as unknown as { CKSource?: CkSource }).CKSource;
}

type RichTextEditorProps = {
  id: string; // textarea id, e.g. "minigameConditionHtml"
  className?: string; // textarea classes, e.g. "input-promotion-condition-th"
  defaultValue?: string; // initial HTML
  config?: Record<string, unknown>; // default MINIGAME_EDITOR_CONFIG (mission pages' config was not captured)
  hidden?: boolean; // hides the whole editor (the TH/EN/TL language tabs use display-none on the textarea)
  onChange?: (html: string) => void;
  onReady?: (editor: CkEditor) => void;
  dataAttributes?: Record<`data-${string}`, string>; // e.g. { "data-condition-lang": "en" }
};

// <textarea> + CKSource.Editor.create(textarea, config). CKEditor hides the textarea and inserts its
// own UI right after it; both live in a display:contents host so React never trips over that UI.
export function RichTextEditor({ id, className, defaultValue, config, hidden, onChange, onReady, dataAttributes }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const latest = useRef({ onChange, onReady, config, defaultValue });
  const [scriptReady, setScriptReady] = useState(false);
  const queue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    latest.current = { onChange, onReady, config, defaultValue };
  });

  const markReady = useCallback(() => setScriptReady(true), []);

  useEffect(() => {
    const textarea = textareaRef.current;
    const ckSource = scriptReady ? getCkSource() : undefined;
    if (!textarea || !ckSource) return;

    let editor: CkEditor | null = null;
    let cancelled = false;
    // One editor per textarea at a time: CKEditor refuses a textarea that another instance still
    // holds, and StrictMode (dev) mounts → unmounts → mounts. So each create waits for the last destroy.
    const run = queue.current.then(async () => {
      if (cancelled) return;
      const created = await ckSource.Editor.create(textarea, latest.current.config ?? MINIGAME_EDITOR_CONFIG);
      editor = created;
      if (cancelled) return;
      if (latest.current.defaultValue) created.setData(latest.current.defaultValue);
      created.model.document.on("change:data", () => latest.current.onChange?.(created.getData()));
      latest.current.onReady?.(created);
    });

    return () => {
      cancelled = true;
      queue.current = run
        .then(() => editor?.destroy())
        .then(() => undefined)
        .catch(() => undefined);
    };
  }, [scriptReady]);

  const hostStyle: CSSProperties = hidden ? { display: "none" } : { display: "contents" };

  return (
    <div style={hostStyle}>
      <textarea ref={textareaRef} id={id} className={className} defaultValue={defaultValue} {...dataAttributes} />
      <Script id={CKEDITOR_SCRIPT_ID} src={CKEDITOR_SRC} strategy="afterInteractive" onReady={markReady} />
    </div>
  );
}
