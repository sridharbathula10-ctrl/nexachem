"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { ContactForm } from "./contact-form";

const ContactModalContext = createContext(null);

function ContactModal({ onClose, product }) {
  useEffect(() => {
    const handleKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return <div className="contact-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
      <button className="contact-modal-close" type="button" onClick={onClose} aria-label="Close contact form">×</button>
      <p className="eyebrow">NexaChemCo</p><h2 id="contact-modal-title">Contact us</h2>
      <p className="contact-modal-intro">Tell us what you need. Our team will get back to you.</p>
      <ContactForm autoFocus product={product} />
    </section>
  </div>;
}

export function ContactTrigger({ className, children, product, ...props }) {
  const openContact = useContext(ContactModalContext);
  return <button className={className} type="button" onClick={() => openContact(product)} {...props}>{children}</button>;
}

export const Arrow = () => <span className="arrow" aria-hidden="true">↗</span>;

const links = [["About", "/about"], ["Products", "/products"], ["Industries", "/industries"], ["Services", "/services"], ["Quality", "/quality"], ["Partners", "/partners"], ["Resources", "/resources"]];

export function Header() {
  const pathname = usePathname();
  return <>
    <div className="topline"><span>Industrial chemical supply across the GCC</span><ContactTrigger className="topline-contact-trigger">Talk to our team <Arrow /></ContactTrigger></div>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="NexaChem home"><Image className="brand-logo" src="/images/nexachem-header-logo-transparent.png" width={1921} height={819} alt="NexaChem" priority unoptimized /></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <Link className={pathname === href ? "active" : ""} key={href} href={href}>{label}</Link>)}</nav>
      <ContactTrigger className="nav-cta">Request a quote <Arrow /></ContactTrigger>
      <details className="mobile-menu"><summary aria-label="Open navigation"><span></span><span></span></summary><nav aria-label="Mobile navigation">{links.map(([label, href]) => <Link className={pathname === href ? "active" : ""} key={href} href={href}>{label}</Link>)}<ContactTrigger className="mobile-contact-trigger">Request a quote</ContactTrigger></nav></details>
    </header>
  </>;
}

export function Footer() {
  const pathname = usePathname();
  return <>
    {pathname !== "/" && <section className="quote"><div className="quote-inner"><div><p className="eyebrow light">Start a conversation</p><h2>Build a more dependable supply chain.</h2></div><ContactTrigger className="button light-button">Discuss your requirement <Arrow /></ContactTrigger></div></section>}
    <footer className="site-footer"><div className="footer-top">
      <div className="footer-brand"><Link className="footer-image-logo" href="/" aria-label="NexaChem home"><Image className="footer-logo-image" src="/images/nexachem-footer-logo.png" width={1672} height={941} alt="NexaChem Company — Reliable Chemicals, Trusted Solutions" unoptimized /></Link><p className="footer-tagline">Chemical supply and logistics for the industries shaping the region.</p><span className="footer-region">UAE · GCC · MIDDLE EAST</span></div>
      <div className="footer-links"><h3>Company</h3><Link href="/about">Corporate profile</Link><Link href="/industries">Industries</Link><Link href="/partners">Partners</Link><Link href="/contact">Contact</Link></div>
      <div className="footer-links"><h3>Capabilities</h3><Link href="/products">Product catalogue</Link><Link href="/services">Supply & logistics</Link><Link href="/quality">Quality & safety</Link><Link href="/resources">Resources</Link></div>
      <div className="footer-links"><h3>Get in touch</h3><a href="mailto:info@nexachemco.com">info@nexachemco.com</a><ContactTrigger className="footer-enquiry-trigger">Send an enquiry <Arrow /></ContactTrigger></div>
    </div><div className="footer-bottom"><span>© 2026 NexaChem Industrial Solutions Co.</span><span>Dependable supply. Regional impact.</span></div></footer>
  </>;
}

export function PageHero({ eyebrow, title, text, actions, showVisual = true, className = "" }) {
  const pathname = usePathname();
  if (pathname !== "/" && pathname !== "/about") {
    return <section className={`page-intro ${className}`}><div className="section-inner"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{text && <p className="page-intro-description">{text}</p>}{actions && <div className="page-intro-actions">{actions}</div>}</div></section>;
  }
  return <section className={`page-hero${showVisual ? "" : " page-hero-no-visual"}`}><div className="hero-dots"></div><div className="hero-inner"><div className="hero-copy"><p className="eyebrow light">{eyebrow}</p><h1>{title}</h1>{text && <p className="hero-description">{text}</p>}{actions && <div className="hero-actions">{actions}</div>}</div>{showVisual && <div className="hero-visual" aria-hidden="true"><div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div><div className="hero-orbit orbit-three"></div><div className="hero-core">N<span>CHEM</span></div><span className="hero-node node-one">UAE</span><span className="hero-node node-two">GCC</span><span className="hero-node node-three">SUPPLY</span><div className="hero-caption"><span>01 / 03</span><span>Connecting essential industries</span></div></div>}</div><div className="hero-bottomline"><span>CHEMICAL TRADING</span><i></i><span>DISTRIBUTION</span><i></i><span>LOGISTICS</span></div></section>;
}

export function Layout({ children }) {
  const [contactProduct, setContactProduct] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = (product = "") => { setContactProduct(product || ""); setContactOpen(true); };
  const closeContact = () => setContactOpen(false);
  return <ContactModalContext.Provider value={openContact}><Header /><main>{children}</main><Footer />{contactOpen && <ContactModal onClose={closeContact} product={contactProduct} />}</ContactModalContext.Provider>;
}
