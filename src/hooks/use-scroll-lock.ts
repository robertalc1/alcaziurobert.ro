import { useEffect } from "react";
import { startLenis, stopLenis } from "@/lib/lenis";

/**
 * Locks page scroll while an overlay owns the screen.
 *
 * The lock goes on <html>, not <body>, and that is the entire point of this
 * file. index.css puts `overflow-x: clip` on the root, and the CSS viewport
 * propagation rule only hands the body's overflow to the viewport when the
 * root's own overflow is `visible` on both axes. It is not — so the viewport
 * keeps using the root's overflow, and `body.style.overflow = "hidden"`, which
 * is what the fullscreen menu used to do, locked precisely nothing.
 *
 * On desktop that went unnoticed, because Lenis puts `.lenis-stopped` on <html>
 * and that class carries its own `overflow: hidden`. Lenis is never
 * instantiated on touch (see use-smooth-scroll), so phones got no lock from
 * either side and the page scrolled on underneath the open menu — the reported
 * bug.
 *
 * Measured in a real browser on this page, pressing PageDown:
 *
 *   no lock                  scrollY 0 -> 738
 *   body { overflow: hidden }  scrollY 0 -> 738   (what the menu used to do)
 *   html { overflow: hidden }  scrollY 0 ->   0
 *
 * The lock is put on the root; the scrollbar compensation stays on <body>,
 * where the original code had it. Padding the root instead would fight
 * `body { max-width: 100vw }` in index.css and shave a few px off the right
 * edge.
 *
 * Only the root's overflow is touched. Radix (react-remove-scroll) and Vaul
 * both write to <body>, so a dialog or a drawer can hold its own lock at the
 * same time without the two fighting over the same declarations.
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked || typeof document === "undefined") return;

    const root = document.documentElement;
    const { body } = document;
    const prevOverflow = root.style.overflowY;
    const prevOverscroll = root.style.overscrollBehavior;
    const prevPad = body.style.paddingRight;
    const y = window.scrollY;

    // Desktop only: taking the scrollbar away reflows the page a few px wider.
    const gap = window.innerWidth - root.clientWidth;

    // overflow-y, not the shorthand. index.html's critical CSS declares
    // `overflow-x: clip !important` on the root, and a stylesheet !important
    // outranks an inline declaration — so the shorthand would silently lose its
    // x half anyway. The y axis is the one that stops the page.
    root.style.overflowY = "hidden";
    // Stops the rubber-band handoff at the ends of the overlay's own scroll.
    root.style.overscrollBehavior = "none";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    stopLenis();

    return () => {
      root.style.overflowY = prevOverflow;
      root.style.overscrollBehavior = prevOverscroll;
      body.style.paddingRight = prevPad;
      startLenis();
      // Some engines drop the offset while the root is unscrollable. Correct it
      // only when it actually moved — an unconditional scrollTo would fight
      // Lenis on the frame it restarts.
      if (Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y);
    };
  }, [locked]);
}
