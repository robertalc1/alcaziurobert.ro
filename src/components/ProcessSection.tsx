"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";

const STEPS = [1, 2, 3, 4, 5] as const;

const ProcessSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="proc-section" id="process">
      <style>{`
        .proc-section {
          width: 100%;
          background: #0F0F0F;
          padding: clamp(56px, 8vh, 104px) clamp(18px, 3vw, 32px);
        }
        .proc-inner {
          max-width: 1180px;
          margin: 0 auto;
        }
        .proc-kicker {
          display: inline-block;
          color: #ED5C1B;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }
        .proc-title-main {
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: -0.028em;
          font-size: clamp(1.8rem, 4.6vw, 3rem);
          line-height: 1.05;
          color: #F5F5F5;
          margin: clamp(20px, 3vh, 30px) 0 0;
          max-width: 24ch;
          text-wrap: balance;
        }
        .proc-lead {
          font-family: var(--font-sans);
          font-size: clamp(1rem, 1.3vw, 1.15rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.76);
          max-width: 58ch;
          margin: clamp(14px, 2vh, 20px) 0 0;
        }
        .proc-list {
          list-style: none;
          padding: 0;
          margin: clamp(36px, 5vh, 56px) 0 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.10);
        }
        .proc-list li {
          border-top: 1px solid rgba(255, 255, 255, 0.10);
        }
        .proc-row {
          display: grid;
          grid-template-columns: 72px minmax(0, 340px) 1fr;
          gap: 16px clamp(24px, 3vw, 44px);
          align-items: start;
          padding: clamp(22px, 3vh, 32px) 0;
        }
        .proc-num {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          color: #ED5C1B;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.06em;
          padding-top: 7px;
        }
        .proc-meta {
          display: block;
          font-family: var(--font-sans);
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.62);
          margin-bottom: 7px;
        }
        .proc-step-title {
          font-family: var(--font-sans);
          font-size: clamp(1.15rem, 1.6vw, 1.45rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.2;
          color: #F5F5F5;
          margin: 0;
        }
        .proc-body {
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.78);
          max-width: 52ch;
          margin: 0;
          padding-top: 5px;
        }
        @media (max-width: 768px) {
          .proc-row {
            grid-template-columns: 44px 1fr;
            gap: 6px 18px;
          }
          .proc-head { grid-column: 2; }
          .proc-body { grid-column: 2; padding-top: 2px; }
        }
      `}</style>

      <div className="proc-inner">
        <Reveal>
          <span className="proc-kicker">{t("process.kicker")}</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="proc-title-main">{t("difference.title")}</h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="proc-lead">{t("difference.subtitle")}</p>
        </Reveal>

        <ol className="proc-list">
          {STEPS.map((n, i) => (
            <li key={n}>
              <Reveal delay={i * 70}>
                <div className="proc-row">
                  <span className="proc-num">0{n}</span>
                  <div className="proc-head">
                    <span className="proc-meta">{t(`process.step${n}_meta`)}</span>
                    <h3 className="proc-step-title">{t(`process.step${n}_title`)}</h3>
                  </div>
                  <p className="proc-body">{t(`process.step${n}_body`)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ProcessSection;
