import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import ro from "@/locales/ro.json";

const STORAGE_KEY = "lang";
const saved =
  typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
const initialLng = saved === "ro" || saved === "en" ? saved : "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ro: { translation: ro },
    },
    lng: initialLng,
    fallbackLng: "en",
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
