// PrimeVue <Badge>: a number bubble, or a plain dot when it has no value.
// `scope` is the parent component's data-v-* attribute (Vue puts it on the child's root element).
type BadgeProps = {
  value?: number | string;
  severity: "success" | "info" | "warning" | "danger" | "secondary";
  className?: string;
  scope?: string;
};

export function Badge({ value, severity, className, scope }: BadgeProps) {
  const hasValue = value !== undefined && value !== null && String(value) !== "";
  const classes = [
    className,
    "p-badge p-component",
    hasValue && String(value).length === 1 ? "p-badge-no-gutter" : "",
    hasValue ? "" : "p-badge-dot",
    `p-badge-${severity}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span {...(scope ? { [scope]: "" } : {})} className={classes}>
      {hasValue ? String(value) : null}
    </span>
  );
}
