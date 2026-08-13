import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { slotStillFree } from "@/lib/agenda";

export const dynamic = "force-dynamic";

const MAQUINAS = ["caminadora", "eliptica", "estatica", "spinning", "escalador", "remo", "fuerza", "otra"];
const SERVICIOS = ["preventivo", "correctivo", "revision", "ensamble"];

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  const maquinaId = String(body.maquinaId ?? "");
  const servicioId = String(body.servicioId ?? "");
  const fechaHora = String(body.fechaHora ?? "");
  const nombre = String(body.nombre ?? "").trim();
  const telefono = String(body.telefono ?? "").replace(/\D/g, "");
  const notas = String(body.notas ?? "").trim() || null;

  if (!MAQUINAS.includes(maquinaId)) return NextResponse.json({ error: "máquina inválida" }, { status: 400 });
  if (!SERVICIOS.includes(servicioId)) return NextResponse.json({ error: "servicio inválido" }, { status: 400 });
  if (!nombre) return NextResponse.json({ error: "nombre requerido" }, { status: 400 });
  if (telefono.length < 7) return NextResponse.json({ error: "teléfono inválido" }, { status: 400 });
  const t = new Date(fechaHora);
  if (isNaN(t.getTime())) return NextResponse.json({ error: "fecha/hora inválida" }, { status: 400 });
  const iso = t.toISOString();

  try {
    const sb = supabaseAdmin();

    // anti doble-reserva
    if (!(await slotStillFree(iso))) {
      return NextResponse.json({ error: "ocupado", message: "Ese horario acaba de ocuparse. Elige otro." }, { status: 409 });
    }

    // cliente (upsert por teléfono)
    let clienteId: string;
    const { data: existing } = await sb.from("clientes").select("id").eq("telefono", telefono).maybeSingle();
    if (existing) {
      clienteId = existing.id as string;
      await sb.from("clientes").update({ nombre }).eq("id", clienteId);
    } else {
      const { data: nuevo, error } = await sb.from("clientes").insert({ nombre, telefono }).select("id").single();
      if (error) throw error;
      clienteId = nuevo.id as string;
    }

    // máquina (reusar por cliente+tipo, o crear)
    let maquinaDbId: string;
    const { data: maq } = await sb.from("maquinas").select("id").eq("cliente_id", clienteId).eq("tipo", maquinaId).maybeSingle();
    if (maq) {
      maquinaDbId = maq.id as string;
    } else {
      const { data: nm, error } = await sb.from("maquinas").insert({ cliente_id: clienteId, tipo: maquinaId }).select("id").single();
      if (error) throw error;
      maquinaDbId = nm.id as string;
    }

    // cita
    const { data: cita, error: ce } = await sb.from("citas").insert({
      cliente_id: clienteId,
      maquina_id: maquinaDbId,
      fecha_hora: iso,
      duracion_min: 60,
      tipo_servicio: servicioId,
      estado: "pendiente",
      notas,
    }).select("id").single();
    if (ce) throw ce;

    return NextResponse.json({ ok: true, citaId: cita.id });
  } catch (e) {
    return NextResponse.json({ error: "server", message: (e as Error).message ?? "error" }, { status: 500 });
  }
}
