# Vercel Build Troubleshooting Guide for TRAE IDE

## Problem: Deployment Fails When Pushing from TRAE IDE

### Symptom
- Build succeeds locally
- Code looks correct
- Deployment fails on Vercel with cryptic errors

### Root Cause
TRAE IDE can have subtle differences in build behavior compared to local npm/Vercel.

## Solutions (In Order of Likelihood)

### Solution 1: Environment Variables (Most Common)

**Symptoms:**
- Build says "Missing NEXT_PUBLIC_SUPABASE_URL"
- API calls fail with 500 errors
- Database connections fail

**Fix:**
\`\`\`
1. Go to vercel.com/dashboard
2. Select your project: v0-tita-esh-eatery-pos-system
3. Click "Settings"
4. Go to "Environment Variables"
5. Add these for Production, Preview, and Development:

   NEXT_PUBLIC_SUPABASE_URL = your_value
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_value
   SUPABASE_URL = your_value
   SUPABASE_SERVICE_ROLE_KEY = your_value

6. Click "Deployments"
7. Find latest deployment
8. Click the 3 dots → "Redeploy"
\`\`\`

### Solution 2: Clear Build Cache

**Symptoms:**
- Same error as before
- Changes not reflected
- Stale dependencies

**Fix:**
\`\`\`
1. In Vercel Dashboard → Project Settings
2. Scroll down to "Build Cache"
3. Click "Clear All"
4. Go to Deployments
5. Find latest deployment
6. Click 3 dots → "Redeploy"
\`\`\`

### Solution 3: TypeScript Error (Check Locally First)

**Symptoms:**
- Vercel log shows TypeScript errors
- Build says "TS2532: Object is possibly undefined"

**Fix locally:**
\`\`\`bash
# In your local IDE or TRAE:
npx tsc --noEmit

# Check output for errors
# Most common:
# - user.role should be user?.role
# - Missing null checks on optional fields
# - Import path issues
\`\`\`

### Solution 4: Node.js Version Mismatch

**Symptoms:**
- Build works locally but fails on Vercel
- Syntax errors on valid JavaScript
- Module import errors

**Fix:**
\`\`\`
1. In Vercel Dashboard → Project Settings
2. Go to "Node.js Version"
3. Select: 20.x (LTS - Recommended)
4. Redeploy
\`\`\`

### Solution 5: Dependencies Missing

**Symptoms:**
- "Module not found" errors
- Specific packages not loading
- Supabase errors

**Fix:**
\`\`\`bash
# Reinstall fresh dependencies
rm -rf node_modules pnpm-lock.yaml
npm install

# Or with pnpm
pnpm install

# Rebuild
npm run build

# Verify build output
\`\`\`

### Solution 6: File Path Case Sensitivity

**Symptoms:**
- Works on Mac/Windows (case-insensitive)
- Fails on Vercel (Linux is case-sensitive)

**Example:**
\`\`\`
WRONG: /components/AuthProvider.tsx (if file is auth-provider.tsx)
RIGHT: /components/auth-provider.tsx

FIX: Rename files to lowercase, update imports
\`\`\`

### Solution 7: GitIgnore Issues

**Symptoms:**
- Files missing from git
- .env files not committed
- node_modules in git causing issues

**Fix:**
\`\`\`bash
# Check what's ignored
cat .gitignore

# Ensure these are ignored:
node_modules/
.env
.env.local
.next/
dist/

# If .env was committed (bad!):
git rm --cached .env
git commit -m "Remove .env"
\`\`\`

## Vercel Logs: How to Read Them

### Access Logs
\`\`\`
1. Go to vercel.com/dashboard
2. Click your project
3. Go to "Deployments" tab
4. Find failed deployment
5. Click on it
6. Click "Logs" or "Details"
\`\`\`

### Common Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| `NEXT_PUBLIC_SUPABASE_URL is required` | Env var not set | Add to Vercel Settings |
| `Cannot find module` | Import path wrong | Use lowercase file names |
| `Module not found: 'next'` | Missing dependency | Run npm install |
| `error TS2532` | TypeScript null check | Use optional chaining (obj?.field) |
| `ENOTFOUND api.github.com` | Network issue | Check Vercel firewall |
| `Port 3000 is already in use` | Local port conflict | Use: PORT=3001 npm run dev |

## Step-by-Step: Fix a Failed Deployment

### Step 1: Check Vercel Logs
\`\`\`
1. Go to failed deployment
2. Click "Logs"
3. Copy error message
4. Google the error
\`\`\`

### Step 2: Verify Locally
\`\`\`bash
# Do the same build locally
npm install
npm run build

# Does it fail locally? If no, environment-specific issue
# Does it fail? Fix locally first, then push
\`\`\`

### Step 3: Check Environment Variables
\`\`\`
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Verify all keys are there
3. Check for typos
4. Ensure set for correct environment (Prod/Preview/Dev)
\`\`\`

### Step 4: Clear & Rebuild
\`\`\`
1. Vercel Dashboard → Project → Settings → Build Cache
2. Click "Clear All"
3. Go to Deployments
4. Click 3 dots on latest → "Redeploy"
\`\`\`

### Step 5: Check TypeScript
\`\`\`bash
npx tsc --noEmit
# Fix any errors shown

npm run build
npm run lint
\`\`\`

### Step 6: Hard Reset & Repush
\`\`\`bash
# Local
git status
git add .
git commit -m "fix: TypeScript and build issues"
git push origin main

# Monitor deployment in Vercel
# Don't push again until it completes
\`\`\`

## TRAE IDE Specific Issues

### Issue: TRAE Says "Ready to Publish" But Vercel Fails

**Solution:**
1. TRAE's preview may use different TypeScript settings
2. Use `npm run build` locally to verify before publishing
3. Check Vercel logs after publishing to diagnose

### Issue: Changes in TRAE Don't Appear on Vercel

**Solution:**
1. Click "Publish" button to push to GitHub
2. Wait for GitHub sync
3. Monitor Vercel deployment
4. If stuck, manually go to GitHub and verify code is there

### Issue: TRAE Preview Works But Vercel Fails

**Solution:**
1. TRAE uses different build process (Next.js)
2. Vercel uses full Next.js build
3. Ensure `npm run build` succeeds locally
4. TypeScript strict mode is enforced on Vercel

## Prevention: Best Practices

### Always Do This Before Publishing from TRAE

\`\`\`bash
# 1. Install deps
npm install

# 2. Check types
npx tsc --noEmit

# 3. Lint
npm run lint

# 4. Build
npm run build

# 5. If all pass, publish from TRAE
\`\`\`

### Keep This Checklist

- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No ESLint errors: `npm run lint`
- [ ] Builds locally: `npm run build`
- [ ] Dev server works: `npm run dev`
- [ ] Test all user roles login
- [ ] Environment variables set in Vercel
- [ ] Ready to publish/push

## Real-World Example: Fixing a Failed Build

### Scenario
\`\`\`
Error: Cannot find module '@supabase/supabase-js'
\`\`\`

### Diagnosis
\`\`\`bash
# Check if it's installed
npm list @supabase/supabase-js
# If not listed, it's missing

# Check package.json
grep supabase package.json
# If not there, it's not installed
\`\`\`

### Solution
\`\`\`bash
# Reinstall
npm install

# Or specifically
npm install @supabase/supabase-js@latest

# Rebuild
npm run build

# Verify
npm run dev

# Push to GitHub
git push origin main

# Watch Vercel logs
\`\`\`

## Emergency: Full Reset

If everything is broken:

\`\`\`bash
# Local cleanup
rm -rf node_modules .next dist
rm package-lock.json pnpm-lock.yaml

# Fresh install
npm install

# Verify build
npm run build
npm run dev

# Full commit and push
git add .
git commit -m "Reset build system"
git push origin main

# Vercel will auto-rebuild
\`\`\`

## When All Else Fails: Contact Support

### Gather This Info
\`\`\`
1. Vercel deployment URL
2. Full error message from logs
3. Output of: npx tsc --noEmit
4. Output of: npm run build (local)
5. Environment variables (not secrets): list the KEYS only
\`\`\`

### Where to Get Help
- Vercel Support: vercel.com/help
- Supabase Support: supabase.com/support
- Next.js Discord: discord.gg/nextjs
- TypeScript Handbook: typescriptlang.org/docs

---

**Last Updated**: November 2024
**For**: TRAE IDE Users & Vercel Deployments
**Status**: Tested & Working
