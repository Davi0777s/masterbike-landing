/* =====================================================================
   MASTER BIKE — Comportamiento (asset de tema Shopify)
   El CONTENIDO lo renderiza Liquid desde los settings de cada sección.
   Este archivo solo maneja interacción: modal de agenda, WhatsApp,
   acordeón de FAQ, preview vivo de la orden y animaciones de scroll.
   Es IDEMPOTENTE: aunque el tema lo incluya desde varias secciones,
   se inicializa una sola vez.
   ===================================================================== */
(function () {
  "use strict";
  if (window.MasterBikeInit) return;      // guarda anti doble-init
  window.MasterBikeInit = true;

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ------------------------- Config (inyectada por Liquid) ------------------------- */
  function getConfig() {
    const el = document.getElementById("mb-config");
    let cfg = { whatsapp: "", greeting: "Hola Master Bike, quiero información sobre el mantenimiento de mi máquina.", coverage: "" };
    if (el) { try { Object.assign(cfg, JSON.parse(el.textContent)); } catch (e) {} }
    cfg.phone = (cfg.whatsapp || "").replace(/\D/g, "");
    return cfg;
  }

  function waLink(text) {
    const cfg = getConfig();
    return `https://wa.me/${cfg.phone}?text=${encodeURIComponent(text)}`;
  }

  /* --------------------------------- Modal --------------------------------- */
  let lastFocus = null;
  function modalEl() { return $("#mb-agendar-modal"); }

  function openModal(servicioId) {
    const modal = modalEl(); if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (servicioId) {
      const input = $(`.choice input[data-id="${servicioId}"]`, modal);
      if (input) { input.checked = true; input.dispatchEvent(new Event("change", { bubbles: true })); }
    }
    setTimeout(() => {
      const f = $(".choice input:checked", modal) || $(".choice input", modal);
      if (f) f.focus();
    }, 60);
    updatePreview();
  }
  function closeModal() {
    const modal = modalEl(); if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  /* ---------------------------- Orden de servicio ---------------------------- */
  const ORDER_NO = "OS-" + String(Math.floor(1000 + Math.random() * 9000));

  function fmtFecha(val) {
    if (!val) return "—";
    try {
      const d = new Date(val + "T00:00:00");
      return d.toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return val; }
  }

  function getFormData() {
    const form = $("#mb-agendar-form"); if (!form) return {};
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

  function updatePreview() {
    const d = getFormData();
    const set = (sel, val) => { const el = $(sel); if (el) el.textContent = val || "—"; };
    set("[data-live-no]", "N.º " + ORDER_NO);
    set("[data-live-maquina]", d.maquina);
    set("[data-live-servicio]", d.servicio);
    set("[data-live-fecha]", d.fecha ? fmtFecha(d.fecha) + (d.hora ? " · " + d.hora.split(" ")[0] : "") : "—");
    set("[data-live-nombre]", d.nombre);
  }

  function submitToWhatsApp(e) {
    e.preventDefault();
    const err = $("[data-form-error]");
    if (err) err.hidden = true;
    const d = getFormData();
    const faltan = [];
    if (!d.maquina)  faltan.push("tipo de máquina");
    if (!d.servicio) faltan.push("tipo de servicio");
    if (!d.fecha)    faltan.push("fecha");
    if (!d.hora)     faltan.push("franja horaria");
    if (!d.nombre)   faltan.push("tu nombre");
    if (!d.telefono) faltan.push("teléfono");
    if (faltan.length) {
      if (err) { err.textContent = "Falta completar: " + faltan.join(", ") + "."; err.hidden = false;
        err.scrollIntoView({ behavior: "smooth", block: "center" }); }
      return;
    }
    const cfg = getConfig();
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
${cfg.coverage ? "Zona: " + cfg.coverage + "\n" : ""}Enviado desde la web. ¡Quedo atento a la confirmación!`;
    window.open(waLink(msg), "_blank");
    const btn = $("#mb-agendar-form button[type=submit]");
    if (btn) { const o = btn.innerHTML; btn.innerHTML = "✓ Abriendo WhatsApp…"; setTimeout(() => { btn.innerHTML = o; }, 2500); }
  }

  /* ------------------------------- Wiring global ------------------------------- */
  function wire() {
    const cfg = getConfig();

    // Enlaces directos de WhatsApp
    $$(".js-whatsapp").forEach(a => { a.href = waLink(cfg.greeting); a.target = "_blank"; a.rel = "noopener"; });
    const wf = $(".wa-float"); if (wf) wf.href = waLink(cfg.greeting);

    // Marcar visualmente la opción elegida en el formulario
    $$("#mb-agendar-form .choice input").forEach(input => {
      input.addEventListener("change", () => {
        $$(`#mb-agendar-form .choice input[name="${input.name}"]`).forEach(i => i.closest(".choice").classList.remove("checked"));
        input.closest(".choice").classList.add("checked");
        updatePreview();
      });
    });
    const form = $("#mb-agendar-form");
    if (form) { form.addEventListener("input", updatePreview); form.addEventListener("submit", submitToWhatsApp); }

    // Fecha mínima = hoy
    const fecha = $("#mb-f-fecha");
    if (fecha) fecha.min = new Date().toISOString().split("T")[0];

    updatePreview();
  }

  /* Delegación de clics: abrir/cerrar modal + acordeón FAQ */
  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest(".js-agendar");
    if (openBtn) { e.preventDefault(); openModal(openBtn.dataset.servicio); return; }
    if (e.target.closest(".js-close-modal")) { closeModal(); return; }
    const faqBtn = e.target.closest(".faq-q");
    if (faqBtn) {
      const item = faqBtn.closest(".faq-item");
      const body = $(".faq-a", item);
      const open = item.classList.toggle("open");
      body.style.maxHeight = open ? body.scrollHeight + "px" : null;
    }
  });
  document.addEventListener("keydown", (e) => {
    const modal = modalEl();
    if (e.key === "Escape" && modal && modal.classList.contains("open")) closeModal();
  });

  /* Animaciones de aparición al hacer scroll */
  function initReveal() {
    const els = $$(".mb-reveal");
    if (!els.length || !("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => io.observe(el));
  }

  function boot() { wire(); initReveal(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // Reinicialización en el editor de temas de Shopify (al añadir/mover secciones)
  document.addEventListener("shopify:section:load", () => { wire(); initReveal(); });
})();
