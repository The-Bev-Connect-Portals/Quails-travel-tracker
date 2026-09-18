-- ════════════════════════════════════════════════════════════════════
--  Quail's Travel Log — Supabase schema
--
--  HOW TO USE:
--    1. Go to supabase.com and create a free project
--    2. Open the SQL Editor in the left sidebar
--    3. Paste this whole file in and click Run
--    4. Go to Settings → API, copy your Project URL and anon public key
--    5. Paste those into the CONFIG block at the top of index.html
--    6. Commit and push — Netlify redeploys and cloud accounts are live
-- ════════════════════════════════════════════════════════════════════

-- One row per user holding their entire travel log as JSON.
create table if not exists public.travel_data (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row Level Security: each person can only ever touch their own row.
alter table public.travel_data enable row level security;

drop policy if exists "own row select" on public.travel_data;
create policy "own row select"
  on public.travel_data for select
  using (auth.uid() = user_id);

drop policy if exists "own row insert" on public.travel_data;
create policy "own row insert"
  on public.travel_data for insert
  with check (auth.uid() = user_id);

drop policy if exists "own row update" on public.travel_data;
create policy "own row update"
  on public.travel_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own row delete" on public.travel_data;
create policy "own row delete"
  on public.travel_data for delete
  using (auth.uid() = user_id);

-- Keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists travel_data_touch on public.travel_data;
create trigger travel_data_touch
  before update on public.travel_data
  for each row execute function public.touch_updated_at();


-- ════════════════════════════════════════════════════════════════════
--  OPTIONAL: turn off email confirmation for easier testing
--
--  By default Supabase emails a confirmation link before a new account
--  can sign in. To skip that while testing with family:
--
--    Authentication → Providers → Email → toggle OFF "Confirm email"
--
--  Turn it back on before sharing the app more widely.
-- ════════════════════════════════════════════════════════════════════
