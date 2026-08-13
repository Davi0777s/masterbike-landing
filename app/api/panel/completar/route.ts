import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/panel-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const id = String(body.id ?? "");
  const estado = String(body.estado ?? "completado");
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });
  const validos = ["pendiente", "confirmado", "completado", "cancelado"];
  if (!validos.includes(estado)) return NextResponse.json({ error: "estado inválido" }, { status: 400 });

  try {
    const sb = supabaseAdmin();
    const { data: cita } = await sb.from("citas").select("id, maquina_id, fecha_hora").eq("id", id).single();
    await sb.from("citas").update({ estado }).eq("id", id);
    // Al completar: actualiza la fecha de último servicio de la máquina (ciclo de mantenimiento)
    if (estado === "completado" && cita?.maquina_id) {
      const fecha = new Date(cita.fecha_hora as string).toISOString().split("T")[0];
      await sb.from("maquinas").update({ fecha_ultimo_servicio: fecha }).eq("id", cita.maquina_id);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message ?? "error" }, { status: 500 });
  }
}
