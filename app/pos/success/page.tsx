"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SuccessPage() {
  const { user } = useAuth()
  if (!user) return null

  // Restrict order confirmation to Cashier/Waiter role
  if (user.role !== "cashier_waiter") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Order confirmation is restricted to Cashier/Waiter accounts.</p>
            <Button asChild>
              <Link href="/">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle>Order Confirmed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">The order has been successfully processed.</p>
          <div className="flex justify-center gap-2">
            <Button asChild>
              <Link href="/pos">New Order</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/cash-registers">Register Overview</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
