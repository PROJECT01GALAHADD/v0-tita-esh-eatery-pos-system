"use client"

import { useAuth } from "@/components/auth-provider"
import { hasAccess } from "@/lib/acl"
import { AccessDenied } from "@/components/access-denied"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"

export default function UsersManagementPage() {
  const { user } = useAuth()

  // Centralized ACL: only administrator and manager via "data" area
  if (!hasAccess(user, "data")) {
    return <AccessDenied />
  }

  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"cashier_waiter" | "kitchen" | "manager" | "">("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [users, setUsers] = useState<Array<{ id: string | number; username: string; name: string; role: string }>>([])

  async function loadUsers() {
    try {
      const res = await fetch("/api/users", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load users")
      setUsers(json.users || [])
    } catch (e: any) {
      setMessage(e.message || "Failed to load users")
    }
  }

  useEffect(() => {
    loadUsers()
    // Subscribe to user changes for realtime updates
    let channel: ReturnType<ReturnType<typeof getSupabaseClient>["channel"]> | null = null
    try {
      const supa = getSupabaseClient()
      channel = supa.channel("users-realtime").on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        () => {
          loadUsers()
        }
      )
      channel.subscribe()
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCreate = async () => {
    setMessage(null)
    if (!username || !name || !role || !password) {
      setMessage("Please fill all fields")
      return
    }
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, role: role as any, password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to create user")
      setMessage("User created successfully")
      setUsername("")
      setName("")
      setRole("")
      setPassword("")
      await loadUsers()
    } catch (e: any) {
      setMessage(e.message || "Failed to create user")
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Users</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create User</CardTitle>
                  <CardDescription>Admins and Managers can create Manager, Cashier/Waiter or Kitchen users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">Username</Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as any)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cashier_waiter">Cashier/Waiter</SelectItem>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={onCreate}>Create</Button>
                  </div>
                  {message && <p className="text-sm text-muted-foreground">{message}</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Existing accounts stored in Supabase</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map(u => (
                        <TableRow key={u.id}>
                          <TableCell className="font-mono">{u.id}</TableCell>
                          <TableCell>{u.username}</TableCell>
                          <TableCell>{u.name}</TableCell>
                          <TableCell>{u.role}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
