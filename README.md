# Tita Esh Eatery POS System

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/galahadd-workspace/v0-tita-esh-eatery-pos-system)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/tita-esh-eatery-pos-system-S3kwqEzWfk3?utm_source=galahadd02dev&utm_medium=referral&utm_campaign=share_chat&ref=N7VGB7)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**Dashboard**: https://vercel.com/galahadd-workspace/v0-tita-esh-eatery-pos-system

**Production Domain**: https://titaesh-pos.vercel.app/

## Build your app

Continue building your app on:

**https://v0.app/chat/tita-esh-eatery-pos-system-S3kwqEzWfk3?utm_source=galahadd02dev&utm_medium=referral&utm_campaign=share_chat&ref=N7VGB7**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Architecture Overview

This is a Next.js 15 (App Router) POS system with a Supabase (PostgreSQL) backend.

- Framework: `next@15.2.4` with App Router
- UI: React 18, Tailwind CSS v4, shadcn/ui
- Database: Supabase PostgreSQL with RLS and real-time
- Auth: Supabase Auth (migration in progress from app-level `users` table)
- Storage: Supabase Storage (receipts, images)
- Regions: Supabase project in Singapore (sin1)

### Key Pages
- `/app` Dashboard
- `/app/pos` POS terminal (Cashier/Waiter)
- `/app/kitchen` Kitchen screen (live updates)
- `/app/menu` Menu management (loaded from Supabase)
- `/app/data/*` Management pages (administrator/manager only)

---

## Roles (RBAC)

Supported roles and gating are enforced across the sidebar and pages:

- `administrator`: Full access
- `manager`: Management dashboards, data views
- `cashier_waiter`: POS screens, orders
- `kitchen`: Kitchen view, inventory menu

Examples:
- `/app/pos` → `cashier_waiter`
- `/app/kitchen` → `kitchen`
- `/app` dashboard → `administrator`, `manager`
- `/app/data/*` → `administrator`, `manager`

Source of truth: `components/app-sidebar.tsx` (navigation permissions) and `lib/acl.ts` (helpers). Demo auth context: `components/auth-provider.tsx`.

### Demo Accounts (for testing)
- Administrator: `admin / admin123`
- Manager: `manager / mgr123`
- Cashier: `cashier / cash123`
- Waiter: `waiter / wait123`
- Chef: `chef / chef123`

---

## Supabase Configuration

Set the following environment variables in `.env.local` and in Vercel Project Settings (Production, Preview, Development). Do not commit secrets.

Required keys:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL` (optional; server falls back to `NEXT_PUBLIC_SUPABASE_URL`)
- `SUPABASE_SERVICE_ROLE_KEY` (server-side API only)
- Optional Postgres connection strings for tooling/migrations:
  - `POSTGRES_URL`
  - `POSTGRES_PRISMA_URL`
  - `POSTGRES_URL_NON_POOLING`

Client/Server initialization lives in `lib/supabase.ts`.

### Real-time subscriptions example
```ts
const channel = supabase
  .channel('orders')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
    console.log('Change:', payload)
  })
  .subscribe()

// Unsubscribe when done
channel.unsubscribe()
```

### Health Check
Expose and use a Supabase health endpoint: `GET /api/health/supabase` (returns JSON status). Use this to validate connectivity during deployments.

---

## Database & Migrations

SQL files are under `supabase/sql/` and include:
- `00_extensions.sql` (enable `pgcrypto`)
- `01_users.sql` (demo `users` table with roles)
- `10_todos.sql`
- `20_menu.sql`
- `30_cash_registers.sql`
- `40_orders.sql`
- `50_warehouse.sql`

Apply via Supabase Dashboard → SQL Editor, or Supabase CLI.

Supabase CLI quick reference:
```bash
npm install -g supabase
supabase login
supabase link --project-ref <project-ref>
supabase db pull
supabase migration new <name>
supabase db push
```

Row Level Security (RLS) should be enabled per table and policies tightened to match RBAC.

---

## Next.js Telemetry & Build Checks
- Disable Next.js telemetry in production: set `NEXT_TELEMETRY_DISABLED=1` in Vercel.
- Route handlers must use valid signatures, e.g.
  ```ts
  export async function PATCH(req: Request, { params }: any) {
    const id = params.id
    // ...
  }
  ```
- TypeScript is enforced during builds.

---

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Production build
npm run build

# Run production locally
npm run start
```

### Database operations
```bash
# Test Supabase connection
curl http://localhost:3000/api/health/supabase

# Generate TypeScript types
npx supabase gen types typescript --project-id <project-id> > lib/database.types.ts

# Run migrations
npx supabase db push

# View logs
npx supabase logs --db
```

