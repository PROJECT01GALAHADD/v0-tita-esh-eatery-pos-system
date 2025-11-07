# Supabase Setup - Step by Step Guide

## Problem Solved
The previous SQL error occurred because the `current_user_id()` function didn't exist. We've now created it in the first step of the script.

## How to Run the SQL Script

### Step 1: Copy the SQL Script
Go to `scripts/setup-users-and-rls.sql` in the project and copy ALL the content.

### Step 2: Open Supabase SQL Editor
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: **jswwbhntjigffzpgyhah**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 3: Paste and Run the SQL
1. Paste the entire SQL script into the editor
2. Click **Run** button (or press Ctrl+Enter)
3. Wait for it to complete - you should see: **"Success. No rows returned"**

### Step 4: Verify Users Were Created
After running the script, go to **Authentication > Users** in Supabase dashboard.
You should see 5 users:
- admin
- manager
- cashier
- waiter
- kitchen

If they don't appear, check the SQL Editor output for errors.

## Test Credentials

Use these to login at http://localhost:3000:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Administrator |
| manager | mgr123 | Manager |
| cashier | cash123 | Cashier/Waiter |
| waiter | wait123 | Cashier/Waiter |
| kitchen | kitchen123 | Kitchen |

## What the SQL Does

1. **Creates `current_user_id()` function** - Wraps Supabase's auth.uid()
2. **Enables RLS** - Row Level Security on users table
3. **Creates 3 RLS Policies**:
   - Users can read their own data
   - Login lookup allows reading by username
   - Admins can read all users
4. **Inserts 5 test users** with PBKDF2-hashed passwords
5. **Verifies** the setup worked

## Troubleshooting

### Error: "function current_user_id() does not exist"
This is the OLD script. Use the NEW script from `scripts/setup-users-and-rls.sql` which creates this function first.

### Users appear but login fails
Make sure you're using the correct passwords from the table above.

### Login page is blank
Run the SQL script to create the users. The auth provider waits for users to exist.

### "Permission denied for schema public"
Make sure you're logged in with a Supabase account with admin privileges on this project.

## Next Steps

1. Run the SQL script in Supabase
2. Verify users appear in Auth > Users
3. Go to http://localhost:3000
4. Login with admin/admin123
5. Test each role by logging in with their credentials

That's it! Your POS system is ready to use.
