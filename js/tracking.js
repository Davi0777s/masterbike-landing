/* =====================================================================
   MASTER BIKE — MEDICIÓN (GA4 + Meta Pixel + TikTok Pixel + Clarity)
   Lee los IDs de config.js → tracking. Solo carga lo que tenga ID.
   Expone window.mbTrack(evento, params) para eventos de conversión.
   ===================================================================== */
(function () {
  "use strict";
  var T = (window.MASTERBIKE && window.MASTERBIKE.tracking) || {};

  /* ---------------- GA4 (Google Analytics) ---------------- */
  if (T.ga4) {
    var g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=" + T.ga4;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", T.ga4);
  }

  /* ---------------- Meta (Facebook/Instagram) Pixel ---------------- */
  if (T.metaPixel) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", T.metaPixel); fbq("track", "PageView");
  }

  /* ---------------- TikTok Pixel ---------------- */
  if (T.tiktokPixel) {
    !function (w, d, t) {
      w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || [];
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
      ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e; };
      ttq.load = function (e, n) { var r = "https://analytics.tiktok.com/i18n/pixel/events.js", o = n && n.partner; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r; ttq._t = ttq._t || {}; ttq._t[e] = +new Date; ttq._o = ttq._o || {}; ttq._o[e] = n || {}; n = d.createElement("script"); n.type = "text/javascript"; n.async = !0; n.src = r + "?sdkid=" + e + "&lib=" + t; e = d.getElementsByTagName("script")[0]; e.parentNode.insertBefore(n, e); };
      ttq.load(T.tiktokPixel); ttq.page();
    }(window, document, "ttq");
  }

  /* ---------------- Microsoft Clarity (heatmaps / grabación) ---------------- */
  if (T.clarity) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", T.clarity);
  }

  /* ---------------- Evento de conversión unificado ---------------- */
  // Uso: mbTrack('lead' | 'whatsapp' | 'agendar_open', { ...params })
  window.mbTrack = function (name, params) {
    params = params || {};
    try {
      if (window.gtag) {
        var gaMap = { lead: "generate_lead", whatsapp: "whatsapp_click", agendar_open: "open_form" };
        gtag("event", gaMap[name] || name, params);
      }
      if (window.fbq) {
        var fbMap = { lead: "Lead", whatsapp: "Contact", agendar_open: "InitiateCheckout" };
        if (fbMap[name]) fbq("track", fbMap[name], params); else fbq("trackCustom", name, params);
      }
      if (window.ttq) {
        var ttMap = { lead: "SubmitForm", whatsapp: "Contact", agendar_open: "ClickButton" };
        window.ttq.track(ttMap[name] || name, params);
      }
    } catch (e) {}
  };

  /* ---------------- Auto-tracking de clics clave ---------------- */
  document.addEventListener("click", function (e) {
    if (e.target.closest(".js-whatsapp")) window.mbTrack("whatsapp", { origen: "boton" });
    else if (e.target.closest(".js-agendar")) window.mbTrack("agendar_open", {});
  });
})();
