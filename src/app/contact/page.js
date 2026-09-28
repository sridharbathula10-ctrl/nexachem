"use client";

import { useState } from "react";
import { Layout } from "../components/site-shell";

export default function Contact() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setStatus("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const apiUrl = "https://nexachem-be.vercel.app/api/contact";
      const response = await fetch(
        apiUrl,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Could not send your enquiry.");
      form.reset();
      setStatus("Thanks, your enquiry has been sent.");
    } catch (error) {
      setStatus(error.message || "Could not send your enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return <Layout><section className="section contact-page"><div className="section-inner"><div className="contact-heading"><p className="eyebrow">Contact NexaChemCo</p><h1>Let’s find the right <em>solution.</em></h1></div><div className="contact-grid"><aside className="contact-details"><p className="eyebrow light">Get in touch</p><h2>Request a quote or product information.</h2><p>For bulk industrial chemicals, specialty raw materials, formulation ingredients, or customized sourcing support, NexaChemCo is ready to help.</p><a href="mailto:info@nexachemco.com">info@nexachemco.com ↗</a><a href="tel:+0000000000">+00 000 000 0000 ↗</a></aside><form className="contact-form" onSubmit={handleSubmit}><div><label htmlFor="name">Full name</label><input id="name" name="name" placeholder="Your name" required /></div><div><label htmlFor="company">Company</label><input id="company" name="company" placeholder="Company name" /></div><div><label htmlFor="email">Email address</label><input id="email" name="email" type="email" placeholder="you@company.com" required /></div><div><label htmlFor="phone">Phone number</label><input id="phone" name="phone" placeholder="+00 000 000 0000" /></div><div className="full"><label htmlFor="interest">I am interested in</label><input id="interest" name="interest" placeholder="Products, sourcing, technical support..." /></div><div className="full"><label htmlFor="message">How can we help?</label><textarea id="message" name="message" placeholder="Tell us about your requirement" required /></div><button className="button blue" type="submit" disabled={sending}>{sending ? "Sending…" : "Send enquiry ↗"}</button>{status && <p className="full" role="status">{status}</p>}</form></div></div></section></Layout>;
}
