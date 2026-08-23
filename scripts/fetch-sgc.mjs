import fs from "fs";
import path from "path";
import https from "https";
import sharp from "sharp";

const PUBLIC = path.resolve(process.cwd(), "public");

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode !== 200) return reject(new Error("status " + res.statusCode));
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

const svg = await download("https://sgc.ocpict.ro/vite.svg");
console.log("SVG downloaded:", svg.length, "bytes");

const buf = await sharp(svg, { density: 200 })
  .resize({ width: 1100, height: 700, fit: "contain", background: { r: 11, g: 13, b: 18, alpha: 1 } })
  .webp({ quality: 85, effort: 5 })
  .toBuffer();

fs.writeFileSync(path.join(PUBLIC, "sgc.webp"), buf);
console.log("sgc.webp size:", (buf.length / 1024).toFixed(1), "KB");
