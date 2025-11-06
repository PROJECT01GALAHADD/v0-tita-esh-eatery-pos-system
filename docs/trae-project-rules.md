# Tita Esh Eatery POS System - Trae IDE Rules

## Project Overview

**Type**: Next.js 15 POS System with Supabase Backend  
**Origin**: Generated from v0.dev and auto-synced to GitHub  
**Stack**: Next.js 15.2.4, React 18, TypeScript, Tailwind CSS 4, Supabase (PostgreSQL), NocoDB  
**Primary Database**: Supabase PostgreSQL (migrated from MongoDB Atlas)  
**Region**: Singapore (Southeast Asia) - sin1

### Live Deployments
- **Production**: https://titaesh-pos.vercel.app/app
- **Vercel Dashboard**: https://vercel.com/galahadd-workspace/v0-tita-esh-eatery-pos-system
- **v0.dev Chat**: https://v0.app/chat/S3kwqEzWfk3
- **GitHub**: https://github.com/PROJECT01GALAHADD/v0-tita-esh-eatery-pos-system

---

## Supabase Development Workflow

### Database Operations

#### Using Supabase Client (Recommended)
```typescript
import { createClient } from '@supabase/supabase-js'

// Client-side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side (with service role key)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Query example
const { data, error } = await supabase
  .from('orders')
  .select('*')
  .eq('status', 'pending')

// Insert example
const { data, error } = await supabase
  .from('orders')
  .insert({ customer_name: 'John', total: 150 })

// Real-time subscription
const subscription = supabase
  .channel('orders')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'orders' },
    (payload) => console.log('Change:', payload)
  )
  .subscribe()
```

#### Using Direct SQL (for migrations, complex queries)
```typescript
const { data, error } = await supabase.rpc('custom_function_name', {
  param1: value1,
  param2: value2
})

// Or raw SQL via pg client (if needed)
```

#### Authentication Flow
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Get session
const { data: { session } } = await supabase.auth.getSession()

// Sign out
await supabase.auth.signOut()
```

#### Storage Operations
```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('receipts')
  .upload('receipt-123.pdf', file)

// Download file
const { data, error } = await supabase.storage
  .from('receipts')
  .download('receipt-123.pdf')

// Get public URL
const { data } = supabase.storage
  .from('receipts')
  .getPublicUrl('receipt-123.pdf')
```

### Migrations and Schema Changes

#### Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref jswwbhntjigffzpgyhah

# Pull remote schema
supabase db pull

# Create new migration
supabase migration new add_order_status_column

# Apply migrations
supabase db push

# Reset database (careful!)
supabase db reset
```

#### Manual Migrations via SQL Editor
1. Go to Supabase Dashboard → SQL Editor
2. Write your SQL migration
3. Execute and save as snippet
4. Document in `/supabase/migrations/` directory

#### Row Level Security (RLS)
```sql
-- Enable RLS on table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Authenticated users can insert orders
CREATE POLICY "Authenticated users can create orders"
ON orders FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

### Testing Database

#### Health Check Endpoint
```bash
# Test Supabase connection
curl http://localhost:3000/api/health/supabase

# Expected response
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-01-10T12:00:00Z"
}
```

#### Local Testing with Supabase CLI
```bash
# Start local Supabase (Docker required)
supabase start

# Get local credentials
supabase status

# Test against local instance
# Update .env.local to point to local URLs
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<local-anon-key>"
```

---

## Critical Workflow Rules

### 1. **v0.dev Auto-Sync Awareness**
- **IMPORTANT**: Changes pushed from v0.dev will automatically overwrite GitHub repository
- Before making manual changes, check if feature should be built in v0.dev instead
- Local changes must be committed and pushed before v0.dev sync to avoid conflicts
- If v0.dev pushes updates, always pull before continuing local work
- Test v0.dev changes in Vercel preview deployments before manual modifications

### 1.1 **Trae Configuration Files**
- **NEVER COMMIT** `.trae/` directory to Git (contains local AI configuration)
- Add `.trae/` to `.gitignore` to prevent accidental commits
- Keep project rules in `.trae/rules/project_rules.md` for local use only
- Trae configuration is personal and should not be shared in repository

### 2. **Git Operations**
```bash
# Always check status before operations
git status

