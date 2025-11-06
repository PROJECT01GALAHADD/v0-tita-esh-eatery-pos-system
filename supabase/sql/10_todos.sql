-- Quickstart todos table for testing REST and supabase-js examples
create table if not exists public.todos (
  id bigint generated always as identity primary key,
  title text not null,
  is_complete boolean not null default false,
  inserted_at timestamptz default now()
);

alter table public.todos enable row level security;
-- Allow anonymous read/insert for quickstart testing
create policy if not exists "todos_select_anon" on public.todos for select using (true);
create policy if not exists "todos_insert_anon" on public.todos for insert with check (true);
