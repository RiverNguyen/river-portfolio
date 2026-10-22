import { getRedis } from "@/lib/redis"

const buckets = new Map<string, { count: number; resetAt: number }>()

export function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown"
  return req.headers.get("x-real-ip") || "unknown"
}

// Shared across serverless instances when Upstash is configured; per-instance memory otherwise.
export async function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
) {
  const redis = getRedis()
  if (redis) {
    try {
      const count = await redis.incr(key)
      if (count === 1) await redis.pexpire(key, windowMs)
      return count > limit
    } catch (err) {
      console.error("[rate-limit] Redis failed", err)
    }
  }

  const now = Date.now()
  const current = buckets.get(key)
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }
  if (current.count >= limit) return true
  current.count += 1
  return false
}
