"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { LockScreen } from "./lock-screen"
import { LoginPage } from "./login-page"

type UserRole = "administrator" | "cashier" | "waiter" | "chef" | "manager"

interface User {
  id: string
  username: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: User | null
  isLocked: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  lock: () => void
  unlock: (pin: string) => boolean
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for different roles
const demoUsers: Record<string, { password: string; user: User }> = {
  admin: {
    password: "admin123",
    user: { id: "1", username: "admin", role: "administrator", name: "Admin User" },
  },
  cashier: {
    password: "cash123",
    user: { id: "2", username: "cashier", role: "cashier", name: "John Cashier" },
  },
  waiter: {
    password: "wait123",
    user: { id: "3", username: "waiter", role: "waiter", name: "Jane Waiter" },
  },
  chef: {
    password: "chef123",
    user: { id: "4", username: "chef", role: "chef", name: "Mike Chef" },
  },
  manager: {
    password: "mgr123",
    user: { id: "5", username: "manager", role: "manager", name: "Sarah Manager" },
  },
}

const LOCK_PIN = "1234"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLocked, setIsLocked] = useState(false)

  const login = (username: string, password: string): boolean => {
    const userData = demoUsers[username.toLowerCase()]
    if (userData && userData.password === password) {
      setUser(userData.user)
      setIsLocked(false)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsLocked(false)
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

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role })
    }
  }

  // Show lock screen if locked
  if (isLocked && user) {
    return <LockScreen onUnlock={unlock} user={user} />
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={login} />
  }

  return (
    <AuthContext.Provider value={{ user, isLocked, login, logout, lock, unlock, switchRole }}>
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
