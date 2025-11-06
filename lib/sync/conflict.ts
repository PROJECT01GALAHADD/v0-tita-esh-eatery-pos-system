import type { BaseDoc } from "./models"

export type ConflictPolicy = "last_write_wins" | "source_priority"

const DEFAULT_POLICY: ConflictPolicy = (process.env.SYNC_CONFLICT_POLICY as ConflictPolicy) || "source_priority"

const SOURCE_PRIORITY: Record<string, number> = {
  // Higher number wins on tie or missing timestamps
  nocodb: Number(process.env.SYNC_PRIORITY_NOCO || 2),
  mongo: Number(process.env.SYNC_PRIORITY_MONGO || 1),
}

export function resolveConflict(existing: BaseDoc | null, incoming: BaseDoc): BaseDoc {
  if (!existing) return incoming

  const policy = DEFAULT_POLICY
  const exTs = Date.parse(existing.updatedAt)
  const inTs = Date.parse(incoming.updatedAt)

  if (policy === "last_write_wins") {
    return inTs >= exTs ? incoming : existing
  }

  // source_priority
  const exPr = SOURCE_PRIORITY[String(existing.source || "mongo")] ?? 1
  const inPr = SOURCE_PRIORITY[String(incoming.source || "mongo")] ?? 1

  if (inPr > exPr) return incoming
  if (inPr < exPr) return existing
  // Tie-breaker: timestamp
  return inTs >= exTs ? incoming : existing
}

