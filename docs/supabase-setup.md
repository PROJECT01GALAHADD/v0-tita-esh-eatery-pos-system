Supabase Setup

1) Configure environment variables in `.env.local` (do not commit secrets):

Required keys used by this app:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL` (optional; server will fallback to NEXT_PUBLIC value)
- `SUPABASE_SERVICE_ROLE_KEY` (server-side API only)

Use the exact values you provided. Example template in `.env.example`.

2) Create the database schema via Supabase SQL Editor:

- Open Project → SQL Editor.
- Run files in this order:
  - `supabase/sql/00_extensions.sql`
  - `supabase/sql/01_users.sql`
  - `supabase/sql/10_todos.sql`
  - `supabase/sql/20_menu.sql`
  - `supabase/sql/30_cash_registers.sql`
  - `supabase/sql/40_orders.sql`
  - `supabase/sql/50_warehouse.sql`

Alternatively, using `psql` with your non-pooling connection string:

```
psql "${POSTGRES_URL_NON_POOLING}" -f supabase/sql/00_extensions.sql \
  -f supabase/sql/01_users.sql \
  -f supabase/sql/10_todos.sql \
  -f supabase/sql/20_menu.sql \
  -f supabase/sql/30_cash_registers.sql \
  -f supabase/sql/40_orders.sql \
  -f supabase/sql/50_warehouse.sql
```

3) Run the app locally:

- Ensure `.env.local` is populated.
- Start dev server and open `/data/users` to manage users persisted in Supabase.

Notes

- The `users` table is app-level (demo). For production, prefer Supabase Auth and store only profile data in Postgres.
- RLS policies are permissive for `todos` (quickstart) and read-only for some tables; writes happen through server-side API using the service role. Tighten policies per your RBAC as needed.

