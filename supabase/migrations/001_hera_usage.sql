-- Tabla de uso por brand (para facturación y analytics)
create table if not exists hera_usage (
  id bigint generated always as identity primary key,
  brand text not null,
  session_id text not null,
  message_count int not null default 0,
  source_url text,
  ip_hash text,
  created_at timestamptz not null default now()
);

-- Índices para queries frecuentes
create index if not exists idx_hera_usage_brand on hera_usage (brand);
create index if not exists idx_hera_usage_created on hera_usage (created_at);
create index if not exists idx_hera_usage_brand_month on hera_usage (brand, created_at);

-- Tabla de conversaciones (si no existe ya)
create table if not exists hera_conversations (
  id bigint generated always as identity primary key,
  session_id text not null,
  brand text not null,
  messages jsonb not null default '[]',
  lead_data jsonb,
  source_url text,
  source_lang text default 'es',
  user_agent text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_hera_conv_brand on hera_conversations (brand);
create index if not exists idx_hera_conv_session on hera_conversations (session_id);

-- Vista resumen de uso mensual por brand
create or replace view hera_usage_monthly as
select
  brand,
  date_trunc('month', created_at) as month,
  count(*) as total_requests,
  count(distinct session_id) as unique_sessions,
  count(distinct ip_hash) as unique_users,
  sum(message_count) as total_messages
from hera_usage
group by brand, date_trunc('month', created_at)
order by month desc, brand;
