# Supabase Setup Instructions

## Step 1: Enable RLS and Create Policies

Go to https://supabase.com/dashboard/project/jswwbhntjigffzpgyhah/sql/new

Copy and paste the entire SQL from `scripts/setup-users-and-rls.sql` and run it.

This will:
- Enable Row Level Security on the users table
- Create 4 RLS policies for data protection
- Delete any existing test users
- Insert 5 new test users with proper hashing

## Step 2: Verify Users Were Created

1. Navigate to **Auth > Users** section
2. You should see 5 users:
   - admin
   - manager
   - cashier
   - waiter
   - kitchen

## Step 3: Test Login with Each Role

### Test Accounts

| Username | Password | Role | Access |
|----------|----------|------|--------|
| admin | admin123 | Administrator | Full system access, all dashboards |
| manager | mgr123 | Manager | Staff management, order oversight |
| cashier | cash123 | Cashier/Waiter | POS, orders, own sales |
| waiter | wait123 | Cashier/Waiter | POS, orders, own sales |
| kitchen | kitchen123 | Kitchen | Kitchen display only |

### How to Test

1. Go to the login page
2. Try each username/password combination
3. Verify you're redirected to the correct dashboard for that role
4. Check that you can only access pages allowed for that role

## RLS Policies Explained

### Policy 1: Users Read Own Data
- Users can only read their own profile information
- Prevents unauthorized data exposure

### Policy 2: Login Username Lookup
- Allows reading usernames for authentication
- Used during login process

### Policy 3: Admin Read All Users
- Administrators can view all user profiles
- Necessary for user management dashboard

## Troubleshooting

If you see "RLS policy error":
1. Ensure RLS policies are created (Policy 1-3 above)
2. Check that user ID matches in the policy
3. Verify the role column contains valid values

If login fails:
1. Check username exists in users table
2. Verify password hash format: `salt:hash`
3. Ensure user has a valid role
