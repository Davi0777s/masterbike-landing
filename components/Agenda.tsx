"use client";
import { useEffect, useMemo, useState } from "react";
import { config } from "@/lib/config";
import { Icon, waHref } from "@/lib/icons";

const PIPS = ["Máquina", "Servicio", "Fecha", "Datos"];
type Slot = { iso: string; label: string };

function fmtFecha(v: string) {
  if (!v) return "—";
  try { return new Date(v + "T12:00:00Z").toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return v; }
}

export default function Agenda() {
  const [step, setStep] = useState(1);
  const [maquinaId, setMaquinaId] = useState("");
  const [servicioId, setServicioId] = useState("");
  const [fecha, setFecha] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotIso, setSlotIso] = useState("");
  const [slotLabel, setSlotLabel] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [orderNo, setOrderNo] = useState("OS-————");
  useEffect(() => { setOrderNo("OS-" + Math.floor(1000 + Math.random() * 9000)); }, []);

  const hoy = useMemo(() => new Date().toISOString().split("T")[0], []);
  const maquinaLabel = config.maquinas.find((m) => m.id === maquinaId)?.label ?? "";
  const machineIcon = config.maquinas.find((m) => m.id === maquinaId)?.icon ?? "otra";
  const servicioTitulo = config.servicios.find((s) => s.id === servicioId)?.titulo ?? "";
  const includes = config.servicios.find((s) => s.id === servicioId)?.incluye ?? [];
  const go = (n: number) => { setStep(Math.max(1, Math.min(4, n))); setError(""); };

  async function loadSlots(f: string) {
    setFecha(f); setSlotIso(""); setSlotLabel(""); setSlots([]);
    if (!f) return;
    setLoadingSlots(true);
    try {
      const r = await fetch(`/api/disponibilidad?fecha=${f}`);
      const j = await r.json();
      setSlots(Array.isArray(j.slots) ? j.slots : []);
    } catch { setSlots([]); }
    setLoadingSlots(false);
  }

  function buildMsg() {
    return `*ORDEN DE SERVICIO — MASTER BIKE*
N.º ${orderNo}
--------------------------------
🔧 Máquina: ${maquinaLabel}
🛠️ Servicio: ${servicioTitulo}
📅 Fecha: ${fmtFecha(fecha)} · ${slotLabel}
👤 Cliente: ${nombre}
📞 Teléfono: ${telefono}${notas ? `\n📝 Notas: ${notas}` : ""}
--------------------------------
Zona: ${config.cobertura}
¡Quedo atento a la confirmación!`;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) { setError("Completa tu nombre y teléfono."); return; }
    setSubmitting(true); setError("");
    try {
      const r = await fetch("/api/agendar", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maquinaId, servicioId, fechaHora: slotIso, nombre, telefono, notas }),
      });
      const j = await r.json();
      if (!r.ok) {
        if (r.status === 409) { setError(j.message || "Ese horario se ocupó, elige otro."); setSubmitting(false); go(3); await loadSlots(fecha); return; }
        setError(j.message || "No se pudo agendar. Intenta de nuevo."); setSubmitting(false); return;
      }
      (window as unknown as { mbTrack?: (n: string) => void }).mbTrack?.("lead");
      window.open(waHref(config.whatsapp, buildMsg()), "_blank");
      setDone(true);
    } catch { setError("Error de red. Intenta de nuevo."); }
    setSubmitting(false);
  }

  const pip = (i: number) => `flow-pip${step === i ? " is-active" : ""}${i < step ? " is-done" : ""}`;

  return (
    <section className="agenda" id="agenda">
      <div className="container">
        <div className="section-head mb-reveal">
          <h2 className="section-title">Agenda en 2 minutos</h2>
          <p className="section-lead">Elige máquina, servicio y un horario libre. Tu cita queda registrada y se abre WhatsApp con la orden.</p>
        </div>

        <div className="agenda-grid">
          {done ? (
            <div className="agenda-flow mb-reveal agenda-done">
              <span className="done-check"><Icon name="check" /></span>
              <h3>¡Cita registrada!</h3>
              <p>Tu <strong>{servicioTitulo}</strong> para el <strong>{fmtFecha(fecha)} · {slotLabel}</strong> quedó agendada. Se abrió WhatsApp para confirmarla con Yovani — si no se abrió, escríbenos.</p>
              <a href={waHref(config.whatsapp, buildMsg())} className="btn btn-primary btn-lg js-whatsapp" target="_blank" rel="noopener">Abrir WhatsApp</a>
            </div>
          ) : (
            <form className="agenda-flow mb-reveal" onSubmit={submit} noValidate>
              <div className="flow-bar" role="list" aria-label="Progreso de la agenda">
                {PIPS.map((label, i) => (
                  <button type="button" key={label} className={pip(i + 1)} role="listitem"
                    onClick={() => i + 1 < step && go(i + 1)} disabled={i + 1 >= step}
                    aria-current={step === i + 1 ? "step" : undefined}>
                    <span className="flow-num">{i + 1}</span> {label}
                  </button>
                ))}
              </div>

              {step === 1 && (
                <div className="flow-step is-active">
                  <p className="flow-q">¿Qué máquina necesitas revisar?</p>
                  <div className="choice-grid">
                    {config.maquinas.map((m) => (
                      <label key={m.id} className={"choice" + (maquinaId === m.id ? " checked" : "")}>
                        <input type="radio" name="maquina" checked={maquinaId === m.id}
                          onChange={() => { setMaquinaId(m.id); setTimeout(() => go(2), 160); }} />
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
                      <label key={s.id} className={"choice" + (servicioId === s.id ? " checked" : "")}>
                        <input type="radio" name="servicio" checked={servicioId === s.id}
                          onChange={() => { setServicioId(s.id); setTimeout(() => go(3), 160); }} />
                        <span><strong>{s.titulo}</strong><span className="choice-desc">{s.desc}</span></span>
                      </label>
                    ))}
                  </div>
                  <div className="flow-nav"><button type="button" className="flow-back" onClick={() => go(1)}>← Atrás</button></div>
                </div>
              )}

              {step === 3 && (
                <div className="flow-step is-active">
                  <p className="flow-q">¿Qué día? Elige un horario libre</p>
                  <label htmlFor="f-fecha">Fecha (Lun–Sáb)</label>
                  <input id="f-fecha" type="date" min={hoy} value={fecha} onChange={(e) => loadSlots(e.target.value)} />
                  {fecha && (
                    <div className="slots-wrap">
                      {loadingSlots ? <p className="flow-hint">Buscando horarios…</p>
                        : slots.length ? (
                          <div className="slot-grid">
                            {slots.map((s) => (
                              <button type="button" key={s.iso} className={"slot-btn" + (slotIso === s.iso ? " sel" : "")}
                                onClick={() => { setSlotIso(s.iso); setSlotLabel(s.label); setTimeout(() => go(4), 160); }}>
                                {s.label}
                              </button>
                            ))}
                          </div>
                        ) : <p className="flow-hint">Sin horarios libres ese día. Prueba otra fecha (no atiendo domingos).</p>}
                    </div>
                  )}
                  <div className="flow-nav"><button type="button" className="flow-back" onClick={() => go(2)}>← Atrás</button></div>
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
                    <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                      {submitting ? "Agendando…" : <>Confirmar cita <Icon name="arrow" /></>}
                    </button>
                  </div>
                  <p className="form-fineprint">Se registra tu cita y se abre WhatsApp con la orden lista.</p>
                </div>
              )}
              {step !== 4 && error && <p className="form-error" style={{ marginTop: 12 }}>{error}</p>}
            </form>
          )}

          <aside className="agenda-preview mb-reveal d1">
            <div className="device">
              <div className="device-grid" aria-hidden="true" />
              <span className="device-corner tl" /><span className="device-corner tr" />
              <span className="device-corner bl" /><span className="device-corner br" />
              {maquinaId ? (
                <>
                  <div className="device-machine" key={maquinaId}>
                    <Icon name={machineIcon} className="device-ico" />
                  </div>
                  <div className="device-scan" aria-hidden="true" />
                  <span className="device-label">{maquinaLabel}</span>
                  {done && <span className="device-done"><Icon name="check" /> Registrada</span>}
                </>
              ) : (
                <p className="device-empty">Elige tu máquina<br />para verla aquí</p>
              )}
            </div>

            {includes.length > 0 && (
              <div className="preview-includes">
                <p className="pi-title">{servicioTitulo} · incluye</p>
                <ul>{includes.map((it, i) => <li key={i}><Icon name="check" /><span>{it}</span></li>)}</ul>
              </div>
            )}

            <div className="preview-summary">
              <div><span>Fecha</span><strong>{fecha ? fmtFecha(fecha) : "—"}</strong></div>
              <div><span>Hora</span><strong>{slotLabel || "—"}</strong></div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
