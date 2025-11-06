import { NextRequest } from "next/server"
import { syncFromMongo, deleteSync } from "@/lib/sync/service"
import { collections } from "@/lib/sync/models"

export const runtime = "nodejs"

type ChangePayload = {
  collection: keyof typeof collections
  operation: "insert" | "update" | "delete"
  document?: any
  externalId?: string
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as ChangePayload
    if (!payload?.collection || !payload?.operation) {
      return Response.json({ error: "Invalid payload" }, { status: 400 })
    }
    if (payload.operation === "delete") {
      if (!payload.externalId) return Response.json({ error: "externalId required" }, { status: 400 })
      await deleteSync("mongo_to_noco", payload.collection, payload.externalId)
      return Response.json({ status: "ok" })
    }
    if (!payload.document?.externalId) {
      return Response.json({ error: "document.externalId required" }, { status: 400 })
    }
    await syncFromMongo(payload.collection, payload.document)
    return Response.json({ status: "ok" })
  } catch (err: any) {
    return Response.json({ error: err?.message || String(err) }, { status: 500 })
  }
}

