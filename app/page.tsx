"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const revenueData = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 35000 },
  { month: "Mar", revenue: 48000, expenses: 33000 },
  { month: "Apr", revenue: 61000, expenses: 38000 },
  { month: "May", revenue: 55000, expenses: 36000 },
  { month: "Jun", revenue: 67000, expenses: 42000 },
]

const topDishes = [
  { name: "Plov (Osh)", sales: 245, revenue: 1225000 },
  { name: "Lagman", sales: 189, revenue: 945000 },
  { name: "Mastava", sales: 156, revenue: 780000 },
  { name: "Beshbarmak", sales: 134, revenue: 670000 },
  { name: "Manti", sales: 98, revenue: 490000 },
]

const dishSalesData = [
  { name: "Plov", value: 245, color: "#8884d8" },
  { name: "Lagman", value: 189, color: "#82ca9d" },
  { name: "Mastava", value: 156, color: "#ffc658" },
  { name: "Beshbarmak", value: 134, color: "#ff7300" },
  { name: "Others", value: 276, color: "#00ff00" },
]

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<{ totalOrders: number; totalRevenue: number; activeWaiters: number }>({ totalOrders: 0, totalRevenue: 0, activeWaiters: 0 })
  const [mName, setMName] = useState("")
  const [mPrice, setMPrice] = useState("")
  const [mCategory, setMCategory] = useState("")
  const [mAvailable, setMAvailable] = useState(true)
  const [mSubmitting, setMSubmitting] = useState(false)
  const [mError, setMError] = useState<string | null>(null)

  const submitMenuItem = async () => {
    if (mSubmitting) return
    setMSubmitting(true)
    setMError(null)
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: mName, price: Number(mPrice), category: mCategory, is_available: mAvailable }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to create item")
      setMName("")
      setMPrice("")
      setMCategory("")
      setMAvailable(true)
    } catch (e: any) {
      setMError(e?.message || "Failed to create item")
    } finally {
      setMSubmitting(false)
    }
  }

  // Realtime: load stats and subscribe to orders changes
  useEffect(() => {
    let channel: ReturnType<ReturnType<typeof getSupabaseClient>["channel"]> | null = null
    async function loadStats() {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load stats")
        setStats(json)
      } catch (e) {
        // ignore
      }
    }
    loadStats()
    try {
      const supa = getSupabaseClient()
      channel = supa.channel("orders-realtime").on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          loadStats()
        }
      )
      channel.subscribe()
    } catch (e) {}
    return () => {
      channel?.unsubscribe()
    }
  }, [])

  // Redirect kitchen users to Kitchen Screen by default
  useEffect(() => {
    if (user?.role === "kitchen") {
      router.replace("/kitchen")
    }
  }, [user, router])

  if (!user) return null

  // Role-based dashboard content
  const getDashboardContent = () => {
    switch (user.role) {
      case "cashier_waiter":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>My Orders Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-sm text-muted-foreground">Orders served</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Tips Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$145.50</div>
                  <p className="text-sm text-muted-foreground">Today's tips</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case "kitchen":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">8</div>
                  <p className="text-sm text-muted-foreground">Orders to prepare</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Completed Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">45</div>
                  <p className="text-sm text-muted-foreground">Orders completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Average Prep Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12m</div>
                  <p className="text-sm text-muted-foreground">Per order</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case "cashier_waiter":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$2,450</div>
                  <p className="text-sm text-muted-foreground">Total sales</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">67</div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Cash in Register</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$850</div>
                  <p className="text-sm text-muted-foreground">Current balance</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      default:
        // Full dashboard for administrators and managers
        return (
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cash Register Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 text-green-500" /> +12.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Warehouse Revenue</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$23,400</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 text-green-500" /> +8.2% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 text-green-500" /> +15.3% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Waiters</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeWaiters}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingDown className="inline h-3 w-3 text-red-500" /> -2 from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue vs Expenses (Monthly)</CardTitle>
                  <CardDescription>Comparison of revenue and expenses over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                      <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Dish Sales Distribution</CardTitle>
                  <CardDescription>Most popular dishes by sales volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={dishSalesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dishSalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Admin: Quick Menu Creator */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create Menu Item</CardTitle>
                  <CardDescription>Add a new item to the menu</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mError && <p className="text-sm text-red-600">{mError}</p>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="menu-name">Name</Label>
                      <Input id="menu-name" value={mName} onChange={(e) => setMName(e.target.value)} placeholder="e.g. Plov" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="menu-price">Price</Label>
                      <Input id="menu-price" value={mPrice} onChange={(e) => setMPrice(e.target.value)} placeholder="e.g. 9.99" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="menu-category">Category</Label>
                      <Input id="menu-category" value={mCategory} onChange={(e) => setMCategory(e.target.value)} placeholder="e.g. Main Dishes" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="menu-available" checked={mAvailable} onCheckedChange={(c) => setMAvailable(c)} />
                      <Label htmlFor="menu-available">Available</Label>
                    </div>
                  </div>
                  <Button onClick={submitMenuItem} disabled={mSubmitting || !mName || !mCategory || !mPrice}>
                    {mSubmitting ? "Saving..." : "Add Item"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">
              Dashboard - {user.role.charAt(0).toUpperCase() + user.role.slice(1)} View
            </h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">{getDashboardContent()}</div>
        </div>
      </main>
    </SidebarProvider>
  )
}
