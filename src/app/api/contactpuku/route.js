import { ContactEmailError, sendContactEmail } from "../../../lib/contact-email.mjs";

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    await sendContactEmail(data);
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof ContactEmailError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error("SMTP delivery failed:", error);
    return Response.json({ error: "Could not send your enquiry. Check the SMTP settings and try again." }, { status: 502 });
  }
}
