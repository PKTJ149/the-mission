import type { CSSProperties } from "react";

// The original's <number-format-number>: fixed decimals with thousands commas, red when negative.
export function formatPrice(value: number | string, decimal: number) {
  const fixed7 = parseFloat(String(value)).toFixed(7);
  const n = Number(fixed7) === -0 ? 0 : Number(fixed7);
  const parts = n.toFixed(decimal).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

// `scope` is the parent's data-v-* attribute (the dashboard's is the default).
type NumberFormatProps = { value: number | string; decimal: number; style?: CSSProperties; scope?: string };

export function NumberFormat({ value, decimal, style, scope = "data-v-3c285718" }: NumberFormatProps) {
  const negative = Number(parseFloat(String(value)).toFixed(7)) < 0;
  return (
    <span data-v-5e2aba60="" {...{ [scope]: "" }} className={negative ? "color-red" : ""} style={style}>
      {formatPrice(value, decimal)}
    </span>
  );
}
