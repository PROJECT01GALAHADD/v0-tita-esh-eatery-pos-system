export const categories = [
  "All",
  "All Time Favorite (Short Orders)",
  "Silog Meals",
  "Busog Meals (with Glass of Iced Tea)",
  "Rice Meal",
  "Add On",
  "Salo-Salo Meals (with 1.5L Softdrinks)",
  "Combo Plates",
  "Soup",
  "Snacks",
  "Desserts",
] as const

export type Category = (typeof categories)[number]

export const products = [
  // All Time Favorite (Short Orders)
  { id: "p001", name: "Pansit bihon", price: 120, image: "/placeholder.jpg", category: "All Time Favorite (Short Orders)" },
  { id: "p002", name: "Pansit canton", price: 150, image: "/placeholder.jpg", category: "All Time Favorite (Short Orders)" },
  { id: "p003", name: "Pansit mix", price: 150, image: "/placeholder.jpg", category: "All Time Favorite (Short Orders)" },
  { id: "p004", name: "Palabok", price: 130, image: "/placeholder.jpg", category: "All Time Favorite (Short Orders)" },
  { id: "p005", name: "Spaghetti", price: 130, image: "/placeholder.jpg", category: "All Time Favorite (Short Orders)" },
  { id: "p006", name: "Carbonara", price: 130, image: "/placeholder.jpg", category: "All Time Favorite (Short Orders)" },
  { id: "p007", name: "Pork Lomi", price: 130, image: "/placeholder.jpg", category: "All Time Favorite (Short Orders)" },
  { id: "p008", name: "Mami beef", price: 120, image: "/placeholder.jpg", category: "All Time Favorite (Short Orders)" },
  { id: "p009", name: "Mami chicken", price: 120, image: "/placeholder.jpg", category: "All Time Favorite (Short Orders)" },

  // Silog Meals
  { id: "p010", name: "Tapsilog", price: 150, image: "/placeholder.jpg", category: "Silog Meals" },
  { id: "p011", name: "Porksilog", price: 150, image: "/placeholder.jpg", category: "Silog Meals" },
  { id: "p012", name: "Chicksilog", price: 150, image: "/placeholder.jpg", category: "Silog Meals" },
  { id: "p013", name: "Tosilog", price: 130, image: "/placeholder.jpg", category: "Silog Meals" },
  { id: "p014", name: "Longsilog", price: 130, image: "/placeholder.jpg", category: "Silog Meals" },
  { id: "p015", name: "Bangsilog", price: 130, image: "/placeholder.jpg", category: "Silog Meals" },
  { id: "p016", name: "Cornedsilog", price: 100, image: "/placeholder.jpg", category: "Silog Meals" },
  { id: "p017", name: "Hotsilog", price: 100, image: "/placeholder.jpg", category: "Silog Meals" },
  { id: "p018", name: "Dangsilog", price: 130, image: "/placeholder.jpg", category: "Silog Meals" },
  { id: "p019", name: "Adobosilog", price: 150, image: "/placeholder.jpg", category: "Silog Meals" },
  { id: "p020", name: "Lechonsilog", price: 150, image: "/placeholder.jpg", category: "Silog Meals" },

  // Busog Meals (with Glass of Iced Tea)
  { id: "p021", name: "BM1: rice, shanghai, chicken", price: 180, image: "/placeholder.jpg", category: "Busog Meals (with Glass of Iced Tea)" },
  { id: "p022", name: "BM2: spaghetti, chicken, rice", price: 180, image: "/placeholder.jpg", category: "Busog Meals (with Glass of Iced Tea)" },
  { id: "p023", name: "BM3: spaghetti, chicken, fries", price: 180, image: "/placeholder.jpg", category: "Busog Meals (with Glass of Iced Tea)" },
  { id: "p024", name: "BM4: pizza, chicken, spaghetti", price: 180, image: "/placeholder.jpg", category: "Busog Meals (with Glass of Iced Tea)" },
  { id: "p025", name: "BM5: palabok, chicken, rice", price: 180, image: "/placeholder.jpg", category: "Busog Meals (with Glass of Iced Tea)" },
  { id: "p026", name: "BM6: carbonara, garlic bread, fries", price: 180, image: "/placeholder.jpg", category: "Busog Meals (with Glass of Iced Tea)" },
  { id: "p027", name: "BM7: spaghetti, cheeseburger", price: 180, image: "/placeholder.jpg", category: "Busog Meals (with Glass of Iced Tea)" },
  { id: "p028", name: "BM8: fries, cheeseburger", price: 180, image: "/crispy-french-fries.png", category: "Busog Meals (with Glass of Iced Tea)" },
  { id: "p029", name: "BM9: fries, 2 pcs chicken", price: 180, image: "/placeholder.jpg", category: "Busog Meals (with Glass of Iced Tea)" },
  { id: "p030", name: "BM10: 2 pcs shanghai, bihon, bread", price: 150, image: "/placeholder.jpg", category: "Busog Meals (with Glass of Iced Tea)" },

  // Rice Meal
  { id: "p031", name: "Burgersteak", price: 150, image: "/placeholder.jpg", category: "Rice Meal" },
  { id: "p032", name: "Shanghai (4 pcs) with rice", price: 150, image: "/placeholder.jpg", category: "Rice Meal" },
  { id: "p033", name: "Chaopan with shanghai (4 pcs)", price: 150, image: "/placeholder.jpg", category: "Rice Meal" },
  { id: "p034", name: "Chaopan with siomai (4 pcs)", price: 150, image: "/placeholder.jpg", category: "Rice Meal" },
  { id: "p035", name: "Chaopan with spam (2 pcs)", price: 150, image: "/placeholder.jpg", category: "Rice Meal" },
  { id: "p036", name: "2 pcs Chicken with rice", price: 180, image: "/placeholder.jpg", category: "Rice Meal" },

  // Add On
  { id: "p037", name: "Plain rice", price: 25, image: "/placeholder.jpg", category: "Add On" },
  { id: "p038", name: "Garlic rice", price: 35, image: "/placeholder.jpg", category: "Add On" },
  { id: "p039", name: "Egg", price: 25, image: "/placeholder.jpg", category: "Add On" },
  { id: "p040", name: "Cheese", price: 45, image: "/placeholder.jpg", category: "Add On" },

  // Salo-Salo Meals (with 1.5L Softdrinks)
  { id: "p041", name: "SSM1: 3 pcs burger, 3 pcs chicken, fries", price: 650, image: "/placeholder.jpg", category: "Salo-Salo Meals (with 1.5L Softdrinks)" },
  { id: "p042", name: "SSM2: 2 order pancit bihon, 12 pcs shanghai, 1 platter plain rice", price: 650, image: "/placeholder.jpg", category: "Salo-Salo Meals (with 1.5L Softdrinks)" },
  { id: "p043", name: "SSM3: 4 pcs chicken, 8 pcs shanghai, 1 platter plain rice", price: 650, image: "/placeholder.jpg", category: "Salo-Salo Meals (with 1.5L Softdrinks)" },
  { id: "p044", name: "SSM4: 10 pcs shanghai, 10 pcs siomai, 1 platter chaopan", price: 650, image: "/placeholder.jpg", category: "Salo-Salo Meals (with 1.5L Softdrinks)" },

  // Combo Plates
  { id: "p045", name: "Bihon with chicken", price: 180, image: "/placeholder.jpg", category: "Combo Plates" },
  { id: "p046", name: "Canton with chicken", price: 180, image: "/placeholder.jpg", category: "Combo Plates" },
  { id: "p047", name: "Pancit mix with chicken", price: 180, image: "/placeholder.jpg", category: "Combo Plates" },
  { id: "p048", name: "Palabok with chicken", price: 180, image: "/placeholder.jpg", category: "Combo Plates" },
  { id: "p049", name: "Spaghetti with chicken", price: 180, image: "/placeholder.jpg", category: "Combo Plates" },
  { id: "p050", name: "Carbonara with chicken", price: 180, image: "/placeholder.jpg", category: "Combo Plates" },

  // Soup
  { id: "p051", name: "Crab & corn", price: 150, image: "/placeholder.jpg", category: "Soup" },
  { id: "p052", name: "Nido soup", price: 150, image: "/placeholder.jpg", category: "Soup" },
  { id: "p053", name: "Cream of mushroom", price: 150, image: "/placeholder.jpg", category: "Soup" },

  // Snacks
  { id: "p054", name: "Clubhouse", price: 100, image: "/placeholder.jpg", category: "Snacks" },
  { id: "p055", name: "Cheeseburger", price: 100, image: "/classic-beef-burger.png", category: "Snacks" },
  { id: "p056", name: "Hamburger", price: 90, image: "/classic-beef-burger.png", category: "Snacks" },
  { id: "p057", name: "Ham & cheese", price: 70, image: "/placeholder.jpg", category: "Snacks" },
  { id: "p058", name: "Tuna sandwich", price: 70, image: "/placeholder.jpg", category: "Snacks" },
  { id: "p059", name: "Chicken sandwich", price: 70, image: "/placeholder.jpg", category: "Snacks" },
  { id: "p060", name: "Egg sandwich", price: 60, image: "/placeholder.jpg", category: "Snacks" },
  { id: "p061", name: "French fries", price: 120, image: "/crispy-french-fries.png", category: "Snacks" },

  // Desserts
  { id: "p062", name: "Halo-halo", price: 110, image: "/placeholder.jpg", category: "Desserts" },
  { id: "p063", name: "Mais con yelo", price: 90, image: "/placeholder.jpg", category: "Desserts" },
  { id: "p064", name: "Banana con yelo", price: 90, image: "/placeholder.jpg", category: "Desserts" },
  { id: "p065", name: "Special halo-halo", price: 140, image: "/placeholder.jpg", category: "Desserts" },
  { id: "p066", name: "Ube macapuno", price: 140, image: "/placeholder.jpg", category: "Desserts" },
] as const
