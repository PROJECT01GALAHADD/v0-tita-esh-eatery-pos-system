"use client"

import { useEffect, useMemo, useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { hasAccess } from "@/lib/acl"
import { AccessDenied } from "@/components/access-denied"
import { AlertTriangle, PackageSearch, RefreshCcw } from "lucide-react"

type InventoryProduct = {
  id: string
  name: string
  unit: string
  stock: number
  minStock: number
  maxStock: number
  lowStock: boolean
  createdAt: string
}

export default function InventoryManagerPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<InventoryProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/inventory")
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`)
        const json = await res.json()
        setProducts(json.products || [])
      } catch (e: any) {
        setError(e?.message || "Failed to load inventory")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? products.filter(p => p.name.toLowerCase().includes(q)) : products
  }, [products, query])

  const lowCount = useMemo(() => products.filter(p => p.lowStock).length, [products])

  if (!user) return null
  if (!hasAccess(user, "dashboard")) {
    return <AccessDenied />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Inventory Overview</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Warehouse Products</h2>
                <p className="text-muted-foreground">Live stock levels from Supabase</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => location.reload()} disabled={loading}>
                  <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
                </Button>
              </div>
            </div>

            {error && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600">{error}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{lowCount}</div>
                  <p className="text-xs text-muted-foreground">Below minimum threshold</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PackageSearch className="h-4 w-4" /> Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-2">
                  <Input placeholder="Search products…" value={query} onChange={e => setQuery(e.target.value)} />
                  <Button variant="outline" onClick={() => setQuery("")}>Clear</Button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Min</TableHead>
                        <TableHead>Max</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell>{p.unit}</TableCell>
                          <TableCell>{p.stock}</TableCell>
                          <TableCell>{p.minStock}</TableCell>
                          <TableCell>{p.maxStock}</TableCell>
                          <TableCell>
                            {p.lowStock ? (
                              <Badge variant="destructive">Low</Badge>
                            ) : (
                              <Badge variant="secondary">OK</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filtered.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                            No products found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}

