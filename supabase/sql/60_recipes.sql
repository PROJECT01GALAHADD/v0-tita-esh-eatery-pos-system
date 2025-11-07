-- Recipe mapping: menu items to warehouse products (ingredients)
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid unique not null references public.menu_items(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  product_id uuid not null references public.warehouse_products(id) on delete restrict,
  quantity numeric(12,2) not null,
  created_at timestamptz default now()
);

alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
create policy if not exists "recipes_select_anon" on public.recipes for select using (true);
create policy if not exists "recipe_ingredients_select_anon" on public.recipe_ingredients for select using (true);

