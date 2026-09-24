const nodemailer = require("nodemailer");

const json = (statusCode, payload) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  if (!user || !password) {
    return json(503, { error: "Email delivery is not configured yet." });
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid request." });
  }

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const message = String(data.message || "").trim();
  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: "Please provide your name, a valid email, and a message." });
  }

  const fields = [
    ["Name", name],
    ["Company", data.company],
    ["Email", email],
    ["Phone", data.phone],
    ["Interested in", data.interest],
    ["Message", message],
  ];
  const text = fields
    .map(([label, value]) => `${label}:\n${String(value || "").trim() || "Not provided"}`)
    .join("\n\n");
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  try {
    await transporter.sendMail({
      from: user,
      to: "info@nexachemco.com",
      replyTo: email,
      subject: `Website enquiry from ${name}`,
      text,
    });
    return json(200, { ok: true });
  } catch (error) {
    console.error("SMTP delivery failed:", error);
    return json(502, { error: "Could not send your enquiry. Check the SMTP settings and try again." });
  }
};
