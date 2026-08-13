"use client";
import { useEffect, useMemo, useState } from "react";
import { config } from "@/lib/config";
import { Icon, waHref } from "@/lib/icons";

const PIPS = ["Máquina", "Servicio", "Fecha", "Datos"];

function fmtFecha(v: string) {
  if (!v) return "—";
  try { return new Date(v + "T00:00:00").toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return v; }
}

export default function Agenda() {
  const [step, setStep] = useState(1);
  const [maquina, setMaquina] = useState("");
  const [servicio, setServicio] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");
  const [error, setError] = useState("");
  const [orderNo, setOrderNo] = useState("OS-————");
  useEffect(() => { setOrderNo("OS-" + Math.floor(1000 + Math.random() * 9000)); }, []);

  const hoy = useMemo(() => new Date().toISOString().split("T")[0], []);
  const go = (n: number) => setStep(Math.max(1, Math.min(4, n)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const faltan = [];
    if (!maquina) faltan.push("tipo de máquina");
    if (!servicio) faltan.push("tipo de servicio");
    if (!fecha) faltan.push("fecha");
    if (!hora) faltan.push("franja horaria");
    if (!nombre.trim()) faltan.push("tu nombre");
    if (!telefono.trim()) faltan.push("teléfono");
    if (faltan.length) { setError("Falta completar: " + faltan.join(", ") + "."); return; }
    setError("");
    const msg = `*ORDEN DE SERVICIO — MASTER BIKE*
N.º ${orderNo}
--------------------------------
🔧 Máquina: ${maquina}
🛠️ Servicio: ${servicio}
📅 Fecha: ${fmtFecha(fecha)} (${hora})
👤 Cliente: ${nombre}
📞 Teléfono: ${telefono}${notas ? `\n📝 Notas: ${notas}` : ""}
--------------------------------
Zona: ${config.cobertura}
Enviado desde la web. ¡Quedo atento a la confirmación!`;
    (window as any).mbTrack?.("lead");
    window.open(waHref(config.whatsapp, msg), "_blank");
  };

  const pip = (i: number) => `flow-pip${step === i ? " is-active" : ""}${i < step ? " is-done" : ""}`;

  return (
    <section className="agenda" id="agenda">
      <div className="container">
        <div className="section-head mb-reveal">
          <h2 className="section-title">Agenda en 2 minutos</h2>
          <p className="section-lead">Arma tu orden de servicio paso a paso. Al terminar se abre WhatsApp con todo listo para enviar.</p>
        </div>

        <div className="agenda-grid">
          <form className="agenda-flow mb-reveal" onSubmit={submit} noValidate>
            <ol className="flow-bar">
              {PIPS.map((label, i) => (
                <li key={label} className={pip(i + 1)} onClick={() => go(i + 1)}>
                  <span className="flow-num">{i + 1}</span> {label}
                </li>
              ))}
            </ol>

            {step === 1 && (
              <div className="flow-step is-active">
                <p className="flow-q">¿Qué máquina necesitas revisar?</p>
                <div className="choice-grid">
                  {config.maquinas.map((m) => (
                    <label key={m.id} className={"choice" + (maquina === m.label ? " checked" : "")}>
                      <input type="radio" name="maquina" checked={maquina === m.label}
                        onChange={() => { setMaquina(m.label); setTimeout(() => go(2), 180); }} />
                      <Icon name={m.icon} /> <span>{m.label}</span>
                    </label>
                  ))}
                </div>
                <p className="flow-hint">Toca una opción para continuar</p>
              </div>
            )}

            {step === 2 && (
              <div className="flow-step is-active">
                <p className="flow-q">¿Qué servicio necesitas?</p>
                <div className="choice-list">
                  {config.servicios.map((s) => (
                    <label key={s.id} className={"choice" + (servicio === s.titulo ? " checked" : "")}>
                      <input type="radio" name="servicio" checked={servicio === s.titulo}
                        onChange={() => { setServicio(s.titulo); setTimeout(() => go(3), 180); }} />
                      <span><strong>{s.titulo}</strong><span className="choice-desc">{s.desc}</span></span>
                    </label>
                  ))}
                </div>
                <div className="flow-nav"><button type="button" className="flow-back" onClick={() => go(1)}>← Atrás</button></div>
              </div>
            )}

            {step === 3 && (
              <div className="flow-step is-active">
                <p className="flow-q">¿Cuándo te queda bien?</p>
                <div className="fld-grid">
                  <div><label htmlFor="f-fecha">Fecha preferida</label>
                    <input id="f-fecha" type="date" min={hoy} value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
                  <div><label htmlFor="f-hora">Franja horaria</label>
                    <select id="f-hora" value={hora} onChange={(e) => setHora(e.target.value)}>
                      <option value="">Elige…</option>
                      <option>Mañana (8am – 12m)</option>
                      <option>Tarde (12m – 6pm)</option>
                    </select></div>
                </div>
                <div className="flow-nav">
                  <button type="button" className="flow-back" onClick={() => go(2)}>← Atrás</button>
                  <button type="button" className="btn btn-primary flow-next"
                    onClick={() => { if (!fecha || !hora) setError("Elige fecha y franja horaria para continuar."); else { setError(""); go(4); } }}>
                    Continuar →</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flow-step is-active">
                <p className="flow-q">Tus datos para coordinar</p>
                <div className="fld-grid">
                  <div><label htmlFor="f-nombre">Tu nombre</label>
                    <input id="f-nombre" type="text" placeholder="Nombre y apellido" value={nombre} onChange={(e) => setNombre(e.target.value)} /></div>
                  <div><label htmlFor="f-tel">Teléfono / WhatsApp</label>
                    <input id="f-tel" type="tel" placeholder="300 000 0000" value={telefono} onChange={(e) => setTelefono(e.target.value)} /></div>
                </div>
                <label htmlFor="f-notas">Dirección o notas (opcional)</label>
                <textarea id="f-notas" rows={2} placeholder="Barrio / dirección, marca de la máquina, falla que notas…" value={notas} onChange={(e) => setNotas(e.target.value)} />
                {error && <p className="form-error">{error}</p>}
                <div className="flow-nav">
                  <button type="button" className="flow-back" onClick={() => go(3)}>← Atrás</button>
                  <button type="submit" className="btn btn-primary btn-lg">Enviar por WhatsApp <Icon name="arrow" /></button>
                </div>
                <p className="form-fineprint">Se abrirá WhatsApp con tu orden lista. Confirmo disponibilidad al recibirla.</p>
              </div>
            )}
            {step !== 4 && error && <p className="form-error" style={{ marginTop: 12 }}>{error}</p>}
          </form>

          <aside className="agenda-ticket mb-reveal d1" aria-hidden="true">
            <article className="order-card order-card-live">
              <div className="order-perf order-perf-top" />
              <header className="order-head">
                <div><p className="order-kicker">Orden de servicio</p><p className="order-no">N.º {orderNo}</p></div>
                <span className="badge badge-pending">Borrador</span>
              </header>
              <dl className="order-rows">
                <div><dt>Máquina</dt><dd>{maquina || "—"}</dd></div>
                <div><dt>Servicio</dt><dd>{servicio || "—"}</dd></div>
                <div><dt>Fecha</dt><dd>{fecha ? fmtFecha(fecha) + (hora ? " · " + hora.split(" ")[0] : "") : "—"}</dd></div>
                <div><dt>Cliente</dt><dd>{nombre || "—"}</dd></div>
              </dl>
              <div className="order-strip">
                <span className="order-check"><Icon name="check" /></span>
                {config.tecnico.nombre} · pendiente de confirmar
              </div>
              <div className="order-perf order-perf-bottom" />
            </article>
          </aside>
        </div>
      </div>
    </section>
  );
}
