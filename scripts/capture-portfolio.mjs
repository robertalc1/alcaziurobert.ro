/**
 * Recaptures every portfolio screenshot from the live site.
 *
 * Why this exists: eight of the twelve files in public/ were never screenshots.
 * They were product photos, stock images and — for r-draw.com — a generated
 * image still carrying its watermark. Inside a browser frame labelled with the
 * client's domain, a photo of a tractor claims to be a website. This script
 * makes the claim true: every card shows the page that is actually live at
 * that address, all twelve captured the same way, on the same day.
 *
 * Run: npm run capture-portfolio            (all twelve)
 *      npm run capture-portfolio -- rdraw   (one or more slugs)
 *
 * Output per project:
 *   public/work/<slug>.webp                   1600x1000, the stage image
 *   public/work/<slug>-thumb.webp              480x300,  the roster chip
 *   artifacts.local/portfolio-raw/<slug>.png   the untouched 2x capture
 *
 * A site that fails leaves its existing files untouched — a bad day on someone
 * else's server must never blank a card here.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const OUT = "public/work";
const RAW = "artifacts.local/portfolio-raw";

/** The capture frame. 16:10, the aspect the stage renders at. */
const W = 1600;
const H = 1000;

/**
 * `wait` is the settle time AFTER the scroll pass, in ms. Pages that boot a
 * map, a 3D scene or a slider need longer than a static page — the default is
 * tuned for the latter, and anything slower says so here rather than making
 * all twelve pay for it.
 */
const PROJECTS = [
  { slug: "sgc", url: "https://sgc.ocpict.ro/", wait: 4500 },
  { slug: "black-sea-gis", url: "https://bsgis.ocpict.ro/", wait: 7000 },
  { slug: "laura-predoi", url: "https://psihologiecabinet.ro/", wait: 3000 },
  { slug: "unbacde10", url: "https://unbacde10.ro/", wait: 3000 },
  { slug: "picaps", url: "https://picaps.ro/", wait: 3500 },
  { slug: "kickout", url: "https://kickout.ro/", wait: 4500 },
  { slug: "rdraw", url: "https://r-draw.com/", wait: 3500 },
  { slug: "everun", url: "https://www.everunromania.ro/", wait: 3500 },
  { slug: "everati", url: "https://everati.ro/", wait: 5000 },
  { slug: "alma", url: "https://vopsitoriaalma.ro/", wait: 3500 },
  { slug: "lukton", url: "https://lukton.ro/", wait: 5000 },
  { slug: "ecartop", url: "https://ecartop.com/", wait: 3500 },
];

/** Cookie walls, by the two ways they are ever built. */
const COOKIE_SELECTORS = [
  "#onetrust-accept-btn-handler",
  ".cc-allow",
  ".cc-dismiss",
  "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
  "#cookie-accept",
  ".cookie-accept",
  "[data-cky-tag=accept-button]",
  ".cmplz-accept",
  "#wt-cli-accept-all-btn",
  ".moove-gdpr-infobar-allow-all",
];

const COOKIE_TEXT =
  /^(accept( all)?( cookies)?|allow all|got it|ok|de acord|sunt de acord|accept[aă]( toate)?|accept[aă] tot|permite toate|[iî]n[tț]eleg)$/i;

/**
 * Overlays that are not the client's design. A floating WhatsApp button IS the
 * site and stays; a cookie banner is the visitor's first second, not the work.
 */
const JUNK_SELECTORS = [
  "[id*=cookie i][class*=banner i]",
  "[class*=cookie i][class*=banner i]",
  "[class*=cookie i][class*=consent i]",
  "[id*=cookie i][id*=consent i]",
  "#cmplz-cookiebanner-container",
  ".cky-consent-container",
  "#moove_gdpr_cookie_info_bar",
  "#CybotCookiebotDialog",
  "#onetrust-consent-sdk",
  ".grecaptcha-badge",
];

async function dismissCookies(page) {
  for (const sel of COOKIE_SELECTORS) {
    const el = page.locator(sel).first();
    const present = await el
      .count()
      .then((n) => n > 0)
      .catch(() => false);
    if (present) {
      await el.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(400);
    }
  }

  // Text pass, for the banners that ship no stable hook at all. The scan runs
  // in ONE page.evaluate rather than as 120 Playwright round-trips: a locator
  // call auto-waits up to 30s per element, and on a single-page app that
  // re-renders under us that is an hour of timeouts, not a scan. Ask the DOM
  // once, get back an index, click that.
  const hit = await page
    .evaluate((src) => {
      const re = new RegExp(src, "i");
      const nodes = [...document.querySelectorAll("button, a, [role=button]")].slice(0, 400);
      const i = nodes.findIndex((n) => re.test((n.innerText || "").trim()));
      if (i < 0) return null;
      nodes[i].setAttribute("data-capture-cookie-btn", "1");
      return true;
    }, COOKIE_TEXT.source)
    .catch(() => null);

  if (hit) {
    await page
      .locator("[data-capture-cookie-btn]")
      .first()
      .click({ timeout: 2000 })
      .catch(() => {});
    await page.waitForTimeout(400);
  }

  await page
    .evaluate((sels) => {
      for (const s of sels) {
        document.querySelectorAll(s).forEach((n) => n.remove());
      }

      /* Marketing interstitials — the scratch-card popup on kickout.ro, the
         newsletter box, the "wait, don't go" overlay. They are not cookie
         walls, so no selector list catches them, and they sit squarely over
         the one thing this screenshot exists to show.

         The test is geometric rather than by class name: a fixed element that
         covers the middle of the viewport and a meaningful share of its area
         is an interstitial. A sticky header spans the width but hugs the top;
         a floating WhatsApp button sits in a corner; neither crosses the
         centre point, so neither is touched. */
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      /* Consent panels that no selector list catches: the Google Analytics
         "Tu alegi ce partajezi" card on psihologiecabinet.ro, the bottom bar
         on unbacde10.ro. They are floated anywhere on the screen, so geometry
         alone does not find them — but they all talk about the same six
         things, and nothing else on a marketing page does. */
      const CONSENT =
        /cookie|consim[tț]|confiden[tț]ial|gdpr|analytics|partajezi|doar esen[tț]iale|accept[aă]? (tot|toate)/i;

      for (const el of [...document.querySelectorAll("body *")]) {
        const cs = getComputedStyle(el);
        const floated = cs.position === "fixed" || cs.position === "sticky";
        if (!floated || cs.display === "none" || cs.visibility === "hidden") continue;

        const r = el.getBoundingClientRect();
        if (r.width < 40 || r.height < 40) continue;
        const share = (r.width * r.height) / (vw * vh);

        // 1. An interstitial: covers the middle of the viewport. A sticky
        //    header hugs the top and a floating chat button sits in a corner;
        //    neither crosses the centre point, so neither is touched.
        const coversCentre =
          r.left < vw / 2 && r.right > vw / 2 && r.top < vh / 2 && r.bottom > vh / 2;
        if (coversCentre && share > 0.06) {
          el.remove();
          continue;
        }

        // 2. A consent panel, wherever it floats. Size-gated so a one-line
        //    link in a sticky nav is not mistaken for a banner.
        if (share > 0.015 && CONSENT.test(el.innerText || "")) el.remove();
      }
    }, JUNK_SELECTORS)
    .catch(() => {});
}

