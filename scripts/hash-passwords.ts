/**
 * Generate PBKDF2 hashed passwords for the seed script
 * Run this locally to generate the hash values
 */
import crypto from "crypto"

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

const passwords = {
  admin: "admin123",
  manager: "mgr123",
  cashier: "cash123",
  waiter: "wait123",
  kitchen: "kitchen123",
}

console.log("Generated password hashes for SQL seed script:")
console.log("=" + "=".repeat(79))
Object.entries(passwords).forEach(([user, pass]) => {
  const hash = hashPassword(pass)
  console.log(`${user.padEnd(10)} / ${pass.padEnd(15)} -> ${hash}`)
})
