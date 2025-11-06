import { nocodbTables, nocodbUpsertByExternalId, nocodbDeleteByExternalId } from "@/lib/nocodb"
import { getMongoClient } from "@/lib/mongodb"
import { collections, type BaseDoc } from "./models"
import { resolveConflict } from "./conflict"

type SyncDirection = "mongo_to_noco" | "noco_to_mongo"

function tablePathFor(collection: keyof typeof collections) {
  const map: Record<string, string | undefined> = {
    waiter_ops: nocodbTables.waiterOps,
    chef_orders: nocodbTables.chefOrders,
    cashier_txns: nocodbTables.cashierTxns,
  }
  return map[collections[collection]]
}

export async function upsertMongo(collection: keyof typeof collections, doc: BaseDoc & Record<string, any>) {
  const client = await getMongoClient()
  const db = client.db()
  await db.collection(collections[collection]).updateOne(
    { externalId: doc.externalId },
    { $set: doc },
    { upsert: true }
  )
}

export async function deleteMongo(collection: keyof typeof collections, externalId: string) {
  const client = await getMongoClient()
  const db = client.db()
  await db.collection(collections[collection]).deleteOne({ externalId })
}

export async function getMongoByExternalId(collection: keyof typeof collections, externalId: string) {
  const client = await getMongoClient()
  const db = client.db()
  return db.collection(collections[collection]).findOne({ externalId })
}

export async function syncFromMongo(
  collection: keyof typeof collections,
  incoming: BaseDoc & Record<string, any>
) {
  // Resolve conflicts against current NocoDB state by reading if needed
  const tablePath = tablePathFor(collection)
  if (!tablePath) throw new Error(`NocoDB table path missing for ${collection}`)

  // Mark source and updatedAt if not present
  const now = new Date().toISOString()
  const doc = { ...incoming, source: incoming.source || "mongo", updatedAt: incoming.updatedAt || now }
  await nocodbUpsertByExternalId(tablePath, doc.externalId, doc)
}

export async function syncFromNoco(
  collection: keyof typeof collections,
  incoming: BaseDoc & Record<string, any>
) {
  const now = new Date().toISOString()
  const inc = { ...incoming, source: incoming.source || "nocodb", updatedAt: incoming.updatedAt || now }
  const existing = (await getMongoByExternalId(collection, inc.externalId)) as BaseDoc | null
  const resolved = resolveConflict(existing, inc)
  await upsertMongo(collection, resolved)
}

export async function deleteSync(
  direction: SyncDirection,
  collection: keyof typeof collections,
  externalId: string
) {
  if (direction === "mongo_to_noco") {
    const tablePath = tablePathFor(collection)
    if (!tablePath) throw new Error(`NocoDB table path missing for ${collection}`)
    await nocodbDeleteByExternalId(tablePath, externalId)
  } else {
    await deleteMongo(collection, externalId)
  }
}

