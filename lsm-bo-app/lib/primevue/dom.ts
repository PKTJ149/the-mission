// Small ports of PrimeVue 2's DomHandler / StyleClass / Tooltip, so the overlays and the
// collapsible menus behave (and leave the same classes and styles in the DOM) like the original.
// Browser-only: call these from event handlers or effects, never during render.

// PrimeVue keeps one global z-index counter. On the original the two toasts take 1000 and 1001.
let zIndex = 1001;
export function nextZIndex() {
  zIndex += 1;
  return zIndex;
}

// PrimeVue's UniqueComponentId ("pv_id_N"); on the original ids 1-6 are taken before the dashboard
// calendars ask for theirs (pv_id_7 and pv_id_8).
let uniqueId = 6;
export function nextUniqueId() {
  uniqueId += 1;
  return `pv_id_${uniqueId}`;
}

// DomHandler.fadeIn: opacity grows with elapsed time until it passes 1 (so it ends on e.g. 1.04).
export function fadeIn(el: HTMLElement, duration: number) {
  el.style.opacity = "0";
  let last = Date.now();
  const tick = () => {
    const opacity = Number(el.style.opacity) + (Date.now() - last) / duration;
    el.style.opacity = String(opacity);
    last = Date.now();
    if (opacity < 1) requestAnimationFrame(tick);
  };
  tick();
}

// DomHandler.relativePosition: opens the overlay below the input, or above it when there is no room.
export function relativePosition(overlay: HTMLElement, target: HTMLElement) {
  const width = overlay.offsetWidth;
  const height = overlay.offsetHeight;
  const targetHeight = target.offsetHeight;
  const targetRect = target.getBoundingClientRect();
  let top: number;
  let left: number;

  if (targetRect.top + targetHeight + height > window.innerHeight) {
    top = -height;
    overlay.style.transformOrigin = "bottom";
    if (targetRect.top + top < 0) top = -targetRect.top;
  } else {
    top = targetHeight;
    overlay.style.transformOrigin = "top";
  }

  if (width > window.innerWidth) left = -targetRect.left;
  else if (targetRect.left + width > window.innerWidth) left = -(targetRect.left + width - window.innerWidth);
  else left = 0;

  overlay.style.top = `${top}px`;
  overlay.style.left = `${left}px`;
}

// ---------- StyleClass (v-styleclass) ----------

export type StyleClassOptions = {
  enterClass?: string;
  enterActiveClass?: string;
  leaveToClass?: string;
  leaveActiveClass?: string;
  hideOnOutsideClick?: boolean;
};

type Animated = HTMLElement & { _animating?: boolean; _outsideListener?: ((e: MouseEvent) => void) | null };

// Same steps as primevue/styleclass: "hidden" is removed/added around a CSS animation
// (slidedown / slideup / scalein / fadeout), and the animation class is removed on animationend.
export function toggleStyleClass(trigger: HTMLElement, target: HTMLElement, options: StyleClassOptions) {
  const el = target as Animated;
  if (el.offsetParent === null) enter(trigger, el, options);
  else leave(el, options);
}

function enter(trigger: HTMLElement, el: Animated, o: StyleClassOptions) {
  if (o.enterActiveClass) {
    if (el._animating) return;
    el._animating = true;
    if (o.enterActiveClass === "slidedown") {
      el.style.height = "0px";
      el.classList.remove("hidden");
      el.style.maxHeight = `${el.scrollHeight}px`;
      el.classList.add("hidden");
      el.style.height = "";
    }
    el.classList.add(o.enterActiveClass);
    if (o.enterClass) el.classList.remove(o.enterClass);
    const done = () => {
      el.classList.remove(o.enterActiveClass!);
      el.removeEventListener("animationend", done);
      if (o.enterActiveClass === "slidedown") el.style.maxHeight = "";
      el._animating = false;
    };
    el.addEventListener("animationend", done);
  } else if (o.enterClass) {
    el.classList.remove(o.enterClass);
  }

  if (o.hideOnOutsideClick && !el._outsideListener) {
    el._outsideListener = (event: MouseEvent) => {
      const node = event.target as Node;
      if (el.offsetParent === null || getComputedStyle(el).position === "static") removeOutsideListener(el);
      else if (!trigger.contains(node) && !el.contains(node)) leave(el, o);
    };
    document.addEventListener("click", el._outsideListener);
  }
}

