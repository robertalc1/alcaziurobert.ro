import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SITE_URL = "https://alcaziurobert.ro";

type RouteCopy = {
  title: { en: string; ro: string };
  description: { en: string; ro: string };
};

const ROUTE_COPY: Record<string, RouteCopy> = {
  "/": {
    title: {
      en: "Alcaziu Robert — Premium web design & custom development",
      ro: "Alcaziu Robert — Web design premium și dezvoltare custom",
    },
    description: {
      en: "Premium websites and custom web applications for businesses that don't settle for templates. Bespoke design, scalable development, real conversion.",
      ro: "Site-uri premium și aplicații web custom pentru afaceri care nu se mulțumesc cu template-uri. Design pe măsură, dezvoltare scalabilă, conversie reală.",
    },
  },
  "/studii-de-caz": {
    title: {
      en: "Case Study & Approach — Alcaziu Robert",
      ro: "Studiu de caz & abordare — Alcaziu Robert",
    },
    description: {
      en: "How a premium website gets built end to end: discovery, Cloudflare performance, NIS2-grade security, server-side tracking, and SEO that compounds.",
      ro: "Cum se construiește un site premium de la un capăt la altul: discovery, performanță Cloudflare, securitate NIS2, tracking server-side și SEO care se compune.",
    },
  },
  "/termeni-si-conditii": {
    title: {
      en: "Terms & Conditions — Alcaziu Robert",
      ro: "Termeni și Condiții — Alcaziu Robert",
    },
    description: {
      en: "The terms that govern the use of alcaziurobert.ro and the contact form.",
      ro: "Termenii care guvernează utilizarea site-ului alcaziurobert.ro și a formularului de contact.",
    },
  },
  "/politica-de-confidentialitate": {
    title: {
      en: "Privacy Policy — Alcaziu Robert",
      ro: "Politica de Confidențialitate — Alcaziu Robert",
    },
    description: {
      en: "What data is collected on alcaziurobert.ro, why, and your rights under GDPR.",
      ro: "Ce date sunt colectate pe alcaziurobert.ro, de ce, și care sunt drepturile tale conform GDPR.",
    },
  },
  "/politica-de-cookie-uri": {
    title: {
      en: "Cookie Policy — Alcaziu Robert",
      ro: "Politica de Cookie-uri — Alcaziu Robert",
    },
    description: {
      en: "What cookies alcaziurobert.ro uses, why, and how to manage your preferences.",
      ro: "Ce cookie-uri folosește alcaziurobert.ro, de ce, și cum îți gestionezi preferințele.",
    },
  },
};

/**
 * Renders dynamic, route- and locale-aware SEO meta tags.
 *
 * Static SEO baseline (og:image, robots, JSON-LD, Twitter card) lives in
 * index.html so crawlers see it before React boots — a safe default for
 * the homepage. This component overrides what must change per route/
 * language: <html lang>, <title>, meta description, canonical, og:*.
 */
const SEOHead: React.FC = () => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const lang = i18n.language?.startsWith("ro") ? "ro" : "en";
  const ogLocale = lang === "ro" ? "ro_RO" : "en_US";

  const copy = ROUTE_COPY[pathname];
  const isKnownRoute = Boolean(copy);
  const { title, description } = copy ?? ROUTE_COPY["/"];
  const canonicalUrl = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title[lang]}</title>
      <meta name="description" content={description[lang]} />
      <link rel="canonical" href={canonicalUrl} />
      {!isKnownRoute && <meta name="robots" content="noindex, follow" />}
      <meta property="og:title" content={title[lang]} />
      <meta property="og:description" content={description[lang]} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={ogLocale} />
      <meta name="twitter:title" content={title[lang]} />
      <meta name="twitter:description" content={description[lang]} />
    </Helmet>
  );
};

export default SEOHead;
