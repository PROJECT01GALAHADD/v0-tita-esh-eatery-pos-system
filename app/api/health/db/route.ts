import { pingMongo } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  const result = await pingMongo()
  if (result.ok) {
    return NextResponse.json({ status: "ok", service: "mongodb", connected: true })
  }
  return NextResponse.json(
    { status: "error", service: "mongodb", connected: false, error: result.error },
    { status: 500 }
  )
}
