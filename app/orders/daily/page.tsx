"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Eye, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { hasAccess, isCashierWaiter, canEditOrder, isAdmin, isManager } from "@/lib/acl"

const orders = [
  {
    id: "ORD-001",
    table: "Table 5",
    waiter: "John Doe",
    items: ["Plov", "Lagman", "Tea"],
    total: 32.0,
    status: "Completed",
    time: "12:30 PM",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    table: "Table 2",
    waiter: "Jane Smith",
    items: ["Mastava", "Water"],
    total: 8.5,
    status: "In Progress",
    time: "1:15 PM",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    table: "Table 8",
    waiter: "Mike Johnson",
    items: ["Beshbarmak", "Tea", "Salad"],
    total: 25.0,
    status: "Pending",
    time: "1:45 PM",
    date: "2024-01-15",
  },
  {
    id: "ORD-004",
    table: "Table 1",
    waiter: "Sarah Wilson",
    items: ["Plov", "Water"],
    total: 12.5,
    status: "Completed",
    time: "2:00 PM",
    date: "2024-01-15",
  },
]

const menuItems = [
  { name: "Plov", price: 12.0 },
  { name: "Lagman", price: 10.0 },
  { name: "Mastava", price: 8.0 },
  { name: "Beshbarmak", price: 15.0 },
  { name: "Tea", price: 2.0 },
  { name: "Water", price: 0.5 },
  { name: "Salad", price: 5.0 },
]

const tables = ["Table 1", "Table 2", "Table 3", "Table 4", "Table 5", "Table 6", "Table 7", "Table 8"]
const waiters = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"]

export default function DailyOrdersPage() {
  const { user } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Check permissions using centralized ACL helper
  if (!hasAccess(user, "orders")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Pending":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateTotal = () => {
    return selectedItems.reduce((total, itemName) => {
      const item = menuItems.find((m) => m.name === itemName)
      return total + (item?.price || 0)
    }, 0)
  }

  // Filter orders for cashier_waiter to show only their orders
  const filteredOrders = isCashierWaiter(user?.role)
    ? orders.filter((order) => order.waiter === user?.name)
    : orders

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Daily Orders {isCashierWaiter(user?.role) ? "- My Orders" : ""}</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Daily Orders</h2>
                <p className="text-muted-foreground">
                  {isCashierWaiter(user?.role) ? "Manage your assigned orders" : "Manage today's customer orders"}
              </p>
            </div>
              {canEditOrder(user?.role) && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Order</DialogTitle>
                      <DialogDescription>Add a new order for today</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="table">Table</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select table" />
                            </SelectTrigger>
                            <SelectContent>
                              {tables.map((table) => (
                                <SelectItem key={table} value={table}>
                                  {table}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="waiter">Waiter</Label>
                          <Select defaultValue={isCashierWaiter(user?.role) ? user?.name : undefined}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select waiter" />
                            </SelectTrigger>
                            <SelectContent>
                              {waiters.map((waiter) => (
                                <SelectItem key={waiter} value={waiter}>
                                  {waiter}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Menu Items</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {menuItems.map((item) => (
                            <div key={item.name} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={item.name}
                                checked={selectedItems.includes(item.name)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedItems([...selectedItems, item.name])
                                  } else {
                                    setSelectedItems(selectedItems.filter((i) => i !== item.name))
                                  }
                                }}
                              />
                              <label htmlFor={item.name} className="text-sm">
                                {item.name} - ${item.price.toFixed(2)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold">Total: ${calculateTotal().toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddDialogOpen(false)}>Create Order</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredOrders.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {filteredOrders.filter((o) => o.status === "Completed").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {filteredOrders.filter((o) => o.status === "In Progress").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${filteredOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{isCashierWaiter(user?.role) ? "My Orders" : "Today's Orders"}</CardTitle>
                <CardDescription>
                  {isCashierWaiter(user?.role)
                    ? `Orders assigned to ${user?.name ?? "you"}`
                    : `All orders for ${new Date().toLocaleDateString()}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Table</TableHead>
                      {!isCashierWaiter(user?.role) && <TableHead>Waiter</TableHead>}
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.table}</TableCell>
                        {!isCashierWaiter(user?.role) && <TableCell>{order.waiter}</TableCell>}
                        <TableCell>{order.items.join(", ")}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{order.time}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canEditOrder(user?.role) && (
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {(isAdmin(user?.role) || isManager(user?.role)) && (
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
