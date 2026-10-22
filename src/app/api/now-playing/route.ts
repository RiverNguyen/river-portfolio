import { NextResponse } from "next/server"

export const runtime = "nodejs"

type NowPlaying = {
  title: string
  artist: string
  url: string
  image?: string
} | null

const CACHE_MS = 30_000

// shortcut: per-instance cache, fine for one owner polling Spotify; move to Redis if instances multiply.
let cached: { at: number; data: NowPlaying } | null = null
let accessToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(id: string, secret: string, refresh: string) {
  if (accessToken && accessToken.expiresAt > Date.now())
    return accessToken.value

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
  })
  if (!res.ok) throw new Error(`Spotify token ${res.status}`)
  const data = (await res.json()) as {
    access_token: string
    expires_in: number
  }
  accessToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }
  return accessToken.value
}

async function fetchNowPlaying(): Promise<NowPlaying> {
  const id = process.env.SPOTIFY_CLIENT_ID
  const secret = process.env.SPOTIFY_CLIENT_SECRET
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN
  if (!id || !secret || !refresh) return null

  const token = await getAccessToken(id, secret, refresh)
  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    { headers: { Authorization: `Bearer ${token}` } }
  )
  // 204 = nothing playing.
  if (res.status !== 200) return null

  const data = (await res.json()) as {
    is_playing: boolean
    currently_playing_type: string
    item?: {
      name: string
      artists: { name: string }[]
      external_urls: { spotify: string }
      album: { images: { url: string }[] }
    }
  }
  if (
    !data.is_playing ||
    data.currently_playing_type !== "track" ||
    !data.item
  ) {
    return null
  }

  return {
    title: data.item.name,
    artist: data.item.artists.map((artist) => artist.name).join(", "),
    url: data.item.external_urls.spotify,
    image: data.item.album.images.at(-1)?.url,
  }
}

export async function GET() {
  if (!cached || Date.now() - cached.at > CACHE_MS) {
    try {
      cached = { at: Date.now(), data: await fetchNowPlaying() }
    } catch (error) {
      console.error("[NowPlaying] error:", error)
      cached = { at: Date.now(), data: null }
    }
  }
  return NextResponse.json(cached.data, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30",
    },
  })
}
