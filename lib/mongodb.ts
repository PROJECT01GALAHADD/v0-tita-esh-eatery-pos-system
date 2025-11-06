import { MongoClient } from "mongodb"
import { attachDatabasePool } from "@vercel/functions"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Missing MONGODB_URI. Set it in environment variables.")
}

// Reuse the client across hot reloads in development
let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    // Attach pooling for local dev parity with serverless behavior
    try { attachDatabasePool(client) } catch {}
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise!
} else {
  client = new MongoClient(uri)
  // Ensure pooled connections across Vercel function invocations
  try { attachDatabasePool(client) } catch {}
  clientPromise = client.connect()
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise
}

export async function pingMongo(): Promise<{ ok: boolean; error?: string }> {
  try {
    const c = await getMongoClient()
    await c.db("admin").command({ ping: 1 })
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, error: msg }
  }
}

export async function getDb(dbName?: string) {
  const c = await getMongoClient()
  return c.db(dbName)
}
