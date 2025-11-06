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
import { Textarea } from "@/components/ui/textarea"
import { Plus, TrendingDown, Package, DollarSign, Calendar } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

const outgoingStock = [
  {
    id: 1,
    productName: "Premium Rice",
    department: "Kitchen",
    quantity: 50,
    unit: "kg",
    unitPrice: 2.5,
    totalAmount: 125.0,
    issuedDate: "2024-01-15",
    issuedBy: "David Wilson",
    requestedBy: "Chef Mike",
    purpose: "Daily cooking requirements",
    status: "Issued",
  },
  {
    id: 2,
    productName: "Black Pepper",
    department: "Kitchen",
    quantity: 5,
    unit: "kg",
    unitPrice: 8.0,
    totalAmount: 40.0,
    issuedDate: "2024-01-15",
    issuedBy: "David Wilson",
    requestedBy: "Chef Mike",
    purpose: "Spice preparation",
    status: "Issued",
  },
  {
    id: 3,
    productName: "Fresh Potatoes",
    department: "Kitchen",
    quantity: 30,
    unit: "kg",
    unitPrice: 1.2,
    totalAmount: 36.0,
    issuedDate: "2024-01-14",
    issuedBy: "Alice Johnson",
    requestedBy: "Chef Sarah",
    purpose: "Vegetable dishes",
    status: "Issued",
  },
  {
    id: 4,
    productName: "Mineral Water",
    department: "Bar",
    quantity: 100,
    unit: "bottles",
    unitPrice: 0.5,
    totalAmount: 50.0,
    issuedDate: "2024-01-14",
    issuedBy: "Alice Johnson",
    requestedBy: "Bar Manager",
    purpose: "Customer service",
    status: "Pending",
  },
  {
    id: 5,
    productName: "Green Tea Leaves",
    department: "Bar",
    quantity: 2,
    unit: "kg",
    unitPrice: 12.0,
    totalAmount: 24.0,
    issuedDate: "2024-01-13",
    issuedBy: "David Wilson",
    requestedBy: "Tea Specialist",
    purpose: "Tea preparation",
    status: "Issued",
  },
]

const departments = ["Kitchen", "Bar", "Dining Hall", "VIP Section"]
const products = [
  "Premium Rice",
  "Black Pepper",
  "Fresh Potatoes",
  "Mineral Water",
  "Green Tea Leaves",
  "Onions",
  "Carrots",
]

export default function OutgoingStockPage() {
  const { user } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unitPrice, setUnitPrice] = useState("")

  // Restrict Warehouse Outgoing to administrator, manager, and kitchen roles
  if (!user || !["administrator", "manager", "kitchen"].includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const calculateTotal = () => {
    const qty = Number.parseFloat(quantity) || 0
    const price = Number.parseFloat(unitPrice) || 0
    return (qty * price).toFixed(2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Issued":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalValue = outgoingStock.reduce((sum, item) => sum + item.totalAmount, 0)
  const issuedItems = outgoingStock.filter((item) => item.status === "Issued").length
  const pendingItems = outgoingStock.filter((item) => item.status === "Pending").length
  const totalQuantity = outgoingStock.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Outgoing Stock</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Outgoing Stock</h2>
                <p className="text-muted-foreground">Track and manage stock issued to departments</p>
              </div>
              {["administrator", "manager", "kitchen"].includes(user.role) && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Issue Stock
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Issue Stock</DialogTitle>
                      <DialogDescription>Record stock issued to a department</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="product">Product</Label>
                          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product} value={product}>
                                  {product}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="unit">Unit</Label>
                          <Input id="unit" placeholder="kg, bottles, etc." />
                        </div>
                        <div>
                          <Label htmlFor="unitPrice">Unit Price</Label>
                          <Input
                            id="unitPrice"
                            type="number"
                            step="0.01"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="requestedBy">Requested By</Label>
                          <Input id="requestedBy" placeholder="Person requesting" />
                        </div>
                        <div>
                          <Label>Total Amount</Label>
                          <div className="text-lg font-semibold p-2 bg-muted rounded">${calculateTotal()}</div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="purpose">Purpose</Label>
                        <Textarea id="purpose" placeholder="Purpose of stock issue..." />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddDialogOpen(false)}>Issue Stock</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Issued Items</CardTitle>
                  <Package className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{issuedItems}</div>
                  <p className="text-xs text-muted-foreground">Successfully issued</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingItems}</div>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalQuantity}</div>
                  <p className="text-xs text-muted-foreground">Units issued</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Outgoing Stock Records</CardTitle>
                <CardDescription>All stock issued to departments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Issued Date</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Purpose</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outgoingStock.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell>
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="font-semibold">${item.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>{new Date(item.issuedDate).toLocaleDateString()}</TableCell>
                        <TableCell>{item.requestedBy}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{item.purpose}</TableCell>
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
