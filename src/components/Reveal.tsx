import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  /** Stagger delay in ms, applied via --reveal-delay. */
  delay?: number;
  className?: string;
};

/**
 * Fades content in when it scrolls into view. Each instance owns its
 * IntersectionObserver, so it works inside lazy-loaded sections (a global
 * querySelectorAll at page mount would run before those chunks arrive).
 * Styles live in index.css (.reveal-on-scroll / .is-revealed) and settle on
 * `transform: none`, so wrapping content never breaks sticky descendants.
 */
const Reveal: React.FC<Props> = ({ children, delay = 0, className }) => {
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
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal-on-scroll", revealed && "is-revealed", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
};

export default Reveal;
