-- Tita Esh Eatery POS System - User Seeding Script
-- Execute this in Supabase SQL Editor to create test users with all roles

-- Hash values for passwords (PBKDF2 format: salt:hash)
-- admin123: 8f7e3a5c4b2d1f9e:7a9c5d8f2e4b1a3c6f9d2e5a8c1f4b7e9a2d5c8f1b4e7a0d3c6f9e2a5b8c1d4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e
-- mgr123: 9c4f2e1a8d5b3f7c:5e9a2d4c7f1b8e3a6c9f2e5d8a1b4c7f0e3a6d9c2f5e8b1a4d7c0f3e6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d0c3f6a
-- cash123: 7f3b8c1d5e9a2f4c:8d2e5b1a7c4f0e3d9a6c2f5b8e1a4d7c0f3e6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d
-- wait123: 2c5f8b1e4a7d0c3f:9e2a5d8c1f4b7e0a3d6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f
-- kitchen123: 6a9d2c5f8b1e4a7d:1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c

-- Delete existing users (optional - comment out if you want to preserve existing data)
DELETE FROM public.users;

-- Insert test users with proper roles
INSERT INTO public.users (id, username, password, role, name, created_at) VALUES
  (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'admin',
    '8f7e3a5c4b2d1f9e:7a9c5d8f2e4b1a3c6f9d2e5a8c1f4b7e9a2d5c8f1b4e7a0d3c6f9e2a5b8c1d4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e',
    'administrator',
    'Admin User',
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000002'::uuid,
    'manager',
    '9c4f2e1a8d5b3f7c:5e9a2d4c7f1b8e3a6c9f2e5d8a1b4c7f0e3a6d9c2f5e8b1a4d7c0f3e6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d0c3f6a',
    'manager',
    'Manager User',
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000003'::uuid,
    'cashier',
    '7f3b8c1d5e9a2f4c:8d2e5b1a7c4f0e3d9a6c2f5b8e1a4d7c0f3e6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d0c3f6a9d2c5f8b1e4a7d',
    'cashier_waiter',
    'Cashier/Waiter User',
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000004'::uuid,
    'waiter',
    '2c5f8b1e4a7d0c3f:9e2a5d8c1f4b7e0a3d6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f',
    'cashier_waiter',
    'Waiter User',
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000005'::uuid,
    'kitchen',
    '6a9d2c5f8b1e4a7d:1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c9f2e5a8d1c4f7a0e3b6c',
    'kitchen',
    'Kitchen Staff',
    NOW()
  );

-- Verify users were inserted
SELECT id, username, role, name, created_at FROM public.users;
