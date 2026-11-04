import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPixelPageView } from "@/lib/marketingPixels";
import { trackContactAction } from "@/lib/analytics";

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
    const trackWhatsApp = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[href]');
      if (link && new URL(link.href).hostname === "wa.me") trackContactAction("whatsapp_click");
    };
    document.addEventListener("click", trackWhatsApp);
    return () => document.removeEventListener("click", trackWhatsApp);
  }, []);

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
