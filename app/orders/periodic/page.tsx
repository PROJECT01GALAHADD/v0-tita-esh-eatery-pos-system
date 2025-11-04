"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Calendar, BarChart3, TrendingUp, DollarSign } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

const periodicOrders = [
  {
    id: "PER-001",
    period: "Weekly",
    startDate: "2024-01-01",
    endDate: "2024-01-07",
    totalOrders: 156,
    totalRevenue: 4680.0,
    averageOrderValue: 30.0,
    status: "Completed",
    topDish: "Plov",
  },
  {
    id: "PER-002",
    period: "Weekly",
    startDate: "2024-01-08",
    endDate: "2024-01-14",
    totalOrders: 189,
    totalRevenue: 5670.0,
    averageOrderValue: 30.0,
    status: "Completed",
    topDish: "Lagman",
  },
  {
    id: "PER-003",
    period: "Weekly",
    startDate: "2024-01-15",
    endDate: "2024-01-21",
    totalOrders: 67,
    totalRevenue: 2010.0,
    averageOrderValue: 30.0,
    status: "In Progress",
    topDish: "Plov",
  },
  {
    id: "PER-004",
    period: "Monthly",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    totalOrders: 412,
    totalRevenue: 12360.0,
    averageOrderValue: 30.0,
    status: "In Progress",
    topDish: "Plov",
  },
]

export default function PeriodicOrdersPage() {
  const { user } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  if (!user) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalRevenue = periodicOrders.reduce((sum, order) => sum + order.totalRevenue, 0)
  const totalOrders = periodicOrders.reduce((sum, order) => sum + order.totalOrders, 0)
  const completedPeriods = periodicOrders.filter((order) => order.status === "Completed").length
  const averageRevenue = totalRevenue / periodicOrders.length

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Periodic Orders</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Periodic Orders</h2>
                <p className="text-muted-foreground">Analyze order patterns and trends over time periods</p>
              </div>
              {(user.role === "administrator" || user.role === "manager") && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Period Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Periodic Report</DialogTitle>
                      <DialogDescription>Generate a new periodic order analysis</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="period" className="text-right">
                          Period Type
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startDate" className="text-right">
                          Start Date
                        </Label>
                        <Input id="startDate" type="date" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="endDate" className="text-right">
                          End Date
                        </Label>
                        <Input id="endDate" type="date" className="col-span-3" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddDialogOpen(false)}>Generate Report</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Periods</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{periodicOrders.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Across all periods</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">All periods combined</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${averageRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Per period</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Periodic Order Analysis</CardTitle>
                <CardDescription>Order statistics and trends for different time periods</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period ID</TableHead>
                      <TableHead>Period Type</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Total Orders</TableHead>
                      <TableHead>Total Revenue</TableHead>
                      <TableHead>Avg Order Value</TableHead>
                      <TableHead>Top Dish</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periodicOrders.map((period) => (
                      <TableRow key={period.id}>
                        <TableCell className="font-medium">{period.id}</TableCell>
                        <TableCell>{period.period}</TableCell>
                        <TableCell>
                          {new Date(period.startDate).toLocaleDateString()} -{" "}
                          {new Date(period.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{period.totalOrders}</TableCell>
                        <TableCell className="font-semibold">${period.totalRevenue.toFixed(2)}</TableCell>
                        <TableCell>${period.averageOrderValue.toFixed(2)}</TableCell>
                        <TableCell>{period.topDish}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(period.status)}>{period.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Period Performance</CardTitle>
                  <CardDescription>Revenue comparison across periods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {periodicOrders.map((period) => {
                      const percentage = totalRevenue > 0 ? (period.totalRevenue / totalRevenue) * 100 : 0
                      return (
                        <div key={period.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>
                              {period.id} ({period.period})
                            </span>
                            <span className="font-medium">${period.totalRevenue.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total revenue</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Period Summary</CardTitle>
                  <CardDescription>Key insights from periodic analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">Best Performing Period</h4>
                      <p className="text-sm text-muted-foreground">
                        {
                          periodicOrders.reduce((best, current) =>
                            current.totalRevenue > best.totalRevenue ? current : best,
                          ).id
                        }{" "}
                        with $
                        {periodicOrders
                          .reduce((best, current) => (current.totalRevenue > best.totalRevenue ? current : best))
                          .totalRevenue.toFixed(2)}{" "}
                        revenue
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">Most Popular Dish</h4>
                      <p className="text-sm text-muted-foreground">
                        Plov appears as top dish in {periodicOrders.filter((p) => p.topDish === "Plov").length} periods
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">Completed Periods</h4>
                      <p className="text-sm text-muted-foreground">
                        {completedPeriods} out of {periodicOrders.length} periods completed
                      </p>
                    </div>
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
