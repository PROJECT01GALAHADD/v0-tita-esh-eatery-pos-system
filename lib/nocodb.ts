const baseUrl = process.env.NOCO_BASE_URL
const apiToken = process.env.NOCO_API_TOKEN
const mcpBaseUrl = process.env.NOCO_MCP_BASE_URL
const mcpToken = process.env.NOCO_MCP_TOKEN
export const nocodbBaseId = process.env.NOCO_BASE_ID

if (!baseUrl || !apiToken) {
  // Keep it non-throwing to avoid breaking builds; routes will return errors if misconfigured
  console.warn("NocoDB is not fully configured: set NOCO_BASE_URL and NOCO_API_TOKEN")
}

export async function nocodbMcpRequest(path: string = "", init: RequestInit = {}) {
  if (!mcpBaseUrl || !mcpToken) throw new Error("NocoDB MCP configuration missing")
  const headers = {
    "content-type": "application/json",
    "xc-mcp-token": mcpToken,
    ...(init.headers || {}),
  }
  const url = new URL(path || "", mcpBaseUrl)
  const res = await fetch(url.toString(), { ...init, headers })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(`NocoDB MCP error ${res.status}: ${msg}`)
  }
  const ct = res.headers.get("content-type") || ""
  return ct.includes("application/json") ? res.json() : res.text()
}

export async function nocodbMcpPing() {
  try {
    // A simple GET to the MCP base URL to validate token/auth; path may be empty
    const res = await nocodbMcpRequest("")
    return { ok: true, info: res }
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err) }
  }
}

async function nocodbRequest(path: string, init: RequestInit & { query?: Record<string, string | number | boolean> } = {}) {
  if (!baseUrl || !apiToken) {
    throw new Error("NocoDB configuration missing")
  }
  const headers = {
    "content-type": "application/json",
    "xc-auth": apiToken,
    ...(init.headers || {}),
  }
  const url = new URL(path, baseUrl)
  if (init.query) {
    Object.entries(init.query).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  }
  const res = await fetch(url.toString(), { ...init, headers })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(`NocoDB error ${res.status}: ${msg}`)
  }
  const ct = res.headers.get("content-type") || ""
  return ct.includes("application/json") ? res.json() : res.text()
}

export async function nocodbGetByExternalId(tablePath: string, externalId: string) {
  // Many NocoDB setups use a column named externalId; adjust via view/filter
  return nocodbRequest(`${tablePath}/rows`, { query: { where: `externalId.eq.${externalId}` } })
}

export async function nocodbCreateRow(tablePath: string, data: Record<string, any>) {
  return nocodbRequest(`${tablePath}/rows`, { method: "POST", body: JSON.stringify(data) })
}

export async function nocodbUpdateRow(tablePath: string, rowId: string | number, data: Record<string, any>) {
  return nocodbRequest(`${tablePath}/rows/${rowId}`, { method: "PATCH", body: JSON.stringify(data) })
}

export async function nocodbUpsertByExternalId(tablePath: string, externalId: string, data: Record<string, any>) {
  const list: any = await nocodbGetByExternalId(tablePath, externalId)
  const rows = Array.isArray(list) ? list : list?.list || []
  if (rows.length > 0) {
    const row = rows[0]
    return nocodbUpdateRow(tablePath, row.id ?? row._id ?? row.row_id, data)
  }
  return nocodbCreateRow(tablePath, { externalId, ...data })
}

export async function nocodbDeleteByExternalId(tablePath: string, externalId: string) {
  const list: any = await nocodbGetByExternalId(tablePath, externalId)
  const rows = Array.isArray(list) ? list : list?.list || []
  if (rows.length === 0) return { deleted: 0 }
  const row = rows[0]
  await nocodbRequest(`${tablePath}/rows/${row.id ?? row._id ?? row.row_id}`, { method: "DELETE" })
  return { deleted: 1 }
}

export const nocodbTables = {
  waiterOps: process.env.NOCO_TABLE_WAITER_OPS, // e.g. /api/v2/tables/{tableId}
  chefOrders: process.env.NOCO_TABLE_CHEF_ORDERS,
  cashierTxns: process.env.NOCO_TABLE_CASHIER_TXNS,
}
