"use client";

import React from "react";
import { Trans, useTranslation } from "react-i18next";
import ContactCTA from "@/components/ContactCTA";
import Reveal from "@/components/Reveal";

const STEPS = ["s1", "s2"] as const;

// Reusing the same span across translations so React reconciles consistently.
const pillComponents = { pill: <span className="comp-pill" /> };

const CompoundingSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="comp-section" id="compounding">
      <style>{`
        .comp-section {
          width: 100%;
          background: #0F0F0F;
          padding: clamp(48px, 6vh, 80px) 16px;
        }
        .comp-inner {
          max-width: 880px;
          margin: 0 auto;
          position: relative;
        }
        .comp-title {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.028em;
          font-size: clamp(1.8rem, 4.6vw, 3rem);
          line-height: 1.05;
          color: #F5F5F5;
          margin: 0 auto clamp(20px, 3vh, 34px);
          max-width: 22ch;
          text-wrap: balance;
          text-align: center;
        }

        /* ── Cards grid ───────────────────────────── */
        .comp-grid {
          display: grid;
          grid-template-columns: repeat(2, auto);
          justify-content: center;
          gap: clamp(18px, 2.4vw, 32px);
          margin-bottom: clamp(16px, 2.4vh, 24px);
        }
        .comp-card {
          display: flex;
          flex-direction: column;
          gap: 9px;
          align-items: center;
          padding: 0;
        }
        .comp-card-title {
          font-family: var(--font-sans);
          font-size: clamp(1.6rem, 2.8vw, 2.2rem);
          font-weight: 700;
          color: #F5F5F5;
          letter-spacing: -0.005em;
          line-height: 1.1;
          margin: 0;
          text-wrap: balance;
          background: #1A1A1A;
          padding: 7px 22px;
          border-radius: 7px;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
          text-align: center;
          display: block;
        }
        .comp-card:first-child .comp-card-title {
          background: #ED5C1B;
          color: #ffffff;
        }
        .comp-card:last-child .comp-card-title {
          font-weight: 500;
        }
        .comp-card-tag {
          align-self: center;
          display: inline-block;
          background: transparent;
          color: #C4C9D0;
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          line-height: 1.3;
          white-space: pre-line;
          padding: 0;
          margin: 0;
          letter-spacing: -0.005em;
          text-align: center;
        }
        .comp-card:first-child .comp-card-tag {
          color: #ED5C1B;
        }
        /* ── Gray summary block ───────────────────── */
        .comp-summary {
          background: #1A1A1A;
          border-radius: clamp(16px, 2vw, 22px);
          padding: clamp(18px, 2.4vw, 26px) clamp(20px, 2.6vw, 30px);
          text-align: center;
          max-width: 480px;
          margin: 0 auto clamp(12px, 1.8vh, 18px);
        }
        .comp-summary p {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          line-height: 1.6;
          color: #F5F5F5;
          margin: 0;
          text-wrap: balance;
          max-width: 56ch;
          margin-left: auto;
          margin-right: auto;
        }
        .comp-summary p + p {
          margin-top: 0;
        }

        /* ── Inline highlight pill ────────────────── */
        .comp-pill {
          background: #ED5C1B;
          color: #ffffff;
          font-weight: 700;
          padding: 3px 11px;
          border-radius: 7px;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
          letter-spacing: -0.005em;
        }

        /* ── Outlined takeaway card ───────────────── */
        .comp-takeaway {
          padding: clamp(10px, 1.4vw, 16px) clamp(16px, 2.5vw, 28px);
          text-align: center;
          max-width: 480px;
          margin: 0 auto;
        }
        .comp-takeaway p {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          line-height: 1.6;
          color: #F5F5F5;
          margin: 0;
          text-wrap: balance;
          max-width: 56ch;
          margin-left: auto;
          margin-right: auto;
        }

        /* ── Section CTA — orange pill, mirrors the hero primary ── */
        .comp-cta {
          text-align: center;
          margin-top: clamp(20px, 3vh, 32px);
        }
        .comp-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 28px;
          min-height: 44px;
          border-radius: 9999px;
          background: var(--btn-gloss);
          box-shadow: var(--btn-gloss-shadow);
          color: #ffffff;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 14.5px;
          letter-spacing: -0.005em;
          white-space: nowrap;
          border: none;
          cursor: pointer;
          transition: filter 220ms cubic-bezier(0.23, 1, 0.32, 1),
                      box-shadow 220ms cubic-bezier(0.23, 1, 0.32, 1),
                      transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .comp-cta-btn:hover {
          filter: brightness(var(--btn-gloss-brightness, 1.06));
          box-shadow: var(--btn-gloss-shadow-hover);
          transform: translateY(-1px);
        }
        .comp-cta-btn:active { transform: scale(0.97); }
        .comp-cta-btn svg {
          width: 14px;
          height: 14px;
          transition: transform 220ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .comp-cta-btn:hover svg { transform: translateX(2px); }

        /* ── 3D emphasis accent ───────────────────── */
        .comp-accent {
          position: absolute;
          top: clamp(6px, 1.5vw, 24px);
          left: clamp(-8px, 1.4vw, 26px);
          width: clamp(64px, 8vw, 114px);
          height: auto;
          transform: rotate(-8deg);
          pointer-events: none;
          user-select: none;
          animation: comp-accent-float 5.5s ease-in-out infinite;
          z-index: 2;
        }
        @keyframes comp-accent-float {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          50% { transform: translateY(-12px) rotate(-8deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .comp-accent { animation: none; }
        }

        /* ── Mobile ───────────────────────────────── */
        @media (max-width: 768px) {
          .comp-section { padding: clamp(40px, 6vh, 64px) 18px clamp(36px, 5vh, 56px); }
          .comp-accent { display: none; }
          .comp-grid {
            grid-template-columns: repeat(2, auto);
            gap: 16px;
            margin-bottom: 12px;
          }
          .comp-card { padding: 0; gap: 7px; }
          .comp-card-title {
            font-size: 1.05rem;
            padding: 6px 16px;
            border-radius: 7px;
            line-height: 1.15;
          }
          .comp-card-tag {
            font-size: 0.95rem;
          }

          .comp-summary { padding: 18px 18px; margin-bottom: 9px; }

          .comp-takeaway { padding: 14px 18px; }
        }
        @media (max-width: 380px) {
          .comp-card-title { font-size: 0.95rem; padding: 6px 14px; }
          .comp-card-tag { font-size: 0.88rem; }
        }

      `}</style>

      <div className="comp-inner">
        <img
          src="/plane%20(1).webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1000}
          height={1000}
          className="comp-accent"
        />
        <Reveal>
          <h2 className="comp-title">{t("compounding.title")}</h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="comp-grid">
            {STEPS.map((key) => (
              <article key={key} className="comp-card">
                <h3 className="comp-card-title">{t(`compounding.${key}.what`)}</h3>
                <span className="comp-card-tag">{t(`compounding.${key}.tag`)}</span>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="comp-summary">
            <p>
              <Trans i18nKey="compounding.summary_l1" components={pillComponents} />
            </p>
            <p>
              <Trans i18nKey="compounding.summary_l2" components={pillComponents} />
            </p>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div className="comp-takeaway">
            <p>
              <Trans i18nKey="compounding.takeaway" components={pillComponents} />
            </p>
          </div>
        </Reveal>

        <div className="comp-cta">
          <ContactCTA>
            <button type="button" className="comp-cta-btn">
              {t("whatwedo.cta_primary")}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 19L19 5" />
                <path d="M9 5h10v10" />
              </svg>
            </button>
          </ContactCTA>
        </div>
      </div>
    </section>
  );
};

export default CompoundingSection;
