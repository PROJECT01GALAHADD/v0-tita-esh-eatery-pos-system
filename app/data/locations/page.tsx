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
import { Plus, MapPin, Users, Edit, Trash2 } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"
import { SidebarTrigger } from "@/components/ui/sidebar"

const serviceLocations = [
  {
    id: 1,
    tableNumber: "Table 1",
    section: "Main Hall",
    capacity: 4,
    status: "Available",
    location: "Window Side",
    reservedBy: null,
    lastCleaned: "2024-01-15 14:30",
  },
  {
    id: 2,
    tableNumber: "Table 2",
    section: "Main Hall",
    capacity: 2,
    status: "Occupied",
    location: "Center",
    reservedBy: "John Doe",
    lastCleaned: "2024-01-15 12:00",
  },
  {
    id: 3,
    tableNumber: "Table 3",
    section: "VIP Area",
    capacity: 6,
    status: "Reserved",
    location: "Private Corner",
    reservedBy: "Jane Smith",
    lastCleaned: "2024-01-15 13:15",
  },
  {
    id: 4,
    tableNumber: "Table 4",
    section: "Main Hall",
    capacity: 4,
    status: "Available",
    location: "Near Kitchen",
    reservedBy: null,
    lastCleaned: "2024-01-15 14:00",
  },
  {
    id: 5,
    tableNumber: "Table 5",
    section: "Terrace",
    capacity: 8,
    status: "Occupied",
    location: "Outdoor",
    reservedBy: "Mike Johnson",
    lastCleaned: "2024-01-15 11:30",
  },
  {
    id: 6,
    tableNumber: "Table 6",
    section: "Bar Area",
    capacity: 2,
    status: "Available",
    location: "Bar Counter",
    reservedBy: null,
    lastCleaned: "2024-01-15 14:45",
  },
  {
    id: 7,
    tableNumber: "Table 7",
    section: "VIP Area",
    capacity: 4,
    status: "Maintenance",
    location: "Private Room",
    reservedBy: null,
    lastCleaned: "2024-01-14 16:00",
  },
  {
    id: 8,
    tableNumber: "Table 8",
    section: "Main Hall",
    capacity: 6,
    status: "Available",
    location: "Center Large",
    reservedBy: null,
    lastCleaned: "2024-01-15 13:45",
  },
]

const sections = ["Main Hall", "VIP Area", "Terrace", "Bar Area", "Private Room"]

export default function ServiceLocationsPage() {
  const { user } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  if (!user) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Occupied":
        return "bg-red-100 text-red-800"
      case "Reserved":
        return "bg-yellow-100 text-yellow-800"
      case "Maintenance":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const availableTables = serviceLocations.filter((table) => table.status === "Available").length
  const occupiedTables = serviceLocations.filter((table) => table.status === "Occupied").length
  const reservedTables = serviceLocations.filter((table) => table.status === "Reserved").length
  const totalCapacity = serviceLocations.reduce((sum, table) => sum + table.capacity, 0)

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Service Locations</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Service Locations</h2>
                <p className="text-muted-foreground">Manage restaurant tables and seating areas</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Table
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Table</DialogTitle>
                    <DialogDescription>Add a new seating location to your restaurant</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tableNumber" className="text-right">
                        Table Number
                      </Label>
                      <Input id="tableNumber" placeholder="e.g., Table 9" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="section" className="text-right">
                        Section
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((section) => (
                            <SelectItem key={section} value={section}>
                              {section}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="capacity" className="text-right">
                        Capacity
                      </Label>
                      <Input id="capacity" type="number" min="1" max="20" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Location
                      </Label>
                      <Input id="location" placeholder="e.g., Near window" className="col-span-3" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Add Table</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{serviceLocations.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{availableTables}</div>
                  <p className="text-xs text-muted-foreground">Ready for guests</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Occupied</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{occupiedTables}</div>
                  <p className="text-xs text-muted-foreground">Currently serving</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCapacity}</div>
                  <p className="text-xs text-muted-foreground">Maximum guests</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {serviceLocations.map((table) => (
                <Card key={table.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{table.tableNumber}</CardTitle>
                      <Badge className={getStatusColor(table.status)}>{table.status}</Badge>
                    </div>
                    <CardDescription>
                      {table.section} - {table.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Capacity:</span>
                        <span className="font-medium">{table.capacity} guests</span>
                      </div>
                      {table.reservedBy && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Reserved by:</span>
                          <span className="font-medium">{table.reservedBy}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last cleaned:</span>
                        <span className="text-sm">{new Date(table.lastCleaned).toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Table Management</CardTitle>
                <CardDescription>Detailed view of all service locations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Table</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reserved By</TableHead>
                      <TableHead>Last Cleaned</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceLocations.map((table) => (
                      <TableRow key={table.id}>
                        <TableCell className="font-medium">{table.tableNumber}</TableCell>
                        <TableCell>{table.section}</TableCell>
                        <TableCell>{table.location}</TableCell>
                        <TableCell>{table.capacity}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(table.status)}>{table.status}</Badge>
                        </TableCell>
                        <TableCell>{table.reservedBy || "-"}</TableCell>
                        <TableCell>{new Date(table.lastCleaned).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
