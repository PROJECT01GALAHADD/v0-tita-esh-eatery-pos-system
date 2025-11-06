// ... existing code from start to Stack line ...

**Stack**: Next.js 15.2.4, React 18, TypeScript, Tailwind CSS 4, Supabase (PostgreSQL)

// ... existing code up to "Never Commit These Files" section ...

### 3. **Never Commit These Files**
- `.env.local` - Contains secrets (Supabase)
- `.env` - Any environment files
- `.trae/` - Trae IDE configuration directory
- `.trae/rules/project_rules.md` - This file (local AI configuration)
- `.next/` - Build artifacts
- `node_modules/` - Dependencies
- `.vercel/` - Vercel config
- `*.tsbuildinfo` - TypeScript build info

// ... existing code up to "Supabase (Primary Database)" section ...

### Supabase (Primary Database)

#### Configuration Details
- **Project Name**: v0-titaeshpos-database
- **Region**: Singapore (Southeast Asia) - sin1
- **Project ID**: jswwbhntjigffzpgyhah
- **Connection**: Direct and Pooled connections available
- **Public Environment Variables Prefix**: `NEXT_PUBLIC_`

#### Database Structure
Supabase PostgreSQL replaces legacy collections with SQL tables:
- `waiter_operations` - Waiter operations and table management
- `chef_orders` - Kitchen order processing
- `cashier_transactions` - Payment transactions
- `users` - User authentication (Supabase Auth)
- `profiles` - User profile data
- `menu_items` - Restaurant menu catalog
- `orders` - Order management
- `payments` - Payment records

// ... keep existing code until NocoDB section ...

### NocoDB (Optional Manager Interface)
⚠️ **DEPRECATED** - NocoDB is no longer part of the project architecture. Use Supabase Dashboard for data management instead.

// ... keep existing code until "Legacy MongoDB Atlas" section ...

### Legacy MongoDB Atlas (Deprecated)
⚠️ **MIGRATION COMPLETE** - MongoDB is no longer used
- Previous collections migrated to Supabase PostgreSQL tables
- All MongoDB environment variables removed
- Keep migration documentation for historical reference only

// ... keep existing code until "Sync Middleware Rules" section ...

## Sync Middleware Rules

### ⚠️ DEPRECATED - MongoDB/NocoDB Sync
**REMOVED** - The sync middleware for MongoDB and NocoDB is no longer part of this project. All database operations now use Supabase directly.

### Supabase Real-time Subscriptions (Current Approach)
Use Supabase's built-in real-time features for all data updates:

\`\`\`typescript
// Subscribe to table changes
const channel = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: '*', // 'INSERT' | 'UPDATE' | 'DELETE' | '*'
      schema: 'public',
      table: 'orders'
    },
    (payload) => {
      console.log('Change received!', payload)
      // Update UI, trigger notifications, etc.
    }
  )
  .subscribe()

// Unsubscribe when done
channel.unsubscribe()
\`\`\`

// ... rest of existing code ...
