import { createServer } from "node:http";
import nodemailer from "nodemailer";

const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || "https://nexachemco.com,https://www.nexachemco.com,http://localhost:3001")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}

function cors(request, response) {
  const origin = request.headers.origin;
  if (origin && !allowedOrigins.has(origin)) return false;
  if (origin) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Max-Age", "86400");
  return true;
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 32 * 1024) {
      const error = new Error("Request is too large.");
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Invalid request.");
    error.status = 400;
    throw error;
  }
}

function requiredText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url || "/", "http://localhost").pathname;
  if (pathname !== "/api/contact") return sendJson(response, 404, { error: "Not found." });
  if (!cors(request, response)) return sendJson(response, 403, { error: "Origin not allowed." });
  if (request.method === "OPTIONS") {
    response.writeHead(204);
    return response.end();
  }
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    return sendJson(response, 405, { error: "Method not allowed." });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  if (!smtpUser || !smtpPassword) return sendJson(response, 503, { error: "Email service is not configured." });

  try {
    const body = await readJson(request);
    const data = body && typeof body === "object" && !Array.isArray(body) ? body : {};
    const name = requiredText(data.name, 120);
    const email = requiredText(data.email, 254);
    const company = requiredText(data.company, 160);
    const phone = requiredText(data.phone, 60);
    const interest = requiredText(data.interest, 300);
    const message = requiredText(data.message, 5000);
    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendJson(response, 400, { error: "Please provide your name, a valid email, and a message." });
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
    return sendJson(response, 200, { ok: true });
  } catch (error) {
    if (error.status) return sendJson(response, error.status, { error: error.message });
    console.error("SMTP delivery failed:", error);
    return sendJson(response, 502, { error: "Could not send your enquiry. Please try again later." });
  }
});

const port = Number(process.env.PORT || 3000);
server.listen(port, "0.0.0.0", () => console.log(`NexaChem mail API listening on port ${port}`));
