"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const PAIN_KEYS = ["p1", "p2", "p3", "p4"] as const;

const PainpointsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="pain-section" id="painpoints">
      <style>{`
        .pain-section {
          width: 100%;
          background: #ffffff;
          padding: clamp(56px, 8vh, 104px) 16px clamp(40px, 6vh, 72px);
        }
        .pain-inner {
          max-width: 880px;
          margin: 0 auto;
        }

        .pain-title {
          font-family: var(--font-sans);
          font-weight: 600;
          letter-spacing: -0.028em;
          font-size: clamp(2rem, 5vw, 3.4rem);
          line-height: 1.06;
          color: #262626;
          margin: 0 0 clamp(36px, 5vh, 56px);
          text-align: left;
          text-wrap: balance;
        }

        .pain-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: clamp(18px, 2.6vh, 26px);
        }
        .pain-item {
          display: flex;
          align-items: flex-start;
          gap: clamp(14px, 1.8vw, 20px);
          font-family: var(--font-sans);
          font-size: clamp(1.05rem, 1.3vw, 1.25rem);
          line-height: 1.45;
          color: #262626;
          font-weight: 500;
        }
        .pain-x {
          flex-shrink: 0;
          width: clamp(28px, 3vw, 34px);
          height: clamp(28px, 3vw, 34px);
          background: #ED5C1B;
          border-radius: clamp(7px, 0.7vw, 9px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          margin-top: 2px;
        }
        .pain-x svg {
          width: clamp(13px, 1.4vw, 16px);
          height: clamp(13px, 1.4vw, 16px);
          stroke-width: 2.8;
        }

        @media (max-width: 600px) {
          .pain-section { padding: clamp(40px, 6vh, 72px) 20px clamp(32px, 5vh, 56px); }
          .pain-title { font-size: clamp(1.65rem, 7vw, 2.2rem); margin-bottom: 28px; }
          .pain-item { font-size: 0.98rem; gap: 12px; }
          .pain-x { width: 26px; height: 26px; }
          .pain-x svg { width: 12px; height: 12px; }
        }
      `}</style>

      <div className="pain-inner">
        <h2 className="pain-title">{t("painpoints.title")}</h2>
        <ul className="pain-list">
          {PAIN_KEYS.map((key) => (
            <li key={key} className="pain-item">
              <span className="pain-x" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </span>
              <span>{t(`painpoints.${key}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PainpointsSection;
