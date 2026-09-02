"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";

/**
 * Client proof band.
 *
 * Competitors in this niche run volume logo walls (250-590 clients). We cannot
 * win that comparison and should not enter it: the positioning here is "max 4
 * clients at a time", which a volume wall would contradict outright.
 *
 * So this is the inverse — a short row of names where each one carries the
 * number it produced. Their walls have many logos and no figures; this has
 * eleven names and eleven figures. That is the whole argument, and it is why
 * the metric line is not decoration and must never be dropped to save space.
 *
 * Names come from portfolio.short (wordmark-length) and figures from
 * portfolio.metrics, both already translated. Two of these slugs have no entry
 * in the portfolio carousel because they have no screenshot — irrelevant here,
 * since a wordmark needs no image.
 */
const SLUGS = [
  "sgc",
  "picaps",
  "kickout",
  "rdraw",
  "everun",
  "everati",
  "alma",
  "lukton",
  "ecartop",
  "bacde10",
  "traveltwin",
] as const;

/**
 * Metrics are written as "lead · trail" (e.g. "LCP 1.1s · Bounce -38%"), where
 * the leading half is nearly always the number. Split so the figure can carry
 * more weight than its qualifier. Strings without a separator render as lead
 * only — no stray dot.
 */
const splitMetric = (metric: string): [string, string | null] => {
  const i = metric.indexOf("·");
  if (i === -1) return [metric.trim(), null];
  return [metric.slice(0, i).trim(), metric.slice(i + 1).trim()];
};

const ClientMarqueeSection: React.FC = () => {
  const { t } = useTranslation();

  const items = SLUGS.map((slug) => {
    const [lead, trail] = splitMetric(t(`portfolio.metrics.${slug}`));
    return { slug, name: t(`portfolio.short.${slug}`), lead, trail };
  });

  return (
    <section className="cm-section" aria-label={t("whatwedo.clients_eyebrow")}>
      <style>{`
        .cm-section {
          position: relative;
          width: 100%;
          background: #0F0F0F;
          padding: clamp(40px, 6vh, 72px) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          /* The track is wider than the document on purpose. Without this the
             page gains a horizontal scrollbar and phones zoom out. */
          overflow: hidden;
        }
        .cm-head {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 clamp(18px, 3vw, 32px) clamp(24px, 3.5vh, 36px);
        }
        .cm-eyebrow {
          display: block;
          font-family: var(--font-sans);
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #ED5C1B;
        }

        .cm-wrap {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
                  mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
        }
        .cm-track {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          width: max-content;
          margin: 0;
          padding: 0;
          list-style: none;
          animation-name: cm-marquee;
          animation-duration: 58s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @keyframes cm-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .cm-item {
          flex: 0 0 auto;
          width: clamp(200px, 21vw, 290px);
          padding: 2px clamp(20px, 2.4vw, 38px);
          border-left: 1px solid rgba(255, 255, 255, 0.09);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
        }
        .cm-name {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: clamp(1.3rem, 2.1vw, 1.8rem);
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #F5F5F5;
          white-space: nowrap;
        }
        .cm-metric {
          font-family: var(--font-sans);
          font-size: 12.5px;
          line-height: 1.4;
          font-variant-numeric: tabular-nums;
          /* Two lines reserved so cells do not jitter in height as they pass. */
          min-height: 2.8em;
        }
        .cm-lead {
          color: #ED5C1B;
          font-weight: 500;
        }
        .cm-trail {
          color: rgba(255, 255, 255, 0.48);
        }

        .cm-foot {
          max-width: 1180px;
          margin: 0 auto;
          padding: clamp(24px, 3.5vh, 36px) clamp(18px, 3vw, 32px) 0;
        }
        .cm-depth {
          margin: 0;
          font-family: var(--font-sans);
          font-size: clamp(0.95rem, 1.25vw, 1.1rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.62);
          max-width: 62ch;
          text-wrap: pretty;
        }

        @media (max-width: 767px) {
          .cm-track { animation-duration: 34s; }
          .cm-item {
            width: clamp(164px, 44vw, 210px);
            padding: 2px 18px;
          }
          .cm-name { font-size: 1.22rem; }
          .cm-metric { font-size: 12px; }
        }

        @media (hover: hover) and (pointer: fine) {
          .cm-wrap:hover .cm-track { animation-play-state: paused; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cm-wrap {
            overflow: visible;
            -webkit-mask-image: none;
                    mask-image: none;
          }
          .cm-track {
            animation: none !important;
            width: auto;
            flex-wrap: wrap;
            justify-content: center;
            row-gap: 24px;
          }
          /* Hide the duplicate half. Left visible, a reader would see each of
             the eleven names twice, which reads as padding out a thin list —
             the exact impression this section exists to avoid. */
          .cm-item[data-copy="1"] { display: none; }
        }
      `}</style>

      <div className="cm-head">
        <Reveal>
          <span className="cm-eyebrow">{t("whatwedo.clients_eyebrow")}</span>
        </Reveal>
      </div>

      {/* blur={0}: the track animates every frame, and a filter would force the
          whole strip to re-rasterise for the full 800ms of the reveal. */}
      <Reveal delay={80} blur={0}>
        <div className="cm-wrap">
          <ul className="cm-track">
            {[...Array(2)].flatMap((_, copy) =>
              items.map((it) => (
                <li
                  key={`${copy}-${it.slug}`}
                  className="cm-item"
                  data-copy={copy}
                  aria-hidden={copy === 1 ? true : undefined}
                >
                  <span className="cm-name">{it.name}</span>
                  <span className="cm-metric">
                    <span className="cm-lead">{it.lead}</span>
                    {it.trail && <span className="cm-trail"> · {it.trail}</span>}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </Reveal>

      <div className="cm-foot">
        <Reveal delay={160}>
          <p className="cm-depth">{t("clients.depth_line")}</p>
        </Reveal>
      </div>
    </section>
  );
};

export default ClientMarqueeSection;
