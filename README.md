<div align="center">

# Tita Esh Eatery POS System

Next.js 15 + Supabase powered Point-of-Sale and Kitchen Display System with role-based access control.

</div>

---

## Overview

Tita Esh Eatery POS System is a modern restaurant POS built on the Next.js App Router, with Supabase providing authentication, PostgreSQL, real-time updates, and storage. It includes cashier/terminal flows, kitchen display, role-based dashboards, and data management screens.

### Live

- Production: `https://titaesh-pos.vercel.app/app`
- Vercel Dashboard: `https://vercel.com/galahadd-workspace/v0-tita-esh-eatery-pos-system`
- v0.dev Chat: `https://v0.app/chat/S3kwqEzWfk3`
- GitHub: `https://github.com/PROJECT01GALAHADD/v0-tita-esh-eatery-pos-system`

### Tech Stack

- Framework: Next.js `15.2.4` (App Router)
- Language: TypeScript, React `18`
- Styling: Tailwind CSS `v4` + `tailwindcss-animate`
- UI: Radix UI primitives + custom components (shadcn-inspired)
- Data: Supabase PostgreSQL (RLS, real-time)
- Auth: Supabase Auth (JWT/session management)
- Storage: Supabase Storage (receipts, images)
- Charts: Recharts

### Integrations

- Supabase: database, auth, storage, real-time
- Vercel: hosting and CI/CD
- Optional: NocoDB (manager interface; not required)

---

## Features

- Role-Based Access Control (RBAC) for `admin`, `manager`, `cashier_waiter`, `kitchen`
- POS terminal: product catalog, cart, checkout, orders
- Kitchen Display System: live order queue and status updates
- Manager/Admin dashboards: reports, data management
- Supabase real-time subscriptions for live UI updates
- Responsive UI with Tailwind CSS and Radix components

---

## Project Structure

```
/app                  # Next.js App Router (pages, layouts, API routes)
/components           # React components (UI, POS components)
/hooks                # Custom hooks (e.g., use-toast)
/lib                  # Utilities (supabase client, ACL)
/public               # Static assets (images)
/styles               # Global CSS (Tailwind v4)
/supabase             # SQL migrations and types
/docs                 # Project guides and documentation
```

---

## RBAC & Routing

- `/app` dashboard → Manager, Admin
- `/app/pos` → Cashier/Waiter
- `/app/kitchen` → Kitchen
- RBAC helpers live in `lib/acl.ts` and enforced in both server and client components.

Test user roles and credentials are documented in `docs/login-credentials.md` and `docs/user-role-access-guide.md`.

---

## API Endpoints

- Auth: `app/api/auth/login/route.ts`
- Users: `app/api/users/route.ts` (list/create)
- Menu: `app/api/menu/*`
- Orders: `app/api/orders/*`
- Stats: `app/api/stats/*`
- Health: `app/api/health/*` (e.g., `supabase` check)

Route handlers follow the Next.js 15 signature:

```ts
export async function PATCH(req: Request, { params }: any) {
  const id = params.id
  // ...
}
```

---

## Database

Supabase PostgreSQL replaces prior MongoDB/NocoDB architecture.

Tables:

- `users`, `profiles`
- `menu_items`
- `orders`, `payments`
- `cashier_transactions`
- `waiter_operations`
- `chef_orders`

Migrations are in `supabase/sql/*`. Use Supabase CLI to manage schema.

```bash
# Install and login
npm install -g supabase
supabase login

# Link project
supabase link --project-ref <your-project-ref>

# Pull remote schema
supabase db pull

# Create/apply migrations
supabase migration new add_feature_x
supabase db push
```

Row Level Security (RLS) examples are provided in docs and should be enabled per table.

---

## Environment Configuration

Set variables in `.env.local` and Vercel Project Settings (Production, Preview, Development):

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=your-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
```

Do not commit `.env*` files. See `.gitignore` for protected paths.

---

## Development

```bash
# Install deps
npm install

# Start dev server
npm run dev
# Opens at http://localhost:5000

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Production build
npm run build
npm run start
```

### Testing Database Health

```bash
curl http://localhost:3000/api/health/supabase
```

Expected response:

```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "<ISO-date>"
}
```

---

## Real-time Updates

Supabase real-time subscriptions keep POS and Kitchen screens in sync:

```ts
const channel = supabase
  .channel('schema-db-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
    // Update UI
  })
  .subscribe()

// Cleanup
channel.unsubscribe()
```

---

## Deployment

- Pushes to `main` trigger Vercel deployments
- v0.dev changes may auto-sync to GitHub; pull before manual work
- Verify type/lint/build locally before pushing

```bash
git status
git pull origin main
git add <files>
git commit -m "feat: new module | fix: issue | docs: update"
git push origin main
```

Common troubleshooting is documented in `docs/vercel-build-troubleshooting.md`.

---

## Documentation

Detailed guides live in `/docs`:

- Quick Start: `docs/quick-start-guide.md`
- Setup & Configuration: `docs/complete-setup-guide.md`, `docs/quick-setup-reference.md`
- RBAC & Access: `docs/user-role-access-guide.md`, `docs/login-credentials.md`
- Architecture: `docs/system-architecture.md`, `docs/project-summary.md`
- Supabase: `docs/supabase-setup.md`, `docs/supabase-setup-instructions.md`
- Deployment: `docs/trae-ide-and-deployment-guide.md`, `docs/vercel-build-troubleshooting.md`

---

## Notes & Policies

- Next.js telemetry can be disabled with `NEXT_TELEMETRY_DISABLED=1`.
- Do not commit: `.env*`, `.trae/`, `.next/`, `node_modules/`, `.vercel/`, `*.tsbuildinfo`.
- Case-sensitive imports matter in CI/CD (Linux). Keep file names lowercase.

---

## Roadmap

- Replace minimal UI shims with a standardized component library where appropriate
- Add unit/integration tests for critical flows (POS, Kitchen)
- Expand reporting dashboards for managers/admin

---

## License

Proprietary. Do not copy, distribute, or modify without permission.
