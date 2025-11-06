"use client"

import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react"

export type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export type CartItem = Product & { qty: number }

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  clearCart: () => void
  increment: (id: string) => void
  decrement: (id: string) => void
  totalQty: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // basic persistence
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pos_cart")
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem("pos_cart", JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))
  const clearCart = () => setItems([])
  const increment = (id: string) => setItems(prev => prev.map(i => (i.id === id ? { ...i, qty: i.qty + 1 } : i)))
  const decrement = (id: string) =>
    setItems(prev =>
      prev
        .map(i => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter(i => i.qty > 0)
    )

  const { totalQty, totalPrice } = useMemo(() => {
    const totalQty = items.reduce((sum, i) => sum + i.qty, 0)
    const totalPrice = items.reduce((sum, i) => sum + i.qty * i.price, 0)
    return { totalQty, totalPrice }
  }, [items])

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    clearCart,
    increment,
    decrement,
    totalQty,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
