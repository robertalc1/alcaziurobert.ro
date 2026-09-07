"use client";

import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";
import ContactCTA from "@/components/ContactCTA";

const STEPS = [1, 2, 3, 4, 5] as const;

// Reusing the same span across translations so React reconciles consistently.
// Declared locally rather than borrowed from CompoundingSection: that section is
// lazy-loaded after this one, so its <style> may not be in the document yet.
const pillComponents = { pill: <span className="hl" /> };

/**
 * Unit 3 of the body: how the work runs.
 *
 * No longer a <section>. Every unit in the body shares one framed section and
 * one 1040px column (see `.leads` in index.css) and sits 80px from its
 * neighbours, so this file owns its cards and nothing else — no page column,
 * no vertical padding, no heading type. The header is `.leads-head`, which is
 * instantly's measured h2 ↓16 sub ↓24 pill.
 *
 * Shares the centred card grid with OfferSection — the two answer "what" and
 * "how" and have to scan identically. If you change the card spec here, change
 * it there too; each unit owns its own styles by convention, so the
 * duplication is deliberate.
 */
const ProcessSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        /* The section frame, the 1040 column, the 880 header and the heading
           and lead type all live in .leads* in index.css now — every unit in
           the body reads from the same rules, which is the only way five units
           stay on one rhythm. What is left here is the card grid, which is
           this unit's alone. */

        /* ── The five stages ──────────────────────────────────────────── */
        .proc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--sp-32);
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
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--r-card);
          padding: var(--sp-32) var(--sp-32);
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
        /* The card header is one baseline-aligned row: step number, then the
           day range it covers. Byte-identical to .offer-eyebrow in
           OfferSection — the two sections run the same card grid.

           The range is what turns five stage names into a schedule the
           visitor can hold us to. Relative, not absolute: the delivery term
           is an estimate fixed at contracting, so nothing here promises a
           finish date. */
        .proc-eyebrow {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 9px;
        }
        .proc-meta {
          font-family: var(--font-sans);
          font-size: 10.5px;
          font-weight: 600;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--text-muted);
        }
        .proc-num {
          font-family: var(--font-sans);
          font-size: var(--text-body);
          font-weight: 700;
          line-height: 1;
          color: var(--brand);
          font-variant-numeric: tabular-nums;
          letter-spacing: var(--text-body-ls);
        }
        /* Card title scale — --text-card-title in index.css. */
        .proc-step-title {
          font-family: var(--font-sans);
          font-size: var(--text-card-title);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.15;
          color: var(--ink);
          margin: 0;
          text-wrap: balance;
        }
        .proc-body {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--text-muted);
          max-width: 56ch;
          margin: 0 auto;
          text-wrap: balance;
        }

        /* ── Mobile — one column, same centred cards ─────────────────────
           Section padding and card gaps track .comp-section / .comp-grid.
           Nothing overrides type here: --text-card-title and --text-body carry
           their own clamps, so the 20px/16px mobile pair comes for free. */
        @media (max-width: 768px) {
          .proc-list { grid-template-columns: minmax(0, 1fr); gap: 16px; }
          .proc-card { gap: 7px; padding: 22px 18px; }
        }
      `}</style>

      <div className="leads-block" id="process">
        <Reveal>
          <header className="leads-head">
            <h2 className="leads-title">{t("process.title")}</h2>
            <p className="leads-sub">
              <Trans i18nKey="process.lead" components={pillComponents} />
            </p>
            <div className="leads-cta">
              <ContactCTA mode="modal">
                <button type="button" className="btn btn-primary">
                  {t("offer.cta")}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </button>
              </ContactCTA>
            </div>
          </header>
        </Reveal>

        <div className="leads-panel is-bare">
        <ol className="proc-list">
          {STEPS.map((n, i) => (
            <li key={n}>
              <Reveal delay={Math.min(i, 3) * 70} className="proc-card-wrap">
                <div className="proc-card">
                  <span className="proc-eyebrow">
                    <span className="proc-num">{n}</span>
                    <span className="proc-meta">{t(`process.step${n}_days`)}</span>
                  </span>
                  <h3 className="proc-step-title">{t(`process.step${n}_title`)}</h3>
                  <p className="proc-body">{t(`process.step${n}_body`)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </>
  );
};

export default ProcessSection;
