import Link from "next/link";
import { Arrow, ContactTrigger, Layout } from "../components/site-shell";
import { products } from "./catalogue";

const categories = [...new Set(products.map((product) => product.category))];

export default function Products() {
  return <Layout>
    <section className="section catalogue-section">
      <div className="section-inner">
        <p className="eyebrow">Product catalogue</p>
        <p className="section-lead">Browse by category. Each profile includes key identification, grade, form, packaging, applications, and handling information where available. Contact us to confirm current specifications and availability.</p>
        <nav className="catalogue-nav" aria-label="Product categories">{categories.map((category, index) => <a key={category} href={`#category-${index}`}>{category}</a>)}</nav>
        {categories.map((category, index) => {
          const group = products.filter((product) => product.category === category);
          return <section className="catalogue-category" id={`category-${index}`} key={category}>
            <div className="catalogue-heading"><span>{String(index + 1).padStart(2, "0")}</span><h3>{category}</h3><small>{group.length} {group.length === 1 ? "product" : "products"}</small></div>
            <div className="catalogue-grid">{group.map((product) => <article className="catalogue-card" key={product.id}>
              <div className="catalogue-card-top"><div><p className="catalogue-kicker">{product.chemicalName}</p><h4>{product.name}</h4></div>{product.featured && <span className="catalogue-featured">Featured</span>}</div>
              <p className="catalogue-description">{product.description}</p>
              <dl className="catalogue-specs">
                <div><dt>CAS</dt><dd>{product.cas}</dd></div>
                <div><dt>Formula</dt><dd>{product.formula}</dd></div>
                <div><dt>Grade</dt><dd>{product.grade}</dd></div>
                <div><dt>Purity / strength</dt><dd>{product.purity}</dd></div>
                <div><dt>Form</dt><dd>{product.form}</dd></div>
                <div><dt>Packaging</dt><dd>{product.packaging}</dd></div>
              </dl>
              <div className="catalogue-detail"><h5>Applications</h5><p>{product.applications.join(" · ")}</p></div>
              <div className="catalogue-detail"><h5>Industries</h5><p>{product.industries.join(" · ")}</p></div>
              <div className="catalogue-footer"><span>{product.hazards} {product.unNumber !== "N/A" ? `· ${product.unNumber}` : ""}</span><ContactTrigger className="product-enquiry-trigger" product={product.name}>Enquire <Arrow /></ContactTrigger></div>
            </article>)}</div>
          </section>;
        })}
        <div className="catalogue-note"><div><p className="eyebrow light">Need a specification or safety document?</p><h2>Our team can help with product enquiries.</h2><p>Ask us about current availability, technical data sheets, safety data sheets, grades, and packaging options.</p></div><ContactTrigger className="button primary">Talk to our team <Arrow /></ContactTrigger></div>
      </div>
    </section>
  </Layout>;
}
