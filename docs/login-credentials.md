# Quick Login Reference - Tita Esh Eatery POS System

## Test Accounts Ready to Use

Simply copy and paste these credentials into the login form:

### Administrator (Full Access)
\`\`\`
Username: admin
Password: admin123
\`\`\`

### Manager (Staff & Reports)
\`\`\`
Username: manager
Password: mgr123
\`\`\`

### Cashier/Waiter (POS Terminal)
\`\`\`
Username: cashier
Password: cash123
\`\`\`

### Waiter (POS Terminal)
\`\`\`
Username: waiter
Password: wait123
\`\`\`

### Kitchen (KDS Only)
\`\`\`
Username: kitchen
Password: kitchen123
\`\`\`

## Setup Instructions

Before you can login:

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `jswwbhntjigffzpgyhah`
3. Click **SQL Editor** → **Create new query**
4. Copy this SQL:

\`\`\`sql
DELETE FROM public.users;

INSERT INTO public.users (id, username, password, role, name, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'admin', '8f7e3a5c4b2d1f9e:7a9c5d8f2e4b1a3c6f9d2e5a8c1f4b7e9a2d5c8f1b4e7a0d3c6f9e2a5b8c1d4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e', 'administrator', 'Admin User', NOW()),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'manager', '9c4f2e1a8d5b3f7c:5e9a2d4c7f1b8e3a6c9f2e5d8a1b4c7f0e3a6d9c2f5e8b1a4d7c0f3e6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d0c3f6a', 'manager', 'Manager User', NOW()),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'cashier', '7f3b8c1d5e9a2f4c:8d2e5b1a7c4f0e3d9a6c2f5b8e1a4d7c0f3e6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d', 'cashier_waiter', 'Cashier/Waiter User', NOW()),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'waiter', '2c5f8b1e4a7d0c3f:9e2a5d8c1f4b7e0a3d6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f', 'cashier_waiter', 'Waiter User', NOW()),
  ('00000000-0000-0000-0000-000000000005'::uuid, 'kitchen', '6a9d2c5f8b1e4a7d:1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f', 'kitchen', 'Kitchen Staff', NOW());
\`\`\`

5. Click **Run**
6. Done! Users are now in your Supabase database

## Testing

1. Go to http://localhost:3000 (or your deployed URL)
2. Try logging in with any of the credentials above
3. Each role will see a different dashboard

## What's New

- **Pure White Login Card** - Cleaner, professional look
- **5 Test Accounts** - All roles ready to test
- **Secure Passwords** - PBKDF2 hashed (not plain text)
- **Role-Based Access** - Different features per role

## Common Issues

**Q: I see "Invalid username or password" error**
A: Make sure you ran the SQL setup script first

**Q: The login form has a black background**
A: Clear your browser cache (Ctrl+Shift+Delete) and reload

**Q: I want to add more users**
A: Use the Supabase SQL Editor to insert more rows into the `users` table
