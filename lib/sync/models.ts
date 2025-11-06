export type BaseDoc = {
  externalId: string
  source?: "mongo" | "nocodb"
  version?: number
  updatedAt: string
}

export type WaiterOp = BaseDoc & {
  waiterId: string
  tableNumber: string
  action: "seat" | "order" | "serve" | "bill"
  notes?: string
}

export type ChefOrder = BaseDoc & {
  orderId: string
  status: "queued" | "prepping" | "ready" | "served" | "cancelled"
  items: Array<{ sku: string; qty: number }>
}

export type CashierTxn = BaseDoc & {
  txnId: string
  amount: number
  currency: string
  method: "cash" | "card" | "mobile"
}

export const collections = {
  waiterOps: "waiter_ops",
  chefOrders: "chef_orders",
  cashierTxns: "cashier_txns",
}
