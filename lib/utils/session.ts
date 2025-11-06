export interface UserSession {
  id: string
  username: string
  role: "administrator" | "manager" | "cashier_waiter" | "kitchen"
  name: string
  loginTime: number
  lastActivity: number
}

// Session storage keys
const SESSION_KEY = "titaesh:session"
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

export function saveSession(user: Omit<UserSession, "loginTime" | "lastActivity">): void {
  const session: UserSession = {
    ...user,
    loginTime: Date.now(),
    lastActivity: Date.now(),
  }
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }
}

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null
  const stored = sessionStorage.getItem(SESSION_KEY)
  if (!stored) return null
  try {
    const session = JSON.parse(stored) as UserSession
    // Check if session is expired
    if (Date.now() - session.lastActivity > SESSION_TIMEOUT_MS) {
      clearSession()
      return null
    }
    return session
  } catch {
    return null
  }
}

export function updateSessionActivity(): void {
  if (typeof window === "undefined") return
  const session = getSession()
  if (session) {
    session.lastActivity = Date.now()
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_KEY)
  }
}

export function isSessionValid(): boolean {
  const session = getSession()
  if (!session) return false
  return Date.now() - session.lastActivity < SESSION_TIMEOUT_MS
}
