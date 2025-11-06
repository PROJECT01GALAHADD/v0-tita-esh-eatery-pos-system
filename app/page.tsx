"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Data for admin/manager dashboard
const revenueData = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 35000 },
  { month: "Mar", revenue: 48000, expenses: 33000 },
  { month: "Apr", revenue: 61000, expenses: 38000 },
  { month: "May", revenue: 55000, expenses: 36000 },
  { month: "Jun", revenue: 67000, expenses: 42000 },
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
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, activeWaiters: 0 })

  // Auto-redirect kitchen users to kitchen screen
  useEffect(() => {
    if (user?.role === "kitchen") {
      router.replace("/kitchen")
    }
  }, [user, router])

  // Load stats
  useEffect(() => {
    let channel: any = null
    async function loadStats() {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load stats")
        setStats(json)
      } catch (e) {
        // Use defaults on error
      }
    }
    loadStats()
    // Setup realtime subscription
    try {
      const { getSupabaseClient } = require("@/lib/supabase")
      const supa = getSupabaseClient()
      channel = supa
        .channel("orders-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => loadStats())
      channel.subscribe()
    } catch {}
    return () => {
      channel?.unsubscribe()
    }
  }, [])

  if (!user) return null

  // Administrator Dashboard
  if (user.role === "administrator") {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <div className="flex flex-col">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-xl font-semibold">Administrator Dashboard</h1>
            </header>

            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
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
                      <TrendingDown className="inline h-3 w-3 text-red-500" /> -2 from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Warehouse Stock</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground text-red-600">5 items below min stock</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Revenue vs Expenses (Monthly)</CardTitle>
                    <CardDescription>Last 6 months comparison</CardDescription>
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
                    <CardTitle>Top Dishes by Sales</CardTitle>
                    <CardDescription>Most popular items</CardDescription>
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

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database Connection</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" /> Connected
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Realtime Subscriptions</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" /> Active
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Kitchen Screen</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" /> Online
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarProvider>
    )
  }

  // Manager Dashboard
  if (user.role === "manager") {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <div className="flex flex-col">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-xl font-semibold">Manager Dashboard</h1>
            </header>

            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Current day total</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">In progress</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Staff Online</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeWaiters}</div>
                    <p className="text-xs text-muted-foreground">Waiters & cashiers</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">Items low in stock</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2 flex-wrap">
                  <Button>Create Staff Member</Button>
                  <Button variant="outline">Manage Inventory</Button>
                  <Button variant="outline">View Reports</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarProvider>
    )
  }

  // Cashier/Waiter Dashboard
  if (user.role === "cashier_waiter") {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <div className="flex flex-col">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-xl font-semibold">My Dashboard - {user.name}</h1>
            </header>

            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12</div>
                    <p className="text-sm text-muted-foreground">Orders served</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$245.50</div>
                    <p className="text-sm text-muted-foreground">Your total</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Tips Earned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$45.00</div>
                    <p className="text-sm text-muted-foreground">Today's tips</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Access</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2 flex-wrap">
                  <Button>Start POS Session</Button>
                  <Button variant="outline">View Menu</Button>
                  <Button variant="outline">Active Orders</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarProvider>
    )
  }

  return null
}
