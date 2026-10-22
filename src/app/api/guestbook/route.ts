import { NextResponse } from "next/server"
import { z } from "zod"

import { getCurrentUser, isOwner } from "@/features/guestbook/lib/current-user"
import { addEntry, deleteEntry } from "@/features/guestbook/lib/store"
import { isRateLimited } from "@/lib/rate-limit"

export const runtime = "nodejs"

const postSchema = z.object({ message: z.string().trim().min(1).max(280) })
const deleteSchema = z.object({ id: z.string().uuid() })

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 })
  }

  if (await isRateLimited(`guestbook:rate:${user.login}`, 3, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 }
    )
  }

  const parsed = postSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 })
  }

  try {
    await addEntry({
      ...user,
      id: crypto.randomUUID(),
      message: parsed.data.message,
      createdAt: new Date().toISOString(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Guestbook] POST error:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}

// Owner-only moderation.
export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!isOwner(user?.login)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const parsed = deleteSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const deleted = await deleteEntry(parsed.data.id)
  return NextResponse.json(
    { success: deleted },
    { status: deleted ? 200 : 404 }
  )
}
