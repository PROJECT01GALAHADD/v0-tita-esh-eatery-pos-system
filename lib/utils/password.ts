import crypto from "crypto"

/**
 * Hash password using PBKDF2 (for demo purposes)
 * NOTE: In production, use bcrypt or similar
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

/**
 * Verify password against stored hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":")
  if (!salt || !hash) return false
  const computedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return computedHash === hash
}
