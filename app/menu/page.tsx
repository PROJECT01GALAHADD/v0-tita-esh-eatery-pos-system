"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Star, Clock, DollarSign } from "lucide-react"

const menuItems = [
  {
    id: 1,
    name: "Plov (Osh)",
    description: "Traditional Uzbek rice dish with meat, carrots, and spices",
    price: 12.0,
    category: "Main Course",
    preparationTime: 25,
    rating: 4.8,
    isAvailable: true,
    isPopular: true,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Lagman",
    description: "Hand-pulled noodles with vegetables and meat in savory broth",
    price: 10.0,
    category: "Main Course",
    preparationTime: 20,
    rating: 4.6,
    isAvailable: true,
    isPopular: true,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Mastava",
    description: "Hearty rice soup with vegetables and meat",
    price: 8.0,
    category: "Soup",
    preparationTime: 15,
    rating: 4.4,
    isAvailable: true,
    isPopular: false,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Beshbarmak",
    description: "Traditional noodle dish with boiled meat and onions",
    price: 15.0,
    category: "Main Course",
    preparationTime: 30,
    rating: 4.7,
    isAvailable: false,
    isPopular: true,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    name: "Manti",
    description: "Steamed dumplings filled with seasoned meat",
    price: 9.0,
    category: "Appetizer",
    preparationTime: 35,
    rating: 4.5,
    isAvailable: true,
    isPopular: false,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    name: "Green Tea",
    description: "Traditional Uzbek green tea",
    price: 2.0,
    category: "Beverages",
    preparationTime: 5,
    rating: 4.2,
    isAvailable: true,
    isPopular: false,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 7,
    name: "Fresh Salad",
    description: "Mixed seasonal vegetables with herbs",
    price: 5.0,
    category: "Salad",
    preparationTime: 10,
    rating: 4.3,
    isAvailable: true,
    isPopular: false,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 8,
    name: "Mineral Water",
    description: "Sparkling or still mineral water",
    price: 1.5,
    category: "Beverages",
    preparationTime: 1,
    rating: 4.0,
    isAvailable: true,
    isPopular: false,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function MenuPage() {
  const { user } = useAuth()

  // Check permissions - menu is accessible by administrator, manager, cashier, waiter, chef
  if (!user || !["administrator", "manager", "cashier", "waiter", "chef"].includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Main Course":
        return "bg-red-100 text-red-800"
      case "Soup":
        return "bg-orange-100 text-orange-800"
      case "Appetizer":
        return "bg-green-100 text-green-800"
      case "Salad":
        return "bg-blue-100 text-blue-800"
      case "Beverages":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const availableItems = menuItems.filter((item) => item.isAvailable).length
  const popularItems = menuItems.filter((item) => item.isPopular).length
  const averagePrice = menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Restaurant Menu</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
              <p className="text-muted-foreground">Manage your restaurant menu items and availability</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{menuItems.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{availableItems}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Popular Items</CardTitle>
                  <Star className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{popularItems}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <Card key={item.id} className={`relative ${!item.isAvailable ? "opacity-60" : ""}`}>
                  {item.isPopular && (
                    <Badge className="absolute top-2 right-2 bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}

                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-muted rounded-md mb-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge className={getCategoryColor(item.category)} variant="secondary">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${item.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="mb-4">{item.description}</CardDescription>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.preparationTime} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {item.rating}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch checked={item.isAvailable} id={`available-${item.id}`} />
                        <label htmlFor={`available-${item.id}`} className="text-sm font-medium">
                          Available
                        </label>
                      </div>
                      {["administrator", "manager"].includes(user.role) && (
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