---

## Recent Changes & Fixes

- Fixed invalid route handler signature in `app/api/menu/[id]/route.ts` (used `{ params }: any`).
- Guarded null user access checks:
  - `app/cash-registers/page.tsx` role checks now use `user?.role ?? ""`.
  - `app/menu/page.tsx` "Edit" button gated with `user?.role ?? ""`.
- Kitchen page `useEffect` cleanup corrected to avoid returning a Promise (`channel.unsubscribe()` handled synchronously).
- Project rules/docs updated with RBAC and telemetry guidance (`docs/trae-project-rules.md`).
- Verified local production builds; changes deployed via Vercel.

---

## Legacy Notes (MongoDB/NocoDB)

The previous MongoDB/NocoDB sync architecture has been deprecated in favor of Supabase PostgreSQL with real-time and RLS. Legacy sync endpoints (`/api/sync/*`) are removed/obsolete.

- Install the driver: `npm install mongodb` (already installed).
- Set `MONGODB_URI` locally in `.env.local` and in Vercel Project Settings → Environment Variables.
- Connection helper is available at `lib/mongodb.ts` (reuses a single client in dev).
- Verify connectivity via health endpoint: `GET /api/health/db`.

Example `.env.local`:

\`\`\`
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/?retryWrites=true&w=majority"
\`\`\`

Security notes:
- Do not commit real credentials. `.env*` is ignored by `.gitignore`.
- Rotate credentials periodically and prefer scoped users with least privilege.

Deploy notes:
- Ensure Vercel has `MONGODB_URI` set for Production and Preview environments.
- Recommended Node.js version: 18+ (Vercel default).
- If builds are failing silently, consider removing `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` in `next.config.mjs` for production.

## NocoDB Integration and Dual-Database Sync

This project supports a dual-database architecture: MongoDB as the primary operational store and NocoDB as a manager-friendly interface (backed by SQL). A sync middleware keeps both in near real-time alignment.

### Configure NocoDB

1. Install/host NocoDB and create a project with tables mirroring MongoDB collections:
   - Waiter Operations (`externalId`, `waiterId`, `tableNumber`, `action`, `notes`, `updatedAt`, `source`, `version`)
   - Chef Orders (`externalId`, `orderId`, `status`, `items(JSON)`, `updatedAt`, `source`, `version`)
   - Cashier Transactions (`externalId`, `txnId`, `amount`, `currency`, `method`, `updatedAt`, `source`, `version`)

2. Generate an API token and capture the table endpoints (commonly `/api/v2/tables/{tableId}`):
   - Set env in `.env.local` and Vercel:
     - `NOCO_BASE_URL`, `NOCO_API_TOKEN`
     - `NOCO_TABLE_WAITER_OPS`, `NOCO_TABLE_CHEF_ORDERS`, `NOCO_TABLE_CASHIER_TXNS`
   - Optional sync policy:
     - `SYNC_CONFLICT_POLICY` (`source_priority` or `last_write_wins`)
     - `SYNC_PRIORITY_NOCO`, `SYNC_PRIORITY_MONGO`

### Sync Endpoints

- MongoDB → NocoDB: `POST /api/sync/mongo-change`
  - Use MongoDB Atlas Triggers (recommended) to POST inserts/updates/deletes with payload:
    \`\`\`json
    { "collection": "waiterOps|chefOrders|cashierTxns", "operation": "insert|update|delete", "document": {"externalId": "...", ...}, "externalId": "..." }
    \`\`\`

- NocoDB → MongoDB: `POST /api/sync/nocodb-webhook`
  - Configure NocoDB automation/webhook for row created/updated/deleted events. Payload must include `data.externalId` for identification.

- Monitoring: `GET /api/sync/status`
  - Returns MongoDB ping and presence of required NocoDB env vars/table paths.

### Operational Notes

- Vercel Functions are stateless; prefer Atlas Triggers for real-time events into `/api/sync/mongo-change`.
- Conflict resolution is configurable; default prioritizes NocoDB (manager edits) over MongoDB on ties, then timestamps.
- Backups:
  - MongoDB Atlas continuous backups (configure per cluster).
  - NocoDB’s underlying SQL database: use native DB backups (e.g., Postgres dump) and NocoDB export for schema.

### Testing

- Seed sample docs into MongoDB and verify NocoDB mirrors via the trigger.
- Update in NocoDB UI and confirm MongoDB reflects changes with expected conflict policy.
- Load tests: simulate concurrent writes (waiter/chef/cashier) and check sync latency and correctness.
