# Deployment Verification Steps

Automated and manual checks to validate a successful deployment.

## Automated Verification Script
- Command: `npm run verify:deployment -- --base <https://your-deployment-url>`
- What it checks:
  - Build completion: responds on `/`
  - Env injection: server-side endpoints respond
  - API connectivity: `/api/health/db`, `/api/stats`, `/api/users`

## Manual Checks
- Navigate to `/app` and POS pages `/app/pos`
- Kitchen screen `/app/kitchen` renders and updates
- RBAC gating works:
  - `/app/pos` → Cashier/Waiter
  - `/app/kitchen` → Kitchen
  - `/app` → Manager/Admin

## Expected Deployment Behavior
- Static assets served under `/_next/static/`
- API routes respond with 200 for healthy state
- No TypeScript or runtime errors in Vercel logs

## Troubleshooting
- If CI fails on lockfile: refresh `pnpm-lock.yaml` and push
- Verify environment variables in Vercel across all environments
- Check Supabase connectivity via dashboard and SQL policies

