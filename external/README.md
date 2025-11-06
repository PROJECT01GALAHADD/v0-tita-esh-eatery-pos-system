# External V0 Templates & Designs

This directory is intended for storing V0 templates, design files, exports, and other non-source artifacts used during the POS migration.

Important notes:
- This folder is git-ignored, so its contents will not be pushed.
- Keep assets here for reference only. Copy anything that must be used by the app into `app/`, `components/`, or `public/` accordingly.
- Suggested structure:
  - `external/wireframes/`
  - `external/ui-variants/`
  - `external/components/` (prototype code snippets not yet integrated)
  - `external/assets/` (images, icons, fonts)

If you need these resources in the build, move or import them into the appropriate project folders.

## Starter Checklist

- Create subfolders locally for organization:
  - `external/wireframes/`
  - `external/ui-variants/`
  - `external/components/`
  - `external/assets/`
- Drop V0 exports and design prototypes into these subfolders.
- When an item is ready for production:
  - Move UI code into `components/` or `app/` routes.
  - Move static assets into `public/`.
  - Confirm imports use production paths (not `external/`).
- Keep sensitive or large binaries here; they won’t be committed due to `.gitignore`.

Notes:
- Only `external/.gitkeep` and `external/README.md` are tracked to document intent.
- Subfolder contents (including their `.gitkeep`) are intentionally untracked.
