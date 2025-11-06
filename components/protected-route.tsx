"use client"

import type { ReactNode } from "react"
import { useAuth } from "./auth-provider"
import { hasAccess, type AppArea } from "@/lib/acl"
import { AccessDenied } from "./access-denied"

interface ProtectedRouteProps {
  area: AppArea
  children: ReactNode
  fallback?: ReactNode
}

/**
 * ProtectedRoute component - wraps pages that require specific roles
 * Automatically redirects based on RBAC rules in lib/acl.ts
 */
export function ProtectedRoute({ area, children, fallback }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) return null

  if (!hasAccess(user, area)) {
    return fallback || <AccessDenied area={area} />
  }

  return <>{children}</>
}
