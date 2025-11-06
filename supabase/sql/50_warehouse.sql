-- Warehouse products and movements (simplified)
create table if not exists public.warehouse_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text not null,
  stock numeric(12,2) not null default 0,
  min_stock numeric(12,2) not null default 0,
  max_stock numeric(12,2) not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.warehouse_incoming (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.warehouse_products(id) on delete cascade,
  quantity numeric(12,2) not null,
  amount numeric(12,2) not null,
  created_at timestamptz default now()
);

create table if not exists public.warehouse_outgoing (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.warehouse_products(id) on delete cascade,
  quantity numeric(12,2) not null,
  amount numeric(12,2) not null,
  created_at timestamptz default now()
);

alter table public.warehouse_products enable row level security;
alter table public.warehouse_incoming enable row level security;
alter table public.warehouse_outgoing enable row level security;
create policy if not exists "warehouse_products_select_anon" on public.warehouse_products for select using (true);
create policy if not exists "warehouse_incoming_select_anon" on public.warehouse_incoming for select using (true);
create policy if not exists "warehouse_outgoing_select_anon" on public.warehouse_outgoing for select using (true);

