import nodemailer from "nodemailer";

const recipient = "info@nexachemco.com";

export async function POST(request) {
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  if (!user || !password) {
    return Response.json({ error: "Email delivery is not configured yet." }, { status: 503 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const message = String(data.message || "").trim();
  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please provide your name, a valid email, and a message." }, { status: 400 });
  }

  const fields = [
    ["Name", name],
    ["Company", data.company],
    ["Email", email],
    ["Phone", data.phone],
    ["Interested in", data.interest],
    ["Message", message],
  ];
  const text = fields.map(([label, value]) => `${label}:\n${String(value || "").trim() || "Not provided"}`).join("\n\n");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user, pass: password },
  });

  try {
    await transporter.sendMail({
      from: user,
      to: recipient,
      replyTo: email,
      subject: `Website enquiry from ${name}`,
      text,
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("SMTP delivery failed:", error);
    return Response.json({ error: "Could not send your enquiry. Check the SMTP settings and try again." }, { status: 502 });
  }
}
