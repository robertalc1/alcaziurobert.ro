"use client";

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import ContactCTA from "@/components/ContactCTA";
import Reveal from "@/components/Reveal";
import { scrollToId } from "@/lib/scroll";
import { PHONE_TEL, PHONE_DISPLAY, WHATSAPP_URL, EMAIL_ADDRESS } from "@/lib/contact";
import { trackCall } from "@/lib/analytics";
import { trackPixelCall } from "@/lib/marketingPixels";

const EMAIL = EMAIL_ADDRESS;

// Same order as the navbar and the page. A footer that lists sections in a
// different order than the visitor met them is a small lie about the page.
const SECTION_IDS = ["offer", "work", "process", "faq"] as const;

/**
 * Footer, rebuilt on instantly.ai's measured geometry.
 *
 * What it used to be: a giant ghost wordmark, a two-column pitch/contact split,
 * and a hairline welded to the section above it. All three are gone.
 *
 * What instantly actually does, measured off the live page: 80px of air above
 * the content, NO border at the top (the whitespace is the separation), a logo
 * block on the left, then link columns of exactly 189px on a 32px gutter, then
 * a hairline and a copyright line at the very bottom.
 *
 * Theirs has five columns because they have five columns of content. This has
 * three, because that is how much real content exists — inventing two more
 * columns of links that go nowhere would match the screenshot and fail the
 * visitor. The column width and gutter are theirs; the count is honest.
 *
 * `id="made-by-humans"` is load-bearing: MobileBottomBar watches it with an
 * IntersectionObserver to hide the floating button once the footer is in view.
 */
const MadeByHumans = () => {
  const { t } = useTranslation();
  const { openPreferences } = useCookieConsent();
  const navigate = useNavigate();
  const location = useLocation();
  const year = new Date().getFullYear();
  const isHome = location.pathname === "/";

  // Section links work from any route: scroll on home, navigate + scroll from
  // anywhere else. Same contract as the navbar's anchors.
  const goToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHome) scrollToId(id);
    else navigate("/", { state: { scrollTo: id } });
  };

  const handleCall = () => {
    trackCall("footer");
    trackPixelCall();
  };

  return (
    <footer className="ft" id="made-by-humans">
      <style>{`
        /* No border-top. instantly separates its footer from the panel above
           with nothing but 80px of page, and the rule that used to be here is
           what made this footer read as bolted onto the gradient. */
        .ft {
          position: relative;
          width: 100%;
          background: var(--page);
          padding: var(--sp-80) 0 var(--sp-32);
        }
        .ft-inner {
          max-width: var(--w-page);
          margin: 0 auto;
          padding: 0 var(--page-gutter);
        }

        /* Logo block absorbs the slack on the left; the link columns are
           exactly instantly's 189px on a 32px gutter. */
        .ft-grid {
          display: grid;
          grid-template-columns: 1fr repeat(3, 189px);
          gap: var(--sp-32);
          align-items: start;
        }

        .ft-brand { max-width: 320px; }
        .ft-logo {
          display: inline-block;
          line-height: 1;
        }
        .ft-logo img {
          height: 30px;
          width: auto;
          display: block;
        }
        .ft-pitch {
          font-family: var(--font-sans);
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          color: var(--text-muted);
          margin: var(--sp-16) 0 var(--sp-24);
        }

        /* ── Link columns ── */
        .ft-col-head {
          font-family: var(--font-sans);
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
          color: var(--ink);
          margin: 0 0 var(--sp-16);
        }
        .ft-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ft-list a,
        .ft-list button {
          font-family: var(--font-sans);
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          color: var(--text-muted);
          text-decoration: none;
          background: none;
          border: 0;
          padding: 0;
          text-align: left;
          cursor: pointer;
          transition: color .2s ease;
        }
        .ft-list a:hover,
        .ft-list button:hover { color: var(--ink); }
        /* Contact rows carry a label and a value on two lines. */
        .ft-list a strong {
          display: block;
          font-weight: 400;
        }
        .ft-val {
          display: block;
          font-size: 13px;
          line-height: 18px;
          color: var(--text-muted);
        }
        .ft-list a:hover .ft-val { color: var(--ink); }

        /* ── Bottom row ── */
        .ft-rule {
          border: 0;
          height: 1px;
          background: var(--line);
          margin: var(--sp-64) 0 var(--sp-24);
        }
        .ft-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--sp-16);
          flex-wrap: wrap;
        }
        .ft-copy {
          font-family: var(--font-sans);
          font-size: 14px;
          line-height: 24px;
          color: var(--text-muted);
          margin: 0;
        }
        .ft-copy strong { font-weight: 600; color: var(--ink); }

        @media (max-width: 991px) {
          .ft-inner { padding: 0 var(--sp-32); }
          .ft-grid { grid-template-columns: repeat(3, 1fr); }
          .ft-brand { grid-column: 1 / -1; max-width: none; margin-bottom: var(--sp-16); }
        }
        @media (max-width: 767px) {
          .ft { padding-top: var(--sp-64); }
          .ft-inner { padding: 0 var(--sp-24); }
          .ft-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="ft-inner">
        <Reveal blur={0}>
          <div className="ft-grid">
            <div className="ft-brand">
              <Link to="/" className="ft-logo" aria-label={t("footer.copyright_l")}>
                <img src="/logo-mark.webp" alt="" width={52} height={30} />
              </Link>
              <p className="ft-pitch">{t("footer.cta_body")}</p>
              <ContactCTA mode="modal">
                <button type="button" className="btn btn-primary">
                  {t("footer.cta_button")}
                </button>
              </ContactCTA>
            </div>

            <div>
              <h2 className="ft-col-head">{t("footer.col_sections")}</h2>
              <ul className="ft-list">
                {SECTION_IDS.map((id) => (
                  <li key={id}>
                    <a href={`#${id}`} onClick={goToSection(id)}>{t(`nav.${id}`)}</a>
                  </li>
                ))}
                <li><Link to="/studii-de-caz">{t("nav.casestudy")}</Link></li>
              </ul>
            </div>

            <div>
              <h2 className="ft-col-head">{t("footer.col_legal")}</h2>
              <ul className="ft-list">
                <li><Link to="/termeni-si-conditii">{t("footer.terms_link")}</Link></li>
                <li><Link to="/politica-de-confidentialitate">{t("footer.privacy_link")}</Link></li>
                <li><Link to="/politica-de-cookie-uri">{t("footer.cookies_link")}</Link></li>
                <li>
                  <button type="button" onClick={openPreferences}>
                    {t("footer.cookie_settings")}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="ft-col-head">{t("footer.col_contact")}</h2>
              <ul className="ft-list">
                <li>
                  <a href={`mailto:${EMAIL}`}>
                    <strong>{t("footer.email_label")}</strong>
                    <span className="ft-val">{EMAIL}</span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${PHONE_TEL}`} onClick={handleCall}>
                    <strong>{t("footer.phone_label")}</strong>
                    <span className="ft-val">{PHONE_DISPLAY}</span>
                  </a>
                </li>
                <li>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <strong>{t("footer.whatsapp_label")}</strong>
                    <span className="ft-val">{t("footer.whatsapp_value")}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <hr className="ft-rule" />

        <div className="ft-bottom">
          <p className="ft-copy">
            © {year} <strong>{t("footer.copyright_l")}</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MadeByHumans;
