"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("mb_preloaded");
    if (seen || reduce) {
      html.classList.add("preloaded");
      setHidden(true);
      return;
    }
    document.body.style.overflow = "hidden"; // evita scroll durante la intro
    const t1 = window.setTimeout(() => setLeaving(true), 1500);
    const t2 = window.setTimeout(() => {
      html.classList.add("preloaded");
      document.body.style.overflow = "";
      sessionStorage.setItem("mb_preloaded", "1");
      setHidden(true);
    }, 2250);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  return (
    <div className={"preloader" + (leaving ? " is-leaving" : "")} aria-hidden="true">
      <div className="pl-inner">
        <div className="pl-brand">
          <span className="pl-word">MÁSTER</span>
          <span className="pl-word pl-accent">BIKE</span>
          <span className="pl-scan" />
        </div>
        <div className="pl-status">
          <span className="pl-dot" /> Diagnóstico en curso
        </div>
        <div className="pl-bar"><span /></div>
      </div>
    </div>
  );
}
