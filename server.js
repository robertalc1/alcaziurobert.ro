import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createHash } from "crypto";
import { appendFile } from "fs/promises";
import { readFileSync } from "fs";
import nodemailer from "nodemailer";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(express.json({ limit: "32kb" }));

// A malformed JSON body must not fall through to Express's default HTML error
// page — the client only ever parses JSON from this API.
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ ok: false, error: "invalid_json" });
  }
  if (err && err.type === "entity.too.large") {
    return res.status(413).json({ ok: false, error: "payload_too_large" });
  }
  return next(err);
});

// Security headers for every response (previously set by the host's config).
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  // Only meaningful over HTTPS; harmless otherwise.
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  next();
});

const sha256 = (v) => createHash("sha256").update(v).digest("hex");

/** Real visitor IP behind the host's reverse proxy (trust proxy is on). */
function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  return (
    (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0]?.trim() || req.ip || ""
  );
}

/** Minimal cookie reader — only _fbp/_fbc are needed, so no extra dependency. */
function readCookie(req, name) {
  const raw = req.headers.cookie;
  if (!raw) return undefined;
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) {
      try {
        return decodeURIComponent(part.slice(i + 1).trim());
      } catch {
        return part.slice(i + 1).trim();
      }
    }
  }
  return undefined;
}

/**
 * In-memory rate limit for the contact endpoint. This is the only way a lead
 * reaches the inbox, so it must survive a bored script without ever blocking a
 * real prospect: 5 submissions per IP per 10 minutes, 60 across all IPs per
 * hour as a global ceiling. Single process (cPanel/Passenger runs one), so a
 * Map is enough — no Redis, no extra dependency.
 */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_PER_IP = Number(process.env.CONTACT_RATE_MAX_PER_IP || 5);
const GLOBAL_WINDOW_MS = 60 * 60 * 1000;
const GLOBAL_MAX = Number(process.env.CONTACT_RATE_MAX_GLOBAL || 60);

const hits = new Map(); // ip -> number[] (timestamps)
let globalHits = [];

function rateLimited(ip) {
  const now = Date.now();

  globalHits = globalHits.filter((t) => now - t < GLOBAL_WINDOW_MS);
  if (globalHits.length >= GLOBAL_MAX) return "global";

  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX_PER_IP) {
    hits.set(ip, recent);
    return "ip";
  }

  recent.push(now);
  hits.set(ip, recent);
  globalHits.push(now);

  // Opportunistic cleanup so the Map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return null;
}

/**
 * Append-only backup of every accepted lead, written BEFORE the email goes out.
 * If SMTP is down or the mailbox bounces, the lead still exists on disk instead
 * of vanishing. Never allowed to fail the request.
 */
async function backupLead(data, ip) {
  try {
    await appendFile(
      join(__dirname, "leads.jsonl"),
      JSON.stringify({ at: new Date().toISOString(), ip, ...data }) + "\n",
      "utf8"
    );
  } catch (err) {
    console.error("[contact] lead backup failed:", err?.message ?? err);
  }
}

/**
 * Server-side Meta Conversions API "Lead" event — lets ad campaigns optimize
 * on real leads without any client-side pixel or cookies. No-op until both
 * FB_PIXEL_ID and FB_CAPI_ACCESS_TOKEN are configured. Fired only after the
 * lead email is delivered; PII is SHA-256 hashed as Meta requires.
 * NOTE: update the Privacy Policy before enabling in production.
 */
