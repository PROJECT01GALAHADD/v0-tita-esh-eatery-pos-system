# Tita Esh Eatery POS System - User Setup Guide

## Test Users - Initial Credentials

| Username | Password | Role | Access Level |
|----------|----------|------|--------------|
| admin | admin123 | Administrator | Full system access, all features |
| manager | mgr123 | Manager | Staff management, reports, order history |
| cashier | cash123 | Cashier/Waiter | POS terminal, order creation, payment |
| waiter | wait123 | Cashier/Waiter | POS terminal, order creation, payment |
| kitchen | kitchen123 | Kitchen | Kitchen display system only |

## Setup Instructions

### Option 1: Automatic Setup via Supabase Console (RECOMMENDED)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **Create a new query**
4. Copy and paste the SQL from `scripts/seed-users.sql`
5. Click **Run** button
6. Verify the users appear in the Auth > Users tab

### Option 2: Manual SQL Query

If you prefer to enter the SQL manually, use the provided SQL script in `scripts/seed-users.sql`. This will:
- Delete any existing test users
- Create 5 new users with the roles above
- Hash passwords using PBKDF2 for security
- Assign proper role-based access

## Database Schema

The `users` table structure:
\`\`\`sql
CREATE TABLE public.users (
  id uuid PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password text NOT NULL,  -- PBKDF2 hashed (salt:hash format)
  role text NOT NULL,      -- 'administrator', 'manager', 'cashier_waiter', 'kitchen'
  name text,
  created_at timestamp with time zone DEFAULT NOW()
);
\`\`\`

## Role Permissions

### Administrator
- Full system access
- User management
- Menu management
- Reports and analytics
- Settings configuration

### Manager
- View all orders
- Staff management
- Daily/weekly reports
- Inventory overview

### Cashier/Waiter
- POS terminal access
- Create and process orders
- Payment processing
- View own sales

### Kitchen
- Kitchen Display System (KDS)
- View active orders
- Update order status
- No payment or administrative access

## Password Hashing

All passwords are hashed using PBKDF2 with:
- 1000 iterations
- SHA-512 algorithm
- Random 16-byte salt per user

**Hash Format:** `salt:hash`

Example: `8f7e3a5c4b2d1f9e:7a9c5d8f2e4b1a3c6f9d2e5a8c1f4b7e...`

## Testing the System

1. Navigate to the login page
2. Enter username and password from the table above
3. System will authenticate and redirect to role-appropriate dashboard
4. Test different roles to verify access control works

## Troubleshooting

### Users not appearing after SQL execution
- Verify the query executed without errors
- Check Supabase project is connected
- Ensure you're in the correct project

### Login fails but user exists
- Clear browser cache/cookies
- Verify password is entered correctly
- Check user role is one of: `administrator`, `manager`, `cashier_waiter`, `kitchen`

### Need to reset a password
1. Go to Supabase SQL Editor
2. Run: `UPDATE public.users SET password = 'new_hashed_password' WHERE username = 'username'`
3. Use the hash-passwords.ts script to generate the hash

## Next Steps

After users are created:
1. Test login with each role
2. Verify role-based access control is working
3. Navigate through each dashboard
4. Test POS functionality with cashier account
5. Monitor kitchen display with kitchen account
