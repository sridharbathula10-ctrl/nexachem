"use client";

import { useState } from "react";

export function ContactForm({ autoFocus = false, product = "", idPrefix = "contact-modal" }) {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setStatus("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const apiUrl = "https://nexachem-be.vercel.app/api/contact";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `Could not send your enquiry (error ${response.status}).`);
      form.reset();
      setStatus("Thanks, your enquiry has been sent.");
    } catch (error) {
      setStatus(error.message || "Could not send your enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const fieldId = (field) => `${idPrefix}-${field}`;

  return <form className="contact-form" onSubmit={handleSubmit}>
    <div><label htmlFor={fieldId("name")}>Full name</label><input autoFocus={autoFocus} id={fieldId("name")} name="name" placeholder="Your name" required /></div>
    <div><label htmlFor={fieldId("company")}>Company</label><input id={fieldId("company")} name="company" placeholder="Company name" /></div>
    <div><label htmlFor={fieldId("email")}>Email address</label><input id={fieldId("email")} name="email" type="email" placeholder="you@company.com" required /></div>
    <div><label htmlFor={fieldId("phone")}>Phone number</label><input id={fieldId("phone")} name="phone" placeholder="+00 000 000 0000" /></div>
    <div className="full"><label htmlFor={fieldId("interest")}>I am interested in</label><input id={fieldId("interest")} name="interest" defaultValue={product ? `Product information: ${product}` : ""} placeholder="Products, sourcing, technical support..." /></div>
    <div className="full"><label htmlFor={fieldId("message")}>How can we help?</label><textarea id={fieldId("message")} name="message" placeholder="Tell us about your requirement" required /></div>
    <button className="button blue" type="submit" disabled={sending}>{sending ? "Sending…" : "Send enquiry ↗"}</button>
    {status && <p className="full" role="status">{status}</p>}
  </form>;
}
