import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

import { getClientIp, isRateLimited } from "@/lib/rate-limit"

export const runtime = "nodejs"

const bodySchema = z.object({ email: z.string().trim().email().max(254) })

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!apiKey || !audienceId) {
    return NextResponse.json(
      { error: "Newsletter is not configured" },
      { status: 503 }
    )
  }

  const ip = getClientIp(request)
  if (await isRateLimited(`newsletter:rate:${ip}`, 3, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const { error } = await new Resend(apiKey).contacts.create({
    audienceId,
    email: parsed.data.email,
  })
  if (error) {
    console.error("[Newsletter] Resend error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
