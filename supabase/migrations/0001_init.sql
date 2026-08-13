-- =====================================================================
-- Master Bike — Sistema de agenda automatizada
-- Migración 0001: modelo de datos inicial (brief §2.1)
-- Independiente del framework. Se aplica en Supabase antes de construir
-- el frontend/backend.
-- =====================================================================

-- ------------------------- ENUMS -------------------------
create type tipo_maquina as enum
  ('caminadora','eliptica','estatica','spinning','escalador','remo','fuerza','otra');

create type tipo_servicio as enum
  ('preventivo','correctivo','revision','ensamble');

create type estado_cita as enum
  ('pendiente','confirmado','reprogramado','completado','cancelado');

-- ------------------------- CLIENTES -------------------------
create table clientes (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  telefono    text not null,            -- WhatsApp, formato internacional (57...)
  direccion   text,
  zona        text,                     -- Ibagué, El Espinal, Girardot, ...
  notas       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create unique index clientes_telefono_idx on clientes (telefono);

-- ------------------------- MÁQUINAS -------------------------
create table maquinas (
  id                    uuid primary key default gen_random_uuid(),
  cliente_id            uuid not null references clientes(id) on delete cascade,
  tipo                  tipo_maquina not null,
  marca_modelo          text,
  fecha_ultimo_servicio date,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index maquinas_cliente_idx on maquinas (cliente_id);

-- ------------------------- CITAS -------------------------
create table citas (
  id              uuid primary key default gen_random_uuid(),
  cliente_id      uuid not null references clientes(id) on delete cascade,
  maquina_id      uuid references maquinas(id) on delete set null,
  fecha_hora      timestamptz not null,
  duracion_min    int not null default 60,     -- para no cruzar citas en el calendario
  tipo_servicio   tipo_servicio not null,
  estado          estado_cita not null default 'pendiente',
  google_event_id text,                        -- id del evento en Google Calendar
  notas           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index citas_fecha_idx   on citas (fecha_hora);
create index citas_estado_idx  on citas (estado);
create index citas_cliente_idx on citas (cliente_id);

-- ------------------------- PLANTILLAS DE MENSAJES -------------------------
-- Textos de los WhatsApp automáticos, editables sin tocar código.
-- Variables soportadas: {{nombre}} {{fecha}} {{maquina}} {{servicio}} {{zona}}
create table plantillas_mensajes (
  clave       text primary key,   -- confirmacion | recordatorio_24h | proximo_mantenimiento | seguimiento
  titulo      text not null,
  contenido   text not null,
  activo      boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- ------------------------- TRIGGER updated_at -------------------------
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger t_clientes_updated   before update on clientes             for each row execute function set_updated_at();
create trigger t_maquinas_updated   before update on maquinas             for each row execute function set_updated_at();
create trigger t_citas_updated      before update on citas                for each row execute function set_updated_at();
create trigger t_plantillas_updated before update on plantillas_mensajes  for each row execute function set_updated_at();

-- ------------------------- SEED: plantillas por defecto (brief §4) -------------------------
insert into plantillas_mensajes (clave, titulo, contenido) values
('confirmacion', 'Confirmación de cita',
 'Hola {{nombre}} 👋 Tu cita de *{{servicio}}* para tu {{maquina}} quedó agendada para el *{{fecha}}*. Aquí mismo te confirmo. — Yovani, Master Bike'),
('recordatorio_24h', 'Recordatorio 24h antes',
 'Hola {{nombre}}, te recuerdo tu cita de *{{servicio}}* mañana *{{fecha}}* para tu {{maquina}}. ¿La confirmas? Responde SÍ, o escríbeme para reprogramar.'),
('proximo_mantenimiento', 'Aviso de próximo mantenimiento',
 'Hola {{nombre}} 👋 Tu {{maquina}} ya está para su próximo mantenimiento. ¿Te agendo? Respóndeme y coordinamos. — Master Bike'),
('seguimiento', 'Seguimiento post-servicio',
 'Hola {{nombre}}, ¿quedó todo bien con tu {{maquina}}? Si te sirvió, me ayudarías muchísimo con una reseña 🙏. Cualquier cosa, aquí estoy.');

-- ------------------------- RLS (seguridad) -------------------------
-- El backend (Next.js API routes / n8n) usará la SERVICE ROLE KEY del lado del
-- servidor, que omite RLS. Activamos RLS y NO creamos políticas públicas:
-- nada queda accesible con la anon key desde el navegador.
alter table clientes            enable row level security;
alter table maquinas            enable row level security;
alter table citas               enable row level security;
alter table plantillas_mensajes enable row level security;
