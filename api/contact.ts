import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";
import { z } from "zod";
import { createHash } from "node:crypto";

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
  budget: z.enum(["1.5-3k", "3-5k", "5k+", "discuss"]),
  // Honeypot — must be empty. Bots will fill it.
  company: z.string().optional(),
  locale: z.enum(["en", "ro"]).optional(),
});

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

/**
 * Server-side Meta Conversions API "Lead" event — lets ad campaigns optimize
 * on real leads without any client-side pixel or cookies. No-op until both
 * FB_PIXEL_ID and FB_CAPI_ACCESS_TOKEN are configured. Fired only after the
 * lead email is delivered; PII is SHA-256 hashed as Meta requires.
 * NOTE: update the Privacy Policy before enabling in production.
 */
async function sendLeadToMetaCapi(
  req: VercelRequest,
  data: { email: string; phone: string; budget: string; projectType: string }
) {
  const pixelId = process.env.FB_PIXEL_ID;
  const token = process.env.FB_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) return;

  const fwd = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0]?.trim();
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
        custom_data: { budget: data.budget, project_type: data.projectType },
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
      console.error("[api/contact] CAPI failed:", resp.status, await resp.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[api/contact] CAPI error:", err instanceof Error ? err.message : err);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "invalid_payload", issues: parsed.error.flatten() });
  }

  const data = parsed.data;

  // Honeypot — reject silently with 200 so bots don't retry.
  if (data.company && data.company.trim().length > 0) {
    return res.status(200).json({ ok: true });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM || user;
  const to = process.env.CONTACT_TO || "contact@alcaziurobert.ro";

  if (!host || !user || !pass) {
    return res.status(500).json({ ok: false, error: "smtp_not_configured" });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const subject = `[alcaziurobert.ro] ${data.projectType} · ${data.budget} · ${data.name}`;

  const text = [
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    `Phone:   ${data.phone}`,
    `Type:    ${data.projectType}`,
    `Budget:  ${data.budget}`,
    `Locale:  ${data.locale ?? "n/a"}`,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.55;color:#262626;max-width:560px">
      <h2 style="font-size:18px;font-weight:600;margin:0 0 16px;color:#FE5C02">Contact nou — alcaziurobert.ro</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Nume</td><td style="padding:6px 0"><strong>${escapeHtml(data.name)}</strong></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Telefon</td><td style="padding:6px 0"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Proiect</td><td style="padding:6px 0">${escapeHtml(data.projectType)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Buget</td><td style="padding:6px 0">${escapeHtml(data.budget)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Limba</td><td style="padding:6px 0">${escapeHtml(data.locale ?? "n/a")}</td></tr>
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
    await sendLeadToMetaCapi(req, data);
    return res.status(200).json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("[api/contact] send failed:", msg);
    return res.status(502).json({ ok: false, error: "send_failed" });
  }
}
