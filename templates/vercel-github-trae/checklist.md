# Deployment Checklist (Template)

## Environment Variables
- Set all Supabase and Postgres variables for Production, Preview, Development

## Structure
- Use Next.js App Router with `app/` directory

## Build Settings
- Ensure `pnpm-lock.yaml` is synced; build via `next build`

## Permissions
- Connect Vercel ↔ GitHub with auto-deploy on push
- Keep `.trae/` and `.env*` out of Git

## Verification
- Run `npm run verify:deployment -- --base <deployment-url>`
- Check health endpoints and RBAC routing