# Pull v0.dev changes first
git pull origin main

# Stage only relevant changes (exclude .next, node_modules)
git add <specific-files>

# Commit with descriptive messages
git commit -m "feat: <feature> | fix: <issue> | docs: <update>"

# Push to trigger Vercel deployment
git push origin main
```

### 3. **Never Commit These Files**
- `.env.local` - Contains secrets (Supabase, MongoDB, NocoDB)
- `.env` - Any environment files
- `.trae/` - Trae IDE configuration directory
- `.trae/rules/project_rules.md` - This file (local AI configuration)
- `.next/` - Build artifacts
- `node_modules/` - Dependencies
- `.vercel/` - Vercel config
- `*.tsbuildinfo` - TypeScript build info

---

## Project Structure

### Core Directories
```
/app                  # Next.js 15 App Router (pages, layouts, API routes)
/components           # React components (UI built with shadcn/ui)
/hooks               # Custom React hooks
/lib                 # Utilities (mongodb.ts, supabase client, utils)
/public              # Static assets
/styles              # Global CSS (Tailwind)
/supabase            # Supabase migrations and types
```

### Local-Only Directories (Not in GitHub)
```
/__tests__           # Jest test suites
/.trae               # Trae IDE configuration
/.next               # Next.js build output
/node_modules        # npm dependencies
/docs                # Local documentation
/external            # External templates (ignored except README)
```

---

## Technology Stack Rules

### Next.js 15 Specifics
- **App Router**: Use `app/` directory structure only
- **Server Components**: Default to Server Components, use `"use client"` only when needed
- **API Routes**: Place in `app/api/` as route handlers
- **Metadata**: Export metadata objects from page/layout files
- **Streaming**: Leverage Suspense boundaries for loading states

### TypeScript Standards
- **Strict Mode**: Enabled in `tsconfig.json`
- **Type Safety**: No `any` types unless absolutely necessary
- **Interfaces**: Prefer interfaces over types for object shapes
- **Generics**: Use for reusable component patterns

### Tailwind CSS 4
- **Utility-First**: Compose styles with utility classes
- **Custom Classes**: Add to `styles/globals.css` only when necessary
- **Responsive**: Use breakpoint prefixes (sm:, md:, lg:, xl:, 2xl:)
- **Dark Mode**: Support via `next-themes` (class strategy)

### Component Library (shadcn/ui)
```bash
# Add new components
npx shadcn@latest add <component-name>

