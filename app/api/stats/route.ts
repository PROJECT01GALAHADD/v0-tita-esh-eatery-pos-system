import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    // Orders count
    const { count: ordersCount, error: ordersCountErr } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
    if (ordersCountErr) return NextResponse.json({ error: ordersCountErr.message }, { status: 500 })

    // Revenue (sum of total_amount for paid orders)
    const { data: orders, error: ordersErr } = await supabase
      .from("orders")
      .select("total_amount, status")
    if (ordersErr) return NextResponse.json({ error: ordersErr.message }, { status: 500 })
    const totalRevenue = (orders || [])
      .filter((o: any) => (o.status ?? "") === "paid")
      .reduce((sum: number, o: any) => sum + Number(o.total_amount ?? 0), 0)

    // Active waiters count
    const { count: waitersCount, error: waitersErr } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("role", "cashier_waiter")
    if (waitersErr) return NextResponse.json({ error: waitersErr.message }, { status: 500 })

    return NextResponse.json({
      totalOrders: ordersCount ?? 0,
      totalRevenue,
      activeWaiters: waitersCount ?? 0,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 })
  }
}
