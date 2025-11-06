# Tita Esh Eatery POS System

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/galahadd-workspace/v0-keeping-food-pos)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/S3kwqEzWfk3)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/galahadd-workspace/v0-keeping-food-pos](https://vercel.com/galahadd-workspace/v0-keeping-food-pos)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/S3kwqEzWfk3](https://v0.app/chat/S3kwqEzWfk3)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## MongoDB Atlas Integration

- Install the driver: `npm install mongodb` (already installed).
- Set `MONGODB_URI` locally in `.env.local` and in Vercel Project Settings → Environment Variables.
- Connection helper is available at `lib/mongodb.ts` (reuses a single client in dev).
- Verify connectivity via health endpoint: `GET /api/health/db`.

Example `.env.local`:

\`\`\`
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/?retryWrites=true&w=majority"
\`\`\`

Security notes:
- Do not commit real credentials. `.env*` is ignored by `.gitignore`.
- Rotate credentials periodically and prefer scoped users with least privilege.

Deploy notes:
- Ensure Vercel has `MONGODB_URI` set for Production and Preview environments.
- Recommended Node.js version: 18+ (Vercel default).
- If builds are failing silently, consider removing `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` in `next.config.mjs` for production.

## NocoDB Integration and Dual-Database Sync

This project supports a dual-database architecture: MongoDB as the primary operational store and NocoDB as a manager-friendly interface (backed by SQL). A sync middleware keeps both in near real-time alignment.

### Configure NocoDB

1. Install/host NocoDB and create a project with tables mirroring MongoDB collections:
   - Waiter Operations (`externalId`, `waiterId`, `tableNumber`, `action`, `notes`, `updatedAt`, `source`, `version`)
   - Chef Orders (`externalId`, `orderId`, `status`, `items(JSON)`, `updatedAt`, `source`, `version`)
   - Cashier Transactions (`externalId`, `txnId`, `amount`, `currency`, `method`, `updatedAt`, `source`, `version`)

2. Generate an API token and capture the table endpoints (commonly `/api/v2/tables/{tableId}`):
   - Set env in `.env.local` and Vercel:
     - `NOCO_BASE_URL`, `NOCO_API_TOKEN`
     - `NOCO_TABLE_WAITER_OPS`, `NOCO_TABLE_CHEF_ORDERS`, `NOCO_TABLE_CASHIER_TXNS`
   - Optional sync policy:
     - `SYNC_CONFLICT_POLICY` (`source_priority` or `last_write_wins`)
     - `SYNC_PRIORITY_NOCO`, `SYNC_PRIORITY_MONGO`

### Sync Endpoints

- MongoDB → NocoDB: `POST /api/sync/mongo-change`
  - Use MongoDB Atlas Triggers (recommended) to POST inserts/updates/deletes with payload:
    \`\`\`json
    { "collection": "waiterOps|chefOrders|cashierTxns", "operation": "insert|update|delete", "document": {"externalId": "...", ...}, "externalId": "..." }
    \`\`\`

- NocoDB → MongoDB: `POST /api/sync/nocodb-webhook`
  - Configure NocoDB automation/webhook for row created/updated/deleted events. Payload must include `data.externalId` for identification.

- Monitoring: `GET /api/sync/status`
  - Returns MongoDB ping and presence of required NocoDB env vars/table paths.

### Operational Notes

- Vercel Functions are stateless; prefer Atlas Triggers for real-time events into `/api/sync/mongo-change`.
- Conflict resolution is configurable; default prioritizes NocoDB (manager edits) over MongoDB on ties, then timestamps.
- Backups:
  - MongoDB Atlas continuous backups (configure per cluster).
  - NocoDB’s underlying SQL database: use native DB backups (e.g., Postgres dump) and NocoDB export for schema.

### Testing

- Seed sample docs into MongoDB and verify NocoDB mirrors via the trigger.
- Update in NocoDB UI and confirm MongoDB reflects changes with expected conflict policy.
- Load tests: simulate concurrent writes (waiter/chef/cashier) and check sync latency and correctness.
