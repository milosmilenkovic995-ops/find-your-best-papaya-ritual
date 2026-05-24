-- Partial-capture schema — wipes existing tables and recreates with session tracking.
-- Run this once in the Supabase SQL editor (https://supabase.com/dashboard/project/kujqsxhcghtlbmlgjzoo/sql/new).
-- After this runs: every visitor gets one row that's UPDATED as they advance through the survey.
-- A row stays around even if the visitor abandons mid-survey.

-- Cleanup: drop the orphan table from the other agent's failed work
drop table if exists public.wheel_codes;

-- Optional helper table from old setup — also remove
drop table if exists public.events;

-- v1 SURVEY TABLE
drop table if exists public.submissions;
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,                   -- stable per-visit, set by client
  created_at timestamptz not null default now(),     -- first save
  submitted_at timestamptz not null default now(),   -- last save (renamed semantics: latest activity)
  completed boolean not null default false,          -- true once final step submits
  last_step int,                                     -- which question they reached (1..N)
  email text,
  klaviyo_id text,
  path_id text not null default 'main_v2',
  path_name text,
  submitted_via text,
  coupon_code text,
  discount_label text,
  sorting_answer_id text,
  sorting_answer_label text,
  sorting_free_text text,
  answers jsonb not null default '[]'::jsonb,
  user_agent text,
  referrer text,
  ip_address text
);

create index submissions_submitted_at_idx on public.submissions (submitted_at desc);
create index submissions_completed_idx on public.submissions (completed);
create index submissions_session_id_idx on public.submissions (session_id);
alter table public.submissions enable row level security;

-- v2 SURVEY TABLE
drop table if exists public.submissions_v2;
create table public.submissions_v2 (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  created_at timestamptz not null default now(),
  submitted_at timestamptz not null default now(),
  completed boolean not null default false,
  last_step int,
  email text,
  klaviyo_id text,
  path_id text not null default 'v2',
  path_name text,
  submitted_via text,
  coupon_code text,
  discount_label text,
  sorting_answer_id text,
  sorting_answer_label text,
  sorting_free_text text,
  answers jsonb not null default '[]'::jsonb,
  user_agent text,
  referrer text,
  ip_address text
);

create index submissions_v2_submitted_at_idx on public.submissions_v2 (submitted_at desc);
create index submissions_v2_completed_idx on public.submissions_v2 (completed);
create index submissions_v2_session_id_idx on public.submissions_v2 (session_id);
alter table public.submissions_v2 enable row level security;
