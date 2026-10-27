import type Lenis from "lenis";

// One Lenis instance for the page, owned by <SmoothScroll />. Anything that
// scrolls programmatically goes through scrollToTarget so it works with or
// without smooth scrolling (reduced motion disables Lenis entirely).
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

export function scrollToTarget(target: string | number | HTMLElement) {
  let top: number;
  if (typeof target === "number") top = target;
  else {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    // A section carries its own top padding, so it lands flush under the bar; anything
    // else clears the bar with a little air. The target is computed here, as a number,
    // so Lenis does not add the page's scroll-padding a second time.
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 52;
    const clear = el.tagName === "SECTION" ? 0 : navH + 24;
    top = el.getBoundingClientRect().top + window.scrollY - clear;
  }
  if (instance) {
    instance.scrollTo(top, { duration: 1.2, force: true });
    return;
  }
  window.scrollTo({ top });
}
