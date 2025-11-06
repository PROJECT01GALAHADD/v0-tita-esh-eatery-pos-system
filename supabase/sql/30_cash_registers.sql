-- Cash Registers meta
create table if not exists public.cash_registers (
  id uuid primary key default gen_random_uuid(),
  register_code text unique not null,
  name text not null,
  location text,
  status text not null default 'Active',
  created_at timestamptz default now()
);

alter table public.cash_registers enable row level security;
create policy if not exists "cash_registers_select_anon" on public.cash_registers for select using (true);
