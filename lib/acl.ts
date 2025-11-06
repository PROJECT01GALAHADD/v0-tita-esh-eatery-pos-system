export type UserRole = "administrator" | "manager" | "cashier_waiter" | "kitchen"

export type AppArea =
  | "dashboard"
  | "data"
  | "warehouse"
  | "pos"
  | "menu"
  | "orders"
  | "cash_registers"

export const areaAllowedRoles: Record<AppArea, UserRole[]> = {
  dashboard: ["administrator", "manager", "cashier_waiter", "kitchen"],
  data: ["administrator", "manager"],
  warehouse: ["administrator", "manager", "kitchen"],
  pos: ["cashier_waiter"],
  menu: ["administrator", "manager", "cashier_waiter", "kitchen"],
  orders: ["administrator", "manager", "cashier_waiter", "kitchen"],
  cash_registers: ["administrator", "manager", "cashier_waiter"],
}

export function hasAccess(user: { role: UserRole } | null | undefined, area: AppArea) {
  return !!user && areaAllowedRoles[area].includes(user.role)
}

// Role helpers for consistent checks across components
export const isAdmin = (role?: UserRole) => role === "administrator"
export const isManager = (role?: UserRole) => role === "manager"
export const isCashierWaiter = (role?: UserRole) => role === "cashier_waiter"
export const isKitchen = (role?: UserRole) => role === "kitchen"

export const canEditOrder = (role?: UserRole) =>
  isCashierWaiter(role) || isAdmin(role) || isManager(role)
