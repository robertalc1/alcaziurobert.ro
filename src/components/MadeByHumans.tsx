"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import ContactCTA from "@/components/ContactCTA";

const PHONE_DISPLAY = "+40 773 858 164";
const PHONE_TEL = "+40773858164";
const PHONE_WA = "40773858164";
const EMAIL = "contact@alcaziurobert.ro";

const MadeByHumans = () => {
  const { t } = useTranslation();
  const { openPreferences } = useCookieConsent();
  const year = new Date().getFullYear();

  return (
    <footer className="ft" id="made-by-humans">
      <style>{`
        .ft {
          position: relative;
          width: 100%;
          background: #0F0F0F;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          overflow: hidden;
        }
        /* Warm ember glow bleeding up from the bottom edge, like the reference */
        .ft::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(64% 50% at 50% 112%, rgba(237, 92, 27, 0.16), transparent 74%);
        }
        .ft-inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(18px, 3.4vw, 44px) clamp(28px, 4vh, 44px);
        }

        /* ── Giant ghost wordmark ───────────────────────────────────────── */
        .ft-wordmark {
          display: block;
          width: 100%;
          margin: 0 0 clamp(-18px, -1.8vw, -8px);
          padding: clamp(30px, 5vh, 60px) clamp(14px, 1.6vw, 26px) 0;
        }
        .ft-wordmark text {
          font-family: var(--font-sans);
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        /* ── Main row: pitch · logo · contact ───────────────────────────── */
        .ft-main {
          display: grid;
          grid-template-columns: minmax(280px, 1fr) auto minmax(280px, 1fr);
          align-items: center;
          gap: clamp(28px, 4vw, 64px);
          padding: clamp(28px, 4vh, 44px) 0 clamp(32px, 4.5vh, 52px);
        }

        .ft-title {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: clamp(1.7rem, 3vw, 2.5rem);
          line-height: 1.08;
          letter-spacing: -0.035em;
          color: #F5F5F5;
          margin: 0 0 14px;
        }
        .ft-body {
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.62;
          color: rgba(255, 255, 255, 0.72);
          max-width: 40ch;
          margin: 0 0 clamp(20px, 2.6vh, 28px);
        }
        .ft-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 30px;
          min-height: 50px;
          border-radius: 9999px;
          border: none;
          background: #ED5C1B;
          color: #ffffff;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 15px;
          letter-spacing: -0.005em;
          cursor: pointer;
          transition: background 240ms cubic-bezier(.23,1,.32,1),
                      transform 180ms cubic-bezier(.23,1,.32,1);
        }
        .ft-cta:hover { background: #C44E17; }
        .ft-cta:active { transform: scale(0.98); }
        .ft-cta svg {
          width: 15px; height: 15px;
          fill: none; stroke: currentColor; stroke-width: 2;
          stroke-linecap: round; stroke-linejoin: round;
          transition: transform 240ms cubic-bezier(.23,1,.32,1);
        }
        .ft-cta:hover svg { transform: translate(2px, -2px); }

        .ft-logo {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ft-logo img {
          height: clamp(64px, 7vw, 104px);
          width: auto;
          opacity: 0.96;
        }

        /* ── Contact list ───────────────────────────────────────────────── */
        .ft-contact {
          display: flex;
          flex-direction: column;
          gap: clamp(16px, 2.2vh, 24px);
          justify-self: end;
        }
        .ft-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          text-decoration: none;
        }
        .ft-icon {
          flex-shrink: 0;
          width: 22px; height: 22px;
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.55);
          transition: color .25s ease;
        }
        .ft-icon svg {
          width: 100%; height: 100%;
          fill: none; stroke: currentColor; stroke-width: 1.6;
          stroke-linecap: round; stroke-linejoin: round;
        }
        .ft-row-label {
          display: block;
          font-family: var(--font-sans);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: rgba(255, 255, 255, 0.52);
          margin-bottom: 3px;
        }
        .ft-row-value {
          display: block;
          font-family: var(--font-sans);
          font-size: 15.5px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: #F5F5F5;
          transition: color .25s ease;
        }
        .ft-row:hover .ft-row-value { color: #ED5C1B; }
        .ft-row:hover .ft-icon { color: #ED5C1B; }

        /* ── Bottom bar ─────────────────────────────────────────────────── */
        .ft-rule {
          height: 1px;
          background: rgba(255, 255, 255, 0.10);
          border: none;
          margin: 0;
        }
        .ft-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding-top: clamp(22px, 3vh, 32px);
        }
        .ft-legal {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: clamp(18px, 3vw, 38px);
        }
        .ft-legal a {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.72);
          text-decoration: none;
          transition: color .25s ease;
        }
        .ft-legal a:hover { color: #ED5C1B; }
        .ft-legal-btn {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.72);
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: color .25s ease;
        }
        .ft-legal-btn:hover { color: #ED5C1B; }
        .ft-copy {
          font-family: var(--font-sans);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.52);
          margin: 0;
          text-align: center;
        }
        .ft-copy strong {
          color: rgba(255, 255, 255, 0.78);
          font-weight: 600;
        }

        /* ── Tablet ─────────────────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .ft-main {
            grid-template-columns: 1fr auto;
            gap: clamp(24px, 4vw, 40px);
          }
          .ft-logo { grid-row: 1; grid-column: 2; }
          .ft-contact {
            grid-column: 1 / -1;
            justify-self: start;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 28px 44px;
          }
        }

        /* ── Phone ──────────────────────────────────────────────────────── */
        @media (max-width: 700px) {
          /* Clear the floating mobile action bar so the copyright is never under it */
          .ft-inner { padding-bottom: 92px; }
          .ft-wordmark { padding-top: 26px; margin-bottom: -4px; }
          .ft-main {
            grid-template-columns: 1fr;
            justify-items: center;
            text-align: center;
            gap: 26px;
            padding: 26px 0 30px;
          }
          .ft-logo { grid-row: auto; grid-column: auto; order: -1; }
          .ft-logo img { height: 58px; }
          .ft-body { margin-left: auto; margin-right: auto; }
          .ft-cta { width: 100%; max-width: 340px; justify-content: center; }
          .ft-contact {
            grid-column: auto;
            justify-self: stretch;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            width: 100%;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }
          /* Full-width tap rows on phones — 56px+ targets, hairline separated */
          .ft-row {
            align-items: center;
            padding: 15px 2px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            text-align: left;
          }
          .ft-row:last-child { border-bottom: none; }
          .ft-legal { gap: 4px 18px; }
          .ft-legal a, .ft-legal-btn { font-size: 13.5px; padding: 12px 2px; }
          .ft-copy { font-size: 12.5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ft-cta, .ft-cta svg, .ft-row-value, .ft-icon { transition: none; }
          .ft-cta:hover svg { transform: none; }
        }
      `}</style>

      {/* Ghost wordmark — SVG so it spans the full width at any viewport */}
      <svg
        className="ft-wordmark"
        viewBox="0 0 1000 116"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={t("footer.copyright_l")}
      >
        <defs>
          <linearGradient id="ft-wordmark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <text
          x="500"
          y="92"
          textAnchor="middle"
          textLength="920"
          lengthAdjust="spacing"
          fontSize="104"
          fill="url(#ft-wordmark-fill)"
        >
          {t("footer.wordmark")}
        </text>
      </svg>

      <div className="ft-inner">

        <div className="ft-main">
          {/* Pitch + CTA */}
          <div className="ft-pitch">
            <h2 className="ft-title">{t("footer.cta_title")}</h2>
            <p className="ft-body">{t("footer.cta_body")}</p>
            <ContactCTA>
              <button type="button" className="ft-cta">
                {t("footer.cta_button")}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </button>
            </ContactCTA>
          </div>

          {/* Brand mark */}
          <div className="ft-logo">
            <img src="/logo-mark.webp" alt="" width={222} height={128} loading="lazy" />
          </div>

          {/* Direct contact */}
          <div className="ft-contact">
            <a className="ft-row" href={`mailto:${EMAIL}`}>
              <span className="ft-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <polyline points="3,7 12,13 21,7" />
                </svg>
              </span>
              <span>
                <span className="ft-row-label">{t("footer.email_label")}</span>
                <span className="ft-row-value">{EMAIL}</span>
              </span>
            </a>

            <a className="ft-row" href={`tel:${PHONE_TEL}`}>
              <span className="ft-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 16.92v2.1a2 2 0 0 1-2.18 2 19.6 19.6 0 0 1-8.58-3.06 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3.06-8.58A2 2 0 0 1 4.18 2h2.1A2 2 0 0 1 8.2 3.72l.67 2a2 2 0 0 1-.46 2.02L7.3 8.9a16.5 16.5 0 0 0 7.8 7.8l1.15-1.11a2 2 0 0 1 2.02-.46l2 .67A2 2 0 0 1 22 16.92Z" />
                </svg>
              </span>
              <span>
                <span className="ft-row-label">{t("footer.phone_label")}</span>
                <span className="ft-row-value">{PHONE_DISPLAY}</span>
              </span>
            </a>

            <a
              className="ft-row"
              href={`https://wa.me/${PHONE_WA}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="ft-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.45L3 20.5l1.6-5.3A8.5 8.5 0 1 1 21 11.5Z" />
                  <path d="M8.6 9.1c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.6 1.4c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.3 0 .6a7 7 0 0 0 2.8 2.3c.3.1.5.1.6 0l.5-.6c.2-.2.4-.2.6-.1l1.4.7c.3.1.4.3.4.5 0 .6-.4 1.3-1.5 1.5-1 .2-2.6-.3-4.2-1.6a9 9 0 0 1-2.6-3.6c-.3-1-.2-1.8.1-2.3Z" />
                </svg>
              </span>
              <span>
                <span className="ft-row-label">{t("footer.whatsapp_label")}</span>
                <span className="ft-row-value">{t("footer.whatsapp_value")}</span>
              </span>
            </a>
          </div>
        </div>

        <hr className="ft-rule" />

        <div className="ft-bottom">
          <nav className="ft-legal" aria-label={t("footer.terms_link")}>
            <Link to="/termeni-si-conditii">{t("footer.terms_link")}</Link>
            <Link to="/politica-de-confidentialitate">{t("footer.privacy_link")}</Link>
            <Link to="/politica-de-cookie-uri">{t("footer.cookies_link")}</Link>
            {/* Withdrawing consent must be as easy as giving it (GDPR art. 7(3)) */}
            <button type="button" className="ft-legal-btn" onClick={openPreferences}>
              {t("footer.cookie_settings")}
            </button>
          </nav>

          <p className="ft-copy">
            © {year} <strong>{t("footer.copyright_l")}</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MadeByHumans;