async function sendLeadToMetaCapi(req, data) {
  const pixelId = process.env.FB_PIXEL_ID;
  const token = process.env.FB_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    console.warn(
      "[contact] CAPI not configured (FB_PIXEL_ID / FB_CAPI_ACCESS_TOKEN) — no Lead event sent to Meta"
    );
    return;
  }

  const ip = clientIp(req);
  const ua = req.headers["user-agent"];

  // Match quality drives what Meta's optimiser can do with the lead, and
  // therefore the cost per lead. Everything Meta can match on goes in: the
  // browser pixel cookies (_fbp/_fbc), name parts, and the RO country code.
  const fbp = readCookie(req, "_fbp");
  const fbc = readCookie(req, "_fbc");
  const nameParts = data.name.trim().toLowerCase().split(/\s+/);
  const fn = nameParts[0];
  const ln = nameParts.length > 1 ? nameParts[nameParts.length - 1] : undefined;

  // Meta wants the phone in international form without "+" or separators.
  const digits = data.phone.replace(/[^0-9+]/g, "");
  const e164 = digits.startsWith("+")
    ? digits.slice(1)
    : digits.startsWith("0")
      ? "4" + digits // Romanian national 07… → 407…
      : digits;

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: data.eventId,
        action_source: "website",
        event_source_url: data.pageUrl || "https://alcaziurobert.ro/",
        user_data: {
          em: [sha256(data.email.trim().toLowerCase())],
          ph: [sha256(e164)],
          ...(fn ? { fn: [sha256(fn)] } : {}),
          ...(ln ? { ln: [sha256(ln)] } : {}),
          country: [sha256("ro")],
          ...(fbp ? { fbp } : {}),
          ...(fbc ? { fbc } : {}),
          ...(ip ? { client_ip_address: ip } : {}),
          ...(typeof ua === "string" ? { client_user_agent: ua } : {}),
        },
        custom_data: {
          project_type: data.projectType,
          content_name: data.projectType,
        },
      },
    ],
    ...(process.env.FB_CAPI_TEST_EVENT_CODE
      ? { test_event_code: process.env.FB_CAPI_TEST_EVENT_CODE }
      : {}),
  };

  try {
    const resp = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!resp.ok) {
      console.error("[contact] CAPI failed:", resp.status, await resp.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[contact] CAPI error:", err?.message ?? err);
  }
}

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .refine((v) => /^(\+[1-9]\d{6,14}|0\d{9})$/.test(v.replace(/[\s\-().]/g, ""))),
  projectType: z.enum(["website", "webapp", "other"]),
  message: z.string().trim().max(1000).optional(),
  company: z.string().optional(),
  locale: z.enum(["en", "ro"]).optional(),
  // Set by the client from the cookie banner choice (Marketing category).
  marketingConsent: z.boolean().optional(),
  // Shared id between the browser pixel's Lead and this server-side one, so
  // Meta deduplicates them instead of counting the same lead twice.
  eventId: z.string().trim().max(64).optional(),
  // Where the form was actually submitted from (hero vs. #contact, EN vs. RO).
  pageUrl: z.string().trim().max(300).optional(),
});

/**
 * Display form of a stored E.164 number, for the notification email only. The
 * tel: link keeps the raw E.164 — this is purely so the number is readable at
 * a glance instead of a 12-digit run.
 */
function displayPhone(e164) {
  const clean = String(e164).replace(/[^\d+]/g, "");
  if (!clean.startsWith("+")) return e164;
  const digits = clean.slice(1);
  // +40 (the market) and every other two-digit code split cleanly into threes.
  // NANP/Kazakhstan use a single digit; the 3xx/4xx/5xx/8xx/9xx European and
  // overseas ranges use three. Only the grouping depends on this — a wrong
  // guess is cosmetic, never a wrong number.
  const ccLen = /^[17]/.test(digits)
    ? 1
    : /^(2[1-9]\d|3[5-9]\d|42[0-9]|5[0-9]\d|6[7-9]\d|8[5-8]\d|9[6-9]\d)/.test(digits)
      ? 3
      : 2;
  const cc = digits.slice(0, ccLen);
  const rest = digits.slice(ccLen);
  if (!rest) return clean;
  const groups = rest.match(/.{1,3}/g) || [rest];
  // A lone trailing digit reads as a typo ("791 112 345 6"), so it joins the
  // group before it.
  if (groups.length > 1 && groups[groups.length - 1].length === 1) {
    groups[groups.length - 2] += groups.pop();
  }
  return `+${cc} ${groups.join(" ")}`;
}

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

