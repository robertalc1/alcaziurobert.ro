import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const PUBLIC = path.resolve(process.cwd(), "public");
const QUALITY = 82;
const MAX_DIM = 2000;

const overrides = {
  // Force smaller dims for very large backgrounds
  "background-section1.png": { width: 1920 },
  "background-section2.png": { width: 1920 },
  "background-section3.png": { width: 1920 },
};

const skipExact = new Set(["placeholder.svg", "logo.svg", "favicon.ico"]);

async function processOne(file) {
  const full = path.join(PUBLIC, file);
  const stat = await fs.stat(full);
  if (!stat.isFile()) return null;
  if (skipExact.has(file)) return null;

  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const out = path.join(PUBLIC, `${base}.webp`);

  // Only process raster sources >100KB OR specific overrides OR svg sgc
  const isRaster = [".png", ".jpg", ".jpeg"].includes(ext);
  const isHeavySvg = ext === ".svg" && stat.size > 500 * 1024;
  if (!isRaster && !isHeavySvg) return null;
  if (isRaster && stat.size < 100 * 1024 && !overrides[file]) return null;

  let pipeline = sharp(full, { failOnError: false });
  const meta = await pipeline.metadata();
  const targetWidth = overrides[file]?.width ?? (meta.width && meta.width > MAX_DIM ? MAX_DIM : meta.width);
  if (targetWidth && meta.width && targetWidth < meta.width) {
    pipeline = pipeline.resize({ width: targetWidth, withoutEnlargement: true });
  }
  const buf = await pipeline.webp({ quality: QUALITY, effort: 5 }).toBuffer();
  await fs.writeFile(out, buf);

  return {
    file,
    fromKB: (stat.size / 1024).toFixed(1),
    toKB: (buf.length / 1024).toFixed(1),
    saved: (((stat.size - buf.length) / stat.size) * 100).toFixed(1),
  };
}

const entries = await fs.readdir(PUBLIC);
const results = [];
for (const f of entries) {
  try {
    const r = await processOne(f);
    if (r) results.push(r);
  } catch (e) {
    console.error("FAIL", f, e.message);
  }
}
console.log("Conversions:");
for (const r of results) {
  console.log(`  ${r.file.padEnd(32)} ${r.fromKB.padStart(8)}KB -> ${r.toKB.padStart(8)}KB  (-${r.saved}%)`);
}
const totalFrom = results.reduce((s, r) => s + +r.fromKB, 0);
const totalTo = results.reduce((s, r) => s + +r.toKB, 0);
console.log(`\nTotal: ${totalFrom.toFixed(1)}KB -> ${totalTo.toFixed(1)}KB  (-${(100 * (totalFrom - totalTo) / totalFrom).toFixed(1)}%)`);
