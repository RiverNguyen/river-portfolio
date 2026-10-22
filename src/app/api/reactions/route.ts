import { createHash } from "node:crypto"

import { NextResponse } from "next/server"
import { z } from "zod"

import { isKnownPostSlug } from "@/features/blog/data/posts"
import { getClientIp, isRateLimited } from "@/lib/rate-limit"
import { getRedis } from "@/lib/redis"

export const runtime = "nodejs"

const REACTIONS = ["like", "fire", "idea"] as const
const DEDUPE_SECONDS = 60 * 60 * 24 * 30

const postSchema = z.object({ type: z.enum(REACTIONS) })

function getSlug(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug")
  return isKnownPostSlug(slug) ? slug : null
}

async function readCounts(slug: string) {
  const redis = getRedis()
  if (!redis) return null
  const raw = await redis.hgetall<Record<string, number>>(
    `blog:reactions:${slug}`
  )
  return Object.fromEntries(REACTIONS.map((type) => [type, raw?.[type] ?? 0]))
}

export async function GET(request: Request) {
  const slug = getSlug(request)
  if (!slug) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 })
  }
  try {
    return NextResponse.json({ counts: await readCounts(slug) })
  } catch (error) {
    console.error("[Reactions] GET error:", error)
    return NextResponse.json({ counts: null })
  }
}

export async function POST(request: Request) {
  const slug = getSlug(request)
  if (!slug) {
    return NextResponse.json({ error: "Unknown post" }, { status: 404 })
  }

  const parsed = postSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reaction" }, { status: 400 })
  }

  const ip = getClientIp(request)
  if (await isRateLimited(`reactions:rate:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const redis = getRedis()
  if (!redis) return NextResponse.json({ counts: null })

  try {
    const { type } = parsed.data
    // One reaction of each type per IP per post; store a hash, not the raw IP.
    const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 32)
    const first = await redis.set(`blog:reacted:${slug}:${type}:${ipHash}`, 1, {
      nx: true,
      ex: DEDUPE_SECONDS,
    })
    if (first) await redis.hincrby(`blog:reactions:${slug}`, type, 1)
    return NextResponse.json({ counts: await readCounts(slug) })
  } catch (error) {
    console.error("[Reactions] POST error:", error)
    return NextResponse.json({ counts: null })
  }
}
