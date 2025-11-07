/**
 * Seed core POS users into Supabase `public.users` with hashed passwords.
 * Uses PBKDF2 (matching lib/utils/password.ts) and upserts by `username`.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-users.mjs
 */
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

const USERS = [
  { username: "admin",   name: "Admin User",    role: "administrator",  password: "admin123" },
  { username: "manager", name: "Manager User",  role: "manager",        password: "mgr123" },
  { username: "cashier", name: "Cashier User",  role: "cashier_waiter", password: "cash123" },
  { username: "waiter",  name: "Waiter User",   role: "cashier_waiter", password: "wait123" },
  { username: "kitchen", name: "Kitchen Staff", role: "kitchen",        password: "kitchen123" },
]

async function main() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error("Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  const supabase = createClient(url, key)

  console.log("Seeding users into public.users ...")
  for (const u of USERS) {
    const hashed = hashPassword(u.password)
    const { error } = await supabase
      .from("users")
      .upsert({ username: u.username, name: u.name, role: u.role, password: hashed }, { onConflict: "username" })

    if (error) {
      console.error(`Failed to upsert ${u.username}:`, error.message)
      process.exitCode = 1
    } else {
      console.log(`Upserted user: ${u.username} (${u.role})`)
    }
  }

  const { data, error: listErr } = await supabase
    .from("users")
    .select("id, username, role, name, created_at")
    .order("created_at", { ascending: false })

  if (listErr) {
    console.error("Error listing users:", listErr.message)
    process.exit(1)
  }

  console.table(data || [])
}

main().catch((e) => {
  console.error("Unexpected error:", e?.message || e)
  process.exit(1)
})

