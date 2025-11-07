# User Role Access Guide

## Administrator (`admin` / `admin123`)

### Dashboard
- Full system overview with all metrics
- Revenue charts and statistics
- System health indicators

### Navigation Access
- Dashboard
- POS → Terminal, Orders, Checkout
- Kitchen Display System
- Data Management:
  - Users (create, edit, delete)
  - Products (manage inventory)
  - Waiters (manage staff)
- Menu Management
- Reports
- Settings

### Permissions
- Create/edit/delete all records
- Access all user management
- View all system data
- System configuration

---

## Manager (`manager` / `mgr123`)

### Dashboard
- Order and staff overview
- Sales metrics
- Staff performance

### Navigation Access
- Dashboard
- POS → Terminal, Orders, Checkout
- Kitchen Display System
- Data Management:
  - Waiters (view, edit)
  - Products (view, limited edit)
- Menu Management

### Permissions
- View all orders
- Manage waiters/staff
- Limited product editing
- View reports
- Cannot access user management
- Cannot access system settings

---

## Cashier/Waiter (`cashier` / `cash123` or `waiter` / `wait123`)

### Dashboard
- Personal sales dashboard
- Today's orders
- Personal performance metrics

### Navigation Access
- Dashboard
- POS → Terminal, Orders, Checkout
- Kitchen Display System
- Personal data only

### Permissions
- Create new orders
- Process payments
- View own orders
- Cannot create/edit users
- Cannot access menu management
- Cannot access data management pages
- Cannot view other staff members' data

---

## Kitchen (`kitchen` / `kitchen123`)

### Dashboard
- Kitchen display system only
- Active orders queue
- Order details and timing

### Navigation Access
- Kitchen Display System only
- Auto-redirects from dashboard
- No other page access

### Permissions
- View active orders
- Mark orders as complete
- Cannot create orders
- Cannot process payments
- No access to other system features
- No data management access

---

## How to Verify Access

### Step 1: Login as Admin
1. Username: `admin`
2. Password: `admin123`
3. Should see full dashboard with all menu items

### Step 2: Login as Manager
1. Username: `manager`
2. Password: `mgr123`
3. Should see limited dashboard, no user management

### Step 3: Login as Cashier
1. Username: `cashier`
2. Password: `cash123`
3. Should see POS-focused dashboard, no data management

### Step 4: Login as Waiter
1. Username: `waiter`
2. Password: `wait123`
3. Same access as cashier

### Step 5: Login as Kitchen
1. Username: `kitchen`
2. Password: `kitchen123`
3. Should immediately see kitchen display

## Testing Checklist

- [ ] Admin login works - full access
- [ ] Manager login works - limited access
- [ ] Cashier login works - POS only
- [ ] Waiter login works - POS only
- [ ] Kitchen login works - kitchen display only
- [ ] Card layout stays compact on mobile
- [ ] Card layout stays compact on desktop
- [ ] Login card is pure white background
- [ ] All role-specific pages load correctly
