# Quick Setup Reference

## The Problem
Previous SQL script was missing the `current_user_id()` function definition.

## The Solution
New SQL script in `scripts/setup-users-and-rls.sql` now includes it.

## 3-Minute Setup

1. **Copy this script:**
   - File: `scripts/setup-users-and-rls.sql`

2. **Paste into Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/jswwbhntjigffzpgyhah
   - Click: SQL Editor → New Query
   - Paste entire script
   - Click: Run

3. **Wait for success message**

4. **Check Auth > Users** - Should show 5 users

5. **Login at localhost:3000 with:**
   \`\`\`
   Username: admin
   Password: admin123
   \`\`\`

## Test All Roles

After login as admin, logout and test each role:

- admin / admin123 → Full system access
- manager / mgr123 → Manager dashboard
- cashier / cash123 → Cashier interface
- waiter / wait123 → Waiter interface
- kitchen / kitchen123 → Kitchen display

## Done!

Your POS system is now fully functional with all users and RLS policies.
