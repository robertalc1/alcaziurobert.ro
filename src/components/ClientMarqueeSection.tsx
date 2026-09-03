"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";

/**
 * Client proof band — a static 6 x 2 grid of client logos, nothing else.
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
      </Reveal>
    </section>
  );
};

export default ClientMarqueeSection;
