"use client";
import { useState } from "react";
import { config } from "@/lib/config";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="section section-dark" id="faq">
      <div className="container container-narrow">
        <div className="section-head mb-reveal">
          <h2 className="section-title">Lo que suelen preguntarme</h2>
        </div>
        <div className="faq-list mb-reveal">
          {config.faqs.map((f, i) => (
            <div key={i} className={"faq-item" + (open === i ? " open" : "")}>
              <button className="faq-q" type="button" onClick={() => setOpen(open === i ? null : i)}>
                <span>{f.q}</span><span className="faq-icon" aria-hidden="true" />
              </button>
              <div className="faq-a"><div className="faq-a-inner">{f.a}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
