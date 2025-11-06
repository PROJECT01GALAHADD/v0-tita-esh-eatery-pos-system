import { nocodbMcpPing } from "@/lib/nocodb"

export const runtime = "nodejs"

export async function GET() {
  const mcp = await nocodbMcpPing()
  const env = {
    NOCO_MCP_BASE_URL: !!process.env.NOCO_MCP_BASE_URL,
    NOCO_MCP_TOKEN: !!process.env.NOCO_MCP_TOKEN,
    NOCO_BASE_ID: process.env.NOCO_BASE_ID || null,
  }
  if (mcp.ok) {
    return Response.json({ status: "ok", mcp, env })
  }
  return new Response(
    JSON.stringify({ status: "error", mcp, env }),
    { status: 500, headers: { "content-type": "application/json" } }
  )
}

