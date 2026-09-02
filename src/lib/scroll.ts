import { getLenis } from "@/lib/lenis";

// Shared anchor-scroll helper — same offsets the fixed navbar needs
// (100px under 768px, 80px above), used by Navbar/Hero/Index anchors.
export const navOffset = () => (window.innerWidth < 768 ? 100 : 80);

/**
 * Every programmatic scroll in the app goes through here.
 *
 * When the smooth-scroll layer is up it drives the animation, so the easing
 * matches the wheel feel instead of the browser's fixed ~400ms ramp. When it
 * is not — touch, reduced motion, prerender, or the first moments after load —
 * this falls back to native smooth behaviour and nothing else has to care.
 */
export function scrollToEl(el: Element, offset: number = navOffset()): void {
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
