-- ============================================
-- STEP 1: Create helper function for current_user_id
-- ============================================
-- This function returns the current authenticated user's ID
-- It wraps Supabase's built-in auth.uid() function
CREATE OR REPLACE FUNCTION current_user_id() RETURNS uuid AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================
-- STEP 2: Enable RLS on users table
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Drop existing policies (if any)
-- ============================================
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Allow username lookup for login" ON public.users;
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;

-- ============================================
-- STEP 4: Create RLS Policies
-- ============================================

-- Policy 1: Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (id = current_user_id());

-- Policy 2: Allow login - lookup by username (public access for login)
CREATE POLICY "Allow username lookup for login" ON public.users
  FOR SELECT 
  USING (true);

-- Policy 3: Admins can read all users
CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users AS u
      WHERE u.id = current_user_id()
      AND u.role = 'administrator'
    )
  );

-- ============================================
-- STEP 5: Clean up and insert test users
-- ============================================

-- Delete existing test users
DELETE FROM public.users WHERE username IN ('admin', 'manager', 'cashier', 'waiter', 'kitchen');

-- Insert test users with PBKDF2 hashed passwords
INSERT INTO public.users (id, username, password, role, name, created_at) VALUES
  (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'admin',
    '5f7a9c2e1b4d6f3a:6e8f2c5a1d9b4e7f3a2c8f5d1b9e4a7c6f2e5d8b1a9c4f7e3d0a2b5c8f1e4d7a0c9f2e5b8d1a4c7f0e3b6d9c2f5e8a1d4c7f0e3b6d9c',
    'administrator',
    'Admin User',
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000002'::uuid,
    'manager',
    '3b8f2e5a1c9d4e7f:2c5f8b1e4a7d0c3f9e2a5d8c1f4b7e0a3d6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f',
    'manager',
    'Manager User',
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000003'::uuid,
    'cashier',
    '7e2f4a1d9c5b8e3f:8d2e5b1a7c4f0e3d9a6c2f5b8e1a4d7c0f3e6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d',
    'cashier_waiter',
    'Cashier User',
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000004'::uuid,
    'waiter',
    '2d7f9a3e1b5c8f4a:9e2a5d8c1f4b7e0a3d6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a',
    'cashier_waiter',
    'Waiter User',
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000005'::uuid,
    'kitchen',
    '4c1e9f7a3d5b2f8e:1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f',
    'kitchen',
    'Kitchen Staff',
    NOW()
  );

-- ============================================
-- STEP 6: Verify setup
-- ============================================
-- Run this query to verify users were created:
SELECT id, username, role, name FROM public.users ORDER BY created_at DESC;
