# Vercel–GitHub–Trae Deployment Checklist

This checklist standardizes successful deployments based on the working configuration of this project.

## Required Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` – Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key
- `SUPABASE_URL` – Supabase admin URL (server-side)
- `SUPABASE_SERVICE_ROLE_KEY` – Supabase service role key (server-side)
- `SUPABASE_JWT_SECRET` – Supabase JWT secret
- `POSTGRES_URL` – Pooled connection string
- `POSTGRES_PRISMA_URL` – Pooled connection (pgBouncer) for Prisma
- `POSTGRES_URL_NON_POOLING` – Direct connection (admin/migrations)
- `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE` – Connection components
- Optional: `NEXT_TELEMETRY_DISABLED=1` – Disable Next.js telemetry in production

## Proper Project Structure
- `app/` – App Router pages and API routes
- `components/` – UI components and POS-specific components
- `lib/` – utilities, Supabase client, ACL helpers
- `hooks/` – React hooks
- `public/` – static assets
- `styles/` – global CSS
- `supabase/` – SQL migrations and types
- `docs/` – documentation

## Correct Build Settings
- Package manager: `pnpm@10.x` (lockfile present)
- Ensure `pnpm-lock.yaml` is synced with `package.json` before pushing
- Build command: `next build`
- Development command: `next dev -p 5000 -H 0.0.0.0`
- Start command: `next start -p 5000 -H 0.0.0.0`

## Necessary Integration Permissions
- Vercel ↔ GitHub: Project has access to the repository with auto-deploy on push to `main`
- Vercel Environment Variables configured for Production, Preview, Development
- Trae IDE: local-only; do not commit `.trae/` directory

## Pre-Deployment Checks
- TypeScript compiles: `npx tsc --noEmit`
- Lint passes: `npm run lint`
- Lockfile matches dependencies: `pnpm install` produces no changes
- Health endpoints available and responding (e.g., `/api/health/db` or `/api/health/supabase`)

