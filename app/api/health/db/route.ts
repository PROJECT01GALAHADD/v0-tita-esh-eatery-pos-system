import { getSupabaseServer } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check Supabase connection by querying a simple table
    const supabase = getSupabaseServer()
    const { error } = await supabase.from("users").select("id").limit(1)

    if (error) {
      return NextResponse.json(
        { status: "error", service: "supabase", connected: false, error: error.message },
        { status: 500 },
      )
    }

    return NextResponse.json({ status: "ok", service: "supabase", connected: true })
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", service: "supabase", connected: false, error: err?.message || "Unknown error" },
      { status: 500 },
    )
  }
}
