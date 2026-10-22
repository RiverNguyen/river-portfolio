import { createHmac, timingSafeEqual } from "node:crypto"

export const SESSION_COOKIE = "rv_gb_session"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30
export const STATE_COOKIE = "rv_gb_state"

export function guestbookPath(locale: string) {
  return locale === "vi" ? "/vi/guestbook" : "/guestbook"
}

export type GuestbookUser = {
  login: string
  name: string
  avatar: string
}

type Payload = GuestbookUser & { exp: number }

function sign(data: string, secret: string) {
  return createHmac("sha256", secret).update(data).digest("base64url")
}

/** `<base64url json>.<hmac>`; the GitHub token itself is never stored. */
export function encodeSession(
  user: GuestbookUser,
  secret: string,
  now = Date.now()
) {
  const payload: Payload = { ...user, exp: now + SESSION_MAX_AGE * 1000 }
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url")
  return `${data}.${sign(data, secret)}`
}

export function decodeSession(
  value: string | undefined,
  secret: string,
  now = Date.now()
): GuestbookUser | null {
  const [data, mac] = value?.split(".") ?? []
  if (!data || !mac) return null

  const expected = Buffer.from(sign(data, secret))
  const given = Buffer.from(mac)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return null
  }

  try {
    const { exp, login, name, avatar } = JSON.parse(
      Buffer.from(data, "base64url").toString()
    ) as Payload
    return exp > now ? { login, name, avatar } : null
  } catch {
    return null
  }
}

/** GitHub OAuth app + signing secret, or null when the guestbook isn't configured. */
export function getAuthConfig() {
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  const secret = process.env.AUTH_SECRET
  return clientId && clientSecret && secret
    ? { clientId, clientSecret, secret }
    : null
}
