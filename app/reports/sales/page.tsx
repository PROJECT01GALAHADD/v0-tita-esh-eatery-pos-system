"use client"

import { useEffect, useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { hasAccess } from "@/lib/acl"
import { AccessDenied } from "@/components/access-denied"
import { AlertCircle, RefreshCcw, BarChart2 } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts"

type SalesReport = {
  totalOrders: number
  totalRevenue: number
  avgOrderValue: number
  revenueByDay: { date: string; revenue: number }[]
  topItems: { id: string; name: string; quantity: number }[]
}

export default function SalesReportsPage() {
  const { user } = useAuth()
  const [data, setData] = useState<SalesReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/reports/sales")
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`)
        const json = await res.json()
        setData(json)
      } catch (e: any) {
        setError(e?.message || "Failed to load sales report")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (!user) return null
  if (!hasAccess(user, "dashboard")) {
    return <AccessDenied />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Sales Reports</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Sales Overview</h2>
                <p className="text-muted-foreground">Aggregated metrics from Supabase order data</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => location.reload()} disabled={loading}>
                  <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
                </Button>
              </div>
            </div>

            {error && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2"><AlertCircle className="h-4 w-4 text-red-600" /> Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600">{error}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(data?.totalRevenue ?? 0).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Paid orders only</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(data?.avgOrderValue ?? 0).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Across paid orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.totalOrders ?? 0}</div>
                  <p className="text-xs text-muted-foreground">All statuses</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue (Last 30 days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data?.revenueByDay || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Items by Quantity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={(data?.topItems || []).map(it => ({ name: it.name, quantity: it.quantity }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="quantity" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
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

