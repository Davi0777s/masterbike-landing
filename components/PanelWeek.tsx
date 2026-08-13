"use client";
import { useState } from "react";

export type Cita = {
  id: string;
  fecha_hora: string;
  tipo_servicio: string;
  estado: string;
  notas: string | null;
  clientes: { nombre: string; telefono: string; zona: string | null } | null;
  maquinas: { tipo: string; marca_modelo: string | null } | null;
};

const DAY_NAMES: Record<number, string> = { 1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado" };
const SERVICIO: Record<string, string> = { preventivo: "Preventivo", correctivo: "Correctivo", revision: "Revisión", ensamble: "Ensamble" };
const MAQUINA: Record<string, string> = { caminadora: "Caminadora", eliptica: "Elíptica", estatica: "Bici estática", spinning: "Spinning", escalador: "Escalador", remo: "Remo", fuerza: "Multigimnasio", otra: "Otra" };

function bogota(iso: string) { return new Date(new Date(iso).getTime() - 5 * 3600 * 1000); }
function hora12(iso: string) {
  const h = bogota(iso).getUTCHours();
  return `${((h + 11) % 12) + 1}:00 ${h < 12 ? "am" : "pm"}`;
}
function badgeClass(estado: string) {
  if (estado === "completado") return "badge badge-ok";
  if (estado === "cancelado") return "badge badge-urgent";
  return "badge badge-pending";
}

export default function PanelWeek({ citas: initial }: { citas: Cita[] }) {
  const [citas, setCitas] = useState<Cita[]>(initial);
  const [busy, setBusy] = useState<string | null>(null);

  const activas = citas.filter((c) => c.estado !== "cancelado");
  const metrics = {
    total: activas.length,
    pend: activas.filter((c) => c.estado === "pendiente" || c.estado === "confirmado").length,
    comp: activas.filter((c) => c.estado === "completado").length,
  };

  async function completar(id: string) {
    setBusy(id);
    const r = await fetch("/api/panel/completar", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado: "completado" }),
    });
    if (r.ok) setCitas((cs) => cs.map((c) => (c.id === id ? { ...c, estado: "completado" } : c)));
    setBusy(null);
  }
  async function logout() { await fetch("/api/panel/logout", { method: "POST" }); location.reload(); }

  const dias = [1, 2, 3, 4, 5, 6].map((d) => ({
    d,
    citas: citas.filter((c) => bogota(c.fecha_hora).getUTCDay() === d).sort((a, b) => a.fecha_hora.localeCompare(b.fecha_hora)),
  }));

  return (
    <main className="panel">
      <div className="container">
        <header className="panel-top">
          <div>
            <p className="panel-kicker">Panel del técnico</p>
            <h1>Tu semana</h1>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Salir</button>
        </header>

        <div className="panel-metrics">
          <div className="pm"><span className="pm-num">{metrics.total}</span><span className="pm-lbl">citas esta semana</span></div>
          <div className="pm"><span className="pm-num" style={{ color: "var(--ambar)" }}>{metrics.pend}</span><span className="pm-lbl">por confirmar / hacer</span></div>
          <div className="pm"><span className="pm-num" style={{ color: "var(--verde-ok)" }}>{metrics.comp}</span><span className="pm-lbl">completadas</span></div>
        </div>

        <div className="panel-days">
          {dias.map(({ d, citas: dc }) => (
            <section key={d} className="panel-day">
              <h2>{DAY_NAMES[d]} <span>{dc.length ? `· ${dc.length}` : ""}</span></h2>
              {dc.length === 0 ? (
                <p className="panel-empty">Sin citas.</p>
              ) : (
                dc.map((c) => (
                  <article key={c.id} className={"panel-cita" + (c.estado === "completado" ? " done" : "")}>
                    <div className="pc-time">{hora12(c.fecha_hora)}</div>
                    <div className="pc-body">
                      <p className="pc-cliente">{c.clientes?.nombre ?? "—"}
                        {c.clientes?.telefono && <a className="pc-tel" href={`https://wa.me/${c.clientes.telefono}`} target="_blank" rel="noopener">WhatsApp</a>}
                      </p>
                      <p className="pc-meta">{MAQUINA[c.maquinas?.tipo ?? ""] ?? c.maquinas?.tipo} · {SERVICIO[c.tipo_servicio] ?? c.tipo_servicio}{c.clientes?.zona ? ` · ${c.clientes.zona}` : ""}</p>
                      {c.notas && <p className="pc-notas">{c.notas}</p>}
                    </div>
                    <div className="pc-side">
                      <span className={badgeClass(c.estado)}>{c.estado}</span>
                      {c.estado !== "completado" && c.estado !== "cancelado" && (
                        <button className="btn btn-primary btn-sm" disabled={busy === c.id} onClick={() => completar(c.id)}>
                          {busy === c.id ? "…" : "Completar"}
                        </button>
                      )}
                    </div>
                  </article>
                ))
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
