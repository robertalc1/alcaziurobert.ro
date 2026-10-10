"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";

/**
 * Client proof band — logos, nothing else. It renders INSIDE the hero panel
 * (see Hero.tsx), directly under the form: the headline claims sites built to
 * convert, and the next thing in the same frame is who trusted that claim.
 *
 * It lives on the dark panel rather than on the light page for a hard reason,
 * not a stylistic one: scripts/optimize-logos.mjs repaints every source logo
 * WHITE and keeps only its alpha (UNBACDE10 retains its coloured badge), so
 * these files need a dark background. If
 * this band ever has to move onto the light page, either re-run
 * `npm run optimize-logos` with a dark ink or add
 * `filter: brightness(0) opacity(.55)` — do not just move the markup.
 *
 * There is deliberately no sizing logic in this file. The script measures each
 * source logo's ink coverage, scales it toward a constant optical weight and
 * centres it on one shared 400x165 frame, so every file that lands in
 * public/logos/opt is the same size with the artwork already balanced. That is
 * why a single `width: 100%` gives cells that line up: the frames are
 * identical, so the rows cannot go ragged and swapping a logo cannot break the
 * layout. Run `npm run optimize-logos` after adding or replacing a source file
 * and read that script before changing how big anything looks here.
 *
 * The wrapping flex layout centres incomplete rows as the client list grows.
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
  { kind: "logo", file: "laura-predoi", name: "Laura Predoi — Cabinet de psihologie" },
  { kind: "logo", file: "unbacde10", name: "UNBACDE10" },
];

const ClientMarqueeSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="cm-band" aria-label={t("whatwedo.clients_eyebrow")}>
      <style>{`
        .cm-band {
          position: relative;
          width: 100%;
        }
        /* Hairline above the band, so it reads as a footer to the panel rather
           than as a fourth stacked element. White at 14% — anything stronger
           becomes a rule and cuts the panel in two. */
        .cm-band::before {
          content: '';
          display: block;
          height: 1px;
          background: rgba(255, 255, 255, 0.14);
          margin-bottom: clamp(24px, 3vw, 34px);
        }
        /* used-by_title: 14/400, full white, with a 20px spacer under it
           (spacer-xsmall is-1-25rem). It ran at 12.5px in a 62%-opacity grey,
           which read as a caption apologising for the logos below it. */
        .cm-label {
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 400;
          line-height: 1.5;
          letter-spacing: normal;
          color: #FFFFFF;
          text-align: center;
          margin: 0 0 20px;
        }
        .cm-grid {
          max-width: 980px;
          margin: 0 auto;
          list-style: none;
          padding: 0;
          --cm-gap: clamp(14px, 2vw, 30px);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          column-gap: var(--cm-gap);
          row-gap: clamp(14px, 2.2vw, 26px);
          align-items: center;
        }
        .cm-cell {
          flex: 0 0 calc((100% - 5 * var(--cm-gap)) / 6);
          min-width: 0;
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
          /* Lower than the old 0.88. On the dark page these sat alone; inside
             the panel they share the frame with a white headline and a white
             card, and at full strength the client marks out-shout both. */
          opacity: 0.68;
          transition: opacity 0.3s ease;
        }
        .cm-word {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: clamp(1.05rem, 1.8vw, 1.4rem);
          line-height: 1;
          letter-spacing: -0.03em;
          color: #FFFFFF;
          opacity: 0.68;
          transition: opacity 0.3s ease;
          white-space: nowrap;
        }
        .cm-cell:hover .cm-logo,
        .cm-cell:hover .cm-word { opacity: 1; }

        @media (max-width: 900px) {
          .cm-cell { flex-basis: calc((100% - 3 * var(--cm-gap)) / 4); }
        }
        @media (max-width: 520px) {
          .cm-grid { --cm-gap: 14px; }
          .cm-cell { flex-basis: calc((100% - 2 * var(--cm-gap)) / 3); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cm-logo, .cm-word { transition: none; }
        }
      `}</style>

      {/* blur={0}: the subtree holds the client images and blur() re-rasterises all
          of it on every frame of the reveal. */}
      <Reveal blur={0}>
        <p className="cm-label">{t("whatwedo.clients_eyebrow")}</p>
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
                  /* Deliberately not lazy: the whole set is ~63KB and the band
                     is already code-split behind Suspense, so nothing
                     downloads until the hero chunk resolves anyway. */
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
    </div>
  );
};

export default ClientMarqueeSection;
