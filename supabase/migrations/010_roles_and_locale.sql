-- Phase 1: user roles + locale preference
-- Run after 009_indexes.sql

-- Add role + locale columns to user_profiles.
-- role distinguishes customers from contractors from admins (used for
-- post-login routing in src/app/auth/callback/route.ts and for the
-- admin RLS policies below). locale persists the user's chosen UI
-- language and is mirrored from a 'habitus_locale' cookie on sign-in.
alter table public.user_profiles
  add column if not exists role text not null default 'customer'
    check (role in ('customer','contractor','admin')),
  add column if not exists locale text not null default 'en'
    check (locale in ('en','ko'));

create index if not exists idx_user_profiles_role on public.user_profiles(role);

-- Admin RLS: a user with role='admin' can read every user_profiles row.
-- This is what powers the Phase 2 admin customer list. Existing self
-- read/write policies remain in place (RLS combines policies with OR).
drop policy if exists "user_profiles admin read" on public.user_profiles;
create policy "user_profiles admin read"
  on public.user_profiles for select
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.role = 'admin'
    )
  );
