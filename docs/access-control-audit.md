# Access Control Audit

This document summarizes the current role-based access controls implemented across the app and outlines testing steps to validate authentication, gating, and key workflows.

## Roles

- `administrator`
- `manager`
- `cashier_waiter`
- `kitchen`

## Sidebar Permissions

The sidebar filters menu items based on `rolePermissions` in `components/app-sidebar.tsx`, ensuring only authorized navigation is visible per role.

## Page-Level Gating Summary

- `app/page.tsx`: Dashboard renders content based on role.
- `app/menu/page.tsx`: Allowed: administrator, manager, cashier_waiter, kitchen.
- `app/orders/daily/page.tsx`: Allowed: administrator, manager, cashier_waiter, kitchen.
- `app/cash-registers/page.tsx`: Allowed: administrator, manager, cashier_waiter.
- `app/pos/page.tsx`: Allowed: cashier_waiter.
- `app/pos/checkout/page.tsx`: Allowed: cashier_waiter.
- `app/pos/success/page.tsx`: Allowed: cashier_waiter. (Fixed from `cashier`).
- `app/warehouse/products/page.tsx`: Allowed: administrator, manager, kitchen.
- `app/warehouse/incoming/page.tsx`: Allowed: administrator, manager, kitchen. (Added)
- `app/warehouse/outgoing/page.tsx`: Allowed: administrator, manager, kitchen. (Added; removed `chef` role usage)

### Data Management

All pages under `app/data/` are restricted to `administrator` and `manager` only:

- `products`, `registers`, `locations`, `departments`, `catalog`, `groups`, `service-registering`, `waiters`, `pricing` (Added/verified)

## Authentication Source

`components/auth-provider.tsx` seeds demo accounts on first load using localStorage. No other file creates users.

Seeded accounts:

- `admin / admin123` → administrator
- `manager / mgr123` → manager
- `cashierwaiter / cw123` → cashier_waiter
- `kitchen / kitchen123` → kitchen

Lock PIN: `1234` (client-only demo; replace in production).

## Test Plan

1. Login UI
   - Verify default credential hints are not displayed on the login page.
   - Login with each seeded account and confirm role shown in the sidebar badge.

2. Access Denied UX
   - Attempt to access restricted pages with unauthorized roles; confirm the Access Denied message.
   - Examples:
     - `cashier_waiter` visiting `/data/products` → denied.
     - `kitchen` visiting `/cash-registers` → denied.
     - `manager` visiting `/pos/success` → denied.

3. Allowed Access
   - Confirm allowed roles can access and interact with pages:
     - `administrator` and `manager` in all `/data/*` pages.
     - `kitchen` can access `/warehouse/products`, `/warehouse/incoming`, `/warehouse/outgoing`.
     - `cashier_waiter` can access `/pos`, `/pos/checkout`, `/pos/success`.

4. Workflow Validation
   - POS: Add items, proceed to checkout, confirm success as `cashier_waiter`.
   - Warehouse: Add/issue stock dialogs visible to allowed roles only.
   - Cash Registers: View overview with admin/manager/cashier_waiter.

## Security Notes

- Client-side demo auth only; replace with a secure provider in production.
- Hardcoded demo credentials and PIN should be removed for real deployments.
- Build strictness should be enforced; remove ignores hiding lint/TS errors.
