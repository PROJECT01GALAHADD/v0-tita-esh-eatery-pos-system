import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

type PatchBody = {
  is_available?: boolean
  price?: number
}

export async function PATCH(req: Request, { params }: any) {
  try {
    const id = params.id
    const body = (await req.json()) as PatchBody
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    if (typeof body !== "object" || (!("is_available" in body) && !("price" in body))) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const updates: Record<string, any> = {}
    if (body.is_available !== undefined) updates.is_available = body.is_available
    if (body.price !== undefined) updates.price = body.price

    const supabase = getSupabaseServer()
    const { error } = await supabase
      .from("menu_items")
      .update(updates)
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 })
  }
}
