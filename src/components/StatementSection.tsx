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
          background: #ffffff;
          padding: clamp(56px, 8vh, 104px) clamp(18px, 3vw, 32px);
          border-top: 1px solid rgba(38, 38, 38, 0.08);
        }
        .st-inner {
          max-width: 1180px;
          margin: 0 auto;
        }
        .st-body {
          font-family: var(--font-sans);
          font-size: clamp(1.5rem, 3.1vw, 2.4rem);
          font-weight: 500;
          letter-spacing: -0.025em;
          line-height: 1.35;
          color: #141414;
          max-width: 30ch;
          margin: 0;
          text-wrap: balance;
        }
        .st-accent {
          color: #ED5C1B;
        }
      `}</style>

      <div className="st-inner">
        <Reveal>
          <p className="st-body">
            <Trans i18nKey="frictionless.subtitle" components={accentComponents} />
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default StatementSection;
