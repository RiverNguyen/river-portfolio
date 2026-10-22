import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { SITE_INFO } from "@/config/site"
import {
  encodeSession,
  getAuthConfig,
  guestbookPath,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  STATE_COOKIE,
} from "@/features/guestbook/lib/session"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const jar = await cookies()
  const [expectedState, locale = "en"] =
    jar.get(STATE_COOKIE)?.value.split(".") ?? []
  const redirectTo = (error?: string) => {
    const url = new URL(guestbookPath(locale), SITE_INFO.url)
    if (error) url.searchParams.set("error", error)
    const response = NextResponse.redirect(url)
    response.cookies.delete({ name: STATE_COOKIE, path: "/api/guestbook/auth" })
    return response
  }

  const config = getAuthConfig()
  const code = params.get("code")
  if (
    !config ||
    !code ||
    !expectedState ||
    params.get("state") !== expectedState
  ) {
    return redirectTo("auth")
  }

  try {
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code,
          redirect_uri: `${SITE_INFO.url}/api/guestbook/auth/callback`,
        }),
      }
    )
    const { access_token } = (await tokenRes.json()) as {
      access_token?: string
    }
    if (!access_token) return redirectTo("auth")

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/vnd.github+json",
      },
    })
    if (!userRes.ok) return redirectTo("auth")
    const user = (await userRes.json()) as {
      login: string
      name: string | null
      avatar_url: string
    }

    const response = redirectTo()
    response.cookies.set(
      SESSION_COOKIE,
      encodeSession(
        {
          login: user.login,
          name: user.name || user.login,
          avatar: user.avatar_url,
        },
        config.secret
      ),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      }
    )
    return response
  } catch (error) {
    console.error("[Guestbook] OAuth error:", error)
    return redirectTo("auth")
  }
}
