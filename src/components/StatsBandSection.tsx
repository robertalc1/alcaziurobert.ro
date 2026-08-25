"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { animate, useInView, useReducedMotion } from "motion/react";
import Reveal from "@/components/Reveal";

const STATS = ["s1", "s2", "s3"] as const;

/**
 * Counts a stat like "3.8%", "1.1s" or "−38%" up from zero when it scrolls
 * into view. Prefix/suffix stay static; only the number animates. Renders the
 * final value immediately for reduced-motion users.
 */
const CountUp: React.FC<{ value: string }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const reduced = useReducedMotion();

  const m = value.match(/^([^\d]*)([\d.]+)(.*)$/);
  const prefix = m?.[1] ?? "";
  const target = parseFloat(m?.[2] ?? "0");
  const suffix = m?.[3] ?? "";
  const decimals = m?.[2]?.split(".")[1]?.length ?? 0;

  const [display, setDisplay] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!inView || !m) return;
    if (reduced) {
      setDisplay(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target, reduced]);

  if (!m) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
};

// Real clients only — replaces the old platform-logo marquee.
const WORDMARKS = [
  "OCPI",
  "Picaps",
  "R-Draw",
  "Everun",
  "Everati",
  "Kickout",
  "Alma",
  "Lukton",
  "Ecartop",
];

const StatsBandSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="stats-section" aria-label={t("stats.kicker")}>
      <style>{`
        .stats-section {
          width: 100%;
          background: #0F0F0F;
          padding: clamp(64px, 9vh, 112px) clamp(18px, 3vw, 32px);
        }
        .stats-inner {
          max-width: 1180px;
          margin: 0 auto;
        }
        .stats-kicker {
          display: inline-block;
          color: #ED5C1B;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(28px, 3.5vw, 48px);
          margin-top: clamp(32px, 4.5vh, 52px);
        }
        .stats-item {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-left: clamp(18px, 2vw, 28px);
          border-left: 1px solid rgba(255, 255, 255, 0.10);
        }
        .stats-value {
          font-family: var(--font-sans);
          font-size: clamp(2.9rem, 6.6vw, 5.6rem);
          font-weight: 500;
          letter-spacing: -0.045em;
          line-height: 1;
          color: #F5F5F5;
          font-variant-numeric: tabular-nums;
        }
        .stats-label {
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #ED5C1B;
        }
        .stats-note {
          font-family: var(--font-sans);
          font-size: 13.5px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.72);
          max-width: 26ch;
        }
        .stats-marks {
          margin-top: clamp(52px, 7vh, 80px);
          padding-top: clamp(26px, 3.5vh, 36px);
          border-top: 1px solid rgba(255, 255, 255, 0.10);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .stats-marks-label {
          font-family: var(--font-sans);
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.60);
        }
        .stats-marks-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 14px clamp(22px, 3.5vw, 46px);
        }
        .stats-mark {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          color: rgba(255, 255, 255, 0.60);
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr; gap: 30px; }
        }
      `}</style>

      <div className="stats-inner">
        <Reveal>
          <span className="stats-kicker">{t("stats.kicker")}</span>
        </Reveal>

        <div className="stats-grid">
          {STATS.map((k, i) => (
            <Reveal key={k} delay={i * 90}>
              <div className="stats-item">
                <span className="stats-value">
                  <CountUp value={t(`stats.${k}_value`)} />
                </span>
                <span className="stats-label">{t(`stats.${k}_label`)}</span>
                <span className="stats-note">{t(`stats.${k}_note`)}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={220}>
          <div className="stats-marks">
            <span className="stats-marks-label">{t("stats.clients_label")}</span>
            <div className="stats-marks-row">
              {WORDMARKS.map((w) => (
                <span key={w} className="stats-mark">{w}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default StatsBandSection;
