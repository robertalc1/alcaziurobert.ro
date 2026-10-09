"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import ContactCTA from "@/components/ContactCTA";
import Reveal from "@/components/Reveal";
import ShaderBackground from "@/components/ShaderBackground";
import { PHONE_TEL, PHONE_DISPLAY, WHATSAPP_URL, EMAIL_ADDRESS } from "@/lib/contact";
import { trackCall } from "@/lib/analytics";
import { trackPixelCall } from "@/lib/marketingPixels";

const EMAIL = EMAIL_ADDRESS;

/**
 * Footer — the original composition, transposed onto the light page's palette.
 *
 * The shape is the one this site had before the instantly.ai pass replaced it
 * with three columns of links: a full-width ghost wordmark, then one row of
 * pitch + CTA · brand mark · direct contact, then a hairline over centred legal
 * links and the copyright. That row is the point of it — the footer makes the
 * ask ONCE and puts the three ways to reach a human next to it, instead of
 * handing the visitor a sitemap at the end of a sales page.
 *
 * What did NOT come back is the palette it was drawn in. The old one was
 * #0F0F0F with #ED5C1B hovers because the whole site was dark then; the page
 * went light on 2026-09-06 and the accent went blue. So the surface is the
 * hero's: the same WebGL field behind the same panel, and the accent
 * is the brand blue lifted far enough to read on it (--ft-accent below). Two
 * different blacks and a stray orange would have been the only unexplained
 * colours left on the page.
 *
 * It is a PANEL, not a full-bleed band. Full-bleed put its square edges under
 * the closing panel's rounded ones and the whole bottom of the page read as one
 * dark mass with no boundary. Same geometry as that panel now, with 16px of
 * open page between them — the same 16px the hero has above it, so the page
 * carries one uniform light frame from top to bottom.
 *
 * `id="made-by-humans"` is load-bearing: MobileBottomBar watches it with an
 * IntersectionObserver to hide the floating button once the footer is in view.
 */
