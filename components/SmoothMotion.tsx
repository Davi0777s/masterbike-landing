"use client";
import { useEffect } from "react";

export default function SmoothMotion() {
  useEffect(() => {
    const root = document.documentElement;
    // Marca GSAP activo de inmediato: si el import async fallara, el CSS deja el hero visible igual.
    root.classList.add("gsap-hero");
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const finePointer = window.matchMedia?.("(pointer: fine)").matches ?? false;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    let lenis: any = null;
    let tickerFn: ((t: number) => void) | null = null;
    const listeners: Array<() => void> = [];
    let cancelled = false;

    // Red de seguridad: si el motor no arranca, el hero se muestra igual.
    const safety = window.setTimeout(() => root.classList.add("motion-fallback"), 3500);

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }, { default: SplitType }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("split-type"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // ---- Scroll suave (Lenis) sincronizado con GSAP ----
      if (!reduce) {
        lenis = new Lenis({
          duration: 1.1,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 1,
        });
        (window as any).__lenis = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        tickerFn = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);
        root.classList.add("lenis-on");

        // Marquesina reactiva a la velocidad de scroll (skew sutil)
        lenis.on("scroll", (e: any) => {
          const v = e?.velocity ?? 0;
          const sk = gsap.utils.clamp(-6, 6, v * 0.35);
          gsap.to(".ticker-track, .brands-track", { skewX: sk, duration: 0.35, overwrite: true });
        });
      }

      // ---- Parallax del fondo del hero (scrub, sustituye al de ClientEffects) ----
      const heroBg = document.querySelector<HTMLElement>(".hero-bg");
      if (heroBg && !reduce) {
        gsap.fromTo(
          heroBg,
          { yPercent: -6, scale: 1.16 },
          { yPercent: 8, scale: 1.16, ease: "none",
            scrollTrigger: { trigger: ".hero-cine", start: "top top", end: "bottom top", scrub: true } }
        );
      }

      // ---- Hero cinético: revelado por palabras con máscara ----
      const heroTitle = document.querySelector<HTMLElement>(".hero-title");
      const seen = sessionStorage.getItem("mb_preloaded");
      const introDelay = reduce ? 0 : seen ? 0.25 : 1.9;

      if (heroTitle && !reduce) {
        const words: HTMLElement[] = [];
        heroTitle.querySelectorAll<HTMLElement>(".hl").forEach((line) => {
          // Guarda contra doble-split (React StrictMode ejecuta el efecto 2x en dev)
          if (!line.querySelector(".word")) new SplitType(line, { types: "words", tagName: "span" });
          words.push(...Array.from(line.querySelectorAll<HTMLElement>(".word")));
        });
        // El contenedor estaba oculto (CSS) para evitar parpadeo; lo mostramos ya que las
        // palabras arrancan ocultas por el fromTo (immediateRender).
        gsap.set(heroTitle, { opacity: 1 });
        // fromTo fija el estado inicial de inmediato (sin parpadeo) y revela a valor explícito.
        const tl = gsap.timeline({
          delay: introDelay,
          defaults: { ease: "power4.out" },
          onComplete: () => gsap.set(words, { clearProps: "transform,willChange" }),
        });
        tl.fromTo(words, { yPercent: 118, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.045 }, 0)
          .fromTo(".hero-cine .hero-sub", { y: 26, opacity: 0, filter: "blur(6px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75 }, 0.4)
          .fromTo(".hero-cine .hero-actions", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.55)
          .fromTo(".hero-cine .hero-spec", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, 0.68);
      } else if (heroTitle) {
        root.classList.add("motion-fallback"); // reduce-motion: hero visible sin animación
      }

      // ---- Botones magnéticos (solo puntero fino) ----
      if (!reduce && finePointer) {
        document.querySelectorAll<HTMLElement>(".btn-lg").forEach((btn) => {
          const strength = 0.32;
          const onMove = (ev: PointerEvent) => {
            const r = btn.getBoundingClientRect();
            const x = ev.clientX - (r.left + r.width / 2);
            const y = ev.clientY - (r.top + r.height / 2);
            gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.4, ease: "power3.out" });
          };
          const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
          btn.addEventListener("pointermove", onMove);
          btn.addEventListener("pointerleave", onLeave);
          listeners.push(() => { btn.removeEventListener("pointermove", onMove); btn.removeEventListener("pointerleave", onLeave); });
        });
      }

      ScrollTrigger.refresh();
      window.clearTimeout(safety);
    })().catch(() => {
      window.clearTimeout(safety);
      root.classList.add("motion-fallback");
    });

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      listeners.forEach((off) => off());
      if (tickerFn) {
        import("gsap").then(({ gsap }) => gsap.ticker.remove(tickerFn!)).catch(() => {});
      }
      lenis?.destroy();
      root.classList.remove("lenis-on");
    };
  }, []);

  return null;
}
