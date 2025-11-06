"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  if (user && user.role !== "kitchen") {
    redirect("/")
  }

  return children
}
