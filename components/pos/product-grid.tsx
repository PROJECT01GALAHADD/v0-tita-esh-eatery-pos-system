"use client"

import Image from "next/image"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/pos/products"
import { useCart } from "./cart-context"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { createHolographicStyle, createPrismaticEffect, DEFAULT_HOLOGRAPHIC_CONFIG } from "@/lib/ui/holographic"

type ProductLike = { id: string; name: string; price: number; image?: string; category: string }

export function ProductGrid({ category, searchQuery = "", loading = false, items }: { category: string; searchQuery?: string; loading?: boolean; items?: ProductLike[] }) {
  const { addItem, decrement } = useCart()
  const productList: ProductLike[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
  }))
  const source: ProductLike[] = items && items.length ? items : productList
  const filtered = source.filter((p) => {
    const matchesCategory = category === "All" ? true : p.category === category
    const matchesSearch = searchQuery.trim()
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesCategory && matchesSearch
  })

  // Static holographic styles (no tilt/shift interactions)
  const holographicStyle = createHolographicStyle(DEFAULT_HOLOGRAPHIC_CONFIG)
  const prismaticStyle = createPrismaticEffect()

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">{category}</h2>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <Card key={`skeleton-${i}`} className="overflow-hidden relative">
              <div className="absolute inset-0 rounded-xl blur-[0.5px]" style={holographicStyle} />
              <div className="relative aspect-square">
                <Skeleton className="w-full h-full" />
              </div>
              <CardContent className="p-4 space-y-2 bg-black/20 backdrop-blur-sm">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : (
          filtered.map((p) => (
          <Card
            key={p.id}
            className="overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer group relative"
            onClick={() => {
              // Ensure Product satisfies required image property for cart
              addItem({ ...p, image: p.image || "/placeholder.svg" })
              toast.success(`Added ${p.name} to cart`, {
                description: `Qty: 1 • $${p.price.toFixed(2)}`,
                action: {
                  label: "Undo",
                  onClick: () => decrement(p.id),
                },
              })
            }}
          >
            {/* Holographic gradient background and subtle prism lighting */}
            <div className="absolute inset-0 rounded-xl blur-[0.5px]" style={holographicStyle} />
            <div className="absolute inset-0 rounded-xl opacity-30" style={prismaticStyle} />
            <div className="relative aspect-square">
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 z-10">
                <PlusCircle className="h-10 w-10 text-white" />
              </div>
              <Image src={p.image || "/placeholder.svg"} alt={p.name} fill className="object-cover" />
            </div>
            <CardContent className="p-4 bg-black/25 backdrop-blur-[2px]">
              <div>
                <h3 className="font-medium line-clamp-1 text-white drop-shadow">{p.name}</h3>
                <p className="text-sm text-white/80">${p.price.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          ))
        )}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
