-- Row Level Security for Habitus
-- Run after 001_schema.sql

-- Enable RLS on all user-scoped tables
alter table public.user_profiles    enable row level security;
alter table public.design_plans     enable row level security;
alter table public.generated_images enable row level security;
alter table public.quote_requests   enable row level security;
alter table public.projects         enable row level security;
alter table public.project_updates  enable row level security;
alter table public.chat_messages    enable row level security;
alter table public.reviews          enable row level security;
alter table public.contractors      enable row level security;

-- user_profiles: each user can read/write their own profile
drop policy if exists "user_profiles self read" on public.user_profiles;
create policy "user_profiles self read"
  on public.user_profiles for select
  using (auth.uid() = id);

drop policy if exists "user_profiles self upsert" on public.user_profiles;
create policy "user_profiles self upsert"
  on public.user_profiles for insert
  with check (auth.uid() = id);

drop policy if exists "user_profiles self update" on public.user_profiles;
create policy "user_profiles self update"
  on public.user_profiles for update
  using (auth.uid() = id);

-- contractors: anyone authenticated can read; writes via service_role only
drop policy if exists "contractors public read" on public.contractors;
create policy "contractors public read"
  on public.contractors for select
  using (true);

-- design_plans: owner-scoped
drop policy if exists "design_plans owner all" on public.design_plans;
create policy "design_plans owner all"
  on public.design_plans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- generated_images: derived from owned plan
drop policy if exists "generated_images via plan" on public.generated_images;
create policy "generated_images via plan"
  on public.generated_images for select
  using (
    plan_id in (select id from public.design_plans where user_id = auth.uid())
  );

-- quote_requests: owner-scoped
drop policy if exists "quote_requests owner all" on public.quote_requests;
create policy "quote_requests owner all"
  on public.quote_requests for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- projects: owner-scoped
drop policy if exists "projects owner read" on public.projects;
create policy "projects owner read"
  on public.projects for select
  using (auth.uid() = user_id);

drop policy if exists "projects owner insert" on public.projects;
create policy "projects owner insert"
  on public.projects for insert
  with check (auth.uid() = user_id);

-- project_updates: read if project owner; writes via service_role only
drop policy if exists "project_updates owner read" on public.project_updates;
create policy "project_updates owner read"
  on public.project_updates for select
  using (
    project_id in (select id from public.projects where user_id = auth.uid())
  );

-- chat_messages: read/insert if project owner (user side).
-- PM messages are inserted by service_role and bypass RLS.
drop policy if exists "chat_messages owner read" on public.chat_messages;
create policy "chat_messages owner read"
  on public.chat_messages for select
  using (
    project_id in (select id from public.projects where user_id = auth.uid())
  );

drop policy if exists "chat_messages owner insert user" on public.chat_messages;
create policy "chat_messages owner insert user"
  on public.chat_messages for insert
  with check (
    sender_type = 'user'
    and project_id in (select id from public.projects where user_id = auth.uid())
  );

-- reviews: owner-scoped, one per project enforced via unique constraint optional
drop policy if exists "reviews owner all" on public.reviews;
create policy "reviews owner all"
  on public.reviews for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
