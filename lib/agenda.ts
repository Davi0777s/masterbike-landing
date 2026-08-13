import { supabaseAdmin } from "./supabase";

// Colombia no tiene horario de verano → offset fijo -05:00
const TZ = "-05:00";
const OPEN = 8;   // 8:00 am
const CLOSE = 18; // hasta las 6:00 pm (último slot inicia 17:00)
export const SLOT_MIN = 60;

export type Slot = { iso: string; label: string; hour: number };

function label12(h: number): string {
  const ampm = h < 12 ? "am" : "pm";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:00 ${ampm}`;
}

/** ISO UTC del inicio de un slot (hora local Bogotá) para una fecha YYYY-MM-DD. */
function slotIso(fecha: string, hour: number): string {
  return new Date(`${fecha}T${String(hour).padStart(2, "0")}:00:00${TZ}`).toISOString();
}

/** Slots base del día (vacío si es domingo). No mira ocupación aún. */
export function baseSlots(fecha: string): Slot[] {
  const dow = new Date(`${fecha}T12:00:00Z`).getUTCDay(); // 0=domingo … 6=sábado
  if (dow === 0) return [];
  const out: Slot[] = [];
  for (let h = OPEN; h < CLOSE; h++) out.push({ hour: h, label: label12(h), iso: slotIso(fecha, h) });
  return out;
}

/** Slots realmente disponibles: quita los ocupados (Supabase) y los pasados. */
export async function availableSlots(fecha: string): Promise<Slot[]> {
  const slots = baseSlots(fecha);
  if (!slots.length) return [];
  const sb = supabaseAdmin();
  const dayStart = new Date(`${fecha}T00:00:00${TZ}`);
  const dayEnd = new Date(dayStart);
  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

  const { data, error } = await sb
    .from("citas")
    .select("fecha_hora")
    .neq("estado", "cancelado")
    .gte("fecha_hora", dayStart.toISOString())
    .lt("fecha_hora", dayEnd.toISOString());
  if (error) throw error;

  const taken = new Set((data ?? []).map((r) => new Date(r.fecha_hora as string).toISOString()));
  const now = Date.now();
  return slots.filter((s) => !taken.has(s.iso) && new Date(s.iso).getTime() > now);
}

/** Verifica que un slot específico siga libre (anti doble-reserva al confirmar). */
export async function slotStillFree(iso: string): Promise<boolean> {
  const sb = supabaseAdmin();
  const { count, error } = await sb
    .from("citas")
    .select("id", { count: "exact", head: true })
    .neq("estado", "cancelado")
    .eq("fecha_hora", iso);
  if (error) throw error;
  return (count ?? 0) === 0;
}
