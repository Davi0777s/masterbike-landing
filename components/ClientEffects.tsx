"use client";
import { useEffect } from "react";
import { config } from "@/lib/config";

export default function ClientEffects() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-reveal");

    // ---- Índice para cascadas escalonadas (--si en cada hijo) ----
    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((c) => {
      Array.from(c.children).forEach((ch, i) => (ch as HTMLElement).style.setProperty("--si", String(i)));
    });

    // ---- Revelado al scroll ----
    // El hero lo anima GSAP (SmoothMotion); aquí revelamos el resto.
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>(".mb-reveal")).filter((el) => !el.closest(".hero-cine"));
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io!.unobserve(e.target); } }),
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach((el) => io!.observe(el));
    } else revealEls.forEach((el) => el.classList.add("in"));

    // ---- Contadores animados (stats band) ----
    const band = document.querySelector(".stats-band");
    if (band && "IntersectionObserver" in window) {
      const io2 = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          io2.disconnect();
          band.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
            const raw = el.getAttribute("data-count") || "";
            const target = parseInt(raw.replace(/\D/g, ""), 10);
            if (!target) return;
            const suffix = /\+/.test(raw) ? "+" : "";
            const dur = 1100, t0 = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - t0) / dur);
              el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          });
        });
      }, { threshold: 0.4 });
      io2.observe(band);
    }

    // ---- Barra de progreso + parallax + sombra header ----
    const bar = document.querySelector<HTMLElement>(".scroll-progress");
    const header = document.querySelector<HTMLElement>(".site-header");
    // El parallax del hero lo maneja GSAP ScrollTrigger (SmoothMotion).
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const st = window.scrollY || 0;
        const h = document.documentElement.scrollHeight - window.innerHeight || 1;
        if (bar) bar.style.width = Math.min(100, Math.max(0, (st / h) * 100)) + "%";
        if (header) header.classList.toggle("scrolled", st > 8);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ---- Menú móvil ----
    const toggle = document.querySelector<HTMLElement>(".nav-toggle");
    const menu = document.querySelector<HTMLElement>(".mobile-menu");
    const onToggle = () => { if (menu) { const open = menu.classList.toggle("open"); menu.hidden = !open; toggle?.setAttribute("aria-expanded", String(open)); } };
    toggle?.addEventListener("click", onToggle);
    const closeMenu = () => { menu?.classList.remove("open"); if (menu) menu.hidden = true; };
    menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

    // ---- Medición (pixels) ----
    const T = config.tracking;
    if (T.ga4 && !(window as any).__ga) {
      (window as any).__ga = 1;
      const g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + T.ga4; document.head.appendChild(g);
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function () { (window as any).dataLayer.push(arguments); };
      (window as any).gtag("js", new Date()); (window as any).gtag("config", T.ga4);
    }
    if (T.metaPixel && !(window as any).fbq) {
      (function (f: any, b: any, e: string, v: string) { let n: any, t: any, s: any; if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = true; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      (window as any).fbq("init", T.metaPixel); (window as any).fbq("track", "PageView");
    }
    if (T.clarity && !(window as any).clarity) {
      (function (c: any, l: any, a: string, r: string, i: string) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); }; const t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i; const y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(window, document, "clarity", "script", T.clarity);
    }
    const track = (name: string) => {
      const g = (window as any).gtag, fb = (window as any).fbq;
      if (g) g("event", { lead: "generate_lead", whatsapp: "whatsapp_click", agendar_open: "open_form" }[name] || name);
      if (fb) { const m: any = { lead: "Lead", whatsapp: "Contact", agendar_open: "InitiateCheckout" }; m[name] ? fb("track", m[name]) : fb("trackCustom", name); }
    };
    (window as any).mbTrack = track;
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest(".js-whatsapp")) track("whatsapp");
      else if (el.closest(".js-agendar")) track("agendar_open");
    };
    document.addEventListener("click", onClick);

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      toggle?.removeEventListener("click", onToggle);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
