import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    const { data: categories, error: catErr } = await supabase
      .from("categories")
      .select("id, name")
      .order("name", { ascending: true })

    if (catErr) {
      return NextResponse.json({ error: catErr.message }, { status: 500 })
    }

    const { data: items, error: itemsErr } = await supabase
      .from("menu_items")
      .select("id, name, price, is_available, category_id")
      .order("name", { ascending: true })

    if (itemsErr) {
      return NextResponse.json({ error: itemsErr.message }, { status: 500 })
    }

    const categoryMap = new Map((categories ?? []).map((c) => [c.id, c.name]))

    const enriched = (items ?? []).map((i) => ({
      id: i.id,
      name: i.name,
      description: "",
      price: i.price ?? 0,
      isAvailable: !!i.is_available,
      category: categoryMap.get(i.category_id) ?? "Uncategorized",
      // Demo defaults for UI-only fields
      preparationTime: 10,
      rating: 4.4,
      isPopular: false,
      image: "/placeholder.svg",
    }))

    return NextResponse.json({ categories: categories ?? [], items: enriched })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServer()
    const body = await req.json()
    const name: string = body?.name
    const price: number = body?.price
    const categoryName: string = body?.category
    const is_available: boolean = body?.is_available ?? true
    if (!name || typeof price !== "number" || !categoryName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    // Ensure category exists or create it
    const { data: catExisting, error: catSelErr } = await supabase
      .from("categories")
      .select("id")
      .eq("name", categoryName)
      .limit(1)
    if (catSelErr) return NextResponse.json({ error: catSelErr.message }, { status: 500 })
    let category_id = catExisting?.[0]?.id
    if (!category_id) {
      const { data: catCreated, error: catInsErr } = await supabase
        .from("categories")
        .insert({ name: categoryName })
        .select("id")
        .single()
      if (catInsErr) return NextResponse.json({ error: catInsErr.message }, { status: 500 })
      category_id = catCreated?.id
    }
    const { data: item, error: itemErr } = await supabase
      .from("menu_items")
      .insert({ name, price, category_id, is_available })
      .select("id, name, price, is_available, category_id")
      .single()
    if (itemErr) return NextResponse.json({ error: itemErr.message }, { status: 500 })
    return NextResponse.json({ id: item.id })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 })
  }
}
