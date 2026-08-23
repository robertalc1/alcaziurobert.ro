import React from "react";

/**
 * Abstract cadastre parcel grid rendered as inline SVG.
 * Replaces the OCPI logo for the SGC card — minimal, premium, brand-aligned.
 * Single highlighted parcel pulses subtly (respects prefers-reduced-motion).
 */
const CadastreGrid: React.FC = () => {
  // Grid: 8 cols x 6 rows on a 480x360 viewBox (4:3)
  const COLS = 8;
  const ROWS = 6;
  const CELL_W = 480 / COLS; // 60
  const CELL_H = 360 / ROWS; // 60

  // Subtle tinted cells (for visual variety)
  const tintedCells: Array<[number, number]> = [
    [1, 0], [3, 1], [5, 2], [2, 3], [6, 4], [4, 5],
  ];

  // Parcel numbers on a few cells
  const labels: Array<{ col: number; row: number; text: string }> = [
    { col: 0, row: 1, text: "P-118" },
    { col: 5, row: 0, text: "P-203" },
    { col: 7, row: 4, text: "P-061" },
  ];

  // Highlighted parcel (the "active" one) — spans col 2-3, row 2-3 (2x2 block)
  const HX = 2 * CELL_W; // 120
  const HY = 2 * CELL_H; // 120
  const HW = 2 * CELL_W; // 120
  const HH = 2 * CELL_H; // 120

  return (
    <div className="cadastre-wrap" aria-hidden="true">
      <style>{`
        .cadastre-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          background: #0d1017;
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }
        .cadastre-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(60% 50% at 30% 20%, rgba(237, 92, 27,0.08), transparent 70%),
            radial-gradient(50% 60% at 80% 90%, rgba(60,90,140,0.10), transparent 70%);
          pointer-events: none;
        }
        .cadastre-svg {
          position: relative;
          width: 100%;
          height: 100%;
          max-width: 100%;
          display: block;
        }
        .cadastre-mono {
          font-family: var(--font-mono);
        }
        .cadastre-active {
          animation: cadastre-pulse 3.6s var(--ease-out-quart, cubic-bezier(0.23, 1, 0.32, 1)) infinite;
          transform-origin: ${HX + HW / 2}px ${HY + HH / 2}px;
        }
        @keyframes cadastre-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.82; }
        }
        .cadastre-ring {
          animation: cadastre-ring 3.6s var(--ease-out-quart, cubic-bezier(0.23, 1, 0.32, 1)) infinite;
          transform-origin: ${HX + HW / 2}px ${HY + HH / 2}px;
        }
        @keyframes cadastre-ring {
          0%   { opacity: 0; transform: scale(1); }
          60%  { opacity: 0.45; }
          100% { opacity: 0; transform: scale(1.18); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cadastre-active, .cadastre-ring { animation: none; }
        }
        .cadastre-eyebrow {
          position: absolute;
          top: 16px;
          left: 18px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.55);
          text-transform: uppercase;
          z-index: 2;
        }
        .cadastre-eyebrow .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ED5C1B;
          box-shadow: 0 0 8px rgba(237, 92, 27, 0.6);
        }
        .cadastre-coords {
          position: absolute;
          bottom: 14px;
          right: 18px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: rgba(255, 255, 255, 0.32);
          letter-spacing: 0.08em;
          z-index: 2;
        }
      `}</style>

      <span className="cadastre-eyebrow">
        <span className="dot" />
        Cadastre · OCPI
      </span>

      <svg
        className="cadastre-svg"
        viewBox="0 0 480 360"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tinted cells for variation */}
        {tintedCells.map(([c, r], i) => (
          <rect
            key={`tint-${i}`}
            x={c * CELL_W}
            y={r * CELL_H}
            width={CELL_W}
            height={CELL_H}
            fill="rgba(237, 92, 27,0.05)"
          />
        ))}

        {/* Grid lines */}
        {Array.from({ length: COLS + 1 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * CELL_W}
            y1={0}
            x2={i * CELL_W}
            y2={360}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={0.5}
          />
        ))}
        {Array.from({ length: ROWS + 1 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * CELL_H}
            x2={480}
            y2={i * CELL_H}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={0.5}
          />
        ))}

        {/* Diagonal parcel boundaries — adds realism */}
        <line x1={0} y1={120} x2={60} y2={60} stroke="rgba(255,255,255,0.12)" strokeWidth={0.6} />
        <line x1={420} y1={300} x2={480} y2={240} stroke="rgba(255,255,255,0.12)" strokeWidth={0.6} />

        {/* Parcel labels */}
        {labels.map((l, i) => (
          <text
            key={`lbl-${i}`}
            x={l.col * CELL_W + 6}
            y={l.row * CELL_H + 14}
            className="cadastre-mono"
            fontSize={9}
            fill="rgba(255,255,255,0.32)"
            letterSpacing={0.4}
          >
            {l.text}
          </text>
        ))}

        {/* Pulsing outer ring on highlighted parcel */}
        <rect
          className="cadastre-ring"
          x={HX - 2}
          y={HY - 2}
          width={HW + 4}
          height={HH + 4}
          fill="none"
          stroke="#ED5C1B"
          strokeWidth={1}
          rx={2}
        />

        {/* Highlighted parcel */}
        <g className="cadastre-active">
          <rect
            x={HX}
            y={HY}
            width={HW}
            height={HH}
            fill="rgba(237, 92, 27,0.16)"
            stroke="#ED5C1B"
            strokeWidth={1.5}
            rx={1.5}
          />
          {/* Inner mark */}
          <line
            x1={HX + 10}
            y1={HY + HH / 2}
            x2={HX + HW - 10}
            y2={HY + HH / 2}
            stroke="rgba(237, 92, 27,0.45)"
            strokeWidth={0.7}
            strokeDasharray="3 4"
          />
          <text
            x={HX + 8}
            y={HY + 16}
            className="cadastre-mono"
            fontSize={10}
            fill="#ED5C1B"
            fontWeight={600}
            letterSpacing={0.5}
          >
            P-247-A
          </text>
          <circle cx={HX + HW / 2} cy={HY + HH / 2} r={3} fill="#ED5C1B" />
        </g>
      </svg>

      <span className="cadastre-coords">44.4268° N · 26.1025° E</span>
    </div>
  );
};

export default CadastreGrid;
