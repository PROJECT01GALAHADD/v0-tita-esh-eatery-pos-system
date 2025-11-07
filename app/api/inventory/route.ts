import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from("warehouse_products")
      .select("id, name, unit, stock, min_stock, max_stock, created_at")
      .order("name", { ascending: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const enriched = (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      unit: p.unit,
      stock: Number(p.stock ?? 0),
      minStock: Number(p.min_stock ?? 0),
      maxStock: Number(p.max_stock ?? 0),
      lowStock: Number(p.stock ?? 0) < Number(p.min_stock ?? 0),
      createdAt: p.created_at,
    }))
    return NextResponse.json({ products: enriched })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 })
  }
}

