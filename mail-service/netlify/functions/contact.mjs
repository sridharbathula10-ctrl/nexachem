import nodemailer from "nodemailer";

const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || "https://nexachemco.com,https://www.nexachemco.com")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

function response(statusCode, body, origin) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...(origin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: body ? JSON.stringify(body) : "",
  };
}

export async function handler(event) {
  const origin = event.headers?.origin || event.headers?.Origin;
  if (origin && !allowedOrigins.has(origin)) return response(403, { error: "Origin not allowed." });
  if (event.httpMethod === "OPTIONS") return response(204, null, origin);
  if (event.httpMethod !== "POST") return response(405, { error: "Method not allowed." }, origin);

  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  if (!smtpUser || !smtpPassword) return response(503, { error: "Email service is not configured." }, origin);

  try {
    const data = JSON.parse(event.body || "{}");
    const field = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : "";
    const name = field(data.name, 120);
    const email = field(data.email, 254);
    const company = field(data.company, 160);
    const phone = field(data.phone, 60);
    const interest = field(data.interest, 300);
    const message = field(data.message, 5000);
    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response(400, { error: "Please provide your name, a valid email, and a message." }, origin);
    }

    const port = Number(process.env.SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port,
      secure: port === 465,
      auth: { user: smtpUser, pass: smtpPassword },
    });
    const fields = [["Name", name], ["Company", company], ["Email", email], ["Phone", phone], ["Interested in", interest], ["Message", message]];
    const text = fields.map(([label, value]) => `${label}:\n${value || "Not provided"}`).join("\n\n");
    await transporter.sendMail({
      from: smtpUser,
      to: process.env.MAIL_TO || "info@nexachemco.com",
      replyTo: email,
      subject: `Website enquiry from ${name.replace(/[\r\n]+/g, " ").slice(0, 120)}`,
      text,
    });
    return response(200, { ok: true }, origin);
  } catch (error) {
    if (error instanceof SyntaxError) return response(400, { error: "Invalid request." }, origin);
    console.error("SMTP delivery failed:", error);
    return response(502, { error: "Could not send your enquiry. Please try again later." }, origin);
  }
}
