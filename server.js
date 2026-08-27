import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createHash } from "crypto";
import { appendFile } from "fs/promises";
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

  const subject = `[alcaziurobert.ro] ${data.projectType} · ${data.name}`;
  const text = [
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    `Phone:   ${data.phone}`,
    `Type:    ${data.projectType}`,
    `Locale:  ${data.locale ?? "n/a"}`,
    `Message: ${data.message || "—"}`,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.55;color:#262626;max-width:560px">
      <h2 style="font-size:18px;font-weight:600;margin:0 0 16px;color:#FE5C02">Contact nou — alcaziurobert.ro</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Nume</td><td><strong>${escapeHtml(data.name)}</strong></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Email</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Telefon</td><td><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Proiect</td><td>${escapeHtml(data.projectType)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Limba</td><td>${escapeHtml(data.locale ?? "n/a")}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470;vertical-align:top">Mesaj</td><td style="white-space:pre-wrap">${escapeHtml(data.message || "—")}</td></tr>
      </table>
    </div>
  `;

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

// SPA fallback — Express 5 nu mai acceptă "*" cu path-to-regexp v8.
// Folosim app.use ca middleware terminal: prinde orice GET nematchuit pana aici.
app.use((req, res, next) => {
  if (req.method !== "GET") return next();

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
  res.sendFile(join(__dirname, "dist", "index.html"));
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