app.post("/api/contact", async (req, res) => {
  const ip = clientIp(req);

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ ok: false, error: "invalid_payload", issues: parsed.error.flatten() });
  }
  const data = parsed.data;

  // Honeypot: a bot filled the hidden field. Answer exactly like a success so
  // it learns nothing, and never spend a rate-limit slot or an email on it.
  if (data.company && data.company.trim().length > 0) {
    console.log("[contact] honeypot hit from", ip);
    return res.status(200).json({ ok: true });
  }

  const limited = rateLimited(ip);
  if (limited) {
    console.warn(`[contact] rate limited (${limited}) for`, ip);
    return res.status(429).json({ ok: false, error: "rate_limited" });
  }

  if (!data.eventId) {
    data.eventId = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  // Written before the email: an SMTP outage must never lose a lead.
  await backupLead(data, ip);

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const from = process.env.SMTP_FROM || user;
  const to = process.env.CONTACT_TO || "contact@alcaziurobert.ro";

  if (!host || !user || !pass) {
    console.error("[contact] SMTP not configured");
    return res.status(500).json({ ok: false, error: "smtp_not_configured" });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  // ─────────────────────── Lead notification email ───────────────────────
  // Built to be scanned in two seconds on a phone: the name is the headline,
  // the phone and email are thumb-sized buttons (calling back fast is what
  // wins the lead), and everything else is secondary detail underneath.
  // Table-based layout with inline styles only — that is the one thing every
  // mail client still renders the same way.

  const PROJECT_LABELS = {
    website: "Website",
    webapp: "Aplicație web",
    other: "Altceva",
  };
  const projectLabel = PROJECT_LABELS[data.projectType] ?? data.projectType;
  const localeLabel = data.locale === "ro" ? "Română" : data.locale === "en" ? "Engleză" : "—";

  // Name first: in a list of subjects, who it is beats what it is about.
  const subject = `[alcaziurobert.ro] ${data.name} · ${projectLabel}`;

  const receivedAt = new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Bucharest",
  }).format(new Date());

  const telHref = data.phone.replace(/[^\d+]/g, "");
  const phoneText = displayPhone(data.phone);
  const messageBody = data.message?.trim() || "";

  const text = [
    `LEAD NOU — alcaziurobert.ro`,
    ``,
    `${data.name}`,
    `${phoneText}`,
    `${data.email}`,
    ``,
    `Proiect:  ${projectLabel}`,
    `Limba:    ${localeLabel}`,
    `Primit:   ${receivedAt}`,
    ``,
    messageBody ? `MESAJ\n${"-".repeat(40)}\n${messageBody}` : `Fără mesaj.`,
    ``,
    `Răspunde direct la acest email — pleacă spre ${data.email}.`,
  ].join("\n");

  // Escaped, then newlines become <br>: `white-space: pre-wrap` alone is
  // dropped by several clients, <br> is not.
  const messageHtml = messageBody
    ? escapeHtml(messageBody).replace(/\r?\n/g, "<br>")
    : `<span style="color:#9AA1AC">Nu a scris niciun mesaj.</span>`;

  const html = `<!doctype html>
<html lang="ro">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4F5F7">

  <!-- Preview line in the inbox list, before the mail is even opened -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">
    ${escapeHtml(data.name)} · ${escapeHtml(phoneText)} · ${escapeHtml(projectLabel)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F5F7">
    <tr>
      <td align="center" style="padding:24px 12px">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#FFFFFF;border-radius:14px;overflow:hidden;border:1px solid #E3E6EA">

          <!-- Orange rule + eyebrow -->
          <tr><td style="height:4px;background:#ED5C1B;line-height:4px;font-size:0">&nbsp;</td></tr>

          <tr>
            <td style="padding:26px 28px 0">
              <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#ED5C1B">
                Lead nou
              </div>
              <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:27px;line-height:1.2;font-weight:700;color:#16181D;padding-top:8px">
                ${escapeHtml(data.name)}
              </div>
              <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:13px;color:#7A828E;padding-top:7px">
                ${escapeHtml(projectLabel)} &nbsp;·&nbsp; ${escapeHtml(localeLabel)} &nbsp;·&nbsp; ${escapeHtml(receivedAt)}
              </div>
            </td>
          </tr>

          <!-- The two actions that matter. Big enough for a thumb. -->
          <tr>
            <td style="padding:22px 28px 0">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom:10px">
                    <a href="tel:${escapeHtml(telHref)}" style="display:block;padding:15px 20px;background:#ED5C1B;border-radius:10px;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:17px;font-weight:600;color:#FFFFFF;text-align:center">
                      Sună &nbsp;${escapeHtml(phoneText)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href="mailto:${escapeHtml(data.email)}" style="display:block;padding:14px 20px;background:#FFFFFF;border:1px solid #D6DAE0;border-radius:10px;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:15px;font-weight:500;color:#16181D;text-align:center">
                      ${escapeHtml(data.email)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What they wrote -->
          <tr>
            <td style="padding:24px 28px 0">
              <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#7A828E;padding-bottom:9px">
                Mesaj
              </div>
              <div style="background:#F7F8FA;border-left:3px solid #ED5C1B;border-radius:0 8px 8px 0;padding:15px 17px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#16181D">
                ${messageHtml}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 28px 28px">
              <div style="border-top:1px solid #EDEFF2;padding-top:15px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:12px;line-height:1.6;color:#9AA1AC">
                Formularul de contact de pe <a href="https://alcaziurobert.ro" style="color:#9AA1AC">alcaziurobert.ro</a>.
                Dacă apeși <strong style="color:#7A828E">Răspunde</strong>, mesajul pleacă direct către ${escapeHtml(data.email)}.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: data.email,
      subject,
      text,
      html,
    });
    // Fire-and-tolerate: a CAPI hiccup must never fail the lead itself.
    // GDPR: the Lead event carries hashed personal data for advertising, so it
    // only goes out when the visitor accepted Marketing cookies.
    if (data.marketingConsent === true) await sendLeadToMetaCapi(req, data);
    else console.log("[contact] CAPI skipped — no marketing consent");
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err?.message ?? err);
    return res.status(502).json({ ok: false, error: "send_failed" });
  }
});

// Hashed asset filenames are immutable, so they can be cached for a year;
// everything else (including index.html) must always be revalidated or a
// deploy would leave visitors on the previous build.
app.use(
  express.static(join(__dirname, "dist"), {
    index: false,
    setHeaders: (res, filePath) => {
      // Vite emits assets as name-<hash>.ext — those URLs change on every build.
      const immutable = /-[0-9A-Za-z_-]{8,}\.[a-z0-9]+$/.test(filePath);
      res.setHeader(
        "Cache-Control",
        immutable ? "public, max-age=31536000, immutable" : "public, max-age=3600"
      );
    },
  })
);

/**
 * Per-route SEO tags, rendered into the HTML before it leaves the server.
 *
 * This is a single-page app: every route used to be answered with the exact
 * same dist/index.html, so a crawler that does not run JavaScript saw the
 * homepage's title, the homepage's description, and — worst of all — a
 * canonical pointing at "/" on every single page. That canonical actively
 * tells a search engine that /studii-de-caz is a duplicate of the homepage.
 * react-helmet fixes it after React boots, which helps Google and helps no
 * one else: the AI crawlers (GPTBot, PerplexityBot, ClaudeBot) do not execute
 * JavaScript at all.
 *
 * The copy comes from route-meta.json, the same file the client imports, so
 * the two halves cannot drift apart.
 *
 * English is served here on purpose. It is the site's default language, it is
 * what Googlebot requests, and the alternative — varying the HTML by
 * Accept-Language — would need a Vary header and would make every shared
 * cache serve the wrong language to someone.
 */
const SITE_URL = "https://alcaziurobert.ro";
const DIST_DIR = join(__dirname, "dist");
const INDEX_HTML_PATH = join(DIST_DIR, "index.html");

let routeMeta = {};
try {
  routeMeta = JSON.parse(
    readFileSync(join(__dirname, "route-meta.json"), "utf8")
  );
} catch (err) {
  console.warn(
    "[seo] route-meta.json not readable — pages will be served with the homepage's meta tags:",
    err?.message ?? err
  );
}

let indexHtmlTemplate = "";
try {
  indexHtmlTemplate = readFileSync(INDEX_HTML_PATH, "utf8");
} catch {
  // dist/ is missing (dev, or a broken deploy). sendFile below reports it.
}

/**
 * Static snapshots produced by scripts/prerender.mjs at build time — the real
 * page, text and all, for anything that will not run JavaScript. Loaded once
 * at boot; a missing file just means this route falls back to the meta-only
 * template, which is what happens in dev where nothing has been prerendered.
 */
const prerendered = new Map();
for (const route of Object.keys(routeMeta)) {
  const file = (route === "/" ? "index" : route.slice(1)) + ".html";
  try {
    prerendered.set(route, readFileSync(join(DIST_DIR, "prerendered", file), "utf8"));
  } catch {
    // Not prerendered — renderIndexFor falls back to patching index.html.
  }
}
console.log(
  prerendered.size
    ? `[seo] ${prerendered.size}/${Object.keys(routeMeta).length} routes served from prerendered HTML`
    : "[seo] no prerendered HTML found — crawlers that do not run JavaScript will see an empty shell"
);

const escapeAttr = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

/**
 * Rewrites the title, description, canonical and og:* tags of the built
 * index.html for one route. Returns null when there is nothing to rewrite, so
 * the caller falls back to serving the file untouched.
 */
function renderIndexFor(pathname) {
  if (!indexHtmlTemplate) return null;
  // A prerendered snapshot already carries the right title, description,
  // canonical and the actual page text — nothing left to patch.
  const snapshot = prerendered.get(pathname);
  if (snapshot) return { status: 200, html: snapshot };

  const meta = routeMeta[pathname];

  // Unknown path. Serving the shell at 200 is a soft 404: the crawler is told
  // the page exists, indexes a copy of the homepage under a URL that is not a
  // page, and the site accumulates duplicates of itself. React still renders
  // NotFound — a 404 status and an HTML body are not in conflict.
  if (!meta) {
    return {
      status: 404,
      // Replaced, not appended: leaving index.html's "index, follow" in place
      // next to a "noindex" is two contradictory directives on one page. The
      // strictest one wins at Google, but the pair is a trap for the next
      // person who reads the source.
      html: indexHtmlTemplate.replace(
        /<meta name="robots" content="[^"]*" \/>/,
        '<meta name="robots" content="noindex, follow" />'
      ),
    };
  }

  const title = meta.title.en;
  const description = meta.description.en;
  const canonical = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;

  const html = indexHtmlTemplate
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`)
    .replace(
      /<meta name="description" content="[\s\S]*?" \/>/,
      `<meta name="description" content="${escapeAttr(description)}" />`
    )
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${escapeAttr(canonical)}" />`
    )
    .replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${escapeAttr(canonical)}" />`
    )
    .replace(
      /<meta property="og:title" content="[\s\S]*?" \/>/,
      `<meta property="og:title" content="${escapeAttr(title)}" />`
    )
    .replace(
      /<meta property="og:description" content="[\s\S]*?" \/>/,
      `<meta property="og:description" content="${escapeAttr(description)}" />`
    )
    .replace(
      /<meta name="twitter:title" content="[\s\S]*?" \/>/,
      `<meta name="twitter:title" content="${escapeAttr(title)}" />`
    )
    .replace(
      /<meta name="twitter:description" content="[\s\S]*?" \/>/,
      `<meta name="twitter:description" content="${escapeAttr(description)}" />`
    );

  return { status: 200, html };
}

