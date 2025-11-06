import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"
import { verifyPassword } from "@/lib/utils/password"

type LoginBody = {
  username: string
  password: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody
    if (!body?.username || !body?.password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
    }

    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from("users")
      .select("id, username, name, role, password")
      .eq("username", body.username)
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    const passwordValid = data.password ? verifyPassword(body.password, data.password) : false
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    const user = { id: data.id, username: data.username, name: data.name, role: data.role }
    return NextResponse.json({ user })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 })
  }
}