# Components are in /components/ui/
# Customize in components.json
```

---

## Database Architecture

### ⚠️ **MIGRATION NOTICE: MongoDB → Supabase Complete**
**Previous Architecture**: MongoDB Atlas (Primary) + NocoDB (Manager Interface)  
**Current Architecture**: Supabase PostgreSQL (Primary) + Supabase Auth + Storage

---

### Supabase (Primary Database)

#### Configuration Details
- **Project Name**: v0-titaeshpos-database
- **Region**: Singapore (Southeast Asia) - sin1
- **Project ID**: jswwbhntjigffzpgyhah
- **Connection**: Direct and Pooled connections available
- **Public Environment Variables Prefix**: `NEXT_PUBLIC_`

#### Database Structure
Supabase PostgreSQL replaces MongoDB collections with SQL tables:
- `waiter_operations` - Waiter operations and table management (formerly `waiterOps`)
- `chef_orders` - Kitchen order processing (formerly `chefOrders`)
- `cashier_transactions` - Payment transactions (formerly `cashierTxns`)
- `users` - User authentication (Supabase Auth)
- `profiles` - User profile data
- `menu_items` - Restaurant menu catalog
- `orders` - Order management
- `payments` - Payment records

#### Connection Methods

**Direct Connection** (for migrations, admin tasks):
```
Host: db.jswwbhntjigffzpgyhah.supabase.co
Port: 5432
Database: postgres
```

**Pooled Connection** (for application, recommended):
```
Host: aws-1-ap-southeast-1.pooler.supabase.com
Port: 6543 (pgBouncer pooling)
Database: postgres
```

#### Supabase Client
- **Initialization**: `lib/supabase.ts` or `@supabase/supabase-js`
- **Features**:
  - Row Level Security (RLS) for data protection
  - Real-time subscriptions for live updates
  - Built-in authentication (Email, OAuth, Magic Links)
  - Storage for file uploads (receipts, images)
  - Auto-generated REST API
  - Auto-generated TypeScript types

#### Authentication
- **Provider**: Supabase Auth (built-in)
- **Methods Supported**:
  - Email/Password
  - Magic Links (passwordless)
  - OAuth (Google, GitHub, etc.)
  - Phone/SMS (if configured)
- **Session Management**: JWT-based with automatic refresh
- **Row Level Security**: Database-level access control per user

#### Storage
- **Buckets**: Organized file storage
- **Use Cases**: Receipt images, menu photos, user avatars
- **Access**: Via Supabase Storage API
- **Security**: Bucket-level policies with RLS

---

### NocoDB (Optional Manager Interface)
- **Status**: Can be integrated if needed for non-technical managers
- **Purpose**: SQL-backed visual interface to Supabase tables
- **Integration**: Point NocoDB to Supabase PostgreSQL database
- **Note**: Since Supabase has a Dashboard, NocoDB is optional

---

### Environment Variables Required

#### Supabase Configuration (.env.local)
```bash
# ============================================
# SUPABASE CONFIGURATION
# ============================================

# Public Variables (safe for client-side)
NEXT_PUBLIC_SUPABASE_URL="https://jswwbhntjigffzpgyhah.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzd3diaG50amlnZmZ6cGd5aGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzOTY5NTYsImV4cCI6MjA3Nzk3Mjk1Nn0.9ZWcsyYTBqD2PSh_QrFw-TK18aWbF49fFVGyZ-lD1mI"

# Supabase Connection (Server-side only)
SUPABASE_URL="https://jswwbhntjigffzpgyhah.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzd3diaG50amlnZmZ6cGd5aGFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM5Njk1NiwiZXhwIjoyMDc3OTcyOTU2fQ.7kY7yRH_xcb54wi1KgYmUJUXMOK8dXS3Jy5vDIrJKPk"
SUPABASE_JWT_SECRET="CtFIHHsptIrTrcExpeF+LmgrbSZHOqxff+0nYztaOboTETXqgJim0ZyPQMjvI3E37U/0TqnljBEBZgXc66KJVw=="

# ============================================
# POSTGRES CONNECTION STRINGS
# ============================================

# Pooled Connection (Recommended for Application)
POSTGRES_URL="postgres://postgres.jswwbhntjigffzpgyhah:VUDxX4RqEgMyxe5W@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
POSTGRES_PRISMA_URL="postgres://postgres.jswwbhntjigffzpgyhah:VUDxX4RqEgMyxe5W@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"

# Direct Connection (For Migrations and Admin)
POSTGRES_URL_NON_POOLING="postgres://postgres.jswwbhntjigffzpgyhah:VUDxX4RqEgMyxe5W@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require"

