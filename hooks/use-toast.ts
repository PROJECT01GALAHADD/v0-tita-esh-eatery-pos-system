"use client"

export type ToastItem = {
  id: string | number
  title?: string
  description?: string
  action?: React.ReactNode
}

export function useToast() {
  return {
    toasts: [] as ToastItem[],
  }
}

