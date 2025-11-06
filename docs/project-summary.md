# Tita Esh Eatery POS System — Project Summary

This document summarizes the project’s architecture, components, dependencies, and configuration posture. It includes visual diagrams to support planning and configuration decisions.

## 1) Project Structure Review

- Top-level layout
  - `app/` — Next.js App Router pages and global layout/styles
  - `components/` — Reusable components including UI kit, auth, and sidebar
  - `hooks/` — Utility hooks (e.g., mobile breakpoint detection)
  - `lib/` — Utility helpers (e.g., `cn` class merge)
  - `public/` — Static assets (logo and placeholders)
  - `styles/` — Global styles (legacy, Tailwind v4 primarily in `app/globals.css`)
  - Config files — `next.config.mjs`, `postcss.config.mjs`, `tsconfig.json`, `components.json`

- Notable directories under `app/`
  - `app/layout.tsx` — Root layout; wraps the app with `AuthProvider`
  - `app/globals.css` — Tailwind v4 directives, CSS variables, and theme tokens
  - `app/page.tsx` — Dashboard page; role-aware widgets and charts
  - `app/menu/page.tsx` — Menu management page
  - `app/cash-registers/page.tsx` — Cash registers overview
  - `app/data/*` — Data management sections (products, catalog, groups, pricing, locations, departments, registers, service-registering, waiters)
  - `app/orders/*` — Orders (daily, periodic)
  - `app/warehouse/*` — Inventory (products, incoming, outgoing)

- Components and relationships
  - `components/auth-provider.tsx` — Client-only auth context, login/lock screens; role switching
  - `components/app-sidebar.tsx` — Role-based navigation menu definitions and access control
  - `components/theme-provider.tsx` — `next-themes` wrapper (dark mode infra)
  - `components/ui/*` — Shadcn UI components (Radix-based), custom `sidebar` system
  - `hooks/use-mobile.ts` — Responsive behavior for sidebar offcanvas mode
  - `lib/utils.ts` — Class merge utilities

\`\`\`mermaid
flowchart LR
  Browser((Browser)) --> NextApp[Next.js App Router]
  NextApp --> RootLayout[RootLayout]
  RootLayout --> AuthProvider
  AuthProvider -->|user & lock state| Page[Page (client components)]
  Page --> SidebarProvider
  SidebarProvider --> AppSidebar
  AppSidebar -->|role-permissions| Navigation
\`\`\`

## 2) Technical Stack Analysis

- Languages: TypeScript + React (client components heavy)
- Framework: Next.js `app/` Router (version `next@15.2.4`)
- UI/Design System:
  - Shadcn UI (Radix primitives), `components.json` configured (style: `new-york`, base color: `neutral`)
  - Tailwind CSS v4 (`@tailwindcss/postcss`, `@import "tailwindcss"` in `globals.css`)
  - `next-themes` for theming (provider present, not wired globally in layout)
- Charts: `recharts`
- Icons: `lucide-react`
- Forms/validation: `react-hook-form`, `zod`, `@hookform/resolvers`
- Other UI libs: `cmdk`, `vaul`, `embla-carousel-react`, `react-resizable-panels`, `sonner`
- Analytics: `@vercel/analytics`
- Build tools:
  - Scripts: `dev`, `build`, `start`, `lint`
  - `postcss.config.mjs` with Tailwind v4 plugin
  - `next.config.mjs`: lint and TS errors ignored during build; `images.unoptimized: true`
  - `tsconfig.json`: strict TS, App Router plugin, bundler module resolution

\`\`\`mermaid
flowchart TD
  subgraph Build
    PostCSS-->TailwindV4
    NextConfig-->NextBuild
    TypeScript-->NextBuild
  end
  NextBuild-->Vercel((Deployment))
\`\`\`

## 3) Functional Overview

- Core features
  - Role-based access to pages (administrator, manager, cashier, waiter, chef)
  - Dashboard with role-specific widgets; charts for revenue and dish sales
  - Menu management (cards, availability, category badges)
  - Orders (daily, periodic) with CRUD-like dialogs and metrics
  - Data management sections (products, pricing, locations, departments, registers, etc.)
  - Warehouse management (products, incoming/outgoing)

- Key workflows
  - Authentication: `LoginPage` sets user via `AuthProvider` demo credentials
  - Lock/unlock: `LockScreen` gates access until PIN is entered
  - Navigation: `AppSidebar` uses `useAuth` and `rolePermissions` to enable/disable menus
  - Page composition: each page instantiates `SidebarProvider`, `AppSidebar`, then page content

- Data flow
\`\`\`mermaid
sequenceDiagram
  participant U as User
  participant LP as LoginPage
  participant AP as AuthProvider
  participant PG as Protected Page
  U->>LP: Submit username/password
  LP->>AP: onLogin(username,password)
  AP-->>AP: Validate against demoUsers
  AP->>PG: Provide user via context
  PG-->>PG: Gate UI by role; render content
  U->>AP: lock()
  AP->>PG: isLocked=true => render LockScreen
  U->>AP: unlock(pin)
  AP-->>PG: isLocked=false => render content
\`\`\`

- Limitations / technical debt
  - Client-only demo authentication; no real identity provider or persistence
  - Build ignores lint and TS errors; can hide defects in CI/CD
  - Images unoptimized; potential performance implications
  - Static demo data; no backend integration, no API layer
  - Heavy client components across pages; limited SSR/streaming benefits

## 4) Configuration Requirements

- Configurable parameters
  - Auth: demo credentials and `LOCK_PIN` (currently hardcoded)
  - Next.js build strictness: `eslint.ignoreDuringBuilds`, `typescript.ignoreBuildErrors`
  - Images: `images.unoptimized`
  - Tailwind theme tokens in `app/globals.css` (brand colors, radii)
  - Shadcn `components.json` (aliases and base color)

- Environment-specific settings
  - Node.js ≥ 18; package manager (`npm` or `pnpm`) aligned with lockfile
  - Vercel environment: analytics enablement, `NEXT_PUBLIC_*` env if added later
  - Cookie usage in sidebar is client-only; SSR cookies not currently leveraged

- Security considerations
  - Replace hardcoded demo credentials and PIN with secure auth provider
  - Do not ship with build ignores for ESLint/TypeScript in production
  - Validate user input for dialogs/forms; consider server validation
  - Review analytics for PII handling

## 5) Visual Routing Map

\`\`\`mermaid
graph TD
  A[/\/] --> B[/menu/]
  A --> C[/cash-registers/]
  A --> D[/orders/daily/]
  A --> E[/orders/periodic/]
  A --> F[/data/products/]
  A --> G[/data/catalog/]
  A --> H[/data/groups/]
  A --> I[/data/pricing/]
  A --> J[/data/locations/]
  A --> K[/data/departments/]
  A --> L[/data/registers/]
  A --> M[/data/service-registering/]
  A --> N[/data/waiters/]
  A --> O[/warehouse/products/]
  A --> P[/warehouse/incoming/]
  A --> Q[/warehouse/outgoing/]
\`\`\`

## 6) Summary

The project is a Next.js App Router application focused on a role-aware POS system. It employs Tailwind v4 and Radix-based components via Shadcn for a modern UI, and exposes a client-side demo authentication flow. Configuration priorities center on securing auth, enforcing build correctness, optimizing images, and preparing environment variables for future integrations.
