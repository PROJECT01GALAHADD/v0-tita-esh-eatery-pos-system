// ... existing code from start to "Recent Changes & Fixes" section ...

## Recent Changes & Fixes

- Fixed invalid route handler signature in `app/api/menu/[id]/route.ts` (used `{ params }: any`).
- Guarded null user access checks:
  - `app/cash-registers/page.tsx` role checks now use `user?.role ?? ""`.
  - `app/menu/page.tsx` "Edit" button gated with `user?.role ?? ""`.
- Kitchen page `useEffect` cleanup corrected to avoid returning a Promise (`channel.unsubscribe()` handled synchronously).
- Project rules/docs updated with RBAC and telemetry guidance (`docs/trae-project-rules.md`).
- Verified local production builds; changes deployed via Vercel.
// <CHANGE> Removed MongoDB/NocoDB sections - now Supabase only

---

## Database & Environment Setup

This project uses **Supabase PostgreSQL** exclusively. No MongoDB or NocoDB required.

### Environment Variables

Set in `.env.local` and Vercel Project Settings:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

### Health Check

Test Supabase connectivity:
\`\`\`bash
curl http://localhost:3000/api/health/db
\`\`\`

Expected response:
\`\`\`json
{ "status": "ok", "service": "supabase", "connected": true }
