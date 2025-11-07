-- Order line items for sales analytics and recipe usage
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id) on delete restrict,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null default 0,
  created_at timestamptz default now()
);

alter table public.order_items enable row level security;
create policy if not exists "order_items_select_anon" on public.order_items for select using (true);

