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

// Ordered as an objection-handling sequence: price → price rationale →
// timeline → process → maintenance → ownership → security → stack.
const FAQ_KEYS = ["q2", "q2b", "q1", "q5", "q4", "q6", "q7", "q3"] as const;

const FaqsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="faq-section" id="faq">
      <style>{`
        .faq-section {
          width: 100%;
          background: #ffffff;
          padding: clamp(48px, 6vh, 80px) 16px;
        }
        .faq-inner {
          max-width: 880px;
          margin: 0 auto;
        }
        .faq-header {
          text-align: center;
          margin-bottom: clamp(32px, 4vh, 56px);
        }
        .faq-title {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.028em;
          font-size: clamp(1.8rem, 4.6vw, 3rem);
          line-height: 1.05;
          color: #262626;
          margin: 0;
          text-wrap: balance;
        }

        .faq-list {
          border-top: 1px solid rgba(38, 38, 38, 0.10);
          border-bottom: 1px solid rgba(38, 38, 38, 0.10);
        }
        .faq-item {
          border-bottom: 1px solid rgba(38, 38, 38, 0.10);
        }
        .faq-item:last-of-type {
          border-bottom: none;
        }

        .faq-trigger {
          width: 100%;
          padding: 22px 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-family: var(--font-sans);
          font-size: clamp(0.98rem, 1.15vw, 1.1rem);
          font-weight: 500;
          color: #262626;
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 220ms ease;
        }
        .faq-trigger:hover { color: #ED5C1B; }
        .faq-trigger > svg:last-child { display: none; }
        .faq-trigger[data-state="open"] { color: #ED5C1B; }

        .faq-trigger-icon {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(237, 92, 27, 0.08);
          color: #ED5C1B;
          transition: background 220ms ease, transform 320ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        [data-state="open"] .faq-trigger-icon {
          background: #ED5C1B;
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
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          line-height: 1.75;
          color: #1f1f1f;
          max-width: 56ch;
          text-wrap: balance;
        }

        .faq-cta-row {
          text-align: center;
          margin-top: clamp(24px, 3.5vh, 40px);
        }
        .faq-cta-link {
          display: inline-block;
          padding: 10px 6px;
          font-family: var(--font-sans);
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          font-weight: 500;
          color: #262626;
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-thickness: 1.5px;
          transition: color 220ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .faq-cta-link:hover { color: #ED5C1B; }
      `}</style>

      <div className="faq-inner">
        <Reveal>
          <header className="faq-header">
            <h2 className="faq-title">{t("faq.title")}</h2>
          </header>
        </Reveal>

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

        <div className="faq-cta-row">
          <a href="mailto:contact@alcaziurobert.ro" className="faq-cta-link">
            {t("faq.cta")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqsSection;
