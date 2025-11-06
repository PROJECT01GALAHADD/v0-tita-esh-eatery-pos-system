"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Coffee, Utensils, ShoppingBasket, Cookie } from "lucide-react"

export function CategorySidebar({
  categories,
  selected,
  onSelect,
}: {
  categories: string[]
  selected: string
  onSelect: (c: string) => void
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {categories.map((c) => {
            const Icon = iconForCategory(c)
            const isSelected = selected === c
            return (
              <Button
                key={c}
                variant="ghost"
                className={cn(
                  "flex h-auto flex-col items-center justify-center py-4 border bg-transparent",
                  isSelected
                    ? "border-2 border-primary text-foreground font-medium"
                    : "border-muted text-muted-foreground hover:border-muted-foreground hover:text-foreground",
                  "hover:bg-transparent",
                )}
                onClick={() => onSelect(c)}
              >
                <Icon className="mb-2 h-6 w-6" />
                <span className="text-sm">{c}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function iconForCategory(name: string) {
  const map: Record<string, any> = {
    "All": ShoppingBasket,
    "All Time Favorite (Short Orders)": Utensils,
    "Silog Meals": Utensils,
    "Busog Meals (with Glass of Iced Tea)": ShoppingBasket,
    "Rice Meal": Utensils,
    "Add On": ShoppingBasket,
    "Salo-Salo Meals (with 1.5L Softdrinks)": ShoppingBasket,
    "Combo Plates": ShoppingBasket,
    "Soup": Utensils,
    "Snacks": Cookie,
    "Desserts": Cookie,
  }
  return map[name] ?? ShoppingBasket
}
