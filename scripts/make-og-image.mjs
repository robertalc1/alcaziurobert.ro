// Generates public/og-image.jpg — the preview card Facebook, WhatsApp,
// LinkedIn and X show when the site is shared. index.html pointed at
// /Header-background.webp, which does not exist, so every share rendered
// without an image. Run with: node scripts/make-og-image.mjs
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const PUBLIC = path.resolve(process.cwd(), "public");
const W = 1200;
const H = 630;

const GROUND = "#0F0F0F";
const INK = "#F5F5F5";
const ORANGE = "#ED5C1B";
const MUTED = "rgba(245,245,245,0.62)";

// librsvg (sharp's SVG renderer) cannot load @font-face/woff2, so General Sans
// is not available here. A common grotesque stack keeps the card on-brand
// without silently falling back to a serif/monospace mix.
const STACK = "'Segoe UI Variable Display','Segoe UI',Inter,Roboto,Arial,sans-serif";

const logo = await sharp(path.join(PUBLIC, "logo-mark.webp"))
  .resize({ height: 64 })
  .png()
  .toBuffer();
const logoMeta = await sharp(logo).metadata();

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>
      .h  { font-family: ${STACK}; font-weight: 600; font-size: 78px; letter-spacing: -3.2px; fill: ${INK}; }
      .ha { font-family: ${STACK}; font-weight: 600; font-size: 78px; letter-spacing: -3.2px; fill: ${ORANGE}; font-style: italic; }
      .s  { font-family: ${STACK}; font-weight: 400; font-size: 27px; letter-spacing: -0.4px; fill: ${MUTED}; }
      .t  { font-family: ${STACK}; font-weight: 600; font-size: 20px; letter-spacing: 2.2px; fill: ${INK}; }
      .u  { font-family: ${STACK}; font-weight: 500; font-size: 23px; letter-spacing: -0.2px; fill: ${MUTED}; }
    </style>
    <radialGradient id="glow" cx="82%" cy="14%" r="62%">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.30" />
      <stop offset="100%" stop-color="${ORANGE}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${GROUND}" />
  <rect width="${W}" height="${H}" fill="url(#glow)" />

  <!-- faint editorial column rules, same motif as the site's menu overlay -->
  <g stroke="${INK}" stroke-opacity="0.05" stroke-width="1">
    <line x1="200" y1="0" x2="200" y2="${H}" />
    <line x1="400" y1="0" x2="400" y2="${H}" />
    <line x1="600" y1="0" x2="600" y2="${H}" />
    <line x1="800" y1="0" x2="800" y2="${H}" />
    <line x1="1000" y1="0" x2="1000" y2="${H}" />
  </g>

  <text x="80" y="211" class="t">ALCAZIU ROBERT</text>

  <text x="80" y="330" class="h">Websites built</text>
  <text x="80" y="418" class="ha">to convert.</text>

  <text x="80" y="483" class="s">Premium web design &amp; custom development</text>

  <rect x="80" y="536" width="72" height="3" rx="1.5" fill="${ORANGE}" />
  <text x="80" y="586" class="u">alcaziurobert.ro</text>
</svg>`;

const out = await sharp(Buffer.from(svg))
  .composite([
    { input: logo, top: 74, left: W - 80 - (logoMeta.width ?? 111) },
  ])
  .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
  .toBuffer();

await fs.writeFile(path.join(PUBLIC, "og-image.jpg"), out);
console.log(`og-image.jpg written — ${W}x${H}, ${(out.length / 1024).toFixed(1)} KB`);
