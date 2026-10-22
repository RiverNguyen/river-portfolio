import { getAllPosts } from "@/features/blog/data/posts"
import { getRedis } from "@/lib/redis"

/** Views per post slug in one MGET, or null when Redis isn't configured. */
export async function getAllViews(): Promise<Record<string, number> | null> {
  const redis = getRedis()
  if (!redis) return null

  const slugs = getAllPosts().map((post) => post.slug)
  const counts = await redis.mget<(number | null)[]>(
    ...slugs.map((slug) => `blog:views:${slug}`)
  )
  return Object.fromEntries(slugs.map((slug, i) => [slug, counts[i] ?? 0]))
}
