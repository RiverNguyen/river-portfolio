import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

import {
  getInsights,
  recordSessionDuration,
  recordVisit,
} from "@/features/visitors/lib/store"

export const runtime = "nodejs"

const VISITOR_COOKIE = "rv_vid"
const SESSION_COOKIE = "rv_vsid"
const ONE_YEAR = 60 * 60 * 24 * 365

const durationSchema = z.object({
  durationMs: z.number().min(1000).max(60 * 60 * 1000),
})

export async function GET() {
  try {
    const insights = await getInsights(30)
    return NextResponse.json(insights)
  } catch (error) {
    console.error("[Visitors] GET error:", error)
    return NextResponse.json(
      { error: "Failed to load visitor insights" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? ""
    let durationMs: number | null = null

    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => null)
      const parsed = durationSchema.safeParse(body)
      if (parsed.success) {
        durationMs = parsed.data.durationMs
      }
    }

    if (durationMs != null) {
      await recordSessionDuration(durationMs)
      const insights = await getInsights(30)
      return NextResponse.json(insights)
    }

    const jar = await cookies()
    const visitorId = jar.get(VISITOR_COOKIE)?.value
    const sessionId = jar.get(SESSION_COOKIE)?.value

    const isNewVisitor = !visitorId
    const isNewSession = !sessionId

    await recordVisit({ isNewVisitor, isNewSession })
    const insights = await getInsights(30)
    const response = NextResponse.json(insights)

    if (isNewVisitor) {
      response.cookies.set(VISITOR_COOKIE, crypto.randomUUID(), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: ONE_YEAR,
      })
    }

    if (isNewSession) {
      response.cookies.set(SESSION_COOKIE, crypto.randomUUID(), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      })
    }

    return response
  } catch (error) {
    console.error("[Visitors] POST error:", error)
    return NextResponse.json(
      { error: "Failed to record visit" },
      { status: 500 }
    )
  }
}
