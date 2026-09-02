import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  /** Stagger delay in ms, applied via --reveal-delay. */
  delay?: number;
  /** Travel distance in px. 0 = fade/blur in place. Defaults to --reveal-distance. */
  distance?: number;
  /**
   * Blur radius in px. Pass 0 to drop the filter entirely — do that for any
   * subtree holding images, form controls or the portfolio carousel: blur()
   * re-rasterises the whole subtree every frame and the cost scales with
   * painted area. Defaults to --reveal-blur.
   */
  blur?: number;
  /** Transition duration in ms. Defaults to --reveal-duration. */
  duration?: number;
  /** IntersectionObserver threshold. Lower it for blocks taller than the viewport. */
  threshold?: number;
  className?: string;
};

/**
 * Fades content in when it scrolls into view. Each instance owns its
 * IntersectionObserver, so it works inside lazy-loaded sections (a global
 * querySelectorAll at page mount would run before those chunks arrive).
 * Styles live in index.css (.reveal-on-scroll / .is-revealed) and settle on
 * `transform: none` / `filter: none`, so wrapping content never breaks sticky
 * or fixed descendants.
 *
 * Stagger convention — keep to it, the ladder used to be ad hoc (70/90/100/
 * 140/160/220 with no rule):
 *   siblings   0 / 80 / 160 / 240
 *   lists      delay={i * 70}, capped at 4 steps
 * Past roughly 300ms of accumulated stagger it reads as slow, not deliberate.
 */
const Reveal: React.FC<Props> = ({
  children,
  delay = 0,
  distance,
  blur,
  duration,
  threshold = 0.12,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -32px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  // Only emit the custom properties that were actually overridden — anything
  // left out inherits the :root token, same as the button system.
  const style: React.CSSProperties = {};
  if (delay) (style as Record<string, string>)["--reveal-delay"] = `${delay}ms`;
  if (distance !== undefined) {
    (style as Record<string, string>)["--reveal-distance"] = `${distance}px`;
  }
  if (blur !== undefined && blur > 0) {
    (style as Record<string, string>)["--reveal-blur"] = `${blur}px`;
  }
  if (duration !== undefined) {
    (style as Record<string, string>)["--reveal-duration"] = `${duration}ms`;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "reveal-on-scroll",
        // A class, not --reveal-blur: 0 — blur(0) is still a live filter and
        // would create a containing block for fixed/absolute descendants.
        blur === 0 && "reveal-no-blur",
        revealed && "is-revealed",
        className
      )}
      style={Object.keys(style).length ? style : undefined}
    >
      {children}
    </div>
  );
};

export default Reveal;
