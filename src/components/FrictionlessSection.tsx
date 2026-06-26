"use client";

import React from "react";
import { Trans } from "react-i18next";

// Same orange highlight pill used across the site.
const pillComponents = { pill: <span className="fr-pill" /> };

const FrictionlessSection: React.FC = () => {
  return (
    <section className="fr-section" id="frictionless">
      <style>{`
        .fr-section {
          width: 100%;
          background: #ffffff;
          padding: clamp(28px, 3.5vh, 44px) 16px clamp(14px, 2vh, 22px);
        }
        .fr-inner {
          max-width: 880px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .fr-sub {
          font-family: var(--font-sans);
          font-weight: 400;
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          line-height: 1.6;
          color: #1f1f1f;
          margin: 0 auto;
          max-width: 56ch;
          text-wrap: balance;
        }
        .fr-pill {
          background: #ED5C1B;
          color: #ffffff;
          font-weight: 700;
          padding: 3px 11px;
          border-radius: 7px;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
          letter-spacing: -0.005em;
        }
        @media (max-width: 600px) {
          .fr-section { padding: clamp(24px, 3.5vh, 36px) 20px clamp(10px, 1.6vh, 16px); }
        }
      `}</style>

      <div className="fr-inner">
        <p className="fr-sub">
          <Trans i18nKey="frictionless.subtitle" components={pillComponents} />
        </p>
      </div>
    </section>
  );
};

export default FrictionlessSection;
