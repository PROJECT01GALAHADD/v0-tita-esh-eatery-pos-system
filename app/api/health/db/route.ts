import { pingMongo } from "@/lib/mongodb"

export async function GET() {
  const result = await pingMongo()
  if (result.ok) {
    return Response.json({ status: "ok", service: "mongodb", connected: true })
  }
  return new Response(
    JSON.stringify({ status: "error", service: "mongodb", connected: false, error: result.error }),
    { status: 500, headers: { "content-type": "application/json" } }
  )
}

