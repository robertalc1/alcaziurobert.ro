import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

/**
 * Renders dynamic SEO meta tags that follow the active i18n locale.
 *
 * Static SEO baseline (canonical, OG image, robots, JSON-LD, Twitter card)
 * lives in index.html so crawlers see it before React boots. This component
 * only overrides what must change when the visitor switches language:
 * <html lang>, <title>, meta description, og:locale.
 */
const SEOHead: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("ro") ? "ro" : "en";
  const ogLocale = lang === "ro" ? "ro_RO" : "en_US";

  const title =
    lang === "ro"
      ? "Alcaziu Robert — Web design premium și dezvoltare custom"
      : "Alcaziu Robert — Premium web design & custom development";

  const description =
    lang === "ro"
      ? "Site-uri premium și aplicații web custom pentru afaceri care nu se mulțumesc cu template-uri. Design pe măsură, dezvoltare scalabilă, conversie reală."
      : "Premium websites and custom web applications for businesses that don't settle for templates. Bespoke design, scalable development, real conversion.";

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content={ogLocale} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEOHead;
