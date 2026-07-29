-- ====================================================================
-- HAVENLY — SUPABASE DATABASE SETUP SCHEMA
-- Copy and run these queries in your Supabase SQL Editor to create
-- the required tables, indexes, and RLS policies.
-- ====================================================================

-- 1. Create the properties catalog table
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check(char_length(title) between 5 and 100),
  description text not null check(char_length(description) between 30 and 3000),
  price numeric(14,2) not null check(price > 0),
  purpose text not null check(purpose in('sale','rent')),
  property_type text not null check(property_type in('house','apartment','villa','townhouse','land','commercial')),
  bedrooms int not null default 0 check(bedrooms between 0 and 100),
  bathrooms int not null default 0 check(bathrooms between 0 and 100),
  kitchen int not null default 0,
  parking int not null default 0,
  square_feet int not null check(square_feet >= 50),
  city text not null default 'Karachi' check(city = 'Karachi'),
  area text not null check(area in(
    'Bahadurabad','Buffer Zone','Clifton','Defence View','DHA','Federal B Area',
    'Garden','Gulistan-e-Johar','Gulshan-e-Iqbal','Karsaz','Keamari','Korangi',
    'Landhi','Liaquatabad','Malir','Nazimabad','North Karachi','North Nazimabad',
    'PECHS','Saddar','Scheme 33','Shah Faisal Colony'
  )),
  address text not null,
  latitude double precision not null check(latitude between 24.45 and 25.55),
  longitude double precision not null check(longitude between 66.55 and 67.65),
  images text[] not null check(cardinality(images) between 1 and 12),
  status text not null default 'draft' check(status in('draft','published','archived','sold','rented')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Create the property favorites table
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, property_id)
);

-- 3. Create high-performance search indexes
create index if not exists properties_public_feed_idx on public.properties(status, created_at desc, id desc);
create index if not exists properties_karachi_area_idx on public.properties(area, purpose, property_type, price) where status = 'published';
create index if not exists properties_rooms_idx on public.properties(bedrooms, bathrooms) where status = 'published';
create index if not exists favorites_user_idx on public.favorites(user_id, created_at desc);

-- 4. Enable Row Level Security (RLS)
alter table public.properties enable row level security;
alter table public.favorites enable row level security;

-- 5. Define helper function is_admin if not already present
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public,auth as $$
  select coalesce((auth.jwt()->'app_metadata'->>'role')='admin', false);
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- 6. Define properties security policies
drop policy if exists "public reads published properties" on public.properties;
create policy "public reads published properties" on public.properties
  for select using (status = 'published' or owner_id = auth.uid() or public.is_admin());

drop policy if exists "owners create Karachi properties" on public.properties;
create policy "owners create Karachi properties" on public.properties
  for insert to authenticated with check (owner_id = auth.uid() and city = 'Karachi');

drop policy if exists "owners update own properties" on public.properties;
create policy "owners update own properties" on public.properties
  for update to authenticated using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "owners delete own properties" on public.properties;
create policy "owners delete own properties" on public.properties
  for delete to authenticated using (owner_id = auth.uid() or public.is_admin());

-- 7. Define favorites security policies
drop policy if exists "users read own favorites" on public.favorites;
create policy "users read own favorites" on public.favorites
  for select using (user_id = auth.uid());

drop policy if exists "users add own favorites" on public.favorites;
create policy "users add own favorites" on public.favorites
  for insert with check (user_id = auth.uid() and exists(select 1 from properties p where p.id = property_id and p.status = 'published'));

drop policy if exists "users remove own favorites" on public.favorites;
create policy "users remove own favorites" on public.favorites
  for delete using (user_id = auth.uid());

-- 8. Auto-update trigger for updated_at column
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;$$;

drop trigger if exists properties_touch_updated_at on public.properties;
create trigger properties_touch_updated_at before update on public.properties for each row execute function public.touch_updated_at();

-- 9. Enable realtime synchronization for tables
alter publication supabase_realtime add table public.properties;
alter publication supabase_realtime add table public.favorites;
