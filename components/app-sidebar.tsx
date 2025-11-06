"use client"

import { BarChart3, Database, ShoppingCart, MenuSquare, CreditCard, Warehouse, Lock, LogOut, User, MonitorSmartphone } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAuth } from "./auth-provider"
import Image from "next/image"

// Define permissions for each role
const rolePermissions = {
  administrator: ["dashboard", "data", "warehouse", "menu", "orders", "cash-registers", "pos"],
  manager: ["dashboard", "data", "warehouse", "menu", "orders", "cash-registers", "pos"],
  cashier_waiter: ["dashboard", "orders", "cash-registers", "menu", "pos"],
  // Kitchen role: limited to dashboard overview, kitchen screen, inventory, menu
  kitchen: ["dashboard", "kitchen", "menu", "warehouse"],
}

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "/",
    permission: "dashboard",
  },
  {
    title: "Data Management",
    icon: Database,
    permission: "data",
    items: [
      { title: "Products", url: "/data/products" },
      { title: "Food Pricing", url: "/data/pricing" },
      { title: "Service Locations", url: "/data/locations" },
      { title: "Cash Registers", url: "/data/registers" },
      { title: "Waiters", url: "/data/waiters" },
      { title: "Users", url: "/data/users" },
    ],
  },
  {
    title: "Warehouse",
    icon: Warehouse,
    permission: "warehouse",
    items: [
      { title: "Products", url: "/warehouse/products" },
      { title: "Incoming", url: "/warehouse/incoming" },
      { title: "Outgoing", url: "/warehouse/outgoing" },
    ],
  },
  {
    title: "POS",
    icon: MonitorSmartphone,
    url: "/pos",
    permission: "pos",
  },
  {
    title: "Kitchen Screen",
    icon: MonitorSmartphone,
    url: "/kitchen",
    permission: "kitchen",
  },
  {
    title: "Menu",
    icon: MenuSquare,
    url: "/menu",
    permission: "menu",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    permission: "orders",
    items: [
      { title: "Daily Orders", url: "/orders/daily" },
      { title: "Periodic Orders", url: "/orders/periodic" },
    ],
  },
  {
    title: "Cash Registers",
    icon: CreditCard,
    url: "/cash-registers",
    permission: "cash-registers",
  },
]

export function AppSidebar() {
  const { user, lock, logout } = useAuth()

  if (!user) return null

  const userPermissions = rolePermissions[user.role] || []
  const filteredMenuItems = menuItems.filter((item) => userPermissions.includes(item.permission))

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src="/tita-esh-logo.png"
              alt="Tita Esh Eatery Logo"
              width={40}
              height={40}
              className="rounded-full"
              priority
            />
          </div>
          <div className="flex-1">
            <span className="font-bold text-sm text-red-700">Tita Esh</span>
            <span className="block text-xs text-green-700 font-semibold">POS System</span>
          </div>
        </div>

        <div className="px-4 py-2 border-t border-yellow-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              Signed in as {user.role.replace("_", "/")}
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <div>
                      <SidebarMenuButton className="w-full justify-start">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      <div className="ml-6 mt-1 space-y-1">
                        {item.items.map((subItem) => (
                          <SidebarMenuButton key={subItem.title} asChild size="sm">
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2 space-y-2">
          <Button variant="outline" size="sm" onClick={lock} className="w-full justify-start bg-transparent">
            <Lock className="h-4 w-4 mr-2" />
            Lock Screen
          </Button>
          <Button variant="outline" size="sm" onClick={logout} className="w-full justify-start bg-transparent">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
