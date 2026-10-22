import { NextResponse } from "next/server"

import { getAllPosts } from "@/features/blog/data/posts"
import { getClientIp, isRateLimited } from "@/lib/rate-limit"
import { getRedis } from "@/lib/redis"

export const runtime = "nodejs"

const RATE_LIMIT = 60
const RATE_WINDOW_MS = 60_000

// Only count known slugs so arbitrary input can't create Redis keys.
function getSlug(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug")
  return slug && getAllPosts().some((post) => post.slug === slug) ? slug : null
}

export async function GET(request: Request) {
  const slug = getSlug(request)
  if (!slug) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 })
  }

  const redis = getRedis()
  if (!redis) return NextResponse.json({ views: null })

  try {
    const views = (await redis.get<number>(`blog:views:${slug}`)) ?? 0
    return NextResponse.json({ views })
  } catch (error) {
    console.error("[Views] GET error:", error)
    return NextResponse.json({ views: null })
  }
}

export async function POST(request: Request) {
  const slug = getSlug(request)
  if (!slug) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 })
  }

  const ip = getClientIp(request)
  if (await isRateLimited(`views:rate:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const redis = getRedis()
  if (!redis) return NextResponse.json({ views: null })

  try {
    const views = await redis.incr(`blog:views:${slug}`)
    return NextResponse.json({ views })
  } catch (error) {
    console.error("[Views] POST error:", error)
    return NextResponse.json({ views: null })
  }
}
