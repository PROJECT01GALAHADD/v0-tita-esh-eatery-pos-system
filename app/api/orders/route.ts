import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

type OrderItemInput = { menu_item_id: string; quantity: number }
type CreateOrderBody = {
  total_amount: number
  items?: OrderItemInput[]
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateOrderBody
    if (typeof body?.total_amount !== "number") {
      return NextResponse.json({ error: "Missing total_amount" }, { status: 400 })
    }
    const items = Array.isArray(body.items) ? body.items.filter((i) => i && typeof i.menu_item_id === "string" && Number(i.quantity) > 0) : []

    const supabase = getSupabaseServer()

    // Fetch unit prices for items if provided
    const itemIds = items.map((i) => i.menu_item_id)
    let priceMap = new Map<string, number>()
    if (itemIds.length > 0) {
      const { data: mi, error: miErr } = await supabase
        .from("menu_items")
        .select("id, price")
        .in("id", itemIds)
      if (miErr) return NextResponse.json({ error: miErr.message }, { status: 500 })
      priceMap = new Map((mi || []).map((m: any) => [m.id as string, Number(m.price ?? 0)]))
    }

    // Create the order in paid status
    const order_number = `ORD-${Date.now()}`
    const { data: orderRow, error: orderErr } = await supabase
      .from("orders")
      .insert({ order_number, total_amount: body.total_amount, status: "paid" })
      .select("id, order_number")
      .single()
    if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 })

    // Insert order_items if provided
    if (items.length > 0 && orderRow?.id) {
      const orderItemsPayload = items.map((i) => ({
        order_id: orderRow.id as string,
        menu_item_id: i.menu_item_id,
        quantity: Math.max(1, Math.floor(Number(i.quantity))),
        unit_price: priceMap.get(i.menu_item_id) ?? 0,
      }))
      const { error: oiErr } = await supabase.from("order_items").insert(orderItemsPayload)
      if (oiErr) {
        // If line item insert fails, return error to keep state consistent
        return NextResponse.json({ error: oiErr.message }, { status: 500 })
      }

      // Safe stock auto-deduction based on recipes
      try {
        // Find recipes for the ordered menu items
        const { data: recipes, error: recErr } = await supabase
          .from("recipes")
          .select("id, menu_item_id")
          .in("menu_item_id", itemIds.length ? itemIds : ["00000000-0000-0000-0000-000000000000"]) // safe when empty
        if (recErr) throw new Error(recErr.message)

        const recipeIdByMenu = new Map<string, string>()
        for (const r of recipes || []) {
          recipeIdByMenu.set(r.menu_item_id as string, r.id as string)
        }

        const recipeIds = Array.from(new Set((recipes || []).map((r: any) => r.id as string)))
        if (recipeIds.length > 0) {
          const { data: ingreds, error: ingErr } = await supabase
            .from("recipe_ingredients")
            .select("recipe_id, product_id, quantity")
            .in("recipe_id", recipeIds)
          if (ingErr) throw new Error(ingErr.message)

          // Compute required quantities per warehouse product
          const requiredByProduct = new Map<string, number>()
          for (const i of items) {
            const rId = recipeIdByMenu.get(i.menu_item_id)
            if (!rId) continue
            const relevant = (ingreds || []).filter((ing: any) => (ing.recipe_id as string) === rId)
            for (const ing of relevant) {
              const prodId = ing.product_id as string
              const perItemQty = Number(ing.quantity ?? 0)
              const addQty = Number(i.quantity) * perItemQty
              requiredByProduct.set(prodId, Number((requiredByProduct.get(prodId) || 0) + addQty))
            }
          }

          const productIds = Array.from(requiredByProduct.keys())
          if (productIds.length > 0) {
            // Fetch current stock
            const { data: products, error: prodErr } = await supabase
              .from("warehouse_products")
              .select("id, stock")
              .in("id", productIds)
            if (prodErr) throw new Error(prodErr.message)

            const stockMap = new Map((products || []).map((p: any) => [p.id as string, Number(p.stock ?? 0)]))
            // Apply deductions with clamp at 0
            for (const pid of productIds) {
              const current = stockMap.get(pid) ?? 0
              const deduct = requiredByProduct.get(pid) ?? 0
              const newStock = Math.max(0, Number((current - deduct).toFixed(2)))
              // Update each product stock
              const { error: upErr } = await supabase
                .from("warehouse_products")
                .update({ stock: newStock })
                .eq("id", pid)
              if (upErr) {
                // Log and continue; keep order intact
                console.error("Inventory update failed", pid, upErr.message)
              }
            }
          }
        }
      } catch (invErr: any) {
        // Keep order success even if inventory adjustment fails
        console.error("Inventory deduction error:", invErr?.message || invErr)
      }
    }

    return NextResponse.json({ id: orderRow?.id, order_number: orderRow?.order_number })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 })
  }
}
