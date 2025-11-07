# Tita Esh Eatery POS System

## Overview

A comprehensive restaurant management Point of Sale (POS) system built with Next.js 15, TypeScript, and Supabase. This application provides role-based access control for different restaurant staff (administrators, managers, cashiers/waiters, and kitchen staff) with dedicated interfaces for each role. The system handles menu management, order processing, inventory tracking, cash register operations, and kitchen display functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Technology Stack

**Frontend Framework**: Next.js 15.2.4 with App Router (React 18, TypeScript)
- Heavy use of client components (`"use client"` directive)
- Server-side rendering limited; most interactivity handled client-side
- Route-based page organization under `app/` directory

**UI/Design System**: 
- Shadcn UI components built on Radix UI primitives
- Tailwind CSS v4 for styling (PostCSS-based configuration)
- Custom theme tokens defined in `app/globals.css` with red/yellow/green brand colors
- Dark mode support via `next-themes` (infrastructure present but not globally wired)
- Responsive design with mobile breakpoint detection (`hooks/use-mobile.ts`)

**State Management**:
- React Context API for authentication (`components/auth-provider.tsx`)
- React Context for shopping cart state (`components/pos/cart-context.tsx`)
- Local component state with `useState` for UI interactions
- Session persistence via browser `sessionStorage` and `localStorage`

### Authentication & Authorization

**Authentication Strategy**:
- Client-side authentication with demo credentials (not production-ready)
- Hardcoded test users for development/demo purposes
- Password hashing using PBKDF2 (salt:hash format)
- Session management with 30-minute inactivity timeout
- Lock screen functionality with PIN protection (PIN: "1234")

**Role-Based Access Control (RBAC)**:
- Four user roles: `administrator`, `manager`, `cashier_waiter`, `kitchen`
- Centralized permission logic in `lib/acl.ts`
- Role permissions enforced at UI level via sidebar navigation filtering
- Protected routes use `ProtectedRoute` component wrapper
- No server-side authorization currently implemented (planned enhancement)

**User Roles & Permissions**:
- **Administrator**: Full system access including user management, all data operations, reports
- **Manager**: Staff management, inventory, orders, reports (no user deletion)
- **Cashier/Waiter**: POS terminal, order creation, personal sales dashboard
- **Kitchen**: Kitchen display system only, menu viewing, inventory (read-only)

### Database & Data Layer

**Primary Database**: Supabase (PostgreSQL)
- All database operations use Supabase client (`lib/supabase.ts`)
- Client-side queries via `getSupabaseClient()` (anonymous key)
- Server-side queries via `getSupabaseServer()` (service role key)
- Real-time subscriptions for live order updates (kitchen display)
- Row Level Security (RLS) policies enforced at database level

**Data Tables** (PostgreSQL schema):
- `users` - User authentication and profiles
- `menu_items` - Restaurant menu catalog
- `orders` - Order management and tracking
- `payments` - Payment transaction records
- `cash_registers` - POS terminal registration
- `waiter_operations` - Table and waiter assignments
- `warehouse` - Inventory and stock management

**Environment Variables Required**:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Application Structure

**Layout & Navigation**:
- Root layout (`app/layout.tsx`) wraps app with `AuthProvider` and `ThemeProvider`
- Sidebar navigation (`components/app-sidebar.tsx`) with role-based menu filtering
- Responsive sidebar with collapsed/expanded states and mobile sheet overlay
- Global styles in `app/globals.css` with Tailwind v4 directives

**Key Feature Areas**:

1. **Dashboard** (`app/page.tsx`)
   - Role-specific widgets and metrics
   - Revenue charts, order statistics, inventory alerts
   - Auto-redirects kitchen users to kitchen display

2. **POS Terminal** (`app/pos/`)
   - Product catalog with category filtering
   - Shopping cart with quantity management
   - Checkout flow with payment processing
   - Cart state persisted via React Context and localStorage

3. **Kitchen Display System** (`app/kitchen/page.tsx`)
   - Real-time order tickets (New → Preparing → Ready)
   - Color-coded status indicators
   - Time tracking for order preparation
   - No sidebar (full-screen KDS view)

