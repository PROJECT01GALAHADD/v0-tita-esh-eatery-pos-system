# Configuration Checklist

Use this checklist to guide configuration before implementation. Priorities: High (🔴), Medium (🟠), Low (🟢).

## Environment & Build

- [ ] 🔴 Verify Node.js version (≥ 18) and package manager alignment (`npm` vs `pnpm`).
- [ ] 🔴 Remove `eslint.ignoreDuringBuilds: true` for production builds.
- [ ] 🔴 Remove `typescript.ignoreBuildErrors: true` to enforce type safety in CI/CD.
- [ ] 🟠 Confirm `postcss.config.mjs` includes `@tailwindcss/postcss` and Tailwind v4 import is present in `app/globals.css`.
- [ ] 🟢 Validate `tsconfig.json` settings (strict mode, App Router plugin, bundler resolution).

## Authentication & Security

- [ ] 🔴 Replace hardcoded demo credentials and `LOCK_PIN` with environment-driven secrets.
- [ ] 🔴 Choose and integrate an auth provider (e.g., OAuth/OIDC or password-based with server APIs).
- [ ] 🟠 Add session persistence (cookies/JWT) and role claims validation.
- [ ] 🟠 Sanitize/validate inputs across dialogs/forms and guard against basic XSS.
- [ ] 🟢 Add logout/lock behavior policies (timeouts, inactivity) and audit logging plan.

## UI/UX & Theming

- [ ] 🟠 Wire `ThemeProvider` at the layout level to enable dark mode toggling.
- [ ] 🟢 Review Tailwind theme tokens in `globals.css` to match brand colors and accessibility contrast.
- [ ] 🟢 Confirm Shadcn `components.json` aliases and baseColor settings.

## Performance & Images

- [ ] 🟠 Evaluate `images.unoptimized: true`; enable Next Image optimization or configure domains.
- [ ] 🟢 Audit heavy client components and consider SSR/streaming where feasible.

## Routing & Access Control

- [ ] 🟠 Verify `rolePermissions` in `app-sidebar.tsx` meets business requirements.
- [ ] 🟠 Add 403/404 pages and guard routes consistently.

## Observability & Analytics

- [ ] 🟠 Configure `@vercel/analytics` with privacy settings; avoid PII.
- [ ] 🟢 Add basic error reporting (e.g., Sentry) for production environments.

## Deployments

- [ ] 🟠 Validate Vercel project settings (env vars, build flags, image domains).
- [ ] 🟢 Confirm redirects/rewrite needs (none currently).

## Documentation & Testing

- [ ] 🟠 Document environment variables (`.env` schema) and configuration instructions.
- [ ] 🟠 Add minimal unit tests for auth context and permission gating.
- [ ] 🟢 Add README “Getting Started” with dev/build runbooks.

