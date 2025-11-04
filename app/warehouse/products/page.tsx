"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Package, TrendingUp, TrendingDown } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"
import { SidebarTrigger } from "@/components/ui/sidebar"

const warehouseProducts = [
  {
    id: 1,
    name: "Rice",
    unit: "kg",
    incoming: { quantity: 200, amount: 500 },
    outgoing: { quantity: 50, amount: 125 },
    stock: 150,
    minStock: 100,
    maxStock: 300,
  },
  {
    id: 2,
    name: "Pepper",
    unit: "kg",
    incoming: { quantity: 30, amount: 240 },
    outgoing: { quantity: 5, amount: 40 },
    stock: 25,
    minStock: 20,
    maxStock: 50,
  },
  {
    id: 3,
    name: "Potatoes",
    unit: "kg",
    incoming: { quantity: 250, amount: 300 },
    outgoing: { quantity: 50, amount: 60 },
    stock: 200,
    minStock: 150,
    maxStock: 400,
  },
  {
    id: 4,
    name: "Onions",
    unit: "kg",
    incoming: { quantity: 100, amount: 80 },
    outgoing: { quantity: 85, amount: 68 },
    stock: 15,
    minStock: 50,
    maxStock: 150,
  },
  {
    id: 5,
    name: "Carrots",
    unit: "kg",
    incoming: { quantity: 80, amount: 96 },
    outgoing: { quantity: 60, amount: 72 },
    stock: 20,
    minStock: 30,
    maxStock: 100,
  },
]

export default function WarehouseProductsPage() {
  const { user } = useAuth()

  // Check permissions - warehouse accessible by administrator, manager, chef
  if (!user || !["administrator", "manager", "chef"].includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const getStockStatus = (stock: number, minStock: number, maxStock: number) => {
    const percentage = (stock / maxStock) * 100
    if (stock <= minStock) return { status: "Low", color: "bg-red-100 text-red-800", percentage }
    if (percentage > 80) return { status: "High", color: "bg-green-100 text-green-800", percentage }
    return { status: "Normal", color: "bg-blue-100 text-blue-800", percentage }
  }

  const totalIncoming = warehouseProducts.reduce((sum, product) => sum + product.incoming.amount, 0)
  const totalOutgoing = warehouseProducts.reduce((sum, product) => sum + product.outgoing.amount, 0)
  const lowStockItems = warehouseProducts.filter((product) => product.stock <= product.minStock)

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Warehouse Products</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Warehouse Inventory</h2>
              <p className="text-muted-foreground">Monitor your warehouse stock levels and movements</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{warehouseProducts.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Incoming</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${totalIncoming}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Outgoing</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">${totalOutgoing}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
                </CardContent>
              </Card>
            </div>

            {lowStockItems.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Low Stock Alert
                  </CardTitle>
                  <CardDescription className="text-yellow-700">
                    The following items are running low and need restocking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lowStockItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-yellow-700">
                          {item.stock} {item.unit} remaining (Min: {item.minStock})
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
                <CardDescription>Current stock levels with incoming and outgoing movements</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Incoming</TableHead>
                      <TableHead>Outgoing</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {warehouseProducts.map((product) => {
                      const stockInfo = getStockStatus(product.stock, product.minStock, product.maxStock)
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.unit}</TableCell>
                          <TableCell>
                            <div className="text-green-600">
                              <div>
                                {product.incoming.quantity} {product.unit}
                              </div>
                              <div className="text-xs">${product.incoming.amount}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-red-600">
                              <div>
                                {product.outgoing.quantity} {product.unit}
                              </div>
                              <div className="text-xs">${product.outgoing.amount}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {product.stock} {product.unit}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="w-full">
                              <Progress value={stockInfo.percentage} className="w-full" />
                              <div className="text-xs text-muted-foreground mt-1">
                                {stockInfo.percentage.toFixed(0)}% of capacity
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={stockInfo.color}>{stockInfo.status}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
