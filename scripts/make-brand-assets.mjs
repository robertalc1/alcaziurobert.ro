// Derive every raster fallback and favicon from the vector master.
// Run: npm run brand-assets
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const asset = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));
const master = await readFile(asset("logo-mark.svg"), "utf8");
const glyph = master.match(/<path id="ar-glyph" d="([^"]+)"/);
if (!glyph) throw new Error("Vector master must contain the ar-glyph path.");
// A single-colour companion for tiny in-button applications.
await writeFile(asset("logo-mark-white.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118 98" fill="none"><title>Alcaziu Robert — AR</title><path fill="#FFFFFF" fill-rule="evenodd" d="${glyph[1]}"/></svg>\n`);

// Keep the outlined wordmark's embedded emblem aligned with the master.
const wordmark = await readFile(asset("logo-wordmark.svg"), "utf8");
const embedded = master.trim().replace('<svg xmlns="http://www.w3.org/2000/svg"', '<svg x="0" y="0" width="104" height="104"');
await writeFile(asset("logo-wordmark.svg"), wordmark.replace(/<!-- emblem:start -->[\s\S]*?<!-- emblem:end -->/, `<!-- emblem:start -->\n${embedded}\n  <!-- emblem:end -->`));

// Square optical frame, with enough margin for the smallest browser tabs.
// Tight framing and no shadow at browser-tab sizes; keep the same AR geometry.
const icon = master
  .replace('viewBox="0 0 104 104"', 'viewBox="5 4 94 94"')
  .replace('filter="url(#ar-shadow)"', '');
await writeFile(asset("favicon.svg"), icon);
for (const size of [32, 48, 192, 512]) {
  await sharp(Buffer.from(icon)).resize(size, size).png().toFile(asset(`favicon-${size}.png`));
}
await sharp(Buffer.from(icon)).resize(180, 180).flatten({ background: "#FFFFFF" }).png().toFile(asset("apple-touch-icon.png"));
await sharp(Buffer.from(master)).resize({ width: 472 }).webp({ quality: 95 }).toFile(asset("logo-mark.webp"));
await sharp(Buffer.from(master)).resize({ width: 944 }).png().toFile(asset("logo.png"));

// ICO directory containing PNG-compressed 16/32/48px frames (no extra dependency).
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map((size) => sharp(Buffer.from(icon)).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
frames.forEach((frame, i) => {
  const entry = 6 + i * 16;
  header[entry] = sizes[i];
  header[entry + 1] = sizes[i];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await writeFile(asset("favicon.ico"), Buffer.concat([header, ...frames]));
console.log("AR: white SVG, SVG/PNG/ICO favicons, Apple icon and raster fallbacks generated.");
