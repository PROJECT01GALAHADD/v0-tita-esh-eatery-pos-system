import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    const { count: ordersCount, error: ordersCountErr } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
    if (ordersCountErr) return NextResponse.json({ error: ordersCountErr.message }, { status: 500 })

    const { data: paidOrders, error: paidErr } = await supabase
      .from("orders")
      .select("total_amount, created_at")
      .eq("status", "paid")
    if (paidErr) return NextResponse.json({ error: paidErr.message }, { status: 500 })

    const totalRevenue = (paidOrders || []).reduce((sum: number, o: any) => sum + Number(o.total_amount ?? 0), 0)
    const paidCount = (paidOrders || []).length
    const avgOrderValue = paidCount > 0 ? Number((totalRevenue / paidCount).toFixed(2)) : 0

    // Revenue by day (last 30 days)
    const today = new Date()
    const cutoff = new Date(today)
    cutoff.setDate(today.getDate() - 30)
    const byDayMap = new Map<string, number>()
    for (const o of paidOrders || []) {
      const d = new Date(o.created_at)
      if (d < cutoff) continue
      const key = d.toISOString().slice(0, 10)
      byDayMap.set(key, (byDayMap.get(key) || 0) + Number(o.total_amount ?? 0))
    }
    const revenueByDay = Array.from(byDayMap.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([date, revenue]) => ({ date, revenue }))

    // Top items by quantity
    const { data: items, error: itemsErr } = await supabase
      .from("order_items")
      .select("menu_item_id, quantity")
    if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 })
    const qtyByItem = new Map<string, number>()
    for (const it of items || []) {
      const id = it.menu_item_id as string
      qtyByItem.set(id, (qtyByItem.get(id) || 0) + Number(it.quantity ?? 0))
    }
    const topItemIds = Array.from(qtyByItem.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => id)
    let topItems: Array<{ id: string; name: string; quantity: number }> = []
    if (topItemIds.length > 0) {
      const { data: mi, error: miErr } = await supabase
        .from("menu_items")
        .select("id, name")
        .in("id", topItemIds)
      if (miErr) return NextResponse.json({ error: miErr.message }, { status: 500 })
      const nameMap = new Map((mi || []).map((m: any) => [m.id as string, m.name as string]))
      topItems = Array.from(qtyByItem.entries())
        .filter(([id]) => topItemIds.includes(id))
        .map(([id, qty]) => ({ id, name: nameMap.get(id) || "Unknown", quantity: qty }))
        .sort((a, b) => b.quantity - a.quantity)
    }

    return NextResponse.json({
      totalOrders: ordersCount ?? 0,
      totalRevenue,
      avgOrderValue,
      revenueByDay,
      topItems,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 })
  }
}

