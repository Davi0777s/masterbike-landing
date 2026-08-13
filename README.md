# Master Bike — Landing Page

Landing page de un solo objetivo: **que el visitante agende un mantenimiento de su máquina de gimnasio en menos de 2 minutos.**

Sitio **estático** (HTML + CSS + JS puro, sin build). Se abre directo en el navegador y se despliega en cualquier hosting (Vercel, Netlify, etc.) tal cual.

---

## 🚀 Ver la página en tu computador

Opción rápida: haz doble clic en `index.html`.

Opción recomendada (para que carguen bien fuentes e imágenes), en la terminal dentro de la carpeta:

```bash
npx serve .
```

Luego abre la dirección que aparece (normalmente http://localhost:3000).

---

## ✏️ Qué edito y dónde

**Casi todo se cambia en un solo archivo: `js/config.js`.** Ábrelo en VS Code y verás comentarios guía. Ahí cambias:

| Quiero cambiar… | Dónde |
|---|---|
| Número de WhatsApp | `whatsapp` en `js/config.js` |
| Ciudad base y municipios de cobertura | `coberturaBase` y `municipios` en `js/config.js` |
| Tu nombre, años, # máquinas, frase | `tecnico` en `js/config.js` |
| Preguntas frecuentes | `faqs` en `js/config.js` |
| Redes sociales | `redes` en `js/config.js` |
| Tipos de máquina y de servicio | `maquinas` / `servicios` en `js/config.js` |
| Lo que incluye cada servicio | `servicios[].incluye` en `js/config.js` |
| Sección "Por qué Master Bike" | `diferenciadores` en `js/config.js` |
| Días de garantía | `garantiaDias` en `js/config.js` |

> **Precios:** por decisión del negocio **no se muestran en la página**. Se cotizan de forma personalizada por WhatsApp cuando llega la solicitud.

**Logo:** ya está `assets/logo/logo.jpeg` (y se generaron `favicon.png` + `apple-touch-icon.png`). Para reemplazarlo, sube tu archivo con el mismo nombre.

**Foto del técnico:** ya está `assets/tecnico/imagen.webp`, encuadrada por CSS en la sección "Quién repara tu equipo". Para cambiarla, reemplaza ese archivo (ideal horizontal o vertical, el encuadre se ajusta con `object-position` en `css/styles.css`).

> Mientras no existan el logo ni las fotos, la página muestra placeholders limpios: **nada se ve roto**.

---

## 📲 Cómo funciona el agendamiento

1. El cliente pulsa **"Agendar mantenimiento"** → se abre un formulario tipo *orden de servicio* (la orden se va llenando en vivo a la derecha).
2. Elige: máquina → servicio → fecha/hora → nombre y teléfono.
3. Al enviar, se abre **WhatsApp** con la orden ya redactada hacia tu número.
4. Tú confirmas la disponibilidad respondiendo el mensaje.

> El "gancho" de automatización ya está listo: los datos se capturan y se arman en un mensaje de WhatsApp (`js/main.js` → `submitToWhatsApp`). En la fase 2 se puede conectar a un CRM, calendario o bot sin rehacer el formulario.

---

## 🎨 Sistema de diseño (referencia)

Definido con variables CSS en `css/styles.css` (`:root`):

- **Rojo** `#E4141F` · **Rojo oscuro** `#8C0F17` · **Negro** `#121212` · **Blanco cálido** `#FAFAF8` · **Gris** `#3A3A3C`
- Tipografías: **Bebas Neue** (títulos), **Inter** (cuerpo), **JetBrains Mono** (datos/badges).
- Elemento de marca: la **Orden de Servicio** (hero + formulario).

Si tu logo usa un rojo distinto, cambia `--rojo` en `css/styles.css` y todo el sitio se ajusta.

---

## ☁️ Publicar en internet (Vercel)

Con la CLI de Vercel (una vez instalada con `npm i -g vercel`):

```bash
vercel        # primer deploy (preview)
vercel --prod # publicar en producción
```

O arrastra la carpeta en https://vercel.com/new. No necesita configuración: es un sitio estático.

---

## 📁 Estructura

```
MASTERBIKE/
├─ index.html          Estructura de la página
├─ css/styles.css      Sistema de diseño + estilos
├─ js/
│  ├─ config.js        ← EDITA AQUÍ (precios, teléfono, textos)
│  └─ main.js          Lógica (modal, orden de servicio, WhatsApp)
├─ assets/
│  ├─ logo/            Tu logo (ver LEEME.txt)
│  └─ tecnico/         Tus fotos/video (ver LEEME.txt)
└─ README.md
```
```
```

---

## 📊 Medición (analítica — todo gratis)

Todo se activa pegando los IDs en `js/config.js` → `tracking`. Crea las cuentas con **sumasterbike@outlook.com**.

| Herramienta | Dónde sacar el ID | Campo en config |
|---|---|---|
| **GA4** | analytics.google.com → Admin → Crear propiedad → Flujo de datos Web → "ID de medición" `G-XXXXXXXXXX` | `ga4` |
| **Meta Pixel** | business.facebook.com → Events Manager → Conectar orígenes → Web → ID del píxel (número) | `metaPixel` |
| **TikTok Pixel** | ads.tiktok.com → Assets → Events → Web → instalar manualmente → Pixel ID | `tiktokPixel` |
| **Clarity** | clarity.microsoft.com → New project → Settings → Project ID (10 caracteres) | `clarity` |

Eventos de conversión ya cableados: **Lead** (envío del formulario), **Contact** (clic WhatsApp), **open_form** (clic Agendar). Se envían a las 3 plataformas automáticamente.

### Pendientes del brief
- [x] Logo en alta → `assets/logo/logo.jpeg`
- [x] Zona de cobertura → Ibagué + alrededores (`js/config.js`)
- [x] Foto real del técnico → `assets/tecnico/imagen.webp`
- [ ] **Número de WhatsApp real** → `js/config.js` (ahora es un placeholder)
- [ ] Tu nombre real, años de experiencia y frase → `tecnico` en `js/config.js`
