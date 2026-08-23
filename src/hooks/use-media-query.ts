import { useEffect, useState } from "react";

/**
 * matchMedia hook with a SYNCHRONOUS initial value — the first render already
 * knows the answer, so conditionally-mounted layout (e.g. the hero form card)
 * doesn't pop in on a second render and cause layout shift.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [query]);

  return matches;
}
