import { getRedis } from "@/lib/redis"

import type { GuestbookUser } from "./session"

export type GuestbookEntry = GuestbookUser & {
  id: string
  message: string
  createdAt: string
}

const KEY = "guestbook:entries"
const MAX_STORED = 500
const MAX_SHOWN = 100

export async function getEntries(): Promise<GuestbookEntry[] | null> {
  const redis = getRedis()
  if (!redis) return null
  // Upstash auto-parses JSON members.
  return redis.lrange<GuestbookEntry>(KEY, 0, MAX_SHOWN - 1)
}

export async function addEntry(entry: GuestbookEntry) {
  const redis = getRedis()
  if (!redis) throw new Error("Redis is not configured")
  await redis
    .pipeline()
    .lpush(KEY, entry)
    .ltrim(KEY, 0, MAX_STORED - 1)
    .exec()
}

export async function deleteEntry(id: string) {
  const redis = getRedis()
  if (!redis) return false
  const entries = await redis.lrange<GuestbookEntry>(KEY, 0, -1)
  const entry = entries.find((item) => item.id === id)
  if (!entry) return false
  await redis.lrem(KEY, 1, entry)
  return true
}
