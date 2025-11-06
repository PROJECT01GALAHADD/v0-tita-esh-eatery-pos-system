# Tita Esh Eatery POS - TRAE IDE, Vercel Deployment & Cross-IDE Guide

## Addressing TRAE IDE Build Failures

### Root Cause Analysis

TRAE IDE build failures when pushing to Vercel typically occur due to:

1. **TypeScript Errors**: Strict mode enabled but errors not caught locally
2. **Environment Variables**: Missing or incorrect in Vercel project settings
3. **Dependency Issues**: Version mismatches or missing packages
4. **Build Configuration**: Incorrect next.config.mjs settings

### Solution: Build Verification Checklist

#### Before Pushing to GitHub/Vercel

\`\`\`bash
# 1. Install dependencies
npm install
# or
pnpm install

# 2. Run TypeScript compiler (catch errors early)
npx tsc --noEmit

# 3. Run ESLint (verify code quality)
npm run lint

# 4. Test local build
npm run build

# 5. Verify local dev server works
npm run dev
# Visit http://localhost:3000 and test all roles
\`\`\`

#### Common TRAE IDE Issues & Fixes

**Issue**: `error TS2532: Object is possibly 'undefined'`
\`\`\`typescript
// WRONG
if (user.role === "admin") { }

// CORRECT (use optional chaining)
if (user?.role === "admin") { }
\`\`\`

**Issue**: `Module not found: Can't resolve '@/lib/...'`
\`\`\`bash
# Solution: Verify path aliases in tsconfig.json
# Should have: "@/*": ["./*"]
\`\`\`

**Issue**: `Next.js build fails with "Cannot find module"`
\`\`\`bash
# Clean and rebuild
rm -rf node_modules .next
npm install
npm run build
\`\`\`

### TRAE IDE Setup Instructions

1. **Clone Repository**
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/v0-tita-esh-eatery-pos-system.git
cd v0-tita-esh-eatery-pos-system
\`\`\`

2. **Install Dependencies**
\`\`\`bash
npm install
# or: pnpm install
\`\`\`

3. **Setup Environment Variables**

Create `.env.local`:
\`\`\`env
# Get from Vercel project settings
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
POSTGRES_URL=your_postgres_url (optional)
\`\`\`

4. **Verify Local Build**
\`\`\`bash
npm run dev
\`\`\`

5. **Test Login Flow**
- Navigate to http://localhost:3000
- Login with: `admin` / `admin123`
- Verify dashboard loads without errors

6. **Run Type Check**
\`\`\`bash
npx tsc --noEmit
\`\`\`

7. **Push to GitHub**
\`\`\`bash
git add .
git commit -m "Initial setup"
git push origin main
\`\`\`

8. **Monitor Vercel Deployment**
- Go to vercel.com/dashboard
- Select the project
- Watch deployment logs
- Check build logs if errors occur

### Vercel Environment Variables Setup

1. **Go to Vercel Project Settings**
   - URL: `vercel.com/dashboard/[project-name]/settings/environment-variables`

2. **Add All Environment Variables**
   - Set for: Production, Preview, Development

3. **Required Variables**
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   \`\`\`

4. **Redeploy After Adding Variables**
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment
   - Or: Push new commit to trigger rebuild

## Cross-IDE Compatibility

### IDE Recommendations

#### VS Code (Recommended)

**Setup:**
\`\`\`bash
# Install extensions
# 1. ESLint (dbaeumer.vscode-eslint)
# 2. Prettier (esbenp.prettier-vscode)
# 3. TypeScript Vue Plugin (Vue.volar)
# 4. Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
\`\`\`

**Settings (.vscode/settings.json):**
\`\`\`json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
\`\`\`

#### WebStorm / IntelliJ IDEA

**Setup:**
1. File → Settings → Languages & Frameworks → TypeScript
2. Enable "Use TypeScript Service"
3. File → Settings → Languages & Frameworks → Node.js
4. Set Node interpreter to project's node

**Build:**
\`\`\`bash
npm run build
npm run dev
\`\`\`

#### Sublime Text

**Install Package Control**, then:
- TypeScript
- ESLint
- Tailwind CSS

#### TRAE IDE (Recommended for v0 Projects)

**Built-in Integration:**
- Full GitHub sync
- Automatic Vercel deployment
- Real-time code generation
- No local setup needed

**Workflow:**
1. Make changes in v0 interface
2. Commit to GitHub from v0
3. Vercel auto-deploys
4. Pull latest changes locally if needed

## Development Workflow

### Using TRAE IDE (Recommended)

\`\`\`
1. Open v0 interface
2. Make changes to components/pages
3. Preview changes in v0 preview
4. Push to GitHub when satisfied
5. Monitor Vercel deployment
6. Test on production domain
\`\`\`

### Using Local IDE

\`\`\`
1. Pull latest from GitHub
2. Install deps: npm install
3. Create .env.local with variables
4. Run dev: npm run dev
5. Make changes locally
6. Test: npm run build
7. Commit and push to GitHub
8. Monitor Vercel deployment
\`\`\`

### Hybrid Workflow (v0 + Local)

\`\`\`
1. Use v0 for rapid component generation
2. Pull changes locally
3. Fine-tune in local IDE
4. Add tests/optimizations
5. Push to GitHub
6. Deploy via Vercel
\`\`\`

## Troubleshooting Deployment

### Build Fails with TypeScript Errors

**Solution:**
\`\`\`bash
# Local: Verify types
npx tsc --noEmit

# Check for any unsupported types in components
# Common issue: React.ReactNode vs ReactNode

# Fix: Use ReactNode from 'react'
import type { ReactNode } from 'react'
interface Props {
  children: ReactNode
}
\`\`\`

### Missing Environment Variables

**Check:**
1. Vercel Dashboard → Settings → Environment Variables
2. Confirm variables set for correct environment (Prod/Preview/Dev)
3. Note: `NEXT_PUBLIC_*` must be present in Preview too

**Add Missing:**
\`\`\`bash
# In Vercel Dashboard:
# Settings → Environment Variables
# Add key=value pairs
# Save → Redeploy
\`\`\`

### Build Succeeds Locally but Fails on Vercel

**Common Causes:**
- Env vars not set in Vercel
- Node.js version mismatch
- File path case sensitivity (Linux-based Vercel)

**Fix:**
\`\`\`bash
# Verify Node version
node --version
# Vercel default: 18.17.x or 20.x

# Check for file path issues (case sensitive)
# Use lowercase for file names

# Hard rebuild on Vercel
# Settings → Redeploy → Rebuild
\`\`\`

### Database Connection Failures

**Check:**
1. SUPABASE_SERVICE_ROLE_KEY is correct
2. Database isn't in sleep mode
3. Network allows Vercel IPs

**Verify:**
\`\`\`bash
# Test locally
curl $SUPABASE_URL
# Should return 200 OK

# Check Supabase dashboard for status
# https://app.supabase.com
\`\`\`

## Performance Optimization

### Build Time Optimization

\`\`\`bash
# Clear cache
rm -rf .next node_modules

# Use pnpm for faster installs
npm install -g pnpm
pnpm install

# Rebuild
npm run build

# Check build time
# Should complete in <60 seconds
\`\`\`

### Production Checklist

- [ ] TypeScript passes: `npx tsc --noEmit`
- [ ] ESLint passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] All env vars in Vercel
- [ ] Database populated with test users
- [ ] Test all user roles locally
- [ ] Test on deployed preview URL
- [ ] Monitor Vercel logs for errors

## Documentation & Resources

### Local Development
- TypeScript: https://www.typescriptlang.org/docs/
- Next.js: https://nextjs.org/docs
- React 18: https://react.dev

### Deployment
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs

### Testing Accounts
\`\`\`
Admin:     admin / admin123
Manager:   manager / mgr123
Cashier:   cashier / cash123
Waiter:    waiter / wait123
Kitchen:   kitchen / kitchen123
\`\`\`

## Support & Debugging

### Enable Debug Logging

\`\`\`typescript
// In components/auth-provider.tsx, add:
console.log("[v0] Auth state:", { user, isLocked })

// In API routes:
console.log("[v0] Request:", req.method, req.url)
\`\`\`

### Check Logs

**Local:**
\`\`\`bash
npm run dev
# Check terminal for errors
\`\`\`

**Vercel:**
\`\`\`bash
# Option 1: Dashboard
# Deployments → Select build → Logs

# Option 2: CLI
npm install -g vercel
vercel logs
\`\`\`

### Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module` | Import path wrong | Check tsconfig paths |
| `Object is possibly undefined` | Missing null check | Use `user?.role` |
| `No such file` | Wrong file path case | Use lowercase |
| `ENOENT: no such file` | Missing env var | Add to .env.local |
| `401 Unauthorized` | Wrong API key | Verify SUPABASE keys |

---

**Last Updated**: November 2024
**Compatible IDEs**: VS Code, WebStorm, TRAE, Sublime Text
**Deployment**: Vercel + GitHub
**Database**: Supabase PostgreSQL
\`\`\`
