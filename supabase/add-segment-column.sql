-- Add `segment` tracking to both survey tables.
-- A respondent's row gets tagged with the segment from the URL (?segment=...)
-- on the very first save. Examples in use: buyer-30, buyer-180, non-buyer.
-- Run once in the Supabase SQL editor.

alter table public.submissions
  add column if not exists segment text;

alter table public.submissions_v2
  add column if not exists segment text;

create index if not exists submissions_segment_idx    on public.submissions    (segment);
create index if not exists submissions_v2_segment_idx on public.submissions_v2 (segment);
