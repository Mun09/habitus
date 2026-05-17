-- RLS for tables introduced in 005_extended_schema.sql
-- Run after 005.

alter table public.material_catalog       enable row level security;
alter table public.material_alternatives  enable row level security;
alter table public.design_plan_materials  enable row level security;
alter table public.style_briefs           enable row level security;
alter table public.design_options         enable row level security;
alter table public.notifications          enable row level security;
alter table public.ban_records            enable row level security;

-- Reference catalogs: public read, writes via service_role only.
drop policy if exists "material_catalog public read" on public.material_catalog;
create policy "material_catalog public read"
  on public.material_catalog for select using (true);

drop policy if exists "material_alternatives public read" on public.material_alternatives;
create policy "material_alternatives public read"
  on public.material_alternatives for select using (true);

drop policy if exists "style_briefs public read" on public.style_briefs;
create policy "style_briefs public read"
  on public.style_briefs for select using (true);

drop policy if exists "design_options public read" on public.design_options;
create policy "design_options public read"
  on public.design_options for select using (true);

-- ban_records: public read so /trust can render aggregate stats.
drop policy if exists "ban_records public read" on public.ban_records;
create policy "ban_records public read"
  on public.ban_records for select using (true);

-- design_plan_materials: owner-scoped via parent plan ownership.
drop policy if exists "design_plan_materials owner read" on public.design_plan_materials;
create policy "design_plan_materials owner read"
  on public.design_plan_materials for select
  using (
    plan_id in (select id from public.design_plans where user_id = auth.uid())
  );

drop policy if exists "design_plan_materials owner insert" on public.design_plan_materials;
create policy "design_plan_materials owner insert"
  on public.design_plan_materials for insert
  with check (
    plan_id in (select id from public.design_plans where user_id = auth.uid())
  );

-- notifications: owner read + owner update (for marking read).
-- Inserts only via service_role (admin actions / system triggers).
drop policy if exists "notifications owner read" on public.notifications;
create policy "notifications owner read"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "notifications owner update" on public.notifications;
create policy "notifications owner update"
  on public.notifications for update
  using (auth.uid() = user_id);
