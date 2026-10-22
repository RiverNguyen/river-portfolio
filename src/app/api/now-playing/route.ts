import { NextResponse } from "next/server"

export const runtime = "nodejs"

type NowPlaying = {
  title: string
  artist: string
  url: string
  image?: string
} | null

type LastfmTrack = {
  name: string
  url: string
  artist: { "#text": string }
  image?: { size: string; "#text": string }[]
  "@attr"?: { nowplaying?: string }
}

const CACHE_MS = 30_000
// Last.fm's grey star shown when a track has no artwork.
const PLACEHOLDER_IMAGE = "2a96cbd8b46e442fc41c2b86b821562f"

// shortcut: per-instance cache, fine for one owner's feed; move to Redis if instances multiply.
let cached: { at: number; data: NowPlaying } | null = null

async function fetchNowPlaying(): Promise<NowPlaying> {
  const apiKey = process.env.LASTFM_API_KEY
  const user = process.env.LASTFM_USERNAME
  if (!apiKey || !user) return null

  const url = new URL("https://ws.audioscrobbler.com/2.0/")
  url.search = new URLSearchParams({
    method: "user.getrecenttracks",
    user,
    api_key: apiKey,
    format: "json",
    limit: "1",
  }).toString()

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Last.fm ${res.status}`)
  const data = (await res.json()) as {
    recenttracks?: { track?: LastfmTrack | LastfmTrack[] }
  }

  // Returns an array, or a lone object for a single track.
  const tracks = [data.recenttracks?.track ?? []].flat()
  const track = tracks.find((item) => item["@attr"]?.nowplaying === "true")
  if (!track) return null

  const image = track.image?.find((item) => item.size === "medium")?.["#text"]
  return {
    title: track.name,
    artist: track.artist["#text"],
    url: track.url,
    image: image && !image.includes(PLACEHOLDER_IMAGE) ? image : undefined,
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
