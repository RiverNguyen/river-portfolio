import { openai } from "@ai-sdk/openai"
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"
import { z } from "zod"

import { buildChatSystemPrompt } from "@/features/chatbot/lib/system-prompt"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_MESSAGES = 24
const MAX_MESSAGE_CHARS = 2000

const bodySchema = z.object({
  messages: z.array(z.unknown()).max(MAX_MESSAGES),
})

const rateBucket = new Map<string, { count: number; resetAt: number }>()

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown"
  return req.headers.get("x-real-ip") || "unknown"
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const windowMs = 60_000
  const limit = 20
  const current = rateBucket.get(ip)

  if (!current || current.resetAt <= now) {
    rateBucket.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }

  if (current.count >= limit) return true
  current.count += 1
  return false
}

function truncateMessages(messages: UIMessage[]): UIMessage[] {
  return messages.slice(-MAX_MESSAGES).map((message) => {
    if (!Array.isArray(message.parts)) return message

    return {
      ...message,
      parts: message.parts.map((part) => {
        if (part.type !== "text") return part
        if (part.text.length <= MAX_MESSAGE_CHARS) return part
        return { ...part, text: part.text.slice(0, MAX_MESSAGE_CHARS) }
      }),
    }
  })
}

function getChatModel() {
  if (!process.env.OPENAI_API_KEY) return null
  return openai(process.env.AI_CHAT_MODEL || "gpt-4o-mini")
}

export async function POST(req: Request) {
  const model = getChatModel()
  if (!model) {
    return Response.json(
      { error: "Chat is not configured. Missing OPENAI_API_KEY." },
      { status: 503 }
    )
  }

  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
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

  const messages = truncateMessages(parsed.data.messages as UIMessage[])

  try {
    const result = streamText({
      model,
      system: buildChatSystemPrompt(),
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 1024,
    })

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        onError: (error) => {
          console.error("[chat stream]", error)
          return error instanceof Error
            ? error.message
            : "Failed to generate a reply."
        },
      }),
    })
  } catch (error) {
    console.error("[chat]", error)
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate a reply. Try again shortly."
    return Response.json({ error: message }, { status: 500 })
  }
}
