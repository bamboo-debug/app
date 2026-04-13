create extension if not exists "pgcrypto";
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  area text,
  points int not null default 20,
  streak_days int not null default 0,
  created_at timestamptz not null default now()
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
  created_at timestamptz not null default now()
);
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('taller','curso','blog','reto','evento')),
  date_label text,
  xp_reward int not null default 0,
  status text not null default 'upcoming',
  created_at timestamptz not null default now()
);
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  summary text,
  body text,
  tag text,
  status text not null default 'draft' check (status in ('draft','published')),
  xp_reward int not null default 120,
  created_at timestamptz not null default now()
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
create or replace function public.handle_new_user() returns trigger language plpgsql security definer as $$ begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
alter table public.profiles enable row level security;
alter table public.blog_posts enable row level security;
alter table public.points_ledger enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can read published blog posts" on public.blog_posts for select using (status = 'published' or auth.uid() = author_id);
create policy "Users can insert own blog drafts" on public.blog_posts for insert with check (auth.uid() = author_id);
create policy "Users can view own ledger" on public.points_ledger for select using (auth.uid() = profile_id);
