-- Habitus extended schema
-- Run after 001..004. Adds: materials catalog/BOM, style briefs,
-- design options, notifications, ban records.

-- Allow seed reviews that are not tied to a real auth user.
-- Real reviews still set user_id/project_id; seed rows leave them null
-- and provide display_name/avatar_url for the public reviewer surface.
alter table public.reviews alter column user_id drop not null;
alter table public.reviews alter column project_id drop not null;
alter table public.reviews add column if not exists display_name text;
alter table public.reviews add column if not exists avatar_url text;

-- 1) material_catalog: master list of materials (Phase D / Design Studio)
create table if not exists public.material_catalog (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  style_key   text not null,
  slot_key    text not null check (slot_key in ('walls','floor','lighting','kitchen','finishing')),
  category    text not null,
  name        text not null,
  brand       text,
  tier        text not null check (tier in ('basic','standard','premium')),
  unit        text not null,
  qty         int not null default 1,
  unit_price  int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists idx_material_catalog_style on public.material_catalog(style_key, slot_key);

-- 2) material_alternatives: cheaper/pricier swaps for a base item
create table if not exists public.material_alternatives (
  id          uuid primary key default gen_random_uuid(),
  base_id     uuid not null references public.material_catalog(id) on delete cascade,
  name        text not null,
  tier        text not null check (tier in ('basic','standard','premium')),
  unit_price  int not null default 0
);

create index if not exists idx_material_alts_base on public.material_alternatives(base_id);

-- 3) design_plan_materials: BOM snapshot at generation time
create table if not exists public.design_plan_materials (
  id          uuid primary key default gen_random_uuid(),
  plan_id     uuid not null references public.design_plans(id) on delete cascade,
  material_id uuid not null references public.material_catalog(id) on delete restrict,
  variant_idx int not null default 0,
  qty         int not null,
  unit_price  int not null,
  tier        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_plan_materials_plan on public.design_plan_materials(plan_id, variant_idx);

-- 4) style_briefs: style metadata (Phase D / AI keyword matcher in DB)
create table if not exists public.style_briefs (
  style_key   text primary key,
  label       text not null,
  intro       text not null,
  mood_images text[] not null default '{}',
  match_terms text[] not null default '{}'
);

-- 5) design_options: catalog of pickable options in Compose Wizard
create table if not exists public.design_options (
  id          text primary key,
  category    text not null check (category in ('style','tone','flooring','wall','furniture')),
  style_key   text not null,
  name        text not null,
  description text,
  image       text,
  swatch      text,
  sort_order  int not null default 0
);

create index if not exists idx_design_options_category on public.design_options(category, sort_order);

-- 6) notifications: bell icon surface, Realtime-published
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  project_id  uuid references public.projects(id) on delete cascade,
  kind        text not null check (kind in ('quote_received','project_update','pm_message','project_status','review_request')),
  title       text not null,
  body        text,
  unread      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists idx_notifications_user on public.notifications(user_id, unread, created_at desc);

-- 7) ban_records: audit trail for /trust page stats
create table if not exists public.ban_records (
  id            uuid primary key default gen_random_uuid(),
  contractor_id text references public.contractors(id) on delete set null,
  reason        text not null check (reason in ('quote_fraud','abandonment','material_swap','false_license','abuse')),
  notes         text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_ban_records_created on public.ban_records(created_at desc);
create index if not exists idx_ban_records_reason on public.ban_records(reason);

-- 8) cost_benchmark_summary: per-style market comparison
create or replace view public.cost_benchmark_summary as
with plan_totals as (
  select style_key, variant_idx,
         sum(unit_price * qty)::int as our_quote
  from public.material_catalog
  group by style_key, 0
)
select style_key,
       our_quote,
       round(our_quote * 1.36)::int as market_avg,
       round(our_quote * 0.66)::int as lowball_quote
from (
  select style_key, sum(unit_price * qty)::int as our_quote
  from public.material_catalog
  group by style_key
) t;
