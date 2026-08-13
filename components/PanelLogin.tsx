"use client";
import { useState } from "react";

export default function PanelLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    const r = await fetch("/api/panel/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (r.ok) location.reload();
    else { setErr("Contraseña incorrecta."); setLoading(false); }
  }

  return (
    <main className="panel-login">
      <form className="panel-login-card" onSubmit={submit}>
        <h1>Panel Master Bike</h1>
        <p>Acceso solo para el técnico.</p>
        <label htmlFor="pw">Contraseña</label>
        <input id="pw" type="password" value={pw} autoFocus onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />
        {err && <p className="form-error">{err}</p>}
        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