/**
 * Walk the page and come back. Most of these sites reveal their content with an
 * IntersectionObserver, so a page that is never scrolled screenshots as a set
 * of empty boxes.
 */
async function settle(page, wait) {
  await page
    .evaluate(async () => {
      const step = window.innerHeight * 0.75;
      const end = Math.min(document.body.scrollHeight, step * 8);
      for (let y = 0; y < end; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
    })
    .catch(() => {});

  await page.waitForTimeout(wait);
  await page.evaluate(() => document.fonts.ready).catch(() => {});

  // Decode what is in the DOM: networkidle returns before a lazy <img> that was
  // just scrolled past has finished painting.
  //
  // The race is not optional. An <img> whose fetch the browser has deferred
  // fires neither load nor error, so a bare Promise.all over them never
  // settles — and page.evaluate has no timeout of its own, so the whole run
  // parks on one tracking pixel. Wait for the images OR four seconds.
  await page
    .evaluate(
      () =>
        Promise.race([
          Promise.all(
            [...document.images]
              .filter((i) => !i.complete)
              .map(
                (i) =>
                  new Promise((r) => {
                    i.onload = r;
                    i.onerror = r;
                  })
              )
          ),
          new Promise((r) => setTimeout(r, 4000)),
        ])
    )
    .catch(() => {});

  await page.waitForTimeout(600);
}

async function capture(browser, project) {
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2,
    locale: "ro-RO",
    timezoneId: "Europe/Bucharest",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);

  try {
    const res = await page.goto(project.url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await dismissCookies(page);
    await settle(page, project.wait);
    await dismissCookies(page);

    const buf = await page.screenshot({
      clip: { x: 0, y: 0, width: W, height: H },
      animations: "disabled",
    });

    await writeFile(`${RAW}/${project.slug}.png`, buf);

    const stage = await sharp(buf)
      .resize(W, H, { fit: "cover" })
      .webp({ quality: 82, effort: 5 })
      .toBuffer();
    await writeFile(`${OUT}/${project.slug}.webp`, stage);

    const thumb = await sharp(buf)
      .resize(480, 300, { fit: "cover" })
      .webp({ quality: 78, effort: 5 })
      .toBuffer();
    await writeFile(`${OUT}/${project.slug}-thumb.webp`, thumb);

    return {
      slug: project.slug,
      status: res ? res.status() : 0,
      title: (await page.title().catch(() => "")).slice(0, 56),
      stageKB: (stage.length / 1024).toFixed(1),
      thumbKB: (thumb.length / 1024).toFixed(1),
    };
  } catch (err) {
    const msg = err && err.message ? err.message.split("\n")[0] : String(err);
    return { slug: project.slug, error: msg };
  } finally {
    await ctx.close();
  }
}

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const queue = only.length ? PROJECTS.filter((p) => only.includes(p.slug)) : PROJECTS;

await mkdir(OUT, { recursive: true });
await mkdir(RAW, { recursive: true });

let browser;
try {
  browser = await chromium.launch({ channel: "chrome" });
} catch {
  browser = await chromium.launch();
}

const results = [];
for (const p of queue) {
  process.stdout.write(`[capture] ${p.slug.padEnd(14)} ${p.url} ... `);
  // Belt and braces: even with every step bounded, a page that locks its main
  // thread can hold an evaluate open. Two minutes is well past any honest
  // capture, so past it the site is the problem and the run moves on.
  const r = await Promise.race([
    capture(browser, p),
    new Promise((resolve) =>
      setTimeout(() => resolve({ slug: p.slug, error: "watchdog: over 120s" }), 120000)
    ),
  ]);
  results.push(r);
  console.log(
    r.error ? `FAILED: ${r.error}` : `ok (${r.stageKB}KB + ${r.thumbKB}KB) "${r.title}"`
  );
}
await browser.close();

const failed = results.filter((r) => r.error);
console.log(`\n[capture] ${results.length - failed.length}/${results.length} captured`);
if (failed.length) {
  console.log("[capture] kept existing files for: " + failed.map((f) => f.slug).join(", "));
  process.exitCode = 1;
}
