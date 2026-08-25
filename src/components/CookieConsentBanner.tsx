import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

const CookieConsentBanner: React.FC = () => {
  const { t } = useTranslation();
  const { isBannerVisible, acceptAll, acceptNecessaryOnly, openPreferences } =
    useCookieConsent();

  if (!isBannerVisible) return null;

  return (
    <div
      role="dialog"
      aria-label={t("cookieConsent.banner.heading")}
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#161616] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.6)] sm:p-7"
    >
      <h2 className="text-[1.05rem] font-medium tracking-[-0.01em] text-[#F5F5F5]">
        {t("cookieConsent.banner.heading")}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-white/70">
        {t("cookieConsent.banner.body1")}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/70">
        {t("cookieConsent.banner.body2")}
      </p>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <button type="button" className="btn btn-secondary btn-block sm:w-auto" onClick={openPreferences}>
          {t("cookieConsent.banner.details_btn")}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-block sm:w-auto"
          onClick={acceptNecessaryOnly}
        >
          {t("cookieConsent.banner.accept_necessary_btn")}
        </button>
        <button type="button" className="btn btn-primary btn-block sm:w-auto" onClick={acceptAll}>
          {t("cookieConsent.banner.accept_all_btn")}
        </button>
      </div>

      <div className="mt-4 flex gap-4 border-t border-white/10 pt-3 text-[11px] text-white/55">
        <Link to="/politica-de-confidentialitate" className="hover:text-[#ED5C1B]">
          {t("cookieConsent.banner.privacy_link")}
        </Link>
        <Link to="/politica-de-cookie-uri" className="hover:text-[#ED5C1B]">
          {t("cookieConsent.banner.cookie_policy_link")}
        </Link>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
