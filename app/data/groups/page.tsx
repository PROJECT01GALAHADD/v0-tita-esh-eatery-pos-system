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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2 } from "lucide-react"

const productGroups = [
  {
    id: 1,
    name: "Beverages",
    description: "All types of drinks including tea, coffee, juices, and water",
    productCount: 12,
    color: "#3B82F6",
    createdDate: "2024-01-10",
  },
  {
    id: 2,
    name: "Salads",
    description: "Fresh salads and vegetable dishes",
    productCount: 8,
    color: "#10B981",
    createdDate: "2024-01-10",
  },
  {
    id: 3,
    name: "Liquid Dishes",
    description: "Soups, broths, and liquid-based meals",
    productCount: 6,
    color: "#F59E0B",
    createdDate: "2024-01-10",
  },
  {
    id: 4,
    name: "Solid Dishes",
    description: "Main courses, rice dishes, and solid meals",
    productCount: 15,
    color: "#EF4444",
    createdDate: "2024-01-10",
  },
  {
    id: 5,
    name: "Appetizers",
    description: "Starters and small dishes served before main course",
    productCount: 9,
    color: "#8B5CF6",
    createdDate: "2024-01-12",
  },
  {
    id: 6,
    name: "Desserts",
    description: "Sweet dishes and desserts",
    productCount: 7,
    color: "#EC4899",
    createdDate: "2024-01-12",
  },
]

export default function ProductGroupsPage() {
  const { user } = useAuth()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
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

  const totalProducts = productGroups.reduce((sum, group) => sum + group.productCount, 0)

  const handleEdit = (group: any) => {
    setSelectedGroup(group)
    setIsEditDialogOpen(true)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Product Groups</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Product Groups</h2>
                <p className="text-muted-foreground">Organize your products into categories</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Product Group</DialogTitle>
                    <DialogDescription>Create a new category for your products</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="groupName" className="text-right">
                        Name
                      </Label>
                      <Input id="groupName" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="groupDescription" className="text-right">
                        Description
                      </Label>
                      <Textarea id="groupDescription" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="groupColor" className="text-right">
                        Color
                      </Label>
                      <Input id="groupColor" type="color" className="col-span-3 h-10" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Add Group</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productGroups.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average per Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(totalProducts / productGroups.length)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {productGroups.map((group) => (
                <Card key={group.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: group.color }} />
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                      </div>
                      <Badge variant="secondary">{group.productCount} items</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{group.description}</CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Created: {new Date(group.createdDate).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(group)}>
                          <Edit className="h-4 w-4" />
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
                <CardTitle>Product Groups Table</CardTitle>
                <CardDescription>Detailed view of all product groups</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Product Count</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productGroups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                            <span className="font-medium">{group.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{group.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{group.productCount}</Badge>
                        </TableCell>
                        <TableCell>{new Date(group.createdDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(group)}>
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

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Product Group</DialogTitle>
                  <DialogDescription>Update the product group information</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editName" className="text-right">
                      Name
                    </Label>
                    <Input id="editName" defaultValue={selectedGroup?.name} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editDescription" className="text-right">
                      Description
                    </Label>
                    <Textarea id="editDescription" defaultValue={selectedGroup?.description} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editColor" className="text-right">
                      Color
                    </Label>
                    <Input
                      id="editColor"
                      type="color"
                      defaultValue={selectedGroup?.color}
                      className="col-span-3 h-10"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsEditDialogOpen(false)}>Update Group</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
