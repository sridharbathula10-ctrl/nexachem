import nodemailer from "nodemailer";

export class ContactEmailError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function sendContactEmail(data) {
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  if (!user || !password) throw new ContactEmailError("Email delivery is not configured yet.", 503);

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const message = String(data.message || "").trim();
  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ContactEmailError("Please provide your name, a valid email, and a message.", 400);
  }

  const fields = [["Name", name], ["Company", data.company], ["Email", email], ["Phone", data.phone], ["Interested in", data.interest], ["Message", message]];
  const text = fields.map(([label, value]) => `${label}:\n${String(value || "").trim() || "Not provided"}`).join("\n\n");
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  await transporter.sendMail({
    from: user,
    to: "info@nexachemco.com",
    replyTo: email,
    subject: `Website enquiry from ${name.replace(/[\r\n]+/g, " ").slice(0, 120)}`,
    text,
  });
}
