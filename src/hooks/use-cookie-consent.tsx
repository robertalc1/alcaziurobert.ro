import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { disableGoogleAnalytics, loadGoogleAnalytics } from "@/lib/analytics";
import { disableMarketingScripts, loadMarketingScripts } from "@/lib/marketingPixels";

const STORAGE_KEY = "cookieConsent";
const CONSENT_VERSION = 1;

export interface ConsentState {
  necessary: true;
  performance: boolean;
  marketing: boolean;
  consentedAt: string | null;
  version: number;
}

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  performance: false,
  marketing: false,
  consentedAt: null,
  version: CONSENT_VERSION,
};

// EDPB/ANSPDCP guidance: consent is not forever. After a year the banner asks
// again, so a choice made once cannot silently cover years of tracking.
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

function isExpired(consentedAt: string | null | undefined): boolean {
  if (!consentedAt) return true;
  const ts = Date.parse(consentedAt);
  return Number.isNaN(ts) || Date.now() - ts > CONSENT_MAX_AGE_MS;
}

function loadConsent(): ConsentState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONSENT;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return DEFAULT_CONSENT;
    // Expired consent counts as no answer at all — nothing loads until re-asked.
    if (isExpired(parsed.consentedAt)) return DEFAULT_CONSENT;
    return {
      necessary: true,
      performance: Boolean(parsed.performance),
      marketing: Boolean(parsed.marketing),
      consentedAt: parsed.consentedAt ?? null,
      version: CONSENT_VERSION,
    };
  } catch {
    return DEFAULT_CONSENT;
  }
}

function persistConsent(consent: ConsentState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Storage unavailable (private mode, disabled) — the choice just won't
    // survive a reload, and the banner will reappear next visit.
  }
}

interface CookieConsentContextValue {
  consent: ConsentState;
  hasResponded: boolean;
  isBannerVisible: boolean;
  isPreferencesOpen: boolean;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  savePreferences: (partial: { performance: boolean; marketing: boolean }) => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [consent, setConsent] = useState<ConsentState>(loadConsent);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const hasResponded = consent.consentedAt !== null;
  const isBannerVisible = !hasResponded && !isPreferencesOpen;

  const commit = useCallback((next: ConsentState) => {
    setConsent(next);
    persistConsent(next);
  }, []);

  const acceptAll = useCallback(() => {
    commit({
      necessary: true,
      performance: true,
      marketing: true,
      consentedAt: new Date().toISOString(),
      version: CONSENT_VERSION,
    });
    setIsPreferencesOpen(false);
  }, [commit]);

  const acceptNecessaryOnly = useCallback(() => {
    commit({
      necessary: true,
      performance: false,
      marketing: false,
      consentedAt: new Date().toISOString(),
      version: CONSENT_VERSION,
    });
    setIsPreferencesOpen(false);
  }, [commit]);

  const savePreferences = useCallback(
    (partial: { performance: boolean; marketing: boolean }) => {
      commit({
        necessary: true,
        performance: partial.performance,
        marketing: partial.marketing,
        consentedAt: new Date().toISOString(),
        version: CONSENT_VERSION,
      });
      setIsPreferencesOpen(false);
    },
    [commit]
  );

  const openPreferences = useCallback(() => setIsPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setIsPreferencesOpen(false), []);

  useEffect(() => {
    if (!hasResponded) return;
    if (consent.performance) loadGoogleAnalytics();
    else disableGoogleAnalytics();
  }, [hasResponded, consent.performance]);

  useEffect(() => {
    if (!hasResponded) return;
    if (consent.marketing) loadMarketingScripts();
    else disableMarketingScripts();
  }, [hasResponded, consent.marketing]);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consent,
      hasResponded,
      isBannerVisible,
      isPreferencesOpen,
      acceptAll,
      acceptNecessaryOnly,
      savePreferences,
      openPreferences,
      closePreferences,
    }),
    [
      consent,
      hasResponded,
      isBannerVisible,
      isPreferencesOpen,
      acceptAll,
      acceptNecessaryOnly,
      savePreferences,
      openPreferences,
      closePreferences,
    ]
  );

  return (
    <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
  );
};

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return ctx;
}
