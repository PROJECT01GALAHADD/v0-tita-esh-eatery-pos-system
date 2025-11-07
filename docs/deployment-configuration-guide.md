# Vercel–GitHub–Trae Configuration Guide

This guide documents the end-to-end configuration steps for consistent, repeatable deployments.

## Vercel Project Settings
- Framework preset: Next.js
- Build command: `next build`
- Development command: `next dev` (local use)
- Output directory: auto (Next.js)
- Package manager: pnpm; ensure `pnpm-lock.yaml` is synced with `package.json`
- Environment variables: configure `NEXT_PUBLIC_*` (client) and server-side keys for all environments
- Git integration: connect to GitHub repository; auto-deploy on push to `main`

## GitHub Repository Requirements
- Branch protection (optional) for `main`
- CI expectations: lockfile kept in sync; avoid committing `.trae/`, `.env*`, `.next/`, `node_modules/`
- README updated with tech stack and deployment links

## Trae Integration Parameters
- Trae IDE operates locally; do not commit `.trae/` to the repo
- Keep project rules in `.trae/rules/project_rules.md` for local guidance only

## Deployment Workflow Sequence
1. Pull latest `main`: `git pull origin main`
2. Install dependencies: `pnpm install`
3. Type-check and lint: `npx tsc --noEmit`, `npm run lint`
4. Run local build: `npm run build` (optional preflight)
5. Push changes: `git push origin main`
6. Vercel auto-build and deploy
7. Verify deployment using health endpoints and the verification script (`npm run verify:deployment`)

## Notes
- For pnpm CI failures with frozen lockfile, update `pnpm-lock.yaml` locally and push
- Optionally disable Next.js telemetry in production with `NEXT_TELEMETRY_DISABLED=1`

