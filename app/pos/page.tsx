"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CartProvider } from "@/components/pos/cart-context"
import { CategorySidebar } from "@/components/pos/category-sidebar"
import { ProductGrid } from "@/components/pos/product-grid"
import { CartSidebar } from "@/components/pos/cart-sidebar"
import type { Category } from "@/lib/pos/products"

export default function PosPage() {
  const { user } = useAuth()
  if (!user) return null

  // Gate POS: deny only Kitchen; Admin/Manager/Cashier-Waiter can access
  if (user.role === "kitchen") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">The POS interface is not available to Kitchen accounts.</p>
            <div className="flex gap-2">
              <Button asChild variant="secondary">
                <Link href="/">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [menuCategories, setMenuCategories] = useState<string[]>(["All"]) 
  const [menuItems, setMenuItems] = useState<Array<{ id: string; name: string; price: number; image?: string; category: string }>>([])

  useEffect(() => {
    // Show a brief skeleton loader when switching categories
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(t)
  }, [selectedCategory])

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch("/api/menu", { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load menu")
        const cats: string[] = ["All", ...(json.categories?.map((c: any) => c.name) || [])]
        setMenuCategories(cats)
        const items = (json.items || []).map((i: any) => ({ id: i.id, name: i.name, price: i.price, image: i.image, category: i.category }))
        setMenuItems(items)
      } catch (e) {
        // Fallback will be lib data via ProductGrid default
      }
    }
    loadMenu()
  }, [])

  return (
    <CartProvider>
      <div className="min-h-screen p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <CategorySidebar
              categories={menuCategories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
          <div className="md:col-span-6">
            <div className="mb-4 flex items-center gap-2">
              <Input
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline" onClick={() => setSearchQuery("")}>Clear</Button>
            </div>
            <ProductGrid category={selectedCategory} searchQuery={searchQuery} loading={isLoading} items={menuItems} />
          </div>
          <div className="md:col-span-3">
            <CartSidebar />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <Button asChild>
            <Link href="/pos/checkout">Proceed to Checkout</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cash-registers">Register Overview</Link>
          </Button>
        </div>
      </div>
    </CartProvider>
  )
}
