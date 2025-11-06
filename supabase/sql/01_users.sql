-- Users table for application-level roles (demo; not Supabase Auth)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  name text not null,
  role text not null check (role in ('administrator','manager','cashier_waiter','kitchen')),
  password text, -- demo only; store hashes in real setups
  created_at timestamptz default now()
);

alter table public.users enable row level security;
-- No public policies; use service role in server-side API for access

