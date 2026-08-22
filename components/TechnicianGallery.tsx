"use client";

import { useEffect, useState } from "react";

const photos = [
  { src: "/tech-bike-closeup.webp", alt: "Técnico ajustando una bicicleta de spinning", label: "Ajuste de precisión" },
  { src: "/tech-spray-paint.webp", alt: "Técnico pintando la estructura de una máquina", label: "Restauración" },
  { src: "/tech-cleaner.webp", alt: "Técnico limpiando una máquina de gimnasio", label: "Limpieza técnica" },
  { src: "/tech-spin-bike.jpg", alt: "Técnico trabajando en una bicicleta de spinning", label: "Diagnóstico" },
  { src: "/tech-gym-service.jpg", alt: "Técnico dando mantenimiento a un equipo de gimnasio", label: "Mantenimiento" },
];

export default function TechnicianGallery() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % photos.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="tech-gallery-showcase">
      <div className="tech-gallery-main">
        {photos.map((photo, index) => (
          <figure className={"tech-feature " + (index === active ? "is-active" : "")} key={photo.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.alt} />
            <figcaption><span>0{index + 1}</span>{photo.label}</figcaption>
          </figure>
        ))}
        <div className="tech-gallery-progress" aria-hidden="true"><span style={{ width: `${((active + 1) / photos.length) * 100}%` }} /></div>
      </div>
      <div className="tech-gallery-thumbs" role="tablist" aria-label="Fotos del trabajo técnico">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`Ver foto: ${photo.label}`}
            className={index === active ? "is-active" : ""}
            onClick={() => setActive(index)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt="" />
            <span>0{index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
