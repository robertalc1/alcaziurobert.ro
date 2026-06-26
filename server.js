import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import nodemailer from "nodemailer";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: "32kb" }));

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
  company: z.string().optional(),
  locale: z.enum(["en", "ro"]).optional(),
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
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Nume</td><td><strong>${escapeHtml(data.name)}</strong></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Email</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Telefon</td><td><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Proiect</td><td>${escapeHtml(data.projectType)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Buget</td><td>${escapeHtml(data.budget)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5b6470">Limba</td><td>${escapeHtml(data.locale ?? "n/a")}</td></tr>
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
