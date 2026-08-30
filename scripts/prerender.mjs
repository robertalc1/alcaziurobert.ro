/**
 * Prerenders every public route into static HTML after `vite build`.
 *
 * Why this exists: the site is a client-rendered React app, so the HTML that
 * leaves the server contains a boot loader and nothing else. Google renders
 * JavaScript and copes. The AI crawlers do not — GPTBot, PerplexityBot,
 * ClaudeBot, CCBot and Bingbot's non-rendering pass all receive an empty
 * shell, which is why the site could not be quoted or summarised by any of
 * them. This script walks the built app in a real browser, waits for the
 * lazy sections to mount, and writes what it sees to disk.
 *
 * The output is a paint, not a hydration target: main.tsx still calls
 * createRoot().render(), which clears #root and renders from scratch. So a
 * stale prerender can never desync the running app — the worst case is a
 * crawler reading slightly old copy, and the visitor never sees it at all.
 *
 * Failure here is deliberately non-fatal. A missing prerender costs SEO;
 * a failed build costs the deploy.
 */
import { chromium } from "playwright";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdir, writeFile, readFile } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const OUT_DIR = join(DIST, "prerendered");
const PORT = 4321;

/** Route -> output filename. "/" becomes index, the rest keep their slug. */
const fileFor = (route) => (route === "/" ? "index" : route.replace(/^\//, "")) + ".html";

async function main() {
  const routes = Object.keys(
    JSON.parse(await readFile(join(ROOT, "route-meta.json"), "utf8"))
  );

  // Serve the build exactly as production does: static assets, SPA fallback.
  const app = express();
  app.use(express.static(DIST, { index: false }));
  app.use((req, res) => res.sendFile(join(DIST, "index.html")));
  const server = await new Promise((resolve) => {
    const s = app.listen(PORT, () => resolve(s));
  });

  const browser = await chromium.launch();
  // Desktop viewport: this snapshot is served to crawlers only, never to a
  // phone, so it should carry the richest version of the page. At 1440px the
  // hero mounts its contact card and the work section renders the full
  // project carousel — measured 6251 characters of text against 3683 at a
  // phone width.
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  });

  await mkdir(OUT_DIR, { recursive: true });
  const results = [];

  for (const route of routes) {
    const page = await ctx.newPage();
    try {
      await page.goto(`http://127.0.0.1:${PORT}${route}`, {
        waitUntil: "networkidle",
        timeout: 60000,
      });

      // Below-the-fold sections are React.lazy behind an IntersectionObserver,
      // so a page that is never scrolled prerenders as the hero alone. Walk
      // the whole document, then return to the top so the markup is captured
      // in its natural state.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 250));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 600));
      });
      await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});

      const html = await page.evaluate(() => {
        // The boot loader is a first-paint device for humans. In a static
        // snapshot it is a spinner frozen over the content, so it goes.
        document.getElementById("app-loader")?.remove();

        // react-helmet appends its tags (marked data-rh) instead of replacing
        // the static ones from index.html, which is invisible in a live app
        // because helmet's copy wins at runtime — but a snapshot keeps both.
        // Two <link rel="canonical"> on one page is not a redundancy, it is a
        // contradiction: the engine is free to honour neither. Drop the
        // static twin wherever helmet has produced its own.
        const identity = (el) => {
          if (el.tagName === "LINK") return `link:${el.getAttribute("rel")}`;
          if (el.tagName === "META")
            return `meta:${el.getAttribute("name") || el.getAttribute("property")}`;
          return null;
        };

        const managed = new Set(
          [...document.head.querySelectorAll("[data-rh]")].map(identity).filter(Boolean)
        );

        for (const el of document.head.querySelectorAll("link, meta")) {
          if (el.hasAttribute("data-rh")) continue;
          const id = identity(el);
          if (id && managed.has(id)) el.remove();
        }

        return "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
      });

      const text = await page.evaluate(() => document.body.innerText.trim().length);
      await writeFile(join(OUT_DIR, fileFor(route)), html, "utf8");
      results.push({ route, bytes: html.length, textChars: text });
    } catch (err) {
      results.push({ route, error: err?.message ?? String(err) });
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();

  for (const r of results) {
    if (r.error) console.error(`[prerender] ${r.route} FAILED: ${r.error}`);
    else
      console.log(
        `[prerender] ${r.route} -> ${fileFor(r.route)} (${Math.round(r.bytes / 1024)}KB html, ${r.textChars} chars of text)`
      );
  }

  const failed = results.filter((r) => r.error).length;
  if (failed) console.warn(`[prerender] ${failed}/${results.length} routes failed`);
}

main().catch((err) => {
  // Never fail the build over this — see the header comment.
  console.error("[prerender] skipped:", err?.message ?? err);
  process.exit(0);
});
