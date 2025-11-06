import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

type CreateUserBody = {
  username: string
  name: string
  role: "manager" | "cashier_waiter" | "kitchen"
  password?: string
}

export async function GET() {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from("users")
      .select("id, username, name, role, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ users: data ?? [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateUserBody
    if (!body?.username || !body?.name || !body?.role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    if (!( ["manager", "cashier_waiter", "kitchen"] as const ).includes(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from("users")
      .insert({
        username: body.username,
        name: body.name,
        role: body.role,
        password: body.password ?? null,
      })
      .select("id")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ id: data?.id })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 })
  }
}
