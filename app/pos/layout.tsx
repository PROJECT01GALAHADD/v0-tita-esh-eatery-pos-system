import type React from "react"
import { CartProvider } from "@/components/pos/cart-context"

export default function PosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CartProvider>{children}</CartProvider>
}

