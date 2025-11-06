-- Orders (simplified)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  status text not null default 'pending',
  total_amount numeric(12,2) not null default 0,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;
create policy if not exists "orders_select_anon" on public.orders for select using (true);
