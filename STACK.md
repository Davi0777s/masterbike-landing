# Master Bike — Definición de Stack y Roadmap

> Documento de arquitectura. Define **qué** herramienta hace **qué** y en **qué fase**.
> Nada se "monta" hasta que la fase correspondiente esté aprobada.

---

## Principio rector
Dos fases distintas, cada herramienta en lo que es buena:

| | **Fase 1 — Captación** (ahora) | **Fase 2 — Tienda** (después) |
|---|---|---|
| Objetivo | Agendar mantenimientos | Vender repuestos/accesorios |
| ¿E-commerce? | No | Sí |
| Plataforma | **Landing en Vercel** | **Shopify** |

La landing de captación **no necesita Shopify** para funcionar. Shopify entra cuando exista la tienda.

> **Regla de plata: TODO GRATIS hasta que haya ingresos para reinvertir.**
> La fase 1 completa cuesta **$0**. Cada herramienta de pago (Shopify, Kommo, dominio propio) se activa solo cuando el negocio ya genere caja.

---

## Stack por capas

| Capa | Herramienta | Fase | Costo aprox. | Estado |
|---|---|---|---|---|
| **Plataforma / hosting** | **Vercel** (landing estática) | 1 | **Gratis** (Hobby) | ✅ decidido |
| **URL** | Empezar en `masterbike.vercel.app` (gratis); dominio propio cuando haya inversión | 1 | **$0** ahora | ✅ arrancar gratis |
| **Frontend** | HTML/CSS/JS a mano + Impeccable (QA diseño) | 1 | Gratis | ✅ construido (sandbox) |
| **Medición — analítica** | GA4 + Google Tag Manager | 1 | Gratis | ⬜ pendiente |
| **Medición — píxeles** | Meta Pixel + TikTok Pixel | 1 | Gratis | ⬜ pendiente |
| **Medición — comportamiento** | Microsoft Clarity (heatmaps/grabación) | 1 | Gratis | ⬜ pendiente |
| **Captura de leads** | Formulario → WhatsApp (`wa.me`) + guardar lead | 1 | Gratis | ✅ WhatsApp listo · ⬜ guardado |
| **Automatización** | n8n (self-host local/free tier) | 1.5 | **Gratis** self-host | ⬜ después |
| **CRM** | Kommo (pipeline WhatsApp) | 2 / con caja | ~$15/mes 💰 | ⬜ cuando haya ingresos |
| **Email marketing** | Brevo | 2 | Gratis (tier inicial) | ⬜ fase tienda |
| **Tienda** | Shopify | 2 | ~$25–39/mes 💰 | ⬜ fase 2 (con caja) |
| **SEO local** | Meta tags + schema LocalBusiness/Service | 1 | **Gratis** | ⬜ pendiente |

> 💰 = única capa de pago. Todo lo demás de fase 1 es **$0**.

---

## Costos por fase
- **Fase 1 (captación): $0.** Vercel (free), URL `.vercel.app` (free), GA4/GTM/pixels/Clarity (free), WhatsApp `wa.me` manual (free), diseño (free).
- **Fase 1.5 (automatización): $0** con n8n self-host (local o free tier).
- **Fase 2 (tienda):** aquí sí entra pago — Shopify (~$25–39/mes) + Kommo (~$15/mes), **solo cuando el negocio genere caja para reinvertir.**

---

## Por qué este stack (benchmark del mercado)
Fingerprint en vivo de 7 competidores:
- El **líder (Sportfitness) usa Shopify** → valida Shopify para la tienda.
- El resto son **WooCommerce + Elementor** (pesado, genérico, lento).
- Los fuertes (Gym Solutions, Fittech, Evolution) tienen **GA4 + Meta Pixel + Hotjar**; los débiles no tienen nada.
- **Nadie** tiene: TikTok Pixel, Clarity, WhatsApp automatizado, ni email → **terreno libre** para Master Bike.

Nuestra jugada: la landing **más rápida y mejor diseñada** del sector (Vercel + diseño limpio) + la **medición completa** que tienen los fuertes + la **automatización que nadie tiene**.

---

## Roadmap (orden de ejecución)
1. **Cerrar diseño + contenido** de la landing (sandbox actual). ← en curso
2. **Datos reales**: WhatsApp, nombre del técnico, precios (los maneja por WhatsApp), fotos.
3. **Medición**: cablear GA4 + GTM + Meta/TikTok Pixel + Clarity + eventos en los CTA.
4. **Dominio** + **deploy a Vercel**.
5. **Guardado de leads** (Sheet/n8n) para no perder ninguno.
6. **Fase 1.5**: automatización de confirmación/recordatorios (n8n).
7. **Fase 2**: tienda en Shopify + Kommo + Brevo.

---

## Decisiones pendientes
- [x] Número de WhatsApp → **+57 300 515 2744** (cargado en `js/config.js`)
- [x] Regla de costos → **todo gratis** hasta reinvertir · arrancar en `masterbike.vercel.app`
- [x] Correo maestro → **sumasterbike@outlook.com** (soporte + todas las cuentas: Vercel, GA4, Meta, TikTok, Clarity)
- [ ] Cuentas gratis a crear con ese correo: Google (GA4), Meta Business, TikTok, Microsoft (Clarity), Vercel
- [ ] Nombre + años del técnico (para la credencial/reseñas)
- [ ] Dominio propio → aplazado hasta que haya inversión

## Nota
La carpeta `shopify-theme/` fue trabajo adelantado para la fase 2 — queda **parqueada** (no se usa en fase 1). La landing de fase 1 es el sitio estático (`index.html`, `css/`, `js/`).
