"use client"

import { useAuth } from "@/components/auth-provider"
import { isAdmin } from "@/lib/acl"
import { AccessDenied } from "@/components/access-denied"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { getSupabaseClient } from "@/lib/supabase"
import { useEffect, useMemo, useRef, useState } from "react"

type HealthStatus = { status: string; database?: string; timestamp?: string; error?: string }
type Stats = { totalOrders: number; totalRevenue: number; activeWaiters: number }
type ServerConfig = { kitchenHintsEnabled: boolean; realtimeMonitorEnabled: boolean; source?: string }
type MonitorEvent = { ts: number; source: string; event: string; payload: any }

export default function DeveloperModePage() {
  const { user } = useAuth()

  if (!user || !isAdmin(user.role)) {
    return <AccessDenied title="Admin Only" message="Developer Mode is restricted to administrators." />
  }

  const [clientEnvOk, setClientEnvOk] = useState<boolean>(false)
  const [dbHealth, setDbHealth] = useState<HealthStatus | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [localKitchenHints, setLocalKitchenHints] = useState<boolean>(true)
  const [localRealtimeMonitor, setLocalRealtimeMonitor] = useState<boolean>(false)
  const [serverConfig, setServerConfig] = useState<ServerConfig | null>(null)
  const [monitorEvents, setMonitorEvents] = useState<MonitorEvent[]>([])
  const [monitorConnected, setMonitorConnected] = useState<boolean>(false)
  const kitchenChanRef = useRef<any>(null)
  const ordersChanRef = useRef<any>(null)
  const supa = useMemo(() => {
    try {
      const c = getSupabaseClient()
      setClientEnvOk(true)
      return c
    } catch {
      setClientEnvOk(false)
      return null
    }
  }, [])

  useEffect(() => {
    // Fetch database health (validates server-side env keys and connectivity)
    fetch("/api/health/db")
      .then((r) => r.json())
      .then((j) => setDbHealth(j))
      .catch((e) => setDbHealth({ status: "error", error: String(e) }))

    // Load general stats snapshot
    fetch("/api/stats")
      .then((r) => r.json())
      .then((j) => setStats(j))
      .catch(() => {})

    // Load local toggles
    try {
      const hints = localStorage.getItem("dev_enableKitchenHints")
      const monitor = localStorage.getItem("dev_enableRealtimeMonitor")
      if (hints !== null) setLocalKitchenHints(hints === "true")
      if (monitor !== null) setLocalRealtimeMonitor(monitor === "true")
    } catch {}

    // Load server config (optional)
    fetch("/api/config")
      .then((r) => r.json())
      .then((j) => setServerConfig(j))
      .catch(() => setServerConfig(null))
  }, [])

  const sendKitchenHint = async () => {
    if (!supa) return
    if (!localKitchenHints) return
    const ch = supa.channel("kitchen")
    await ch.subscribe()
    await ch.send({
      type: "broadcast",
      event: "processing",
      payload: {
        at: Date.now(),
        items: [
          { name: "Developer Test Item", qty: 1 },
          { name: "Sample Dish", qty: 2 },
        ],
      },
    })
    await ch.unsubscribe()
  }

  const clearKitchenHint = async () => {
    if (!supa) return
    const ch = supa.channel("kitchen")
    await ch.subscribe()
    await ch.send({ type: "broadcast", event: "finalized", payload: { at: Date.now() } })
    await ch.unsubscribe()
  }

  // Realtime Monitor: subscribes to kitchen broadcasts and order inserts when enabled
  useEffect(() => {
    if (!supa) return
    // Clean up existing channels first
    if (kitchenChanRef.current) {
      try { kitchenChanRef.current.unsubscribe() } catch {}
      kitchenChanRef.current = null
    }
    if (ordersChanRef.current) {
      try { ordersChanRef.current.unsubscribe() } catch {}
      ordersChanRef.current = null
    }

    if (!localRealtimeMonitor) {
      setMonitorConnected(false)
      return
    }

    // Kitchen broadcast monitor
    const ch = supa.channel("kitchen")
    kitchenChanRef.current = ch
    ch.on("broadcast", { event: "processing" }, (payload: any) => {
      setMonitorEvents((prev) => [
        { ts: Date.now(), source: "kitchen", event: "processing", payload },
        ...prev,
      ])
    })
    ch.on("broadcast", { event: "finalized" }, (payload: any) => {
      setMonitorEvents((prev) => [
        { ts: Date.now(), source: "kitchen", event: "finalized", payload },
        ...prev,
      ])
    })
    ch.subscribe()

    // Orders table INSERT monitor
    const ordersCh = supa
      .channel("orders-monitor")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload: any) => {
        setMonitorEvents((prev) => [
          { ts: Date.now(), source: "orders", event: "INSERT", payload },
          ...prev,
        ])
      })
    ordersChanRef.current = ordersCh
    ordersCh.subscribe()

    setMonitorConnected(true)

    return () => {
      try { ch.unsubscribe() } catch {}
      try { ordersCh.unsubscribe() } catch {}
      setMonitorConnected(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localRealtimeMonitor, supa])

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Developer Mode</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Environment Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Client Supabase Config</span>
                    <Badge className={clientEnvOk ? "bg-green-600" : "bg-red-600"}>
                      {clientEnvOk ? "OK" : "Missing"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Supabase Connectivity</span>
                    <Badge className={(dbHealth?.status === "healthy") ? "bg-green-600" : "bg-red-600"}>
                      {dbHealth?.status ?? "unknown"}
                    </Badge>
                  </div>
                  {dbHealth?.error && (
                    <div className="text-xs text-red-600">{dbHealth.error}</div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Server uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Realtime Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={sendKitchenHint} disabled={!localKitchenHints}>Send Kitchen Hint</Button>
                    <Button variant="outline" onClick={clearKitchenHint}>Clear Hint</Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Sends `processing` and `finalized` broadcast events on the `kitchen` channel.
                  </div>
                </CardContent>
              </Card>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Toggles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Kitchen Hints (Local)</div>
                      <div className="text-xs text-muted-foreground">Controls hint broadcast from this device.</div>
                    </div>
                    <Switch
                      checked={localKitchenHints}
                      onCheckedChange={(v) => {
                        setLocalKitchenHints(!!v)
                        try {
                          localStorage.setItem("dev_enableKitchenHints", String(!!v))
                        } catch {}
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Realtime Monitor (Local)</div>
                      <div className="text-xs text-muted-foreground">Enable verbose logs on this device.</div>
                    </div>
                    <Switch
                      checked={localRealtimeMonitor}
                      onCheckedChange={(v) => {
                        setLocalRealtimeMonitor(!!v)
                        try {
                          localStorage.setItem("dev_enableRealtimeMonitor", String(!!v))
                        } catch {}
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Server Config</div>
                      <div className="text-xs text-muted-foreground">Fetched from `/api/config` if configured.</div>
                    </div>
                    <Badge variant="outline">{serverConfig?.source ? serverConfig.source : "default"}</Badge>
                  </div>
                  <div className="text-xs">
                    {serverConfig ? (
                      <pre className="bg-muted px-2 py-1 rounded-md overflow-x-auto">{JSON.stringify(serverConfig, null, 2)}</pre>
                    ) : (
                      <span className="text-muted-foreground">No server config detected.</span>
                    )}
                  </div>
              </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Realtime Monitor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Subscriptions</span>
                    <Badge className={monitorConnected ? "bg-green-600" : "bg-muted"}>
                      {monitorConnected ? "Connected" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Events Captured</span>
                    <Badge variant="outline">{monitorEvents.length}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setMonitorEvents([])}>Clear</Button>
                    <Button variant="secondary" size="sm" onClick={() => setLocalRealtimeMonitor(true)}>Enable</Button>
                    <Button variant="outline" size="sm" onClick={() => setLocalRealtimeMonitor(false)}>Disable</Button>
                  </div>
                  <div className="text-xs text-muted-foreground">Shows `kitchen` broadcasts and `orders` inserts.</div>
                  <div className="max-h-64 overflow-y-auto rounded-md border bg-muted/40 p-2">
                    {monitorEvents.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No events yet.</div>
                    ) : (
                      <ul className="space-y-2">
                        {monitorEvents.map((e, idx) => (
                          <li key={`${e.ts}-${idx}`} className="text-xs">
                            <div className="font-medium">[{new Date(e.ts).toLocaleTimeString()}] {e.source} · {e.event}</div>
                            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(e.payload, null, 2)}</pre>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>System Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Total Orders</span>
                    <Badge>{stats?.totalOrders ?? 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Revenue</span>
                    <Badge>{(stats?.totalRevenue ?? 0).toLocaleString()}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Waiters</span>
                    <Badge>{stats?.activeWaiters ?? 0}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Useful Docs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    <li><a className="underline" href="/docs/supabase-setup-instructions.md" target="_blank">Supabase Setup Instructions</a></li>
                    <li><a className="underline" href="/docs/deployment-checklist.md" target="_blank">Deployment Checklist</a></li>
                    <li><a className="underline" href="/docs/system-architecture.md" target="_blank">System Architecture</a></li>
                    <li><a className="underline" href="/docs/replit.md" target="_blank">Replit Notes</a></li>
                    <li><a className="underline" href="/docs/role-based-system-complete.md" target="_blank">RBAC Overview</a></li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
