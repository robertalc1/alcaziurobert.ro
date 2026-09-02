import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import ro from "@/locales/ro.json";

const STORAGE_KEY = "lang";

/**
 * Language for a first-time visitor.
 *
 * A saved choice always wins. Otherwise the browser decides: the traffic comes
 * from Romanian ads to a Romanian market, and landing a Romanian prospect on
 * an English page costs a lead before the first sentence is read. English
 * stays the fallback — and the fallback is what Googlebot gets, since it
 * requests en-US, which keeps the crawled page consistent with the English
 * meta tags the server renders.
 */
function detectLanguage(): "en" | "ro" {
  // Romanian is the site's language. Every client is Romanian, the ads run in
  // Romania, and the domain is .ro — so browser sniffing is not just
  // unnecessary, it is wrong: a Romanian running Windows in English would be
  // handed the wrong language on his own market's site.
  //
  // The only thing that overrides this is the visitor asking for English.
  if (typeof window === "undefined") return "ro";

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "ro" || saved === "en") return saved;
  } catch {
    // Storage blocked (private mode) — fall through to the default.
  }

  return "ro";
}

const initialLng = detectLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ro: { translation: ro },
    },
    lng: initialLng,
    fallbackLng: "ro",
    interpolation: { escapeValue: false },
    returnNull: false,
  });

if (typeof document !== "undefined") {
  document.documentElement.lang = initialLng;
}

i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;
