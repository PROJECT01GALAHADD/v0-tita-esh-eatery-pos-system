"use client"

import { KitchenDisplaySystem } from "@/components/kitchen-display-system"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function KitchenScreen() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== "kitchen") {
      router.replace("/")
    }
  }, [user, router])

  if (!user || user.role !== "kitchen") {
    return null
  }

  return <KitchenDisplaySystem />
}
