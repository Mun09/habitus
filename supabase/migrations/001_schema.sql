-- Habitus core schema
-- Run in order: 001_schema.sql, 002_rls.sql, 003_seed.sql

create extension if not exists pgcrypto;

-- 1) user_profiles: extends auth.users
create table if not exists public.user_profiles (
  id            uuid primary key references auth.users on delete cascade,
  nickname      text,
  phone         text,
  region_key    text check (region_key in ('seoul','gyeonggi','busan','incheon')),
  address       text,
  budget_min    int,
  budget_max    int,
  onboarded_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 2) contractors: licensed/verified pros
create table if not exists public.contractors (
  id                text primary key,
  name              text not null,
  company           text not null,
  licensed          boolean not null default false,
  license_number    text,
  business_number   text,
  region            text not null,
  region_key        text not null check (region_key in ('seoul','gyeonggi','busan','incheon')),
  years_experience  int not null default 0,
  completed_projects int not null default 0,
  rating            numeric(3,2) not null default 0,
  review_count      int not null default 0,
  response_hours    int not null default 24,
  starting_price    int not null default 0,
  badges            text[] not null default '{}',
  bio               text,
  profile_image     text,
  cover             text,
  portfolio         text[] not null default '{}',
  license_docs      text[] not null default '{}',
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);

-- 3) design_plans: AI generation requests + results
create table if not exists public.design_plans (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users on delete cascade,
  style_key           text not null,
  style_label         text,
  selected_option_ids text[] not null default '{}',
  space_image_url     text,
  hero_proposal_url   text,
  proposal_urls       text[] not null default '{}',
  user_reference_urls text[] not null default '{}',
  status              text not null default 'pending'
    check (status in ('pending','generating','done','failed')),
  error_message       text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 4) generated_images: one row per output image
create table if not exists public.generated_images (
  id          uuid primary key default gen_random_uuid(),
  plan_id     uuid not null references public.design_plans on delete cascade,
  space_index int not null default 0,
  before_url  text,
  after_url   text not null,
  prompt      text,
  created_at  timestamptz not null default now()
);

-- 5) quote_requests
create table if not exists public.quote_requests (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users on delete cascade,
  contractor_id   text not null references public.contractors(id) on delete restrict,
  design_plan_id  uuid references public.design_plans(id) on delete set null,
  message         text,
  budget_min      int,
  budget_max      int,
  preferred_start date,
  attach_plan     boolean not null default true,
  status          text not null default 'pending'
    check (status in ('pending','accepted','rejected','quoted','cancelled')),
  created_at      timestamptz not null default now(),
  responded_at    timestamptz
);

-- 6) projects
create table if not exists public.projects (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users on delete cascade,
  contractor_id     text not null references public.contractors(id) on delete restrict,
  quote_request_id  uuid references public.quote_requests(id) on delete set null,
  title             text not null,
  status            text not null default 'pending'
    check (status in ('pending','in_progress','completed','cancelled')),
  progress          int not null default 0 check (progress between 0 and 100),
  current_stage     text not null default 'demolition'
    check (current_stage in ('demolition','plumbing','electrical','carpentry','painting','finishing')),
  start_date        date,
  expected_end      date,
  total_budget      int,
  spent_budget      int,
  address_detail    text,
  pm_name           text,
  pm_role           text,
  pm_avatar         text,
  pm_response_hours int not null default 24,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  completed_at      timestamptz
);

-- 7) project_updates: on-site progress posts
create table if not exists public.project_updates (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects on delete cascade,
  stage       text,
  author      text,
  title       text,
  body        text,
  photos      text[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- 8) chat_messages: PM <-> user chat, subscribed via Realtime
create table if not exists public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects on delete cascade,
  sender_type text not null check (sender_type in ('user','pm','ai','system')),
  sender_id   uuid,
  body        text not null,
  attachments text[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- 9) reviews
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects on delete cascade,
  user_id       uuid not null references auth.users on delete cascade,
  contractor_id text not null references public.contractors(id) on delete restrict,
  rating        numeric(3,2) not null check (rating between 0 and 5),
  title         text,
  body          text,
  photos        text[] not null default '{}',
  created_at    timestamptz not null default now()
);

-- Realtime: enable for chat_messages and project_updates
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.project_updates;
alter publication supabase_realtime add table public.projects;

-- Indexes for common lookups
create index if not exists idx_design_plans_user on public.design_plans(user_id, created_at desc);
create index if not exists idx_quote_requests_user on public.quote_requests(user_id, created_at desc);
create index if not exists idx_quote_requests_contractor on public.quote_requests(contractor_id, status);
create index if not exists idx_projects_user on public.projects(user_id, created_at desc);
create index if not exists idx_project_updates_project on public.project_updates(project_id, created_at desc);
create index if not exists idx_chat_messages_project on public.chat_messages(project_id, created_at);
create index if not exists idx_contractors_region on public.contractors(region_key, is_active);

-- Trigger: keep user_profiles.updated_at and projects.updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_user_profiles on public.user_profiles;
create trigger touch_user_profiles before update on public.user_profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_projects on public.projects;
create trigger touch_projects before update on public.projects
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_design_plans on public.design_plans;
create trigger touch_design_plans before update on public.design_plans
  for each row execute function public.touch_updated_at();
