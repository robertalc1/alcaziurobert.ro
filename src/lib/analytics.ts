// Trimmed on purpose. The id travels by copy-paste into a GitHub secret, and a
// single leading space survives all the way into the tag URL
// (`gtag/js?id=%20G-…`): the script loads, GA answers, nothing is ever
// collected, and no error appears anywhere. Cost us a deploy to find.
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
const SCRIPT_ID = "ga4-gtag-script";

let injected = false;
let granted = false;

export function isGaConfigured(): boolean {
  return Boolean(GA_MEASUREMENT_ID);
}

/**
 * Google's gtag stub, kept byte-for-byte faithful to the official snippet in
 * the one detail that matters: it pushes the `arguments` object, not an array.
 *
 * gtag.js walks dataLayer and only treats an entry as a gtag command when it is
 * an Arguments object — a real Array is silently ignored. The tidy-looking
 * rest-parameter version this replaces pushed `["config", "G-…"]`, so the
 * container loaded, answered 200, fired gtm.dom and gtm.load, and never
 * configured the measurement id. No page_view, no /collect, no error: GA had
 * never recorded a single hit.
 *
 * The `function` keyword is load-bearing — an arrow function has no
 * `arguments`.
 */
function ensureGtagStub() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
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

  granted = true;
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

/**
 * GA4 conversion for a submitted contact form. `generate_lead` is GA4's
 * recommended event name, so it can be marked as a key event in the GA4 UI and
 * imported into Google Ads without any extra tagging. No-ops until the visitor
 * has accepted the Performance category (gtag only exists after that).
 */
export function trackLead(projectType: string, locale: string): void {
  // `granted` — not just the presence of window.gtag — is the gate: any other
  // script defining gtag must not be able to make this fire without consent.
  if (!granted || !GA_MEASUREMENT_ID || !window.gtag) return;
  window.gtag("event", "generate_lead", {
    project_type: projectType,
    locale,
  });
}

// Stops further hits via GA's documented opt-out flag, without removing the
// already-injected script — used when consent is revoked mid-session.
export function disableGoogleAnalytics(): void {
  granted = false;
  if (!GA_MEASUREMENT_ID) return;
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
}

/**
 * GA4 `form_start` — fired the first time a visitor touches the contact form,
 * whether or not they finish it. It is what makes the funnel readable: without
 * it a page with 200 sessions and 4 leads looks identical to one where nobody
 * ever tried. No-ops until Performance consent is granted.
 */
export function trackFormStart(): void {
  if (!granted || !GA_MEASUREMENT_ID || !window.gtag) return;
  window.gtag("event", "form_start", { form_name: "contact" });
}

/**
 * GA4 event for a tap on any `tel:` link. The phone is the funnel's secondary
 * conversion (PRODUCT.md) and until now it was the only one nobody measured:
 * a visitor who called instead of filling the form was indistinguishable from
 * one who bounced. `source` says which of the four call entry points it was —
 * navbar, menu, bottom bar or footer — so a button that earns nothing can be
 * removed on evidence. No-ops until Performance consent is granted.
 */
export function trackCall(source: string): void {
  if (!granted || !GA_MEASUREMENT_ID || !window.gtag) return;
  window.gtag("event", "phone_click", { source });
}
