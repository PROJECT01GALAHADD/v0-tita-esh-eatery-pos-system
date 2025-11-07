import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    const { data: recipes, error: recErr } = await supabase
      .from("recipes")
      .select("id, menu_item_id")
    if (recErr) return NextResponse.json({ error: recErr.message }, { status: 500 })

    const recipeIds = (recipes || []).map((r: any) => r.id)
    const menuItemIds = (recipes || []).map((r: any) => r.menu_item_id)

    const { data: ingreds, error: ingErr } = await supabase
      .from("recipe_ingredients")
      .select("id, recipe_id, product_id, quantity")
      .in("recipe_id", recipeIds.length ? recipeIds : ["00000000-0000-0000-0000-000000000000"]) // ensures no error when empty
    if (ingErr) return NextResponse.json({ error: ingErr.message }, { status: 500 })

    const { data: products, error: prodErr } = await supabase
      .from("warehouse_products")
      .select("id, name, unit")
    if (prodErr) return NextResponse.json({ error: prodErr.message }, { status: 500 })
    const prodMap = new Map((products || []).map((p: any) => [p.id as string, { name: p.name as string, unit: p.unit as string }]))

    const { data: menu, error: menuErr } = await supabase
      .from("menu_items")
      .select("id, name")
      .in("id", menuItemIds.length ? menuItemIds : ["00000000-0000-0000-0000-000000000000"])
    if (menuErr) return NextResponse.json({ error: menuErr.message }, { status: 500 })
    const menuMap = new Map((menu || []).map((m: any) => [m.id as string, m.name as string]))

    const byRecipe = new Map<string, any[]>()
    for (const ing of ingreds || []) {
      const arr = byRecipe.get(ing.recipe_id as string) || []
      arr.push(ing)
      byRecipe.set(ing.recipe_id as string, arr)
    }

    const result = (recipes || []).map((r: any) => ({
      recipeId: r.id as string,
      menuItemId: r.menu_item_id as string,
      menuItemName: menuMap.get(r.menu_item_id as string) || "Unknown",
      ingredients: (byRecipe.get(r.id as string) || []).map((ing: any) => ({
        id: ing.id as string,
        productId: ing.product_id as string,
        productName: prodMap.get(ing.product_id as string)?.name || "Unknown",
        unit: prodMap.get(ing.product_id as string)?.unit || "",
        quantity: Number(ing.quantity ?? 0),
      })),
    }))

    return NextResponse.json({ recipes: result })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 })
  }
}

