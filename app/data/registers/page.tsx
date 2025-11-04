"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, CreditCard, Settings, Edit, Trash2 } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"

const cashRegisters = [
  {
    id: 1,
    name: "Main Counter Register",
    registerId: "REG-001",
    location: "Front Desk",
    department: "Dining Hall",
    status: "Active",
    assignedOperator: "John Doe",
    installDate: "2024-01-10",
    lastMaintenance: "2024-01-14",
    serialNumber: "CR-2024-001",
  },
  {
    id: 2,
    name: "Bar Counter Register",
    registerId: "REG-002",
    location: "Bar Area",
    department: "Bar",
    status: "Active",
    assignedOperator: "Jane Smith",
    installDate: "2024-01-10",
    lastMaintenance: "2024-01-13",
    serialNumber: "CR-2024-002",
  },
  {
    id: 3,
    name: "Takeaway Counter Register",
    registerId: "REG-003",
    location: "Side Entrance",
    department: "Dining Hall",
    status: "Inactive",
    assignedOperator: null,
    installDate: "2024-01-11",
    lastMaintenance: "2024-01-12",
    serialNumber: "CR-2024-003",
  },
  {
    id: 4,
    name: "VIP Section Register",
    registerId: "REG-004",
    location: "Private Dining",
    department: "VIP Section",
    status: "Active",
    assignedOperator: "Mike Johnson",
    installDate: "2024-01-12",
    lastMaintenance: "2024-01-15",
    serialNumber: "CR-2024-004",
  },
  {
    id: 5,
    name: "Kitchen Order Register",
    registerId: "REG-005",
    location: "Kitchen Counter",
    department: "Kitchen",
    status: "Maintenance",
    assignedOperator: null,
    installDate: "2024-01-08",
    lastMaintenance: "2024-01-10",
    serialNumber: "CR-2024-005",
  },
]

const departments = ["Dining Hall", "Bar", "Kitchen", "VIP Section", "Warehouse", "Terrace"]
const operators = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "Tom Brown"]

export default function RegistersPage() {
  const { user } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  if (!user) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const activeRegisters = cashRegisters.filter((reg) => reg.status === "Active").length
  const inactiveRegisters = cashRegisters.filter((reg) => reg.status === "Inactive").length
  const maintenanceRegisters = cashRegisters.filter((reg) => reg.status === "Maintenance").length

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Cash Registers</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Cash Registers Management</h2>
                <p className="text-muted-foreground">Manage and configure all cash registers in your restaurant</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Register
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Cash Register</DialogTitle>
                    <DialogDescription>Configure a new cash register for your restaurant</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="regName" className="text-right">
                        Name
                      </Label>
                      <Input id="regName" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="regId" className="text-right">
                        Register ID
                      </Label>
                      <Input id="regId" placeholder="REG-006" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="regLocation" className="text-right">
                        Location
                      </Label>
                      <Input id="regLocation" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="regDepartment" className="text-right">
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
                      <Label htmlFor="regOperator" className="text-right">
                        Operator
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map((operator) => (
                            <SelectItem key={operator} value={operator}>
                              {operator}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="regSerial" className="text-right">
                        Serial Number
                      </Label>
                      <Input id="regSerial" placeholder="CR-2024-006" className="col-span-3" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Add Register</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Registers</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cashRegisters.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeRegisters}</div>
                  <p className="text-xs text-muted-foreground">Currently operational</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{inactiveRegisters}</div>
                  <p className="text-xs text-muted-foreground">Not in use</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
                  <Settings className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{maintenanceRegisters}</div>
                  <p className="text-xs text-muted-foreground">Under maintenance</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cashRegisters.map((register) => (
                <Card key={register.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{register.name}</CardTitle>
                      <Badge className={getStatusColor(register.status)}>{register.status}</Badge>
                    </div>
                    <CardDescription>
                      {register.registerId} - {register.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Department:</span>
                        <span className="text-sm font-medium">{register.department}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Operator:</span>
                        <span className="text-sm font-medium">{register.assignedOperator || "Unassigned"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Serial:</span>
                        <span className="text-sm font-mono">{register.serialNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Maintenance:</span>
                        <span className="text-sm">{new Date(register.lastMaintenance).toLocaleDateString()}</span>
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
                <CardTitle>Register Details</CardTitle>
                <CardDescription>Complete information about all cash registers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Register ID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Maintenance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashRegisters.map((register) => (
                      <TableRow key={register.id}>
                        <TableCell className="font-medium">{register.name}</TableCell>
                        <TableCell className="font-mono">{register.registerId}</TableCell>
                        <TableCell>{register.location}</TableCell>
                        <TableCell>{register.department}</TableCell>
                        <TableCell>{register.assignedOperator || "Unassigned"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(register.status)}>{register.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(register.lastMaintenance).toLocaleDateString()}</TableCell>
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
