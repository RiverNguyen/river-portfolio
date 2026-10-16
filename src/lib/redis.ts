import { Redis } from "@upstash/redis"

let redisClient: Redis | null | undefined

/** Shared Upstash client, or null when credentials are not configured. */
export function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient

  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN

  redisClient = url && token ? new Redis({ url, token }) : null
  return redisClient
}
