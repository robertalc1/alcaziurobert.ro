"use client";

import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";
import ContactCTA from "@/components/ContactCTA";

const DELIVERABLES = [1, 2, 3, 4] as const;

// Reusing the same span across translations so React reconciles consistently.
// Declared locally rather than borrowed from CompoundingSection: that section is
// lazy-loaded after this one, so its <style> may not be in the document yet.
const pillComponents = { pill: <span className="offer-pill" /> };

/**
 * The offer, stated plainly. This is the section the page did not have: every
 * other block either promised something (hero), proved something (the client
 * marks, the work) or handled an objection (FAQ) — nothing said what you
 * actually get, by when, and what happens if it does not work.
 *
 * It opens with the problem (the line that used to be StatementSection) and
 * answers it immediately — one block, one argument.
 *
 * No price and no budget field, deliberately. The qualification happens on the
 * call, not on the page.
 *
 * Laid out on the same centred card grid as ProcessSection, which is the shape
 * the rest of the funnel already uses (see CompoundingSection): narrow column,
 * centred header, rounded #1A1A1A blocks, an orange pill on the phrase that
 * carries the argument. Two sections that answer "what" and "how" should scan
 * identically — the eye learns the shape once. The card spec is duplicated
 * rather than shared because every section on this page owns its styles; if you
 * change one, change ProcessSection with it.
 */
const OfferSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="offer-section" id="offer">
      <style>{`
        /* Every dimension below is the CompoundingSection spec, 1:1 — that
           section is the reference the whole funnel is tuned to. If you change
           a number here, change it there and in ProcessSection too. */
        .offer-section {
          width: 100%;
          background: #0F0F0F;
          padding: clamp(48px, 6vh, 80px) 16px;
        }
        /* Same narrow, centred column as .comp-inner and .faq-inner. */
        .offer-inner {
          max-width: 880px;
          margin: 0 auto;
          text-align: center;
        }
        /* Micro-label, not a chip. It briefly ran as a filled orange block at
           the card-title size, which made the quietest text on the page the
           loudest thing in the section. Same spec on .offer-guar-label. */
        .offer-kicker {
          display: block;
          color: #ED5C1B;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }
        /* -- The two headline blocks --------------------------------------
           The problem and the answer are the two lines the whole page exists
           to deliver, so they run at one spec: same size, weight, colour and
           measure. They used to sit three steps apart (the problem at body
           scale, the answer at 3rem), which read as a caption followed by a
           heading instead of a question followed by its answer. */
        .offer-problem-line,
        .offer-title {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.022em;
          font-size: var(--text-section-title);
          /* 1.15, the same leading as .proc-title-main and .comp-title. These
             two blocks have to read as section headings, not as a looser
             variant of one. The pills pay for it: their painted box is 1.25em
             tall (font metrics, not padding), so the vertical padding drops to
             zero below and the boxes on consecutive lines just touch. */
          line-height: 1.15;
          color: #F5F5F5;
          max-width: 30ch;
          margin: 0 auto;
          text-wrap: balance;
        }
        .offer-title { margin-top: clamp(20px, 3vh, 30px); }
        /* Body scale — --text-body in index.css, shared by every paragraph on
           the site. Never hardcode a size on a body rule again. */
        .offer-lead {
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

        /* ── The problem, then the answer ─────────────────────────────
           This line used to be its own section (StatementSection) sitting on
           an otherwise empty band between the client marks and this one, which
           read as a stray sentence rather than an argument. It is the setup
           for the offer, so it lives here - in a panel that mirrors
           .offer-guarantee at the far end of the section. The two orange
           panels bookend the offer: the problem it exists to solve, and the
           promise it makes about solving it. Everything between them sits on
           the plain background, so the eye lands on the two framed blocks
           first. A hairline runs from the panel into the kicker below so the
           two halves still read as one continuous thought. */
        .offer-problem {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(12px, 1.8vh, 18px);
          max-width: 720px;
          margin: 0 auto;
          padding: clamp(24px, 3.2vw, 34px) clamp(20px, 2.6vw, 32px);
          border-radius: clamp(16px, 2vw, 22px);
          border: 1px solid rgba(237, 92, 27, 0.30);
          background:
            radial-gradient(120% 160% at 50% 0%, rgba(237, 92, 27, 0.14), transparent 62%),
            #141414;
        }
        /* Deliberately not orange: the brand colour stays on the answer side
           of the fold, so the problem reads quieter than what follows it. */
        .offer-problem-kicker {
          display: block;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.55);
        }
        /* The continuity cue between the two blocks. It used to fade white to
           orange because it started inside an unframed block; now it leaves an
           orange-bordered panel, so it is warm the whole way down. One pixel,
           but it makes the two blocks one beat. Block + auto margins because
           it is no longer a flex child of .offer-problem. */
        .offer-link {
          display: block;
          width: 1px;
          height: clamp(30px, 5vh, 52px);
          border-radius: 1px;
          background: linear-gradient(
            180deg,
            rgba(237, 92, 27, 0.35),
            rgba(237, 92, 27, 0.70)
          );
          margin: clamp(14px, 2.2vh, 22px) auto;
        }

        /* ── Inline highlight pill — same spec as .comp-pill ───────────── */
        .offer-pill {
          background: #ED5C1B;
          color: #ffffff;
          font-weight: 700;
          padding: 3px 11px;
          border-radius: 7px;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
          letter-spacing: -0.005em;
        }
        /* The pill box is tuned for body copy. On the two headline blocks it
           needs a proportionally larger box, otherwise it reads as a sticker
           stuck onto the text rather than part of the line. */
        .offer-problem-line .offer-pill,
        .offer-title .offer-pill {
          padding: 0 13px;
          border-radius: 8px;
        }

        /* ── What you get ─────────────────────────────────────────────── */
        .offer-list {
          list-style: none;
          padding: 0;
          margin: clamp(36px, 5vh, 56px) 0 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(18px, 2.4vw, 32px);
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
          background: #1A1A1A;
          border-radius: clamp(16px, 2vw, 22px);
          padding: clamp(18px, 2.4vw, 26px) clamp(20px, 2.6vw, 30px);
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
          color: #ED5C1B;
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
          color: rgba(255, 255, 255, 0.62);
        }
        /* Card title scale — --text-card-title in index.css. */
        .offer-item-title {
          font-family: var(--font-sans);
          font-size: var(--text-card-title);
          font-weight: 700;
          letter-spacing: -0.005em;
          line-height: 1.1;
          color: #F5F5F5;
          margin: 0;
          text-wrap: balance;
        }
        .offer-item-body {
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

        /* ── Guarantee ────────────────────────────────────────────────── */
        .offer-guarantee {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          max-width: 620px;
          margin: clamp(28px, 4vh, 40px) auto 0;
          padding: clamp(18px, 2.4vw, 26px) clamp(20px, 2.6vw, 30px);
          border-radius: clamp(16px, 2vw, 22px);
          border: 1px solid rgba(237, 92, 27, 0.30);
          /* Warm wash rather than a solid fill. Same recipe as .offer-problem
             at the top of the section — the two are a matched pair, problem
             and promise, and nothing between them is framed. Centred origin
             now that the panel itself is centred. */
          background:
            radial-gradient(120% 160% at 50% 0%, rgba(237, 92, 27, 0.14), transparent 62%),
            #141414;
          text-align: center;
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
          font-weight: 700;
          font-size: var(--text-card-title);
          letter-spacing: -0.005em;
          line-height: 1.1;
          color: #F5F5F5;
          margin: 0;
          text-wrap: balance;
        }
        .offer-guar-body {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: #F5F5F5;
          margin: 0 auto;
          max-width: 56ch;
          text-wrap: balance;
        }

        .offer-cta-row {
          margin-top: clamp(28px, 4vh, 40px);
          text-align: center;
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

        /* ── Mobile — one column, same centred cards ─────────────────────
           Section padding and card gaps track .comp-section / .comp-grid.
           The model also shrinks .comp-card-title to 1.05rem here, but that
           override exists to keep its two chips side by side on a 390px
           screen — our cards are one per row, so the clamp floor (1.6rem)
           is the right size and the title still outranks the body. */
        @media (max-width: 768px) {
          .offer-section { padding: clamp(40px, 6vh, 64px) 18px clamp(36px, 5vh, 56px); }
          .offer-list { grid-template-columns: minmax(0, 1fr); gap: 16px; }
          .offer-card { gap: 7px; }
          /* The two headline blocks are the first thing on this screen; they
             get a narrower measure so they break into short, readable lines
             rather than running the full 18px-gutter width. */
          .offer-problem { gap: 10px; padding: 22px 18px; }
          .offer-problem-line, .offer-title { max-width: 26ch; }
          .offer-link { height: 30px; margin: 14px auto; }
          .offer-guarantee { padding: 20px 18px; }
          .offer-item-body, .offer-lead { max-width: 42ch; }
        }
        /* Phones: the CTA is the only tap target in the section, so it stops
           being a pill floating mid-column and becomes a full-width bar. */
        @media (max-width: 480px) {
          .offer-cta { width: 100%; justify-content: center; padding: 0 20px; }
        }
      `}</style>

      <div className="offer-inner">
        <Reveal>
          <div className="offer-problem">
            <span className="offer-problem-kicker">{t("offer.problem_kicker")}</span>
            <p className="offer-problem-line">
              <Trans i18nKey="offer.problem" components={pillComponents} />
            </p>
          </div>
          <span className="offer-link" aria-hidden="true" />
        </Reveal>
        <Reveal>
          <span className="offer-kicker">{t("offer.kicker")}</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="offer-title">
            <Trans i18nKey="offer.title" components={pillComponents} />
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="offer-lead">
            <Trans i18nKey="offer.lead" components={pillComponents} />
          </p>
        </Reveal>

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
