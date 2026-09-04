"use client";

import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";

// The copy carries <pill> markers; here they render as inline orange
// accents instead of blocky pills — editorial, not sticker-like.
const accentComponents = { pill: <span className="st-accent" /> };

const StatementSection: React.FC = () => {
  // Subscribes the component to language changes for the <Trans> below.
  useTranslation();

  return (
    <section className="st-section">
      <style>{`
        .st-section {
          width: 100%;
          background: #0F0F0F;
          padding: clamp(56px, 8vh, 104px) clamp(18px, 3vw, 32px);
        }
        .st-inner {
          max-width: 1180px;
          margin: 0 auto;
        }
        /* No card behind the statement — the line sits straight on the page.
           The padding stays: with no background it is invisible, but it keeps
           the section the same height, so the Suspense placeholder in
           Index.tsx stays calibrated and nothing shifts on mount. */
        .st-card {
          padding: clamp(24px, 3vw, 40px) clamp(22px, 3vw, 44px);
          max-width: 720px;
          margin: 0 auto;
        }
        .st-body {
          font-family: var(--font-sans);
          font-size: clamp(1.15rem, 2.1vw, 1.7rem);
          font-weight: 400;
          letter-spacing: -0.015em;
          line-height: 1.55;
          color: #F5F5F5;
          max-width: 30ch;
          margin: 0 auto;
          text-align: center;
          text-wrap: balance;
        }
        .st-accent {
          background: #ED5C1B;
          color: #ffffff;
          font-weight: 700;
          padding: 3px 11px;
          border-radius: 7px;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
          letter-spacing: -0.005em;
        }
      `}</style>

      <div className="st-inner">
        <Reveal>
          <div className="st-card">
          <p className="st-body">
            <Trans i18nKey="statement.line" components={accentComponents} />
          </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default StatementSection;
