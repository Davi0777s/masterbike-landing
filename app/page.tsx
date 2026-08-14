import { config as c } from "@/lib/config";
import { Icon, whatsappSvg, waHref } from "@/lib/icons";
import ClientEffects from "@/components/ClientEffects";
import Agenda from "@/components/Agenda";
import Faq from "@/components/Faq";

const WA = waHref(c.whatsapp, "Hola Master Bike 👋, quiero información sobre el mantenimiento de mi máquina de gimnasio.");
const anios = String(c.tecnico.aniosExperiencia);
const maquinasN = c.tecnico.maquinasAtendidas + "+";
const tickerItems = ["Mantenimiento a domicilio", "Ibagué y alrededores", "Todas las marcas", "30 días de garantía", "Un solo técnico responsable", "Confirmación por WhatsApp"];

export default function Home() {
  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />

      {/* HEADER */}
      <header className="site-header" id="top">
        <div className="container header-inner">
          <a href="#top" className="brand" aria-label="Master Bike — inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-logo" src="/logo.jpeg" alt="Master Bike" />
          </a>
          <nav className="nav" aria-label="Navegación principal">
            <a href="#servicios">Servicios</a>
            <a href="#proceso">Cómo funciona</a>
            <a href="#faq">Preguntas frecuentes</a>
            <a href="#agenda" className="btn btn-primary btn-sm js-agendar">Agendar</a>
          </nav>
          <button className="nav-toggle" aria-label="Abrir menú" aria-expanded="false"><span /><span /><span /></button>
        </div>
        <div className="mobile-menu" hidden>
          <a href="#servicios">Servicios</a>
          <a href="#proceso">Cómo funciona</a>
          <a href="#faq">Preguntas frecuentes</a>
          <a href="#agenda" className="btn btn-primary js-agendar">Agendar mantenimiento</a>
        </div>
      </header>

      {/* TICKER */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i}><span>{t}</span><span className="ticker-dot" /></span>
          ))}
        </div>
      </div>

      <main>
        {/* HERO CINEMATOGRÁFICO */}
        <section className="hero hero-cine">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-bg" src="/tecnico.webp" alt="Técnico de Master Bike trabajando" />
          <div className="hero-scrim" aria-hidden="true" />
          <div className="container hero-cine-inner">
            <div className="hero-copy">
              <h1 className="hero-title">
                <span className="hl mb-reveal">Tu máquina</span>
                <span className="hl mb-reveal d1">de gym,</span>
                <span className="hl accent mb-reveal d2">siempre lista.</span>
              </h1>
              <p className="hero-sub mb-reveal d2">
                Mantenimiento, revisión y reparación de elípticas, caminadoras y bicicletas estáticas.
                Un solo técnico responsable, respuesta rápida por WhatsApp. <strong>Agenda en menos de 2 minutos.</strong>
              </p>
              <div className="hero-actions mb-reveal d3">
                <a href="#agenda" className="btn btn-primary btn-lg js-agendar">Agendar mantenimiento</a>
                <a href={WA} className="btn btn-ghost btn-lg js-whatsapp" target="_blank" rel="noopener">Escribir por WhatsApp</a>
              </div>
            </div>
            <dl className="hero-spec mb-reveal d3">
              <div><dt>Cobertura</dt><dd>{c.cobertura}</dd></div>
              <div><dt>Marcas</dt><dd>Todas</dd></div>
              <div><dt>Garantía</dt><dd>30 días</dd></div>
              <div><dt>Experiencia</dt><dd>{anios} años · {maquinasN} máquinas</dd></div>
            </dl>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-band" aria-label="Datos de Master Bike">
          <div className="container stats-row">
            <div className="stat"><span className="stat-value" data-count={anios}>{anios}</span><span className="stat-label">años de experiencia</span></div>
            <div className="stat"><span className="stat-value" data-count={maquinasN}>{maquinasN}</span><span className="stat-label">máquinas atendidas</span></div>
            <div className="stat"><span className="stat-value">Todas</span><span className="stat-label">las marcas</span></div>
            <div className="stat"><span className="stat-value">30<span className="stat-unit">días</span></span><span className="stat-label">de garantía</span></div>
          </div>
        </section>

        {/* MARCAS */}
        <section className="brands" aria-label="Marcas que atiendo">
          <div className="container brands-inner">
            <p className="brands-label">Atiendo equipos de todas las marcas</p>
            <div className="brands-marquee">
              <div className="brands-track">
                {[...c.marcas, ...c.marcas].map((m, i) => <span key={i} className="brand-item">{m}</span>)}
              </div>
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section className="section" id="servicios">
          <div className="container">
            <div className="section-head mb-reveal">
              <h2 className="section-title">Qué hago por tu equipo</h2>
              <p className="section-lead">Precios claros por tipo de servicio. Sin sorpresas ni letra pequeña.</p>
            </div>
            <div className="services-grid">
              {c.servicios.map((s, i) => (
                <article key={s.id} className={"service-card mb-reveal " + ["", "d1", "d2", "d3"][i % 4] + (s.destacado ? " is-featured" : "")}>
                  {s.destacado && <span className="service-tag">Más pedido</span>}
                  <h3>{s.titulo}</h3>
                  <p>{s.desc}</p>
                  <ul className="service-includes">
                    {s.incluye.map((it, j) => <li key={j}><Icon name="check" /><span>{it}</span></li>)}
                  </ul>
                  <p className="service-quote"><Icon name="chat" /> Cotización personalizada por WhatsApp</p>
                  <a href="#agenda" className="btn btn-primary btn-sm js-agendar">Agendar</a>
                </article>
              ))}
            </div>
            <div className="machines mb-reveal">
              <p className="machines-label">Máquinas que atiendo</p>
              <ul className="machines-list">
                {c.maquinas.map((m) => (
                  <li key={m.id}><span className="mch-ico"><Icon name={m.icon} /></span><span>{m.label}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* COBERTURA */}
        <section className="coverage" id="cobertura">
          <div className="container coverage-inner">
            <div className="coverage-head mb-reveal">
              <Icon name="pin" className="ico-lg coverage-pin" />
              <div><h2 className="coverage-title">Atiendo en <span className="accent">{c.coberturaBase}</span> y sus alrededores</h2></div>
            </div>
            <ul className="coverage-chips mb-reveal d1">
              <li className="is-base">{c.coberturaBase}</li>
              {c.municipios.map((m) => <li key={m}>{m}</li>)}
            </ul>
            <p className="coverage-note">¿Estás un poco más lejos? Escríbeme por WhatsApp y lo coordinamos.</p>
          </div>
        </section>

        {/* POR QUÉ */}
        <section className="section" id="porque">
          <div className="container">
            <div className="section-head mb-reveal">
              <h2 className="section-title">No es el servicio de una tienda. Es tu técnico.</h2>
              <p className="section-lead">La diferencia entre un call center que agenda y una persona que responde por tu equipo.</p>
            </div>
            <div className="dif-grid">
              {c.diferenciadores.map((d, i) => (
                <article key={i} className={"dif-card mb-reveal " + ["", "d1", "d2"][i % 3]}>
                  <span className="dif-ico"><Icon name={d.icon} className="" /></span>
                  <h3>{d.titulo}</h3><p>{d.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="section section-dark" id="proceso">
          <div className="container">
            <div className="section-head mb-reveal"><h2 className="section-title">De agendar a listo, en 4 pasos</h2></div>
            <ol className="steps">
              {[
                ["01", "Agenda tu cita", "Eliges máquina, servicio y fecha desde la web en menos de 2 minutos."],
                ["02", "Confirmación por WhatsApp", "Recibes tu orden de servicio prellenada y confirmas la disponibilidad al instante."],
                ["03", "El técnico llega", "Voy a tu domicilio en la fecha acordada con todo lo necesario para el trabajo."],
                ["04", "Recordatorio automático", "Te aviso cuándo toca el próximo mantenimiento para que tu máquina no falle."],
              ].map(([n, t, d]) => (
                <li key={n} className="step mb-reveal"><span className="step-no">{n}</span><h3>{t}</h3><p>{d}</p></li>
              ))}
            </ol>
          </div>
        </section>

        {/* AGENDA (cliente) */}
        <Agenda />

        {/* TÉCNICO */}
        <section className="section" id="tecnico">
          <div className="container tech-grid">
            <div className="tech-media mb-reveal">
              <div className="tech-photo-ph">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="tech-photo" src="/tecnico.webp" alt="El técnico de Master Bike en el taller" />
              </div>
              <span className="badge badge-ok tech-badge">Persona real, no un call center</span>
            </div>
            <div className="tech-copy mb-reveal d1">
              <h2 className="section-title">Tu máquina en manos de un experto.</h2>
              <p className="tech-quote">Servicio directo y transparente: yo mismo reviso cada detalle de tu equipo, sin intermediarios ni call centers. Respondo personalmente por cada trabajo.</p>
              <ul className="tech-stats">
                <li>
                  <span className="ts-ico"><Icon name="medal" className="" /></span>
                  <span className="ts-txt"><span className="ts-num">{anios}</span><span className="ts-lbl">años de experiencia certificada</span></span>
                </li>
                <li>
                  <span className="ts-ico"><Icon name="wrench" className="" /></span>
                  <span className="ts-txt"><span className="ts-num">{maquinasN}</span><span className="ts-lbl">máquinas atendidas con éxito</span></span>
                </li>
                <li>
                  <span className="ts-ico"><Icon name="pin" className="" /></span>
                  <span className="ts-txt"><span className="ts-num">{c.coberturaBase}</span><span className="ts-lbl">y alrededores · cobertura completa</span></span>
                </li>
              </ul>
              <div className="signature">
                <p className="sign-name">{c.tecnico.nombre}</p>
                <p className="sign-role">Técnico experto independiente · Master Bike</p>
              </div>
              <a href="#agenda" className="btn btn-primary js-agendar">Agendar con el técnico</a>
            </div>
          </div>
        </section>

        {/* RESEÑAS */}
        <section className="section" id="resenas">
          <div className="container">
            <div className="section-head mb-reveal">
              <h2 className="section-title">Lo que dicen mis clientes</h2>
              <p className="section-lead">Personas reales, máquinas reales, en Ibagué y alrededores.</p>
            </div>
            <div className="reviews-grid">
              {c.testimonios.map((t, i) => {
                const initials = t.nombre.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <article key={i} className={"review-card mb-reveal " + ["", "d1", "d2"][i % 3]}>
                    <div className="review-stars" aria-label={`${t.rating} de 5`}>{"★★★★★".slice(0, t.rating)}{"☆☆☆☆☆".slice(0, 5 - t.rating)}</div>
                    <p className="review-text">“{t.texto}”</p>
                    <footer className="review-foot">
                      <span className="review-avatar review-initials">{initials}</span>
                      <span><span className="review-name">{t.nombre}</span><span className="review-meta">{t.maquina} · {t.zona}</span></span>
                    </footer>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ (cliente) */}
        <Faq />

        {/* CTA FINAL */}
        <section className="cta-final">
          <div className="container cta-inner">
            <h2 className="mb-reveal">¿Tu máquina necesita revisión?</h2>
            <p className="mb-reveal d1">Agéndala ahora o escríbeme directo. Respondo personalmente.</p>
            <div className="hero-actions center mb-reveal d2">
              <a href="#agenda" className="btn btn-primary btn-lg js-agendar">Agendar mantenimiento</a>
              <a href={WA} className="btn btn-ghost btn-lg js-whatsapp" target="_blank" rel="noopener">Prefiero escribir por WhatsApp</a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="footer-logo" src="/logo.jpeg" alt="Master Bike" />
            <p>Mantenimiento y reparación de máquinas de gimnasio a domicilio.</p>
          </div>
          <div className="footer-col">
            <h3 className="footer-h">Contacto</h3>
            <a href={WA} className="js-whatsapp" target="_blank" rel="noopener">WhatsApp directo</a>
            <a href={`mailto:${c.email}`}>{c.email}</a>
            <p>Base: <strong>{c.coberturaBase}</strong></p>
          </div>
          <div className="footer-col">
            <h3 className="footer-h">Cobertura</h3>
            <ul className="footer-zonas">{c.municipios.map((m) => <li key={m}>{m}</li>)}</ul>
          </div>
          <div className="footer-col">
            <h3 className="footer-h">Síguenos</h3>
            <div className="footer-social"><p style={{ fontSize: ".85rem", color: "var(--gris-mute-dark)" }}>Pronto en redes.</p></div>
          </div>
          <div className="footer-col footer-soon">
            <span className="badge badge-pending">Próximamente</span>
            <p>Tienda de repuestos y accesorios para tu equipo de gimnasio.</p>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© {new Date().getFullYear()} Master Bike. Todos los derechos reservados.</p>
          <p>Hecho con enfoque técnico, no de call center.</p>
        </div>
      </footer>

      {/* Barra CTA móvil */}
      <div className="mobile-cta" aria-label="Acciones rápidas">
        <a className="mobile-cta-wa js-whatsapp" href={WA} target="_blank" rel="noopener" aria-label="WhatsApp">{whatsappSvg}</a>
        <a className="btn btn-primary mobile-cta-book js-agendar" href="#agenda">Agendar mantenimiento</a>
      </div>

      {/* Botón flotante WhatsApp (desktop) */}
      <a className="wa-float js-whatsapp" href={WA} target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">{whatsappSvg}</a>

      <ClientEffects />
    </>
  );
}
