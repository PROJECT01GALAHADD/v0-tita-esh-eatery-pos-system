import { NextRequest } from "next/server"
import { syncFromNoco, deleteSync } from "@/lib/sync/service"
import { collections } from "@/lib/sync/models"

export const runtime = "nodejs"

type NocoWebhook = {
  table: keyof typeof collections
  event: "row.created" | "row.updated" | "row.deleted"
  data?: any
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as NocoWebhook
    if (!payload?.table || !payload?.event) {
      return Response.json({ error: "Invalid payload" }, { status: 400 })
    }
    if (payload.event === "row.deleted") {
      const externalId = String(payload?.data?.externalId || "")
      if (!externalId) return Response.json({ error: "externalId required" }, { status: 400 })
      await deleteSync("noco_to_mongo", payload.table, externalId)
      return Response.json({ status: "ok" })
    }
    const doc = payload.data
    if (!doc?.externalId) {
      return Response.json({ error: "data.externalId required" }, { status: 400 })
    }
    await syncFromNoco(payload.table, doc)
    return Response.json({ status: "ok" })
  } catch (err: any) {
    return Response.json({ error: err?.message || String(err) }, { status: 500 })
  }
}

