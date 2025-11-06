# POS Migration Notes

This document summarizes the integration of V0 POS template components into the current system.

## Scope

- Added a Cashier-gated POS entry page at `/pos`.
- Sidebar updated with a POS menu item, permissioned for `cashier`.
- Pinned Radix and related UI dependencies to compatible versions to prevent `latest` drift.
- Kept Tailwind v4 and PostCSS config aligned with existing setup.
- Introduced `app/pos/layout.tsx` to wrap all POS routes with `CartProvider` so cart state persists across `/pos`, `/pos/checkout`, and `/pos/success`.

## Access Control

- `components/app-sidebar.tsx` updated to include the `pos` permission for `cashier`.
- `app/pos/page.tsx` enforces role gating client-side for now. Future server checks can be added once APIs exist.

## Testing

- Validate Cashier account can access `/pos` and linked workflows (`/orders/daily`, `/cash-registers`, `/menu`).
- Confirm other roles receive an Access Denied message on `/pos`.
- Regression test existing pages remain accessible as per role.

## Follow-ups

- Implement server-side authorization in API routes when backend auth is introduced.
- Replace demo authentication with secure provider and add session persistence.
- Expand POS page to embed full Cashier workflows.

## External Templates & Designs

To support design iteration and prototype imports from the V0 POS system without polluting the repository history, an `external/` directory has been introduced:

- Location: `external/`
- Purpose: Store V0 templates, design exports, prototype snippets, and non-source artifacts used during migration.
- Git ignore: All contents are ignored via `.gitignore` except `external/.gitkeep` and `external/README.md` to keep the directory tracked and documented.
- Usage guidelines:
  - Keep assets here for reference only; do not import directly into the build.
  - When an asset or snippet is ready for production, move it into `app/`, `components/`, or `public/` as appropriate.
  - Suggested subfolders: `external/wireframes/`, `external/ui-variants/`, `external/components/`, `external/assets/`.

This ensures designers and developers can share working materials locally without risking accidental commits of large binaries or experimental code into the main project.
