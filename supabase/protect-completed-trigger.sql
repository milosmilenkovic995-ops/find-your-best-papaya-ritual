-- Run this once in the Supabase SQL editor to fix the race condition where
-- a late partial-save was overwriting a completed survey row.
--
-- Effect: once a row's `completed` flips to true, no subsequent update can
-- demote it back to false, and the completion's metadata (coupon, email,
-- submitted_via, discount_label) is preserved against null overwrites from
-- partial saves. `last_step` always reflects the furthest step reached.

create or replace function public.protect_completed_status()
returns trigger as $$
begin
  if old.completed = true then
    new.completed       := true;
    new.coupon_code     := coalesce(new.coupon_code,     old.coupon_code);
    new.discount_label  := coalesce(new.discount_label,  old.discount_label);
    new.email           := coalesce(new.email,           old.email);
    new.submitted_via   := coalesce(new.submitted_via,   old.submitted_via);
    new.last_step       := greatest(coalesce(new.last_step, 0), coalesce(old.last_step, 0));
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists submissions_protect_completed on public.submissions;
create trigger submissions_protect_completed
  before update on public.submissions
  for each row execute function public.protect_completed_status();

drop trigger if exists submissions_v2_protect_completed on public.submissions_v2;
create trigger submissions_v2_protect_completed
  before update on public.submissions_v2
  for each row execute function public.protect_completed_status();
