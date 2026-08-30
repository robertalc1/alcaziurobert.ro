import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import routeMeta from "../../route-meta.json";

const SITE_URL = "https://alcaziurobert.ro";

type RouteCopy = {
  title: { en: string; ro: string };
  description: { en: string; ro: string };
};

/**
 * Single source of truth for per-route titles and descriptions, shared with
 * server.js. The server injects these into the HTML it serves so a crawler
 * that never runs JavaScript still gets the right title, description and
 * canonical; this component then keeps them correct as the visitor navigates
 * and switches language. Two copies of this text would drift, and the drift
 * would be invisible — only crawlers read the server-rendered half.
 */
const ROUTE_COPY = routeMeta as Record<string, RouteCopy>;


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
  // Trailing slash kept on the homepage so this matches sitemap.xml and the
  // copy server.js renders. Two spellings of the same URL is exactly the kind
  // of thing that splits a page's signals in half.
  const canonicalUrl = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;

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
