import type { MouseEventHandler } from "react";

// PrimeVue <Button> markup: <button class="… p-button p-component"> <span icon/> <span label/> </button>
// The empty label of an icon-only button is a non-breaking space, as on the original.
type ButtonProps = {
  className?: string;
  label?: string;
  icon?: string;
  scope?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function Button({ className, label, icon, scope, onClick }: ButtonProps) {
  const classes = [className, "p-button p-component", icon && !label ? "p-button-icon-only" : ""].filter(Boolean).join(" ");
  const iconClass = [icon, "p-button-icon", label ? "p-button-icon-left" : ""].filter(Boolean).join(" ");

  return (
    <button {...(scope ? { [scope]: "" } : {})} type="button" className={classes} onClick={onClick}>
      {" "}
      {icon && <span className={iconClass}></span>} <span className="p-button-label">{label || " "}</span>{" "}
    </button>
  );
}
