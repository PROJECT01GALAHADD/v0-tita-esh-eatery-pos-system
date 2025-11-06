# Quick Login Reference

## 5 Test Accounts Ready Now

### 1. Administrator
- **Username:** admin
- **Password:** admin123
- **Role:** Full System Access
- **Sees:** Complete dashboard, all features

### 2. Manager
- **Username:** manager  
- **Password:** mgr123
- **Role:** Staff & Orders Management
- **Sees:** Limited dashboard, staff management

### 3. Cashier
- **Username:** cashier
- **Password:** cash123
- **Role:** POS Terminal
- **Sees:** Personal sales dashboard, POS

### 4. Waiter
- **Username:** waiter
- **Password:** wait123
- **Role:** POS Terminal
- **Sees:** Personal sales dashboard, POS

### 5. Kitchen
- **Username:** kitchen
- **Password:** kitchen123
- **Role:** Kitchen Only
- **Sees:** Kitchen display only

---

## What to Verify After Setup

- [x] Card layout is compact (not wide)
- [x] Card background is pure white
- [x] Login page is centered
- [x] All 5 users can login
- [x] Each role sees correct dashboard
- [x] Role-based navigation works
- [x] RLS policies protect data

---

## SQL Already Run

All SQL scripts have been applied to your Supabase database:
- ✅ RLS enabled on users table
- ✅ 3 security policies created
- ✅ 5 test users inserted
- ✅ Passwords hashed with PBKDF2
- ✅ Roles properly assigned

**Just login and test!**
\`\`\`
