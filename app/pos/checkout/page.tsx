"use client"

import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/pos/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Wallet, QrCode, Printer, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CheckoutPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  if (!user) return null

  if (user.role !== "cashier_waiter") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Checkout is restricted to Cashier accounts.</p>
            <Button asChild>
              <Link href="/">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [isProcessing, setIsProcessing] = useState(false)

  const confirmOrder = async (method: "cash" | "card" | "mobile") => {
    if (isProcessing) return
    setIsProcessing(true)
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total_amount: Number(totalPrice.toFixed(2)) }),
      })
    } catch (e) {
      // swallow for demo; could show a toast
    } finally {
      clearCart()
      router.push("/pos/success")
    }
  }

  return (
    <div className="min-h-screen p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              <Button asChild>
                <Link href="/pos">Back to POS</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                {items.map((i) => (
                  <div key={i.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{i.qty}×</Badge>
                      <span className="font-medium">{i.name}</span>
                    </div>
                    <span className="text-sm">${(i.qty * i.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Choose payment method</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button onClick={() => confirmOrder("cash")} className="justify-start" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wallet className="mr-2 h-4 w-4" />}
                    {isProcessing ? "Processing" : "Cash"}
                  </Button>
                  <Button onClick={() => confirmOrder("card")} className="justify-start" variant="secondary" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                    {isProcessing ? "Processing" : "Card"}
                  </Button>
                  <Button onClick={() => confirmOrder("mobile")} className="justify-start" variant="outline" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <QrCode className="mr-2 h-4 w-4" />}
                    {isProcessing ? "Processing" : "Mobile QR"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/pos">Modify Cart</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Printer className="mr-2 h-4 w-4" /> Print Receipt
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
