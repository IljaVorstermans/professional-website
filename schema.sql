-- ============================================================
-- Digital Autonomy Quiz - Supabase schema
-- Run this in the Supabase SQL editor (project > SQL editor > New query)
-- ============================================================

-- ── Profiles ─────────────────────────────────────────────────────────────────
-- One row per user. Extends auth.users with a public display name.
-- Created automatically when a user first saves a score.

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at  timestamptz default now() not null
);

alter table public.profiles enable row level security;

-- Anyone can read profiles (needed for leaderboard display names)
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

-- Users can only create and update their own profile
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);


-- ── Quiz results ─────────────────────────────────────────────────────────────
-- One row per quiz attempt. Stores overall score and per-pillar breakdown.

create table if not exists public.quiz_results (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  score         smallint not null check (score between 0 and 100),
  pillar_scores jsonb not null,   -- e.g. {"Privacy": 72, "Sovereignty": 54, ...}
  dim_scores    jsonb,            -- optional, full dimension breakdown
  created_at    timestamptz default now() not null
);

alter table public.quiz_results enable row level security;

-- Anyone can read results (needed for leaderboard)
create policy "Quiz results are viewable by everyone"
  on public.quiz_results for select using (true);

-- Users can only insert their own results
create policy "Users can insert own results"
  on public.quiz_results for insert with check (auth.uid() = user_id);


-- ── Auto-create profile on first sign-in ─────────────────────────────────────
-- Creates a profile row whenever a new user is confirmed in auth.users.

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    split_part(new.email, '@', 1)  -- default display name: part before @
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── Helpful indexes ───────────────────────────────────────────────────────────
create index if not exists quiz_results_user_id_idx on public.quiz_results(user_id);
create index if not exists quiz_results_score_idx   on public.quiz_results(score desc);
create index if not exists quiz_results_created_idx on public.quiz_results(created_at desc);