function leave(el: Animated, o: StyleClassOptions) {
  if (o.leaveActiveClass) {
    if (el._animating) return;
    el._animating = true;
    el.classList.add(o.leaveActiveClass);
    const done = () => {
      el.classList.remove(o.leaveActiveClass!);
      if (o.leaveToClass) el.classList.add(o.leaveToClass);
      el.removeEventListener("animationend", done);
      el._animating = false;
    };
    el.addEventListener("animationend", done);
  } else if (o.leaveToClass) {
    el.classList.add(o.leaveToClass);
  }
  if (o.hideOnOutsideClick) removeOutsideListener(el);
}

function removeOutsideListener(el: Animated) {
  if (el._outsideListener) {
    document.removeEventListener("click", el._outsideListener);
    el._outsideListener = null;
  }
}

// ---------- Tooltip (v-tooltip.top / .bottom) ----------


type TooltipHost = HTMLElement & { _tooltip?: HTMLElement | null; _tooltipScroll?: (() => void) | null };
type Side = "top" | "bottom";

// Creates <div id="pv_id_N_tooltip" class="p-tooltip p-component p-tooltip-top"> on <body>,
// tries the preferred side first and flips when it would leave the viewport, then fades in.
export function showTooltip(host: HTMLElement, text: string, preferred: Side) {
  const h = host as TooltipHost;
  hideTooltip(h);

  const tip = document.createElement("div");
  tip.id = `${nextUniqueId()}_tooltip`;
  const arrow = document.createElement("div");
  arrow.className = "p-tooltip-arrow";
  tip.appendChild(arrow);
  const body = document.createElement("div");
  body.className = "p-tooltip-text";
  body.appendChild(document.createTextNode(text));
  tip.appendChild(body);
  document.body.appendChild(tip);
  tip.style.display = "inline-block";
  h._tooltip = tip;

  const other: Side = preferred === "top" ? "bottom" : "top";
  align(h, tip, preferred);
  if (isOutOfViewport(tip)) {
    align(h, tip, other);
    if (isOutOfViewport(tip)) align(h, tip, preferred);
  }

  fadeIn(tip, 250);
  tip.style.zIndex = String(nextZIndex());

  // The original hides the tooltip on scroll of any scrollable parent (ConnectedOverlayScrollHandler).
  h._tooltipScroll = () => hideTooltip(h);
  window.addEventListener("scroll", h._tooltipScroll, true);
}

export function hideTooltip(host: HTMLElement) {
  const h = host as TooltipHost;
  if (h._tooltip) {
    h._tooltip.remove();
    h._tooltip = null;
  }
  if (h._tooltipScroll) {
    window.removeEventListener("scroll", h._tooltipScroll, true);
    h._tooltipScroll = null;
  }
}

function align(host: HTMLElement, tip: HTMLElement, side: Side) {
  tip.style.left = "-999px";
  tip.style.top = "-999px";
  tip.className = `p-tooltip p-component p-tooltip-${side}`;
  const rect = host.getBoundingClientRect();
  const left = rect.left + window.scrollX + (host.offsetWidth - tip.offsetWidth) / 2;
  const top = side === "top" ? rect.top + window.scrollY - tip.offsetHeight : rect.top + window.scrollY + host.offsetHeight;
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

function isOutOfViewport(tip: HTMLElement) {
  const rect = tip.getBoundingClientRect();
  return (
    rect.left + tip.offsetWidth > window.innerWidth ||
    rect.left < 0 ||
    rect.top < 0 ||
    rect.top + tip.offsetHeight > window.innerHeight
  );
}
