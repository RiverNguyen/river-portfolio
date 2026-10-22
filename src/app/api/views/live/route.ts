import { NextResponse } from "next/server"
import { z } from "zod"

import { isKnownPostSlug } from "@/features/blog/data/posts"
import { getClientIp, isRateLimited } from "@/lib/rate-limit"
import { getRedis } from "@/lib/redis"

export const runtime = "nodejs"

const ACTIVE_MS = 60_000
const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60_000

const bodySchema = z.object({ id: z.string().uuid() })

// Heartbeat: each open tab posts every ~30s; readers = tabs seen in the last minute.
export async function POST(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug")
  if (!isKnownPostSlug(slug)) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 })
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const ip = getClientIp(request)
  if (await isRateLimited(`live:rate:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const redis = getRedis()
  if (!redis) return NextResponse.json({ readers: null })

  try {
    const key = `blog:live:${slug}`
    const now = Date.now()
    const [, , readers] = await redis
      .pipeline()
      .zadd(key, { score: now, member: parsed.data.id })
      .zremrangebyscore(key, 0, now - ACTIVE_MS)
      .zcard(key)
      .pexpire(key, ACTIVE_MS * 2)
      .exec<[number, number, number, number]>()
    return NextResponse.json({ readers })
  } catch (error) {
    console.error("[Live] POST error:", error)
    return NextResponse.json({ readers: null })
  }
}
