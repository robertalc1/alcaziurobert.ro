"use client";

import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";
import ContactCTA from "@/components/ContactCTA";

const DELIVERABLES = [1, 2, 3, 4] as const;

// Reusing the same span across translations so React reconciles consistently.
// Declared locally rather than borrowed from CompoundingSection: that section is
// lazy-loaded after this one, so its <style> may not be in the document yet.
const pillComponents = { pill: <span className="hl" /> };

/**
 * Units 1 and 2 of the body: the problem, then the offer that answers it.
 *
 * They used to be one <section> carrying two arguments in a single 880px
 * column. On instantly every argument is its own unit in the shared column —
 * centred 880px header (h2 ↓16 sub ↓24 pill), then a panel — and units sit
 * 80px apart inside ONE framed section rather than each owning 128px of
 * padding. So this file now returns two `.leads-block`s rather than a section,
 * and the vertical rhythm belongs to `.leads` in index.css. Nothing here sets
 * a top or bottom margin; if a gap looks wrong, it is `.leads-col`'s gap.
 *
 * The problem unit is header-only. Every instantly unit has a visual panel
 * under its header, but "most sites collect compliments" has no artefact to
 * show, and a 480px box of invented chrome under it would be decoration
 * pretending to be evidence. The unit keeps the rhythm; it just has nothing
 * below the fold line.
 *
 * No price and no budget field, deliberately. Qualification happens on the
 * call, not on the page.
 */
const OfferSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        /* ── The deliverables grid ─────────────────────────────────────
           Two columns at 1040. It ran one-per-row inside the old 880 column,
           which made four short cards into a 732px vertical scroll for no
           reason. instantly's panel is 1040 x 480; 2x2 at 24px gutters lands
           almost exactly on that, so the block matches its neighbours without
           anything being padded out. */
        .offer-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--sp-24);
          list-style: none;
          margin: 0;
          padding: 0;
        }
        /* Both the li and the Reveal wrapper have to stretch, otherwise two
           cards in a row settle at their own content heights. */
        .offer-list li { display: flex; }
        .offer-card-wrap { flex: 1; display: flex; }
        .offer-card {
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
        /* The card header is one row, not two. The number ran at
           --text-card-title, the same size as the title under it, with a
           10.5px category label wedged between them: three stacked rows, two
           of them at the same size, which read as clutter rather than as a
           hierarchy. Number and category now share a single baseline-aligned
           eyebrow, so every card descends cleanly 17 → 24 → 17px.

           Byte-identical to .proc-num in ProcessSection. The two sections run
           the same card grid; if you change one, change the other. */
        .offer-eyebrow {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 9px;
        }
        .offer-num {
          font-family: var(--font-sans);
          font-size: var(--text-body);
          font-weight: 700;
          line-height: 1;
          color: var(--brand);
          font-variant-numeric: tabular-nums;
          letter-spacing: var(--text-body-ls);
        }
        .offer-meta {
          font-family: var(--font-sans);
          font-size: 10.5px;
          font-weight: 600;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--text-muted);
        }
        /* Card title scale — --text-card-title in index.css. */
        .offer-item-title {
          font-family: var(--font-sans);
          font-size: var(--text-card-title);
          font-weight: 700;
          letter-spacing: -0.005em;
          line-height: 1.15;
          color: var(--ink);
          margin: 0;
          text-wrap: balance;
        }
        .offer-item-body {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--text-muted);
          margin: 0 auto;
          text-wrap: balance;
        }

        /* ── Guarantee ──────────────────────────────────────────────────
           The one framed block left in the unit. It used to be half of a
           matched pair with an identically-framed problem panel at the top of
           the section; the problem is now its own unit's header, so this is
           the only tinted panel in the body and it carries the whole weight
           of "here is what we put our own money behind". */
        .offer-guarantee {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          max-width: 620px;
          margin: var(--sp-24) auto 0;
          padding: var(--sp-32) var(--sp-32);
          border-radius: var(--r-panel);
          border: 1px solid rgba(69, 128, 247, 0.24);
          background:
            radial-gradient(120% 160% at 50% 0%, rgba(69, 128, 247, 0.07), transparent 62%),
            var(--surface);
          text-align: center;
        }
        .offer-guar-label {
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--brand);
        }
        .offer-guar-title {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: var(--text-card-title);
          letter-spacing: -0.005em;
          line-height: 1.15;
          color: var(--ink);
          margin: 0;
          text-wrap: balance;
        }
        .offer-guar-body {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--text-muted);
          margin: 0 auto;
          max-width: 56ch;
          text-wrap: balance;
        }

        /* ── Mobile — one column ────────────────────────────────────────
           Vertical padding is NOT set here any more: the whole body is one
           .leads section and it owns every vertical number, including at
           this breakpoint. A section-level padding rule in this file is what
           would put the rhythm back out of sync. */
        @media (max-width: 768px) {
          .offer-list { grid-template-columns: minmax(0, 1fr); gap: 16px; }
          .offer-card { gap: 7px; padding: 22px 18px; }
          .offer-guarantee { padding: 20px 18px; }
          .offer-item-body { max-width: 42ch; }
        }
      `}</style>

      {/* ── Unit 1 — the problem ─────────────────────────────────────── */}
      <div className="leads-block" id="problem">
        <Reveal>
          <header className="leads-head">
            <h2 className="leads-title">
              <Trans i18nKey="offer.problem_title" components={pillComponents} />
            </h2>
            <p className="leads-sub">
              <Trans i18nKey="offer.problem" components={pillComponents} />
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
      </div>

      {/* ── Unit 2 — the offer ───────────────────────────────────────── */}
      <div className="leads-block" id="offer">
        <Reveal>
          <header className="leads-head">
            <h2 className="leads-title">
              <Trans i18nKey="offer.title" components={pillComponents} />
            </h2>
            <p className="leads-sub">
              <Trans i18nKey="offer.lead" components={pillComponents} />
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
          <ol className="offer-list">
            {DELIVERABLES.map((n, i) => (
              <li key={n}>
                <Reveal delay={Math.min(i, 3) * 70} className="offer-card-wrap">
                  <div className="offer-card">
                    <span className="offer-eyebrow">
                      <span className="offer-num">{n}</span>
                      <span className="offer-meta">{t(`offer.d${n}_meta`)}</span>
                    </span>
                    <h3 className="offer-item-title">{t(`offer.d${n}_title`)}</h3>
                    <p className="offer-item-body">{t(`offer.d${n}_body`)}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={80}>
            <div className="offer-guarantee">
              <span className="offer-guar-label">{t("offer.guarantee_label")}</span>
              <h3 className="offer-guar-title">{t("offer.guarantee_title")}</h3>
              <p className="offer-guar-body">
                <Trans i18nKey="offer.guarantee_body" components={pillComponents} />
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
};

export default OfferSection;
