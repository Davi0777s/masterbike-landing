"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { config as c } from "@/lib/config";

const replayIco = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <path d="M21 3v6h-6" />
  </svg>
);

type Item = (typeof c.transformaciones)[number];

function Frame({ item, index, onReplay }: { item: Item; index: number; onReplay: (id: string) => void }) {
  return (
    <figure
      className={"ba-frame mb-reveal" + (item.featured ? " ba-featured" : "")}
      data-id={item.id}
      data-delay={item.featured ? 0 : 140 * index}
      style={{ "--ratio": item.ratio } as CSSProperties}
    >
      <div className="ba-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ba-img ba-before" src={item.antes} alt={`${item.titulo} — antes del servicio`} loading="lazy" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ba-img ba-after" src={item.despues} alt={`${item.titulo} — después del servicio`} loading="lazy" />
        <span className="ba-scan" aria-hidden="true" />
        <span className="ba-label ba-label-antes">Antes</span>
        <span className="ba-label ba-label-despues">Después</span>
        <button className="ba-replay" type="button" onClick={() => onReplay(item.id)} aria-label={`Repetir animación de ${item.titulo}`}>
          {replayIco}
        </button>
      </div>
      <figcaption className="ba-cap">
        <h3>{item.titulo}</h3>
        <p>{item.desc}</p>
      </figcaption>
    </figure>
  );
}

export default function BeforeAfter() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const frames = Array.from(root.querySelectorAll<HTMLElement>(".ba-frame"));
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      frames.forEach((f) => f.classList.add("is-revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const delay = Number(el.dataset.delay || 0);
          window.setTimeout(() => el.classList.add("is-revealed"), delay);
          io.unobserve(el);
        });
      },
      { threshold: 0.45 }
    );
    frames.forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, []);

  const onReplay = (id: string) => {
    const f = rootRef.current?.querySelector<HTMLElement>(`.ba-frame[data-id="${id}"]`);
    if (!f) return;
    f.classList.remove("is-revealed");
    void f.offsetWidth; // fuerza reflow para reiniciar la animación
    requestAnimationFrame(() => f.classList.add("is-revealed"));
  };

  const featured = c.transformaciones.find((t) => t.featured);
  const rest = c.transformaciones.filter((t) => !t.featured);

  return (
    <section className="section section-dark" id="transformaciones">
      <div className="container" ref={rootRef}>
        <div className="section-head mb-reveal">
          <h2 className="section-title">El antes y el después</h2>
          <p className="section-lead">Trabajos reales en Ibagué. Espera un segundo sobre cada foto y mira cómo queda tu máquina.</p>
        </div>
        {featured && <Frame item={featured} index={0} onReplay={onReplay} />}
        <div className="ba-grid">
          {rest.map((it, i) => (
            <Frame key={it.id} item={it} index={i + 1} onReplay={onReplay} />
          ))}
        </div>
      </div>
    </section>
  );
}
