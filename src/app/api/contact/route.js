const recipient = "sridharbathula10@gmail.com";

export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
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

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `Website enquiry from ${name}`,
        text,
      }),
    });
    if (!response.ok) {
      console.error("Resend email request failed:", response.status, await response.text());
      return Response.json({ error: "Could not send your enquiry. Please try again later." }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Email delivery request failed:", error);
    return Response.json({ error: "Could not send your enquiry. Please try again later." }, { status: 502 });
  }
}