const MadeByHumans = () => {
  const { t } = useTranslation();
  const { openPreferences } = useCookieConsent();
  const year = new Date().getFullYear();

  const handleCall = () => {
    trackCall("footer");
    trackPixelCall();
  };

  return (
    <footer className="ft" id="made-by-humans">
      <style>{`
        /* The <footer> is only the wrapper: it holds the page colour and the
           16px of it that show above and below the panel. */
        .ft {
          position: relative;
          width: 100%;
          background: var(--page);
          padding: var(--panel-gutter) 0;
          /* --brand (#4580F7) is a light-page accent: on the panel it lands at
             2.4:1, and a hover state that dim is not a state at all. This is
             the same hue at a higher lightness — 6.4:1 on the ink — and it is
             the ONLY colour this component introduces. */
          --ft-accent: #8FB4FA;
        }
        /* The hero's panel, restated. Not "similar to" — the same width, the
           same radius, the same shadow, the same ink fallback and the same
           animated field, so the page's two dark objects cannot drift apart. */
        .ft-panel {
          position: relative;
          isolation: isolate;
          width: calc(100vw - var(--panel-gutter) * 2);
          max-width: var(--w-panel);
          margin-inline: auto;
          border-radius: var(--r-panel);
          /* Load-bearing: this is what clips the WebGL canvas to the radius. */
          overflow: hidden;
          /* The shader's own first colour stop, so a panel whose WebGL never
             starts is still the right colour rather than black. */
          background: var(--panel-ink);
          box-shadow: var(--shadow-panel);
        }
        /* No mask, same as the hero: the panel has a hard rounded edge of its
           own, so fading the field out would just look like the effect running
           out of steam before the border.

           0.6, though. The hero runs the field at full strength because it
           carries three lines of large white type; this panel carries fifteen
           small ones, and dimming the canvas toward --panel-ink keeps the
           field's SHAPE while pulling in its range. That is the difference
           between this and simply piling on more scrim: a heavier scrim
           flattens the bottom of the panel, opacity keeps variation everywhere
           and just lowers the ceiling. */
        .ft-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          pointer-events: none;
          opacity: 0.6;
        }
        /* Sinks the field under the copy. The hero's scrim darkens the TOP,
           because that is where its headline sits; this one darkens everything
           BELOW the wordmark, because that is where all fifteen lines of this
           footer live.
           Three layers and each one is answering a measurement, not a taste:
             · the linear ramp holds the whole lower half down;
             · the left radial covers the pitch and the button, which sit on the
               field's brightest mass;
             · the right radial covers the contact column — without it the 12px
               labels came out at 4.61:1 against a 4.5 floor, which is not a
               margin on a field that MOVES.
           Verified by sampling 14 frames of the running shader and taking the
           brightest pixel under each block of copy: pitch 5.39:1, contact
           6.52:1, legal/copyright 8.02:1, heading 6.71:1. Re-run that if you
           touch any of this — a still screenshot proves nothing here. */
        .ft-scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(4, 14, 34, 0.10) 0%, rgba(4, 14, 34, 0.34) 30%, rgba(4, 14, 34, 0.54) 58%, rgba(4, 14, 34, 0.64) 100%),
            radial-gradient(86% 80% at 28% 80%, rgba(4, 14, 34, 0.24) 0%, rgba(4, 14, 34, 0) 78%),
            radial-gradient(38% 54% at 84% 52%, rgba(4, 14, 34, 0.22) 0%, rgba(4, 14, 34, 0) 74%);
        }
        /* The canvas and the scrim are absolutely positioned, so anything that
           must sit in front of them needs a positioned box of its own. */
        .ft-wordmark { position: relative; z-index: 1; }
        .ft-inner {
          position: relative;
          z-index: 1;
          max-width: var(--w-page);
          margin: 0 auto;
          padding: 0 var(--page-gutter) var(--sp-48);
        }

        /* Keyboard focus: the global ring is --brand at 70%, which disappears
           on this ink for the same reason the hover colour had to move. */
        .ft a:focus-visible,
        .ft button:focus-visible {
          outline: 2px solid var(--ft-accent);
          outline-offset: 3px;
        }

        /* ── Giant ghost wordmark ───────────────────────────────────────── */
        /* Sits in the page gutter, not a gutter of its own, so its first and
           last letter line up with the nav's logo and the body column. */
        .ft-wordmark {
          display: block;
          width: 100%;
          margin: 0 0 clamp(-18px, -1.8vw, -8px);
          padding: clamp(30px, 5vh, 60px) var(--page-gutter) 0;
        }
        .ft-wordmark text {
          font-family: var(--font-sans);
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        /* ── Main row: pitch · mark · contact ───────────────────────────── */
        .ft-main {
          display: grid;
          grid-template-columns: minmax(280px, 1fr) auto minmax(280px, 1fr);
          align-items: center;
          gap: clamp(28px, 4vw, 64px);
          padding: clamp(28px, 4vh, 44px) 0 clamp(32px, 4.5vh, 52px);
        }

        .ft-title {
          font-family: var(--font-sans);
          font-weight: var(--text-heading-weight);
          font-size: clamp(1.7rem, 3vw, 2.5rem);
          line-height: 1.08;
          letter-spacing: var(--text-heading-ls);
          color: var(--on-panel);
          margin: 0 0 14px;
          text-wrap: balance;
        }
        .ft-body {
          font-family: var(--font-sans);
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--on-panel-muted);
          max-width: 40ch;
          margin: 0 0 clamp(20px, 2.6vh, 28px);
        }

        /* ── Brand mark ─────────────────────────────────────────────────── */
        .ft-logo {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* The SVG owns the enamel surface, fine border and dimensional edge. */
        .ft-mark {
          display: grid;
          place-items: center;
          width: 104px;
          aspect-ratio: 1;
          border-radius: var(--r-card);
          background: transparent;
        }
        .ft-mark img {
          width: 100%;
          height: auto;
          display: block;
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
          color: rgba(255, 255, 255, 0.68);
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
          color: var(--on-panel-muted);
          margin-bottom: 3px;
        }
        .ft-row-value {
          display: block;
          font-family: var(--font-sans);
          font-size: 15.5px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--on-panel);
          transition: color .25s ease;
        }
        .ft-row:hover .ft-row-value { color: var(--ft-accent); }
        .ft-row:hover .ft-icon { color: var(--ft-accent); }

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
        .ft-legal a,
        .ft-legal-btn {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 500;
          color: var(--on-panel-muted);
          text-decoration: none;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: color .25s ease;
        }
        .ft-legal a:hover,
        .ft-legal-btn:hover { color: var(--ft-accent); }
        .ft-copy {
          font-family: var(--font-sans);
          font-size: 13px;
          color: var(--on-panel-muted);
          margin: 0;
          text-align: center;
        }
        .ft-copy strong {
          color: rgba(255, 255, 255, 0.86);
          font-weight: 600;
        }

        /* ── Tablet ─────────────────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .ft-inner { padding-left: var(--sp-32); padding-right: var(--sp-32); }
          .ft-wordmark { padding-left: var(--sp-32); padding-right: var(--sp-32); }
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

        /* Radius steps down at 768, not at this component's own 700 — it has to
           match .touch-panel directly above it, or the two panels round their
           corners at different widths. */
        @media (max-width: 768px) {
          .ft-panel { border-radius: 18px; }
        }

        /* ── Phone ──────────────────────────────────────────────────────── */
        @media (max-width: 700px) {
          /* Clear the floating mobile action bar so the copyright is never
             under it. */
          .ft-inner {
            padding-left: var(--sp-24);
            padding-right: var(--sp-24);
            padding-bottom: 92px;
          }
          .ft-wordmark {
            padding: 26px var(--sp-24) 0;
            margin-bottom: -4px;
          }
          .ft-main {
            grid-template-columns: 1fr;
            justify-items: center;
            text-align: center;
            gap: 26px;
            padding: 26px 0 30px;
          }
          .ft-logo { grid-row: auto; grid-column: auto; order: -1; }
          .ft-mark { width: 84px; }
          .ft-body { margin-left: auto; margin-right: auto; }
          .ft-cta { width: 100%; max-width: 340px; }
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
          /* Each row is wrapped in a <Reveal> div, so :last-child has to
             match the wrapper — on .ft-row it would match every row (each is
             the only child of its own wrapper) and wipe every divider. */
          .ft-contact > :last-child .ft-row { border-bottom: none; }
          .ft-legal { gap: 4px 18px; }
          .ft-legal a, .ft-legal-btn { font-size: 13.5px; padding: 12px 2px; }
          .ft-copy { font-size: 12.5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ft-row-value, .ft-icon { transition: none; }
        }
      `}</style>

      <div className="ft-panel">
        <ShaderBackground className="ft-bg" />
        <div className="ft-scrim" aria-hidden="true" />

        {/* Ghost wordmark — SVG so it spans the full panel at any viewport */}
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
              <Reveal>
                <h2 className="ft-title">{t("footer.cta_title")}</h2>
                <p className="ft-body">{t("footer.cta_body")}</p>
                {/* modal, not "auto": the inline form this used to scroll to is
                    gone — #contact is now the closing panel, which carries a
                    button and nowhere to land. */}
                <ContactCTA mode="modal">
                  <button type="button" className="btn btn-primary ft-cta">
                    {t("footer.cta_button")}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </button>
                </ContactCTA>
              </Reveal>
            </div>

            {/* Brand mark */}
            <div className="ft-logo">
              <span className="ft-mark">
                <img src="/logo-mark.svg" alt="Alcaziu Robert" width={104} height={104} loading="lazy" />
              </span>
            </div>

            {/* Direct contact */}
            <div className="ft-contact">
              <Reveal>
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
              </Reveal>

              <Reveal delay={70}>
                <a className="ft-row" href={`tel:${PHONE_TEL}`} onClick={handleCall}>
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
              </Reveal>

              <Reveal delay={140}>
                <a
                  className="ft-row"
                  href={WHATSAPP_URL}
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
              </Reveal>
            </div>
          </div>

          <hr className="ft-rule" />

          <Reveal delay={240}>
            <div className="ft-bottom">
              <nav className="ft-legal" aria-label={t("footer.col_legal")}>
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
          </Reveal>
        </div>
      </div>
    </footer>
  );
};

export default MadeByHumans;
