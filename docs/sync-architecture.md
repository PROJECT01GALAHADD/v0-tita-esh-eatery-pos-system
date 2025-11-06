# Dual-Database Architecture: MongoDB + NocoDB

This document describes the architecture, synchronization flow, conflict resolution, user access setup, monitoring, and backup procedures for a dual-database approach combining MongoDB (operational) and NocoDB (manager UI).

## Overview

- MongoDB Atlas: Primary operational database.
- NocoDB: Manager-friendly interface backed by SQL (e.g., Postgres/MySQL).
- Sync middleware: Next.js API routes and helpers for bi-directional updates.
- Real-time: Use MongoDB Atlas Triggers to call a webhook; NocoDB automations/webhooks to notify changes.

## Data Model

- Collections / Tables:
  - `waiter_ops`: waiter operations
  - `chef_orders`: chef order management
  - `cashier_txns`: cashier transactions

Common fields across entities:
- `externalId` (string) — stable identifier used to correlate between systems
- `updatedAt` (ISO string)
- `source` (`mongo` | `nocodb`)
- `version` (number, optional)

## Synchronization Flow

1. MongoDB → NocoDB
   - Atlas Trigger sends change payload to `POST /api/sync/mongo-change`.
   - Sync service upserts into NocoDB via token-auth API using `externalId`.

2. NocoDB → MongoDB
   - NocoDB webhook posts row events to `POST /api/sync/nocodb-webhook`.
   - Sync service resolves conflicts and upserts into MongoDB.

3. Deletes
   - Trigger/webhook forwarded to `deleteSync` to remove in the opposite datastore.

## Conflict Resolution

- Policy options:
  - `source_priority` (default): prefer `nocodb` edits over `mongo` on ties, then `updatedAt`.
  - `last_write_wins`: compare by `updatedAt` only.

Configure via env:
- `SYNC_CONFLICT_POLICY`, `SYNC_PRIORITY_NOCO`, `SYNC_PRIORITY_MONGO`.

## User Access (NocoDB)

- Create views/forms tailored for managers:
  - Waiter Ops View: filters, form for action/notes.
  - Chef Orders Board: Kanban by `status`, edit `items` via JSON field or sub-table.
  - Cashier Txns Table: amount, currency, method.
- Configure roles: manager can edit; restrict waiter/chef/cashier roles to needed tables/views.
- Use NocoDB RBAC and sharing links for non-technical users.

## Monitoring

- `GET /api/sync/status`: checks Mongo ping and Noco env presence.
- Logs: capture sync errors and webhook failures in Vercel logs; optionally forward to Sentry.

## Backup & Recovery

- MongoDB Atlas: enable continuous backups and PITR.
- NocoDB DB: schedule native DB backups (pg_dump/mysqldump) and store securely.
- Recovery: restore DBs and re-run sync to reconcile. Use `externalId` to avoid duplicates.

## Testing Plan

- Accuracy: insert/update/delete in MongoDB and ensure NocoDB mirrors; repeat from NocoDB side.
- Concurrency: simulate multi-role writes; validate conflict policy outcomes.
- Performance: load test high transaction volumes; monitor latency and error rate.
- Usability: manager workflow in NocoDB views/forms; gather feedback.

## Implementation References

- NocoDB client: `lib/nocodb.ts`
- Models: `lib/sync/models.ts`
- Conflict resolution: `lib/sync/conflict.ts`
- Sync service: `lib/sync/service.ts`
- Webhooks:
  - Mongo → Noco: `app/api/sync/mongo-change/route.ts`
  - Noco → Mongo: `app/api/sync/nocodb-webhook/route.ts`
- Status: `app/api/sync/status/route.ts`

