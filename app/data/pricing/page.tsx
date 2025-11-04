"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, DollarSign, TrendingUp, Edit } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"

const dishPricing = [
  {
    id: 1,
    dishName: "Plov (Osh)",
    category: "Main Course",
    basePrice: 12.0,
    currentPrice: 12.0,
    costPrice: 8.5,
    profitMargin: 41.2,
    lastUpdated: "2024-01-15",
    status: "Active",
  },
  {
    id: 2,
    dishName: "Lagman",
    category: "Main Course",
    basePrice: 10.0,
    currentPrice: 10.0,
    costPrice: 7.2,
    profitMargin: 28.0,
    lastUpdated: "2024-01-15",
    status: "Active",
  },
  {
    id: 3,
    dishName: "Mastava",
    category: "Soup",
    basePrice: 8.0,
    currentPrice: 8.0,
    costPrice: 5.5,
    profitMargin: 31.3,
    lastUpdated: "2024-01-14",
    status: "Active",
  },
  {
    id: 4,
    dishName: "Beshbarmak",
    category: "Main Course",
    basePrice: 15.0,
    currentPrice: 15.0,
    costPrice: 11.0,
    profitMargin: 26.7,
    lastUpdated: "2024-01-14",
    status: "Inactive",
  },
  {
    id: 5,
    dishName: "Manti",
    category: "Appetizer",
    basePrice: 9.0,
    currentPrice: 9.0,
    costPrice: 6.0,
    profitMargin: 33.3,
    lastUpdated: "2024-01-13",
    status: "Active",
  },
]

const dishes = ["Plov (Osh)", "Lagman", "Mastava", "Beshbarmak", "Manti", "Samsa", "Shurpa", "Norin"]

export default function FoodPricingPage() {
  const { user } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedDish, setSelectedDish] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [costPrice, setCostPrice] = useState("")

  if (!user) return null

  const calculateProfitMargin = () => {
    const base = Number.parseFloat(basePrice) || 0
    const cost = Number.parseFloat(costPrice) || 0
    if (base > 0 && cost > 0) {
      return (((base - cost) / base) * 100).toFixed(1)
    }
    return "0"
  }

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getProfitMarginColor = (margin: number) => {
    if (margin >= 35) return "text-green-600"
    if (margin >= 25) return "text-yellow-600"
    return "text-red-600"
  }

  const averageMargin = dishPricing.reduce((sum, item) => sum + item.profitMargin, 0) / dishPricing.length
  const totalRevenue = dishPricing.reduce((sum, item) => sum + item.currentPrice, 0)
  const activeDishes = dishPricing.filter((item) => item.status === "Active").length

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Food Pricing</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Food Pricing</h2>
                <p className="text-muted-foreground">Manage pricing for all dishes and calculate profit margins</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Set Dish Price
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Dish Price</DialogTitle>
                    <DialogDescription>Assign pricing to a dish</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dish" className="text-right">
                        Dish
                      </Label>
                      <Select value={selectedDish} onValueChange={setSelectedDish}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select dish" />
                        </SelectTrigger>
                        <SelectContent>
                          {dishes.map((dish) => (
                            <SelectItem key={dish} value={dish}>
                              {dish}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="basePrice" className="text-right">
                        Base Price
                      </Label>
                      <Input
                        id="basePrice"
                        type="number"
                        step="0.01"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="costPrice" className="text-right">
                        Cost Price
                      </Label>
                      <Input
                        id="costPrice"
                        type="number"
                        step="0.01"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Profit Margin</Label>
                      <div className="col-span-3 text-lg font-semibold">{calculateProfitMargin()}%</div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Set Price</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Dishes</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeDishes}</div>
                  <p className="text-xs text-muted-foreground">out of {dishPricing.length} total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Margin</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageMargin.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Profit margin</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Menu Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Combined dish prices</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Price Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${Math.min(...dishPricing.map((d) => d.currentPrice))} - $
                    {Math.max(...dishPricing.map((d) => d.currentPrice))}
                  </div>
                  <p className="text-xs text-muted-foreground">Min - Max price</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dish Pricing Table</CardTitle>
                <CardDescription>Current pricing and profit margins for all dishes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dish Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Cost Price</TableHead>
                      <TableHead>Selling Price</TableHead>
                      <TableHead>Profit Margin</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dishPricing.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.dishName}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>${item.costPrice.toFixed(2)}</TableCell>
                        <TableCell className="font-semibold">${item.currentPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`font-semibold ${getProfitMarginColor(item.profitMargin)}`}>
                            {item.profitMargin.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
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
