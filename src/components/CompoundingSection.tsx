"use client";

import React from "react";
import { Trans, useTranslation } from "react-i18next";
import ContactCTA from "@/components/ContactCTA";
import Reveal from "@/components/Reveal";

const STEPS = ["s1", "s2"] as const;

// Reusing the same span across translations so React reconciles consistently.
const pillComponents = { pill: <span className="hl" /> };

const CompoundingSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        /* Section frame, page column and heading type are .leads* in
           index.css — shared by all five units in the body. This unit adds
           only a position:relative, which the floating accent needs as its
           positioning parent. */
        .leads-block#compounding { position: relative; }

        /* ── Cards grid ───────────────────────────── */
        .comp-grid {
          display: grid;
          grid-template-columns: repeat(2, auto);
          justify-content: center;
          gap: var(--sp-32);
          margin-bottom: var(--sp-24);
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
          font-size: var(--text-card-title);
          font-weight: 600;
          color: var(--ink);
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin: 0;
          text-wrap: balance;
          /* A text chip, not a card — no border. box-decoration-break: clone
             paints a box per line fragment, and a hairline on each fragment
             reads as three stacked boxes rather than one highlighted phrase.
             The fill is --line so it separates from --page underneath it. */
          background: var(--line);
          padding: 7px 22px;
          border-radius: 7px;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
          text-align: center;
          display: block;
        }
        /* "With us" carries the gloss, "without us" stays a plain grey chip.
           The pair reads as a segmented control that way — one side selected,
           one side not — which is what it is arguing. */
        .comp-card:first-child .comp-card-title {
          background: var(--btn-gloss);
          box-shadow: var(--btn-gloss-shadow-flat);
          color: #ffffff;
        }
        .comp-card:last-child .comp-card-title {
          font-weight: 500;
        }
        .comp-card-tag {
          align-self: center;
          display: inline-block;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          white-space: pre-line;
          padding: 0;
          margin: 0;
          letter-spacing: var(--text-body-ls);
          text-align: center;
        }
        /* --brand-strong, not --brand. This is 16px running copy and the
           palette note in index.css is explicit: the accent is for headings,
           chips, numerals, icons and borders, never a paragraph. It measured
           3.48:1 here, under the 4.5 floor. */
        .comp-card:first-child .comp-card-tag {
          color: var(--brand-strong);
        }
        /* ── Gray summary block ───────────────────── */
        .comp-summary {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--r-card);
          padding: var(--sp-32) var(--sp-32);
          text-align: center;
          max-width: 480px;
          margin: 0 auto var(--sp-16);
        }
        .comp-summary p {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--text-muted);
          margin: 0;
          text-wrap: balance;
          max-width: 56ch;
          margin-left: auto;
          margin-right: auto;
        }
        .comp-summary p + p {
          margin-top: 0;
        }

        /* ── Outlined takeaway card ───────────────── */
        .comp-takeaway {
          padding: var(--sp-16) clamp(16px, 2.5vw, 28px);
          text-align: center;
          max-width: 480px;
          margin: 0 auto;
        }
        .comp-takeaway p {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--text-muted);
          margin: 0;
          text-wrap: balance;
          max-width: 56ch;
          margin-left: auto;
          margin-right: auto;
        }

        /* ── Section CTA — orange pill, mirrors the hero primary ── */
        .comp-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--btn-gap);
          padding: 0 var(--btn-px);
          min-height: var(--btn-h);
          border-radius: 9999px;
          background: var(--btn-gloss);
          box-shadow: var(--btn-gloss-shadow);
          color: #ffffff;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: var(--btn-font);
          letter-spacing: -0.005em;
          white-space: nowrap;
          border: none;
          cursor: pointer;
          transition: filter 220ms cubic-bezier(0.23, 1, 0.32, 1),
                      box-shadow 220ms cubic-bezier(0.23, 1, 0.32, 1),
                      transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .comp-cta-btn:hover {
          background: var(--btn-gloss-hover);
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
        /* ── Mobile ───────────────────────────────── */
        @media (max-width: 768px) {
          .comp-grid {
            grid-template-columns: repeat(2, auto);
            gap: 16px;
            margin-bottom: 12px;
          }
          .comp-card { padding: 0; gap: 7px; }
          /* Padding only. The font-size override that used to live here
             (1.05rem) predates --text-card-title, whose clamp floor is now
             20px — reinstating it would drop these two chips below the 16px
             body sitting under them. */
          .comp-card-title {
            padding: 6px 16px;
            border-radius: 7px;
            line-height: 1.15;
          }
          /* No .comp-card-tag override: it is on --text-body now, and the
             token's own clamp floor is the mobile size. */

          .comp-summary { padding: 18px 18px; margin-bottom: 9px; }

          .comp-takeaway { padding: 14px 18px; }
        }
        @media (max-width: 380px) {
          .comp-card-title { padding: 6px 14px; }
        }

      `}</style>

      <div className="leads-block" id="compounding">
        <Reveal>
          <header className="leads-head">
            <h2 className="leads-title">{t("compounding.title")}</h2>
            {/* summary_l1 used to sit below the comparison, which put the
                answer to the section's own question three blocks under it.
                It is the answer, so it reads as the standfirst. */}
            <p className="leads-sub">
              <Trans i18nKey="compounding.summary_l1" components={pillComponents} />
            </p>
            <div className="leads-cta">
              <ContactCTA mode="modal">
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
          </header>
        </Reveal>

        <div className="leads-panel is-bare">
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

        </div>
      </div>
    </>
  );
};

export default CompoundingSection;
