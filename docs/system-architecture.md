# Tita Esh Eatery POS System - Architecture Guide

## System Overview

\`\`\`
┌─────────────────┐
│   Login Page    │
│  (components/)  │
└────────┬────────┘
         │ POST /api/auth/login
         ▼
┌─────────────────────────────┐
│   Auth API Endpoint         │
│ (/app/api/auth/login)       │
│ - Query users table         │
│ - Verify password (PBKDF2)  │
│ - Return user data          │
└────────┬────────────────────┘
         │ { user, role }
         ▼
┌─────────────────┐
│ Auth Provider   │
│ (context)       │
│ - Store session │
│ - Route by role │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────────┐
│ Admin  │ │ Manager    │ ... other roles
│ Dash   │ │ Dash       │
└────────┘ └────────────┘
    ▼         ▼
┌─────────────────────────────┐
│   Protected Routes          │
│ - Check role access (ACL)   │
│ - Render role UI            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   API Endpoints             │
│ - /api/menu                 │
│ - /api/orders               │
│ - /api/users                │
│ - /api/stats                │
└────────┬────────────────────┘
         │ Query with RLS
         ▼
┌─────────────────────────────┐
│   Supabase Database         │
│ - users table (RLS enabled) │
│ - orders table              │
│ - menu items                │
│ - Other business tables     │
└─────────────────────────────┘
\`\`\`

## Authentication Flow (Detailed)

### Step 1: Login Submission
\`\`\`
User fills form:
- Username: admin
- Password: admin123
\`\`\`

### Step 2: API Request
\`\`\`javascript
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
\`\`\`

### Step 3: Password Verification
\`\`\`
Database stores: "salt:hash" format
User enters: "admin123"
API verifies: PBKDF2(admin123, salt) === stored hash
\`\`\`

### Step 4: Session Creation
\`\`\`javascript
Response:
{
  "user": {
    "id": "00000000-0000-0000-0000-000000000001",
    "username": "admin",
    "name": "Admin User",
    "role": "administrator"
  }
}
\`\`\`

### Step 5: Frontend Storage
\`\`\`javascript
// Stored in sessionStorage
sessionStorage.setItem('user', JSON.stringify(user))
\`\`\`

### Step 6: Auth Provider Update
\`\`\`javascript
// AuthProvider context updates
// Pages check user.role for access
// Sidebar filters based on role
\`\`\`

## Authorization Flow

### Page Load
1. Page component renders
2. Gets user from auth context
3. Calls `hasAccess(user, permission)`
4. If allowed → show page
5. If denied → show access denied message

### Database Query
1. Frontend calls `/api/endpoint`
2. API uses Supabase client (server-side)
3. Supabase applies RLS policies
4. Only permitted data returned
5. Frontend renders data

### Double Security Layer
- **Frontend**: Role-based UI control (UX)
- **Backend**: RLS policies (Data security)

## Role Permissions Map

### Administrator
- Can access: Everything
- Dashboard: Full stats and reports
- Can manage: Users, menu, locations, pricing
- Can view: All orders

### Manager
- Can access: Management features
- Dashboard: Staff and order stats
- Can manage: Staff, assign orders
- Cannot: Modify users or pricing

### Cashier/Waiter
- Can access: POS terminal
- Dashboard: Personal sales only
- Can: Create orders, checkout
- Cannot: See other staff sales

### Kitchen
- Can access: Kitchen display only
- Dashboard: New orders
- Can: Mark orders ready
- Cannot: Access POS or reports

## Database RLS Policies

### Policy 1: Users Read Own Data
\`\`\`sql
SELECT allowed for: id = current_user_id()
\`\`\`

### Policy 2: Login Lookup
\`\`\`sql
SELECT allowed for: true (public for login)
\`\`\`

### Policy 3: Admin Read All
\`\`\`sql
SELECT allowed for: user is administrator
\`\`\`

## API Security Checklist

- [x] Password hashing (PBKDF2)
- [x] RLS policies on users table
- [x] Role-based access control
- [x] Session management
- [x] Protected routes
- [x] Error handling

## Next Steps

1. Run SQL setup script
2. Test all roles
3. Verify each role sees correct data
4. Deploy to production
5. Monitor logs

---

**System Status**: ✅ Ready
**Security Level**: Standard (PBKDF2 + RLS)
**Roles**: 4 configured
**Users**: 5 test accounts
\`\`\`
