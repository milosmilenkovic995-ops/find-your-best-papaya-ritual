-- Survey v2 — separate table from v1 `submissions`.
-- Run this once in the Supabase SQL editor for the v2 survey at /v2.

create table if not exists public.submissions_v2 (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  email text,
  klaviyo_id text,
  path_id text not null default 'v2',
  path_name text,
  submitted_via text,            -- 'email' or 'skip'
  coupon_code text,
  discount_label text,
  sorting_answer_id text,        -- reserved for future sorting question
  sorting_answer_label text,
  sorting_free_text text,
  answers jsonb not null default '[]'::jsonb,
  user_agent text,
  referrer text,
  ip_address text
);

create index if not exists submissions_v2_submitted_at_idx
  on public.submissions_v2 (submitted_at desc);

create index if not exists submissions_v2_email_idx
  on public.submissions_v2 (email);

-- Lock down direct anon access; the API route uses the service role key.
alter table public.submissions_v2 enable row level security;