4. **Menu Management** (`app/menu/page.tsx`)
   - Menu item CRUD operations
   - Availability toggling
   - Category organization
   - Pricing and descriptions

5. **Data Management** (`app/data/*`)
   - Admin/Manager only access
   - User management, products, pricing, locations, registers, waiters
   - CRUD interfaces with tables and forms

6. **Warehouse** (`app/warehouse/*`)
   - Inventory tracking (products, incoming, outgoing)
   - Stock levels and alerts
   - Admin, Manager, and Kitchen roles have access

7. **Orders** (`app/orders/*`)
   - Daily and periodic order views
   - Order history and status tracking
   - Accessible to all roles except Kitchen (who use KDS instead)

### Build & Deployment Configuration

**Build Settings** (`next.config.mjs`):
- TypeScript errors enforced in builds (`typescript.ignoreBuildErrors: false`)
- ESLint enforced during builds (`eslint.ignoreDuringBuilds: false`)
- Image optimization disabled (`images.unoptimized: true`) - **IMPACT**: performance degradation
- Removed invalid `typescript.strict` option (not supported in Next.js config)

**TypeScript Configuration**:
- Strict mode enabled
- ES6 target
- Bundler module resolution
- Path aliases: `@/*` maps to project root

**Deployment Platform**: Replit (migrated from Vercel on Nov 7, 2025)
- Package manager: pnpm
- Development server: `pnpm run dev` (port 5000, bound to 0.0.0.0)
- Production server: `pnpm run start` (port 5000, bound to 0.0.0.0)
- Environment variables stored in Replit Secrets
- Deployment type: Autoscale (stateless web application)
- Health check endpoint: `/api/health/db` (Supabase connectivity test)

### Known Limitations & Planned Enhancements

**Security Concerns**:
- Demo authentication not suitable for production
- Client-only authorization (no server-side API protection)
- Hardcoded lock PIN and test credentials
- Need secure session management with HTTP-only cookies or JWT

**Performance Optimization Needed**:
- Heavy client-side rendering (limited SSR/streaming)
- Image optimization disabled
- Consider server components for static content

**Feature Gaps**:
- No audit logging for role-based actions
- Missing server-side permission checks on API routes
- Analytics configured but privacy settings not reviewed
- Theme toggle not globally wired (infrastructure exists)

## External Dependencies

### Core Framework Dependencies
- **Next.js** (15.2.4): React framework with App Router
- **React** (18): UI library
- **TypeScript**: Type safety and developer experience

### UI Component Libraries
- **Radix UI**: Headless component primitives (@radix-ui/react-*)
  - dialog, dropdown-menu, select, switch, tabs, toast, tooltip, etc.
- **Shadcn UI**: Pre-built component system (configured in `components.json`)
- **Lucide React**: Icon library
- **Recharts**: Charting library for dashboard visualizations

### Styling & Design
- **Tailwind CSS** (v4): Utility-first CSS framework
- **tailwindcss-animate**: Animation utilities
- **class-variance-authority**: Component variant styling
- **clsx** + **tailwind-merge**: Class name utilities

### Database & Backend
- **Supabase** (@supabase/supabase-js): PostgreSQL database client
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication infrastructure (not currently used)

### Form Management
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation
- **@hookform/resolvers**: Form validation integration

### State & Data
- **Sonner**: Toast notification system
- **next-themes**: Dark mode theme management

### Development Tools
- **ESLint**: Code linting (currently bypassed in builds)
- **Jest** + **Testing Library**: Testing infrastructure (configured but minimal tests)
- **PostCSS**: CSS processing for Tailwind v4

### Analytics & Monitoring
- **@vercel/analytics**: Vercel Analytics integration
- **@vercel/functions**: Serverless function utilities

### Build Configuration
- **PostCSS**: CSS processing (`@tailwindcss/postcss`)
- **Autoprefixer**: CSS vendor prefixing

### Notable Removed Dependencies
- ❌ MongoDB (migrated to Supabase PostgreSQL)
- ❌ NocoDB (deprecated - use Supabase Dashboard)
- ❌ Sync middleware (removed unused code)