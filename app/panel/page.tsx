import { isAuthed } from "@/lib/panel-auth";
import { supabaseAdmin } from "@/lib/supabase";
import PanelLogin from "@/components/PanelLogin";
import PanelWeek, { type Cita } from "@/components/PanelWeek";

export const dynamic = "force-dynamic";
export const metadata = { title: "Panel — Master Bike", robots: { index: false, follow: false } };

function weekRange() {
  const b = new Date(Date.now() - 5 * 3600 * 1000); // campos UTC = hora de pared Bogotá
  const y = b.getUTCFullYear(), mo = b.getUTCMonth(), d = b.getUTCDate(), dow = b.getUTCDay();
  const toMon = dow === 0 ? -6 : 1 - dow;
  const start = new Date(Date.UTC(y, mo, d + toMon, 5, 0, 0)); // lunes 00:00 Bogotá = 05:00 UTC
  const end = new Date(start); end.setUTCDate(end.getUTCDate() + 7);
  return { startISO: start.toISOString(), endISO: end.toISOString() };
}

export default async function PanelPage() {
  if (!(await isAuthed())) return <PanelLogin />;

  const { startISO, endISO } = weekRange();
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("citas")
    .select("id, fecha_hora, tipo_servicio, estado, notas, clientes(nombre, telefono, zona), maquinas(tipo, marca_modelo)")
    .gte("fecha_hora", startISO)
    .lt("fecha_hora", endISO)
    .order("fecha_hora");

  return <PanelWeek citas={(data ?? []) as unknown as Cita[]} />;
}
