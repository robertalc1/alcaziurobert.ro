"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";
import ContactCTA from "@/components/ContactCTA";

const DELIVERABLES = [1, 2, 3, 4] as const;
const FACTS = [1, 2, 3] as const;

/**
 * The offer, stated plainly. This is the section the page did not have: every
 * other block either promised something (hero), proved something (work,
 * testimonials) or handled an objection (FAQ) — nothing said what you actually
 * get, by when, and what happens if it does not work.
 *
 * No price and no budget field, deliberately. The qualification happens on the
 * call, not on the page.
 */
const OfferSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="offer-section" id="offer">
      <style>{`
        .offer-section {
          width: 100%;
          background: #0F0F0F;
          padding: clamp(56px, 8vh, 104px) clamp(18px, 3vw, 32px);
        }
        .offer-inner {
          max-width: 1180px;
          margin: 0 auto;
        }
        .offer-kicker {
          display: inline-block;
          color: #ED5C1B;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }
        .offer-title {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.028em;
          font-size: clamp(1.8rem, 4.6vw, 3rem);
          line-height: 1.05;
          color: #F5F5F5;
          margin: clamp(20px, 3vh, 30px) 0 0;
          max-width: 20ch;
        }
        .offer-lead {
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.5vw, 17px);
          line-height: 1.6;
          color: rgba(245, 245, 245, 0.68);
          margin: clamp(14px, 2vh, 20px) 0 0;
          max-width: 62ch;
        }

        /* ── What you get ─────────────────────────────────────────────── */
        .offer-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(18px, 2.4vw, 28px);
          margin-top: clamp(36px, 5vh, 56px);
        }
        @media (max-width: 768px) {
          .offer-grid { grid-template-columns: minmax(0, 1fr); }
        }
        .offer-card {
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 16px;
          background: #141414;
          padding: clamp(20px, 2.4vw, 28px);
        }
        .offer-card-num {
          display: block;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.42);
        }
        .offer-card-title {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: clamp(1.05rem, 1.8vw, 1.25rem);
          letter-spacing: -0.018em;
          line-height: 1.25;
          color: #F5F5F5;
          margin: 12px 0 0;
        }
        .offer-card-body {
          font-family: var(--font-sans);
          font-size: 14.5px;
          line-height: 1.62;
          color: rgba(245, 245, 245, 0.64);
          margin: 10px 0 0;
        }

        /* ── Terms strip ──────────────────────────────────────────────── */
        .offer-facts {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(16px, 2vw, 24px);
          margin-top: clamp(28px, 4vh, 40px);
          padding-top: clamp(24px, 3vh, 32px);
          border-top: 1px solid rgba(255, 255, 255, 0.09);
        }
        @media (max-width: 640px) {
          .offer-facts { grid-template-columns: minmax(0, 1fr); gap: 18px; }
        }
        .offer-fact-label {
          display: block;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.5);
        }
        .offer-fact-value {
          display: block;
          font-family: var(--font-sans);
          font-size: clamp(1rem, 1.7vw, 1.15rem);
          font-weight: 500;
          letter-spacing: -0.018em;
          color: #F5F5F5;
          margin-top: 7px;
        }

        /* ── Guarantee ────────────────────────────────────────────────── */
        .offer-guarantee {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: clamp(28px, 4vh, 40px);
          padding: clamp(22px, 2.6vw, 30px);
          border-radius: 16px;
          border: 1px solid rgba(237, 92, 27, 0.30);
          /* Warm wash rather than a solid fill — the only orange panel on the
             page, so it reads as the one promise that carries risk. */
          background:
            radial-gradient(120% 160% at 0% 0%, rgba(237, 92, 27, 0.14), transparent 62%),
            #141414;
        }
        .offer-guar-label {
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #ED5C1B;
        }
        .offer-guar-title {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: clamp(1.2rem, 2.4vw, 1.6rem);
          letter-spacing: -0.022em;
          line-height: 1.2;
          color: #F5F5F5;
          margin: 0;
        }
        .offer-guar-body {
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.62;
          color: rgba(245, 245, 245, 0.76);
          margin: 0;
          max-width: 66ch;
        }

        .offer-cta-row {
          margin-top: clamp(28px, 4vh, 40px);
        }
        .offer-cta {
          display: inline-flex;
          align-items: center;
          gap: var(--btn-gap);
          min-height: var(--btn-h);
          padding: 0 var(--btn-px);
          border: none;
          border-radius: 9999px;
          background: var(--btn-gloss);
          box-shadow: var(--btn-gloss-shadow);
          color: #ffffff;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: var(--btn-font);
          letter-spacing: -0.005em;
          cursor: pointer;
          transition: filter .25s ease, box-shadow .25s ease,
                      transform .2s cubic-bezier(.23,1,.32,1);
        }
        .offer-cta:hover {
          filter: brightness(var(--btn-gloss-brightness, 1.06));
          box-shadow: var(--btn-gloss-shadow-hover);
          transform: translateY(-1px);
        }
        .offer-cta:active { transform: scale(0.98); }
        .offer-cta svg {
          width: 15px; height: 15px;
          fill: none; stroke: currentColor; stroke-width: 2;
          stroke-linecap: round; stroke-linejoin: round;
          transition: transform .25s cubic-bezier(.23,1,.32,1);
        }
        .offer-cta:hover svg { transform: translate(2px, -2px); }
        @media (prefers-reduced-motion: reduce) {
          .offer-cta,
          .offer-cta:hover,
          .offer-cta:hover svg { transform: none; }
        }
      `}</style>

      <div className="offer-inner">
        <Reveal>
          <span className="offer-kicker">{t("offer.kicker")}</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="offer-title">{t("offer.title")}</h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="offer-lead">{t("offer.lead")}</p>
        </Reveal>

        <div className="offer-grid">
          {DELIVERABLES.map((n, i) => (
            <Reveal key={n} delay={Math.min(i, 3) * 70}>
              <div className="offer-card">
                <span className="offer-card-num">0{n}</span>
                <h3 className="offer-card-title">{t(`offer.d${n}_title`)}</h3>
                <p className="offer-card-body">{t(`offer.d${n}_body`)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="offer-facts">
            {FACTS.map((n) => (
              <div key={n}>
                <span className="offer-fact-label">{t(`offer.fact${n}_label`)}</span>
                <span className="offer-fact-value">{t(`offer.fact${n}_value`)}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="offer-guarantee">
            <span className="offer-guar-label">{t("offer.guarantee_label")}</span>
            <h3 className="offer-guar-title">{t("offer.guarantee_title")}</h3>
            <p className="offer-guar-body">{t("offer.guarantee_body")}</p>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="offer-cta-row">
            <ContactCTA>
              <button type="button" className="offer-cta">
                {t("offer.cta")}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </button>
            </ContactCTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default OfferSection;
