import { NextResponse } from "next/server"

import { SITE_INFO } from "@/config/site"
import {
  getAuthConfig,
  guestbookPath,
  STATE_COOKIE,
} from "@/features/guestbook/lib/session"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const locale =
    new URL(request.url).searchParams.get("locale") === "vi" ? "vi" : "en"
  const config = getAuthConfig()
  if (!config) {
    return NextResponse.redirect(new URL(guestbookPath(locale), SITE_INFO.url))
  }

  const state = crypto.randomUUID()
  const authorize = new URL("https://github.com/login/oauth/authorize")
  authorize.searchParams.set("client_id", config.clientId)
  authorize.searchParams.set(
    "redirect_uri",
    `${SITE_INFO.url}/api/guestbook/auth/callback`
  )
  authorize.searchParams.set("state", state)
  authorize.searchParams.set("allow_signup", "false")

  const response = NextResponse.redirect(authorize)
  response.cookies.set(STATE_COOKIE, `${state}.${locale}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/guestbook/auth",
    maxAge: 600,
  })
  return response
}
