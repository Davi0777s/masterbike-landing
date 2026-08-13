-- Master Bike — Migración 0002: endurecimiento de seguridad
-- Fija un search_path explícito en la función de trigger (advisor de Supabase).
alter function public.set_updated_at() set search_path = '';
