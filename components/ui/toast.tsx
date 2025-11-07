"use client"

import type { ReactNode } from "react"

export type ToastActionElement = ReactNode
export type ToastProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
} & Record<string, any>

export function ToastProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function ToastViewport() {
  return <div aria-live="polite" aria-atomic="true" />
}

export function Toast({ children, ...props }: { children: ReactNode } & ToastProps) {
  return (
    <div role="status" {...props}>
      {children}
    </div>
  )
}

export function ToastTitle({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

export function ToastDescription({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

export function ToastClose() {
  return <button aria-label="Close">×</button>
}
