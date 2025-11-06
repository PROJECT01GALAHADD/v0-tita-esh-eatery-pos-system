# Configuration Challenges & Risks

This document outlines potential pitfalls and considerations during configuration.

## High Risks

- Build error suppression:
  - `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true` can let defects ship. Recommendation: enforce lint and type correctness in CI/CD.
- Demo authentication:
  - Hardcoded credentials and PIN; no real identity provider or persistence. Recommendation: integrate secure auth and store secrets in env.

## Medium Risks

- Image optimization disabled:
  - `images.unoptimized: true` may degrade performance on production. Recommendation: enable Next image optimization and configure domains.
- Client-heavy pages:
  - Most pages are `"use client"`; SSR benefits are limited. Recommendation: evaluate SSR/streaming for heavy dashboards.
- Role-based gating in UI only:
  - Permissions enforced at the UI; no server-side checks. Recommendation: add server-side authorization once APIs exist.
- Analytics and privacy:
  - Ensure `@vercel/analytics` avoids PII and is properly configured.

## Low Risks

- Tailwind v4 migration:
  - Ensure plugin usage and imports are correct; currently configured via PostCSS and `globals.css`.
- Sidebar cookie:
  - Cookie set via client JS; not used for SSR. Be mindful if future SSR depends on it.
- Static demo data:
  - Data arrays for pages; replacing with APIs will require model and state updates.

## Dependencies & Versioning

- Next.js 15.x:
  - Verify Node version alignment and any breaking changes across minor releases.
- Shadcn/Radix upgrades:
  - Stay consistent with component APIs and theme config.

## Mitigations

- Enforce CI quality gates (lint, typecheck, tests).
- Introduce environment variables for secrets and runtime configurations.
- Plan API layer and server authorization.
- Enable image optimization and review performance.
