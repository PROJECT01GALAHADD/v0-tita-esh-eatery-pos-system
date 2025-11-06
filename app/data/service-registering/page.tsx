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
import { Plus, DollarSign, Percent, Edit, Trash2 } from "lucide-react"

const servicePricing = [
  {
    id: 1,
    serviceName: "Table Service",
    description: "Standard table service for dining customers",
    baseRate: 15.0,
    serviceType: "Percentage",
    category: "Dining",
    applicableFor: "All Tables",
    status: "Active",
    createdDate: "2024-01-10",
  },
  {
    id: 2,
    serviceName: "VIP Service",
    description: "Premium service for VIP section customers",
    baseRate: 20.0,
    serviceType: "Percentage",
    category: "VIP",
    applicableFor: "VIP Tables",
    status: "Active",
    createdDate: "2024-01-10",
  },
  {
    id: 3,
    serviceName: "Delivery Service",
    description: "Food delivery service charge",
    baseRate: 5.0,
    serviceType: "Fixed",
    category: "Delivery",
    applicableFor: "Takeaway Orders",
    status: "Active",
    createdDate: "2024-01-11",
  },
  {
    id: 4,
    serviceName: "Event Service",
    description: "Special event and catering service",
    baseRate: 25.0,
    serviceType: "Percentage",
    category: "Events",
    applicableFor: "Private Events",
    status: "Active",
    createdDate: "2024-01-12",
  },
  {
    id: 5,
    serviceName: "Late Night Service",
    description: "Additional charge for late night service",
    baseRate: 10.0,
    serviceType: "Fixed",
    category: "Special",
    applicableFor: "After 10 PM",
    status: "Inactive",
    createdDate: "2024-01-13",
  },
  {
    id: 6,
    serviceName: "Group Service",
    description: "Service charge for large groups (8+ people)",
    baseRate: 18.0,
    serviceType: "Percentage",
    category: "Group",
    applicableFor: "Groups 8+",
    status: "Active",
    createdDate: "2024-01-14",
  },
]

const serviceTypes = ["Percentage", "Fixed"]
const categories = ["Dining", "VIP", "Delivery", "Events", "Special", "Group"]

export default function ServicePricingPage() {
  const { user } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
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
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getServiceTypeIcon = (type: string) => {
    return type === "Percentage" ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />
  }

  const activeServices = servicePricing.filter((service) => service.status === "Active").length
  const averageRate = servicePricing.reduce((sum, service) => sum + service.baseRate, 0) / servicePricing.length

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Service Pricing</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Service Pricing</h2>
                <p className="text-muted-foreground">Manage service charges and pricing for waiters</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service Price
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Service Price</DialogTitle>
                    <DialogDescription>Create a new service pricing structure</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="serviceName" className="text-right">
                        Service Name
                      </Label>
                      <Input id="serviceName" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="serviceDescription" className="text-right">
                        Description
                      </Label>
                      <Textarea id="serviceDescription" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="serviceType" className="text-right">
                        Service Type
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="baseRate" className="text-right">
                        Base Rate
                      </Label>
                      <Input id="baseRate" type="number" step="0.01" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="applicableFor" className="text-right">
                        Applicable For
                      </Label>
                      <Input id="applicableFor" className="col-span-3" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Add Service</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{servicePricing.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeServices}</div>
                  <p className="text-xs text-muted-foreground">Currently available</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageRate.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Across all services</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {servicePricing.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{service.serviceName}</CardTitle>
                      <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Rate:</span>
                        <div className="flex items-center gap-1">
                          {getServiceTypeIcon(service.serviceType)}
                          <span className="font-semibold">
                            {service.serviceType === "Percentage" ? `${service.baseRate}%` : `$${service.baseRate}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Category:</span>
                        <Badge variant="outline">{service.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Applicable For:</span>
                        <span className="text-sm font-medium">{service.applicableFor}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Created:</span>
                        <span className="text-sm">{new Date(service.createdDate).toLocaleDateString()}</span>
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
                <CardTitle>Service Pricing Table</CardTitle>
                <CardDescription>Complete overview of all service pricing structures</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Applicable For</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicePricing.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.serviceName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getServiceTypeIcon(service.serviceType)}
                            <span>{service.serviceType}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {service.serviceType === "Percentage" ? `${service.baseRate}%` : `$${service.baseRate}`}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{service.category}</Badge>
                        </TableCell>
                        <TableCell>{service.applicableFor}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(service.createdDate).toLocaleDateString()}</TableCell>
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
