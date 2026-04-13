create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  area text,
  points int not null default 20,
  streak_days int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  month_label text,
  theme text,
  level_required int not null default 1,
  xp_reward int not null default 100,
  lessons_count int not null default 1,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('taller','curso','blog','reto','evento')),
  date_label text,
  xp_reward int not null default 0,
  status text not null default 'upcoming',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  summary text,
  body text,
  tag text,
  status text not null default 'draft' check (status in ('draft','published')),
  xp_reward int not null default 250,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_submissions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  title text not null,
  topic text,
  summary text not null,
  content text not null,
  status text not null default 'draft' check (status in ('draft','submitted','approved','rejected')),
  review_email text default 'bamboo@texo.com.py',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.module_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  completed_sections text[] not null default '{}',
  exercise_completed boolean not null default false,
  quiz_answered boolean not null default false,
  quiz_correct boolean,
  completed boolean not null default false,
  earned_points int not null default 0,
  updated_at timestamptz not null default now(),
  unique(profile_id, module_id)
);

create table if not exists public.points_ledger (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  source_type text not null,
  source_id uuid,
  description text not null,
  points int not null,
  created_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists modules_set_updated_at on public.modules;
create trigger modules_set_updated_at
before update on public.modules
for each row execute procedure public.set_updated_at();

drop trigger if exists activities_set_updated_at on public.activities;
create trigger activities_set_updated_at
before update on public.activities
for each row execute procedure public.set_updated_at();

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute procedure public.set_updated_at();

drop trigger if exists blog_submissions_set_updated_at on public.blog_submissions;
create trigger blog_submissions_set_updated_at
before update on public.blog_submissions
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_submissions enable row level security;
alter table public.module_progress enable row level security;
alter table public.points_ledger enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

drop policy if exists "Users can read published blog posts" on public.blog_posts;
create policy "Users can read published blog posts"
on public.blog_posts for select
using (status = 'published' or auth.uid() = author_id);

drop policy if exists "Users can insert own blog drafts" on public.blog_posts;
create policy "Users can insert own blog drafts"
on public.blog_posts for insert
with check (auth.uid() = author_id);

drop policy if exists "Users can read own submissions" on public.blog_submissions;
create policy "Users can read own submissions"
on public.blog_submissions for select
using (auth.uid() = profile_id);

drop policy if exists "Users can insert own submissions" on public.blog_submissions;
create policy "Users can insert own submissions"
on public.blog_submissions for insert
with check (auth.uid() = profile_id);

drop policy if exists "Users can update own draft submissions" on public.blog_submissions;
create policy "Users can update own draft submissions"
on public.blog_submissions for update
using (auth.uid() = profile_id);

drop policy if exists "Users can view own module progress" on public.module_progress;
create policy "Users can view own module progress"
on public.module_progress for select
using (auth.uid() = profile_id);

drop policy if exists "Users can insert own module progress" on public.module_progress;
create policy "Users can insert own module progress"
on public.module_progress for insert
with check (auth.uid() = profile_id);

drop policy if exists "Users can update own module progress" on public.module_progress;
create policy "Users can update own module progress"
on public.module_progress for update
using (auth.uid() = profile_id);

drop policy if exists "Users can view own ledger" on public.points_ledger;
create policy "Users can view own ledger"
on public.points_ledger for select
using (auth.uid() = profile_id);
