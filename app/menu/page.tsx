"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"
import { hasAccess } from "@/lib/acl"
import { AccessDenied } from "@/components/access-denied"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Star, Clock, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"

type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: string
  preparationTime: number
  rating: number
  isAvailable: boolean
  isPopular: boolean
  image?: string
}

export default function MenuPage() {
  const { user } = useAuth()

  // Centralized ACL check
  if (!hasAccess(user, "menu")) {
    return <AccessDenied />
  }

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true)
        const res = await fetch("/api/menu")
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load menu")
        setMenuItems(json.items || [])
      } catch (e: any) {
        setError(e?.message || "Error loading menu")
      } finally {
        setLoading(false)
      }
    }
    fetchMenu()
  }, [])

  async function handleToggleAvailability(id: string, isAvailable: boolean) {
    try {
      // Optimistic update
      setMenuItems(prev => prev.map(mi => mi.id === id ? { ...mi, isAvailable } : mi))
      const res = await fetch(`/api/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: isAvailable }),
      })
      if (!res.ok) {
        throw new Error((await res.json())?.error || "Failed to update availability")
      }
    } catch (e: any) {
      setError(e?.message || "Failed to update availability")
      // Revert on error
      setMenuItems(prev => prev.map(mi => mi.id === id ? { ...mi, isAvailable: !isAvailable } : mi))
    }
  }

  // Realtime: refresh menu on changes
  useEffect(() => {
    let channel: any = null
    async function refresh() {
      try {
        setLoading(true)
        const res = await fetch("/api/menu", { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load menu")
        setMenuItems(json.items || [])
      } catch (e: any) {
        setError(e?.message || "Failed to refresh menu")
      } finally {
        setLoading(false)
      }
    }
    try {
      const { getSupabaseClient } = require("@/lib/supabase")
      const supa = getSupabaseClient()
      channel = supa
        .channel("menu-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, () => refresh())
        .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, () => refresh())
      channel.subscribe()
    } catch {}
    return () => {
      channel?.unsubscribe?.()
    }
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "All Time Favorite (Short Orders)":
        return "bg-yellow-100 text-yellow-800"
      case "Silog Meals":
        return "bg-green-100 text-green-800"
      case "Busog Meals":
        return "bg-orange-100 text-orange-800"
      case "Rice Meal":
        return "bg-red-100 text-red-800"
      case "Add On":
        return "bg-blue-100 text-blue-800"
      case "Salo-Salo Meals":
        return "bg-purple-100 text-purple-800"
      case "Combo Plates":
        return "bg-pink-100 text-pink-800"
      case "Soup":
        return "bg-teal-100 text-teal-800"
      case "Snacks":
        return "bg-indigo-100 text-indigo-800"
      case "Desserts":
        return "bg-fuchsia-100 text-fuchsia-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const availableItems = menuItems.filter((item) => item.isAvailable).length
  const popularItems = menuItems.filter((item) => item.isPopular).length
  const averagePrice = menuItems.length
    ? menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length
    : 0

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Restaurant Menu</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
              <p className="text-muted-foreground">Menu data now loaded from Supabase via API</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{menuItems.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{availableItems}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Popular Items</CardTitle>
                  <Star className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{popularItems}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>

            {loading && (
              <div className="text-sm text-muted-foreground">Loading menu…</div>
            )}
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <Card key={item.id} className={`relative ${!item.isAvailable ? "opacity-60" : ""}`}>
                  {item.isPopular && (
                    <Badge className="absolute top-2 right-2 bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}

                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-muted rounded-md mb-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge className={getCategoryColor(item.category)} variant="secondary">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${item.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="mb-4">{item.description}</CardDescription>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.preparationTime} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {item.rating}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={item.isAvailable}
                          id={`available-${item.id}`}
                          onCheckedChange={(checked) => handleToggleAvailability(item.id, checked)}
                        />
                        <label htmlFor={`available-${item.id}`} className="text-sm font-medium">
                          Available
                        </label>
                      </div>
                      {["administrator", "manager"].includes(user?.role ?? "") && (
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