# Connection Components
POSTGRES_HOST="db.jswwbhntjigffzpgyhah.supabase.co"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="VUDxX4RqEgMyxe5W"
POSTGRES_DATABASE="postgres"
```

#### Quick Start Setup
1. **Create `.env.local`** in project root
2. **Copy the configuration above** (all variables)
3. **Verify in Vercel**: All variables must also be set in Vercel Dashboard
   - Navigate to: Project Settings → Environment Variables
   - Set for: Production, Preview, and Development
4. **Restart dev server**: `npm run dev`

#### Vercel Environment Variables
✅ **Already Configured** in Vercel Dashboard:
- All Supabase variables are set
- Both public and private keys configured
- Available across all environments (Production, Preview, Development)

---

### Legacy MongoDB Atlas (Deprecated)
⚠️ **Migration Complete** - MongoDB is no longer used
- Previous collections migrated to Supabase PostgreSQL tables
- Connection code can be removed from `lib/mongodb.ts`
- MongoDB environment variables can be removed
- Keep migration documentation for reference

---

## Sync Middleware Rules

### ⚠️ DEPRECATED - MongoDB/NocoDB Sync
The sync middleware for MongoDB and NocoDB is **no longer active** after migration to Supabase.

### Supabase Real-time Subscriptions (Replacement)
Instead of custom sync middleware, use Supabase's built-in real-time features:

```typescript
// Subscribe to table changes
const channel = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: '*', // 'INSERT' | 'UPDATE' | 'DELETE' | '*'
      schema: 'public',
      table: 'orders'
    },
    (payload) => {
      console.log('Change received!', payload)
      // Update UI, trigger notifications, etc.
    }
  )
  .subscribe()

// Unsubscribe when done
channel.unsubscribe()
```

### Real-time Use Cases
- **Waiter Dashboard**: Live order updates
- **Kitchen Display**: New orders appear automatically
- **Cashier Terminal**: Payment status updates
- **Manager Dashboard**: Real-time sales monitoring

### Legacy Sync Endpoints (Remove These)
- ❌ `POST /api/sync/mongo-change` - No longer needed
- ❌ `POST /api/sync/nocodb-webhook` - No longer needed
- ❌ `GET /api/sync/status` - Replace with Supabase health check

---

## Development Commands

### Setup
```bash
# Install dependencies (respect lock file)
npm install

# Copy env template
cp .env.example .env.local
# Then fill in actual credentials
```

### Development
```bash
# Start dev server (with HMR)
npm run dev
# Opens at http://localhost:3000

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

### Building
```bash
# Production build
npm run build

# Test production build locally
npm run start
```

### Testing
```bash
# Run Jest tests (if configured)
npm test

# Watch mode
npm test -- --watch
```

### Database Operations
```bash
# Test Supabase connection
curl http://localhost:3000/api/health/supabase

# Generate TypeScript types from database
npx supabase gen types typescript --project-id jswwbhntjigffzpgyhah > lib/database.types.ts

# Run database migrations
npx supabase db push

# View Supabase logs
npx supabase logs --db

# Backup database (via Supabase Dashboard)
# Settings → Database → Create Backup
```

---

## Code Style Guidelines

### File Naming
- **Components**: PascalCase (`OrderCard.tsx`)
- **Utilities**: camelCase (`formatCurrency.ts`)
- **API Routes**: lowercase with hyphens (`route.ts` in `/api/checkout/`)
- **Types**: PascalCase with `.types.ts` suffix (`Order.types.ts`)

### Component Structure
```typescript
'use client' // Only if needed

import { /* external */ } from 'package'
import { /* internal */ } from '@/components'
import { /* types */ } from '@/types'
import { /* utils */ } from '@/lib'

// Types/Interfaces
interface Props {
  // ...
}

// Component
export function ComponentName({ props }: Props) {
  // Hooks
  const [state, setState] = useState()
  
  // Effects
  useEffect(() => {}, [])
  
  // Handlers
  const handleAction = () => {}
  
  // Render
  return <div>...</div>
}
```

