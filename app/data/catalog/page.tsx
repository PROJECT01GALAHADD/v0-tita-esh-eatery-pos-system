"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { Plus, Search, RefreshCw, BookOpen } from "lucide-react"

const catalogItems = [
  {
    id: 1,
    name: "First Grade Wheat Flour",
    mxikCode: "01101001002000000",
    barcode: "1234566789012",
    category: "Raw Materials",
    unit: "kg",
    description: "Premium quality wheat flour for baking",
    status: "Active",
  },
  {
    id: 2,
    name: "Premium Rice",
    mxikCode: "01101002001000000",
    barcode: "2345677890123",
    category: "Raw Materials",
    unit: "kg",
    description: "Long grain premium rice",
    status: "Active",
  },
  {
    id: 3,
    name: "Black Pepper Ground",
    mxikCode: "01102003001000000",
    barcode: "3456788901234",
    category: "Spices",
    unit: "kg",
    description: "Ground black pepper spice",
    status: "Active",
  },
  {
    id: 4,
    name: "Mineral Water 0.5L",
    mxikCode: "02201001001000000",
    barcode: "4567899012345",
    category: "Beverages",
    unit: "bottle",
    description: "Natural mineral water",
    status: "Active",
  },
  {
    id: 5,
    name: "Green Tea Leaves",
    mxikCode: "02202001001000000",
    barcode: "5678900123456",
    category: "Beverages",
    unit: "kg",
    description: "Premium green tea leaves",
    status: "Active",
  },
]

export default function CatalogPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isGuideOpen, setIsGuideOpen] = useState(false)

  if (!user) return null

  const filteredItems = catalogItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mxikCode.includes(searchTerm) ||
      item.barcode.includes(searchTerm),
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">National Electronic Catalog</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">National Electronic Catalog</h2>
                <p className="text-muted-foreground">Manage products and services linked by MXIK/Barcode</p>
              </div>
              <div className="flex gap-2">
                <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Guide
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>National Electronic Catalog Guide</DialogTitle>
                      <DialogDescription>How to use MXIK codes and barcodes</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">MXIK Code Format:</h4>
                        <p className="text-sm text-muted-foreground">
                          MXIK (National Classifier of Products and Services) uses a 17-digit code format. Example:
                          01101001002000000 for first grade wheat flour.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Barcode Format:</h4>
                        <p className="text-sm text-muted-foreground">
                          Standard 13-digit EAN barcode format. Example: 1234566789012
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Search Tips:</h4>
                        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                          <li>Search by product name, MXIK code, or barcode</li>
                          <li>Use partial codes for broader search results</li>
                          <li>Update data regularly to maintain accuracy</li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Data
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product/Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Product/Service</DialogTitle>
                      <DialogDescription>Add a new item to the national catalog</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mxik" className="text-right">
                          MXIK Code
                        </Label>
                        <Input id="mxik" placeholder="17-digit code" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="barcode" className="text-right">
                          Barcode
                        </Label>
                        <Input id="barcode" placeholder="13-digit barcode" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Category
                        </Label>
                        <Input id="category" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="unit" className="text-right">
                          Unit
                        </Label>
                        <Input id="unit" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Input id="description" className="col-span-3" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddDialogOpen(false)}>Add Item</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Search Catalog</CardTitle>
                <CardDescription>Search by product name, MXIK code, or barcode</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, MXIK code, or barcode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catalog Items</CardTitle>
                <CardDescription>Products and services in the national catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>MXIK Code</TableHead>
                      <TableHead>Barcode</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="font-mono text-sm">{item.mxikCode}</TableCell>
                        <TableCell className="font-mono text-sm">{item.barcode}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">{item.status}</Badge>
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
