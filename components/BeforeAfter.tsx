"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { config as c } from "@/lib/config";

type Item = (typeof c.transformaciones)[number];

function Frame({ item }: { item: Item }) {
  return (
    <figure
      className={"ba-frame mb-reveal" + (item.featured ? " ba-featured" : "")}
      data-id={item.id}
      style={{ "--ratio": item.ratio } as CSSProperties}
    >
      <div className="ba-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ba-img ba-before" src={item.antes} alt={`${item.titulo} — antes del servicio`} loading="lazy" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ba-img ba-after" src={item.despues} alt={`${item.titulo} — después del servicio`} loading="lazy" />
        <span className="ba-scan" aria-hidden="true" />
        <span className="ba-labelbar" aria-hidden="true" />
        <span className="ba-label ba-label-antes">Antes</span>
        <span className="ba-label ba-label-despues">Después</span>
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
    if (reduce || !("IntersectionObserver" in window)) return; // CSS deja ver el "después"

    // El bucle sólo corre mientras la tarjeta está en pantalla; al salir se pausa
    // (retoma su fase al volver). Así el cambio es 100% automático, sin botón.
    // Observamos la SECCIÓN completa y activamos las 3 tarjetas a la vez → barrido sincronizado.
    const io = new IntersectionObserver(
      (entries) => {
        const inview = entries.some((e) => e.isIntersecting);
        frames.forEach((f) => f.classList.toggle("is-inview", inview));
      },
      { threshold: 0.2 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const featured = c.transformaciones.find((t) => t.featured);
  const rest = c.transformaciones.filter((t) => !t.featured);

  return (
    <section className="section section-dark" id="transformaciones">
      <div className="container" ref={rootRef}>
        <div className="section-head before-after-head mb-reveal">
          <p className="section-index before-after-kicker"><span>Devuelve la vida</span><span>a tu máquina</span></p>
          <h2 className="section-title">El antes y el después</h2>
          <p className="section-lead">Trabajos reales en Ibagué. La animación va sola, despacio, para que aprecies el detalle: del antes al después.</p>
        </div>
        <div className="ba-grid">
          {featured && <Frame item={featured} />}
          {rest.map((it) => (
            <Frame key={it.id} item={it} />
          ))}
        </div>
      </div>
    </section>
  );
}
