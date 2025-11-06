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
import { Plus, Users, DollarSign, ShoppingCart, Edit, Eye } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"

const waiters = [
  {
    id: 1,
    name: "John Doe",
    employeeId: "EMP-001",
    department: "Dining Hall",
    shift: "Morning",
    status: "Active",
    phoneNumber: "+1-555-0101",
    email: "john.doe@restaurant.com",
    hireDate: "2024-01-10",
    todayOrders: 12,
    todayServiceAmount: 145.5,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Jane Smith",
    employeeId: "EMP-002",
    department: "Bar",
    shift: "Evening",
    status: "Active",
    phoneNumber: "+1-555-0102",
    email: "jane.smith@restaurant.com",
    hireDate: "2024-01-10",
    todayOrders: 8,
    todayServiceAmount: 98.25,
    rating: 4.6,
  },
  {
    id: 3,
    name: "Mike Johnson",
    employeeId: "EMP-003",
    department: "VIP Section",
    shift: "Evening",
    status: "Active",
    phoneNumber: "+1-555-0103",
    email: "mike.johnson@restaurant.com",
    hireDate: "2024-01-11",
    todayOrders: 6,
    todayServiceAmount: 189.75,
    rating: 4.9,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    employeeId: "EMP-004",
    department: "Dining Hall",
    shift: "Morning",
    status: "Active",
    phoneNumber: "+1-555-0104",
    email: "sarah.wilson@restaurant.com",
    hireDate: "2024-01-12",
    todayOrders: 15,
    todayServiceAmount: 167.8,
    rating: 4.7,
  },
  {
    id: 5,
    name: "Tom Brown",
    employeeId: "EMP-005",
    department: "Terrace",
    shift: "Afternoon",
    status: "Off Duty",
    phoneNumber: "+1-555-0105",
    email: "tom.brown@restaurant.com",
    hireDate: "2024-01-13",
    todayOrders: 0,
    todayServiceAmount: 0,
    rating: 4.5,
  },
  {
    id: 6,
    name: "Lisa Davis",
    employeeId: "EMP-006",
    department: "Dining Hall",
    shift: "Evening",
    status: "Active",
    phoneNumber: "+1-555-0106",
    email: "lisa.davis@restaurant.com",
    hireDate: "2024-01-14",
    todayOrders: 10,
    todayServiceAmount: 123.4,
    rating: 4.4,
  },
]

const departments = ["Dining Hall", "Bar", "VIP Section", "Terrace"]
const shifts = ["Morning", "Afternoon", "Evening", "Night"]

export default function WaitersPage() {
  const { user } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedWaiter, setSelectedWaiter] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  // Restrict Data Management to administrator and manager roles only
  if (!user || !["administrator", "manager"].includes(user.role)) {
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
      case "Active":
        return "bg-green-100 text-green-800"
      case "Off Duty":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-yellow-600"
    return "text-red-600"
  }

  const activeWaiters = waiters.filter((waiter) => waiter.status === "Active").length
  const totalOrders = waiters.reduce((sum, waiter) => sum + waiter.todayOrders, 0)
  const totalServiceAmount = waiters.reduce((sum, waiter) => sum + waiter.todayServiceAmount, 0)
  const averageRating = waiters.reduce((sum, waiter) => sum + waiter.rating, 0) / waiters.length

  const handleViewDetails = (waiter: any) => {
    setSelectedWaiter(waiter)
    setIsDetailsDialogOpen(true)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Waiters Management</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Waiters</h2>
                <p className="text-muted-foreground">Manage restaurant staff and track their daily performance</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Waiter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Waiter</DialogTitle>
                    <DialogDescription>Add a new waiter to your restaurant staff</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="waiterName" className="text-right">
                        Name
                      </Label>
                      <Input id="waiterName" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="employeeId" className="text-right">
                        Employee ID
                      </Label>
                      <Input id="employeeId" placeholder="EMP-007" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="waiterDepartment" className="text-right">
                        Department
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="waiterShift" className="text-right">
                        Shift
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          {shifts.map((shift) => (
                            <SelectItem key={shift} value={shift}>
                              {shift}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="waiterPhone" className="text-right">
                        Phone
                      </Label>
                      <Input id="waiterPhone" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="waiterEmail" className="text-right">
                        Email
                      </Label>
                      <Input id="waiterEmail" type="email" className="col-span-3" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Add Waiter</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Waiters</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{waiters.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeWaiters}</div>
                  <p className="text-xs text-muted-foreground">Currently working</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Total orders served</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Service Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalServiceAmount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Today's service charges</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {waiters.map((waiter) => (
                <Card key={waiter.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{waiter.name}</CardTitle>
                      <Badge className={getStatusColor(waiter.status)}>{waiter.status}</Badge>
                    </div>
                    <CardDescription>
                      {waiter.employeeId} - {waiter.department}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Shift:</span>
                        <span className="text-sm font-medium">{waiter.shift}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Today's Orders:</span>
                        <span className="text-sm font-medium">{waiter.todayOrders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Service Amount:</span>
                        <span className="text-sm font-medium">${waiter.todayServiceAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Rating:</span>
                        <span className={`text-sm font-medium ${getRatingColor(waiter.rating)}`}>
                          ⭐ {waiter.rating}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleViewDetails(waiter)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Waiter Performance</CardTitle>
                <CardDescription>Daily performance metrics for all waiters</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Service Amount</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {waiters.map((waiter) => (
                      <TableRow key={waiter.id}>
                        <TableCell className="font-medium">{waiter.name}</TableCell>
                        <TableCell className="font-mono">{waiter.employeeId}</TableCell>
                        <TableCell>{waiter.department}</TableCell>
                        <TableCell>{waiter.shift}</TableCell>
                        <TableCell>{waiter.todayOrders}</TableCell>
                        <TableCell>${waiter.todayServiceAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={getRatingColor(waiter.rating)}>⭐ {waiter.rating}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(waiter.status)}>{waiter.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(waiter)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Waiter Details Dialog */}
            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Waiter Details - {selectedWaiter?.name}</DialogTitle>
                  <DialogDescription>Complete information and daily performance</DialogDescription>
                </DialogHeader>
                {selectedWaiter && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Personal Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Employee ID:</span>
                            <span className="text-sm font-mono">{selectedWaiter.employeeId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Phone:</span>
                            <span className="text-sm">{selectedWaiter.phoneNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Email:</span>
                            <span className="text-sm">{selectedWaiter.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Hire Date:</span>
                            <span className="text-sm">{new Date(selectedWaiter.hireDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Today's Performance</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Orders Served:</span>
                            <span className="text-sm font-semibold">{selectedWaiter.todayOrders}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Service Amount:</span>
                            <span className="text-sm font-semibold">
                              ${selectedWaiter.todayServiceAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Average per Order:</span>
                            <span className="text-sm font-semibold">
                              $
                              {selectedWaiter.todayOrders > 0
                                ? (selectedWaiter.todayServiceAmount / selectedWaiter.todayOrders).toFixed(2)
                                : "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Rating:</span>
                            <span className={`text-sm font-semibold ${getRatingColor(selectedWaiter.rating)}`}>
                              ⭐ {selectedWaiter.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
