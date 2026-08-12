/* =====================================================================
   MASTER BIKE — LÓGICA DE LA LANDING
   Lee la configuración de config.js (window.MASTERBIKE) e inyecta el
   contenido, maneja el modal de agenda, el preview vivo de la "orden de
   servicio" y arma el mensaje de WhatsApp.
   ===================================================================== */
(function () {
  "use strict";

  const CFG = window.MASTERBIKE || {};
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* --------------------- Iconos SVG por tipo de máquina --------------------- */
  const ICONS = {
    eliptica:   '<svg viewBox="0 0 24 24" class="ico"><ellipse cx="12" cy="12" rx="9" ry="5"/><path d="M5 15l4-8m10 8-4-8"/><circle cx="9" cy="7" r="1.4"/><circle cx="15" cy="17" r="1.4"/></svg>',
    caminadora: '<svg viewBox="0 0 24 24" class="ico"><path d="M3 18h12l3-9M3 18l1-3h10"/><path d="M18 9l3-4"/><circle cx="6" cy="20" r="1.4"/><circle cx="15" cy="20" r="1.4"/></svg>',
    bici:       '<svg viewBox="0 0 24 24" class="ico"><circle cx="6" cy="17" r="3.2"/><circle cx="18" cy="17" r="3.2"/><path d="M6 17l4-8h5l-3 8M9 9h4"/></svg>',
    remo:       '<svg viewBox="0 0 24 24" class="ico"><path d="M4 14l6-2 8 4M4 14l2 4m12-2 2 2M9 12l2-6 4 1"/></svg>',
    otra:       '<svg viewBox="0 0 24 24" class="ico"><path d="M12 3v4m0 10v4M3 12h4m10 0h4"/><circle cx="12" cy="12" r="3.2"/></svg>',
  };
  const iconFor = (key) => ICONS[key] || ICONS.otra;

  /* Redes sociales (svg) */
  const SOCIAL_SVG = {
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.27.07 1.65.07 4.87s0 3.6-.07 4.87c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.27.06-1.65.07-4.87.07s-3.6 0-4.87-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.42-.37-1.06-.42-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.87c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.05A6.75 6.75 0 1 0 18.75 12 6.75 6.75 0 0 0 12 5.25zm0 11.13A4.38 4.38 0 1 1 16.38 12 4.38 4.38 0 0 1 12 16.38zm6.9-11.4a1.58 1.58 0 1 1-1.58-1.58 1.58 1.58 0 0 1 1.58 1.58z"/></svg>',
    facebook:  '<svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>',
    tiktok:    '<svg viewBox="0 0 24 24"><path d="M16.6 5.8a4.3 4.3 0 0 1-1-2.8h-3v12.3a2.5 2.5 0 1 1-2.5-2.5c.26 0 .5.04.74.11V9.8a5.6 5.6 0 0 0-.74-.05 5.55 5.55 0 1 0 5.55 5.55V9.02a7.2 7.2 0 0 0 4.2 1.34V7.3a4.3 4.3 0 0 1-3.25-1.5z"/></svg>',
  };

  /* ============================ INYECCIÓN DE CONTENIDO ============================ */

  // Datos del técnico + textos globales
  function fillGlobals() {
    const t = CFG.tecnico || {};
    $$("[data-cobertura]").forEach(el => el.textContent = CFG.cobertura || "tu zona");
    $$("[data-cobertura-base]").forEach(el => el.textContent = CFG.coberturaBase || "tu ciudad");
    if (CFG.email) $$("[data-email]").forEach(el => { el.href = "mailto:" + CFG.email; el.textContent = CFG.email; });
    $$("[data-tecnico-nombre]").forEach(el => el.textContent = t.nombre || "Master Bike");
    $$("[data-tecnico-cargo]").forEach(el => el.textContent = t.cargo || "");
    const setText = (sel, val) => { const el = $(sel); if (el && val != null) el.textContent = val; };
    const setAll = (sel, val) => { if (val != null) $$(sel).forEach(el => el.textContent = val); };
    setText("[data-tecnico-frase]", t.frase);
    setAll("[data-tecnico-anios]", t.aniosExperiencia);
    setAll("[data-tecnico-maquinas]", (t.maquinasAtendidas ? t.maquinasAtendidas + "+" : ""));
    setAll("[data-tecnico-zona]", CFG.cobertura);
    // El H2 solo toma tu nombre cuando ya lo configuraste (no el placeholder)
    const title = $("[data-tecnico-nombre-title]");
    const nombreListo = t.nombre && !/^tu nombre$/i.test(t.nombre.trim());
    if (title && nombreListo) title.textContent = t.nombre;
    const y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear();
  }

  // Tarjetas de servicios
  function renderServicios() {
    const wrap = $("[data-services]");
    if (!wrap) return;
    const bullet = '<svg viewBox="0 0 24 24" class="ico"><path d="M20 6 9 17l-5-5"/></svg>';
    wrap.innerHTML = (CFG.servicios || []).map((s, i) => `
      <article class="service-card mb-reveal ${["", "d1", "d2", "d3"][i % 4]} ${s.destacado ? "is-featured" : ""}">
        ${s.destacado ? '<span class="service-tag">Más pedido</span>' : ""}
        <span class="service-num">SVC-${String(i + 1).padStart(2, "0")}</span>
        <h3>${s.titulo}</h3>
        <p>${s.desc}</p>
        ${(s.incluye && s.incluye.length) ? `
        <ul class="service-includes">
          ${s.incluye.map(it => `<li>${bullet}<span>${it}</span></li>`).join("")}
        </ul>` : ""}
        <p class="service-quote">
          <svg viewBox="0 0 24 24" class="ico"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Cotización personalizada por WhatsApp
        </p>
        <button class="btn btn-primary btn-sm js-agendar" data-source="servicio" data-servicio="${s.id}">Agendar</button>
      </article>`).join("");
  }

  // Máquinas cubiertas
  function renderMaquinas() {
    const wrap = $("[data-machines]");
    if (!wrap) return;
    wrap.innerHTML = (CFG.maquinas || []).map(m =>
      `<li><span class="mch-ico">${iconFor(m.icon)}</span><span>${m.label}</span></li>`).join("");
  }

  // Iconos de la sección "Por qué Master Bike"
  const DIF_ICONS = {
    user:   '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    home:   '<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>',
    wallet: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="17" cy="14" r="1.3"/></svg>',
    tag:    '<svg viewBox="0 0 24 24"><path d="M20.5 13.5 13 21l-9-9V4h8z"/><circle cx="8.5" cy="8.5" r="1.4"/></svg>',
    doc:    '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  };
  function renderDiferenciadores() {
    const wrap = $("[data-diferenciadores]");
    if (!wrap) return;
    wrap.innerHTML = (CFG.diferenciadores || []).map((d, i) => `
      <article class="dif-card mb-reveal ${["", "d1", "d2"][i % 3]}">
        <span class="dif-ico">${DIF_ICONS[d.icon] || DIF_ICONS.shield}</span>
        <h3>${d.titulo}</h3>
        <p>${d.desc}</p>
      </article>`).join("");
  }

  // Marcas que atiende (carrusel tipo "aliados")
  function renderMarcas() {
    const track = $("[data-marcas]");
    if (!track) return;
    const marcas = CFG.marcas || [];
    const one = marcas.map(m => `<span class="brand-item">${m}</span>`).join("");
    track.innerHTML = one + one;   // duplicado para bucle continuo
  }

  // Reseñas de clientes (prueba social)
  function renderTestimonios() {
    const wrap = $("[data-testimonios]");
    if (!wrap) return;
    const stars = (n) => "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
    wrap.innerHTML = (CFG.testimonios || []).map((t, i) => {
      const initials = (t.nombre || "?").split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
      const avatar = t.foto
        ? `<img class="review-avatar" src="${t.foto}" alt="${t.nombre}">`
        : `<span class="review-avatar review-initials">${initials}</span>`;
      return `
      <article class="review-card mb-reveal ${["", "d1", "d2"][i % 3]}">
        <div class="review-stars" aria-label="${t.rating} de 5">${stars(t.rating || 5)}</div>
        <p class="review-text">“${t.texto}”</p>
        <footer class="review-foot">
          ${avatar}
          <span><span class="review-name">${t.nombre}</span>
          <span class="review-meta">${t.maquina} · ${t.zona}</span></span>
        </footer>
      </article>`;
    }).join("");
  }

  // Contadores animados (años / máquinas) cuando la barra entra en viewport
  function animateStats() {
    const band = $(".stats-band");
    if (!band || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        io.disconnect();
        $$("[data-tecnico-anios], [data-tecnico-maquinas]", band).forEach(el => {
          const raw = el.textContent.trim();
          const target = parseInt(raw.replace(/\D/g, ""), 10);
          if (!target) return;
          const suffix = /\+/.test(raw) ? "+" : "";
          const dur = 1100, t0 = performance.now();
          const tick = (now) => {
            const p = Math.min(1, (now - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      });
    }, { threshold: 0.4 });
    io.observe(band);
  }

  // Municipios de cobertura (franja + footer)
  function renderMunicipios() {
    const base = CFG.coberturaBase || "";
    const muni = CFG.municipios || [];
    // Franja de cobertura: ciudad base destacada + alrededores
    const band = $(".coverage-chips[data-municipios]");
    if (band) {
      band.innerHTML =
        (base ? `<li class="is-base">${base}</li>` : "") +
        muni.map(m => `<li>${m}</li>`).join("");
    }
    // Footer: solo los alrededores
    const foot = $(".footer-zonas[data-municipios]");
    if (foot) {
      foot.innerHTML = muni.map(m => `<li>${m}</li>`).join("");
    }
  }

  // FAQ (acordeón)
  function renderFaqs() {
    const wrap = $("[data-faqs]");
    if (!wrap) return;
    wrap.innerHTML = (CFG.faqs || []).map(f => `
      <div class="faq-item mb-reveal">
        <button class="faq-q" type="button">
          <span>${f.q}</span><span class="faq-icon" aria-hidden="true"></span>
        </button>
        <div class="faq-a"><div class="faq-a-inner">${f.a}</div></div>
      </div>`).join("");

    $$(".faq-q", wrap).forEach(btn => {
      btn.addEventListener("click", () => {
        btn.closest(".faq-item").classList.toggle("open");   // la animación la maneja el CSS (grid-rows)
      });
    });
  }

  // Redes sociales
  function renderSocial() {
    const wrap = $("[data-social]");
    if (!wrap) return;
    const redes = CFG.redes || {};
    const html = Object.keys(SOCIAL_SVG)
      .filter(k => redes[k])
      .map(k => `<a href="${redes[k]}" target="_blank" rel="noopener" aria-label="${k}">${SOCIAL_SVG[k]}</a>`)
      .join("");
    wrap.innerHTML = html || `<p style="font-size:.85rem;color:var(--gris-500)">Pronto en redes.</p>`;
  }

  // Opciones del formulario (máquinas + servicios)
  function renderFormOptions() {
    const mWrap = $("[data-choice-maquina]");
    if (mWrap) {
      mWrap.innerHTML = (CFG.maquinas || []).map((m, i) => `
        <label class="choice">
          <input type="radio" name="maquina" value="${m.label}" ${i === 0 ? "" : ""}>
          ${iconFor(m.icon)} <span>${m.label}</span>
        </label>`).join("");
    }
    const sWrap = $("[data-choice-servicio]");
    if (sWrap) {
      sWrap.innerHTML = (CFG.servicios || []).map((s, i) => `
        <label class="choice">
          <input type="radio" name="servicio" value="${s.titulo}" data-id="${s.id}">
          <span><strong>${s.titulo}</strong><span class="choice-desc">${s.desc}</span></span>
        </label>`).join("");
    }
    // marcar visualmente la opción elegida
    $$(".choice input", $("#agendar-form")).forEach(input => {
      input.addEventListener("change", () => {
        const group = input.name;
        $$(`.choice input[name="${group}"]`).forEach(i => i.closest(".choice").classList.remove("checked"));
        input.closest(".choice").classList.add("checked");
        updatePreview();
      });
    });
  }

  /* ============================ MODAL DE AGENDA ============================ */
  const modal = $("#agendar-modal");
  const form  = $("#agendar-form");
  let lastFocus = null;

  function openModal(preset) {
    lastFocus = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // preselección de servicio si vino desde una tarjeta concreta
    if (preset && preset.servicio) {
      const input = $(`.choice input[data-id="${preset.servicio}"]`);
      if (input) { input.checked = true; input.dispatchEvent(new Event("change")); }
    }
    setTimeout(() => { const f = $(".choice input:checked", form) || $(".choice input", form); if (f) f.focus(); }, 60);
    updatePreview();
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  // número de orden pseudo-aleatorio estable por sesión
  const ORDER_NO = "OS-" + String(Math.floor(1000 + Math.random() * 9000));

  function fmtFecha(val) {
    if (!val) return "—";
    try {
      const d = new Date(val + "T00:00:00");
      return d.toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return val; }
  }

  function getData() {
    const fd = new FormData(form);
    return {
      maquina:  fd.get("maquina") || "",
      servicio: fd.get("servicio") || "",
      fecha:    fd.get("fecha") || "",
      hora:     fd.get("hora") || "",
      nombre:   (fd.get("nombre") || "").trim(),
      telefono: (fd.get("telefono") || "").trim(),
      notas:    (fd.get("notas") || "").trim(),
    };
  }

  // Preview vivo de la orden de servicio
  function updatePreview() {
    const d = getData();
    const set = (sel, val) => { const el = $(sel); if (el) el.textContent = val || "—"; };
    set("[data-live-no]", "N.º " + ORDER_NO);
    set("[data-live-maquina]", d.maquina);
    set("[data-live-servicio]", d.servicio);
    set("[data-live-fecha]", d.fecha ? fmtFecha(d.fecha) + (d.hora ? " · " + d.hora.split(" ")[0] : "") : "—");
    set("[data-live-nombre]", d.nombre);
  }
  if (form) form.addEventListener("input", updatePreview);

  // Construir mensaje y abrir WhatsApp
  function submitToWhatsApp(e) {
    e.preventDefault();
    const err = $("[data-form-error]");
    err.hidden = true;
    const d = getData();

    const faltan = [];
    if (!d.maquina)  faltan.push("tipo de máquina");
    if (!d.servicio) faltan.push("tipo de servicio");
    if (!d.fecha)    faltan.push("fecha");
    if (!d.hora)     faltan.push("franja horaria");
    if (!d.nombre)   faltan.push("tu nombre");
    if (!d.telefono) faltan.push("teléfono");
    if (faltan.length) {
      err.textContent = "Falta completar: " + faltan.join(", ") + ".";
      err.hidden = false;
      err.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const t = CFG.tecnico || {};
    const msg =
`*ORDEN DE SERVICIO — MASTER BIKE*
N.º ${ORDER_NO}
--------------------------------
🔧 Máquina: ${d.maquina}
🛠️ Servicio: ${d.servicio}
📅 Fecha: ${fmtFecha(d.fecha)} (${d.hora})
👤 Cliente: ${d.nombre}
📞 Teléfono: ${d.telefono}${d.notas ? `\n📝 Notas: ${d.notas}` : ""}
--------------------------------
Zona: ${CFG.cobertura || ""}
Enviado desde la web. ¡Quedo atento a la confirmación!`;

    const phone = (CFG.whatsapp || "").replace(/\D/g, "");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");

    // feedback breve
    const btn = $("button[type=submit]", form);
    const original = btn.innerHTML;
    btn.innerHTML = "✓ Abriendo WhatsApp…";
    setTimeout(() => { btn.innerHTML = original; }, 2500);
  }
  if (form) form.addEventListener("submit", submitToWhatsApp);

  /* Enlace directo de WhatsApp (botones "escribir") */
  function whatsappHref() {
    const phone = (CFG.whatsapp || "").replace(/\D/g, "");
    const msg = "Hola Master Bike 👋, quiero información sobre el mantenimiento de mi máquina de gimnasio.";
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  /* ============================ EVENTOS GLOBALES ============================ */
  function bindEvents() {
    // abrir modal (delegado, cubre botones inyectados)
    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest(".js-agendar");
      if (openBtn) {
        e.preventDefault();
        openModal({ servicio: openBtn.dataset.servicio });
        return;
      }
      if (e.target.closest(".js-close-modal")) { closeModal(); return; }
    });

    // enlaces de whatsapp
    $$(".js-whatsapp").forEach(a => { a.href = whatsappHref(); a.target = "_blank"; a.rel = "noopener"; });
    const wf = $(".wa-float"); if (wf) { wf.href = whatsappHref(); }

    // cerrar con ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });

    // menú móvil
    const toggle = $(".nav-toggle");
    const menu = $(".mobile-menu");
    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        const open = menu.classList.toggle("open");
        menu.hidden = !open;
        toggle.setAttribute("aria-expanded", open);
      });
      $$("a", menu).forEach(a => a.addEventListener("click", () => {
        menu.classList.remove("open"); menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      }));
    }

    // fecha mínima = hoy
    const fecha = $("#f-fecha");
    if (fecha) fecha.min = new Date().toISOString().split("T")[0];
  }

  /* Animaciones de aparición al hacer scroll (estilo Emil Kowalski: sutil, spring) */
  function initReveal() {
    const els = $$(".mb-reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => io.observe(el));
  }

  /* ================================ INIT ================================ */
  document.addEventListener("DOMContentLoaded", () => {
    fillGlobals();
    renderServicios();
    renderMaquinas();
    renderDiferenciadores();
    renderMarcas();
    renderTestimonios();
    renderMunicipios();
    renderFaqs();
    initReveal();
    animateStats();
    renderSocial();
    renderFormOptions();
    bindEvents();
  });
})();
