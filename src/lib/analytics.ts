const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const SCRIPT_ID = "ga4-gtag-script";

let injected = false;

export function isGaConfigured(): boolean {
  return Boolean(GA_MEASUREMENT_ID);
}

function ensureGtagStub() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer!.push(args);
    };
  }
}

// Called once "Performanță" consent is granted. Safe to call repeatedly —
// no-ops past the first successful injection, and re-arms hit collection
// if a prior disableGoogleAnalytics() call had turned it off this session.
export function loadGoogleAnalytics(): void {
  if (!GA_MEASUREMENT_ID) {
    if (import.meta.env.DEV) {
      console.warn(
        "[analytics] VITE_GA_MEASUREMENT_ID is not set — Google Analytics will not load."
      );
    }
    return;
  }

  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] = false;

  if (injected || document.getElementById(SCRIPT_ID)) return;
  injected = true;

  ensureGtagStub();

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag!("js", new Date());
  window.gtag!("config", GA_MEASUREMENT_ID);
}

// Stops further hits via GA's documented opt-out flag, without removing the
// already-injected script — used when consent is revoked mid-session.
export function disableGoogleAnalytics(): void {
  if (!GA_MEASUREMENT_ID) return;
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
}