// SPA fallback — Express 5 nu mai acceptă "*" cu path-to-regexp v8.
// Folosim app.use ca middleware terminal: prinde orice GET nematchuit pana aici.
app.use((req, res, next) => {
  // HEAD must be answered exactly like GET, minus the body. Matching only
  // "GET" sent every HEAD request to the 404 at the end of the chain, so
  // every crawler, uptime monitor and link checker that probes with HEAD —
  // which is the polite way to probe — was told the whole site did not exist.
  if (req.method !== "GET" && req.method !== "HEAD") return next();

  // An unknown /api/* path is an API mistake, not a page — answering with the
  // SPA's HTML at status 200 would hide the error from whoever called it.
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ ok: false, error: "not_found" });
  }

  // A missing asset must 404 too. Returning index.html at 200 for a stale
  // .js/.css URL makes the browser fail with an opaque MIME-type error
  // instead of a clear 404 (this happens to anyone holding an old build).
  if (/\.[a-z0-9]{2,5}$/i.test(req.path)) {
    return res.status(404).type("text/plain").send("Not found");
  }

  res.setHeader("Cache-Control", "no-cache");

  const rendered = renderIndexFor(req.path);
  if (rendered) return res.status(rendered.status).type("html").send(rendered.html);

  // dist/index.html could not be read at boot — let sendFile report why.
  res.sendFile(INDEX_HTML_PATH);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[alcaziurobert.ro] server up on port ${PORT}`);

  // Fail loudly at boot instead of silently at the first lead.
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error(
      "[contact] !! SMTP is NOT configured (SMTP_HOST / SMTP_USER / SMTP_PASSWORD) — every contact form submission will fail with 500."
    );
  } else {
    nodemailer
      .createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT || 465) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      })
      .verify()
      .then(() => console.log("[contact] SMTP connection verified — leads will be delivered"))
      .catch((err) =>
        console.error("[contact] !! SMTP verify FAILED:", err?.message ?? err)
      );
  }

  if (!process.env.FB_PIXEL_ID || !process.env.FB_CAPI_ACCESS_TOKEN) {
    console.warn(
      "[contact] Meta Conversions API disabled (FB_PIXEL_ID / FB_CAPI_ACCESS_TOKEN missing) — ad campaigns will not receive Lead events."
    );
  }
});
