import { useEffect } from "react";
import { setLenisInstance } from "@/lib/lenis";

const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";
const TOUCH = "(hover: none) and (pointer: coarse)";

/**
 * Inertial scrolling on desktop pointers only.
 *
 * Three deliberate exclusions:
 *   touch          — iOS/Android momentum is a system-level feel with a decade
 *                    of muscle memory behind it. Synthesising it is the most
 *                    common way a "premium scroll" site ends up feeling broken
 *                    on a phone, and phones are where the ad traffic lands.
 *   reduced motion — we skip instantiating entirely rather than relying on
 *                    Lenis's own `respectReducedMotion`, so there is no rAF
 *                    loop running at all.
 *   webdriver      — `scripts/prerender.mjs` walks the page with window.scrollTo
 *                    and serialises the result. Lenis would fight that walk and
 *                    bake its own classes into every static file.
 *
 * The library is imported on idle, so it lands after LCP. The first moments of
 * scrolling are therefore native; the handover is invisible because Lenis syncs
 * to whatever the current scroll position is when it starts.
 */
export function useSmoothScroll(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (navigator.webdriver) return;

    const reduce = window.matchMedia(REDUCE_MOTION);
    const touch = window.matchMedia(TOUCH);

    let lenis: import("lenis").default | null = null;
    let frame = 0;
    let cancelled = false;

    const teardown = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lenis?.destroy();
      lenis = null;
      setLenisInstance(null);
    };

    const boot = () => {
      if (cancelled || lenis) return;
      if (reduce.matches || touch.matches) return;

      const idle =
        window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 1));

      idle(async () => {
        if (cancelled || lenis) return;
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;

        lenis = new Lenis({
          lerp: 0.1,
          smoothWheel: true,
          // Touch is excluded above, but belt-and-braces: never synthesise it.
          syncTouch: false,
          // Only ever consume vertical deltas. This is what keeps the portfolio
          // carousel working — it is a native horizontal scroll container, and a
          // horizontal trackpad swipe must reach it untouched.
          gestureOrientation: "vertical",
          // We own the loop so cleanup can cancel it (StrictMode double-mounts).
          autoRaf: false,
          // Anchors go through lib/scroll.ts, which applies the navbar offset.
          anchors: false,
        });
        setLenisInstance(lenis);

        const loop = (time: number) => {
          lenis?.raf(time);
          frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
      });
    };

    // Honour the OS setting changing mid-session, in both directions.
    const onPreferenceChange = () => {
      if (reduce.matches || touch.matches) teardown();
      else boot();
    };

    boot();
    reduce.addEventListener("change", onPreferenceChange);
    touch.addEventListener("change", onPreferenceChange);

    return () => {
      cancelled = true;
      reduce.removeEventListener("change", onPreferenceChange);
      touch.removeEventListener("change", onPreferenceChange);
      teardown();
    };
  }, []);
}
