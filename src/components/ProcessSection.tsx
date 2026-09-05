"use client";

import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";

const STEPS = [1, 2, 3, 4, 5] as const;

// Reusing the same span across translations so React reconciles consistently.
// Declared locally rather than borrowed from CompoundingSection: that section is
// lazy-loaded after this one, so its <style> may not be in the document yet.
const pillComponents = { pill: <span className="proc-pill" /> };

/**
 * How the work runs. Shares the centred card grid with OfferSection — the two
 * answer "what" and "how" and have to scan identically. If you change the card
 * spec here, change it there too; each section owns its own styles by
 * convention, so the duplication is deliberate.
 */
const ProcessSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="proc-section" id="process">
      <style>{`
        /* Every dimension below is the CompoundingSection spec, 1:1 — that
           section is the reference the whole funnel is tuned to. If you change
           a number here, change it there and in OfferSection too. */
        .proc-section {
          width: 100%;
          background: #0F0F0F;
          padding: clamp(48px, 6vh, 80px) 16px;
        }
        /* Same narrow, centred column as .comp-inner and .faq-inner. */
        .proc-inner {
          max-width: 880px;
          margin: 0 auto;
          text-align: center;
        }
        .proc-title-main {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.022em;
          font-size: var(--text-section-title);
          line-height: 1.15;
          color: #F5F5F5;
          margin: 0 auto;
          max-width: 30ch;
          text-wrap: balance;
        }
        /* Body scale — --text-body in index.css, shared by every paragraph on
           the site. Never hardcode a size on a body rule again. */
        .proc-lead {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: #F5F5F5;
          max-width: 56ch;
          margin: clamp(14px, 2vh, 20px) auto 0;
          text-wrap: balance;
        }

        /* ── Inline highlight pill — same spec as .comp-pill ───────────── */
        .proc-pill {
          background: #ED5C1B;
          color: #ffffff;
          font-weight: 700;
          padding: 3px 11px;
          border-radius: 7px;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
          letter-spacing: -0.005em;
        }

        /* ── The five stages ──────────────────────────────────────────── */
        .proc-list {
          list-style: none;
          padding: 0;
          margin: clamp(36px, 5vh, 56px) 0 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(18px, 2.4vw, 32px);
        }
        /* Both the li and the Reveal wrapper have to stretch, otherwise two
           cards in a row settle at their own content heights. */
        .proc-list li { display: flex; }
        /* Five stages into two columns leaves a hole on the last row. Stage 05
           is the ongoing one, so it takes the full width and reads as the
           capstone rather than as a leftover. */
        .proc-list li:last-child { grid-column: 1 / -1; }
        .proc-card-wrap { flex: 1; display: flex; }
        .proc-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
          background: #1A1A1A;
          border-radius: clamp(16px, 2vw, 22px);
          padding: clamp(18px, 2.4vw, 26px) clamp(20px, 2.6vw, 30px);
          text-align: center;
        }
        /* Bare step number, bold — the week labels it replaced only repeated
           what the numeral already said. On --text-body so it tracks the rest
           of the copy instead of inventing a size of its own, and one clear
           step below the title above it.

           line-height: 1, not --text-body-lh: a single glyph on its own row
           does not need paragraph leading, and 1.55 padded 4.7px of dead space
           above and below it, so the 9px card gap read as 14px on one side.
           .offer-num carries this identical spec — the two card grids are the
           same component in two sections, and they must not drift. */
        .proc-num {
          font-family: var(--font-sans);
          font-size: var(--text-body);
          font-weight: 700;
          line-height: 1;
          color: #ED5C1B;
          font-variant-numeric: tabular-nums;
          letter-spacing: var(--text-body-ls);
        }
        /* Card title scale — --text-card-title in index.css. */
        .proc-step-title {
          font-family: var(--font-sans);
          font-size: var(--text-card-title);
          font-weight: 700;
          letter-spacing: -0.005em;
          line-height: 1.1;
          color: #F5F5F5;
          margin: 0;
          text-wrap: balance;
        }
        .proc-body {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: #F5F5F5;
          max-width: 56ch;
          margin: 0 auto;
          text-wrap: balance;
        }

        /* ── Mobile — one column, same centred cards ─────────────────────
           Section padding and card gaps track .comp-section / .comp-grid.
           Nothing overrides type here: --text-card-title and --text-body carry
           their own clamps, so the 20px/16px mobile pair comes for free. */
        @media (max-width: 768px) {
          .proc-section { padding: clamp(40px, 6vh, 64px) 18px clamp(36px, 5vh, 56px); }
          .proc-list { grid-template-columns: minmax(0, 1fr); gap: 16px; }
          .proc-card { gap: 7px; }
        }
      `}</style>

      <div className="proc-inner">
        <Reveal>
          <h2 className="proc-title-main">{t("process.title")}</h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="proc-lead">
            <Trans i18nKey="process.lead" components={pillComponents} />
          </p>
        </Reveal>

        <ol className="proc-list">
          {STEPS.map((n, i) => (
            <li key={n}>
              <Reveal delay={Math.min(i, 3) * 70} className="proc-card-wrap">
                <div className="proc-card">
                  <span className="proc-num">{n}</span>
                  <h3 className="proc-step-title">{t(`process.step${n}_title`)}</h3>
                  <p className="proc-body">{t(`process.step${n}_body`)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ProcessSection;
