"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, CheckCircle2, Flame } from "lucide-react"

type OrderTicket = {
  id: string
  orderId: string
  items: { name: string; quantity: number; special?: string }[]
  tableNumber: string
  status: "new" | "preparing" | "ready"
  createdAt: Date
  prepTime?: number
}

export function KitchenDisplaySystem() {
  const [orders, setOrders] = useState<OrderTicket[]>([
    {
      id: "1",
      orderId: "ORD-001",
      items: [
        { name: "Plov", quantity: 2, special: "Extra garlic" },
        { name: "Lagman", quantity: 1 },
      ],
      tableNumber: "5",
      status: "new",
      createdAt: new Date(Date.now() - 5 * 60000),
      prepTime: 5,
    },
    {
      id: "2",
      orderId: "ORD-002",
      items: [
        { name: "Shashlik", quantity: 3 },
        { name: "Salad", quantity: 2 },
      ],
      tableNumber: "8",
      status: "preparing",
      createdAt: new Date(Date.now() - 12 * 60000),
      prepTime: 12,
    },
  ])

  const newOrders = orders.filter((o) => o.status === "new")
  const preparingOrders = orders.filter((o) => o.status === "preparing")
  const readyOrders = orders.filter((o) => o.status === "ready")

  const getTimeElapsed = (createdAt: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000 / 60)
    return diff
  }

  const TicketCard = ({ ticket }: { ticket: OrderTicket }) => {
    const elapsed = getTimeElapsed(ticket.createdAt)
    const isOvertime = ticket.prepTime && elapsed > ticket.prepTime

    return (
      <Card
        className={`${
          ticket.status === "new"
            ? "border-red-500 border-2"
            : ticket.status === "preparing"
              ? "border-yellow-500 border-2"
              : "border-green-500 border-2"
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">{ticket.orderId}</CardTitle>
              <p className="text-sm text-muted-foreground">Table {ticket.tableNumber}</p>
            </div>
            <Badge
              className={`${
                ticket.status === "new"
                  ? "bg-red-500"
                  : ticket.status === "preparing"
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
            >
              {ticket.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            {ticket.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">
                    {item.quantity}x {item.name}
                  </span>
                  {item.special && <p className="text-xs text-muted-foreground italic">{item.special}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{elapsed}m ago</span>
            </div>
            {isOvertime && <AlertCircle className="h-4 w-4 text-red-500" />}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full h-screen bg-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Kitchen Display System</h1>
          <p className="text-slate-400 text-sm">Tita Esh Eatery</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* New Orders - High Priority */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-bold">New Orders ({newOrders.length})</h2>
            </div>
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {newOrders.map((order) => (
                <TicketCard key={order.id} ticket={order} />
              ))}
              {newOrders.length === 0 && <p className="text-slate-400 text-center py-8">No new orders</p>}
            </div>
          </div>

          {/* Preparing Orders */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-bold">Preparing ({preparingOrders.length})</h2>
            </div>
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {preparingOrders.map((order) => (
                <TicketCard key={order.id} ticket={order} />
              ))}
              {preparingOrders.length === 0 && <p className="text-slate-400 text-center py-8">No orders preparing</p>}
            </div>
          </div>

          {/* Ready Orders */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h2 className="text-xl font-bold">Ready ({readyOrders.length})</h2>
            </div>
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {readyOrders.map((order) => (
                <TicketCard key={order.id} ticket={order} />
              ))}
              {readyOrders.length === 0 && <p className="text-slate-400 text-center py-8">No ready orders</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
