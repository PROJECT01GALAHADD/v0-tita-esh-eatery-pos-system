import { pingMongo } from "@/lib/mongodb"
import { nocodbTables } from "@/lib/nocodb"

export const runtime = "nodejs"

export async function GET() {
  const mongoOk = await pingMongo().then(() => true).catch(() => false)
  const env = {
    NOCO_BASE_URL: !!process.env.NOCO_BASE_URL,
    NOCO_API_TOKEN: !!process.env.NOCO_API_TOKEN,
    NOCO_TABLE_WAITER_OPS: !!process.env.NOCO_TABLE_WAITER_OPS,
    NOCO_TABLE_CHEF_ORDERS: !!process.env.NOCO_TABLE_CHEF_ORDERS,
    NOCO_TABLE_CASHIER_TXNS: !!process.env.NOCO_TABLE_CASHIER_TXNS,
  }
  const configuredTables = Object.entries(nocodbTables).reduce<Record<string, boolean>>((acc, [k, v]) => {
    acc[k] = !!v
    return acc
  }, {})

  return Response.json({ status: "ok", mongoOk, env, configuredTables })
}
