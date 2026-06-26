"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const ITEM_KEYS = ["item1", "item2", "item3", "item4", "item5"] as const;

const DifferenceSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="diff-section" id="difference">
      <style>{`
        .diff-section {
          width: 100%;
          background: #ffffff;
          padding: clamp(14px, 2vh, 22px) 16px clamp(36px, 4.5vh, 56px);
        }
        .diff-inner {
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }

        .diff-title {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.028em;
          font-size: clamp(1.8rem, 4.6vw, 3rem);
          line-height: 1.05;
          color: #262626;
          margin: 0 auto clamp(22px, 3vh, 38px);
          max-width: 24ch;
          text-wrap: balance;
        }

        .diff-list {
          list-style: none;
          padding: 0;
          margin: 0 0 clamp(8px, 1.5vh, 14px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(12px, 1.7vh, 18px);
        }
        .diff-item {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          font-family: var(--font-sans);
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          font-weight: 500;
          line-height: 1.75;
          color: #1f1f1f;
        }
        .diff-bullet {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ED5C1B;
        }

        @media (max-width: 600px) {
          .diff-section { padding: clamp(12px, 2vh, 18px) 20px clamp(28px, 4vh, 40px); }
          .diff-bullet { width: 20px; height: 20px; }
        }
      `}</style>

      <div className="diff-inner">
        <h2 className="diff-title">{t("difference.title")}</h2>

        <ul className="diff-list">
          {ITEM_KEYS.map((key) => (
            <li key={key} className="diff-item">
              <span className="diff-bullet" aria-hidden="true" />
              <span>{t(`difference.${key}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DifferenceSection;
