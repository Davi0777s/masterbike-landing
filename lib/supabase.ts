import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con SERVICE ROLE.
 * SOLO se usa del lado del servidor (Route Handlers / Server Actions).
 * Omite RLS → nunca exponer la service role key al navegador.
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltan variables de entorno de Supabase (URL / SERVICE_ROLE_KEY)");
  return createClient(url, key, { auth: { persistSession: false } });
}
