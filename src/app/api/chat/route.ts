import { z } from "zod"

import { streamGeminiReply } from "@/features/chatbot/lib/gemini"
import {
  buildLocalReply,
  extractLatestUserText,
} from "@/features/chatbot/lib/reply"
import { getRedis } from "@/lib/redis"

export const runtime = "nodejs"
export const maxDuration = 30

const MAX_MESSAGES = 24
const MAX_MESSAGE_CHARS = 2000

const bodySchema = z.object({
  messages: z.array(z.unknown()).max(MAX_MESSAGES),
  locale: z.enum(["en", "vi"]).optional(),
})

const rateBucket = new Map<string, { count: number; resetAt: number }>()

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown"
  return req.headers.get("x-real-ip") || "unknown"
}

const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 20

// Shared across serverless instances when Upstash is configured; per-instance memory otherwise.
async function isRateLimited(ip: string) {
  const redis = getRedis()
  if (redis) {
    try {
      const key = `chat:rate:${ip}`
      const count = await redis.incr(key)
      if (count === 1) await redis.pexpire(key, RATE_WINDOW_MS)
      return count > RATE_LIMIT
    } catch (err) {
      console.error("[chat] Redis rate limit failed", err)
    }
  }
  return isRateLimitedInMemory(ip)
}

function isRateLimitedInMemory(ip: string) {
  const now = Date.now()
  const windowMs = RATE_WINDOW_MS
  const limit = RATE_LIMIT
  const current = rateBucket.get(ip)

  if (!current || current.resetAt <= now) {
    rateBucket.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }

  if (current.count >= limit) return true
  current.count += 1
  return false
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function chunkReply(text: string): string[] {
  const parts = text.match(/\S+\s*/g)
  if (!parts?.length) return [text]
  return parts
}

export async function POST(req: Request) {
  const ip = getClientIp(req)
  if (await isRateLimited(ip)) {
    return Response.json(
      { error: "Too many messages. Please wait a minute." },
      { status: 429 }
    )
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return Response.json({ error: "Invalid chat payload." }, { status: 400 })
  }

  const messages = parsed.data.messages as Array<{
    role?: string
    parts?: Array<{ type?: string; text?: string }>
    content?: string
  }>
  const userText = extractLatestUserText(messages).slice(0, MAX_MESSAGE_CHARS)

  if (!userText) {
    return Response.json({ error: "Empty message." }, { status: 400 })
  }

  const turns = messages.flatMap((message) => {
    if (message?.role !== "user" && message?.role !== "assistant") return []
    const text = (
      typeof message.content === "string"
        ? message.content
        : (message.parts ?? [])
            .filter((part) => part.type === "text" && part.text)
            .map((part) => part.text)
            .join("")
    )
      .trim()
      .slice(0, MAX_MESSAGE_CHARS)
    return text ? [{ role: message.role as "user" | "assistant", text }] : []
  })

  const geminiStream = await streamGeminiReply(turns, parsed.data.locale)
  if (geminiStream) {
    return new Response(geminiStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-River-Chat": "gemini",
      },
    })
  }

  const { reply } = buildLocalReply(userText, parsed.data.locale)
  const encoder = new TextEncoder()
  const chunks = chunkReply(reply)

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk))
          await sleep(10)
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-River-Chat": "local",
    },
  })
}
