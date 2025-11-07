import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

type ServerConfig = { kitchenHintsEnabled: boolean; realtimeMonitorEnabled: boolean; source?: string }

export async function GET(_req: NextRequest) {
  const defaultConfig: ServerConfig = {
    kitchenHintsEnabled: true,
    realtimeMonitorEnabled: false,
    source: "default",
  }

  try {
    const supa = getSupabaseServer()
    const { data, error } = await supa.from("app_config").select("key,value")
    if (error) {
      // Table may not exist yet; fall back to defaults
      return NextResponse.json(defaultConfig, { status: 200 })
    }
    const config: ServerConfig = {
      kitchenHintsEnabled: true,
      realtimeMonitorEnabled: false,
      source: "database",
    }
    for (const row of data || []) {
      if (row.key === "kitchenHintsEnabled") config.kitchenHintsEnabled = row.value === true || row.value === "true"
      if (row.key === "realtimeMonitorEnabled") config.realtimeMonitorEnabled = row.value === true || row.value === "true"
    }
    return NextResponse.json(config, { status: 200 })
  } catch {
    // Missing service role env keys or other error; return defaults
    return NextResponse.json(defaultConfig, { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  const role = req.headers.get("x-role") || ""
  if (!["administrator"].includes(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const kitchenHintsEnabled = !!body.kitchenHintsEnabled
  const realtimeMonitorEnabled = !!body.realtimeMonitorEnabled

  try {
    const supa = getSupabaseServer()
    const { error } = await supa
      .from("app_config")
      .upsert([
        { key: "kitchenHintsEnabled", value: kitchenHintsEnabled },
        { key: "realtimeMonitorEnabled", value: realtimeMonitorEnabled },
      ])
    if (error) {
      return NextResponse.json({ error: "not_implemented" }, { status: 501 })
    }
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "not_implemented" }, { status: 501 })
  }
}

