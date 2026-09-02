import type Lenis from "lenis";

/**
 * Module-scope handle on the smooth-scroll instance.
 *
 * Deliberately not React context: `src/lib/scroll.ts` is a plain helper called
 * from non-component code, and the three places that lock body scroll (the
 * fullscreen menu, the Radix cookie dialog, the Vaul contact drawer) need to
 * reach the instance without prop drilling.
 *
 * Every consumer must tolerate `null` — smooth scroll is off on touch, off for
 * `prefers-reduced-motion`, off during prerender, and simply absent for the
 * first moments after load while the chunk is still arriving.
 */
let instance: Lenis | null = null;

export const getLenis = (): Lenis | null => instance;

export const setLenisInstance = (l: Lenis | null): void => {
  instance = l;
};

/**
 * Pause while something else owns the scroll (open modal, drawer, menu).
 * Without this the wheel keeps feeding Lenis's internal target behind the
 * overlay, and closing it snaps the page to wherever that target drifted.
 */
export const stopLenis = (): void => instance?.stop();

export const startLenis = (): void => instance?.start();
