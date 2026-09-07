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

// Objection-shaped, in the order they come up on a real call: price, time,
// why not an agency, what if I hate it, what happens after, how the guarantee
// is measured. The old why1-3 were statements dressed as questions, which is
// also why the page had no FAQPage schema worth emitting.
const FAQ_KEYS = ["o1", "o2", "o3", "o4", "o5", "o6"] as const;

const FaqsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <style>{`
        /* Section frame, page column, the 880 header and its type are
           .leads* in index.css — shared with the four units above this one.

           The accordion is held to 880 rather than filling the unit's 1040
           column: a question you scan and an answer you read want the same
           measure as the paragraph that introduced them, and at 1040 the
           six-line answers run past a comfortable line length. */
        .faq-list { max-width: var(--w-text); margin-inline: auto; }

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

      `}</style>

      <div className="leads-block" id="faq">
        <Reveal>
          <header className="leads-head">
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
          </header>
        </Reveal>

        {/* One reveal for the list, not per item — Radix animates each item's
            height on open, and a blur transition stacked on a height animation
            reads as muddy. */}
        <Reveal delay={100} className="leads-panel is-bare">
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
    </>
  );
};

export default FaqsSection;
