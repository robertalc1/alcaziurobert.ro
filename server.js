import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createHash } from "crypto";
import nodemailer from "nodemailer";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(express.json({ limit: "32kb" }));

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
  if (!pixelId || !token) return;

  const fwd = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0]?.trim() ?? req.ip;
  const ua = req.headers["user-agent"];

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        action_source: "website",
        event_source_url: "https://alcaziurobert.ro/",
        user_data: {
          em: [sha256(data.email.trim().toLowerCase())],
          ph: [sha256(data.phone.replace(/[^0-9]/g, ""))],
          ...(ip ? { client_ip_address: ip } : {}),
          ...(typeof ua === "string" ? { client_user_agent: ua } : {}),
        },
        custom_data: { project_type: data.projectType },
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
});

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

app.post("/api/contact", async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ ok: false, error: "invalid_payload", issues: parsed.error.flatten() });
  }
  const data = parsed.data;

  if (data.company && data.company.trim().length > 0) {
    return res.status(200).json({ ok: true });
  }

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
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470;vertical-align:top">Mesaj</td><td>${escapeHtml(data.message || "—")}</td></tr>
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

app.use(express.static(join(__dirname, "dist"), { maxAge: "30d", index: false }));

// SPA fallback — Express 5 nu mai acceptă "*" cu path-to-regexp v8.
// Folosim app.use ca middleware terminal: prinde orice GET nematchuit pana aici.
app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  res.sendFile(join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[alcaziurobert.ro] server up on port ${PORT}`);
});
