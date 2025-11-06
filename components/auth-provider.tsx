"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { LockScreen } from "./lock-screen"
import { LoginPage } from "./login-page"
import { saveSession, clearSession, updateSessionActivity, getSession, isSessionValid } from "@/lib/utils/session"

type UserRole = "administrator" | "manager" | "cashier_waiter" | "kitchen"

interface User {
  id: string
  username: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: User | null
  isLocked: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  lock: () => void
  unlock: (pin: string) => boolean
  listUsers: () => Promise<Array<Pick<User, "id" | "username" | "name" | "role">>>
  createUser: (params: { username: string; name: string; role: UserRole; password: string }) => Promise<{
    success: boolean
    error?: string
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const LOCK_PIN = "1234"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (session && isSessionValid()) {
      setUser({
        id: session.id,
        username: session.username,
        role: session.role,
        name: session.name,
      })
    } else {
      clearSession()
    }
  }, [])

  useEffect(() => {
    if (!user) return
    const handleActivity = () => updateSessionActivity()
    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("keydown", handleActivity)
    return () => {
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keydown", handleActivity)
    }
  }, [user])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const json = await res.json()
      if (!res.ok || !json?.user) return false
      setUser(json.user)
      saveSession(json.user)
      setIsLocked(false)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setIsLocked(false)
    clearSession()
  }

  const lock = () => {
    setIsLocked(true)
  }

  const unlock = (pin: string): boolean => {
    if (pin === LOCK_PIN) {
      setIsLocked(false)
      return true
    }
    return false
  }

  const listUsers = async () => {
    try {
      const res = await fetch("/api/users", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load users")
      return (json.users || []) as Array<Pick<User, "id" | "username" | "name" | "role">>
    } catch {
      return []
    }
  }

  const createUser: AuthContextType["createUser"] = async ({ username, name, role, password }) => {
    if (!user || !["administrator", "manager"].includes(user.role)) {
      return { success: false, error: "Only Admin/Manager can create users" }
    }
    const validRoles = ["administrator", "manager", "cashier_waiter", "kitchen"]
    if (!validRoles.includes(role)) {
      return { success: false, error: "Invalid role" }
    }
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, role, password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to create user")
      return { success: true }
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to create user" }
    }
  }

  if (isLocked && user) {
    return <LockScreen onUnlock={unlock} user={user} />
  }

  if (!user) {
    return <LoginPage onLoginAction={async (username, password) => await login(username, password)} />
  }

  return (
    <AuthContext.Provider value={{ user, isLocked, login, logout, lock, unlock, listUsers, createUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
