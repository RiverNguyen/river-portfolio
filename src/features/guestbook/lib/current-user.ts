import { cookies } from "next/headers"

import { GITHUB_USERNAME } from "@/config/site"

import { decodeSession, getAuthConfig, SESSION_COOKIE } from "./session"

export async function getCurrentUser() {
  const config = getAuthConfig()
  if (!config) return null
  const jar = await cookies()
  return decodeSession(jar.get(SESSION_COOKIE)?.value, config.secret)
}

export function isOwner(login: string | undefined) {
  return login?.toLowerCase() === GITHUB_USERNAME.toLowerCase()
}
