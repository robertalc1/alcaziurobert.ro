import { getLenis } from "@/lib/lenis";

// Both pieces of fixed chrome publish their actual height, including a dismissed bar.
export const navOffset = () => {
  const styles = getComputedStyle(document.documentElement);
  return (parseFloat(styles.getPropertyValue("--bar-h")) || 0)
    + (parseFloat(styles.getPropertyValue("--nav-h")) || 72) + 16;
};

/**
 * Every programmatic scroll in the app goes through here.
 *
 * When the smooth-scroll layer is up it drives the animation, so the easing
 * matches the wheel feel instead of the browser's fixed ~400ms ramp. When it
 * is not — touch, reduced motion, prerender, or the first moments after load —
 * this falls back to native smooth behaviour and nothing else has to care.
 */
export function scrollToEl(el: Element, offset: number = navOffset()): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: "instant" });
    return;
  }
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -offset, duration: 1.1 });
    return;
  }
  const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function scrollToId(id: string, offset?: number): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  scrollToEl(el, offset);
  return true;
}

export function scrollToTop(): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.1 });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Jump to the top with no animation — for route changes, where a 1.1s glide
 * from the previous page's offset would be absurd.
 *
 * Going through Lenis matters more than it looks: a bare `window.scrollTo(0,0)`
 * moves the document but leaves Lenis's internal target at the old offset, so
 * the very next wheel tick yanks the reader back down the page. That is the
 * single most likely bug to appear after enabling smooth scroll.
 */
export function jumpToTop(): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
    return;
  }
  window.scrollTo(0, 0);
}
