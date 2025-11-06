"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useEffect, useMemo, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"

type KitchenMenuItem = {
  id: string
  name: string
  category: string
  is_available: boolean
}

export default function KitchenScreen() {
  const { user } = useAuth()
  const [items, setItems] = useState<KitchenMenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/menu", { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load menu")
        const items: KitchenMenuItem[] = (json.items || []).map((i: any) => ({
          id: i.id,
          name: i.name,
          category: i.category,
          is_available: !!i.is_available,
        }))
        if (isMounted) setItems(items)
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Failed to load menu")
      } finally {
        if (isMounted) setLoading(false)
      }
    })()

    let channel: ReturnType<ReturnType<typeof getSupabaseClient>["channel"]> | null = null
    try {
      const supa = getSupabaseClient()
      channel = supa
        .channel("kitchen-menu-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, () => {
          ;(async () => {
            setLoading(true)
            setError(null)
            try {
              const res = await fetch("/api/menu", { cache: "no-store" })
              const json = await res.json()
              if (!res.ok) throw new Error(json?.error || "Failed to load menu")
              const items: KitchenMenuItem[] = (json.items || []).map((i: any) => ({
                id: i.id,
                name: i.name,
                category: i.category,
                is_available: !!i.is_available,
              }))
              if (isMounted) setItems(items)
            } catch (e: any) {
              if (isMounted) setError(e?.message || "Failed to load menu")
            } finally {
              if (isMounted) setLoading(false)
            }
          })()
        })
      channel.subscribe()
    } catch {}

    // Cleanup: set flag and unsubscribe from channel
    return () => {
      isMounted = false
      void channel?.unsubscribe()
    }
  }, [])

  const byCategory = useMemo(() => {
    const map = new Map<string, KitchenMenuItem[]>()
    items.forEach((i) => {
      const arr = map.get(i.category) || []
      arr.push(i)
      map.set(i.category, arr)
    })
    return Array.from(map.entries())
  }, [items])

  const toggleAvailability = async (itemId: string, next: boolean) => {
    try {
      const res = await fetch(`/api/menu/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: next }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json?.error || "Failed to update availability")
      }
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, is_available: next } : i)))
    } catch (e: any) {
      setError(e?.message || "Failed to update availability")
    }
  }

  if (!user) return null

  // Restrict access: only Kitchen role should see this page
  if (user.role !== "kitchen") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Kitchen Screen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">This page is available to Kitchen accounts only.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl md:text-2xl font-bold">Kitchen Screen</h1>
            </div>
          </div>
          <Separator className="my-4" />

          <div className="grid gap-4 md:grid-cols-12">
            {/* Orders Queue (placeholder until order line items exist) */}
            <div className="md:col-span-5">
              <Card>
                <CardHeader>
                  <CardTitle>Orders Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    No itemized order queue yet. This will show incoming dishes once order line items are implemented.
                  </p>
                  <div className="mt-3">
                    <Button variant="outline" disabled>
                      Refresh Queue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inventory / Availability */}
            <div className="md:col-span-7">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory & Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading && <p className="text-sm">Loading menu…</p>}
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  {!loading && byCategory.length === 0 && (
                    <p className="text-sm text-muted-foreground">No menu items found.</p>
                  )}
                  <div className="space-y-4">
                    {byCategory.map(([cat, list]) => (
                      <div key={cat}>
                        <h3 className="font-semibold mb-2">{cat}</h3>
                        <div className="space-y-2">
                          {list.map((i) => (
                            <div key={i.id} className="flex items-center justify-between rounded border p-2">
                              <div>
                                <div className="font-medium">{i.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {i.is_available ? "Available" : "Unavailable"}
                                </div>
                              </div>
                              <Switch checked={i.is_available} onCheckedChange={(v) => toggleAvailability(i.id, v)} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
