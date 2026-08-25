import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPixelPageView } from "@/lib/marketingPixels";

/**
 * The site is a SPA: Meta's base code fires PageView once, on the initial HTML
 * load. Route changes after that (e.g. /studii-de-caz) would never be counted,
 * so we fire one here. No-ops until marketing consent is granted.
 * Renders nothing; must live inside the Router.
 */
const PixelPageViews = () => {
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    // The first render is the load that loadMarketingScripts() already tracked.
    if (first.current) {
      first.current = false;
      return;
    }
    trackPixelPageView();
  }, [pathname]);

  return null;
};

export default PixelPageViews;
