"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
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
import { Plus, TrendingUp, Package, DollarSign, Calendar } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"

const incomingStock = [
  {
    id: 1,
    productName: "Premium Rice",
    supplier: "Golden Grain Co.",
    quantity: 200,
    unit: "kg",
    unitPrice: 2.5,
    totalAmount: 500.0,
    receivedDate: "2024-01-15",
    expiryDate: "2024-12-15",
    status: "Received",
    invoiceNumber: "INV-2024-001",
    notes: "High quality long grain rice",
  },
  {
    id: 2,
    productName: "Black Pepper",
    supplier: "Spice World Ltd.",
    quantity: 30,
    unit: "kg",
    unitPrice: 8.0,
    totalAmount: 240.0,
    receivedDate: "2024-01-15",
    expiryDate: "2025-01-15",
    status: "Received",
    invoiceNumber: "INV-2024-002",
    notes: "Ground black pepper, premium grade",
  },
  {
    id: 3,
    productName: "Fresh Potatoes",
    supplier: "Farm Fresh Vegetables",
    quantity: 250,
    unit: "kg",
    unitPrice: 1.2,
    totalAmount: 300.0,
    receivedDate: "2024-01-14",
    expiryDate: "2024-02-14",
    status: "Received",
    invoiceNumber: "INV-2024-003",
    notes: "Organic potatoes, Grade A",
  },
  {
    id: 4,
    productName: "Mineral Water",
    supplier: "Pure Water Co.",
    quantity: 500,
    unit: "bottles",
    unitPrice: 0.5,
    totalAmount: 250.0,
    receivedDate: "2024-01-14",
    expiryDate: "2025-01-14",
    status: "Pending",
    invoiceNumber: "INV-2024-004",
    notes: "500ml bottles, natural mineral water",
  },
  {
    id: 5,
    productName: "Green Tea Leaves",
    supplier: "Tea Masters Inc.",
    quantity: 50,
    unit: "kg",
    unitPrice: 12.0,
    totalAmount: 600.0,
    receivedDate: "2024-01-13",
    expiryDate: "2024-07-13",
    status: "Received",
    invoiceNumber: "INV-2024-005",
    notes: "Premium green tea, loose leaves",
  },
]

const suppliers = [
  "Golden Grain Co.",
  "Spice World Ltd.",
  "Farm Fresh Vegetables",
  "Pure Water Co.",
  "Tea Masters Inc.",
]
const products = [
  "Premium Rice",
  "Black Pepper",
  "Fresh Potatoes",
  "Mineral Water",
  "Green Tea Leaves",
  "Onions",
  "Carrots",
]

export default function IncomingStockPage() {
  const { user } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unitPrice, setUnitPrice] = useState("")

  // Restrict Warehouse Incoming to administrator, manager, and kitchen roles
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
      case "Received":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalValue = incomingStock.reduce((sum, item) => sum + item.totalAmount, 0)
  const receivedItems = incomingStock.filter((item) => item.status === "Received").length
  const pendingItems = incomingStock.filter((item) => item.status === "Pending").length
  const totalQuantity = incomingStock.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Incoming Stock</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Incoming Stock</h2>
                <p className="text-muted-foreground">Track and manage incoming inventory deliveries</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Incoming Stock
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Incoming Stock</DialogTitle>
                    <DialogDescription>Record a new stock delivery</DialogDescription>
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
                        <Label htmlFor="supplier">Supplier</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier} value={supplier}>
                                {supplier}
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
                        <Label htmlFor="receivedDate">Received Date</Label>
                        <Input id="receivedDate" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input id="expiryDate" type="date" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="invoiceNumber">Invoice Number</Label>
                        <Input id="invoiceNumber" placeholder="INV-2024-006" />
                      </div>
                      <div>
                        <Label>Total Amount</Label>
                        <div className="text-lg font-semibold p-2 bg-muted rounded">${calculateTotal()}</div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" placeholder="Additional notes about the delivery..." />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Add Stock</Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                  <CardTitle className="text-sm font-medium">Received Items</CardTitle>
                  <Package className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{receivedItems}</div>
                  <p className="text-xs text-muted-foreground">Successfully received</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingItems}</div>
                  <p className="text-xs text-muted-foreground">Awaiting delivery</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalQuantity}</div>
                  <p className="text-xs text-muted-foreground">Units received</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Incoming Stock Records</CardTitle>
                <CardDescription>All incoming stock deliveries and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Received Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomingStock.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="font-semibold">${item.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>{new Date(item.receivedDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.invoiceNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Deliveries</CardTitle>
                <CardDescription>Latest incoming stock with details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incomingStock.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{item.productName}</h4>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.supplier} • {item.quantity} {item.unit} • {item.invoiceNumber}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${item.totalAmount.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(item.receivedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
