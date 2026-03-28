-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  push_subscription jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Quotes table
create table public.quotes (
  id serial primary key,
  text text not null,
  author text not null,
  source text
);

-- Quotes are readable by everyone (no RLS needed, public data)
alter table public.quotes enable row level security;

create policy "Quotes are publicly readable"
  on public.quotes for select
  to authenticated, anon
  using (true);

-- Flips table
create table public.flips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  quote_id integer references public.quotes(id) not null,
  flipped_on date not null,
  created_at timestamptz default now() not null
);

-- One flip per user per day
create unique index flips_user_date_unique on public.flips (user_id, flipped_on);

-- Enable RLS
alter table public.flips enable row level security;

-- Users can read their own flips
create policy "Users can view own flips"
  on public.flips for select
  using (auth.uid() = user_id);

-- Users can insert their own flips
create policy "Users can insert own flips"
  on public.flips for insert
  with check (auth.uid() = user_id);

-- Deterministic quote selection function for anonymous users
create or replace function public.quote_for_date(target_date text)
returns table(id integer, text text, author text) as $$
begin
  return query
    select q.id, q.text, q.author
    from public.quotes q
    order by md5(q.id::text || target_date)
    limit 1;
end;
$$ language plpgsql security definer;
