import { z } from "zod"

import { streamGeminiReply } from "@/features/chatbot/lib/gemini"
import {
  buildLocalReply,
  extractLatestUserText,
} from "@/features/chatbot/lib/reply"
import { getClientIp, isRateLimited } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const maxDuration = 30

const MAX_MESSAGES = 24
const MAX_MESSAGE_CHARS = 2000

const bodySchema = z.object({
  messages: z.array(z.unknown()).max(MAX_MESSAGES),
  locale: z.enum(["en", "vi"]).optional(),
})

const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 20

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
  if (await isRateLimited(`chat:rate:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
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
