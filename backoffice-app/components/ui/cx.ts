// Joins class names, skipping empty values: cx("custom-filter", filled && "fill") → "custom-filter fill"
export function cx(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(" ");
}
