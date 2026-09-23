"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Arrow = () => <span className="arrow" aria-hidden="true">↗</span>;

const links = [["About", "/about"], ["Products", "/products"], ["Industries", "/industries"], ["Services", "/services"], ["Quality", "/quality"], ["Partners", "/partners"], ["Resources", "/resources"]];

export function Header() {
  const pathname = usePathname();
  return <>
    <div className="topline"><span>Industrial chemical supply across the GCC</span><Link href="/contact">Talk to our team <Arrow /></Link></div>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="NexaChem home"><span className="brand-mark">N</span><span className="brand-word">NEXA<span>CHEM</span><small>INDUSTRIAL SOLUTIONS</small></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <Link className={pathname === href ? "active" : ""} key={href} href={href}>{label}</Link>)}</nav>
      <Link className="nav-cta" href="/contact">Request a quote <Arrow /></Link>
      <details className="mobile-menu"><summary aria-label="Open navigation"><span></span><span></span></summary><nav aria-label="Mobile navigation">{links.map(([label, href]) => <Link className={pathname === href ? "active" : ""} key={href} href={href}>{label}</Link>)}<Link href="/contact">Request a quote</Link></nav></details>
    </header>
  </>;
}

export function Footer() {
  return <>
    <section className="quote"><div className="quote-inner"><div><p className="eyebrow light">Start a conversation</p><h2>Build a more dependable supply chain.</h2></div><Link className="button light-button" href="/contact">Discuss your requirement <Arrow /></Link></div></section>
    <footer className="site-footer"><div className="footer-top">
      <div className="footer-brand"><Link className="brand" href="/"><span className="brand-mark">N</span><span className="brand-word">NEXA<span>CHEM</span><small>INDUSTRIAL SOLUTIONS</small></span></Link><p className="footer-tagline">Chemical supply and logistics for the industries shaping the region.</p><span className="footer-region">UAE · GCC · MIDDLE EAST</span></div>
      <div className="footer-links"><h3>Company</h3><Link href="/about">Corporate profile</Link><Link href="/industries">Industries</Link><Link href="/partners">Partners</Link><Link href="/contact">Contact</Link></div>
      <div className="footer-links"><h3>Capabilities</h3><Link href="/products">Product catalogue</Link><Link href="/services">Supply & logistics</Link><Link href="/quality">Quality & safety</Link><Link href="/resources">Resources</Link></div>
      <div className="footer-links"><h3>Get in touch</h3><a href="mailto:info@nexachemco.com">info@nexachemco.com</a><Link href="/contact">Send an enquiry <Arrow /></Link></div>
    </div><div className="footer-bottom"><span>© 2026 NexaChem Industrial Solutions Co.</span><span>Dependable supply. Regional impact.</span></div></footer>
  </>;
}

export function PageHero({ eyebrow, title, text, actions }) {
  return <section className="page-hero"><div className="hero-dots"></div><div className="hero-inner"><div className="hero-copy"><p className="eyebrow light">{eyebrow}</p><h1>{title}</h1>{text && <p className="hero-description">{text}</p>}{actions && <div className="hero-actions">{actions}</div>}</div><div className="hero-visual" aria-hidden="true"><div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div><div className="hero-orbit orbit-three"></div><div className="hero-core">N<span>CHEM</span></div><span className="hero-node node-one">UAE</span><span className="hero-node node-two">GCC</span><span className="hero-node node-three">SUPPLY</span><div className="hero-caption"><span>01 / 03</span><span>Connecting essential industries</span></div></div></div><div className="hero-bottomline"><span>CHEMICAL TRADING</span><i></i><span>DISTRIBUTION</span><i></i><span>LOGISTICS</span></div></section>;
}

export function Layout({ children }) { return <><Header /><main>{children}</main><Footer /></>; }