### API Route Structure
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Query database
    const { data, error } = await supabase
      .from('orders')
      .select('*')
    
    if (error) throw error
    
    return NextResponse.json({ data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Protected route with auth
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Verify user authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Process request
    const body = await request.json()
    // ... logic
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Deployment Workflow

### Automatic Deployment Triggers
1. **v0.dev Changes**: Auto-push to GitHub → Vercel auto-deploy
2. **Direct Git Push**: Push to `main` → Vercel auto-deploy
3. **Manual Changes**: Commit local → Push → Vercel auto-deploy

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] TypeScript compiles without errors
- [ ] Environment variables set in Vercel
- [ ] Database connections tested
- [ ] No secrets in code
- [ ] Build succeeds locally (`npm run build`)

### Vercel Configuration
```bash
# Set environment variables in Vercel dashboard
# Project Settings → Environment Variables
# Add for: Production, Preview, Development

# Build settings
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node Version: 18.x (or 20.x)
```

### Monitoring Deployments
- Check Vercel dashboard for build logs
- Test preview URLs before merging to main
- Monitor production logs for errors
- Set up Vercel Analytics for performance tracking

---

## Common Tasks

### Adding a New Feature
```bash
# 1. Create feature branch (if needed)
git checkout -b feature/new-feature

# 2. Develop and test locally
npm run dev

# 3. Add files and commit
git add .
git commit -m "feat: add new feature"

# 4. Push to trigger deployment
git push origin feature/new-feature
```

### Updating Dependencies
```bash
# Check outdated packages
npm outdated

# Update specific package
npm update <package-name>

# Update all (careful!)
npm update

# Always test after updates
npm run build && npm run dev
```

### Database Schema Changes

#### Supabase Migrations
```bash
# Create new migration file
npx supabase migration new add_feature_name

# Edit the generated SQL file in /supabase/migrations/

# Apply migration to remote database
npx supabase db push

# Or apply via Supabase Dashboard SQL Editor
```

Example migration:
```sql
-- /supabase/migrations/20250110000000_add_order_notes.sql

-- Add notes column to orders table
ALTER TABLE orders 
ADD COLUMN notes TEXT;

-- Create index for faster queries
CREATE INDEX idx_orders_status ON orders(status);

-- Add RLS policy
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);
```

#### Testing Migrations
```bash
# 1. Test locally first (requires Docker)
npx supabase start
npx supabase db reset  # Fresh database
npx supabase migration up

# 2. Test on staging/preview
# Deploy to Vercel preview branch
# Verify in Supabase Dashboard

# 3. Apply to production
npx supabase db push --project-ref jswwbhntjigffzpgyhah
```

### Debugging

#### Check Logs
```bash
# Local development
# Logs appear in terminal running `npm run dev`

# Vercel production
# View in Vercel Dashboard → Project → Logs

# Supabase Database Logs
# View in Supabase Dashboard → Logs → Database
# Or via CLI: npx supabase logs --db

# Supabase Auth Logs
# View in Supabase Dashboard → Logs → Auth

# Supabase API Logs
# View in Supabase Dashboard → Logs → API
```

#### Common Issues

**Build Failures**
- Check `next.config.mjs` for `ignoreDuringBuilds` flags
- Verify all dependencies are in `package.json`
- Check Node.js version compatibility (18.x or 20.x)
- Ensure Supabase environment variables are set in Vercel

**Database Connection Errors**
- Confirm `NEXT_PUBLIC_SUPABASE_URL` and keys are correct
- Check RLS policies if data isn’t visible
- Verify pooled vs direct connection usage

**Auth Issues**
- Use `supabase.auth.getSession()` to debug sessions
- Ensure JWT secret matches project settings
- Check `auth.uid()` usage in RLS

**Storage Problems**
- Confirm bucket policies
- Use `getPublicUrl` for public assets
- Validate MIME types for uploads

---

## Notes
- This document mirrors local Trae rules so the team can review them in GitHub. The authoritative local file remains at `.trae/rules/project_rules.md` and should not be committed.

