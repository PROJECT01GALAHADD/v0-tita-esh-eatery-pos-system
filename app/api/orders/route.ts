import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

type CreateOrderBody = {
  total_amount: number
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateOrderBody
    if (typeof body?.total_amount !== "number") {
      return NextResponse.json({ error: "Missing total_amount" }, { status: 400 })
    }
    const order_number = `ORD-${Date.now()}`
    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from("orders")
      .insert({ order_number, total_amount: body.total_amount, status: "paid" })
      .select("id, order_number")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ id: data?.id, order_number: data?.order_number })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 })
  }
}

