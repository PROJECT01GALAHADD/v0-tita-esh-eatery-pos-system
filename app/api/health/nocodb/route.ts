import { nocodbMcpPing } from "@/lib/nocodb"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  const mcp = await nocodbMcpPing()
  const env = {
    NOCO_MCP_BASE_URL: !!process.env.NOCO_MCP_BASE_URL,
    NOCO_MCP_TOKEN: !!process.env.NOCO_MCP_TOKEN,
    NOCO_BASE_ID: process.env.NOCO_BASE_ID || null,
  }
  if (mcp.ok) {
    return NextResponse.json({ status: "ok", mcp, env })
  }
  return NextResponse.json({ status: "error", mcp, env }, { status: 500 })
}
