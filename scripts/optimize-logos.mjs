import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

/**
 * Prepares the client logos for the proof grid (ClientMarqueeSection).
 *
 * The eleven sources share a 500x312 canvas and nothing else. Their artwork
 * ranges from a 6:1 slab wordmark that is 74% solid ink to a 1:1 hairline
 * badge that is 15% ink, and one of them (Lukton) is drawn in black, which is
 * invisible on the section's background. Dropped into a grid with one
 * `max-height` rule, that produces exactly what it sounds like: the bold
 * wordmarks shout and the thin badges disappear.
 *
 * So this script does not just clean the files, it equalises them, and every
 * output lands on an identical canvas:
 *
 *   1. trim      — cut the transparent padding, so measurements describe the
 *                  artwork rather than whatever margin the exporter left.
 *   2. recolour  — keep alpha, force every colour channel to white. One set,
 *                  one colour, and the black logo stops being a special case.
 *   3. scale     — see "Optical sizing" below.
 *   4. extend    — centre the result on a fixed CANVAS_W x CANVAS_H frame.
 *
 * Because step 4 makes every file the same size, the component needs no
 * per-logo CSS at all: one `width: 100%` rule gives twelve cells that align
 * perfectly, and replacing a logo cannot break the row.
 *
 * ## Optical sizing
 *
 * Two logos look equally big when they put roughly the same amount of ink on
 * the page, not when their bounding boxes match. So each logo is measured for
 * ink coverage (alpha-weighted, 0-1) and scaled toward a constant ink area:
 *
 *     scale = sqrt(TARGET_INK * canvasArea / (w * h * coverage ^ (2 * DAMPING)))
 *
 * DAMPING controls how far to push it. At 0.5 the correction is total — equal
 * ink area exactly — which shrinks Lukton to a 17px-tall sliver next to a
 * 59px badge. At 0 it degenerates to equal bounding-box area, which is where
 * this started. 0.28 was picked by measurement: it takes the spread between
 * the heaviest and lightest logo from ~9x down to 2.9x while keeping the
 * wordmarks at a readable size.
 *
 * A logo is never enlarged past the safe area, so sparse artwork stops at the
 * frame instead of growing without limit. Roughly a third of the set sits on
 * that ceiling, which is the intent: they are the biggest, and the dense ones
 * come down to meet them.
 *
 * Originals in public/logos are left untouched. Not wired into `build` — run
 * `npm run optimize-logos` by hand and commit the output, same arrangement as
 * scripts/optimize-images.mjs.
 */

const SRC_DIR = path.resolve(process.cwd(), "public", "logos");
const OUT_DIR = path.join(SRC_DIR, "opt");

/** Uniform output frame. ~2.3x the widest the grid ever paints a cell. */
const CANVAS_W = 400;
const CANVAS_H = 165;

/** Fraction of the frame a logo may occupy, so nothing touches the edges. */
const SAFE_W = 0.94;
const SAFE_H = 0.9;

/** Ink area every logo is scaled toward, as a fraction of the frame. */
const TARGET_INK = 0.172;

/** 0 = equal bounding boxes, 0.5 = equal ink. See "Optical sizing" above. */
const DAMPING = 0.28;

const QUALITY = 90;

/** Source file -> output slug. The display names live in the component. */
const LOGOS = [
  ["1.png", "lukton"],
  ["2.png", "smart-securitate"],
  ["3.png", "everun"],
  ["4.png", "everati"],
  ["5.png", "ecartop"],
  ["6.png", "picaps"],
  ["7.png", "calitate-culori"],
  ["8.png", "rdraw"],
  ["9.png", "kickout"],
  ["10.png", "traveltwin"],
  ["11.png", "ancpi"],
];

/** Trim padding and repaint the ink white, keeping the alpha shape intact. */
async function normalise(file) {
  // threshold 10: the sources are anti-aliased, so the outermost ring of
  // pixels carries an alpha of 1-2. Trimming at 0 keeps a hairline of padding.
  const trimmed = await sharp(file)
    .ensureAlpha()
    .trim({ threshold: 10 })
    .png()
    .toBuffer();

  const meta = await sharp(trimmed).metadata();
  const alpha = await sharp(trimmed).extractChannel("alpha").raw().toBuffer();

  let ink = 0;
  for (const a of alpha) ink += a / 255;

  const white = await sharp({
    create: {
      width: meta.width,
      height: meta.height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .joinChannel(alpha, {
      raw: { width: meta.width, height: meta.height, channels: 1 },
    })
    .png()
    .toBuffer();

  return {
    buf: white,
    w: meta.width,
    h: meta.height,
    coverage: ink / (meta.width * meta.height),
  };
}

async function processOne(file, slug) {
  const full = path.join(SRC_DIR, file);
  const stat = await fs.stat(full);
  const art = await normalise(full);

  const fit = Math.min(
    (SAFE_W * CANVAS_W) / art.w,
    (SAFE_H * CANVAS_H) / art.h
  );
  const optical = Math.sqrt(
    (TARGET_INK * CANVAS_W * CANVAS_H) /
      (art.w * art.h * Math.pow(art.coverage, 2 * DAMPING))
  );
  const scale = Math.min(fit, optical);

  const w = Math.max(1, Math.round(art.w * scale));
  const h = Math.max(1, Math.round(art.h * scale));

  const buf = await sharp(art.buf)
    .resize({ width: w, height: h, fit: "fill" })
    .extend({
      top: Math.floor((CANVAS_H - h) / 2),
      bottom: Math.ceil((CANVAS_H - h) / 2),
      left: Math.floor((CANVAS_W - w) / 2),
      right: Math.ceil((CANVAS_W - w) / 2),
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .webp({ quality: QUALITY, effort: 6, alphaQuality: 100 })
    .toBuffer();

  await fs.writeFile(path.join(OUT_DIR, `${slug}.webp`), buf);

  return {
    slug,
    from: file,
    coverage: art.coverage,
    w,
    h,
    atCeiling: optical >= fit,
    inkArea: w * h * art.coverage,
    fromKB: stat.size / 1024,
    toKB: buf.length / 1024,
  };
}

await fs.mkdir(OUT_DIR, { recursive: true });

const results = [];
for (const [file, slug] of LOGOS) {
  try {
    results.push(await processOne(file, slug));
  } catch (e) {
    console.error("FAIL", file, e.message);
    process.exitCode = 1;
  }
}

let from = 0;
let to = 0;
for (const r of results) {
  from += r.fromKB;
  to += r.toKB;
  console.log(
    `${r.from.padEnd(7)} -> ${r.slug.padEnd(18)} ink ${(r.coverage * 100)
      .toFixed(1)
      .padStart(5)}%  art ${`${r.w}x${r.h}`.padEnd(8)}${
      r.atCeiling ? "(at frame) " : "           "
    }${r.fromKB.toFixed(1).padStart(6)}KB -> ${r.toKB.toFixed(1).padStart(5)}KB`
  );
}

const inks = results.map((r) => r.inkArea);
console.log(
  `\n${results.length}/${LOGOS.length} logos on a ${CANVAS_W}x${CANVAS_H} frame · ` +
    `${from.toFixed(1)}KB -> ${to.toFixed(1)}KB · ` +
    `ink spread ${(Math.max(...inks) / Math.min(...inks)).toFixed(2)}x ` +
    `(1.00x would be perfectly even; above ~4x the row looks ragged)`
);
