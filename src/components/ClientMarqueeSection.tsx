"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { animate, useInView, useReducedMotion } from "motion/react";
import Reveal from "@/components/Reveal";

const STAT_KEYS = ["s1", "s2", "s3"] as const;

/**
 * Counts a stat like "3.8%", "1.1s" or "−38%" up from zero when it scrolls into
 * view. Prefix and suffix stay static; only the number animates. Reduced-motion
 * users get the final value immediately.
 *
 * Lifted out of StatsBandSection, which was deleted — it had been sitting in the
 * repo unimported since 2026-08-25, which is why these three numbers, the
 * strongest proof on the whole site, appeared nowhere on the page.
 */
const CountUp: React.FC<{ value: string }> = ({ value }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const reduced = useReducedMotion();

  const m = value.match(/^([^\d]*)([\d.]+)(.*)$/);
  const prefix = m?.[1] ?? "";
  const target = parseFloat(m?.[2] ?? "0");
  const suffix = m?.[3] ?? "";
  const decimals = m?.[2]?.split(".")[1]?.length ?? 0;

  const [display, setDisplay] = React.useState(reduced ? target : 0);

  React.useEffect(() => {
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

/**
 * Client proof band — three hard numbers, a 6 x 2 grid of client logos, and the
 * scarcity line, in that order. It sits directly under the hero because that is
 * where a promise has to be paid for: the headline claims sites built to
 * convert, and the next thing on the page is what converting actually measured.
 *
 * There is deliberately no sizing logic in this file. scripts/optimize-logos.mjs
 * measures each source logo's ink coverage, scales it toward a constant optical
 * weight and centres it on one shared 400x165 frame, so every file that lands in
 * public/logos/opt is the same size with the artwork already balanced. That is
 * why a single `width: 100%` gives twelve cells that line up: the frames are
 * identical, so the rows cannot go ragged and swapping a logo cannot break the
 * layout. Run `npm run optimize-logos` after adding or replacing a source file
 * and read that script before changing how big anything looks here.
 *
 * Twelfth cell: there are eleven logo files and the grid wants twelve, so the
 * last cell carries Alma — a real client from the portfolio that has no logo
 * artwork — set as a wordmark in the site's own type. Swap it for an image the
 * day one arrives; do not fill the slot with a partner or platform mark, this
 * row is clients only.
 */
type Cell =
  | { kind: "logo"; file: string; name: string }
  | { kind: "word"; name: string };

const CELLS: ReadonlyArray<Cell> = [
  { kind: "logo", file: "lukton", name: "Lukton" },
  { kind: "logo", file: "picaps", name: "Picaps" },
  { kind: "logo", file: "rdraw", name: "R-Draw Engineering" },
  { kind: "logo", file: "everun", name: "Everun" },
  { kind: "logo", file: "ancpi", name: "ANCPI" },
  { kind: "logo", file: "kickout", name: "Kickout" },
  { kind: "logo", file: "calitate-culori", name: "Calitate & Culori" },
  { kind: "logo", file: "ecartop", name: "Ecartop" },
  { kind: "logo", file: "smart-securitate", name: "Smart Securitate" },
  { kind: "logo", file: "everati", name: "Everati" },
  { kind: "logo", file: "traveltwin", name: "Travel Twin" },
  { kind: "word", name: "Alma" },
];

const ClientMarqueeSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="cm-section" aria-label={t("whatwedo.clients_eyebrow")}>
      <style>{`
        .cm-section {
          position: relative;
          width: 100%;
          background: #0F0F0F;
          padding: clamp(56px, 8vh, 104px) 0;
        }
        /* ── Numbers ──────────────────────────────────────────────────── */
        .cm-proof {
          max-width: 1280px;
          margin: 0 auto clamp(40px, 6vh, 68px);
          padding: 0 clamp(20px, 3vw, 40px);
        }
        .cm-kicker {
          display: block;
          color: #ED5C1B;
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }
        .cm-stats {
          list-style: none;
          margin: clamp(20px, 3vh, 30px) 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(20px, 3vw, 40px);
        }
        @media (max-width: 700px) {
          .cm-stats { grid-template-columns: minmax(0, 1fr); gap: 24px; }
        }
        .cm-stat-value {
          display: block;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: clamp(2.4rem, 6vw, 3.8rem);
          line-height: 1;
          letter-spacing: -0.04em;
          color: #F5F5F5;
          /* Tabular figures so the number does not jitter while it counts up. */
          font-variant-numeric: tabular-nums;
        }
        .cm-stat-label {
          display: block;
          font-family: var(--font-sans);
          font-size: 14.5px;
          font-weight: 500;
          color: #F5F5F5;
          margin-top: 10px;
        }
        .cm-stat-note {
          display: block;
          font-family: var(--font-sans);
          font-size: 13.5px;
          line-height: 1.5;
          color: rgba(245, 245, 245, 0.58);
          margin-top: 4px;
        }

        /* ── Scarcity line ────────────────────────────────────────────── */
        /* Outer box aligns with the grid, inner span carries the measure —
           one element cannot do both, since max-width sizes the padding box. */
        .cm-depth {
          max-width: 1280px;
          margin: clamp(32px, 5vh, 52px) auto 0;
          padding: 0 clamp(20px, 3vw, 40px);
        }
        .cm-depth span {
          display: block;
          max-width: 72ch;
          font-family: var(--font-sans);
          font-size: 14.5px;
          line-height: 1.6;
          color: rgba(245, 245, 245, 0.58);
        }

        .cm-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(20px, 3vw, 40px);
          list-style: none;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          column-gap: clamp(16px, 2.2vw, 36px);
          row-gap: clamp(26px, 4vh, 48px);
          justify-items: center;
          align-items: center;
        }
        .cm-cell {
          width: 100%;
          /* Matches the frame every logo file is built on, so the text cell is
             exactly as tall as the image cells and both rows sit level. */
          aspect-ratio: 400 / 165;
          display: grid;
          place-items: center;
        }
        .cm-logo {
          display: block;
          width: 100%;
          height: auto;
          opacity: 0.88;
          transition: opacity 0.3s ease;
        }
        .cm-word {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: clamp(1.3rem, 2.2vw, 1.85rem);
          line-height: 1;
          letter-spacing: -0.03em;
          color: #FFFFFF;
          opacity: 0.88;
          transition: opacity 0.3s ease;
          white-space: nowrap;
        }
        .cm-cell:hover .cm-logo,
        .cm-cell:hover .cm-word { opacity: 1; }

        @media (max-width: 900px) {
          .cm-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 520px) {
          .cm-grid {
            grid-template-columns: repeat(2, 1fr);
            column-gap: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cm-logo, .cm-word { transition: none; }
        }
      `}</style>

      {/* blur={0}: the subtree holds twelve images and blur() re-rasterises all
          of it on every frame of the reveal. */}
      <Reveal blur={0}>
        <div className="cm-proof">
          <span className="cm-kicker">{t("stats.kicker")}</span>
          <ul className="cm-stats">
            {STAT_KEYS.map((key) => (
              <li className="cm-stat" key={key}>
                <span className="cm-stat-value">
                  <CountUp value={t(`stats.${key}_value`)} />
                </span>
                <span className="cm-stat-label">{t(`stats.${key}_label`)}</span>
                <span className="cm-stat-note">{t(`stats.${key}_note`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="cm-grid">
          {CELLS.map((cell) => (
            <li className="cm-cell" key={cell.kind === "logo" ? cell.file : cell.name}>
              {cell.kind === "logo" ? (
                <img
                  className="cm-logo"
                  src={`/logos/opt/${cell.file}.webp`}
                  alt={cell.name}
                  width={400}
                  height={165}
                  /* Deliberately not lazy: the whole set is ~63KB and the
                     section is already code-split behind Suspense, so nothing
                     downloads until the band is reached anyway. */
                  decoding="async"
                  draggable={false}
                />
              ) : (
                <span className="cm-word">{cell.name}</span>
              )}
            </li>
          ))}
        </ul>

        <p className="cm-depth">
          <span>{t("clients.depth_line")}</span>
        </p>
      </Reveal>
    </section>
  );
};

export default ClientMarqueeSection;
