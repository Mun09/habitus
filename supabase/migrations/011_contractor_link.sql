-- Phase 3: link auth user to a contractor row + contractor-side RLS
-- Run after 010_roles_and_locale.sql

-- 1) Add the FK so a user_profiles row can claim a contractor identity.
alter table public.user_profiles
  add column if not exists contractor_id text
    references public.contractors(id) on delete set null;

create index if not exists idx_user_profiles_contractor
  on public.user_profiles(contractor_id);

-- Helper: is the current request authenticated as the contractor that
-- owns the given contractor_id? Wrapped as a SQL function so RLS
-- policies stay readable. Returns false when auth.uid() is null or the
-- profile row is missing.
create or replace function public.is_contractor_for(_contractor_id text)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid()
      and up.role = 'contractor'
      and up.contractor_id = _contractor_id
  );
$$;

-- 2) projects: contractor for the row can read + update their assigned
-- projects. Customer-owner policies from 002_rls.sql stay in place;
-- Postgres OR-combines policies.
drop policy if exists "projects contractor read" on public.projects;
create policy "projects contractor read"
  on public.projects for select
  using (public.is_contractor_for(contractor_id));

drop policy if exists "projects contractor update" on public.projects;
create policy "projects contractor update"
  on public.projects for update
  using (public.is_contractor_for(contractor_id))
  with check (public.is_contractor_for(contractor_id));

-- 3) project_updates: contractor can read + insert for their projects.
drop policy if exists "project_updates contractor read" on public.project_updates;
create policy "project_updates contractor read"
  on public.project_updates for select
  using (
    project_id in (
      select id from public.projects
      where public.is_contractor_for(contractor_id)
    )
  );

drop policy if exists "project_updates contractor insert" on public.project_updates;
create policy "project_updates contractor insert"
  on public.project_updates for insert
  with check (
    project_id in (
      select id from public.projects
      where public.is_contractor_for(contractor_id)
    )
  );

-- 4) chat_messages: contractor can read + insert (as sender_type='pm')
-- for their projects. Customer reads already covered by 002_rls.sql.
drop policy if exists "chat_messages contractor read" on public.chat_messages;
create policy "chat_messages contractor read"
  on public.chat_messages for select
  using (
    project_id in (
      select id from public.projects
      where public.is_contractor_for(contractor_id)
    )
  );

drop policy if exists "chat_messages contractor insert" on public.chat_messages;
create policy "chat_messages contractor insert"
  on public.chat_messages for insert
  with check (
    sender_type = 'pm'
    and project_id in (
      select id from public.projects
      where public.is_contractor_for(contractor_id)
    )
  );
