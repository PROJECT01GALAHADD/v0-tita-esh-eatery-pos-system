-- Menu Categories and Items
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  price numeric(12,2) not null default 0,
  is_available boolean not null default true,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
-- Policies to be tightened later; using service role for admin writes
create policy if not exists "categories_select_anon" on public.categories for select using (true);
create policy if not exists "menu_items_select_anon" on public.menu_items for select using (true);
