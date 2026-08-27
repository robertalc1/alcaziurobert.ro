// Marketing-category scripts. Today that is the Meta Pixel.
//
// GDPR/ePrivacy: nothing here runs until the visitor accepts the Marketing
// category in the consent banner — no request reaches Facebook, no _fbp cookie
// is set, before that. The consent flow calls loadMarketingScripts() /
// disableMarketingScripts() (src/hooks/use-cookie-consent.tsx).
//
// The base code below is Meta's standard snippet, ported to TypeScript so it
// can be injected on demand instead of running on page load.

const PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID || "1555333129701586";
const SCRIPT_ID = "meta-pixel-script";
const SCRIPT_SRC = "https://connect.facebook.net/en_US/fbevents.js";

let injected = false;
let granted = false;

export function isMetaPixelConfigured(): boolean {
  return Boolean(PIXEL_ID);
}

/** Meta's fbq stub — queues calls until fbevents.js takes over. */
function ensureFbqStub(): void {
  if (window.fbq) return;

  const fbq = function (this: unknown, ...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue!.push(args);
  } as NonNullable<Window["fbq"]>;

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
}

/**
 * Injects and initialises the Meta Pixel. Safe to call repeatedly — the script
 * is added once; later calls just re-grant consent after a revoke.
 */
export function loadMarketingScripts(): void {
  if (!PIXEL_ID) return;
  granted = true;

  ensureFbqStub();

  if (injected || document.getElementById(SCRIPT_ID)) {
    window.fbq!("consent", "grant");
    return;
  }
  injected = true;

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = SCRIPT_SRC;
  document.head.appendChild(script);

  window.fbq!("init", PIXEL_ID);
  window.fbq!("track", "PageView");
}

/**
 * Consent withdrawn mid-session: Meta's documented opt-out stops further
 * events. The already-loaded script stays put (removing it does nothing).
 */
export function disableMarketingScripts(): void {
  granted = false;
  if (window.fbq) window.fbq("consent", "revoke");
}

/**
 * PageView for client-side route changes — the initial one fires on load in
 * loadMarketingScripts(). No-ops without consent.
 */
export function trackPixelPageView(): void {
  if (!granted || !window.fbq) return;
  window.fbq("track", "PageView");
}

/**
 * Browser-side "Lead" for a submitted contact form. The same `eventId` is sent
 * to the Conversions API by server.js, and Meta deduplicates the pair — so the
 * lead is reported twice over two channels but counted once, which is exactly
 * what makes attribution survive ad-blockers and iOS. No-ops without consent.
 */
export function trackPixelLead(eventId: string): void {
  if (!granted || !window.fbq) return;
  window.fbq("track", "Lead", {}, { eventID: eventId });
}
