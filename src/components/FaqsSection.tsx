"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Reveal from "@/components/Reveal";
import ContactCTA from "@/components/ContactCTA";

// Objection-shaped, in the order they come up on a real call: why not an
// agency, what if I hate it, what happens after, how the guarantee is measured.
// The old why1-3 were statements dressed as questions, which is also why the
// page had no FAQPage schema worth emitting.
//
// o1 (price) and o2 (duration) are deliberately NOT rendered. They are still in
// src/locales/{ro,en}.json — parked, not deleted, so putting them back is one
// key in this array. Two things travel with that decision: faq.lead counts the
// questions out loud, and the FAQPage JSON-LD in index.html must list exactly
// what is on the page. Change all three together or none.
const FAQ_KEYS = ["o3", "o4", "o5", "o6"] as const;

const FaqsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        /* Section frame, page column and the heading type are .leads* in
           index.css — shared with the units above this one.

           LAYOUT. Every other unit on the page is a centred header over a
           panel. This one is two columns: the heading holds the left, the six
           objections stack on the right. It is the last thing on the page and
           it is a LIST — a centred 880px header over a centred 880px list gave
           the reader two centre lines to track and left the block looking like
           a narrow ribbon in a 1040 column. Side by side, the heading stays put
           while the eye works down the questions.

           The split is fixed-left / fluid-right rather than a fraction: the
           heading needs a measure it can wrap on (about 3 lines at 40px) and
           everything past that belongs to the answers. */
        .faq-grid {
          display: grid;
          grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
          gap: clamp(32px, 4.5vw, 72px);
          align-items: start;
        }
        /* Left-aligned, against .leads-head's centring — a heading in a column
           of its own has an edge to sit on. */
        .faq-head {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .faq-head .leads-sub { max-width: 32ch; }

        /* Six separate cards rather than one bordered stack. The stack was
           right on the dark page — hairlines on near-black read as structure.
           On white a rules-only list reads as a table, and instantly's FAQ is
           a column of discrete cards, which is also the honest shape: these
           are six independent objections, not six rows of one thing. */
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .faq-item {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--r-card);
          padding: 0 clamp(16px, 2vw, 24px);
          transition: border-color 220ms ease;
        }
        .faq-item:hover { border-color: var(--line-2); }
        .faq-item[data-state="open"] { border-color: var(--line-2); }

        .faq-trigger {
          width: 100%;
          padding: 22px 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-family: var(--font-sans);
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          font-weight: 600;
          color: var(--ink);
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 220ms ease;
        }
        /* Kills the hover:underline that ships in ui/accordion's base class.
           These are card headings, not links; the underline read as a broken
           hyperlink. Colour alone carries the hover. */
        .faq-trigger:hover { color: var(--brand); text-decoration: none; }
        .faq-trigger:hover span { text-decoration: none; }
        .faq-trigger > svg:last-child { display: none; }
        .faq-trigger[data-state="open"] { color: var(--brand); }

        .faq-trigger-icon {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(69, 128, 247, 0.14);
          color: var(--brand);
          transition: background 220ms ease, transform 320ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        [data-state="open"] .faq-trigger-icon {
          background: var(--brand);
          color: #ffffff;
          transform: rotate(180deg);
        }
        .faq-trigger-icon svg {
          width: 14px;
          height: 14px;
        }

        .faq-content {
          padding: 0 4px 22px;
          font-family: var(--font-sans);
          font-size: var(--text-body);
          line-height: var(--text-body-lh);
          letter-spacing: var(--text-body-ls);
          color: var(--text-muted);
          max-width: 56ch;
          text-wrap: balance;
        }

        /* One column below the tablet breakpoint: at 900px the heading's
           column is narrower than its own longest word and the questions have
           nowhere to breathe. The heading goes back on top, still left-aligned
           — centring it again would make it the only left-then-centred element
           on the page. */
        @media (max-width: 900px) {
          .faq-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: var(--sp-32);
          }
          .faq-head .leads-sub { max-width: 46ch; }
        }
      `}</style>

      <div className="leads-block" id="faq">
        <div className="faq-grid">
          <Reveal className="faq-head">
            <h2 className="leads-title">{t("faq.title")}</h2>
            <p className="leads-sub">{t("faq.lead")}</p>
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
          </Reveal>

          {/* One reveal for the list, not per item — Radix animates each item's
              height on open, and a blur transition stacked on a height animation
              reads as muddy. */}
          <Reveal delay={100}>
            <Accordion type="single" collapsible className="faq-list">
              {FAQ_KEYS.map((key) => (
                <AccordionItem key={key} value={key} className="faq-item">
                  <AccordionTrigger className="faq-trigger">
                    <span>{t(`faq.${key}.q`)}</span>
                    <span className="faq-trigger-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="faq-content">
                    {t(`faq.${key}.a`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </>
  );
};

export default FaqsSection;
